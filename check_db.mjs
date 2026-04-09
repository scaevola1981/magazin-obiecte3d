import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const { data } = await supabase.from('products').select('id, name, tags').order('name');

console.log('\n📦 Toate produsele și categoriile lor:\n');
data.forEach((p, i) => {
  console.log(`${String(i+1).padStart(2)}. [${(p.tags || []).join(', ') || 'FARA CATEGORIE'}] → ${p.name}`);
});
console.log(`\nTotal: ${data.length} produse`);
