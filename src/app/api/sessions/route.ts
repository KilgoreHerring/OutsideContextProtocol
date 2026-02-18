import { NextResponse } from 'next/server'
import { listSessions, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { seedDefaultExercise } from '@/lib/seed'
import { requireAuth } from '@/lib/auth-helpers'
import type { Session } from '@/types/session'

export async function GET() {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  await seedDefaultExercise()
  const sessions = await listSessions(userId)
  return NextResponse.json(sessions)
}

export async function POST(request: Request) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const body = await request.json()
  const { exerciseId, traineeName } = body

  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
  }
  if (exercise.status !== 'ready') {
    return NextResponse.json(
      { error: 'Exercise is not ready' },
      { status: 400 }
    )
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  const session: Session = {
    id,
    exerciseId,
    traineeName: traineeName || 'Trainee',
    currentStepIndex: 0,
    status: 'in-progress',
    stepResults: exercise.steps.map((step) => ({
      stepId: step.id,
      submission: null,
      grade: null,
      submittedAt: null,
    })),
    chatHistory: [],
    questionScores: [],
    finalScore: null,
    startedAt: now,
    lastActivityAt: now,
    completedAt: null,
  }

  await saveSession(session, userId)
  return NextResponse.json(session, { status: 201 })
}
