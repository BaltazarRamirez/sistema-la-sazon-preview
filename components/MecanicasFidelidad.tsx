'use client'

import { useState } from 'react'

type Mecanica = {
  id: string
  titulo: string
  detalle: string
  activo: boolean
  tipo: string
}

const CHIP: Record<string, string> = {
  ciclo: 'chip-ember',
  pedido: 'chip-info',
  bonus: 'chip-warn',
  cumple: 'chip-ok',
}

const LABEL: Record<string, string> = {
  ciclo: 'Ciclo',
  pedido: 'Pedido',
  bonus: 'Bonus',
  cumple: 'Cumple',
}

/** Preview mock: toggles locales, sin persistir. */
export default function MecanicasFidelidad({ items }: { items: Mecanica[] }) {
  const [lista, setLista] = useState(items)

  function toggle(id: string) {
    setLista(prev => prev.map(m => (m.id === id ? { ...m, activo: !m.activo } : m)))
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2 className="h2">Otras mecánicas</h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Sorteos, premios por pedido y cumple · mock (el toggle solo es demo)
          </p>
        </div>
      </div>
      <ul className="divide-y divide-[var(--line-soft)]">
        {lista.map(m => (
          <li key={m.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{m.titulo}</p>
                <span className={`chip ${CHIP[m.tipo] ?? 'chip-neutral'}`}>{LABEL[m.tipo] ?? m.tipo}</span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">{m.detalle}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(m.id)}
              className={`chip cursor-pointer shrink-0 ${m.activo ? 'chip-ok' : 'chip-neutral'}`}
            >
              {m.activo ? 'Activa' : 'Pausada'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
