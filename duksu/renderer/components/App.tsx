import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { localStorage } from '../lib/localStorage'
import Auth from './Auth'
import Home from './Home'
import Tutorial from './Tutorial'
import TitleBar from './TitleBar'

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
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      // Check if user should see tutorial
      if (session && localStorage.getItem('last_accessed_at') === null) {
        setShowTutorial(true)
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
      
      // Check if user should see tutorial on auth state change
      if (session && localStorage.getItem('last_accessed_at') === null) {
        setShowTutorial(true)
      }
    });
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TitleBar />
      {session ? (
        showTutorial ? (
          <Tutorial onComplete={handleTutorialComplete} />
        ) : (
          <Home />
        )
      ) : (
        <Auth />
      )}
    </QueryClientProvider>
  )
}

export default App 