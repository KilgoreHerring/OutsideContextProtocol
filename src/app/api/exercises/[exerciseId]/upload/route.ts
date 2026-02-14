import { NextResponse } from 'next/server'
import { getExercise, saveExercise } from '@/lib/storage/exercises'
import { saveUploadedFile } from '@/lib/storage/documents'
import { extractText, getMimeType } from '@/lib/documents/parser'
import type { UploadedDocument, DocumentRole } from '@/types/document'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const role = (formData.get('role') as DocumentRole) || 'reference'
  const label = (formData.get('label') as string) || ''

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = getMimeType(file.name)
  const docId = crypto.randomUUID()

  let extractedText: string
  try {
    extractedText = await extractText(buffer, mimeType)
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to parse file: ${err instanceof Error ? err.message : 'unknown error'}` },
      { status: 400 }
    )
  }

  await saveUploadedFile(exerciseId, docId, buffer, file.name)

  const doc: UploadedDocument = {
    id: docId,
    exerciseId,
    filename: file.name,
    mimeType,
    role,
    label: label || file.name,
    extractedText,
    uploadedAt: new Date().toISOString(),
  }

  exercise.documents.push(doc)
  exercise.updatedAt = new Date().toISOString()
  await saveExercise(exercise)

  return NextResponse.json(doc, { status: 201 })
}
