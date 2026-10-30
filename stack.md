# 🛠️ CartDerm — Technical Stack & Specifications

> **System Overview**: CartDerm combines a reactive e-commerce frontend, YouCam's Cloud AI Skin Analysis engine (v2.1), and an autonomous Agentic Reasoning loop with chemical safety databases.

---

## 1. High-Level Technology Matrix

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | Fullstack React framework for rapid UI rendering and serverless API endpoints. |
| **Language** | **TypeScript** | Strict typing across API contracts, YouCam payloads, and cart data models. |
| **Styling & UI** | **Tailwind CSS + Lucide Icons + Framer Motion** | Clean, responsive luxury beauty aesthetic with silky sliding cart drawers. |
| **Camera & Capture** | **HTML5 WebRTC + YouCam JS CameraKit** | In-browser front camera streaming with `STRICT` preset pose & lighting gating. |
| **Skin Diagnostic** | **YouCam AI Skin Analysis REST API v2.1** | Cloud AI assessment for HD redness, moisture, oiliness, acne, and skin type. |
| **Agentic Core** | **Google Gemini 1.5 Flash / Pro** | Autonomous agent for ingredient contraindication reasoning and customer dialogue. |
| **Chemical Knowledge**| **Curated INCI Knowledge Base (JSON)** | Chemical interactions (AHA/BHA, Retinoids, Vitamin C, Niacinamide, Ceramides). |
| **State Management**| **Zustand / React Context** | Reactive shopping cart state, diagnostic history, and swap triggers. |

---

## 2. YouCam API v2.1 Specifications

### Endpoints
* **Base URL**: `https://yce-api-01.makeupar.com`
* **File Upload Initialization**: `POST /s2s/v2.0/file`
* **Run Task**: `POST /s2s/v2.1/task/skin-analysis`
* **Poll Task Status**: `GET /s2s/v2.1/task/skin-analysis/{task_id}`

### Authentication & Headers
```http
Authorization: Bearer YOUR_YOUCAM_API_KEY
Content-Type: application/json
```

### Request Payload (`POST /s2s/v2.1/task/skin-analysis`)
```json
{
  "src_file_id": "PRE_SIGNED_FILE_ID_OR_PUBLIC_URL",
  "dst_actions": [
    "hd_redness",
    "hd_moisture",
    "hd_oiliness",
    "hd_acne",
    "hd_skin_type"
  ],
  "format": "json",
  "miniserver_args": {
    "enable_mask_overlay": true
  }
}
```

> [!CRITICAL]
> **No Mixing SD and HD Actions**: `dst_actions` must strictly contain only `hd_*` actions or only SD actions. CartDerm standardizes exclusively on **HD actions** for optimal barrier precision.

### Response Parsing (`GET /s2s/v2.1/task/skin-analysis/{task_id}`)
When `task_status == "success"`, the engine returns:
```json
{
  "status": 200,
  "data": {
    "task_status": "success",
    "results": {
      "output": [
        { "type": "hd_redness", "raw_score": 58.2, "ui_score": 64, "mask_urls": ["..."] },
        { "type": "hd_moisture", "raw_score": 41.5, "ui_score": 48, "mask_urls": ["..."] },
        { "type": "hd_oiliness", "raw_score": 68.0, "ui_score": 72, "mask_urls": ["..."] },
        { "type": "hd_acne", "region": "whole", "raw_score": 75.0, "ui_score": 78 },
        { "type": "hd_skin_type", "region": "u_zone", "skin_type": "Dry & Redness" },
        { "type": "skin_age", "score": 26 },
        { "type": "all", "score": 63.4 }
      ]
    }
  }
}
```

---

## 3. Agentic Intelligence & INCI Knowledge Base

### Architecture
The CartDerm Agent evaluates the intersection of:
$$\text{Risk Factor} = \text{Cart Chemical Aggression} \times (100 - \text{Current Barrier Score})$$

### INCI Conflict Matrix
The system ships with a structured INCI database defining contraindications:

