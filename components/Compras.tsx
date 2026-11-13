'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { actualizarPreciosCompra, anularCompra, crearCompra, marcarPagada, recibirCompra } from '@/app/actions/compras'
import { MEDIOS_PAGO } from '@/lib/catalogo'
import { cantidad, duracionHoras, fecha, fechaHora, linkWhatsApp, num, pesos } from '@/lib/formato'
import { Campo, MensajeError, Modal } from '@/components/ui'
import ConfirmModal from '@/components/ConfirmModal'

export interface ItemCompra {
  id: string
  insumo_id: string
  nombre: string
  unidad: string
  unidad_compra: string
  equivalencia: number
  cantidad_pedida: number
  cantidad_recibida: number | null
  precio: number
}

export interface CompraFila {
  id: string
  numero: number
  estado: 'pedida' | 'recibida' | 'cancelada'
  pedida_en: string
  recibida_en: string | null
  total: number
  pagada: boolean
  medio_pago: string | null
  comprobante: string | null
  notas: string | null
  proveedor_id: string
  proveedor: string
  proveedor_telefono: string | null
  proveedor_contacto: string | null
  demora_prometida_horas: number | null
  horas: number
  items: ItemCompra[]
}

export interface DatosFormCompra {
  proveedores: {
    id: string
    nombre: string
    telefono: string | null
    contacto: string | null
    dias_entrega: string | null
    demora_prometida_horas: number | null
    pedido_minimo: number | null
    condicion_pago: string | null
  }[]
  insumos: {
    id: string
    nombre: string
    categoria: string
    unidad: string
    unidad_compra: string
    equivalencia: number
    stock_actual: number
    stock_minimo: number
    costo_unitario: number
    en_camino: number
    consumo_diario: number
  }[]
  precios: { proveedor_id: string; insumo_id: string; precio: number; fecha: string }[]
}

export function mensajePedido(c: { proveedor_contacto: string | null; items: { nombre: string; cantidad_pedida: number; unidad_compra: string }[] }): string {
  const lineas = c.items.map(i => `• ${num(i.cantidad_pedida)} ${i.unidad_compra} de ${i.nombre}`).join('\n')
  return `Hola${c.proveedor_contacto ? ' ' + c.proveedor_contacto : ''}! Te paso el pedido de La Sazón:\n\n${lineas}\n\n¿Me cotizás el total y me confirmás cuándo puede llegar? Gracias!`
}

