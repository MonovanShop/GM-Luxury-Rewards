import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentClient, logoutClient } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = location.pathname === '/'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b"
      style={{
        background: scrolled ? 'rgba(13,13,13,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderColor: scrolled ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
        padding: scrolled ? '14px 0' : '22px 0',
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8">
        {/* Logo */}
        <Link to="/" className="flex flex-col group">
          <span className="text-sm tracking-[0.3em] font-medium uppercase" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            GM Luxury
          </span>
          <span className="text-[9px] tracking-[0.4em] uppercase mt-0.5" style={{ color: '#C9A84C' }}>
            Rewards Card
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.2em] uppercase">
          {isLanding && (
            <>
              <a href="#tiers" className="transition-colors" style={{ color: '#888' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
                Niveles
              </a>
              <a href="#benefits" className="transition-colors" style={{ color: '#888' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
                Beneficios
              </a>
            </>
          )}

          {currentClient ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="transition-colors" style={{ color: '#C9A84C' }}>
                Mi Tarjeta
              </Link>
              <button onClick={logoutClient} className="transition-colors" style={{ color: '#555' }}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button
                className="px-6 py-2 border transition-all duration-500"
                style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0d0d0d' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}
              >
                Acceder
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 transition-all" style={{ background: '#C9A84C', transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
          <span className="block w-5 h-0.5 transition-all" style={{ background: '#C9A84C', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 transition-all" style={{ background: '#C9A84C', transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t mx-8" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
          <div className="flex flex-col gap-4 pt-4 text-[11px] tracking-[0.2em] uppercase">
            {isLanding && <>
              <a href="#tiers" style={{ color: '#888' }} onClick={() => setMenuOpen(false)}>Niveles</a>
              <a href="#benefits" style={{ color: '#888' }} onClick={() => setMenuOpen(false)}>Beneficios</a>
            </>}
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full px-6 py-3 border"
                style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>
                Acceder
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
