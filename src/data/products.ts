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

export const products: Product[] = [
  {
    id: "1",
    name: "Twist Lattice Planter",
    price: "190 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/twist-planter.jpg",
    description: "Ghiveci dublu, print FDM PLA terracotta + bază PETG negru, aerisire radială pentru drenaj.",
    creator: { name: "DesignMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", verified: true },
    stats: { downloads: "1.2k", likes: "450" },
    category: "Household"
  },
  {
    id: "2",
    name: "Cat Stretch Planter",
    price: "120 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/cat-planter.jpg",
    description: "Suport suculente în formă de pisică, finisaj mat ivory; perfect pentru cadouri.",
    creator: { name: "MeowMaker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", verified: false },
    stats: { downloads: "850", likes: "310" },
    category: "Art"
  },
  {
    id: "3",
    name: "Spiral Column Planter",
    price: "230 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/spiral-planter.jpg",
    description: "Design arhitectural cu striații verticale, perete gros pentru stabilitate; PLA Pro.",
    creator: { name: "VortexStudio", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", verified: true },
    stats: { downloads: "2.1k", likes: "980" },
    category: "Household"
  },
  {
    id: "4",
    name: "Soft Rib Planter",
    price: "160 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/ribbed-cream.jpg",
    description: "Pattern elicoidal fin, culoare crem; include liner interior pentru udat controlat.",
    creator: { name: "CurveDesign", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", verified: true },
    stats: { downloads: "1.5k", likes: "620" },
    category: "Tools"
  },
  {
    id: "5",
    name: "Highland Cow Pot",
    price: "130 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/highland-cow.jpg",
    description: "Cachepot figurativ, polișat manual după print; ideal pentru suculente mici.",
    creator: { name: "EcoPrint", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5", verified: false },
    stats: { downloads: "3.2k", likes: "1.1k" },
    category: "Art"
  },
  {
    id: "6",
    name: "Hydroponic Kitchen Kit",
    price: "690 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/hydroponic-kit.jpg",
    description: "Stație mini hidroponică imprimată 3D + LED, livrată cu bureți de germinare.",
    creator: { name: "GreenTech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6", verified: true },
    stats: { downloads: "420", likes: "180" },
    category: "Tools"
  },
  {
    id: "7",
    name: "Sunny Reader Pot",
    price: "110 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/yellow-reader.jpg",
    description: "Ghiveci personaj galben cu carte, PLA mat; vibe cozy pentru rafturi.",
    creator: { name: "StoryPrint", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", verified: true },
    stats: { downloads: "2.4k", likes: "890" },
    category: "Art"
  },
  {
    id: "8",
    name: "Knit Swing Planter",
    price: "150 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/knit-swing.jpg",
    description: "Textură tricot, șezut pe leagăn cu sfoară inclusă; print în două culori.",
    creator: { name: "CozyNodes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8", verified: false },
    stats: { downloads: "1.7k", likes: "550" },
    category: "Household"
  },
  {
    id: "9",
    name: "Ribbed Duo Set",
    price: "210 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/ribbed-duo.jpg",
    description: "Set de două ghivece cilindrice pe picioare, în verde olive și greige.",
    creator: { name: "ModernRoots", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9", verified: true },
    stats: { downloads: "950", likes: "410" },
    category: "Household"
  },
];
