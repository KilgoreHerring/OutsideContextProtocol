import { NextResponse } from 'next/server'
import { listSessions, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { seedDefaultExercise } from '@/lib/seed'
import type { Session } from '@/types/session'

export async function GET() {
  await seedDefaultExercise()
  const sessions = await listSessions()
  return NextResponse.json(sessions)
}

export async function POST(request: Request) {
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

  await saveSession(session)
  return NextResponse.json(session, { status: 201 })
}
