export interface Product {
  id: string;
  name: string;
  price: string;
  modelUrl: string;
  thumbnailUrl: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    downloads: number;
    likes: number;
  };
  category: string;
}

const placeholderGlb = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const supabaseBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || '';

/**
 * Normalizes Supabase URLs to use the correct project ID from environment variables.
 * This fixes cases where the database might contain a typo in the hostname.
 */
function normalizeSupabaseUrl(url: string | undefined | null): string {
  if (!url) return "";
  const cleanUrl = String(url).trim();
  
  // Use a hardcoded fallback if the environment variable is missing
  const activeBaseUrl = supabaseBaseUrl || 'https://soqcbkfurzfxbqqwijnnd.supabase.co';
  
  // Replace any Supabase hostname with the correct one
  if (cleanUrl.includes('.supabase.co')) {
    return cleanUrl.replace(/^https:\/\/[^/]+\.supabase\.co/, activeBaseUrl);
  }
  
  return cleanUrl;
}

/**
 * Maps Supabase product rows to the Product interface used in the UI.
 */
interface DbProduct {
  id: string;
  name?: string | null;
  price: string;
  model_url?: string | null;
  thumbnail_url?: string | null;
  description?: string | null;
  tags?: string[] | null;
  likes?: number | null;
  orders?: number | null;
}

export function mapDbToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    name: (dbProduct.name || "").trim(),
    price: dbProduct.price,
    modelUrl: normalizeSupabaseUrl(dbProduct.model_url) || placeholderGlb,
    thumbnailUrl: normalizeSupabaseUrl(dbProduct.thumbnail_url) || "/products/placeholder.jpg",
    description: dbProduct.description || "",
    creator: {
      name: "Community",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbProduct.id}`,
      verified: false
    },
    stats: {
      downloads: dbProduct.orders || 0,
      likes: dbProduct.likes || 0
    },
    category: dbProduct.tags && dbProduct.tags.length > 0 ? dbProduct.tags[0] : "General"
  };
}

export const products: Product[] = [];
