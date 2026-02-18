import { NextResponse } from 'next/server'
import {
  getExercise,
  getExerciseOwnerId,
  saveExercise,
  saveExerciseMarkdown,
} from '@/lib/storage/exercises'
import { generateExercise } from '@/lib/ai/exercise-generator'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const userId = authResult

  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ownerId = await getExerciseOwnerId(exerciseId)
  if (ownerId !== null && ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (exercise.documents.length === 0) {
    return NextResponse.json(
      { error: 'Upload at least one document before generating' },
      { status: 400 }
    )
  }

  exercise.status = 'generating'
  exercise.updatedAt = new Date().toISOString()
  await saveExercise(exercise, ownerId)

  try {
    const result = await generateExercise(
      exercise.title,
      exercise.matterType,
      exercise.estimatedDurationMinutes,
      exercise.documents
    )

    exercise.steps = result.steps
    exercise.rubric = { ...result.rubric, exerciseId }
    exercise.generatedMarkdown = result.narrative
    exercise.status = 'ready'
    exercise.updatedAt = new Date().toISOString()

    await saveExercise(exercise, ownerId)
    await saveExerciseMarkdown(exerciseId, result.narrative)

    return NextResponse.json(exercise)
  } catch (err) {
    exercise.status = 'draft'
    exercise.updatedAt = new Date().toISOString()
    await saveExercise(exercise, ownerId)

    return NextResponse.json(
      {
        error: `Generation failed: ${err instanceof Error ? err.message : 'unknown error'}`,
      },
      { status: 500 }
    )
  }
}
