import { ensureTables, sql } from './db'
import type { Exercise } from '@/types/exercise'

export async function listExercises(userId: string): Promise<Exercise[]> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM exercises WHERE user_id = ${userId} OR user_id IS NULL ORDER BY updated_at DESC`
  return rows.map((r) => r.data as Exercise)
}

export async function getExercise(id: string): Promise<Exercise | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM exercises WHERE id = ${id}`
  if (rows.length === 0) return null
  return rows[0].data as Exercise
}

export async function getExerciseOwnerId(id: string): Promise<string | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT user_id FROM exercises WHERE id = ${id}`
  return rows.length > 0 ? rows[0].user_id : null
}

export async function saveExercise(exercise: Exercise, userId: string | null): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`
    INSERT INTO exercises (id, data, user_id, updated_at)
    VALUES (${exercise.id}, ${JSON.stringify(exercise)}, ${userId}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(exercise)}, updated_at = NOW()
  `
}

export async function saveExerciseMarkdown(id: string, markdown: string): Promise<void> {
  const exercise = await getExercise(id)
  if (!exercise) return
  exercise.generatedMarkdown = markdown
  // Preserve existing ownership — fetch current owner
  const ownerId = await getExerciseOwnerId(id)
  await saveExercise(exercise, ownerId)
}

export async function deleteExercise(id: string, userId: string): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`DELETE FROM exercises WHERE id = ${id} AND user_id = ${userId}`
}
