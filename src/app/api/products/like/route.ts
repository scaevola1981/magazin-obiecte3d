import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Connect using service role key to bypass RLS for this targeted increment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current likes
    const { data: currentData, error: fetchError } = await supabase
      .from('products')
      .select('likes')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const currentLikes = currentData?.likes || 0;

    // Update with +1
    const { data, error } = await supabase
      .from('products')
      .update({ likes: currentLikes + 1 })
      .eq('id', productId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, likes: currentLikes + 1 });
  } catch (error: any) {
    console.error('Like error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
