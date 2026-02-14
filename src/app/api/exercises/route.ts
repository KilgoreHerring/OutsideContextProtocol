import { NextResponse } from 'next/server'
import { listExercises, saveExercise } from '@/lib/storage/exercises'
import { seedDefaultExercise } from '@/lib/seed'
import type { Exercise } from '@/types/exercise'

export async function GET() {
  await seedDefaultExercise()
  const exercises = await listExercises()
  return NextResponse.json(exercises)
}

export async function POST(request: Request) {
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

  await saveExercise(exercise)
  return NextResponse.json(exercise, { status: 201 })
}
