import { NextResponse } from 'next/server'
import { getSession, getSessionOwnerId, saveSession } from '@/lib/storage/sessions'
import { getExercise } from '@/lib/storage/exercises'
import { calculateFinalScore } from '@/lib/scoring/calculator'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(
  _request: Request,
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

  const finalScore = await calculateFinalScore(session, exercise)

  session.finalScore = finalScore
  session.status = 'completed'
  session.completedAt = new Date().toISOString()
  session.lastActivityAt = new Date().toISOString()
  await saveSession(session, userId)

  return NextResponse.json({ finalScore })
}
