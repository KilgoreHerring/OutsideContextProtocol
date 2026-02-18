import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { upsertUser } from './storage/users'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile }) {
      if (profile?.sub) {
        await upsertUser({
          id: profile.sub,
          email: profile.email || '',
          name: profile.name || '',
          image: (profile.picture as string) || null,
        })
      }
      return true
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.userId = profile.sub
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
})
