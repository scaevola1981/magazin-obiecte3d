import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapDbToProduct } from '@/data/products';

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map and deduplicate database products by name to avoid showing test duplicates
  const productsMap = new Map();
  (data || []).forEach(dbProduct => {
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

  const products = Array.from(productsMap.values())
    .sort((a, b) => {
      const aOk = a.thumbnailUrl?.startsWith('http');
      const bOk = b.thumbnailUrl?.startsWith('http');
      if (aOk && !bOk) return -1;
      if (!aOk && bOk) return 1;
      return 0;
    });

  return NextResponse.json(products);
}
