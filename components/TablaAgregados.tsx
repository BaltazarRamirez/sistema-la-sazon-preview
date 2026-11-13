'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { guardarAgregado, toggleAgregado } from '@/app/actions/menu'
import {
  CAPAS_PARA_AGREGADO,
  GRUPOS_AGREGADO,
  type AgregadoDef,
} from '@/lib/mock/agregados'
import type { CapaVisual } from '@/lib/mock/menu'
import { pesos } from '@/lib/formato'
import { Campo, MensajeError, Modal } from '@/components/ui'

const ORDEN_GRUPO: AgregadoDef['grupo'][] = ['aderezo', 'topping', 'extra']

export default function TablaAgregados({ items }: { items: AgregadoDef[] }) {
  const router = useRouter()
  const [editando, setEditando] = useState<AgregadoDef | 'nuevo' | null>(null)
  const [verInactivos, setVerInactivos] = useState(true)

  async function cambiarActivo(a: AgregadoDef) {
    await toggleAgregado(a.id, !a.activo)
    router.refresh()
  }

  return (
    <div className="space-y-7">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <p className="text-sm text-[var(--ink-soft)]">
            Lo que se puede sumar o sacar al armar en caja. Precio y si se cobra por defecto.
          </p>
          <label className="flex items-center gap-1.5 text-xs text-[var(--ink-soft)] cursor-pointer mt-2">
            <input type="checkbox" checked={verInactivos} onChange={e => setVerInactivos(e.target.checked)} />
            Mostrar desactivados
          </label>
        </div>
        <button type="button" onClick={() => setEditando('nuevo')} className="btn btn-primary">+ Agregado</button>
      </div>

      {ORDEN_GRUPO.map(grupo => {
        const lista = items.filter(a => a.grupo === grupo && (verInactivos || a.activo))
        if (lista.length === 0) return null
        return (
          <div key={grupo}>
            <h2 className="eyebrow font-semibold mb-2.5">{GRUPOS_AGREGADO[grupo]}</h2>
            <div className="card overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="num">Precio</th>
                    <th>Cobrar por defecto</th>
                    <th>Activo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map(a => (
                    <tr key={a.id} className={a.activo ? '' : 'opacity-50'}>
                      <td>
                        <p className="font-medium">{a.nombre}</p>
                        <p className="text-[11px] text-[var(--ink-soft)]">capa · {a.capa.replace(/_/g, ' ')}</p>
                      </td>
                      <td className="num tabular font-semibold">{pesos(a.precio)}</td>
                      <td>
                        <span className={`chip ${a.cobrar_por_defecto ? 'chip-ember' : 'chip-ok'}`}>
                          {a.cobrar_por_defecto ? 'Se cobra' : 'Gratis'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => cambiarActivo(a)}
                          className={`chip ${a.activo ? 'chip-ok' : 'chip-neutral'} cursor-pointer`}
                        >
                          {a.activo ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td className="text-right">
                        <button type="button" onClick={() => setEditando(a)} className="btn btn-sm">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-[var(--ink-soft)]">
        En caja el tilde “Cobrar” se puede cambiar por pedido. Acá definís el valor y el default.
      </p>

      {editando && (
        <AgregadoModal
          agregado={editando === 'nuevo' ? null : editando}
          onClose={() => setEditando(null)}
          onSaved={() => { setEditando(null); router.refresh() }}
        />
      )}
    </div>
  )
}

function AgregadoModal({
  agregado,
  onClose,
  onSaved,
}: {
  agregado: AgregadoDef | null
  onClose: () => void
  onSaved: () => void
}) {
  const [nombre, setNombre] = useState(agregado?.nombre ?? '')
  const [precio, setPrecio] = useState(agregado ? String(agregado.precio) : '')
  const [grupo, setGrupo] = useState<AgregadoDef['grupo']>(agregado?.grupo ?? 'topping')
  const [capa, setCapa] = useState<CapaVisual>(agregado?.capa ?? 'lechuga')
  const [cobrar, setCobrar] = useState(agregado?.cobrar_por_defecto ?? true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar() {
    setError(null)
    if (!nombre.trim()) return setError('Falta el nombre.')
    const n = Number(precio.replace(',', '.'))
    if (!Number.isFinite(n) || n < 0) return setError('Revisá el precio.')
    setGuardando(true)
    const r = await guardarAgregado({
      id: agregado?.id,
      nombre,
      precio: n,
      grupo,
      capa,
      cobrar_por_defecto: cobrar,
    })
    setGuardando(false)
    if (r.error) return setError(r.error)
    onSaved()
  }

  return (
    <Modal open titulo={agregado ? `Editar ${agregado.nombre}` : 'Nuevo agregado'} onClose={onClose}>
      <div className="space-y-3">
        <Campo label="Nombre">
          <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} autoFocus placeholder="Ej. Champiñones" />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Grupo">
            <select className="input" value={grupo} onChange={e => setGrupo(e.target.value as AgregadoDef['grupo'])}>
              {ORDEN_GRUPO.map(g => (
                <option key={g} value={g}>{GRUPOS_AGREGADO[g]}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Precio" ayuda="0 = sin cargo aunque diga cobrar">
            <input className="input" inputMode="decimal" value={precio} onChange={e => setPrecio(e.target.value)} />
          </Campo>
        </div>
        <Campo label="Capa visual" ayuda="Cómo se dibuja en el despiece">
          <select className="input" value={capa} onChange={e => setCapa(e.target.value as CapaVisual)}>
            {CAPAS_PARA_AGREGADO.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Campo>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={cobrar} onChange={e => setCobrar(e.target.checked)} />
          Cobrar por defecto al sumarlo en caja
        </label>
        <MensajeError error={error} />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn">Cancelar</button>
          <button type="button" onClick={guardar} disabled={guardando} className="btn btn-primary">
            {guardando ? 'Guardando...' : agregado ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
