import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jwbyirzwddtyxqmqmetn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Ynlpcnp3ZGR0eXhxbXFtZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzNzAsImV4cCI6MjA2NzMwNjM3MH0.ImkgW4oav_-qnTfrOiWlUEgGuMrxi86onNZMOCSa33w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 