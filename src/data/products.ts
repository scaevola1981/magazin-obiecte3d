export interface Product {
  id: string;
  name: string;
  price: string;
  modelUrl: string;
  thumbnailUrl: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Scaun Modern 3D",
    price: "450 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Placeholder .glb
    thumbnailUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e277?q=80&w=500&auto=format&fit=crop",
    description: "Design minimalist, perfect pentru orice interior contemporan.",
  },
  {
    id: "2",
    name: "Lampa Minimalistă",
    price: "280 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "https://images.unsplash.com/photo-1507473885765-e6ed457f7815?q=80&w=500&auto=format&fit=crop",
    description: "O piesă de accent care combină utilitatea cu estetica pură.",
  },
  {
    id: "3",
    name: "Vază Geometrică",
    price: "150 RON",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    thumbnailUrl: "https://images.unsplash.com/photo-1581781881744-9d3df728c6a2?q=80&w=500&auto=format&fit=crop",
    description: "Forme sculpturale create prin tehnologie 3D avansată.",
  },
];
