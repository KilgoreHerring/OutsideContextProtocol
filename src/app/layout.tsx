import type { Metadata } from 'next'
import { Providers } from './providers'
import { AppHeader } from './header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Outside Context Protocol',
  description: 'A matter simulator for trainee solicitors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppHeader />
          <div style={{
            background: 'var(--canvas)',
            borderBottom: '1px solid var(--rule)',
            padding: '0.5rem 0',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-sans)',
            color: 'var(--ink-muted)',
            letterSpacing: '0.01em',
          }}>
            Beta — currently using Haiku 4.5. Best results with Sonnet models.
          </div>
          <main style={{ padding: '2rem 0' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
