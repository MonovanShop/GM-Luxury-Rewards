import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import LoyaltyCard from '../components/LoyaltyCard'
import { useAuth } from '../hooks/useAuth'

export default function ClientDashboard() {
  const { currentClient, logoutClient } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentClient) navigate('/login')
  }, [currentClient])

  if (!currentClient) return null

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0A0A' }}>
      <Particles />
      <Navbar />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20" style={{ zIndex: 1 }}>
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[4px] mb-3" style={{ color: '#C9A84C' }}>MI MEMBRESÍA</p>
          <h1 className="text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            Hola, {currentClient.name.split(' ')[0]}.
          </h1>
        </div>

        <div className="flex justify-center mb-14">
          <LoyaltyCard client={currentClient} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {[
            { label: 'NIVEL', value: currentClient.tier },
            { label: 'BENEFICIO', value: currentClient.benefit },
            { label: 'COMPRAS', value: String(currentClient.purchases) },
            { label: 'MIEMBRO DESDE', value: currentClient.joinDate },
          ].map(s => (
            <div key={s.label} className="text-center p-6 rounded-2xl"
              style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
              <div className="text-xl font-light mb-1 capitalize"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C' }}>{s.value}</div>
              <div className="text-[9px] tracking-[2px]" style={{ color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={logoutClient}
            className="text-xs tracking-[2px] px-8 py-3 rounded-xl transition-all border"
            style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.3)', background: 'transparent' }}>
            CERRAR SESIÓN
          </button>
        </div>
      </div>
    </div>
  )
}
