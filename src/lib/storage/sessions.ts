import { promises as fs } from 'fs'
import path from 'path'
import type { Session } from '@/types/session'

const DATA_DIR = path.join(process.cwd(), 'data', 'sessions')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function listSessions(): Promise<Session[]> {
  await ensureDir(DATA_DIR)
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true })
  const sessions: Session[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    try {
      const data = await fs.readFile(
        path.join(DATA_DIR, entry.name, 'session.json'),
        'utf-8'
      )
      sessions.push(JSON.parse(data))
    } catch {
      // skip malformed entries
    }
  }

  return sessions.sort(
    (a, b) =>
      new Date(b.lastActivityAt).getTime() -
      new Date(a.lastActivityAt).getTime()
  )
}

export async function getSession(id: string): Promise<Session | null> {
  try {
    const data = await fs.readFile(
      path.join(DATA_DIR, id, 'session.json'),
      'utf-8'
    )
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function saveSession(session: Session): Promise<void> {
  const dir = path.join(DATA_DIR, session.id)
  await ensureDir(dir)
  await fs.writeFile(
    path.join(dir, 'session.json'),
    JSON.stringify(session, null, 2)
  )
}

export async function deleteSession(id: string): Promise<void> {
  const dir = path.join(DATA_DIR, id)
  await fs.rm(dir, { recursive: true, force: true })
}
