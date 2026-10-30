import { create } from "zustand";
import { Product, PRODUCTS_CATALOG, ProductSwap, SAFE_ALTERNATIVES_MAP } from "@/lib/inciDatabase";
import { BarrierDiagnosticProfile } from "@/lib/mockData";

export interface ConflictAnalysis {
  safetyStatus: "SAFE" | "CAUTION" | "CRITICAL_CONFLICT";
  barrierMatchScore: number; // 0 - 100%
  summary: string;
  detailedReasoning: string;
  conflictingProductId?: string;
  swapRecommendation?: ProductSwap;
  triangulationQuestion?: string;
}

interface CartStore {
  // Cart Items
  items: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  swapProduct: (originalId: string, replacement: Product) => void;

  // Scanner & YouCam Skin Diagnostic State
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  diagnosticProfile: BarrierDiagnosticProfile | null;
  setDiagnosticProfile: (profile: BarrierDiagnosticProfile | null) => void;

  // Hardware Pre-Flight & Lens Clarity
  lensClarityChecked: boolean;
  setLensClarityChecked: (checked: boolean) => void;

  // Agentic Analysis & Triangulation State
  conflictAnalysis: ConflictAnalysis | null;
  setConflictAnalysis: (analysis: ConflictAnalysis | null) => void;
  userTriangulationResponse: string | null;
  setUserTriangulationResponse: (response: string | null) => void;

  // Reset
  resetAnalysis: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // Pre-load cart with 3 items demonstrating the real-world hazard: Glycolic Acid 7% + Retinol 1% + CeraVe Cleanser
  items: [
    PRODUCTS_CATALOG.find(p => p.id === "prod-glycolic-7")!,
    PRODUCTS_CATALOG.find(p => p.id === "prod-retinol-1")!,
    PRODUCTS_CATALOG.find(p => p.id === "prod-cerave-cleanser")!,
  ].filter(Boolean),

  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),

  addItem: (product) => set((state) => ({ items: [...state.items, product] })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  clearCart: () => set({ items: [] }),

  swapProduct: (originalId, replacement) => {
    set((state) => {
      const updated = state.items.map((item) => (item.id === originalId ? replacement : item));
      return {
        items: updated,
        conflictAnalysis: {
          safetyStatus: "SAFE",
          barrierMatchScore: 98,
          summary: "Barrier conflict resolved! Hazardous actives safely replaced.",
          detailedReasoning: `Replaced high-irritation active with ${replacement.name}. Your skin barrier is protected while continuing to benefit from safe cell-renewing botanical extracts.`,
        },
      };
    });
  },

  isScannerOpen: false,
  setIsScannerOpen: (open) => set({ isScannerOpen: open }),

  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  diagnosticProfile: null,
  setDiagnosticProfile: (profile) => set({ diagnosticProfile: profile }),

  lensClarityChecked: true,
  setLensClarityChecked: (checked) => set({ lensClarityChecked: checked }),

  conflictAnalysis: null,
  setConflictAnalysis: (analysis) => set({ conflictAnalysis: analysis }),

  userTriangulationResponse: null,
  setUserTriangulationResponse: (response) => set({ userTriangulationResponse: response }),

  resetAnalysis: () =>
    set({
      diagnosticProfile: null,
      conflictAnalysis: null,
      userTriangulationResponse: null,
    }),
}));
