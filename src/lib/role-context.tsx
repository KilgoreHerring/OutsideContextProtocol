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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '0 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Outside Context Protocol</h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9375rem', fontFamily: 'var(--font-serif)' }}>
            A matter simulator for trainee solicitors
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--rule)' }}>
          <button
            onClick={() => onSelect('supervisor')}
            className="selectable-row"
            style={{ padding: '1.25rem 0.5rem', borderBottom: '1px solid var(--rule)' }}
          >
            <div className="label" style={{ marginBottom: '0.25rem' }}>
              Supervisor
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.9375rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.5,
            }}>
              Create exercises, view rubrics, review trainee results
            </div>
          </button>

          <button
            onClick={() => onSelect('trainee')}
            className="selectable-row"
            style={{ padding: '1.25rem 0.5rem' }}
          >
            <div className="label" style={{ marginBottom: '0.25rem' }}>
              Trainee
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.9375rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.5,
            }}>
              Complete exercises, submit work, receive feedback
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
