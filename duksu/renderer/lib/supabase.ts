import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwbyirzwddtyxqmqmetn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Ynlpcnp3ZGR0eXhxbXFtZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzNzAsImV4cCI6MjA2NzMwNjM3MH0.ImkgW4oav_-qnTfrOiWlUEgGuMrxi86onNZMOCSa33w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 

const handleAuthCallback = (fragment: string) => {
  const hashParams = new URLSearchParams(fragment);
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  
  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }
};

(window as any).AuthAPI.onAuthCallback(handleAuthCallback);