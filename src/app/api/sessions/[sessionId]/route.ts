import { NextResponse } from 'next/server'
import { getSession, getSessionOwnerId } from '@/lib/storage/sessions'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const { sessionId } = await params
  const session = await getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ownerId = await getSessionOwnerId(sessionId)
  if (ownerId !== null && ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(session)
}
