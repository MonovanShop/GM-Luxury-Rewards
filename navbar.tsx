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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        padding: scrolled ? '14px 40px' : '22px 40px',
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-serif transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)' }}
          >
            ✦
          </div>
          <div>
            <div className="text-[13px] font-medium tracking-[3px] text-gold-light" style={{color:'#E8D5A3'}}>
              GM LUXURY
            </div>
            <div className="text-[9px] tracking-[4px]" style={{color:'#C9A84C'}}>
              REWARDS CARD
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a href="#about" className="text-xs tracking-[2px] transition-colors" style={{color:'#888'}}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
                ACERCA
              </a>
              <a href="#tiers" className="text-xs tracking-[2px] transition-colors" style={{color:'#888'}}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
                NIVELES
              </a>
              <a href="#benefits" className="text-xs tracking-[2px] transition-colors" style={{color:'#888'}}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8D5A3')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
                BENEFICIOS
              </a>
            </>
          )}

          {currentClient ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="text-xs tracking-[2px] px-5 py-2 rounded-lg transition-all border"
                  style={{color:'#C9A84C', borderColor:'rgba(201,168,76,0.3)', background:'transparent'}}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  MI TARJETA
                </button>
              </Link>
              <button onClick={logoutClient} className="text-xs tracking-[2px]" style={{color:'#555'}}>
                SALIR
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button
                className="text-xs tracking-[2px] px-6 py-2.5 rounded-lg font-medium transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                ACCEDER
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
        <div className="md:hidden mt-4 pb-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
          <div className="flex flex-col gap-4 pt-4 px-2">
            {isLanding && <>
              <a href="#tiers" className="text-xs tracking-[2px]" style={{color:'#888'}} onClick={() => setMenuOpen(false)}>NIVELES</a>
              <a href="#benefits" className="text-xs tracking-[2px]" style={{color:'#888'}} onClick={() => setMenuOpen(false)}>BENEFICIOS</a>
            </>}
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full text-xs tracking-[2px] px-6 py-3 rounded-lg font-medium"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}>
                ACCEDER
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
