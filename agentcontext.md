# 🧠 CartDerm — Agent Context & State Record

> **Role & Purpose**: This document serves as the persistent memory and operational context for any AI agent or developer building, maintaining, or extending CartDerm. It details what has been researched, architectural decisions made, current system state, and immediate next steps.

---

## 1. Project Identity & High-Level Summary
* **Project Name**: CartDerm (Cart Dermatology & Barrier Guardian)
* **Hackathon**: YouCam API Skin AI & eCommerce VTO Hackathon (Devpost)
* **Core Value**: An Agentic E-Commerce checkout companion that scans the shopper's skin via **YouCam AI Skin Analysis API v2.1**, checks active skin barrier metrics (`hd_redness`, `hd_moisture`, `hd_oiliness`, `hd_acne`, `hd_skin_type`), cross-checks shopping cart ingredients against an INCI chemical database, and performs an autonomous agentic triangulation to prevent barrier damage and recommend 1-click product swaps.

---

## 2. What Has Been Done (Historical Log)

1. **YouCam Documentation Deep Dive**:
   * Evaluated official docs at `docs.perfectcorp.com` (Introduction, Quick Start Guide, Rate Limits, File Retention, and OpenAPI v2.0/v2.1 schemas).
   * Verified endpoints:
     * File upload initialization: `POST /s2s/v2.0/file` -> PUT to AWS S3 pre-signed URL.
     * Task initiation: `POST /s2s/v2.1/task/skin-analysis`.
     * Task status polling: `GET /s2s/v2.1/task/skin-analysis/{task_id}`.
   * Documented rate limits: 250 requests per 300 seconds per IP and per Access Token (~5 QPS).
   * Documented storage lifespans: 30 days for uploaded images/task IDs; 24 hours for completed task cache; 2 hours for S3 download URLs.
   * Identified critical API constraint: **Never mix HD and SD actions** in `dst_actions` (strict rule: use `hd_*` exclusively).
   * Captured unit pricing tiers: 9–16 units for SD; 12–22 units for HD based on concern count.

2. **Hardware & Camera Lens Edge-Case Resolution**:
   * Analyzed user concern regarding low-end phone cameras, smudged lenses, poor auto-white-balance, and sensor noise.
   * Designed a 3-tier defense:
     * *Pre-flight lens clean reminder & basic client-side edge clarity check.*
     * *Diagnostic confidence rating badge displayed on UI.*
     * *Agentic Triangulation Loop: Proactively asking an interactive verification question when color-sensitive metrics (redness/moisture) are borderline.*

3. **Hackathon Alignment & Devpost Verification**:
   * Verified deadline, criteria (Technological Implementation, Design, Potential Impact, Quality of Idea), and explicit preference for **Agentic AI workflows**.
   * Selected **CartDerm** as the primary project concept because it meets the consumer *"right before a purchase"* and creates immense retail value.

4. **Project Scaffolding Blueprinting**:
   * Created `northstar.md` (Product vision, wireframe mockup, sequence diagram).
   * Creating `stack.md` (Tech stack, API schemas, libraries).
   * Creating `guardrail.md` (Non-goals, safety rules, error handling, strict boundaries).

---

## 3. Current System State

* **Location**: `D:\cartderm\`
* **Active Status**: Phase 2 Complete (Production Codebase Scaffolding & Build Verified ✓)
* **Build Verification**: `npm run build` compiled successfully (Next.js 14 App Router, TypeScript, Tailwind CSS).
* **Configuration Requirements**:
  * YouCam API Key: `.env.local` (`YOUCAM_API_KEY`)
  * Mock Mode Enabled: `MOCK_YOUCAM=true` by default for zero unit consumption during design/review.

---

## 4. Work Breakdown & Sprint Backlog

```
Sprint Task 1: Scaffolding [COMPLETED ✓]
├── Initialized Next.js 14 App (TypeScript + Tailwind CSS + Lucide Icons)
├── Configured .env.local, .env.local.example, tsconfig.json, next.config.js
└── Set up component folders: /components/cart, /components/scanner, /components/agent

Sprint Task 2: Mock Storefront & Shopping Cart [COMPLETED ✓]
├── High-end clinical skincare catalog (AURA DERMA storefront)
├── Full Cart State management (Zustand: useCartStore.ts)
└── Slide-over Shopping Cart Drawer with CartDerm Shield integration

Sprint Task 3: YouCam v2.1 Backend Pipeline [COMPLETED ✓]
├── /api/youcam/task route with live polling & mock fallback
├── YouCam client library (/lib/youcam.ts) with HD action parameters
└── Realistic mock diagnostic responses (/lib/mockData.ts)

Sprint Task 4: Camera Capture & Pre-Flight Check UI [COMPLETED ✓]
├── Camera modal (/components/scanner/CameraModal.tsx) with live WebRTC + demo presets
├── Hardware Pre-flight telemetry: Lens clarity (95%), Lighting luma (0.82), Face ratio (72%)
└── Diagnostic Reliability Index gauge (89%)

Sprint Task 5: Agentic Conflict & Triangulation Engine [COMPLETED ✓]
├── INCI contraindication engine (/api/agent/analyze/route.ts)
├── Conflict card (/components/agent/ConflictCard.tsx) with live barrier telemetry
├── Agentic Triangulation micro-question ("Are your cheeks stinging?")
└── Autonomous 1-Click Product Swap (Retinol 1% -> Bakuchiol 4%)

Sprint Task 6: Documentation & Devpost Submission Readiness [COMPLETED ✓]
├── Comprehensive README.md with system architecture diagram
├── 3-Minute Demo Video script breakdown
└── Standardized cosmetic safety disclaimer
```

---

## 5. Technical Decision Log

| Date | Decision | Rationale |
| :--- | :--- | :--- |
| **2026-10-29** | Use `format: "json"` instead of `"zip"` for primary API calls | `format: "json"` delivers instantaneous numeric scores and direct mask URLs in the HTTP response body, reducing latency compared to downloading and unzipping archive files on serverless routes. |
| **2026-10-29** | Use `v2.1` endpoint (`/s2s/v2.1/task/skin-analysis`) | v2.1 features updated AI engines and automatic input resizing up to 2560 pixels, preventing 400 errors from un-resized user selfies. |
| **2026-10-29** | Focus on HD actions: `hd_redness`, `hd_moisture`, `hd_oiliness`, `hd_acne`, `hd_skin_type` | These 5 actions directly determine chemical tolerance and skin barrier vulnerability without consuming unnecessary units. |
| **2026-10-29** | Add mock data fallback in backend routes | Enables continuous development, testing, and UI polishing without exhausting the 1,000 hackathon free units during build iterations. |
