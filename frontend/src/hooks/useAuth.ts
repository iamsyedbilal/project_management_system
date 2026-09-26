import { useEffect, useState } from 'react'
import { getCurrentUser } from '../api/auth.api'
import type { User } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getCurrentUser().then(r => setUser(r.data ?? r)).catch(() => setUser(null)).finally(() => setLoading(false)) }, [])
  return { user, loading, setUser }
}
