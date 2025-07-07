import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'

export interface User {
  user_id: string
  created_at: string
  updated_at: string | null
}

export default function useGetUserInfo() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  return useQuery({
    queryKey: ['user', session?.user.id],
    queryFn: async (): Promise<User> => {
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session?.user.id)
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      return data
    },
    enabled: !!session?.user.id, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
}
