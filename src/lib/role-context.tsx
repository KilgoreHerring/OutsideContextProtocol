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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '620px', width: '100%' }}>
        <div className="label" style={{ marginBottom: '1rem' }}>
          Continue as
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
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
  )
}
