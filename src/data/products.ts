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
    downloads: string;
    likes: string;
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
  const activeBaseUrl = supabaseBaseUrl || 'https://socqbkfurzfbxqqwijnnd.supabase.co';
  
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
      downloads: "0",
      likes: "0"
    },
    category: dbProduct.tags && dbProduct.tags.length > 0 ? dbProduct.tags[0] : "General"
  };
}

export const products: Product[] = [
  {
    id: "local-1",
    name: "Cat Planter",
    price: "45 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/cat-planter.jpg",
    description: "A cute feline-inspired planter for your succulents.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cat", verified: true },
    stats: { downloads: "124", likes: "56" },
    category: "Household"
  },
  {
    id: "local-2",
    name: "Highland Cow",
    price: "65 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/highland-cow.jpg",
    description: "Detailed 3D model of a majestic Highland Cow.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cow", verified: true },
    stats: { downloads: "89", likes: "42" },
    category: "Art"
  },
  {
    id: "local-3",
    name: "Hydroponic Kit",
    price: "120 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/hydroponic-kit.jpg",
    description: "Functional 3D printed hydroponic system for indoor gardening.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=garden", verified: true },
    stats: { downloads: "215", likes: "98" },
    category: "Tools"
  },
  {
    id: "local-4",
    name: "Knit Swing",
    price: "35 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/knit-swing.jpg",
    description: "Decorative knit-texture swing for small plants or figures.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=swing", verified: true },
    stats: { downloads: "67", likes: "23" },
    category: "Household"
  },
  {
    id: "local-5",
    name: "Ribbed Cream",
    price: "50 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/ribbed-cream.jpg",
    description: "Elegant ribbed vase with a cream finish look.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vase", verified: true },
    stats: { downloads: "143", likes: "76" },
    category: "Household"
  },
  {
    id: "local-6",
    name: "Ribbed Duo",
    price: "85 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/ribbed-duo.jpg",
    description: "Set of two matching ribbed decorative items.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=duo", verified: true },
    stats: { downloads: "92", likes: "48" },
    category: "Household"
  },
  {
    id: "local-7",
    name: "Spiral Planter",
    price: "55 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/spiral-planter.jpg",
    description: "Modern spiral design planter.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=spiral", verified: true },
    stats: { downloads: "110", likes: "54" },
    category: "Household"
  },
  {
    id: "local-8",
    name: "Twist Planter",
    price: "55 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/twist-planter.jpg",
    description: "Another variation of twisted architectural planter.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=twist", verified: true },
    stats: { downloads: "105", likes: "51" },
    category: "Household"
  },
  {
    id: "local-9",
    name: "Yellow Reader",
    price: "30 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "/products/yellow-reader.jpg",
    description: "Small yellow 3D printed figure for book lovers.",
    creator: { name: "Printly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=book", verified: true },
    stats: { downloads: "45", likes: "19" },
    category: "Art"
  }
];
