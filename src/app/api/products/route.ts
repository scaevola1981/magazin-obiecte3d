import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapDbToProduct, products as localProducts } from '@/data/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  let dbProducts = [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('API Supabase error:', error.message);
      dbProducts = [];
    } else {
      dbProducts = data || [];
    }
  } catch (err) {
    console.error('API Failed to fetch from Supabase:', err);
    dbProducts = [];
  }

  // Map and deduplicate database products by name to avoid showing test duplicates
  const productsMap = new Map();
  dbProducts.forEach(dbProduct => {
    const product = mapDbToProduct(dbProduct);
    if (!productsMap.has(product.name)) {
      productsMap.set(product.name, product);
    } else {
      const existing = productsMap.get(product.name);
      const currentHasImage = product.thumbnailUrl?.startsWith('http');
      const existingHasImage = existing.thumbnailUrl?.startsWith('http');
      if (currentHasImage && !existingHasImage) {
        productsMap.set(product.name, product);
      }
    }
  });

  let finalProducts = Array.from(productsMap.values());
  
  if (finalProducts.length === 0) {
    console.log('API Using local products fallback');
    finalProducts = localProducts;
  }

  const products = finalProducts.sort((a, b) => {
    const aOk = a.thumbnailUrl?.startsWith('http') || a.thumbnailUrl?.startsWith('/');
    const bOk = b.thumbnailUrl?.startsWith('http') || b.thumbnailUrl?.startsWith('/');
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  });

  return NextResponse.json(products);
}
