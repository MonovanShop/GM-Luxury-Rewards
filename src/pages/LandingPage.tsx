import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TIERS = [
  {
    id: 'classic',
    level: 'Nivel 01',
    name: 'Classic',
    discount: '5%',
    desc: 'El punto de partida para clientes distinguidos de GM Luxury.',
    benefits: ['Descuento en compras', 'Acceso a eventos GM', 'Newsletter exclusivo', 'Atención preferencial'],
    featured: false,
  },
  {
    id: 'elite',
    level: 'Nivel 02',
    name: 'Elite',
    discount: '10%',
    desc: 'Experiencias curadas y acceso prioritario a lanzamientos globales.',
    benefits: ['Todos los beneficios Classic', 'Concierge personal 24/7', 'Invitaciones VIP Private', 'Envío gratuito'],
    featured: true,
  },
  {
    id: 'black',
    level: 'Máximo Nivel',
    name: 'Black Edition',
    discount: '15%',
    desc: 'El pináculo de nuestra hospitalidad. Sin límites, solo excelencia.',
    benefits: ['Beneficios ilimitados Elite', 'Acceso a Luxury Lounges', 'Gestor de cuenta dedicado', 'Conserjería global 24/7'],
    featured: false,
  },
]

const SHOWCASE = [
  'Descuentos permanentes en todas las marcas del grupo',
  'Acceso anticipado a colecciones y lanzamientos exclusivos',
  'Sala VIP en boutiques participantes (nivel Black)',
  'Asesor personal de imagen y moda',
]

