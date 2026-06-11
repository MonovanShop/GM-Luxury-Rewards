import { createContext, useContext, useState, ReactNode } from 'react'

export interface Client {
  id: string
  code: string
  name: string
  tier: 'classic' | 'elite' | 'black'
  benefit: string
  pin: string
  joinDate: string
  purchases: number
}

interface AuthContextType {
  currentClient: Client | null
  adminLoggedIn: boolean
  clients: Client[]
  loginClient: (code: string, pin: string) => boolean
  logoutClient: () => void
  loginAdmin: (user: string, pass: string) => boolean
  logoutAdmin: () => void
  addClient: (data: Omit<Client, 'id' | 'code' | 'joinDate'>) => Client
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
}

const TIER_DEFAULTS = {
  classic: { benefit: '5%', label: 'Classic' },
  elite: { benefit: '10%', label: 'Elite' },
  black: { benefit: '15%', label: 'Black' },
}

// Hitos de lealtad: el descuento se desbloquea SOLO al completar las compras del nivel
export const MILESTONES = [
  { tier: 'classic' as const, threshold: 5, discount: 5 },
  { tier: 'elite' as const, threshold: 10, discount: 10 },
  { tier: 'black' as const, threshold: 15, discount: 15 },
]

export interface Progress {
  purchases: number
  earnedTier: 'classic' | 'elite' | 'black' | null
  discount: number          // descuento desbloqueado (0 si aún no completa el primer hito)
  nextTier: 'classic' | 'elite' | 'black' | null
  nextThreshold: number | null
  remaining: number         // compras que faltan para el siguiente hito
  toNextPercent: number     // progreso (0-100) hacia el siguiente hito
}

export function getProgress(purchases: number): Progress {
  const earned = [...MILESTONES].reverse().find(m => purchases >= m.threshold) || null
  const next = MILESTONES.find(m => purchases < m.threshold) || null

  const prevThreshold = earned ? earned.threshold : 0
  const remaining = next ? next.threshold - purchases : 0
  const span = next ? next.threshold - prevThreshold : 1
  const toNextPercent = next
    ? Math.min(100, Math.round(((purchases - prevThreshold) / span) * 100))
    : 100

  return {
    purchases,
    earnedTier: earned ? earned.tier : null,
    discount: earned ? earned.discount : 0,
    nextTier: next ? next.tier : null,
    nextThreshold: next ? next.threshold : null,
    remaining,
    toNextPercent,
  }
}

const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    code: 'GM-0001',
    name: 'Valued Client',
    tier: 'black',
    benefit: 'VIP',
    pin: '1234',
    joinDate: '2024-01-15',
    purchases: 48,
  },
  {
    id: '2',
    code: 'GM-0002',
    name: 'Ana Martínez',
    tier: 'elite',
    benefit: '10%',
    pin: '5678',
    joinDate: '2024-03-22',
    purchases: 23,
  },
  {
    id: '3',
    code: 'GM-0003',
    name: 'Carlos Mendoza',
    tier: 'classic',
    benefit: '5%',
    pin: '4321',
    joinDate: '2024-06-10',
    purchases: 8,
  },
]

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [counter, setCounter] = useState(4)

  const loginClient = (code: string, pin: string) => {
    const found = clients.find(
      c => c.code.toUpperCase() === code.toUpperCase() && c.pin === pin
    )
    if (found) { setCurrentClient(found); return true }
    return false
  }

  const logoutClient = () => setCurrentClient(null)

  const loginAdmin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'gmluxury2024') {
      setAdminLoggedIn(true)
      return true
    }
    return false
  }

  const logoutAdmin = () => setAdminLoggedIn(false)

  const addClient = (data: Omit<Client, 'id' | 'code' | 'joinDate'>) => {
    const code = `GM-${String(counter).padStart(4, '0')}`
    setCounter(c => c + 1)
    const newClient: Client = {
      ...data,
      id: String(Date.now()),
      code,
      joinDate: new Date().toISOString().split('T')[0],
      benefit: data.benefit || TIER_DEFAULTS[data.tier].benefit,
    }
    setClients(prev => [...prev, newClient])
    return newClient
  }

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    if (currentClient?.id === id) setCurrentClient(prev => prev ? { ...prev, ...data } : null)
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <AuthContext.Provider value={{
      currentClient, adminLoggedIn, clients,
      loginClient, logoutClient,
      loginAdmin, logoutAdmin,
      addClient, updateClient, deleteClient,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
