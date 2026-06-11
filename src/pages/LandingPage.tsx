import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TIERS = [
  {
    id: 'classic',
    icon: '☆',
    name: 'Classic',
    label: 'Entrada Premium',
    discount: '5%',
    desc: 'El punto de partida para clientes distinguidos de GM Luxury.',
    benefits: ['5% descuento en compras', 'Acceso a eventos GM', 'Newsletter exclusivo', 'Atención preferencial'],
    color: 'rgba(100,100,100,0.15)',
    borderColor: 'rgba(100,100,100,0.3)',
  },
  {
    id: 'elite',
    icon: '◈',
    name: 'Elite',
    label: 'Acceso Superior',
    discount: '10%',
    desc: 'Para clientes con historial comprobado en las marcas del grupo.',
    benefits: ['10% descuento ilimitado', 'Acceso anticipado a colecciones', 'Invitaciones a eventos privados', 'Asesor personal', 'Envío gratuito'],
    color: 'rgba(30,80,140,0.15)',
    borderColor: 'rgba(70,130,200,0.3)',
    featured: true,
  },
  {
    id: 'black',
    icon: '♛',
    name: 'Black',
    label: 'Máximo Estatus',
    discount: '15%',
    desc: 'La distinción más alta. Para el cliente que lo exige todo.',
    benefits: ['15% descuento siempre', 'Sala VIP en boutiques', 'Gestor de cuenta dedicado', 'Experiencias exclusivas', 'Conserjería 24/7', 'Acceso Luxury Brands Hub'],
    color: 'rgba(201,168,76,0.08)',
    borderColor: 'rgba(201,168,76,0.35)',
  },
]

const STATS = [
  { value: '3', label: 'NIVELES' },
  { value: '15%', label: 'MÁXIMO BENEFICIO' },
  { value: 'VIP', label: 'ESTATUS' },
  { value: '∞', label: 'COMPRAS' },
]

