import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface User {
  id: number
  user_id: string
  created_at: string
  updated_at: string | null
}

export interface UseGetUserInfoResult {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export default function useGetUserInfo(userId: string): UseGetUserInfoResult {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const refetch = () => {
    fetchUser()
  }

  return {
    user,
    loading,
    error,
    refetch
  }
}
