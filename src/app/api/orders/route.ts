import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId, customerName, customNotes } = await req.json();

    if (!productId || !customerName) {
      return NextResponse.json({ error: 'Product ID and Customer Name are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    
    // Create client with service role to bypass RLS for inserting orders
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: any = {
      product_id: productId,
      customer_name: customerName,
      status: 'în așteptare'
    };

    // If custom_notes exists in the schema, add it.
    // Daca coloana nu exista, va da o eroare in logs dar putem continua.
    if (customNotes) {
      payload.custom_notes = customNotes;
    }

    const { data: orderParams, error } = await supabase
      .from('orders')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      // Wait, if the table doesn't exist yet, it will throw an error. We want to catch this gracefully.
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optionally increment the real order count on the product using an RPC or a secondary fetch
    // We'll skip product order count increment for now to keep it safe, but we can do it:
    const { data: currentProduct } = await supabase.from('products').select('orders').eq('id', productId).single();
    if (currentProduct) {
       await supabase.from('products').update({ orders: (currentProduct.orders || 0) + 1 }).eq('id', productId);
    }

    return NextResponse.json({ success: true, order: orderParams?.[0] || null });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// GET all orders (used by Admin Dashboard)
export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });

    // Join with products table to get product name and thumbnail
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products:product_id (
          name,
          thumbnail_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
