'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Role = 'supervisor' | 'trainee'

interface RoleContextValue {
  role: Role | null
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextValue>({ role: null, setRole: () => {} })

export function useRole() {
  return useContext(RoleContext)
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('matter-sim-role') as Role | null
    if (stored === 'supervisor' || stored === 'trainee') {
      setRoleState(stored)
    }
    setLoaded(true)
  }, [])

  function setRole(r: Role) {
    setRoleState(r)
    localStorage.setItem('matter-sim-role', r)
  }

  if (!loaded) return null

  if (!role) {
    return <RolePicker onSelect={setRole} />
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

function RolePicker({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with logo */}
      <div style={{ padding: '1.25rem 2rem' }}>
        <img
          src="/logo-transparent.png"
          alt="OCP"
          style={{ height: '36px' }}
        />
      </div>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2rem 3rem',
      }}>
        <div style={{ maxWidth: '620px', width: '100%' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Outside Context Protocol
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--ink)',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}>
            Practical legal training. Realistic exercises. Instant feedback.
          </p>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9375rem',
            color: 'var(--ink-muted)',
            lineHeight: 1.9,
            marginBottom: '3rem',
            fontWeight: 400,
          }}>
            A matter simulator for trainee solicitors — practise on exercises grounded
            in real matters, graded by AI, with a virtual supervisor to guide you.
          </p>

          {/* Role cards */}
          <div className="label" style={{ marginBottom: '1rem' }}>
            Continue as
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
            {([
              {
                role: 'supervisor' as Role,
                icon: '\u{1F4CB}',
                label: 'Supervisor',
                tagline: 'Create exercises. Review performance. Track progress.',
                desc: 'Upload matter documents, generate AI-powered training exercises, and review how your trainees perform.',
              },
              {
                role: 'trainee' as Role,
                icon: '\u{1F4DD}',
                label: 'Trainee',
                tagline: 'Complete simulations. Receive feedback. Build judgement.',
                desc: 'Work through realistic legal exercises, get graded by AI, and ask a virtual supervisor for guidance.',
              },
            ]).map((item) => (
              <button
                key={item.role}
                onClick={() => onSelect(item.role)}
                style={{
                  flex: 1,
                  padding: '1.75rem',
                  border: '2px solid var(--rule)',
                  background: 'var(--canvas)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink)'
                  e.currentTarget.style.background = 'var(--canvas-raised)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--rule)'
                  e.currentTarget.style.background = 'var(--canvas)'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {item.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: 'var(--ink-secondary)',
                  fontWeight: 600,
                  lineHeight: 1.6,
                  marginBottom: '0.75rem',
                }}>
                  {item.tagline}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.8125rem',
                  color: 'var(--ink-muted)',
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}>
                  {item.desc}
                </div>
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ink-secondary)',
                }}>
                  Enter &rarr;
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '4rem 2rem', background: '#f4f3f0' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
        }}>
          {[
            {
              icon: '\u{1F4C4}',
              label: 'Realistic Exercises',
              desc: 'Multi-step simulations built from real matter documents — reading, drafting, reviewing, advising.',
            },
            {
              icon: '\u{2705}',
              label: 'AI-Powered Grading',
              desc: 'Submissions scored against ideal outputs with detailed feedback on strengths and areas for development.',
            },
            {
              icon: '\u{1F4AC}',
              label: 'Virtual Supervisor',
              desc: 'Ask questions during exercises. The AI guides without giving answers — just like a real supervisor.',
            },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>
                {f.icon}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>
                {f.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.875rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.8,
                fontWeight: 400,
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="label" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Why this exists
          </div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9375rem',
            color: 'var(--ink-secondary)',
            lineHeight: 1.9,
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            Traditionally, trainees learn through osmosis — working alongside senior lawyers and learning
            by virtue of the red pen. As technology enables senior lawyers to produce work product without
            junior involvement, there is a growing risk of a skills gap where the next generation of lawyers
            are not trained to the same level of robustness as their predecessors.
          </p>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9375rem',
            color: 'var(--ink-secondary)',
            lineHeight: 1.9,
            textAlign: 'center',
          }}>
            Training through simulated but realistic exercises gives trainees a chance to learn, and
            supervisors a way to assess ability — similar to how pilots train on simulators alongside
            real flight hours. This isn&#39;t intended to replace supervision, but to add to the resources
            a junior lawyer can call upon.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--rule)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--ink-muted)',
        lineHeight: 1.8,
      }}>
        <div>Promptor — Mike Kennedy | <a href="https://www.linkedin.com/in/michaelkenn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)', textDecoration: 'underline' }}>LinkedIn</a></div>
        <div>Actual hard work done by Claude</div>
      </div>
    </div>
  )
}
