import { NextResponse } from 'next/server'
import { listExercises } from '@/lib/storage/exercises'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const { docId } = await params

  // Search across user's exercises (including system templates) for this document
  const exercises = await listExercises(userId)
  for (const exercise of exercises) {
    const doc = exercise.documents.find((d) => d.id === docId)
    if (doc) {
      return NextResponse.json({
        id: doc.id,
        filename: doc.filename,
        label: doc.label,
        role: doc.role,
        extractedText: doc.extractedText,
      })
    }
  }

  return NextResponse.json({ error: 'Document not found' }, { status: 404 })
}
