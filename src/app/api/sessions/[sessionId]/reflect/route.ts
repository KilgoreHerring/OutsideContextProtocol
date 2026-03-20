import { NextResponse } from 'next/server'
import { getSession, getSessionOwnerId, saveSession } from '@/lib/storage/sessions'
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

  if (session.status !== 'completed') {
    return NextResponse.json({ error: 'Session must be completed before adding a reflection' }, { status: 400 })
  }

  const body = await request.json()
  const { content } = body

  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Reflection content is required' }, { status: 400 })
  }

  session.reflection = {
    content: content.trim(),
    submittedAt: new Date().toISOString(),
  }
  session.lastActivityAt = new Date().toISOString()
  await saveSession(session, userId)

  return NextResponse.json({ reflection: session.reflection })
}
