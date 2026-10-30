export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "toner" | "serum" | "cleanser" | "moisturizer" | "treatment" | "sunscreen";
  price: number;
  image: string;
  shortDesc: string;
  actives: ActiveIngredient[];
  fullInci: string[];
}

export interface ActiveIngredient {
  name: string;
  inciName: string;
  concentration?: string;
  category: "exfoliant_aha" | "exfoliant_bha" | "retinoid" | "antioxidant_vit_c" | "barrier_repair" | "hydrator";
  irritationScore: number; // 1 (mild) to 10 (very potent)
  minRequiredMoisture: number; // Skin must have at least this moisture score
  maxToleratedRedness: number; // If redness is above this, flagged as high risk
  contraindications: string[]; // Other active categories it conflicts with concurrently
}

export interface ProductSwap {
  originalProductId: string;
  replacementProduct: Product;
  matchScore: number; // e.g. 96%
  primaryReason: string;
  benefit: string;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: "prod-glycolic-7",
    name: "Glycolic Acid 7% Exfoliating Toner",
    brand: "The Ordinary",
    category: "toner",
    price: 13.00,
    image: "https://images.unsplash.com/photo-1608248597359-5975a5c68913?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Potent direct alpha hydroxy acid (AHA) toner for resurfacing and brightening.",
    actives: [
      {
        name: "Glycolic Acid (AHA)",
        inciName: "Glycolic Acid",
        concentration: "7%",
        category: "exfoliant_aha",
        irritationScore: 8,
        minRequiredMoisture: 50,
        maxToleratedRedness: 65,
        contraindications: ["retinoid", "antioxidant_vit_c", "exfoliant_bha"]
      }
    ],
    fullInci: ["Aqua", "Glycolic Acid", "Rosa Damascena Flower Water", "Centaurea Cyanus Flower Water", "Aloe Barbadensis Leaf Water", "Propanediol", "Glycerin", "Triethanolamine", "Aminomethyl Propanol"]
  },
  {
    id: "prod-retinol-1",
    name: "Clinical 1% Retinol Treatment",
    brand: "Paula's Choice",
    category: "treatment",
    price: 64.00,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    shortDesc: "High-strength 1% pure retinol combined with peptides for advanced aging & pores.",
    actives: [
      {
        name: "Pure Retinol",
        inciName: "Retinol",
        concentration: "1%",
        category: "retinoid",
        irritationScore: 9,
        minRequiredMoisture: 55,
        maxToleratedRedness: 60,
        contraindications: ["exfoliant_aha", "exfoliant_bha", "antioxidant_vit_c"]
      }
    ],
    fullInci: ["Water", "Dimethicone", "Glycerin", "Retinol", "Palmitoyl Tetrapeptide-7", "Palmitoyl Hexapeptide-12", "Sodium Hyaluronate", "Ceramide NG"]
  },
  {
    id: "prod-cerave-cleanser",
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Gentle gel-foaming cleanser with 3 essential ceramides, niacinamide & hyaluronic acid.",
    actives: [
      {
        name: "Ceramide Complex (1, 3, 6-II)",
        inciName: "Ceramide NP",
        category: "barrier_repair",
        irritationScore: 1,
        minRequiredMoisture: 0,
        maxToleratedRedness: 100,
        contraindications: []
      }
    ],
    fullInci: ["Aqua", "Cocamidopropyl Hydroxysultaine", "Glycerin", "Sodium Lauroyl Sarcosinate", "Niacinamide", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Hyaluronic Acid"]
  },
  {
    id: "prod-bha-liquid",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "treatment",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Salicylic acid liquid exfoliant that unclogs pores, clears blackheads, and smoothes wrinkles.",
    actives: [
      {
        name: "Salicylic Acid (BHA)",
        inciName: "Salicylic Acid",
        concentration: "2%",
        category: "exfoliant_bha",
        irritationScore: 7,
        minRequiredMoisture: 45,
        maxToleratedRedness: 65,
        contraindications: ["retinoid", "exfoliant_aha"]
      }
    ],
    fullInci: ["Water", "Methylpropanediol", "Butylene Glycol", "Salicylic Acid", "Polysorbate 20", "Camellia Oleifera Leaf Extract", "Sodium Hydroxide", "Tetrasodium EDTA"]
  },
  {
    id: "prod-centella-ampoule",
    name: "Madagascar Centella Asiatica 100% Ampoule",
    brand: "SKIN1004",
    category: "serum",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Pure fermented Centella Asiatica extract to soothe compromised, inflamed, and sensitive skin.",
    actives: [
      {
        name: "Centella Asiatica Extract",
        inciName: "Centella Asiatica Extract",
        concentration: "100%",
        category: "barrier_repair",
        irritationScore: 1,
        minRequiredMoisture: 0,
        maxToleratedRedness: 100,
        contraindications: []
      }
    ],
    fullInci: ["Centella Asiatica (Gotu Kola) Extract 100%"]
  },
  {
    id: "prod-cicaplast-b5",
    name: "Cicaplast Baume B5+ Soothing Multi-Purpose Balm",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: 19.50,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Intensive barrier recovery cream enriched with 5% Panthenol (Vitamin B5), Madecassoside, and Tribioma.",
    actives: [
      {
        name: "Panthenol (Vitamin B5) + Madecassoside",
        inciName: "Panthenol",
        concentration: "5%",
        category: "barrier_repair",
        irritationScore: 1,
        minRequiredMoisture: 0,
        maxToleratedRedness: 100,
        contraindications: []
      }
    ],
    fullInci: ["Aqua", "Hydrogenated Polyisobutene", "Dimethicone", "Glycerin", "Butyrospermum Parkii Butter / Shea Butter", "Panthenol", "Zea Mays Starch", "Madecassoside", "Zinc Gluconate"]
  },
  {
    id: "prod-bakuchiol-serum",
    name: "Bakuchiol Natural Retinol-Alternative Serum",
    brand: "Herbivore Botanicals",
    category: "serum",
    price: 54.00,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80",
    shortDesc: "Gentle plant-derived 4% Bakuchiol + PHA that mimics retinol results without redness or barrier peeling.",
    actives: [
      {
        name: "Bakuchiol Extract",
        inciName: "Bakuchiol",
        concentration: "4%",
        category: "barrier_repair",
        irritationScore: 2,
        minRequiredMoisture: 35,
        maxToleratedRedness: 80,
        contraindications: []
      }
    ],
    fullInci: ["Aqua", "Aloe Barbadensis Leaf Juice", "Bakuchiol", "Leuconostoc/Radish Root Ferment Filtrate", "Populus Tremuloides Bark Extract", "Gluconolactone", "Sodium Phytate"]
  }
];

export const SAFE_ALTERNATIVES_MAP: Record<string, ProductSwap> = {
  "prod-retinol-1": {
    originalProductId: "prod-retinol-1",
    replacementProduct: PRODUCTS_CATALOG.find(p => p.id === "prod-bakuchiol-serum")!,
    matchScore: 98,
    primaryReason: "Skin moisture is low (41) with elevated redness. 1% pure retinol risks retinoid dermatitis.",
    benefit: "Delivers cellular smoothing and pore refinement with zero irritation or photosensitivity."
  },
  "prod-glycolic-7": {
    originalProductId: "prod-glycolic-7",
    replacementProduct: PRODUCTS_CATALOG.find(p => p.id === "prod-centella-ampoule")!,
    matchScore: 95,
    primaryReason: "Concurrent harsh acids will cause stratum corneum breakdown in dry, reactive areas.",
    benefit: "Calms redness by up to 40% and reinforces epidermal lipid barrier."
  }
};
