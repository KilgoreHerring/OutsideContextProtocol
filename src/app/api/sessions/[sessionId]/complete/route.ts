import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { calculateFinalScore } from '@/lib/scoring/calculator'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const session = await getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const exercise = await getExercise(session.exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
  }

  const finalScore = await calculateFinalScore(session, exercise)

  session.finalScore = finalScore
  session.status = 'completed'
  session.completedAt = new Date().toISOString()
  session.lastActivityAt = new Date().toISOString()
  await saveSession(session)

  return NextResponse.json({ finalScore })
}