```typescript
export interface INCIIngredient {
  id: string;
  name: string;
  category: "chemical_exfoliant" | "retinoid" | "antioxidant" | "hydrator" | "barrier_repair";
  activeConcentration: string;
  irritationPotential: "high" | "medium" | "low";
  barrierRequirement: {
    minMoisture: number; // e.g. Retinol requires moisture > 55
    maxRedness: number;  // e.g. Glycolic Acid requires redness < 60
  };
  conflictsWith: string[]; // e.g. ["retinol", "ascorbic_acid", "benzoyl_peroxide"]
  saferAlternativeId: string; // e.g. Centella Asiatica / Bakuchiol
}
```

### LLM Agent Prompting (Gemini 1.5 Flash)
Gemini runs with strict JSON output schemas (`response_schema`), receiving:
1. User's YouCam diagnostic scores (`redness`, `moisture`, `skin_type`).
2. Cart item list with extracted active ingredients.
3. User's optional response to the triangulation question.

**Agent Output JSON Schema**:
```json
{
  "safety_status": "SAFE" | "CAUTION" | "CRITICAL_CONFLICT",
  "barrier_match_score": 85,
  "confidence_index": 89,
  "triangulation_needed": false,
  "conflict_summary": "Paula's Choice 1% Retinol + The Ordinary 7% Glycolic Acid on compromised skin barrier.",
  "explanation": "Your moisture score is currently 41 with elevated redness (58). Combining high-strength Retinol with direct Glycolic Acid will cause epidermal desquamation and stinging.",
  "recommended_swap": {
    "target_product_id": "prod_retinol_01",
    "replacement_product_id": "prod_centella_01",
    "replacement_name": "Skin1004 Madagascar Centella Ampoule",
    "rationale": "Calms erythema and restores stratum corneum integrity without active irritation."
  }
}
```

---

## 4. Hardware Resilience Pipeline

```
[Webcam Video Stream]
        │
        ├── 1. Client-Side Pre-Flight Check (HTML5 Canvas)
        │      • Laplacian Variance: Detects blurry or oily lens (threshold > 100)
        │      • Frame Brightness: Flags severe under/over-exposure
        │
        ├── 2. YouCam CameraKit Gating (STRICT Mode)
        │      • Face ratio ≥ 0.65 of frame
        │      • Pitch/Yaw ±10°
        │      • Lighting lower threshold ≥ 0.70
        │
        └── 3. Diagnostic Confidence Engine
               • Computes composite reliability rating (%)
               • Triggers Agent Triangulation prompt if redness is ambiguous
```

---

## 5. Directory Structure Plan

```
cartderm/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .env.local.example
├── public/
│   ├── sample_selfies/
│   └── product_images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # E-Commerce storefront with products & cart drawer
│   │   └── api/
│   │       ├── youcam/
│   │       │   ├── upload/route.ts # Pre-signed S3 upload initialization
│   │       │   ├── task/route.ts   # Submits YouCam skin-analysis task
│   │       │   └── poll/route.ts   # Polls task status until completion
│   │       └── agent/
│   │           └── analyze/route.ts# Gemini LLM conflict analysis & swap generation
│   ├── components/
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx      # Slide-out shopping cart
│   │   │   ├── CartItem.tsx        # Product row with compatibility badges
│   │   │   └── SwapModal.tsx       # 1-Click product replacement confirmation
│   │   ├── scanner/
│   │   │   ├── CameraModal.tsx     # Live webcam interface + upload tab
│   │   │   ├── PreFlightBadge.tsx  # Lens clean & lighting indicator
│   │   │   └── DiagnosticRadar.tsx # Visual metric gauge (Redness, Moisture, etc.)
│   │   └── agent/
│   │       ├── TriangulationCard.tsx # "Are your cheeks stinging?" interactive dialogue
│   │       └── ConflictAlert.tsx     # High-contrast warning banner
│   ├── lib/
│   │   ├── youcam.ts               # YouCam API client & types
│   │   ├── gemini.ts               # Google Gemini client & prompts
│   │   ├── inciDatabase.ts         # Ingredient registry & conflict rules
│   │   └── mockData.ts             # Realistic mock results for offline dev
│   └── store/
│       └── useCartStore.ts         # Zustand store for cart items & scan results
```