export default function LandingPage() {
  useScrollReveal()
  const heroRef = useRef<HTMLHeadingElement>(null)
  const [displayText, setDisplayText] = useState('')
  const fullText = 'Rewards Card'
  const [typed, setTyped] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTyped(true), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!typed) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(interval)
    }, 70)
    return () => clearInterval(interval)
  }, [typed])

  return (
    <div className="w-full overflow-hidden" style={{ background: '#0d0d0d', color: '#fff' }}>
      <Particles />
      <Navbar />

      {/* ── HERO SPLIT ── */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center max-w-7xl mx-auto px-8 md:px-12 gap-12 pt-32 pb-20" style={{ zIndex: 1 }}>
        {/* Left: copy */}
        <div className="w-full md:w-1/2 z-10">
          <span className="reveal block text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#C9A84C' }}>
            Programa de Lealtad
          </span>
          <h1 ref={heroRef} className="reveal text-6xl md:text-8xl leading-[0.9] mb-8 font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', transitionDelay: '0.1s' }}>
            GM Luxury <br />
            <span className="italic" style={{ color: '#C9A84C' }}>
              {displayText || '\u00A0'}
              {displayText.length < fullText.length && <span className="cursor" />}
            </span>
          </h1>
          <p className="reveal max-w-md text-lg font-light leading-relaxed mb-10" style={{ color: '#9a9a9a', transitionDelay: '0.2s' }}>
            Un ecosistema de privilegios diseñado exclusivamente para quienes
            entienden que el lujo no es un destino, sino una forma de viajar.
          </p>

          <div className="reveal flex flex-wrap gap-4 mb-12" style={{ transitionDelay: '0.3s' }}>
            <Link to="/login">
              <button className="px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-500"
                style={{ background: '#C9A84C', color: '#0d0d0d' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0d78c')}
                onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}>
                Acceder a mi tarjeta
              </button>
            </Link>
            <a href="#tiers">
              <button className="px-10 py-4 text-[11px] uppercase tracking-[0.2em] border transition-all duration-500"
                style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                Ver niveles
              </button>
            </a>
          </div>

          <div className="reveal flex items-center gap-12 border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.1)', transitionDelay: '0.4s' }}>
            <div>
              <div className="text-2xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>03</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#777' }}>Niveles</div>
            </div>
            <div>
              <div className="text-2xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>15%</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#777' }}>Beneficio Máx</div>
            </div>
            <div>
              <div className="text-2xl font-light mb-1 italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>VIP</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#777' }}>Estatus</div>
            </div>
          </div>
        </div>

        {/* Right: floating card */}
        <div className="w-full md:w-1/2 relative flex justify-center items-center reveal-right">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(201,168,76,0.18)', filter: 'blur(100px)' }} />
            <div
              className="relative w-[330px] h-[210px] md:w-[450px] md:h-[280px] rounded-2xl p-8 flex flex-col justify-between shadow-2xl transition-transform duration-700 ease-out group-hover:rotate-0 float-anim"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: 'rotate(-12deg)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 rounded-md opacity-80" style={{ background: 'linear-gradient(135deg, #f0d78c, #C9A84C)' }} />
                <div className="text-xl font-light tracking-tight" style={{ color: '#C9A84C' }}>GM LUXURY</div>
              </div>
              <div className="mt-auto">
                <div className="tracking-[0.3em] text-[10px] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Black Member</div>
                <div className="text-lg tracking-[0.2em] font-light" style={{ opacity: 0.8 }}>•••• •••• •••• 8892</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP TIERS ── */}
      <section id="tiers" className="relative py-28 px-8 md:px-20" style={{ background: '#1a1a1a', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="reveal block text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#C9A84C' }}>Membresía</span>
            <h2 className="reveal text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', transitionDelay: '0.1s' }}>
              Tres niveles de privilegio.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TIERS.map((tier, i) => (
              <div
                key={tier.id}
                className="reveal group p-10 transition-all duration-500"
                style={{
                  transitionDelay: `${i * 0.12}s`,
                  background: tier.featured ? 'linear-gradient(180deg, #1a1a1a, #000)' : '#0d0d0d',
                  border: tier.featured ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: tier.featured ? '0 0 50px rgba(201,168,76,0.1)' : 'none',
                }}
                onMouseEnter={e => { if (!tier.featured) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
                onMouseLeave={e => { if (!tier.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: tier.featured ? '#f0d78c' : '#777' }}>
                    {tier.level}
                  </span>
                  <span className="text-4xl font-light" style={{ color: tier.featured ? '#f0d78c' : '#C9A84C' }}>
                    {tier.discount}
                  </span>
                </div>
                <h3 className="text-3xl mb-4 font-light italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: tier.featured ? '#fff' : '#E8D5A3' }}>
                  {tier.name}
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: tier.featured ? '#cfcfcf' : '#888' }}>
                  {tier.desc}
                </p>
                <ul className="space-y-4 text-xs tracking-wide border-t pt-8" style={{ borderColor: tier.featured ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)', color: tier.featured ? '#eee' : '#999' }}>
                  {tier.benefits.map(b => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A84C' }} />
                      {b}
                    </li>
                  ))}
                </ul>
                {tier.featured && (
                  <Link to="/login">
                    <button className="w-full mt-10 py-4 uppercase tracking-widest text-[10px] font-medium transition-colors"
                      style={{ background: '#C9A84C', color: '#0d0d0d' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f0d78c')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}>
                      Solicitar invitación
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SHOWCASE ── */}
      <section id="benefits" className="relative py-28 px-8 md:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 reveal-left">
            <span className="block text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#C9A84C' }}>La Tarjeta</span>
            <h2 className="text-5xl font-light mb-6 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Una tarjeta. <br />
              <span className="italic" style={{ color: '#C9A84C' }}>Acceso total.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-10 max-w-md" style={{ color: '#888' }}>
              Tu tarjeta GM Luxury es tu llave a un mundo de privilegios.
              Cada compra, cada visita, cada experiencia suma.
            </p>
            <div className="space-y-5">
              {SHOWCASE.map((item, i) => (
                <div key={i} className="reveal flex items-start gap-4" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <span className="text-xs mt-1" style={{ color: '#C9A84C' }}>◆</span>
                  <span className="text-sm" style={{ color: '#aaa' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 reveal-right flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', transform: 'rotate(6deg) translateY(8px)' }} />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', transform: 'rotate(3deg) translateY(4px)' }} />
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-center items-center gap-3 float-anim"
                style={{ background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)', border: '1px solid rgba(201,168,76,0.4)' }}>
                <div className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#C9A84C' }}>GM Luxury</div>
                <div className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Black <span style={{ color: '#C9A84C' }}>✦</span>
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: '#777' }}>Rewards Card</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-8" style={{ zIndex: 1 }}>
        <div className="reveal max-w-3xl mx-auto text-center p-16 rounded-2xl"
          style={{ background: 'linear-gradient(180deg, #1a1a1a, #0d0d0d)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span className="block text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#C9A84C' }}>¿Ya eres miembro?</span>
          <h2 className="text-4xl font-light mb-4 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Accede a tu cuenta.
          </h2>
          <p className="text-sm mb-10" style={{ color: '#888' }}>
            Ingresa tu código de tarjeta y PIN para ver tus beneficios activos.
          </p>
          <Link to="/login">
            <button className="px-12 py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-500"
              style={{ background: '#C9A84C', color: '#0d0d0d' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0d78c')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}>
              Ingresar ahora
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-12 px-8 md:px-20 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: 'rgba(255,255,255,0.05)', zIndex: 1 }}>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: '#555' }}>© 2024 GM Luxury · Luxury Brands Hub</div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: '#555' }}>Todos los derechos reservados</div>
      </footer>
    </div>
  )
}
