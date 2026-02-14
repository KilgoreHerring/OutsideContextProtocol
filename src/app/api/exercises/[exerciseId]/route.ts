import { NextResponse } from 'next/server'
import { getExercise, saveExercise } from '@/lib/storage/exercises'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
  const { exerciseId } = await params
  const exercise = await getExercise(exerciseId)
  if (!exercise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updates = await request.json()
  const updated = {
    ...exercise,
    ...updates,
    id: exerciseId, // prevent id override
    updatedAt: new Date().toISOString(),
  }

  await saveExercise(updated)
  return NextResponse.json(updated)
}
