import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

export default function AuthComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Duksu</CardTitle>
          <CardDescription>AI-curated news feed</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 16px',
                  marginBottom: '8px'
                },
                input: {
                  borderRadius: '6px',
                  fontSize: '14px',
                  padding: '12px 16px',
                  marginBottom: '8px'
                },
                container: {
                  gap: '16px'
                }
              }
            }}
            providers={['google', 'apple']}
            redirectTo={"http://localhost:4000"}
            onlyThirdPartyProviders={true}
          />
        </CardContent>
      </Card>
    </div>
  )
} 