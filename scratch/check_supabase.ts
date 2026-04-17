import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStorage() {
  console.log('Checking storage for:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error('Error listing buckets:', bError.message);
    return;
  }
  
  console.log('Available buckets:', buckets.map(b => b.name));
  
  const bucketName = 'custom-sketches';
  const bucket = buckets.find(b => b.name === bucketName);
  
  if (!bucket) {
    console.log(`Bucket "${bucketName}" DOES NOT EXIST!`);
    
    console.log(`Attempting to create bucket "${bucketName}"...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true
    });
    
    if (error) {
      console.error('Failed to create bucket:', error.message);
    } else {
      console.log('Successfully created public bucket "custom-sketches"');
    }
  } else {
    console.log(`Bucket "${bucketName}" exists. Public: ${bucket.public}`);
    if (!bucket.public) {
      console.log('Updating bucket to PUBLIC...');
      await supabase.storage.updateBucket(bucketName, { public: true });
    }
    
    const { data: files, error: fError } = await supabase.storage.from(bucketName).list();
    if (fError) {
      console.error('Error listing files:', fError.message);
    } else {
      console.log(`Found ${files.length} files in "${bucketName}"`);
      files.forEach(f => console.log(' -', f.name));
    }
  }
}

checkStorage();
