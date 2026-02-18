import { NextResponse } from 'next/server'
import { listExercises, saveExercise } from '@/lib/storage/exercises'
import { seedDefaultExercise } from '@/lib/seed'
import { requireAuth } from '@/lib/auth-helpers'
import type { Exercise } from '@/types/exercise'

export async function GET() {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  await seedDefaultExercise()
  const exercises = await listExercises(userId)
  return NextResponse.json(exercises)
}

export async function POST(request: Request) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const body = await request.json()
  const { title, description, matterType, difficulty, estimatedDurationMinutes } =
    body

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  const exercise: Exercise = {
    id,
    title,
    description: description || '',
    matterType,
    difficulty: difficulty || 'junior',
    estimatedDurationMinutes: estimatedDurationMinutes || 480,
    documents: [],
    steps: [],
    rubric: {
      exerciseId: id,
      overallApproach: '',
      keyIssues: [],
      criticalErrors: [],
      qualityMarkers: [],
      questionRelevanceGuidance: '',
    },
    generatedMarkdown: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }

  await saveExercise(exercise, userId)
  return NextResponse.json(exercise, { status: 201 })
}
