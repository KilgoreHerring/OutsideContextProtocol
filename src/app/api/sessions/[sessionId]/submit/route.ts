import { NextResponse } from 'next/server'
import { getSession, getSessionOwnerId, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { gradeSubmission } from '@/lib/ai/grader'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const userId = authResult

  const { sessionId } = await params
  const session = await getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const ownerId = await getSessionOwnerId(sessionId)
  if (ownerId !== null && ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const exercise = await getExercise(session.exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
  }

  const body = await request.json()
  const { stepId, submission } = body

  const stepIndex = exercise.steps.findIndex((s) => s.id === stepId)
  if (stepIndex === -1) {
    return NextResponse.json({ error: 'Step not found' }, { status: 404 })
  }

  const step = exercise.steps[stepIndex]
  const stepResult = session.stepResults.find((r) => r.stepId === stepId)
  if (!stepResult) {
    return NextResponse.json({ error: 'Step result not found' }, { status: 404 })
  }

  // For read-only steps, just mark as complete
  if (step.type === 'read') {
    stepResult.submission = submission || '[Acknowledged]'
    stepResult.grade = {
      score: step.maxScore,
      maxScore: step.maxScore,
      feedback: 'Read step completed.',
      strengths: [],
      improvements: [],
      criticalIssues: [],
    }
    stepResult.submittedAt = new Date().toISOString()
  } else {
    if (!submission || submission.trim().length === 0) {
      return NextResponse.json(
        { error: 'Submission cannot be empty' },
        { status: 400 }
      )
    }

    if (!exercise.rubric) {
      return NextResponse.json(
        { error: 'Exercise rubric not found — cannot grade' },
        { status: 500 }
      )
    }

    try {
      const gradeResult = await gradeSubmission(step, exercise.rubric, submission)

      stepResult.submission = submission
      stepResult.grade = {
        score: gradeResult.score,
        maxScore: step.maxScore,
        feedback: gradeResult.feedback,
        strengths: gradeResult.strengths,
        improvements: gradeResult.improvements,
        criticalIssues: gradeResult.criticalIssues,
      }
      stepResult.submittedAt = new Date().toISOString()
    } catch (e: any) {
      console.error('Grading failed:', e)
      return NextResponse.json(
        { error: `Grading failed: ${e.message || 'Unknown error'}` },
        { status: 500 }
      )
    }
  }

  // Advance to next step
  if (session.currentStepIndex === stepIndex) {
    session.currentStepIndex = Math.min(
      stepIndex + 1,
      exercise.steps.length - 1
    )
  }

  session.lastActivityAt = new Date().toISOString()
  await saveSession(session, userId)

  return NextResponse.json({
    stepResult,
    isLastStep: stepIndex === exercise.steps.length - 1,
  })
}
