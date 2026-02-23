/**
 * Simple in-memory rate limiter for beta period.
 * Limits API calls per user per day to prevent runaway costs.
 */

const DAILY_LIMIT_PER_USER = 25

interface UsageRecord {
  count: number
  resetAt: number // timestamp
}

const usage = new Map<string, UsageRecord>()

function getToday(): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime() + 24 * 60 * 60 * 1000 // midnight tonight
}

function getRecord(userId: string): UsageRecord {
  const existing = usage.get(userId)
  const resetAt = getToday()

  if (existing && existing.resetAt === resetAt) {
    return existing
  }

  const record: UsageRecord = { count: 0, resetAt }
  usage.set(userId, record)
  return record
}

export function checkUsageLimit(userId: string): { allowed: boolean; remaining: number } {
  const record = getRecord(userId)
  const remaining = Math.max(0, DAILY_LIMIT_PER_USER - record.count)
  return { allowed: remaining > 0, remaining }
}

export function recordUsage(userId: string, calls: number = 1): void {
  const record = getRecord(userId)
  record.count += calls
}
