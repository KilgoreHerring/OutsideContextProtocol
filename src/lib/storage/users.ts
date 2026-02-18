import { ensureTables, sql } from './db'

export interface User {
  id: string
  email: string
  name: string
  image: string | null
}

export async function getUser(id: string): Promise<User | null> {
  await ensureTables()
  const db = sql()
  const rows = await db`SELECT * FROM users WHERE id = ${id}`
  if (rows.length === 0) return null
  return rows[0] as User
}

export async function upsertUser(user: User): Promise<void> {
  await ensureTables()
  const db = sql()
  await db`
    INSERT INTO users (id, email, name, image)
    VALUES (${user.id}, ${user.email}, ${user.name}, ${user.image})
    ON CONFLICT (id) DO UPDATE SET email = ${user.email}, name = ${user.name}, image = ${user.image}
  `
}
