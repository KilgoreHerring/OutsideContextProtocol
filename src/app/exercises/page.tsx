'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/lib/role-context'
import type { Exercise } from '@/types/exercise'

export default function ExercisesList() {
  const { role } = useRole()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const isSupervisor = role === 'supervisor'

  useEffect(() => {
    fetch('/api/exercises')
      .then((r) => r.json())
      .then((data) => {
        setExercises(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  const visibleExercises = isSupervisor
    ? exercises
    : exercises.filter((e) => e.status === 'ready')

  return (
    <div className="container" style={{ maxWidth: 'var(--content-width)', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <h1>Exercises</h1>
        {isSupervisor && (
          <Link href="/exercises/new" className="btn btn-primary btn-sm">
            + New Exercise
          </Link>
        )}
      </div>

      {visibleExercises.length === 0 ? (
        <div style={{ paddingTop: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-muted)', fontSize: '0.9375rem' }}>
            {isSupervisor
              ? 'No exercises yet. Create your first training exercise.'
              : 'No exercises available yet. Ask your supervisor to set one up.'}
          </p>
          {isSupervisor && (
            <Link href="/exercises/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              + Create Exercise
            </Link>
          )}
        </div>
      ) : (
        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {visibleExercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="selectable-row"
              style={{ padding: '1rem 0.5rem', borderBottom: '1px solid var(--rule-light)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>
                  {exercise.title}
                </span>
                {isSupervisor && (
                  <span className="badge" style={{ color: exercise.status === 'ready' ? 'var(--green)' : 'var(--ink-muted)' }}>
                    {exercise.status}
                  </span>
                )}
              </div>
              {exercise.description && (
                <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)', fontSize: '0.875rem', marginBottom: '0.375rem', lineHeight: 1.5 }}>
                  {exercise.description}
                </div>
              )}
              <div className="label">
                {exercise.matterType} &middot; {exercise.difficulty} &middot; {exercise.steps.length} steps
                {isSupervisor && <> &middot; {exercise.documents.length} docs</>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
