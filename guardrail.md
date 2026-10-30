# 🚧 CartDerm — Project Guardrails & Architectural Boundaries

> **Purpose**: This document establishes hard boundaries, constraints, and anti-patterns to prevent scope creep, architectural drift, API quota exhaustion, and regulatory pitfalls during development.

---

## 1. Non-Goals (What We Are NOT Building)

1. **NOT a Medical Diagnostic Device**:
   * CartDerm does **NOT** diagnose clinical dermatological diseases (melanoma, severe cystic acne, rosacea, eczema).
   * It is strictly an **e-commerce cosmetic compatibility and skin barrier decision-support engine**.
2. **NOT a Generic "Selfie Beauty Rater"**:
   * Do not build an app that merely rates skin attractiveness or displays standalone scores without e-commerce context.
   * Every scan **must tie directly into the active shopping cart** and ingredient deck.
3. **NOT a Static Rule-Based Form**:
   * Do not replace the Agentic AI loop with simple hardcoded `if/else` statements.
   * The system must demonstrate **agentic reasoning** (triangulating symptoms, analyzing chemical interactions, explaining rationale).
4. **NOT a Checkout Blocker**:
   * CartDerm **advises, protects, and recommends**; it never forcibly locks the user from checking out if they choose to override.

---

## 2. Hard Technical Guardrails

### Guardrail 1: Strict YouCam API Compatibility
* ❌ **NEVER mix SD and HD actions**: YouCam returns a `400 InvalidParameters` error if `hd_*` and non-HD actions coexist in `dst_actions`.
  * **Rule**: All API requests must use HD actions exclusively:
    `["hd_redness", "hd_moisture", "hd_oiliness", "hd_acne", "hd_skin_type"]`.
* ❌ **NEVER upload raw un-resized multi-megabyte images**:
  * **Rule**: While API v2.1 auto-resizes up to 2560 px, the client-side canvas should scale uploads to a maximum 1920x1080 to conserve bandwidth and reduce upload latency.

### Guardrail 2: Quota & Unit Preservation (Preserving the 1,000 Free Units)
* ❌ **NEVER trigger live YouCam API calls on simple UI re-renders or hot-reloads**:
  * **Rule**: All backend routes must support a `MOCK_YOUCAM=true` environment variable.
  * When `MOCK_YOUCAM=true`, return realistic mock payloads instantly for rapid frontend styling. Live units should only be consumed during actual camera verification and demo recording.
* ❌ **NEVER re-analyze the same selfie twice**:
  * **Rule**: Cache scan results in memory / session storage keyed by the image hash.

### Guardrail 3: Hardware & Optical Reliability (No Naive Sensor Trust)
* ❌ **NEVER deliver a high-severity redness/barrier damage alert if ambient lighting is corrupted**:
  * **Rule**: If CameraKit lighting luma is below `0.70` or the user is in warm incandescent lighting, the system **MUST trigger the Agentic Triangulation Question** before finalizing the conflict alert:
    > *"Our optical scan detected cheek redness. Are your cheeks actively hot or stinging, or is your room lighting warm?"*

### Guardrail 4: S3 Link Expiration Handling
* ❌ **NEVER assume S3 download URLs are permanent**:
  * **Rule**: YouCam download URLs expire in **2 hours**. If a user returns after 2 hours, the backend must use the persistent `task_id` (valid for 30 days) to refresh the download link.

---

## 3. Mandatory Regulatory & Safety Disclaimers

Every user-facing interface displaying skin scores or ingredient warnings must include the standardized cosmetic disclaimer in the footer or modal:

> **Cosmetic Disclaimer**:  
> *CartDerm is an AI-powered cosmetic compatibility and barrier decision-support tool. It does not provide medical diagnoses, clinical advice, prescriptions, or treatments. If you experience persistent dermatitis, severe cystic inflammation, or allergic reactions, consult a board-certified dermatologist.*

---

## 4. Hackathon Submission Guardrails (Devpost Rules)

1. **Demo Video Duration**: Strictly between **1:00 and 3:00 minutes**. Videos exceeding 3 minutes are disqualified from judging by Devpost guidelines.
2. **Device Demonstration**: The video **must show the project functioning live** (webcam capture, real-time cart update, 1-click swap).
3. **Repository Cleanliness**:
   * Repository must be publicly accessible or shared with `[email protected]`.
   * Include a verified `.env.local.example` with clear instructions on setting `YOUCAM_API_KEY` and `GEMINI_API_KEY`.
   * No hardcoded API keys in Git history.
