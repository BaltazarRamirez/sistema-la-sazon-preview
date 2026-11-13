'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

export interface LoginState {
  error?: string
}

const DEMO_USER = 'admin'
const DEMO_PASS = '123'
const DEMO_USER_ID = 'preview-admin'

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Completá usuario y contraseña.' }
  }

  const okUser = email === DEMO_USER || email === 'admin@lasazon.com'
  if (!okUser || password !== DEMO_PASS) {
    return { error: 'Usuario o contraseña incorrectos.' }
  }

  await createSession(DEMO_USER_ID, DEMO_USER)
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
