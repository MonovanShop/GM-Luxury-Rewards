import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import LoyaltyCard from '../components/LoyaltyCard'
import { useAuth, getProgress, MILESTONES } from '../hooks/useAuth'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TIER_INFO = {
  classic: {
    discount: '5%',
    next: 'Elite',
    nextDesc: 'Acceso superior a colecciones exclusivas',
    benefits: ['5% descuento en todas las compras', 'Acceso a eventos GM Luxury', 'Newsletter exclusivo mensual', 'Atención preferencial en tienda'],
    color: 'rgba(100,100,100,0.15)',
    border: 'rgba(100,100,100,0.3)',
  },
  elite: {
    discount: '10%',
    next: 'Black',
    nextDesc: 'El máximo estatus de la membresía',
    benefits: ['10% descuento en todas las compras', 'Acceso anticipado a colecciones', 'Invitaciones a eventos privados', 'Asesor personal de moda', 'Envío gratuito ilimitado'],
    color: 'rgba(30,80,140,0.12)',
    border: 'rgba(70,130,200,0.25)',
  },
  black: {
    discount: '15%',
    next: '—',
    nextDesc: 'Ya tienes el máximo estatus',
    benefits: ['15% descuento siempre', 'Acceso a sala VIP en boutiques', 'Gestor de cuenta dedicado', 'Experiencias exclusivas personalizadas', 'Conserjería 24/7', 'Acceso completo a Luxury Brands Hub', 'Envío express gratuito'],
    color: 'rgba(201,168,76,0.06)',
    border: 'rgba(201,168,76,0.25)',
  },
}

const TIER_ICONS = { classic: '☆', elite: '◈', black: '♛' }

export default function ClientDashboard() {
  useScrollReveal()
  const { currentClient, logoutClient } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!currentClient) { navigate('/login'); return }
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [currentClient])

  if (!currentClient) return null

  const progress = getProgress(currentClient.purchases)
  const activeTier = progress.earnedTier
  const info = TIER_INFO[activeTier ?? 'classic']
  const discountLabel = progress.discount > 0 ? `${progress.discount}%` : '—'
  const tiers = ['classic', 'elite', 'black'] as const

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A' }}>
      <Particles />
      <Navbar />

      <div
        className="relative max-w-6xl mx-auto px-6 pt-28 pb-20"
        style={{
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] tracking-[5px] mb-2" style={{ color: '#C9A84C' }}>PROGRAMA DE LEALTAD</p>
            <h1 className="text-5xl font-light leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
              Hola, {currentClient.name.split(' ')[0]}.
            </h1>
          </div>
          <button
            onClick={() => { logoutClient(); navigate('/') }}
            className="text-xs tracking-[2px] px-5 py-2.5 rounded-xl transition-all"
            style={{ border: '1px solid rgba(201,168,76,0.2)', color: '#666', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#666' }}
          >
            CERRAR SESIÓN
          </button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Card */}
          <div className="reveal-left">
            <p className="text-[10px] tracking-[4px] mb-4" style={{ color: '#555' }}>TU TARJETA</p>
            <LoyaltyCard client={currentClient} />
          </div>

          {/* Stats */}
          <div className="reveal-right space-y-4">
            <p className="text-[10px] tracking-[4px] mb-4" style={{ color: '#555' }}>RESUMEN</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-[9px] tracking-[3px] mb-2" style={{ color: '#555' }}>DESCUENTO ACTIVO</p>
                <p className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {info.discount}
                </p>
                <p className="text-[10px] mt-1" style={{ color: '#555' }}>en todas las compras</p>
              </div>
              <div className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-[9px] tracking-[3px] mb-2" style={{ color: '#555' }}>NIVEL ACTUAL</p>
                <p className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {TIER_ICONS[currentClient.tier]}
                </p>
                <p className="text-[10px] mt-1 capitalize" style={{ color: '#E8D5A3' }}>{currentClient.tier}</p>
              </div>
              <div className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-[9px] tracking-[3px] mb-2" style={{ color: '#555' }}>BENEFICIO ESPECIAL</p>
                <p className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {currentClient.benefit}
                </p>
                <p className="text-[10px] mt-1" style={{ color: '#555' }}>privilegio activo</p>
              </div>
              <div className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-[9px] tracking-[3px] mb-2" style={{ color: '#555' }}>SIGUIENTE NIVEL</p>
                <p className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {info.next}
                </p>
                <p className="text-[10px] mt-1" style={{ color: '#555' }}>{info.nextDesc.slice(0, 20)}…</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tier levels */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[4px] mb-6 reveal" style={{ color: '#555' }}>NIVELES DE MEMBRESÍA</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, i) => {
              const isActive = tier === currentClient.tier
              const ti = TIER_INFO[tier]
              return (
                <div
                  key={tier}
                  className="reveal p-6 rounded-2xl transition-all duration-300 relative"
                  style={{
                    transitionDelay: `${i * 0.1}s`,
                    background: isActive ? ti.color : '#111',
                    border: `1px solid ${isActive ? ti.border : 'rgba(201,168,76,0.1)'}`,
                  }}
                >
                  {isActive && (
                    <span className="absolute top-3 right-3 text-[8px] tracking-[2px] px-2 py-1 rounded-full pulse-gold"
                      style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                      ACTIVO
                    </span>
                  )}
                  <div className="text-2xl mb-2" style={{ color: isActive ? '#C9A84C' : '#444' }}>
                    {TIER_ICONS[tier]}
                  </div>
                  <div className="text-lg font-light capitalize mb-1"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: isActive ? '#E8D5A3' : '#666' }}>
                    {tier}
                  </div>
                  <div className="text-2xl font-light"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: isActive ? '#C9A84C' : '#444' }}>
                    {TIER_INFO[tier].discount}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="reveal">
          <p className="text-[10px] tracking-[4px] mb-6" style={{ color: '#555' }}>TUS BENEFICIOS ACTIVOS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.benefits.map((b, i) => (
              <div
                key={b}
                className="reveal flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                  transitionDelay: `${i * 0.07}s`,
                  background: '#111',
                  border: '1px solid rgba(201,168,76,0.1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.transform = 'translateX(0)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A84C' }} />
                <span className="text-sm" style={{ color: '#888' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
