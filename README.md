# SYNAPSE SCREEN — AI-Powered Document & Identity Screening System

### Ministry of Home Affairs · Sashastra Seema Bal (SSB), Police II Division
**Problem Statement ID:** 26188  
**Theme:** Blockchain & Cybersecurity / Fake Identity & Document Screening  
**Category:** Software

---

## 1. Executive Summary

**SYNAPSE SCREEN** is an enterprise-grade border and immigration document screening platform designed for authorized screening officers and supervisory personnel. It automates multi-stage forensic analysis across identity substrates (Passports, Visas, National ID / Aadhaar, Driving Licences, Cross-Border Travel Permits) without sacrificing human oversight or audit accountability.

### Architectural Core
The screening pipeline is strictly decomposed into 8 sequential verification stages:
1. **Document Classification & Schema Mapping**: Configurable schemas for ICAO Doc 9303 (TD3, MRV), ISO/IEC 18013, and UIDAI standards.
2. **Sensor Acquisition**: Dual-mode optical input (high-res flatbed scan upload or live camera capture via MediaDevices API with quality matrix checking).
3. **OpenCV-Style Preprocessing**: Planar boundary extraction, four-point perspective warp, deskew (Hough transform), and local contrast optimization (CLAHE).
4. **OCR & Field Extraction**: Optical character recognition mapping visual inspection zones and machine-readable zones with character-level confidence scores.
5. **Syntax & Checksum Validation**: Modulus-7 optical check digits, temporal expiration verification, and explicit disclaimers for central reference registry status.
6. **AI Tampering & Forensic Heatmap**: Deep-learning inspection of portrait photo replacement halos, font kerning splicing, and guilloche security pattern continuity.
7. **1:1 Facial Biometric Comparison**: Cosine distance evaluation between extracted document photo token and live traveler optical stream.
8. **Explainable Composite Risk Engine**: Transparent Bayesian decision synthesis attributing positive and negative point deltas to every signal.
9. **Human-in-the-Loop Officer Determination**: Mandatory officer recommendation (`[CLEAR]`, `[REVIEW REQUIRED]`, `[ESCALATE]`), forensic notes, and digital signature sealing into an immutable audit trail.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **AI Service Abstraction**: Pluggable microservice adapter layer (`AIServiceFactory`) supporting `AI_MODE="mock"` and `AI_MODE="production"`
- **Storage & State**: Reactive client-side persistent storage with seed border cases, plus full Supabase PostgreSQL schema (`src/database/schema.sql`)
- **Security & Integrity**: Web Crypto API SHA-256 digital audit trail, strict file MIME/size validation, and PII masking

---

## 3. Environment Setup & Quickstart

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Step-by-Step Installation

```bash
# 1. Clone repository
git clone https://github.com/mha-ssb/synapse-screen.git
cd synapse-screen

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run database migrations (Supabase PostgreSQL)
# Apply the SQL file located at: src/database/schema.sql
# In the Supabase SQL Editor or via CLI:
# supabase db push

# 5. Start the development workstation server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 4. Switching Between Mock and Production AI Modes

The application operates in **Mock Mode** (`AI_MODE="mock"`) by default. This ensures deterministic, instant evaluations for presentation juries without external API dependencies or unexpected latency.

### To switch to live microservices:

1. Update `.env.local`:
   ```bash
   AI_MODE="production"
   OCR_API_URL="https://your-ocr-service.domain/v1/extract"
   OCR_API_KEY="your_api_key_here"
   TAMPERING_API_URL="https://your-tampering-service.domain/v1/analyze"
   FACE_VERIFICATION_API_URL="https://your-biometrics.domain/v1/compare"
   ```

2. Alternatively, switch at runtime:
   - Navigate to **AI Engines & API Config** in the sidebar.
   - Click **PRODUCTION APIS** in the top-right toggle.

Refer to `AI_INTEGRATION.md` for complete API request/response schemas.

---

## 5. Pre-Configured SIH Evaluation Scenarios

For rapid judge demonstration, click the **Demo Scenarios** button in the top navigation bar or the dashboard banner:
1. **Scenario 1: Clean International Passport** — Low Risk (14/100). Full checksum and 96% biometric match.
2. **Scenario 2: Tampered Photo Replacement & Spliced Number** — High Risk (78/100). Compression halo and MRZ mismatch.
3. **Scenario 3: Expired Transit Visa** — Medium Risk (46/100). Expired temporal validity requiring supervisor review.
4. **Scenario 4: Biometric Impersonator (Face Mismatch)** — Critical Risk (84/100). Impersonator presenting genuine card with 22% face similarity.
5. **Scenario 5: Official Seal / Stamp Forgery** — High Risk (68/100). Severed guilloche background pattern.
6. **Scenario 6: Multiple Warning Signals** — High Risk (72/100). Optical noise and EXIF editing signatures.

---

## 6. Official Disclaimer

*AI-assisted screening system. This platform supports authorized personnel and does not replace official document verification or human decision-making. No live government database queries are claimed during offline demo evaluation.*
