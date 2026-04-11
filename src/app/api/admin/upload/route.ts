import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  const adminPassword = process.env.ADMIN_PASSWORD || 'printly2024';
  
  const formData = await req.formData();
  const password = formData.get('password') as string;
  const file = formData.get('file') as File;

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 });
  }

  if (!file) {
    return NextResponse.json({ error: 'Nicio imagine selectată' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create a truly unique name: timestamp + random uuid + sanitized original name
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanBaseName = file.name
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
    
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const fileName = `${Date.now()}-${uniqueId}-${cleanBaseName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('obiecte-3d')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: `Upload eșuat: ${error.message}` }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('obiecte-3d')
    .getPublicUrl(fileName);

  return NextResponse.json({ success: true, url: urlData.publicUrl });
}
