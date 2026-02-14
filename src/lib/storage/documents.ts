import { promises as fs } from 'fs'
import path from 'path'
import type { UploadedDocument } from '@/types/document'
import { getUploadsDir } from './exercises'

export async function saveUploadedFile(
  exerciseId: string,
  docId: string,
  buffer: Buffer,
  filename: string
): Promise<string> {
  const dir = getUploadsDir(exerciseId)
  await fs.mkdir(dir, { recursive: true })
  const ext = path.extname(filename)
  const filepath = path.join(dir, `${docId}${ext}`)
  await fs.writeFile(filepath, buffer)
  return filepath
}

export async function getUploadedFilePath(
  exerciseId: string,
  docId: string,
  filename: string
): Promise<string> {
  const dir = getUploadsDir(exerciseId)
  const ext = path.extname(filename)
  return path.join(dir, `${docId}${ext}`)
}

export async function deleteUploadedFile(
  exerciseId: string,
  doc: UploadedDocument
): Promise<void> {
  const ext = path.extname(doc.filename)
  const filepath = path.join(getUploadsDir(exerciseId), `${doc.id}${ext}`)
  await fs.rm(filepath, { force: true })
}
