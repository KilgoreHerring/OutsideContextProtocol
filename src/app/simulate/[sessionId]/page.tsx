'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRole } from '@/lib/role-context'
import type { Exercise, ExerciseStep } from '@/types/exercise'
import type { Session, StepGrade, ChatMessage, QuestionScore } from '@/types/session'

export default function SimulationWorkspace() {
  const params = useParams()
  const router = useRouter()
  const { role } = useRole()
  const [session, setSession] = useState<Session | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [submission, setSubmission] = useState('')
  const [showGrade, setShowGrade] = useState<StepGrade | null>(null)
  const [completing, setCompleting] = useState(false)
  const [viewingStepIndex, setViewingStepIndex] = useState<number | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [params.sessionId])

  async function loadData() {
    const sessionRes = await fetch(`/api/sessions/${params.sessionId}`)
    const sess: Session = await sessionRes.json()
    setSession(sess)

    const roleParam = role === 'trainee' ? '?role=trainee' : ''
    const exerciseRes = await fetch(`/api/exercises/${sess.exerciseId}${roleParam}`)
    const ex: Exercise = await exerciseRes.json()
    setExercise(ex)
    setLoading(false)

    const draft = localStorage.getItem(`draft-${sess.id}-${sess.currentStepIndex}`)
    if (draft) setSubmission(draft)
  }

  // Autosave draft to localStorage
  useEffect(() => {
    if (!session || viewingStepIndex !== null) return
    const key = `draft-${session.id}-${session.currentStepIndex}`
    if (submission) {
      localStorage.setItem(key, submission)
    }
  }, [submission, session, viewingStepIndex])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.chatHistory.length])

  if (loading || !session || !exercise) {
    return (
      <div className="loading-overlay" style={{ minHeight: '80vh' }}>
        <div className="spinner" />
        <span>Loading simulation...</span>
      </div>
    )
  }

  if (session.status === 'completed' && session.finalScore) {
    return <FinalReport session={session} exercise={exercise} />
  }

  // The active step index: either viewing a previous step or the current frontier
  const activeIndex = viewingStepIndex ?? session.currentStepIndex
  const activeStep = exercise.steps[activeIndex]
  const activeResult = session.stepResults.find((r) => r.stepId === activeStep?.id)
  const isViewingPrevious = viewingStepIndex !== null && viewingStepIndex !== session.currentStepIndex
  const isViewingCompleted = isViewingPrevious && activeResult?.grade !== null
  const isReadStep = activeStep?.type === 'read'
  const isLastStep = session.currentStepIndex >= exercise.steps.length - 1
  const allStepsCompleted = session.stepResults.every((r) => r.grade !== null)

  const visibleDocs = exercise.documents.filter(
    (d) => activeStep?.visibleDocuments.includes(d.id)
  )

  function handleNavigateToStep(i: number) {
    if (i > session!.currentStepIndex) return // can't navigate to locked steps
    setShowGrade(null)
    setViewingStepIndex(i === session!.currentStepIndex ? null : i)
    // Load submission for that step
    if (i === session!.currentStepIndex) {
      const draft = localStorage.getItem(`draft-${session!.id}-${i}`)
      setSubmission(draft || '')
    } else {
      const result = session!.stepResults.find((r) => r.stepId === exercise!.steps[i].id)
      setSubmission(result?.submission || '')
    }
  }

  function handleReturnToCurrent() {
    setViewingStepIndex(null)
    setShowGrade(null)
    const draft = localStorage.getItem(`draft-${session!.id}-${session!.currentStepIndex}`)
    setSubmission(draft || '')
  }

  async function handleSubmit() {
    if (!activeStep || (!isReadStep && !submission.trim())) return
    setSubmitting(true)
    setShowGrade(null)

    try {
      const res = await fetch(`/api/sessions/${session!.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: activeStep.id,
          submission: isReadStep ? '[Acknowledged]' : submission,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Submission failed' }))
        alert(err.error || 'Submission failed')
        setSubmitting(false)
        return
      }

      const data = await res.json()
      setSubmitting(false)

      // Show grade for write steps, auto-advance for read steps
      if (!isReadStep && data.stepResult?.grade) {
        setShowGrade(data.stepResult.grade)
      }

      localStorage.removeItem(`draft-${session!.id}-${activeIndex}`)

      const sessionRes = await fetch(`/api/sessions/${params.sessionId}`)
      const updatedSession = await sessionRes.json()
      setSession(updatedSession)
      setSubmission('')

      // If re-submitting a previous step, stay on that step's grade view
      if (isViewingPrevious) {
        // grade is now shown via showGrade
      } else if (isReadStep) {
        // Auto-advance for read steps
        const draft = localStorage.getItem(`draft-${updatedSession.id}-${updatedSession.currentStepIndex}`)
        if (draft) setSubmission(draft)
      }
    } catch (e) {
      setSubmitting(false)
      alert('Something went wrong. Please try again.')
    }
  }

  async function handleNextStep() {
    setShowGrade(null)
    setViewingStepIndex(null)
    const sessionRes = await fetch(`/api/sessions/${params.sessionId}`)
    const sess: Session = await sessionRes.json()
    setSession(sess)

    const draft = localStorage.getItem(`draft-${sess.id}-${sess.currentStepIndex}`)
    if (draft) setSubmission(draft)
    else setSubmission('')
  }

  async function handleSendChat() {
    if (!chatInput.trim() || !activeStep) return
    setChatSending(true)

    const tempMsg: ChatMessage = {
      id: 'temp',
      role: 'trainee',
      content: chatInput,
      stepId: activeStep.id,
      timestamp: new Date().toISOString(),
    }
    setSession((prev) => prev ? { ...prev, chatHistory: [...prev.chatHistory, tempMsg] } : prev)
    const message = chatInput
    setChatInput('')

    const res = await fetch(`/api/sessions/${session!.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, stepId: activeStep.id }),
    })

    const data = await res.json()
    setChatSending(false)

    const sessionRes = await fetch(`/api/sessions/${params.sessionId}`)
    setSession(await sessionRes.json())
  }

  async function handleComplete() {
    setCompleting(true)
    await fetch(`/api/sessions/${session!.id}/complete`, { method: 'POST' })
    const sessionRes = await fetch(`/api/sessions/${params.sessionId}`)
    setSession(await sessionRes.json())
    setCompleting(false)
  }

  const completedCount = session.stepResults.filter((r) => r.grade !== null).length

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {/* Left: Step sidebar */}
      <div style={{
        width: '240px',
        borderRight: '1px solid var(--rule)',
        background: 'var(--sidebar-bg)',
        padding: '1.25rem 1rem',
        overflowY: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className="label" style={{ marginBottom: '0.25rem' }}>{session.traineeName}</div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}>
          {exercise.title}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--ink-muted)',
            marginBottom: '0.375rem',
          }}>
            {completedCount}/{exercise.steps.length}
          </div>
          <div style={{ height: '2px', background: 'var(--rule)' }}>
            <div style={{
              height: '100%',
              width: `${(completedCount / exercise.steps.length) * 100}%`,
              background: 'var(--ink)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {exercise.steps.map((step, i) => {
            const result = session.stepResults.find((r) => r.stepId === step.id)
            const isCompleted = result?.grade !== null
            const isActive = i === activeIndex && !showGrade
            const isLocked = i > session.currentStepIndex
            const isClickable = !isLocked

            return (
              <div
                key={step.id}
                onClick={() => isClickable && handleNavigateToStep(i)}
                style={{
                  padding: '0.5rem 0.625rem',
                  fontSize: '0.8125rem',
                  color: isLocked ? 'var(--ink-muted)' : 'var(--ink)',
                  opacity: isLocked ? 0.5 : 1,
                  background: isActive ? 'var(--canvas)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--ink)' : '2px solid transparent',
                  cursor: isClickable ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: isCompleted ? 'var(--green)' : 'var(--ink-muted)',
                    flexShrink: 0,
                    width: '1.25rem',
                  }}>
                    {isCompleted ? '✓' : `${i + 1}.`}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.4,
                  }}>
                    {step.title}
                  </span>
                </div>
                {isCompleted && result?.grade && (
                  <div style={{
                    marginLeft: '1.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: 'var(--ink-muted)',
                  }}>
                    {result.grade.score}/{result.grade.maxScore}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Complete button */}
        {allStepsCompleted && session.status === 'in-progress' && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'auto', paddingTop: '1rem' }}
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? <><span className="spinner" /> Finishing...</> : 'Complete Exercise'}
          </button>
        )}
      </div>

      {/* Centre: Canvas */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
          {showGrade ? (
            <GradeDisplay
              grade={showGrade}
              stepTitle={activeStep?.title || ''}
              stepIndex={activeIndex + 1}
              isLastStep={isLastStep && !isViewingPrevious}
              allStepsCompleted={allStepsCompleted}
              completing={completing}
              isViewingPrevious={isViewingPrevious}
              onNext={handleNextStep}
              onComplete={handleComplete}
              onReturnToCurrent={handleReturnToCurrent}
            />
          ) : activeStep ? (
            <div>
              {/* Back to current step banner */}
              {isViewingPrevious && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '0.625rem 0',
                  borderBottom: '1px solid var(--rule-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span className="label">Reviewing previous step</span>
                  <button className="btn" onClick={handleReturnToCurrent} style={{ fontSize: '0.75rem' }}>
                    Return to current step →
                  </button>
                </div>
              )}

              {/* Step header */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="label" style={{ marginBottom: '0.375rem' }}>
                  {activeStep.type} · Step {activeIndex + 1} of {exercise.steps.length}
                </div>
                <h2>{activeStep.title}</h2>
              </div>

              {/* Instruction */}
              <div className="prose" style={{ marginBottom: '2rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeStep.instruction}</ReactMarkdown>
              </div>

              {/* Documents */}
              {visibleDocs.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div className="label" style={{ marginBottom: '0.75rem' }}>Reference Documents</div>
                  {visibleDocs.map((doc) => (
                    <details key={doc.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--rule-light)' }}>
                      <summary style={{
                        padding: '0.75rem 0',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.875rem',
                        color: 'var(--ink)',
                      }}>
                        {doc.label}
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--ink-muted)',
                          marginLeft: '0.75rem',
                        }}>
                          {doc.filename}
                        </span>
                      </summary>
                      <div style={{
                        padding: '1rem 0 1rem 1.25rem',
                        borderLeft: '2px solid var(--rule)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8,
                        color: 'var(--ink-secondary)',
                        maxHeight: '600px',
                        overflowY: 'auto',
                      }}>
                        {doc.extractedText}
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {/* Previous grade (when viewing a completed step) */}
              {isViewingCompleted && activeResult?.grade && !isReadStep && (
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--rule)', paddingBottom: '1.5rem' }}>
                  <div className="label" style={{ marginBottom: '0.5rem' }}>Previous Grade</div>
                  <PreviousGradeSummary grade={activeResult.grade} />
                </div>
              )}

              {/* Submission area */}
              {isReadStep ? (
                !isViewingCompleted ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? <><span className="spinner" /> Processing...</> : 'I\'ve read this — continue'}
                  </button>
                ) : null
              ) : (
                <div>
                  <div className="label" style={{ marginBottom: '0.5rem' }}>
                    {isViewingCompleted ? 'Your Submission' : 'Your Work'}
                  </div>
                  <textarea
                    className="form-input"
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="Type your response here..."
                    style={{ minHeight: '300px', width: '100%', marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--ink-muted)',
                    }}>
                      {submission.length > 0 ? `${submission.split(/\s+/).filter(Boolean).length} words` : 'Draft auto-saved'}
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={submitting || !submission.trim()}
                    >
                      {submitting
                        ? <><span className="spinner" /> Grading...</>
                        : isViewingCompleted ? 'Resubmit for Review' : 'Submit for Review'
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right: Chat */}
      <div style={{
        width: chatOpen ? '300px' : '40px',
        borderLeft: '1px solid var(--rule)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.2s',
        background: 'var(--canvas)',
      }}>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="label"
          style={{
            padding: '0.75rem',
            border: 'none',
            borderBottom: '1px solid var(--rule)',
            background: 'none',
            cursor: 'pointer',
            textAlign: chatOpen ? 'left' : 'center',
          }}
        >
          {chatOpen ? 'Supervisor Chat ▸' : '◂'}
        </button>

        {chatOpen && (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--rule-light)',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.8125rem',
              color: 'var(--ink-secondary)',
              fontStyle: 'italic',
            }}>
              Questions will be assessed for relevance
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              {session.chatHistory.length === 0 && (
                <div style={{
                  color: 'var(--ink-muted)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.8125rem',
                  fontStyle: 'italic',
                  padding: '2rem 0',
                  textAlign: 'center',
                }}>
                  Ask questions as you would to a supervising solicitor.
                </div>
              )}
              {session.chatHistory.map((msg) => {
                const qScore = session.questionScores.find((q) => q.messageId === msg.id)
                const isTrainee = msg.role === 'trainee'
                return (
                  <div key={msg.id} style={{
                    alignSelf: isTrainee ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                  }}>
                    <div style={{
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.8125rem',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-serif)',
                      background: isTrainee ? 'var(--ink)' : 'var(--sidebar-bg)',
                      color: isTrainee ? 'var(--canvas)' : 'var(--ink)',
                    }}>
                      {msg.content}
                    </div>
                    {qScore && (
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        marginTop: '0.25rem',
                        textAlign: 'right',
                        color: qScore.rating === 'useful' ? 'var(--green)' : 'var(--red)',
                      }}>
                        {qScore.rating === 'useful' ? '✓ useful' : '✗ not useful'}
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--rule)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  disabled={chatSending}
                  style={{ flex: 1, fontSize: '0.8125rem' }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSendChat}
                  disabled={chatSending || !chatInput.trim()}
                >
                  {chatSending ? <span className="spinner" /> : 'Send'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Compact grade summary for when reviewing a previous step
function PreviousGradeSummary({ grade }: { grade: StepGrade }) {
  const pct = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
  const scoreClass = pct >= 70 ? 'grade-pass' : pct >= 50 ? 'grade-note' : 'grade-fail'

  return (
    <div className={`grade-margin ${scoreClass}`}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 500 }}>
          {grade.score}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
          / {grade.maxScore}
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: 'var(--ink-secondary)',
      }}>
        {grade.feedback}
      </p>
    </div>
  )
}

// Grade display — margin-annotation style
function GradeDisplay({ grade, stepTitle, stepIndex, isLastStep, allStepsCompleted, completing, isViewingPrevious, onNext, onComplete, onReturnToCurrent }: {
  grade: StepGrade
  stepTitle: string
  stepIndex: number
  isLastStep: boolean
  allStepsCompleted: boolean
  completing: boolean
  isViewingPrevious: boolean
  onNext: () => void
  onComplete: () => void
  onReturnToCurrent: () => void
}) {
  const pct = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
  const scoreClass = pct >= 70 ? 'grade-pass' : pct >= 50 ? 'grade-note' : 'grade-fail'
  const verdict = pct >= 80 ? 'Excellent' : pct >= 70 ? 'Good work' : pct >= 50 ? 'Adequate' : 'Needs improvement'

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div className="label" style={{ marginBottom: '0.375rem' }}>
          Step {stepIndex} Results
        </div>
        <h2>{stepTitle}</h2>
      </div>

      {/* Score */}
      <div className={`grade-margin ${scoreClass}`} style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--rule-light)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2rem',
            fontWeight: 500,
            color: 'var(--ink)',
          }}>
            {grade.score}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            color: 'var(--ink-muted)',
          }}>
            / {grade.maxScore}
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9375rem',
            color: 'var(--ink-secondary)',
            fontStyle: 'italic',
          }}>
            {verdict}
          </span>
        </div>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.9375rem',
          lineHeight: 1.7,
          color: 'var(--ink-secondary)',
        }}>
          {grade.feedback}
        </p>
      </div>

      {/* Strengths */}
      {grade.strengths.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="label" style={{ color: 'var(--green)', marginBottom: '0.5rem' }}>Strengths</div>
          <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
            {grade.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {grade.improvements.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="label" style={{ color: 'var(--amber)', marginBottom: '0.5rem' }}>Areas for Improvement</div>
          <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
            {grade.improvements.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* Critical issues */}
      {grade.criticalIssues.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="label" style={{ color: 'var(--red)', marginBottom: '0.5rem' }}>Critical Issues</div>
          <div className="grade-margin grade-fail">
            <ul className="spaced-list" style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
              {grade.criticalIssues.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        {isViewingPrevious ? (
          <button className="btn btn-primary" onClick={onReturnToCurrent}>
            Return to Current Step
          </button>
        ) : !isLastStep || !allStepsCompleted ? (
          <button className="btn btn-primary" onClick={onNext}>
            Continue to Next Step
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={onComplete}
            disabled={completing}
          >
            {completing ? <><span className="spinner" /> Generating Report...</> : 'Complete Exercise & View Report'}
          </button>
        )}
      </div>
    </div>
  )
}

// Final Report
function FinalReport({ session, exercise }: { session: Session; exercise: Exercise }) {
  const router = useRouter()
  const score = session.finalScore!

  return (
    <div className="container" style={{ maxWidth: 'var(--content-width)', paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rule)', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.375rem' }}>Exercise Complete</h1>
        <div style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--ink-secondary)',
          fontSize: '0.9375rem',
        }}>
          {exercise.title} — {session.traineeName}
        </div>
      </div>

      {/* Overall score */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rule)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3rem',
            fontWeight: 500,
            color: 'var(--ink)',
          }}>
            {score.overall}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            color: 'var(--ink-muted)',
          }}>
            / 100
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.125rem',
          color: 'var(--ink-secondary)',
          fontStyle: 'italic',
        }}>
          {score.overall >= 80 ? 'Excellent' : score.overall >= 70 ? 'Good' : score.overall >= 50 ? 'Adequate' : 'Needs Development'}
        </div>
      </div>

      {/* Step breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="label" style={{ marginBottom: '0.75rem' }}>Step Breakdown</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '0.625rem 0',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--ink-secondary)',
                borderBottom: '2px solid var(--rule)',
              }}>Step</th>
              <th style={{
                textAlign: 'right',
                padding: '0.625rem 0',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--ink-secondary)',
                borderBottom: '2px solid var(--rule)',
              }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {score.stepScores.map((ss) => {
              const step = exercise.steps.find((s) => s.id === ss.stepId)
              return (
                <tr key={ss.stepId}>
                  <td style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--rule-light)',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.875rem',
                  }}>
                    {step?.title || ss.stepId}
                  </td>
                  <td style={{
                    textAlign: 'right',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--rule-light)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--ink)',
                  }}>
                    {ss.score}/{ss.maxScore}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Question quality */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rule)', paddingBottom: '2rem' }}>
        <div className="label" style={{ marginBottom: '0.75rem' }}>Question Quality</div>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--green)' }}>
              {score.questionQuality.useful}
            </div>
            <div className="label">Useful</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--red)' }}>
              {score.questionQuality.notUseful}
            </div>
            <div className="label">Not Useful</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 500 }}>
              {Math.round(score.questionQuality.ratio * 100)}%
            </div>
            <div className="label">Quality Ratio</div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="label" style={{ color: 'var(--green)', marginBottom: '0.5rem' }}>Strengths</div>
        <ul className="spaced-list" style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)' }}>
          {score.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      {/* Development areas */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--rule)', paddingBottom: '2rem' }}>
        <div className="label" style={{ color: 'var(--amber)', marginBottom: '0.5rem' }}>Areas for Development</div>
        <ul className="spaced-list" style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-serif)', color: 'var(--ink-secondary)' }}>
          {score.areasForDevelopment.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      {/* Overall assessment */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="label" style={{ marginBottom: '0.75rem' }}>Overall Assessment</div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.0625rem',
          lineHeight: 1.8,
          color: 'var(--ink)',
          whiteSpace: 'pre-wrap',
        }}>
          {score.overallFeedback}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.5rem' }}>
        <button className="btn" onClick={() => router.push('/')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
