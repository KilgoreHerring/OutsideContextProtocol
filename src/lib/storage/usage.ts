import { ensureTables, sql } from './db'

const DAILY_LIMIT_PER_USER = 25

export async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT count FROM usage WHERE user_id = ${userId} AND day = CURRENT_DATE`
  const count = rows.length > 0 ? Number(rows[0].count) : 0
  const remaining = Math.max(0, DAILY_LIMIT_PER_USER - count)
  return { allowed: remaining > 0, remaining }
}

export async function recordUsage(userId: string, calls: number = 1): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`
    INSERT INTO usage (user_id, day, count)
    VALUES (${userId}, CURRENT_DATE, ${calls})
    ON CONFLICT (user_id, day) DO UPDATE SET count = usage.count + ${calls}
  `
}
