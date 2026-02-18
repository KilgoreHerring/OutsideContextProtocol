'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRole } from '@/lib/role-context'
import type { Exercise } from '@/types/exercise'

export default function ExerciseDetail() {
  const params = useParams()
  const router = useRouter()
  const { role } = useRole()
  const { data: authSession } = useSession()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingSession, setStartingSession] = useState(false)
  const [traineeName, setTraineeName] = useState('')
  const [showStartModal, setShowStartModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'rubric'>('overview')
  const isSupervisor = role === 'supervisor'

  useEffect(() => {
    if (authSession?.user?.name && !traineeName) {
      setTraineeName(authSession.user.name)
    }
  }, [authSession, traineeName])

  useEffect(() => {
    const roleParam = role === 'trainee' ? '?role=trainee' : ''
    fetch(`/api/exercises/${params.exerciseId}${roleParam}`)
      .then((r) => r.json())
      .then((data) => {
        setExercise(data)
        setLoading(false)
      })
  }, [params.exerciseId, role])

  async function handleStartSession() {
    if (!exercise || !traineeName.trim()) return
    setStartingSession(true)
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: exercise.id, traineeName }),
    })
    const session = await res.json()
    router.push(`/simulate/${session.id}`)
  }

  if (loading || !exercise) {
    return (
      <div className="loading-overlay" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  const tabs = isSupervisor ? ['overview', 'steps', 'rubric'] as const : ['overview'] as const

  return (
    <div className="container" style={{ maxWidth: 'var(--content-width)', paddingTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{exercise.title}</h1>
        <div className="label" style={{ display: 'flex', gap: '1rem' }}>
          <span>{exercise.matterType}</span>
          <span>{exercise.difficulty}</span>
          <span>{exercise.steps.length} steps</span>
          <span>~{Math.round(exercise.estimatedDurationMinutes / 60)}h</span>
        </div>
        {exercise.description && (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)', fontSize: '0.9375rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
            {exercise.description}
          </p>
        )}
      </div>

      {/* Action + Tabs row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--rule)', marginBottom: '2rem', paddingBottom: '0' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem 0.625rem',
                border: 'none',
                background: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: activeTab === tab ? 'var(--ink)' : 'var(--ink-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--ink)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {exercise.status === 'ready' && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowStartModal(true)}>
            Start Session
          </button>
        )}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && exercise.generatedMarkdown && (
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {exercise.generatedMarkdown}
          </ReactMarkdown>
        </div>
      )}

      {/* Steps tab (supervisor only) */}
      {activeTab === 'steps' && isSupervisor && (
        <div>
          {exercise.steps.map((step, i) => (
            <div key={step.id} style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--rule-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <h3 style={{ textTransform: 'none', fontSize: '0.9375rem', fontFamily: 'var(--font-serif)' }}>
                  {i + 1}. {step.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <span className="badge">{step.type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{step.maxScore} pts</span>
                </div>
              </div>
              <div className="prose" style={{ fontSize: '0.9375rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.instruction}</ReactMarkdown>
              </div>
              {step.gradingCriteria.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rule-light)' }}>
                  <div className="label" style={{ marginBottom: '0.5rem' }}>Grading Criteria</div>
                  <ul className="spaced-list" style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>
                    {step.gradingCriteria.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rubric tab (supervisor only) */}
      {activeTab === 'rubric' && isSupervisor && exercise.rubric && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div className="label" style={{ marginBottom: '0.5rem' }}>Overall Approach</div>
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
              {exercise.rubric.overallApproach}
            </p>
          </div>

          <div>
            <div className="label" style={{ marginBottom: '0.5rem' }}>Key Issues</div>
            <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
              {exercise.rubric.keyIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="label" style={{ marginBottom: '0.5rem', color: 'var(--red)' }}>Critical Errors</div>
            <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', borderLeft: '3px solid var(--red)', paddingLeft: '1.5rem' }}>
              {exercise.rubric.criticalErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="label" style={{ marginBottom: '0.5rem', color: 'var(--green)' }}>Quality Markers</div>
            <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
              {exercise.rubric.qualityMarkers.map((marker, i) => (
                <li key={i}>{marker}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Start session modal */}
      {showStartModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowStartModal(false)}>
          <div
            style={{ background: 'var(--canvas)', padding: '2rem', width: '360px', border: '1px solid var(--rule)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1.5rem' }}>Start Session</h2>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Trainee Name</label>
              <input
                className="form-input"
                value={traineeName}
                onChange={(e) => setTraineeName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleStartSession()}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowStartModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={!traineeName.trim() || startingSession}
                onClick={handleStartSession}
              >
                {startingSession ? <><span className="spinner" /> Starting...</> : 'Begin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
