import { neon } from '@neondatabase/serverless'

let initialized = false

function getSQL() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!url) throw new Error('POSTGRES_URL or DATABASE_URL environment variable is required')
  return neon(url)
}

export async function ensureTables() {
  if (initialized) return
  const sql = getSQL()
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
  } catch (err: unknown) {
    const code = err instanceof Error && 'code' in err ? (err as { code: string }).code : ''
    if (code !== '23505' && code !== '42P07') throw err
  }
  initialized = true
}

export { getSQL as sql }
