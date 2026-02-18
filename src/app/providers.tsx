'use client'

import { SessionProvider } from 'next-auth/react'
import { RoleProvider } from '@/lib/role-context'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </SessionProvider>
  )
}
