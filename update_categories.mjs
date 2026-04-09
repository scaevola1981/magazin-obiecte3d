import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

// Map product names (lowercase contains) → category tags
const categoryRules = [
  { match: 'pen holder',    tags: ['birou'] },
  { match: 'clips',         tags: ['accesorii'] },
  { match: 'ghiveci',       tags: ['planter'] },
  { match: 'planter',       tags: ['planter'] },
];

const { data: products, error } = await supabase.from('products').select('id, name, tags');
if (error) { console.error('Error:', error.message); process.exit(1); }

console.log(`\n🔄 Actualizare categorii pentru ${products.length} produse...\n`);

for (const product of products) {
  const nameLower = (product.name || '').toLowerCase();
  let newTags = null;

  for (const rule of categoryRules) {
    if (nameLower.includes(rule.match)) {
      newTags = rule.tags;
      break;
    }
  }

  if (!newTags) {
    newTags = ['altele']; // fallback
  }

  const oldTags = JSON.stringify(product.tags);
  const nextTags = JSON.stringify(newTags);

  if (oldTags === nextTags) {
    console.log(`  ✓ ${product.name} → deja corect [${newTags.join(', ')}]`);
    continue;
  }

  const { error: updateError } = await supabase
    .from('products')
    .update({ tags: newTags })
    .eq('id', product.id);

  if (updateError) {
    console.error(`  ✗ ${product.name}: ${updateError.message}`);
  } else {
    console.log(`  ✅ ${product.name}: [${(product.tags||[]).join(',')}] → [${newTags.join(', ')}]`);
  }
}

console.log('\n✅ Gata! Re-rulează check_db.mjs ca să verifici.');
