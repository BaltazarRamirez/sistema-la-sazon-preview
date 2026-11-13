import 'server-only'
import type { PoolClient } from 'pg'

// Preview mock: sin Postgres. Las páginas que aún no tienen mock
// reciben arrays vacíos / null y muestran estados vacíos.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fila = Record<string, any>

export function getPool(): never {
  throw new Error('Preview mock: no hay base de datos. Usá lib/mock.')
}

export async function q<T = Fila>(_sql: string, _params: unknown[] = []): Promise<T[]> {
  return []
}

export async function q1<T = Fila>(_sql: string, _params: unknown[] = []): Promise<T | null> {
  return null
}

export async function tx<T>(_fn: (c: PoolClient) => Promise<T>): Promise<T> {
  throw new Error('Preview mock: las escrituras a base de datos no están disponibles.')
}

export function mensajeError(err: unknown, porDefecto = 'No se pudo guardar. Probá de nuevo.'): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message ?? '')
    if (msg.includes('Preview mock')) return 'Modo preview: esta acción aún no está conectada.'
  }
  console.error(err)
  return porDefecto
}
