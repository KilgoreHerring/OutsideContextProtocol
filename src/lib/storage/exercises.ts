import { promises as fs } from 'fs'
import path from 'path'
import type { Exercise } from '@/types/exercise'

const DATA_DIR = path.join(process.cwd(), 'data', 'exercises')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function listExercises(): Promise<Exercise[]> {
  await ensureDir(DATA_DIR)
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true })
  const exercises: Exercise[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    try {
      const data = await fs.readFile(
        path.join(DATA_DIR, entry.name, 'exercise.json'),
        'utf-8'
      )
      exercises.push(JSON.parse(data))
    } catch {
      // skip malformed entries
    }
  }

  return exercises.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export async function getExercise(id: string): Promise<Exercise | null> {
  try {
    const data = await fs.readFile(
      path.join(DATA_DIR, id, 'exercise.json'),
      'utf-8'
    )
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function saveExercise(exercise: Exercise): Promise<void> {
  const dir = path.join(DATA_DIR, exercise.id)
  await ensureDir(dir)
  await fs.writeFile(
    path.join(dir, 'exercise.json'),
    JSON.stringify(exercise, null, 2)
  )
}

export async function saveExerciseMarkdown(
  id: string,
  markdown: string
): Promise<void> {
  const dir = path.join(DATA_DIR, id)
  await ensureDir(dir)
  await fs.writeFile(path.join(dir, 'exercise.md'), markdown)
}

export async function deleteExercise(id: string): Promise<void> {
  const dir = path.join(DATA_DIR, id)
  await fs.rm(dir, { recursive: true, force: true })
}

export function getUploadsDir(exerciseId: string): string {
  return path.join(DATA_DIR, exerciseId, 'uploads')
}
