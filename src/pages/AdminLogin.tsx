import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Particles from '../components/Particles'
import { useAuth } from '../hooks/useAuth'

export default function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginAdmin, adminLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (adminLoggedIn) navigate('/admin/dashboard')
  }, [adminLoggedIn])

  const handleLogin = async () => {
    if (!user.trim() || !pass.trim()) { setError('Ingresa usuario y contraseña.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const ok = loginAdmin(user.trim(), pass)
    if (ok) navigate('/admin/dashboard')
    else {
      setError('Credenciales incorrectas.')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
      <Particles />
      <div className="w-full max-w-md relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)' }}>✦</div>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            Panel Admin
          </h1>
          <p className="text-[10px] tracking-[4px]" style={{ color: '#555' }}>GM LUXURY · GESTIÓN</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(180,50,50,0.1)', border: '1px solid rgba(180,50,50,0.25)', color: '#e07070' }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>USUARIO</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="admin"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.2)', color: '#E8D5A3' }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>CONTRASEÑA</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.2)', color: '#E8D5A3' }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-medium tracking-[2px] transition-all"
            style={{
              background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0A',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'VERIFICANDO…' : 'INGRESAR'}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-[10px] tracking-[2px]" style={{ color: '#333' }}>← VOLVER AL INICIO</Link>
        </div>
      </div>
    </div>
  )
}
