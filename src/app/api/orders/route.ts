import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId, customerName, customNotes, isCustomOrder, customDescription, sketchUrl } = await req.json();

    if (!customerName) {
      return NextResponse.json({ error: 'Customer Name is required' }, { status: 400 });
    }

    // For regular orders, productId is required
    if (!isCustomOrder && !productId) {
      return NextResponse.json({ error: 'Product ID is required for regular orders' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: any = {
      customer_name: customerName,
      status: 'în așteptare',
    };

    if (productId) payload.product_id = productId;
    if (customNotes) payload.custom_notes = customNotes;
    if (isCustomOrder) payload.is_custom_order = true;
    if (customDescription) payload.custom_description = customDescription;
    if (sketchUrl) payload.sketch_url = sketchUrl;

    const { data: orderParams, error } = await supabase
      .from('orders')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment product order count only for regular orders
    if (productId && !isCustomOrder) {
      const { data: currentProduct } = await supabase.from('products').select('orders').eq('id', productId).single();
      if (currentProduct) {
        await supabase.from('products').update({ orders: (currentProduct.orders || 0) + 1 }).eq('id', productId);
      }
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
