import { createClient } from '@supabase/supabase-js';

// Sanitize environment variables to prevent "fetch failed" errors
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl.startsWith('http')) {
  console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL must start with http/https');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
