import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  const adminPassword = process.env.ADMIN_PASSWORD || 'printly2024';
  const { password, name, description, price, category, thumbnailUrl } = await req.json();

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 });
  }

  if (!name || !price || !category) {
    return NextResponse.json({ error: 'Lipsesc câmpuri obligatorii (nume, preț, categorie)' }, { status: 400 });
  }

  const { data, error } = await supabase.from('products').insert([{
    name: name.trim(),
    description: description?.trim() || '',
    price: price.trim(),
    thumbnail_url: thumbnailUrl || null,
    model_url: null,
    tags: [category.toLowerCase()],
  }]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, product: data });
}
