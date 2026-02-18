import { ensureTables, sql } from './db'
import type { Session } from '@/types/session'

export async function listSessions(userId: string): Promise<Session[]> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM sessions WHERE user_id = ${userId} ORDER BY updated_at DESC`
  return rows.map((r) => r.data as Session)
}

export async function getSession(id: string): Promise<Session | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT data FROM sessions WHERE id = ${id}`
  if (rows.length === 0) return null
  return rows[0].data as Session
}

export async function getSessionOwnerId(id: string): Promise<string | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT user_id FROM sessions WHERE id = ${id}`
  return rows.length > 0 ? rows[0].user_id : null
}

export async function saveSession(session: Session, userId: string): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`
    INSERT INTO sessions (id, exercise_id, user_id, data, updated_at)
    VALUES (${session.id}, ${session.exerciseId}, ${userId}, ${JSON.stringify(session)}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(session)}, updated_at = NOW()
  `
}

export async function deleteSession(id: string): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`DELETE FROM sessions WHERE id = ${id}`
}
