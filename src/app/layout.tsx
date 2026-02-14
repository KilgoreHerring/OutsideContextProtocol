import type { Metadata } from 'next'
import { RoleProvider } from '@/lib/role-context'
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
        <RoleProvider>
          <AppHeader />
          <main style={{ padding: '2rem 0' }}>
            {children}
          </main>
        </RoleProvider>
      </body>
    </html>
  )
}
