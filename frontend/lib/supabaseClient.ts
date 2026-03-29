import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbgcqmaptenzhzgcuaym.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2NxbWFwdGVuemh6Z2N1YXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODQxMDAsImV4cCI6MjA5MDM2MDEwMH0.vzkG3rbN7Tj20YLqvcwMvDNksnI4Jfn8hsL05Uso7h0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
