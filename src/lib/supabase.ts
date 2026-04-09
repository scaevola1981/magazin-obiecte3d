import { createClient } from '@supabase/supabase-js';

// Sanitize and FORCE correct format
let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
if (rawUrl && !rawUrl.startsWith('http')) {
  rawUrl = `https://${rawUrl}`;
}
const supabaseUrl = rawUrl.replace(/\/$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Diagnostic helper to identify configuration issues at runtime.
 */
export const getSupabaseConfigStatus = () => ({
  hasUrl: !!supabaseUrl,
  urlStart: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'MISSING',
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey.length,
  isHttps: supabaseUrl.startsWith('https://'),
  isValidHost: supabaseUrl.includes('.supabase.co')
});
