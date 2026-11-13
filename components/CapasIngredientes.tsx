import type { CapaVisual } from '@/lib/mock/menu'

const vb = '0 0 320 56'

const LABEL_CAPA: Record<CapaVisual, string> = {
  pan_arriba: 'Pan (tapa)',
  pan_abajo: 'Pan (base)',
  carne: 'Carne',
  cheddar: 'Cheddar',
  panceta: 'Panceta',
  huevo: 'Huevo',
  lechuga: 'Lechuga',
  tomate: 'Tomate',
  cebolla: 'Cebolla',
  cebolla_morada: 'Cebolla morada',
  cebolla_caramelizada: 'Cebolla caramelizada',
  cebolla_pluma: 'Cebolla en pluma',
  crispy: 'Cebollita crispy',
  aros: 'Aros de cebolla',
  pepinos: 'Pepinos',
  salsa_triple: 'Salsa triple',
  salsa_sazon: 'Salsa La Sazón',
  salsa_panceta: 'Salsa de panceta',
  bbq: 'Barbacoa',
  mostaza: 'Mostaza y ketchup',
  masa: 'Masa',
  salsa_tomate: 'Salsa de tomate',
  muzza: 'Muzzarella',
  azul: 'Queso azul',
  parmesano: 'Parmesano',
  jamon: 'Jamón',
  pepperoni: 'Pepperoni',
  cherry: 'Cherry',
  albahaca: 'Albahaca',
  morrones: 'Morrones',
  nueces: 'Nueces',
  oliva: 'Aceite de oliva',
  caja: 'Caja',
}

export function labelCapa(capa: CapaVisual, etiqueta?: string) {
  return etiqueta?.trim() || LABEL_CAPA[capa] || capa.replace(/_/g, ' ')
}

