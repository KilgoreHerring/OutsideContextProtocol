import { NextResponse } from 'next/server'
import { getExercise, getExerciseOwnerId, saveExercise } from '@/lib/storage/exercises'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ownerId = await getExerciseOwnerId(exerciseId)
  if (ownerId !== null && ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  if (url.searchParams.get('role') === 'trainee') {
    return NextResponse.json({
      ...exercise,
      rubric: null,
      documents: exercise.documents.filter(
        (d) => d.role !== 'ideal-output' && d.role !== 'feedback'
      ),
      steps: exercise.steps.map((s) => ({
        ...s,
        idealOutput: null,
        gradingCriteria: [],
      })),
    })
  }

  return NextResponse.json(exercise)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const userId = result

  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ownerId = await getExerciseOwnerId(exerciseId)
  if (ownerId === null) {
    return NextResponse.json({ error: 'Cannot modify template exercises' }, { status: 403 })
  }
  if (ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updates = await request.json()
  const updated = {
    ...exercise,
    ...updates,
    id: exerciseId,
    updatedAt: new Date().toISOString(),
  }

  await saveExercise(updated, userId)
  return NextResponse.json(updated)
}
