import { ensureTables, sql } from './db'
import type { Exercise } from '@/types/exercise'

export async function listExercises(): Promise<Exercise[]> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM exercises ORDER BY updated_at DESC`
  return rows.map((r) => r.data as Exercise)
}

export async function getExercise(id: string): Promise<Exercise | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM exercises WHERE id = ${id}`
  if (rows.length === 0) return null
  return rows[0].data as Exercise
}

export async function saveExercise(exercise: Exercise): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`
    INSERT INTO exercises (id, data, updated_at)
    VALUES (${exercise.id}, ${JSON.stringify(exercise)}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(exercise)}, updated_at = NOW()
  `
}

export async function saveExerciseMarkdown(id: string, markdown: string): Promise<void> {
  const exercise = await getExercise(id)
  if (!exercise) return
  exercise.generatedMarkdown = markdown
  await saveExercise(exercise)
}

export async function deleteExercise(id: string): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`DELETE FROM exercises WHERE id = ${id}`
}
