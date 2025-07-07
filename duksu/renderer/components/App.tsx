import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Auth from './Auth'
import Home from './Home'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    });
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {session ? (
        <Home />
      ) : (
        <Auth />
      )}
    </QueryClientProvider>
  )
}

export default App 