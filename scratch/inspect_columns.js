const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const env = {};
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) env[key.trim()] = val.join('=').trim();
  });
} catch (e) {}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_columns_debug'); // Likely doesn't exist
  
  // Alternative: query a dummy order or use a special query if possible
  const { data: orders, error: oError } = await supabase.from('orders').select('*').limit(1);
  
  if (oError) {
    console.error('Error fetching orders:', oError.message);
  } else if (orders && orders.length > 0) {
    console.log('Columns found in orders table:', Object.keys(orders[0]));
  } else {
    console.log('No orders found to inspect columns.');
  }
}

checkColumns();
