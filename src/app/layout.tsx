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
          <main style={{ padding: '2rem 0' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
