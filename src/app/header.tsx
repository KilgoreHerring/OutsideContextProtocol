'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRole } from '@/lib/role-context'

export function AppHeader() {
  const { role, setRole } = useRole()
  const [showSwitcher, setShowSwitcher] = useState(false)

  if (!role) return null

  return (
    <header style={{
      borderBottom: '1px solid var(--rule)',
      padding: '0.875rem 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--ink)',
          textDecoration: 'none',
        }}>
          Outside Context Protocol
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
          <Link href="/exercises" style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>Exercises</Link>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>Dashboard</Link>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className="label"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.125rem 0',
                borderBottom: '1px dotted var(--ink-muted)',
              }}
            >
              {role}
            </button>
            {showSwitcher && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                  onClick={() => setShowSwitcher(false)}
                />
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '0.5rem',
                  background: 'var(--canvas)',
                  border: '1px solid var(--rule)',
                  zIndex: 100,
                  minWidth: '140px',
                }}>
                  {(['supervisor', 'trainee'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setShowSwitcher(false) }}
                      className="selectable-row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                        fontWeight: role === r ? 600 : 400,
                        color: role === r ? 'var(--ink)' : 'var(--ink-secondary)',
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{r}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