export default function LandingPage() {
  useScrollReveal()
  const heroRef = useRef<HTMLHeadingElement>(null)
  const [displayText, setDisplayText] = useState('')
  const fullText = 'distinguido.'
  const [typed, setTyped] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTyped(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!typed) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [typed])

  return (
    <div className="relative min-h-screen" style={{ background: '#0A0A0A' }}>
      <Particles />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20"
        style={{ zIndex: 1 }}>
        <div className="text-center max-w-4xl mx-auto">
          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            <p className="text-xs tracking-[5px] mb-8" style={{ color: '#C9A84C' }}>
              PROGRAMA DE LEALTAD · GM LUXURY
            </p>
          </div>
          <div ref={heroRef} className="reveal" style={{ transitionDelay: '0.3s' }}>
            <h1 className="mb-6 leading-none" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
              <span className="block text-[clamp(52px,9vw,110px)]" style={{ color: '#E8D5A3' }}>
                Tarjeta de
              </span>
              <span className="block text-[clamp(52px,9vw,110px)]" style={{ color: '#E8D5A3' }}>
                cliente
              </span>
              <span className="block text-[clamp(52px,9vw,110px)]" style={{ color: '#C9A84C' }}>
                {displayText}
                {displayText.length < fullText.length && <span className="cursor" />}
              </span>
            </h1>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.5s' }}>
            <p className="text-base max-w-md mx-auto mb-10" style={{ color: '#666', lineHeight: 1.7 }}>
              Una membresía con beneficios reales, niveles de privilegio y
              experiencias exclusivas para clientes GM Luxury.
            </p>
          </div>
          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ transitionDelay: '0.7s' }}>
            <Link to="/login">
              <button
                className="px-10 py-4 rounded-xl text-sm font-medium tracking-[2px] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                ACCEDER A MI TARJETA
              </button>
            </Link>
            <a href="#tiers">
              <button
                className="px-10 py-4 rounded-xl text-sm tracking-[2px] transition-all duration-300"
                style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                VER NIVELES
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal" style={{ transitionDelay: '1s' }}>
          <div className="text-[9px] tracking-[4px]" style={{ color: '#444' }}>SCROLL</div>
          <div className="w-px h-12 relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.15)' }}>
            <div className="absolute top-0 left-0 w-full shimmer-line" style={{ height: '100%' }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="about" className="relative py-20 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`reveal text-center p-8 rounded-2xl border-glow`}
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  background: '#111',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <div className="text-4xl font-light mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {s.value}
                </div>
                <div className="text-[9px] tracking-[3px]" style={{ color: '#555' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section id="tiers" className="relative py-24 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="reveal text-[10px] tracking-[5px] mb-4" style={{ color: '#C9A84C' }}>
              MEMBRESÍA
            </p>
            <h2 className="reveal text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3', transitionDelay: '0.1s' }}>
              Tres niveles de privilegio.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <div
                key={tier.id}
                className="reveal rounded-2xl p-8 transition-all duration-500 group cursor-default"
                style={{
                  transitionDelay: `${i * 0.15}s`,
                  background: tier.color,
                  border: `1px solid ${tier.borderColor}`,
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = `0 20px 60px ${tier.borderColor}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] tracking-[2px] font-medium"
                    style={{ background: 'rgba(201,168,76,0.9)', color: '#0A0A0A' }}>
                    MÁS POPULAR
                  </div>
                )}
                <div className="text-3xl mb-4" style={{ color: '#C9A84C' }}>{tier.icon}</div>
                <div className="text-[9px] tracking-[3px] mb-1" style={{ color: '#666' }}>{tier.label}</div>
                <div className="text-2xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
                  {tier.name}
                </div>
                <div className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>
                  {tier.discount}
                </div>
                <p className="text-xs mb-6 leading-relaxed" style={{ color: '#666' }}>{tier.desc}</p>
                <ul className="space-y-2">
                  {tier.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2 text-xs" style={{ color: '#888' }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#C9A84C' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SHOWCASE ── */}
      <section id="benefits" className="relative py-24 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 reveal-left">
              <p className="text-[10px] tracking-[5px] mb-4" style={{ color: '#C9A84C' }}>LA TARJETA</p>
              <h2 className="text-5xl font-light mb-6 leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
                Una tarjeta.<br />
                <span style={{ color: '#C9A84C' }}>Acceso total.</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#666' }}>
                Tu tarjeta GM Luxury es tu llave a un mundo de privilegios.
                Cada compra, cada visita, cada experiencia suma.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '◆', text: 'Descuentos permanentes en todas las marcas del grupo' },
                  { icon: '◆', text: 'Acceso anticipado a colecciones y lanzamientos exclusivos' },
                  { icon: '◆', text: 'Sala VIP en boutiques participantes (nivel Black)' },
                  { icon: '◆', text: 'Asesor personal de imagen y moda' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <span className="text-xs mt-1" style={{ color: '#C9A84C' }}>{item.icon}</span>
                    <span className="text-sm" style={{ color: '#888' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative card stack */}
            <div className="flex-1 reveal-right flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', transform: 'rotate(6deg) translateY(8px)' }} />
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', transform: 'rotate(3deg) translateY(4px)' }} />
                <div className="absolute inset-0 rounded-2xl flex flex-col justify-center items-center gap-3 float-anim"
                  style={{ background: 'linear-gradient(135deg, #1a1a1a, #222, #1a1205)', border: '1px solid rgba(201,168,76,0.4)' }}>
                  <div className="text-[10px] tracking-[4px]" style={{ color: '#C9A84C' }}>GM LUXURY</div>
                  <div className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
                    Black <span style={{ color: '#C9A84C' }}>✦</span>
                  </div>
                  <div className="text-xs tracking-[3px]" style={{ color: '#666' }}>REWARDS CARD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-6 text-center" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mx-auto">
          <div className="reveal p-16 rounded-3xl"
            style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <p className="text-[10px] tracking-[5px] mb-4" style={{ color: '#C9A84C' }}>¿YA ERES MIEMBRO?</p>
            <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
              Accede a tu cuenta.
            </h2>
            <p className="text-sm mb-8" style={{ color: '#666' }}>
              Ingresa tu código de tarjeta y PIN para ver tus beneficios activos.
            </p>
            <Link to="/login">
              <button
                className="px-12 py-4 rounded-xl text-sm font-medium tracking-[2px] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                INGRESAR AHORA
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t py-8 px-6 text-center" style={{ borderColor: 'rgba(201,168,76,0.1)', zIndex: 1 }}>
        <p className="text-[10px] tracking-[3px]" style={{ color: '#333' }}>
          © 2024 GM LUXURY · LUXURY BRANDS HUB · TODOS LOS DERECHOS RESERVADOS
        </p>
      </footer>
    </div>
  )
}
