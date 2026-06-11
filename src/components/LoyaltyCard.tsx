import { Client, getProgress } from '../hooks/useAuth'

const TIER_LABELS: Record<string, string> = {
  classic: 'Classic Rewards',
  elite: 'Elite Rewards',
  black: 'Black Rewards',
}

const TIER_COLORS: Record<string, string> = {
  classic: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a10 100%)',
  elite: 'linear-gradient(135deg, #0d1520 0%, #1a2535 50%, #0d1510 100%)',
  black: 'linear-gradient(135deg, #1a1a1a 0%, #222 40%, #1a1205 100%)',
}

interface Props {
  client: Client
  animate?: boolean
}

export default function LoyaltyCard({ client, animate = true }: Props) {
  const progress = getProgress(client.purchases)
  const displayTier = progress.earnedTier ?? 'classic'
  const benefitLabel = progress.discount > 0 ? `${progress.discount}%` : '—'
  const tierLabel = TIER_LABELS[displayTier] || 'Black Rewards'
  const [name1, name2] = tierLabel.split(' ')

  return (
    <div className={`card-scene w-full ${animate ? 'float-anim' : ''}`}
      style={{ maxWidth: '420px' }}>
      <div className="card-inner" style={{ height: '260px' }}>
        {/* FRONT */}
        <div className="card-front w-full h-full rounded-2xl p-8 flex flex-col justify-between border-glow"
          style={{
            background: TIER_COLORS[displayTier],
            border: '1px solid rgba(201,168,76,0.35)',
            position: 'relative',
            overflow: 'hidden',
          }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-30%', right: '-15%',
            width: '280px', height: '280px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Subtle texture lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(201,168,76,0.015) 30px, rgba(201,168,76,0.015) 31px)',
            pointerEvents: 'none',
          }} />

          <div className="flex justify-between items-start relative">
            <div>
              <div className="text-[9px] tracking-[4px] mb-1" style={{ color: '#C9A84C' }}>GM LUXURY</div>
              <div className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
                {name1} <span style={{ color: '#C9A84C' }}>{name2}</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
              style={{ border: '1.5px solid rgba(201,168,76,0.6)', color: '#C9A84C' }}>
              ✦
            </div>
          </div>

          <div className="relative">
            <div className="text-[8px] tracking-[3px] mb-1" style={{ color: '#666' }}>MEMBER</div>
            <div className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
              {client.name}
            </div>
          </div>

          <div className="flex justify-between items-end relative">
            <div>
              <div className="text-[8px] tracking-[3px] mb-1" style={{ color: '#666' }}>CARD CODE</div>
              <div className="text-base tracking-[4px] font-medium" style={{ color: '#E8D5A3' }}>
                {client.code}
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg text-center"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)' }}>
              <div className="text-[7px] tracking-[2px] mb-0.5" style={{ color: '#C9A84C' }}>BENEFIT</div>
              <div className="text-sm font-medium" style={{ color: '#E8D5A3' }}>{benefitLabel}</div>
            </div>
          </div>
        </div>

        {/* BACK (on hover flip) */}
        <div className="card-back w-full h-full rounded-2xl p-8 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
            border: '1px solid rgba(201,168,76,0.35)',
          }}>
          <div className="shimmer-line h-10 rounded-lg" style={{ background: '#1a1a1a' }} />
          <div className="space-y-3">
            <div className="text-[9px] tracking-[3px]" style={{ color: '#555' }}>INFORMACIÓN DEL TITULAR</div>
            <div className="text-sm" style={{ color: '#888' }}>Nombre: <span style={{ color: '#E8D5A3' }}>{client.name}</span></div>
            <div className="text-sm" style={{ color: '#888' }}>Nivel: <span style={{ color: '#C9A84C', textTransform: 'capitalize' }}>{progress.earnedTier ?? 'Sin nivel'}</span></div>
            <div className="text-sm" style={{ color: '#888' }}>Descuento activo: <span style={{ color: '#E8D5A3' }}>{benefitLabel}</span></div>
            <div className="text-sm" style={{ color: '#888' }}>Miembro desde: <span style={{ color: '#E8D5A3' }}>{client.joinDate}</span></div>
          </div>
          <div className="text-[8px] tracking-[2px] text-center" style={{ color: '#333' }}>
            GM LUXURY · LUXURY BRANDS HUB · TARJETA VÁLIDA
          </div>
        </div>
      </div>
      <p className="text-center mt-3 text-[10px] tracking-[2px]" style={{ color: '#444' }}>
        PASA EL CURSOR PARA VER MÁS
      </p>
    </div>
  )
}
