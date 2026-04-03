import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://socqbkfurzfbxqqwijnnd.supabase.co';
const supabaseAnonKey = 'sb_publishable_iyrvpbYP8T1ZKfsQPhGRWg_2LN7T8uR';

console.log('Testing connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log(`Found ${data?.length || 0} products.`);
    if (data && data.length > 0) {
      data.forEach((p, i) => {
        console.log(` Product ${i + 1}: ${p.name} (ID: ${p.id})`);
        console.log(`   - thumb: ${p.thumbnail_url}`);
        console.log(`   - model: ${p.model_url}`);
      });
    }
  }
}

test();
