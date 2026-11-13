'use client'

import Image from 'next/image'
import { useActionState } from 'react'
import { login, type LoginState } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 15%, rgba(31,107,58,0.12), transparent 42%), radial-gradient(circle at 80% 85%, rgba(252,228,180,0.05), transparent 40%)',
        }}
      />

      <div className="w-full max-w-sm relative anim-fade-up">
        <div className="text-center mb-8">
          <Image
            src="/logo-la-sazon.png"
            alt="La Sazón"
            width={160}
            height={160}
            priority
            className="mx-auto mb-4"
          />
          <p className="eyebrow mb-2">Preview · demo</p>
          <h1 className="font-display text-[2.4rem] font-extrabold tracking-tight text-[var(--ink)] leading-none">
            La <span className="text-[var(--gold)]">Sazón</span>
          </h1>
          <p className="text-[13px] text-[var(--ink-soft)] mt-3">Sistema de gestión del local</p>
        </div>

        <form action={action} className="card p-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">Usuario</label>
            <input
              id="email"
              name="email"
              type="text"
              required
              autoFocus
              autoComplete="username"
              placeholder="admin"
              defaultValue="admin"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="123"
              defaultValue="123"
              className="input"
            />
          </div>

          {state?.error && <p className="text-[var(--danger)] text-xs" role="alert">{state.error}</p>}

          <button type="submit" disabled={pending} className="btn btn-ember w-full mt-2 py-3 text-[15px]">
            {pending ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--ink-mute)] mt-5">
          Demo mock · admin / 123
        </p>
      </div>
    </div>
  )
}
