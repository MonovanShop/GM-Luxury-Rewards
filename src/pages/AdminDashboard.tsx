import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, Client } from '../hooks/useAuth'

const EMPTY: Omit<Client, 'id' | 'code' | 'joinDate'> = {
  name: '',
  tier: 'classic',
  benefit: '',
  pin: '',
  purchases: 0,
}

export default function AdminDashboard() {
  const { adminLoggedIn, clients, addClient, updateClient, deleteClient, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!adminLoggedIn) navigate('/admin')
  }, [adminLoggedIn])

  if (!adminLoggedIn) return null

  const resetForm = () => { setForm(EMPTY); setEditingId(null) }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.pin.trim()) return
    if (editingId) {
      updateClient(editingId, form)
    } else {
      addClient(form)
    }
    resetForm()
  }

  const startEdit = (c: Client) => {
    setEditingId(c.id)
    setForm({ name: c.name, tier: c.tier, benefit: c.benefit, pin: c.pin, purchases: c.purchases })
  }

  const inputStyle = {
    background: '#1a1a1a',
    border: '1px solid rgba(201,168,76,0.2)',
    color: '#E8D5A3',
  } as const

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <header className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}>✦</div>
          <div>
            <div className="text-sm tracking-[2px]" style={{ color: '#E8D5A3' }}>GM LUXURY</div>
            <div className="text-[9px] tracking-[3px]" style={{ color: '#C9A84C' }}>ADMIN</div>
          </div>
        </Link>
        <button onClick={() => { logoutAdmin(); navigate('/admin') }}
          className="text-xs tracking-[2px] px-5 py-2 rounded-lg border"
          style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.3)' }}>
          SALIR
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-[340px_1fr] gap-8">
        {/* Form */}
        <div className="rounded-2xl p-6 h-fit" style={{ background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
          <h2 className="text-2xl font-light mb-5" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            {editingId ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>

          <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>NOMBRE</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm mb-4" style={inputStyle} />

          <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>NIVEL</label>
          <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value as Client['tier'] })}
            className="w-full px-4 py-3 rounded-xl text-sm mb-4" style={inputStyle}>
            <option value="classic">Classic</option>
            <option value="elite">Elite</option>
            <option value="black">Black</option>
          </select>

          <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>BENEFICIO</label>
          <input value={form.benefit} onChange={e => setForm({ ...form, benefit: e.target.value })}
            placeholder="5% / 10% / VIP"
            className="w-full px-4 py-3 rounded-xl text-sm mb-4" style={inputStyle} />

          <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>PIN</label>
          <input value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })}
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl text-sm mb-4" style={inputStyle} />

          <label className="block text-[10px] tracking-[3px] mb-2" style={{ color: '#C9A84C' }}>COMPRAS</label>
          <input type="number" value={form.purchases} onChange={e => setForm({ ...form, purchases: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl text-sm mb-5" style={inputStyle} />

          <div className="flex gap-3">
            <button onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl text-sm font-medium tracking-[2px]"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0A' }}>
              {editingId ? 'GUARDAR' : 'AGREGAR'}
            </button>
            {editingId && (
              <button onClick={resetForm}
                className="px-5 py-3 rounded-xl text-sm border"
                style={{ color: '#888', borderColor: 'rgba(201,168,76,0.2)' }}>
                CANCELAR
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8D5A3' }}>
            Clientes ({clients.length})
          </h2>
          {clients.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-xl px-5 py-4"
              style={{ background: '#111', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div>
                <div className="text-sm" style={{ color: '#E8D5A3' }}>{c.name}</div>
                <div className="text-xs" style={{ color: '#666' }}>
                  {c.code} · <span className="capitalize" style={{ color: '#C9A84C' }}>{c.tier}</span> · {c.benefit} · PIN {c.pin}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)}
                  className="text-xs tracking-[1px] px-4 py-2 rounded-lg border"
                  style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.3)' }}>
                  EDITAR
                </button>
                <button onClick={() => deleteClient(c.id)}
                  className="text-xs tracking-[1px] px-4 py-2 rounded-lg border"
                  style={{ color: '#e07070', borderColor: 'rgba(180,50,50,0.3)' }}>
                  ELIMINAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
