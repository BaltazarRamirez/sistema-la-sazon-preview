'use client'

import { useEffect, useMemo, useState } from 'react'

const MESAS_DEFAULT = 12

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(data)}`
}

export default function CartaQrAdmin() {
  const [origin, setOrigin] = useState('')
  const [mesaFocus, setMesaFocus] = useState(1)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const urlGeneral = origin ? `${origin}/carta` : ''
  const urlMesa = origin ? `${origin}/carta?mesa=${mesaFocus}` : ''

  const mesas = useMemo(() => Array.from({ length: MESAS_DEFAULT }, (_, i) => i + 1), [])

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4 max-w-xl">
        <div>
          <h2 className="h2">Dos flujos</h2>
          <ul className="text-sm text-[var(--ink-soft)] mt-2 space-y-1.5 list-disc pl-4">
            <li>
              <b className="text-[var(--ink)]">WhatsApp</b> — link general <code className="text-xs">/carta</code>.
              El cliente arma el pedido, se carga en Ventas como pendiente y se abre el chat.
            </li>
            <li>
              <b className="text-[var(--ink)]">Mesa</b> — un QR por mesa (<code className="text-xs">/carta?mesa=7</code>).
              El pedido entra como salón · pendiente; cuando cobran, <b className="text-[var(--ink)]">Confirmar pago</b>.
            </li>
          </ul>
        </div>

        <div>
          <p className="label">Carta general (WhatsApp / take away)</p>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <code className="text-xs bg-black/25 border border-[var(--line-soft)] rounded-lg px-3 py-2 break-all flex-1 min-w-0">
              {urlGeneral || '…'}
            </code>
            <button type="button" className="btn btn-sm" disabled={!urlGeneral} onClick={() => urlGeneral && navigator.clipboard?.writeText(urlGeneral)}>
              Copiar
            </button>
            <a href={urlGeneral || '/carta'} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
              Abrir
            </a>
          </div>
          {urlGeneral && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl(urlGeneral)} alt="QR carta general" width={120} height={120} className="mt-3 rounded-xl bg-white p-2" />
          )}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="h2">QR por mesa</h2>
            <p className="text-xs text-[var(--ink-soft)] mt-1">Cada mesa tiene su identificador. Imprimí y pegá el de su número.</p>
          </div>
          <div>
            <label className="label">Vista previa mesa</label>
            <select
              className="input input-sm w-28"
              value={mesaFocus}
              onChange={e => setMesaFocus(Number(e.target.value))}
            >
              {mesas.map(m => (
                <option key={m} value={m}>Mesa {m}</option>
              ))}
            </select>
          </div>
        </div>

        {urlMesa && (
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-[var(--line-soft)] bg-white/[0.02] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl(urlMesa)} alt={`QR mesa ${mesaFocus}`} width={140} height={140} className="rounded-xl bg-white p-2" />
            <div className="text-center sm:text-left space-y-2">
              <p className="font-display text-lg font-semibold">Mesa {mesaFocus}</p>
              <code className="text-xs text-[var(--ink-soft)] break-all block">{urlMesa}</code>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button type="button" className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(urlMesa)}>
                  Copiar link
                </button>
                <a href={urlMesa} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                  Probar
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {origin && mesas.map(m => {
            const u = `${origin}/carta?mesa=${m}`
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMesaFocus(m)}
                className={`rounded-xl border p-2 text-center transition-colors ${
                  mesaFocus === m
                    ? 'border-[var(--gold)] bg-[var(--gold)]/10'
                    : 'border-[var(--line-soft)] hover:border-[var(--gold)]/40'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl(u)} alt="" width={72} height={72} className="mx-auto rounded-md bg-white p-1" />
                <p className="text-[11px] font-semibold mt-1.5">Mesa {m}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
