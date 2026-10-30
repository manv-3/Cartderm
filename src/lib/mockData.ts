export interface SkinAnalysisMetric {
  type: string;
  region?: string;
  skin_type?: string;
  raw_score?: number;
  ui_score?: number;
  score?: number; // For overall condition or skin_age
  mask_urls?: string[];
}

export interface YouCamSkinAnalysisResult {
  task_id: string;
  task_status: "running" | "success" | "error";
  error?: string | null;
  error_message?: string | null;
  results?: {
    output: SkinAnalysisMetric[];
  };
}

export interface BarrierDiagnosticProfile {
  rednessScore: number;       // 1-100 (Higher = calmer/healthier, Lower = more inflamed)
  moistureScore: number;      // 1-100 (Higher = hydrated, Lower = dehydrated)
  oilinessScore: number;      // 1-100 (Higher = balanced, Lower = excess sebum/congestion)
  skinAge: number;
  overallScore: number;
  skinTypeClassification: string;
  confidenceRating: number;   // 0 - 100%
  barrierStatus: "HEALTHY" | "SENSITIZED" | "COMPROMISED";
}

export const MOCK_DIAGNOSTIC_COMPROMISED: YouCamSkinAnalysisResult = {
  task_id: "mock_task_comp_9281a",
  task_status: "success",
  error: null,
  error_message: null,
  results: {
    output: [
      {
        type: "hd_redness",
        region: "whole",
        raw_score: 54.2,
        ui_score: 58,
        mask_urls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"]
      },
      {
        type: "hd_moisture",
        region: "whole",
        raw_score: 38.6,
        ui_score: 41,
        mask_urls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"]
      },
      {
        type: "hd_oiliness",
        region: "whole",
        raw_score: 65.4,
        ui_score: 68,
        mask_urls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"]
      },
      {
        type: "hd_acne",
        region: "whole",
        raw_score: 72.1,
        ui_score: 75,
        mask_urls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"]
      },
      {
        type: "hd_skin_type",
        region: "u_zone",
        skin_type: "Dry & Redness",
        mask_urls: []
      },
      {
        type: "hd_skin_type",
        region: "t_zone",
        skin_type: "Combination",
        mask_urls: []
      },
      {
        type: "skin_age",
        score: 28
      },
      {
        type: "all",
        score: 61.2
      }
    ]
  }
};

export const MOCK_DIAGNOSTIC_CALM: YouCamSkinAnalysisResult = {
  task_id: "mock_task_calm_4119c",
  task_status: "success",
  error: null,
  error_message: null,
  results: {
    output: [
      {
        type: "hd_redness",
        region: "whole",
        raw_score: 82.5,
        ui_score: 85
      },
      {
        type: "hd_moisture",
        region: "whole",
        raw_score: 74.1,
        ui_score: 78
      },
      {
        type: "hd_oiliness",
        region: "whole",
        raw_score: 79.0,
        ui_score: 81
      },
      {
        type: "hd_acne",
        region: "whole",
        raw_score: 88.0,
        ui_score: 89
      },
      {
        type: "hd_skin_type",
        region: "whole",
        skin_type: "Normal"
      },
      {
        type: "skin_age",
        score: 24
      },
      {
        type: "all",
        score: 83.5
      }
    ]
  }
};
