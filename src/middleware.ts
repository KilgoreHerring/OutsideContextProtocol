import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
  const isSignInPage = req.nextUrl.pathname === '/signin'

  if (isAuthRoute) return NextResponse.next()

  if (!req.auth) {
    if (isSignInPage) return NextResponse.next()
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  if (isSignInPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.*\\.png).*)'],
}
