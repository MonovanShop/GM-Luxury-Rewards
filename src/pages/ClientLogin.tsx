import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Particles from '../components/Particles'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

export default function ClientLogin() {
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const { loginClient, currentClient } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentClient) navigate('/dashboard')
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleLogin = async () => {
    if (!code.trim() || !pin.trim()) { setError('Ingresa tu código y PIN.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = loginClient(code.trim(), pin.trim())
    if (ok) navigate('/dashboard')
    else {
      setError('Código o PIN incorrecto. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6"
      style={{ background: '#0A0A0A' }}>
      <Particles />
      <Navbar />

      <div
        className="w-full max-w-md relative"
        style={{
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)' }}>
            ✦
          </div>
          <h1 className="text-5xl font-light mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            Bienvenido.
          </h1>
          <p className="text-[10px] tracking-[4px]" style={{ color: '#555' }}>
            INGRESA TU MEMBRESÍA
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(180,50,50,0.1)', border: '1px solid rgba(180,50,50,0.25)', color: '#e07070' }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>
              CÓDIGO DE TARJETA
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="GM-0001"
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#E8D5A3',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#E8D5A3',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-medium tracking-[2px] transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0A',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                VERIFICANDO
              </>
            ) : 'INGRESAR'}
          </button>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: '#444' }}>
          ¿Sin tarjeta? Visita cualquier boutique GM Luxury.
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'rgba(201,168,76,0.04)', border: '1px dashed rgba(201,168,76,0.15)' }}>
          <p className="text-[10px] tracking-[2px] mb-2" style={{ color: '#555' }}>DEMO — PRUEBA CON:</p>
          <p className="text-xs" style={{ color: '#888' }}><span style={{ color: '#C9A84C' }}>GM-0001</span> · PIN <span style={{ color: '#C9A84C' }}>1234</span> (Black)</p>
          <p className="text-xs mt-1" style={{ color: '#888' }}><span style={{ color: '#C9A84C' }}>GM-0002</span> · PIN <span style={{ color: '#C9A84C' }}>5678</span> (Elite)</p>
        </div>

        <div className="text-center mt-4">
          <Link to="/admin" className="text-[10px] tracking-[2px]" style={{ color: '#333' }}>
            PANEL ADMIN →
          </Link>
        </div>
      </div>
    </div>
  )
}
