const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parser
const env = {};
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) env[key.trim()] = val.join('=').trim();
  });
} catch (e) {}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStorage() {
  try {
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) throw bError;
    
    console.log('Available buckets:', buckets.map(b => b.name));
    
    const bucketName = 'custom-sketches';
    const bucket = buckets.find(b => b.name === bucketName);
    
    if (!bucket) {
      console.log(`Bucket "${bucketName}" MISSING. Creating...`);
      const { error } = await supabase.storage.createBucket(bucketName, { public: true });
      if (error) console.error('Create error:', error.message);
      else console.log('Bucket created!');
    } else {
      console.log(`Bucket "${bucketName}" exists. Public: ${bucket.public}`);
      if (!bucket.public) {
        console.log('Setting bucket to Public...');
        await supabase.storage.updateBucket(bucketName, { public: true });
      }
      
      const { data: files } = await supabase.storage.from(bucketName).list();
      console.log(`Files count: ${files?.length || 0}`);
    }
  } catch (e) {
    console.error('Failure:', e.message);
  }
}

checkStorage();
