import { NextResponse } from 'next/server'
import { listExercises } from '@/lib/storage/exercises'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params

  // Search across all exercises for this document
  const exercises = await listExercises()
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