/** SVG + nombre a la par, para que se entienda cada capa. */
export function CapaFila({
  capa,
  etiqueta,
  overlap = -10,
  first = false,
  activo = false,
  onClick,
}: {
  capa: CapaVisual
  etiqueta?: string
  overlap?: number
  first?: boolean
  activo?: boolean
  onClick?: () => void
}) {
  const nombre = labelCapa(capa, etiqueta)
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full text-left transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${activo ? 'bg-white/[0.06] ring-1 ring-[var(--gold)]/40 rounded-lg' : onClick ? 'hover:bg-white/[0.03] rounded-lg' : ''}`}
      style={{ marginTop: first ? 0 : overlap }}
    >
      <div className="flex-1 min-w-0 px-0.5">
        <CapaSvg capa={capa} />
      </div>
      <span
        className={`shrink-0 w-[6.5rem] sm:w-28 text-[11px] sm:text-xs leading-snug font-medium pr-1 ${
          activo ? 'text-[var(--gold)]' : 'text-[var(--ink-soft)]'
        }`}
      >
        {nombre}
      </span>
    </Wrapper>
  )
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox={vb} className={className ?? 'w-full h-auto block'} aria-hidden>
      {children}
    </svg>
  )
}

export function CapaSvg({ capa }: { capa: CapaVisual }) {
  switch (capa) {
    case 'pan_arriba':
      return (
        <Frame>
          <ellipse cx="160" cy="38" rx="118" ry="14" fill="#8B5A2B" opacity="0.35" />
          <path d="M42 40c8-22 40-34 118-34s110 12 118 34c-6 10-48 16-118 16S48 50 42 40z" fill="#E8B56A" />
          <path d="M52 36c10-18 38-28 108-28s98 10 108 28" fill="none" stroke="#C4893A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="22" r="3.2" fill="#F5E6C8" />
          <circle cx="140" cy="16" r="2.8" fill="#F5E6C8" />
          <circle cx="175" cy="20" r="3" fill="#F5E6C8" />
          <circle cx="210" cy="17" r="2.6" fill="#F5E6C8" />
          <circle cx="125" cy="28" r="2.4" fill="#F5E6C8" />
          <circle cx="190" cy="28" r="2.5" fill="#F5E6C8" />
        </Frame>
      )
    case 'pan_abajo':
      return (
        <Frame>
          <ellipse cx="160" cy="42" rx="116" ry="10" fill="#8B5A2B" opacity="0.3" />
          <path d="M44 22c4-8 40-14 116-14s112 6 116 14c2 10-40 20-116 20S42 32 44 22z" fill="#D4A05A" />
          <path d="M54 24c8-6 40-10 106-10s98 4 106 10" fill="none" stroke="#B8843E" strokeWidth="2.5" />
        </Frame>
      )
    case 'carne':
      return (
        <Frame>
          <ellipse cx="160" cy="40" rx="112" ry="10" fill="#3a1f14" opacity="0.35" />
          <path d="M50 28c10-14 45-20 110-20s100 6 110 20c4 10-40 18-110 18S46 38 50 28z" fill="#6B2E1F" />
          <path d="M70 26c20-8 55-12 90-8 30 4 55 10 70 16" fill="none" stroke="#8B4532" strokeWidth="4" strokeLinecap="round" />
          <path d="M85 34c25-6 60-8 95-4" fill="none" stroke="#4A1F14" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="120" cy="30" rx="8" ry="3" fill="#C4785A" opacity="0.35" />
          <ellipse cx="200" cy="28" rx="10" ry="3.5" fill="#C4785A" opacity="0.3" />
        </Frame>
      )
    case 'cheddar':
      return (
        <Frame>
          <path d="M48 30c0-6 20-14 112-14s112 8 112 14c8 4 4 14-8 16-30 4-70 6-104 6s-74-2-104-6c-12-2-16-12-8-16z" fill="#F0B429" />
          <path d="M60 28c25-6 70-8 110-4 35 4 60 10 80 14" fill="none" stroke="#E09A12" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M70 38c40 4 90 4 140 0" fill="none" stroke="#FFD666" strokeWidth="2" opacity="0.5" />
          <path d="M55 34c-4 8 8 14 22 12" fill="#E89B10" opacity="0.55" />
          <path d="M255 32c6 8-4 14-18 12" fill="#E89B10" opacity="0.55" />
        </Frame>
      )
    case 'panceta':
      return (
        <Frame>
          <path d="M55 22c40-8 90 2 140 8 30 4 55 2 70-4l4 10c-20 8-50 12-85 8-45-6-95-12-130-4z" fill="#E8A0A8" />
          <path d="M60 28c45-6 95 4 140 8 25 2 45 0 58-4" fill="none" stroke="#F5D0D4" strokeWidth="5" strokeLinecap="round" />
          <path d="M70 34c40-4 85 2 125 6" fill="none" stroke="#8B2E2E" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
          <path d="M50 36c35 6 80 10 130 6 35-2 60-6 78-12" fill="#D47878" opacity="0.85" />
          <path d="M55 40c40 4 90 6 140 2" fill="none" stroke="#F2C4C8" strokeWidth="2.5" opacity="0.6" />
        </Frame>
      )
    case 'huevo':
      return (
        <Frame>
          <ellipse cx="160" cy="30" rx="78" ry="20" fill="#F7F1DE" />
          <ellipse cx="160" cy="30" rx="78" ry="20" fill="none" stroke="#E8D9B0" strokeWidth="2" />
          <ellipse cx="168" cy="30" rx="28" ry="16" fill="#F0B429" />
          <ellipse cx="160" cy="26" rx="14" ry="8" fill="#FFD666" opacity="0.55" />
          <path d="M100 22c10-4 20 2 18 8" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.5" />
        </Frame>
      )
    case 'lechuga':
      return (
        <Frame>
          <path d="M45 30c15-16 40-22 70-18 20 3 35-8 55-8s40 12 55 10c25-2 45 8 50 18-5 12-30 18-60 16-25-2-40 8-60 8s-40-10-60-8c-28 2-48-6-50-18z" fill="#5FA84A" />
          <path d="M70 28c20-8 40-4 55 2M130 22c15-6 35-4 50 4M190 24c18-6 40 0 50 8" fill="none" stroke="#7BC45E" strokeWidth="3" strokeLinecap="round" />
          <path d="M85 36c25 4 50 2 70-4M165 38c22 2 45-2 60-8" fill="none" stroke="#3F7A32" strokeWidth="2" opacity="0.45" />
        </Frame>
      )
    case 'tomate':
      return (
        <Frame>
          <ellipse cx="118" cy="30" rx="48" ry="14" fill="#D64545" />
          <ellipse cx="202" cy="30" rx="48" ry="14" fill="#C73A3A" />
          <ellipse cx="118" cy="26" rx="30" ry="6" fill="#E86A6A" opacity="0.45" />
          <ellipse cx="202" cy="26" rx="28" ry="5" fill="#E86A6A" opacity="0.4" />
          <path d="M90 30h55M175 30h55" fill="none" stroke="#A82828" strokeWidth="1.5" opacity="0.4" />
        </Frame>
      )
    case 'cebolla':
    case 'cebolla_pluma':
      return (
        <Frame>
          <path d="M55 34c25-14 50-18 80-10 20 5 40-8 65-8 30 0 55 10 65 18-15 8-40 12-70 8-25-3-45 8-70 8-30 0-55-6-70-16z" fill="#F0D9A0" />
          <path d="M70 32c20-8 45-10 70-4M150 26c22-6 48-4 70 4" fill="none" stroke="#E8C878" strokeWidth="2.5" />
          <path d="M85 38c30 2 60 0 90-6" fill="none" stroke="#D4B56A" strokeWidth="2" opacity="0.6" />
        </Frame>
      )
    case 'cebolla_morada':
      return (
        <Frame>
          <path d="M55 34c25-14 50-18 80-10 20 5 40-8 65-8 30 0 55 10 65 18-15 8-40 12-70 8-25-3-45 8-70 8-30 0-55-6-70-16z" fill="#B07AC8" />
          <path d="M70 32c20-8 45-10 70-4M150 26c22-6 48-4 70 4" fill="none" stroke="#C99ADE" strokeWidth="2.5" />
          <path d="M85 38c30 2 60 0 90-6" fill="none" stroke="#8A4FA0" strokeWidth="2" opacity="0.55" />
        </Frame>
      )
    case 'cebolla_caramelizada':
      return (
        <Frame>
          <path d="M50 34c30-16 60-20 95-10 25 7 45-6 75-6 28 0 50 10 60 16-12 10-40 14-75 10-28-3-50 8-80 8-32 0-58-8-75-18z" fill="#C4782A" />
          <path d="M70 30c25-10 55-12 85-4M160 24c25-6 50-2 75 8" fill="none" stroke="#E0A040" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 38c35 4 70 2 105-6" fill="none" stroke="#8B4A18" strokeWidth="2" opacity="0.5" />
        </Frame>
      )
    case 'crispy':
      return (
        <Frame>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
            const x = 55 + i * 26
            const y = 22 + (i % 3) * 6
            const rot = -25 + i * 8
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
                <ellipse cx="0" cy="0" rx="14" ry="4" fill={i % 2 ? '#E8A84A' : '#D49030'} />
                <ellipse cx="-2" cy="-1" rx="6" ry="1.5" fill="#F5C86A" opacity="0.5" />
              </g>
            )
          })}
        </Frame>
      )
    case 'aros':
      return (
        <Frame>
          <ellipse cx="100" cy="30" rx="28" ry="14" fill="none" stroke="#E0A040" strokeWidth="8" />
          <ellipse cx="100" cy="30" rx="28" ry="14" fill="none" stroke="#C4782A" strokeWidth="2.5" />
          <ellipse cx="160" cy="28" rx="30" ry="15" fill="none" stroke="#E8B84A" strokeWidth="8" />
          <ellipse cx="160" cy="28" rx="30" ry="15" fill="none" stroke="#C49030" strokeWidth="2.5" />
          <ellipse cx="220" cy="32" rx="26" ry="13" fill="none" stroke="#D49838" strokeWidth="8" />
          <ellipse cx="220" cy="32" rx="26" ry="13" fill="none" stroke="#A86820" strokeWidth="2.5" />
        </Frame>
      )
    case 'pepinos':
      return (
        <Frame>
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(${70 + i * 48} 28) rotate(${-18 + i * 10})`}>
              <ellipse cx="0" cy="0" rx="22" ry="10" fill="#6FBF5A" />
              <ellipse cx="0" cy="0" rx="14" ry="5" fill="#A8E090" opacity="0.45" />
              <circle cx="-8" cy="-2" r="1.5" fill="#4A9038" opacity="0.5" />
              <circle cx="4" cy="2" r="1.2" fill="#4A9038" opacity="0.5" />
            </g>
          ))}
        </Frame>
      )
    case 'salsa_triple':
      return salsa('#E8C070', '#D4A040')
    case 'salsa_sazon':
      return salsa('#C45A3A', '#A04028')
    case 'salsa_panceta':
      return salsa('#B85A4A', '#8B3830')
    case 'bbq':
      return salsa('#5C2A18', '#3A1810')
    case 'mostaza':
      return salsa('#E8B84A', '#C73A3A', true)
    case 'masa':
      return (
        <Frame>
          <ellipse cx="160" cy="30" rx="120" ry="22" fill="#E8C89A" />
          <ellipse cx="160" cy="30" rx="108" ry="16" fill="#F0D8B0" />
          <ellipse cx="160" cy="30" rx="120" ry="22" fill="none" stroke="#C4A070" strokeWidth="3" />
        </Frame>
      )
    case 'salsa_tomate':
      return (
        <Frame>
          <ellipse cx="160" cy="30" rx="100" ry="14" fill="#C73A3A" />
          <ellipse cx="160" cy="28" rx="70" ry="7" fill="#E85A5A" opacity="0.35" />
        </Frame>
      )
    case 'muzza':
      return (
        <Frame>
          <path d="M55 32c20-12 50-16 85-10 25 4 40-6 70-6s55 10 70 16c-10 8-40 12-75 10-30-2-50 6-80 6s-55-6-70-16z" fill="#F5F0E0" />
          <path d="M80 28c30-6 60-4 90 2M170 24c25-4 50 2 65 8" fill="none" stroke="#E8E0C8" strokeWidth="4" strokeLinecap="round" />
        </Frame>
      )
    case 'azul':
      return (
        <Frame>
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} transform={`translate(${70 + i * 42} ${24 + (i % 2) * 8}) rotate(${i * 12})`}>
              <rect x="-16" y="-6" width="32" height="12" rx="3" fill="#D8E4F0" />
              <circle cx="-6" cy="0" r="2" fill="#5A7AB0" />
              <circle cx="4" cy="-2" r="1.5" fill="#6A8AC0" />
              <circle cx="8" cy="2" r="1.8" fill="#4A6A9A" />
            </g>
          ))}
        </Frame>
      )
    case 'parmesano':
      return (
        <Frame>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <circle key={i} cx={70 + i * 28} cy={26 + (i % 3) * 6} r={3 + (i % 2)} fill="#F0E0B0" />
          ))}
          {[0, 1, 2, 3, 4].map(i => (
            <circle key={`b${i}`} cx={85 + i * 32} cy={36 - (i % 2) * 5} r={2.2} fill="#E8D090" />
          ))}
        </Frame>
      )
    case 'jamon':
      return (
        <Frame>
          <path d="M55 28c40-10 90-4 140 4 30 5 55 2 70-4v12c-20 8-55 10-90 4-50-8-95-12-120-2z" fill="#E8A0A8" />
          <path d="M70 32c45-6 95 2 140 6" fill="none" stroke="#F5C8CC" strokeWidth="4" />
        </Frame>
      )
    case 'pepperoni':
      return (
        <Frame>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i} transform={`translate(${65 + (i % 3) * 55} ${22 + Math.floor(i / 3) * 16})`}>
              <circle cx="0" cy="0" r="14" fill="#C43A3A" />
              <circle cx="-4" cy="-3" r="2" fill="#8B2828" opacity="0.5" />
              <circle cx="5" cy="2" r="1.8" fill="#8B2828" opacity="0.45" />
              <circle cx="2" cy="-5" r="1.4" fill="#8B2828" opacity="0.4" />
            </g>
          ))}
        </Frame>
      )
    case 'cherry':
      return (
        <Frame>
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} transform={`translate(${75 + i * 40} ${26 + (i % 2) * 6})`}>
              <circle cx="0" cy="0" r="11" fill="#D64545" />
              <ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="#F08080" opacity="0.45" />
              <path d="M0-11v-4" stroke="#3F7A32" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
        </Frame>
      )
    case 'albahaca':
      return (
        <Frame>
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(${90 + i * 40} 30) rotate(${-30 + i * 18})`}>
              <ellipse cx="0" cy="0" rx="16" ry="7" fill="#3F9A4A" />
              <path d="M-10 0h20" stroke="#2A6A32" strokeWidth="1.5" opacity="0.5" />
            </g>
          ))}
        </Frame>
      )
    case 'morrones':
      return (
        <Frame>
          <path d="M60 28c20-12 40-10 55 0 8 6 20 4 30-2 15-8 35-6 50 2 12 6 28 4 40-2l5 10c-15 10-35 12-55 4-15-6-30-2-42 4-18 8-40 6-58-2-12-5-25-4-30 0z" fill="#D45A3A" />
          <path d="M75 30c18-8 35-6 48 2M165 26c20-6 40-2 55 6" fill="none" stroke="#E88060" strokeWidth="3" />
        </Frame>
      )
    case 'nueces':
      return (
        <Frame>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i} transform={`translate(${75 + i * 32} ${26 + (i % 2) * 8}) rotate(${i * 20})`}>
              <ellipse cx="0" cy="0" rx="12" ry="8" fill="#A87840" />
              <path d="M-6-2c4 4 8 4 12 0M-4 2c3 3 7 3 10 0" fill="none" stroke="#7A5028" strokeWidth="1.5" />
            </g>
          ))}
        </Frame>
      )
    case 'oliva':
      return (
        <Frame>
          <path d="M70 20c40 4 80 8 120 4 30-2 50 6 60 12-40 6-90 4-140 0-25-2-40-8-40-16z" fill="#7A9A3A" opacity="0.55" />
          <ellipse cx="140" cy="28" rx="50" ry="4" fill="#C4D46A" opacity="0.35" />
        </Frame>
      )
    case 'caja':
      return (
        <Frame>
          <rect x="70" y="14" width="180" height="30" rx="4" fill="#E8D4A8" stroke="#C4A870" strokeWidth="2" />
          <path d="M70 28h180" stroke="#C4A870" strokeWidth="1.5" opacity="0.5" />
          <text x="160" y="33" textAnchor="middle" fill="#8B6914" fontSize="9" fontFamily="system-ui" fontWeight="700">LA SAZÓN</text>
        </Frame>
      )
    default:
      return (
        <Frame>
          <rect x="60" y="18" width="200" height="22" rx="8" fill="#6f6356" opacity="0.35" />
        </Frame>
      )
  }
}

function salsa(a: string, b: string, split = false) {
  if (split) {
    return (
      <Frame>
        <path d="M55 28c40-10 70-6 100 0" fill={a} opacity="0.95" />
        <path d="M155 28c40-8 70-4 105 2" fill={b} opacity="0.95" />
        <path d="M60 34c35 6 70 4 100-2M170 36c30 4 60 2 85-4" fill="none" stroke={a} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </Frame>
    )
  }
  return (
    <Frame>
      <path d="M48 30c25-12 55-16 90-8 30 6 50-4 80-4 35 0 60 10 72 16-18 8-50 12-88 8-35-4-55 6-90 6-35 0-60-8-64-18z" fill={a} />
      <path d="M70 28c30-8 65-6 95 2M175 24c28-4 55 4 70 10" fill="none" stroke={b} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <circle cx="100" cy="36" r="3" fill={b} opacity="0.5" />
      <circle cx="200" cy="38" r="2.5" fill={b} opacity="0.45" />
      <circle cx="150" cy="40" r="2" fill={b} opacity="0.4" />
    </Frame>
  )
}
