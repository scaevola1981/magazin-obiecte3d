export interface Product {
  id: string;
  name: string;
  price: string;
  modelUrl: string;
  thumbnailUrl: string;
  description: string;
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
  },
  {
    id: "2",
    name: "Cat Stretch Planter",
    price: "120 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/cat-planter.jpg",
    description: "Suport suculente în formă de pisică, finisaj mat ivory; perfect pentru cadouri.",
  },
  {
    id: "3",
    name: "Spiral Column Planter",
    price: "230 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/spiral-planter.jpg",
    description: "Design arhitectural cu striații verticale, perete gros pentru stabilitate; PLA Pro.",
  },
  {
    id: "4",
    name: "Soft Rib Planter",
    price: "160 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/ribbed-cream.jpg",
    description: "Pattern elicoidal fin, culoare crem; include liner interior pentru udat controlat.",
  },
  {
    id: "5",
    name: "Highland Cow Pot",
    price: "130 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/highland-cow.jpg",
    description: "Cachepot figurativ, polișat manual după print; ideal pentru suculente mici.",
  },
  {
    id: "6",
    name: "Hydroponic Kitchen Kit",
    price: "690 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/hydroponic-kit.jpg",
    description: "Stație mini hidroponică imprimată 3D + LED, livrată cu bureți de germinare.",
  },
  {
    id: "7",
    name: "Sunny Reader Pot",
    price: "110 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/yellow-reader.jpg",
    description: "Ghiveci personaj galben cu carte, PLA mat; vibe cozy pentru rafturi.",
  },
  {
    id: "8",
    name: "Knit Swing Planter",
    price: "150 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/knit-swing.jpg",
    description: "Textură tricot, șezut pe leagăn cu sfoară inclusă; print în două culori.",
  },
  {
    id: "9",
    name: "Ribbed Duo Set",
    price: "210 RON",
    modelUrl: placeholderGlb,
    thumbnailUrl: "/products/ribbed-duo.jpg",
    description: "Set de două ghivece cilindrice pe picioare, în verde olive și greige.",
  },
];