export default function Compras({
  compras,
  filtro,
  abrirNueva,
  proveedorInicial,
  verId,
  form,
}: {
  compras: CompraFila[]
  filtro: string
  abrirNueva: boolean
  proveedorInicial: string | null
  verId: string | null
  form: DatosFormCompra
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [lista, setLista] = useState(compras)
  const [nueva, setNueva] = useState(abrirNueva)
  const [abierta, setAbierta] = useState<string | null>(verId)
  const [recibiendo, setRecibiendo] = useState<CompraFila | null>(null)
  const [anulando, setAnulando] = useState<CompraFila | null>(null)
  const [aviso, setAviso] = useState<{ texto: string; wa?: string | null } | null>(null)

  useEffect(() => { setLista(compras) }, [compras])

  function irA(f: string) {
    const p = new URLSearchParams(params.toString())
    p.delete('nueva')
    p.delete('ver')
    if (f === 'todas') p.delete('filtro')
    else p.set('filtro', f)
    router.push(`${pathname}?${p.toString()}`)
  }

  function cerrarNueva() {
    setNueva(false)
    if (params.get('nueva')) {
      const p = new URLSearchParams(params.toString())
      p.delete('nueva')
      p.delete('proveedor')
      router.replace(`${pathname}?${p.toString()}`)
    }
  }

  async function togglePagada(c: CompraFila) {
    const next = !c.pagada
    setLista(prev => prev.map(x => x.id === c.id ? { ...x, pagada: next, medio_pago: next ? x.medio_pago : null } : x))
    const r = await marcarPagada(c.id, next, null)
    if (r.error) {
      setLista(prev => prev.map(x => x.id === c.id ? { ...x, pagada: c.pagada, medio_pago: c.medio_pago } : x))
      setAviso({ texto: r.error })
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1 bg-[var(--paper-card)] border border-[var(--paper-line)] rounded-lg p-1">
          {[['todas', 'Últimas'], ['por_recibir', 'Por recibir'], ['sin_pagar', 'Sin pagar']].map(([v, l]) => (
            <button key={v} onClick={() => irA(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${filtro === v ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--paper)]'}`}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => setNueva(true)} className="btn btn-primary">+ Nueva compra</button>
      </div>

      {aviso && (
        <div className={`card px-4 py-3.5 text-sm flex flex-wrap items-center justify-between gap-3 ${
          aviso.wa ? 'bg-[var(--ok-bg)] border-[var(--ok)]/35' : 'bg-[var(--ok-bg)] border-[var(--ok)]/30'
        }`}>
          <div>
            <p className="font-medium text-[var(--ink)]">{aviso.texto}</p>
            {aviso.wa && <p className="text-xs text-[var(--ink-soft)] mt-0.5">Mandale el pedido ahora para que te cotice y confirme la entrega.</p>}
          </div>
          <div className="flex gap-2 items-center">
            {aviso.wa && (
              <a href={aviso.wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember">
                Abrir WhatsApp
              </a>
            )}
            <button onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="px-1 text-[var(--ink-soft)]">×</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {lista.length === 0 ? (
          <p className="px-6 py-10 text-center sub">No hay compras para mostrar.</p>
        ) : (
          <ul className="divide-y divide-[var(--paper-line)]">
            {lista.map(c => {
              const atrasada = c.estado === 'pedida' && c.demora_prometida_horas != null && c.horas > c.demora_prometida_horas
              const tarde = c.estado === 'recibida' && c.demora_prometida_horas != null && c.horas > c.demora_prometida_horas
              const incompleta = c.estado === 'recibida' && c.items.some(i => (i.cantidad_recibida ?? 0) < i.cantidad_pedida)
              const wa = c.estado === 'pedida' ? linkWhatsApp(c.proveedor_telefono, mensajePedido(c)) : null
              return (
                <li key={c.id} className={c.estado === 'cancelada' ? 'opacity-55' : ''}>
                  <div className="px-4 md:px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <button onClick={() => setAbierta(abierta === c.id ? null : c.id)} className="flex-1 min-w-[230px] text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[var(--ink-soft)] tabular">#{c.numero}</span>
                        <span className={`text-sm font-semibold ${c.pagada ? 'line-through text-[var(--ink-soft)]' : ''}`}>{c.proveedor}</span>
                        <span className="text-xs text-[var(--ink-soft)]">· pedida {fechaHora(c.pedida_en)}</span>
                      </div>
                      <p className="text-xs text-[var(--ink-soft)] mt-0.5 line-clamp-1">
                        {c.items.map(i => `${num(i.cantidad_pedida)} ${i.unidad_compra} ${i.nombre}`).join(', ')}
                      </p>
                    </button>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.estado === 'pedida' && (
                        <span className={`chip ${atrasada ? 'chip-danger' : 'chip-info'}`}>
                          {atrasada ? `Atrasada · ${duracionHoras(c.horas)}` : `En camino · ${duracionHoras(c.horas)}`}
                        </span>
                      )}
                      {c.estado === 'recibida' && (
                        <span className={`chip ${tarde ? 'chip-warn' : 'chip-ok'}`}>Llegó en {duracionHoras(c.horas)}</span>
                      )}
                      {incompleta && <span className="chip chip-warn">Incompleta</span>}
                      {c.estado === 'cancelada' && <span className="chip chip-danger">Anulada</span>}
                      {c.estado === 'recibida' && (
                        <button
                          onClick={() => togglePagada(c)}
                          className={`chip ${c.pagada ? 'chip-ok line-through' : 'chip-danger'} cursor-pointer`}
                          title={c.pagada ? 'Marcar como sin pagar' : 'Marcar como pagada'}
                        >
                          {c.pagada ? 'Pagada' : 'Sin pagar'}
                        </button>
                      )}
                    </div>
                    <span className={`text-sm font-semibold tabular w-24 text-right ${c.pagada ? 'line-through text-[var(--ink-soft)]' : ''}`}>{pesos(c.total)}</span>
                    <div className="flex gap-1.5">
                      {c.estado === 'pedida' && <button onClick={() => setRecibiendo(c)} className="btn btn-sm btn-primary">Precios / recibir</button>}
                      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ember" title="Mandar el pedido por WhatsApp">WhatsApp</a>}
                    </div>
                  </div>

                  {abierta === c.id && (
                    <div className="px-4 md:px-5 pb-4 bg-[var(--paper)]/60">
                      <table className="tabla mt-2">
                        <thead>
                          <tr><th>Insumo</th><th className="num">Pedido</th><th className="num">Recibido</th><th className="num">Precio</th><th className="num">Subtotal</th></tr>
                        </thead>
                        <tbody>
                          {c.items.map(i => {
                            const recibido = i.cantidad_recibida ?? (c.estado === 'pedida' ? null : i.cantidad_pedida)
                            return (
                              <tr key={i.id}>
                                <td>
                                  <Link href={`/stock/${i.insumo_id}`} className="hover:underline">{i.nombre}</Link>
                                  {i.equivalencia !== 1 && (
                                    <span className="text-[11px] text-[var(--ink-soft)]"> · {cantidad(i.cantidad_pedida * i.equivalencia, i.unidad)}</span>
                                  )}
                                </td>
                                <td className="num tabular">{num(i.cantidad_pedida)} {i.unidad_compra}</td>
                                <td className={`num tabular ${recibido != null && recibido < i.cantidad_pedida ? 'text-[var(--warn)] font-semibold' : ''}`}>
                                  {recibido == null ? '-' : `${num(recibido)} ${i.unidad_compra}`}
                                </td>
                                <td className="num tabular">{pesos(i.precio)}</td>
                                <td className="num tabular">{pesos((recibido ?? i.cantidad_pedida) * i.precio)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <div className="flex flex-wrap justify-between gap-3 mt-3 text-xs text-[var(--ink-soft)]">
                        <div className="space-y-0.5">
                          {c.recibida_en && <p>Recibida: {fechaHora(c.recibida_en)}{c.demora_prometida_horas != null ? ` · prometían ${duracionHoras(c.demora_prometida_horas)}` : ''}</p>}
                          {c.medio_pago && <p>Pago: {MEDIOS_PAGO[c.medio_pago] ?? c.medio_pago}</p>}
                          {c.comprobante && <p>Comprobante: {c.comprobante}</p>}
                          {c.notas && <p>Notas: {c.notas}</p>}
                        </div>
                        {c.estado !== 'cancelada' && (
                          <button onClick={() => setAnulando(c)} className="text-[var(--danger)] hover:underline">Anular compra</button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {nueva && (
        <NuevaCompraModal
          form={form}
          proveedorInicial={proveedorInicial}
          onClose={cerrarNueva}
          onSaved={(texto, wa) => { cerrarNueva(); setAviso({ texto, wa }); router.refresh() }}
        />
      )}
      {recibiendo && (
        <RecibirModal
          compra={recibiendo}
          onClose={() => setRecibiendo(null)}
          onSaved={(modo, pagada) => {
            const n = recibiendo.numero
            setRecibiendo(null)
            setAviso({
              texto: modo === 'precios'
                ? `Precios del pedido #${n} actualizados. Sigue pendiente de recepción.`
                : pagada
                  ? `Compra #${n} recibida y marcada como pagada. El stock ya se actualizó.`
                  : `Compra #${n} recibida. El stock ya se actualizó · queda sin pagar.`,
            })
            router.refresh()
          }}
        />
      )}
      <ConfirmModal
        open={!!anulando}
        title={`¿Anular la compra #${anulando?.numero}?`}
        description={anulando?.estado === 'recibida' ? 'Se descuenta del stock lo que había sumado esta compra y los precios que registró dejan de contar en las comparaciones.' : 'La compra queda anulada y deja de figurar como pendiente.'}
        confirmLabel="Anular"
        danger
        onCancel={() => setAnulando(null)}
        onConfirm={async () => {
          const c = anulando
          setAnulando(null)
          if (!c) return
          const r = await anularCompra(c.id)
          setAviso({ texto: r.error ?? `Compra #${c.numero} anulada.` })
          router.refresh()
        }}
      />
    </div>
  )
}

interface LineaForm {
  insumo_id: string
  cantidad: string
  precio: string
}

function NuevaCompraModal({
  form,
  proveedorInicial,
  onClose,
  onSaved,
}: {
  form: DatosFormCompra
  proveedorInicial: string | null
  onClose: () => void
  onSaved: (texto: string, wa: string | null) => void
}) {
  const [proveedorId, setProveedorId] = useState(proveedorInicial ?? '')
  const [lineas, setLineas] = useState<LineaForm[]>([{ insumo_id: '', cantidad: '', precio: '' }])
  const [yaLlego, setYaLlego] = useState(true)
  const [pagada, setPagada] = useState(false)
  const [medioPago, setMedioPago] = useState('transferencia')
  const [comprobante, setComprobante] = useState('')
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const proveedor = form.proveedores.find(p => p.id === proveedorId)
  const insumosPorId = useMemo(() => new Map(form.insumos.map(i => [i.id, i])), [form.insumos])
  const precioDe = (prov: string, ins: string) => form.precios.find(p => p.proveedor_id === prov && p.insumo_id === ins)
  const masBarato = (ins: string) => form.precios.filter(p => p.insumo_id === ins).sort((a, b) => a.precio - b.precio)[0]

  // insumos que vende este proveedor primero
  const listaProveedor = new Set(form.precios.filter(p => p.proveedor_id === proveedorId).map(p => p.insumo_id))
  const insumosOrdenados = [...form.insumos].sort((a, b) =>
    Number(listaProveedor.has(b.id)) - Number(listaProveedor.has(a.id)) || a.nombre.localeCompare(b.nombre))

  function elegirProveedor(id: string) {
    setProveedorId(id)
    // actualiza precios sugeridos de las líneas ya cargadas
    setLineas(prev => prev.map(l => {
      const p = l.insumo_id ? precioDe(id, l.insumo_id) : undefined
      return p ? { ...l, precio: String(p.precio) } : l
    }))
  }

  function cambiarLinea(idx: number, cambios: Partial<LineaForm>) {
    setLineas(prev => prev.map((l, i) => {
      if (i !== idx) return l
      const nueva = { ...l, ...cambios }
      if (cambios.insumo_id !== undefined) {
        const ins = insumosPorId.get(cambios.insumo_id)
        const p = precioDe(proveedorId, cambios.insumo_id)
        nueva.precio = p ? String(p.precio) : ins ? String(Math.round(ins.costo_unitario * ins.equivalencia)) : ''
      }
      return nueva
    }))
  }

  // Sugiere lo que está bajo el mínimo: lo que vende este proveedor (o todo, si no tiene lista)
  function sugerir() {
    const candidatos = form.insumos.filter(i =>
      i.stock_actual + i.en_camino <= i.stock_minimo * 1.2 && (listaProveedor.size === 0 || listaProveedor.has(i.id)))
    const nuevas: LineaForm[] = candidatos
      .filter(i => !lineas.some(l => l.insumo_id === i.id))
      .map(i => {
        const objetivo = Math.max(i.stock_minimo * 2, i.consumo_diario * 4)
        const falta = Math.max(0, objetivo - i.stock_actual - i.en_camino) / i.equivalencia
        const cant = ['kg', 'litro'].includes(i.unidad_compra) ? Math.ceil(falta * 2) / 2 : Math.ceil(falta)
        const p = precioDe(proveedorId, i.id)
        return { insumo_id: i.id, cantidad: String(Math.max(cant, 1)), precio: p ? String(p.precio) : String(Math.round(i.costo_unitario * i.equivalencia)) }
      })
    setLineas(prev => [...prev.filter(l => l.insumo_id), ...nuevas, ...(nuevas.length ? [] : [{ insumo_id: '', cantidad: '', precio: '' }])])
    if (nuevas.length === 0) setError(listaProveedor.size ? 'Nada de lo que vende este proveedor está bajo el mínimo.' : 'No hay insumos bajo el mínimo.')
    else setError(null)
  }

  const valores = lineas.map(l => ({
    ...l,
    n: Number(l.cantidad.replace(',', '.')),
    p: Number(l.precio.replace(',', '.')),
  }))
  const total = valores.reduce((acc, l) => acc + (l.n > 0 && l.p >= 0 ? l.n * l.p : 0), 0)

  function armarWhatsApp(items: { insumo_id: string; cantidad: number }[]) {
    if (!proveedor) return null
    return linkWhatsApp(proveedor.telefono, mensajePedido({
      proveedor_contacto: proveedor.contacto,
      items: items.map(i => {
        const ins = insumosPorId.get(i.insumo_id)
        return { nombre: ins?.nombre ?? '', cantidad_pedida: i.cantidad, unidad_compra: ins?.unidad_compra ?? '' }
      }),
    }))
  }

  async function guardar(abrirWa = false) {
    setError(null)
    if (!proveedorId) return setError('Elegí el proveedor.')
    const items = valores.filter(l => l.insumo_id).map(l => ({ insumo_id: l.insumo_id, cantidad: l.n, precio: Number.isFinite(l.p) && l.p >= 0 ? l.p : 0 }))
    if (items.some(i => !(i.cantidad > 0))) return setError('Revisá las cantidades.')
    setGuardando(true)
    const r = await crearCompra({
      proveedor_id: proveedorId,
      items,
      recibida: yaLlego,
      fecha: null,
      pagada: yaLlego && pagada,
      medio_pago: yaLlego && pagada ? medioPago : null,
      comprobante: comprobante || null,
      notas: notas || null,
    })
    setGuardando(false)
    if (r.error) return setError(r.error)

    const wa = !yaLlego ? armarWhatsApp(items) : null
    if (abrirWa && wa) window.open(wa, '_blank', 'noopener,noreferrer')
    onSaved(
      yaLlego
        ? `Compra #${r.numero} cargada y stock actualizado.`
        : `Pedido #${r.numero} a ${proveedor?.nombre} guardado. Cuando te cotice y llegue, tocá "Recibir / cargar precios".`,
      wa,
    )
  }

  return (
    <Modal open titulo="Nueva compra" onClose={onClose} ancho="max-w-3xl">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <Campo label="Proveedor">
            <select className="input" value={proveedorId} onChange={e => elegirProveedor(e.target.value)}>
              <option value="">Elegir...</option>
              {form.proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Campo>
          {proveedor && (
            <div className="text-xs text-[var(--ink-soft)] space-y-0.5 sm:pt-5">
              {proveedor.dias_entrega && <p>Entrega: {proveedor.dias_entrega}{proveedor.demora_prometida_horas != null ? ` · tarda ${duracionHoras(proveedor.demora_prometida_horas)}` : ''}</p>}
              {proveedor.condicion_pago && <p>Pago: {proveedor.condicion_pago}</p>}
              {proveedor.pedido_minimo ? <p>Pedido mínimo: {pesos(proveedor.pedido_minimo)}</p> : null}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="label mb-0">Insumos</p>
            <button onClick={sugerir} className="text-xs link">Sugerir lo que falta</button>
          </div>
          <div className="space-y-2">
            {valores.map((l, idx) => {
              const ins = insumosPorId.get(l.insumo_id)
              const mejor = l.insumo_id ? masBarato(l.insumo_id) : undefined
              const mejorProv = mejor && mejor.proveedor_id !== proveedorId ? form.proveedores.find(p => p.id === mejor.proveedor_id) : undefined
              const ahorro = mejorProv && l.p > mejor!.precio ? ((l.p - mejor!.precio) / l.p) * 100 : 0
              return (
                <div key={idx} className="rounded-lg border border-[var(--paper-line)] p-2.5">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <select className="input input-sm col-span-12 sm:col-span-5" value={l.insumo_id} onChange={e => cambiarLinea(idx, { insumo_id: e.target.value })}>
                      <option value="">Elegir insumo...</option>
                      {insumosOrdenados.map(i => (
                        <option key={i.id} value={i.id}>{i.nombre}{listaProveedor.has(i.id) ? '' : proveedorId ? ' (no está en su lista)' : ''}</option>
                      ))}
                    </select>
                    <div className="col-span-5 sm:col-span-3 flex items-center gap-1">
                      <input className="input input-sm" inputMode="decimal" placeholder="Cant." value={l.cantidad} onChange={e => cambiarLinea(idx, { cantidad: e.target.value })} />
                      <span className="text-xs text-[var(--ink-soft)] whitespace-nowrap">{ins?.unidad_compra ?? ''}</span>
                    </div>
                    <div className="col-span-5 sm:col-span-3 flex items-center gap-1">
                      <span className="text-xs text-[var(--ink-soft)]">$</span>
                      <input className="input input-sm" inputMode="decimal" placeholder="Precio" value={l.precio} onChange={e => cambiarLinea(idx, { precio: e.target.value })} />
                    </div>
                    <button onClick={() => setLineas(prev => prev.filter((_, i) => i !== idx))} className="col-span-2 sm:col-span-1 text-[var(--ink-soft)] hover:text-[var(--danger)] text-lg" aria-label="Quitar">×</button>
                  </div>
                  {ins && (
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[11px] text-[var(--ink-soft)]">
                      {l.n > 0 && ins.equivalencia !== 1 && <span>= <b className="text-[var(--ink)]">{cantidad(l.n * ins.equivalencia, ins.unidad)}</b> al stock</span>}
                      <span>Hay {cantidad(ins.stock_actual, ins.unidad)} (mín. {cantidad(ins.stock_minimo, ins.unidad)})</span>
                      {l.n > 0 && l.p > 0 && <span>Subtotal {pesos(l.n * l.p)}</span>}
                      {ahorro >= 1 && mejorProv && (
                        <span className="text-[var(--danger)] font-semibold">{mejorProv.nombre} lo tiene a {pesos(mejor!.precio)} ({num(ahorro, 0)}% menos)</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <button onClick={() => setLineas(prev => [...prev, { insumo_id: '', cantidad: '', precio: '' }])} className="btn btn-sm mt-2">+ Agregar insumo</button>
        </div>

        <div className="rounded-lg bg-[var(--paper)] p-3 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setYaLlego(true)} className={`btn btn-sm flex-1 ${yaLlego ? 'btn-primary' : ''}`}>Ya llegó: sumar al stock</button>
            <button onClick={() => setYaLlego(false)} className={`btn btn-sm flex-1 ${!yaLlego ? 'btn-primary' : ''}`}>Es un pedido: todavía no llegó</button>
          </div>
          {yaLlego ? (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={pagada} onChange={e => setPagada(e.target.checked)} /> Ya está pagada
              </label>
              {pagada && (
                <select className="input input-sm w-auto" value={medioPago} onChange={e => setMedioPago(e.target.value)}>
                  {Object.entries(MEDIOS_PAGO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              )}
              <input className="input input-sm flex-1 min-w-[150px]" placeholder="N° de factura o remito (opcional)" value={comprobante} onChange={e => setComprobante(e.target.value)} />
            </div>
          ) : (
            <p className="text-xs text-[var(--ink-soft)]">
              Queda pendiente. Los precios pueden ser estimados: después le pedís cotización por WhatsApp y, al llegar, cargás los precios reales.
            </p>
          )}
          <input className="input input-sm" placeholder="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold tabular">Total {pesos(total)}{!yaLlego && total > 0 ? <span className="text-xs font-medium text-[var(--ink-soft)]"> · estimado</span> : null}</p>
            {proveedor?.pedido_minimo && total > 0 && total < proveedor.pedido_minimo ? (
              <p className="text-xs text-[var(--warn)]">No llega al pedido mínimo de {pesos(proveedor.pedido_minimo)}</p>
            ) : null}
            {!yaLlego && proveedor && !proveedor.telefono && (
              <p className="text-xs text-[var(--warn)]">Este proveedor no tiene WhatsApp cargado.</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={onClose} className="btn">Cancelar</button>
            {!yaLlego && proveedor?.telefono ? (
              <>
                <button onClick={() => guardar(false)} disabled={guardando} className="btn">
                  {guardando ? 'Guardando...' : 'Sólo guardar'}
                </button>
                <button onClick={() => guardar(true)} disabled={guardando} className="btn btn-ember">
                  {guardando ? 'Guardando...' : 'Guardar y WhatsApp'}
                </button>
              </>
            ) : (
              <button onClick={() => guardar(false)} disabled={guardando} className="btn btn-primary">
                {guardando ? 'Guardando...' : yaLlego ? 'Guardar y sumar al stock' : 'Guardar pedido'}
              </button>
            )}
          </div>
        </div>
        <MensajeError error={error} />
      </div>
    </Modal>
  )
}

function RecibirModal({
  compra,
  onClose,
  onSaved,
}: {
  compra: CompraFila
  onClose: () => void
  onSaved: (modo: 'precios' | 'recibir', pagada?: boolean) => void
}) {
  const [items, setItems] = useState(compra.items.map(i => ({ id: i.id, recibida: String(i.cantidad_pedida), precio: String(i.precio) })))
  const [pagada, setPagada] = useState(false)
  const [medioPago, setMedioPago] = useState('efectivo')
  const [guardando, setGuardando] = useState<'precios' | 'recibir' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalEstimado = items.reduce((acc, i) => acc + compra.items.find(x => x.id === i.id)!.cantidad_pedida * (Number(i.precio.replace(',', '.')) || 0), 0)
  const totalRecibido = items.reduce((acc, i) => acc + (Number(i.recibida.replace(',', '.')) || 0) * (Number(i.precio.replace(',', '.')) || 0), 0)

  async function guardarPrecios() {
    setError(null)
    setGuardando('precios')
    const r = await actualizarPreciosCompra(
      compra.id,
      items.map(i => ({ id: i.id, precio: Number(i.precio.replace(',', '.')) })),
    )
    setGuardando(null)
    if (r.error) return setError(r.error)
    onSaved('precios')
  }

  async function confirmarRecepcion() {
    setError(null)
    setGuardando('recibir')
    const r = await recibirCompra(
      compra.id,
      items.map(i => ({ id: i.id, cantidad_recibida: Number(i.recibida.replace(',', '.')), precio: Number(i.precio.replace(',', '.')) })),
      null,
      { pagada, medio_pago: pagada ? medioPago : null },
    )
    setGuardando(null)
    if (r.error) return setError(r.error)
    onSaved('recibir', pagada)
  }

  return (
    <Modal
      open
      titulo={`Pedido #${compra.numero}`}
      subtitulo={`${compra.proveedor} · pedida ${fecha(compra.pedida_en)} · hace ${duracionHoras(compra.horas)}`}
      onClose={onClose}
      ancho="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--line-soft)] bg-white/[0.03] p-3 text-xs text-[var(--ink-soft)] space-y-1">
          <p><b className="text-[var(--ink)]">1. Cotización:</b> actualizá precios cuando te pasen el valor. El pedido sigue pendiente.</p>
          <p><b className="text-[var(--ink)]">2. Recepción:</b> cuando llega, confirmá cantidades. Podés marcarla pagada ahí mismo o dejarla pendiente.</p>
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Insumo</th>
              <th className="num">Pedido</th>
              <th>Llegó</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {compra.items.map((i, idx) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td className="num tabular">{num(i.cantidad_pedida)} {i.unidad_compra}</td>
                <td>
                  <input
                    className="input input-sm w-24"
                    inputMode="decimal"
                    value={items[idx].recibida}
                    onChange={e => setItems(prev => prev.map((x, j) => (j === idx ? { ...x, recibida: e.target.value } : x)))}
                  />
                </td>
                <td>
                  <input
                    className="input input-sm w-28"
                    inputMode="decimal"
                    value={items[idx].precio}
                    onChange={e => setItems(prev => prev.map((x, j) => (j === idx ? { ...x, precio: e.target.value } : x)))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rounded-lg bg-[var(--paper)] p-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={pagada} onChange={e => setPagada(e.target.checked)} />
            Ya está pagada
          </label>
          {pagada && (
            <select className="input input-sm w-auto" value={medioPago} onChange={e => setMedioPago(e.target.value)}>
              {Object.entries(MEDIOS_PAGO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
        </div>

        <div className="text-sm space-y-0.5">
          <p>Total cotizado: <b className="tabular">{pesos(totalEstimado)}</b></p>
          <p className="text-xs text-[var(--ink-soft)]">
            Si confirmás recepción: {pesos(totalRecibido)}
            {pagada ? ' · se suma al stock y queda marcada como pagada' : ' · se suma al stock y queda sin pagar'}
          </p>
        </div>

        <MensajeError error={error} />

        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={onClose} className="btn" disabled={!!guardando}>Cancelar</button>
          <button onClick={guardarPrecios} disabled={!!guardando} className="btn">
            {guardando === 'precios' ? 'Guardando...' : 'Actualizar precios'}
          </button>
          <button onClick={confirmarRecepcion} disabled={!!guardando} className="btn btn-primary">
            {guardando === 'recibir' ? 'Guardando...' : 'Confirmar recepción'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
