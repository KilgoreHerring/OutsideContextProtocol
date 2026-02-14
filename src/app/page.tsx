'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/lib/role-context'
import type { Exercise } from '@/types/exercise'
import type { Session } from '@/types/session'

export default function Dashboard() {
  const { role } = useRole()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const isSupervisor = role === 'supervisor'

  useEffect(() => {
    Promise.all([
      fetch('/api/exercises').then((r) => r.json()),
      fetch('/api/sessions').then((r) => r.json()),
    ]).then(([ex, sess]) => {
      setExercises(ex)
      setSessions(sess)
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

  const activeSessions = sessions.filter((s) => s.status === 'in-progress')
  const completedSessions = sessions.filter((s) => s.status === 'completed')
  const readyExercises = exercises.filter((e) => e.status === 'ready')
  const visibleExercises = isSupervisor ? exercises : readyExercises

  return (
    <div className="container" style={{ maxWidth: 'var(--content-width)', paddingTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.375rem' }}>Dashboard</h1>
        <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)', fontSize: '0.9375rem' }}>
          {isSupervisor
            ? 'Manage exercises and review trainee progress.'
            : 'Complete exercises and track your progress.'}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--rule)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--ink)' }}>
            {readyExercises.length}
          </div>
          <div className="label">Exercises</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--ink)' }}>
            {activeSessions.length}
          </div>
          <div className="label">Active</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--ink)' }}>
            {completedSessions.length}
          </div>
          <div className="label">Completed</div>
        </div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Active Sessions</h3>
          <div>
            {activeSessions.map((session) => {
              const exercise = exercises.find((e) => e.id === session.exerciseId)
              const completedSteps = session.stepResults.filter((r) => r.grade !== null).length
              const totalSteps = session.stepResults.length
              return (
                <Link
                  key={session.id}
                  href={`/simulate/${session.id}`}
                  className="selectable-row"
                  style={{ padding: '0.875rem 0.5rem', borderBottom: '1px solid var(--rule-light)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem' }}>
                      {exercise?.title || 'Unknown Exercise'}
                    </span>
                    <span className="label">{completedSteps}/{totalSteps}</span>
                  </div>
                  <div className="label" style={{ marginTop: '0.25rem' }}>
                    {session.traineeName}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Exercises */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h3>Exercises</h3>
          {isSupervisor && (
            <Link href="/exercises/new" className="btn btn-primary btn-sm">
              + New Exercise
            </Link>
          )}
        </div>
        {visibleExercises.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-muted)', fontSize: '0.9375rem' }}>
            {isSupervisor ? 'No exercises yet.' : 'No exercises available yet.'}
          </p>
        ) : (
          <div>
            {visibleExercises.slice(0, 5).map((exercise) => (
              <Link
                key={exercise.id}
                href={`/exercises/${exercise.id}`}
                className="selectable-row"
                style={{ padding: '0.875rem 0.5rem', borderBottom: '1px solid var(--rule-light)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem' }}>
                    {exercise.title}
                  </span>
                  {isSupervisor && (
                    <span className="badge" style={{ color: exercise.status === 'ready' ? 'var(--green)' : 'var(--ink-muted)' }}>
                      {exercise.status}
                    </span>
                  )}
                </div>
                <div className="label" style={{ marginTop: '0.25rem' }}>
                  {exercise.matterType} &middot; {exercise.difficulty} &middot; {exercise.steps.length} steps
                </div>
              </Link>
            ))}
            {visibleExercises.length > 5 && (
              <div style={{ paddingTop: '0.75rem' }}>
                <Link href="/exercises" style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>
                  View all {visibleExercises.length} exercises
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Completed</h3>
          <div>
            {completedSessions.slice(0, 5).map((session) => {
              const exercise = exercises.find((e) => e.id === session.exerciseId)
              return (
                <Link
                  key={session.id}
                  href={`/simulate/${session.id}`}
                  className="selectable-row"
                  style={{ padding: '0.875rem 0.5rem', borderBottom: '1px solid var(--rule-light)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem' }}>
                      {exercise?.title || 'Unknown Exercise'}
                    </span>
                    {session.finalScore && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {session.finalScore.overall}%
                      </span>
                    )}
                  </div>
                  <div className="label" style={{ marginTop: '0.25rem' }}>
                    {session.traineeName}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
