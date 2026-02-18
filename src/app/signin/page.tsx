import { signIn } from '@/lib/auth'

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with logo */}
      <div style={{ padding: '1.25rem 2rem' }}>
        <img src="/logo-transparent.png" alt="OCP" style={{ height: '36px' }} />
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

          {/* Sign in */}
          <form action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 2rem',
                border: '2px solid var(--ink)',
                background: 'var(--canvas)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--ink)',
                letterSpacing: '0.01em',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>
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
            { icon: '\u{1F4C4}', label: 'Realistic Exercises', desc: 'Multi-step simulations built from real matter documents — reading, drafting, reviewing, advising.' },
            { icon: '\u{2705}', label: 'AI-Powered Grading', desc: 'Submissions scored against ideal outputs with detailed feedback on strengths and areas for development.' },
            { icon: '\u{1F4AC}', label: 'Virtual Supervisor', desc: 'Ask questions during exercises. The AI guides without giving answers — just like a real supervisor.' },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>{f.label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.8, fontWeight: 400 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="label" style={{ marginBottom: '1rem', textAlign: 'center' }}>Why this exists</div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', color: 'var(--ink-secondary)', lineHeight: 1.9, textAlign: 'center', marginBottom: '1rem' }}>
            Traditionally, trainees learn through osmosis — working alongside senior lawyers and learning
            by virtue of the red pen. As technology enables senior lawyers to produce work product without
            junior involvement, there is a growing risk of a skills gap where the next generation of lawyers
            are not trained to the same level of robustness as their predecessors.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', color: 'var(--ink-secondary)', lineHeight: 1.9, textAlign: 'center' }}>
            Training through simulated but realistic exercises gives trainees a chance to learn, and
            supervisors a way to assess ability — similar to how pilots train on simulators alongside
            real flight hours. This isn&#39;t intended to replace supervision, but to add to the resources
            a junior lawyer can call upon.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
        <div>Promptor — Mike Kennedy | <a href="https://www.linkedin.com/in/michaelkenn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)', textDecoration: 'underline' }}>LinkedIn</a></div>
        <div>Actual hard work done by Claude</div>
      </div>
    </div>
  )
}
