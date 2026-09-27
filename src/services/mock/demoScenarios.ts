import {
  DocumentType,
  OCRResult,
  DocumentValidationResult,
  TamperingResult,
  FaceVerificationResult,
  RiskEngineResult
} from '../../types';

export interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  documentType: DocumentType;
  expectedRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedRiskScore: number;
  sampleDocumentUrl: string;
  samplePersonUrl: string;
  ocrOverride: Partial<OCRResult>;
  validationOverride: Partial<DocumentValidationResult>;
  tamperingOverride: Partial<TamperingResult>;
  faceOverride: Partial<FaceVerificationResult>;
  riskOverride: Partial<RiskEngineResult>;
}

// Inline high-fidelity SVG data URLs for realistic document samples (zero external dependency breakage)
export const SAMPLE_DOC_PASSPORT_CLEAN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
  <rect width="800" height="540" fill="%23f8fafc" rx="16"/>
  <rect x="24" y="24" width="752" height="492" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2" rx="12"/>
  <rect x="40" y="40" width="720" height="60" fill="%230f172a" rx="8"/>
  <text x="60" y="78" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold" letter-spacing="3">REPUBLIC OF INDICA — PASSPORT</text>
  <text x="680" y="78" fill="%2338bdf8" font-family="monospace" font-size="16">TYPE P</text>
  
  <!-- Photo placeholder box -->
  <rect x="56" y="130" width="180" height="230" fill="%23e2e8f0" stroke="%2394a3b8" stroke-width="2" rx="8"/>
  <!-- Avatar silhouette -->
  <circle cx="146" cy="205" r="48" fill="%23475569"/>
  <path d="M 86 330 C 86 270, 206 270, 206 330 Z" fill="%23475569"/>
  <text x="146" y="380" fill="%2364748b" font-family="sans-serif" font-size="12" text-anchor="middle">OFFICIAL PORTRAIT</text>
  
  <!-- Document Details -->
  <text x="270" y="150" fill="%2364748b" font-family="sans-serif" font-size="11">FULL LEGAL SURNAME, GIVEN NAMES</text>
  <text x="270" y="175" fill="%230f172a" font-family="sans-serif" font-size="18" font-weight="bold">KUMAR, RAHUL</text>
  
  <text x="270" y="210" fill="%2364748b" font-family="sans-serif" font-size="11">PASSPORT NO.</text>
  <text x="270" y="235" fill="%230f172a" font-family="monospace" font-size="18" font-weight="bold">P1234567</text>
  
  <text x="470" y="210" fill="%2364748b" font-family="sans-serif" font-size="11">NATIONALITY</text>
  <text x="470" y="235" fill="%230f172a" font-family="sans-serif" font-size="16" font-weight="bold">IND</text>

  <text x="270" y="270" fill="%2364748b" font-family="sans-serif" font-size="11">DATE OF BIRTH</text>
  <text x="270" y="295" fill="%230f172a" font-family="sans-serif" font-size="15">12 APR 1998</text>

  <text x="470" y="270" fill="%2364748b" font-family="sans-serif" font-size="11">GENDER</text>
  <text x="470" y="295" fill="%230f172a" font-family="sans-serif" font-size="15">M</text>

  <text x="270" y="330" fill="%2364748b" font-family="sans-serif" font-size="11">DATE OF EXPIRY</text>
  <text x="270" y="355" fill="%230f172a" font-family="sans-serif" font-size="15" font-weight="bold">14 JAN 2031</text>

  <!-- Security Emblem -->
  <circle cx="680" cy="180" r="36" fill="none" stroke="%230284c7" stroke-width="3" stroke-dasharray="6,3"/>
  <text x="680" y="185" fill="%230284c7" font-family="sans-serif" font-size="10" text-anchor="middle" font-weight="bold">OFFICIAL SEAL</text>

  <!-- MRZ Zone -->
  <rect x="40" y="420" width="720" height="80" fill="%23ffffff" stroke="%23cbd5e1" rx="6"/>
  <text x="60" y="452" fill="%230f172a" font-family="monospace" font-size="16" letter-spacing="4">P&lt;INDKUMAR&lt;&lt;RAHUL&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="60" y="484" fill="%230f172a" font-family="monospace" font-size="16" letter-spacing="4">P1234567&lt;4IND9804128M3101142&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;4</text>
</svg>`;

export const SAMPLE_DOC_TAMPERED = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
  <rect width="800" height="540" fill="%23f8fafc" rx="16"/>
  <rect x="24" y="24" width="752" height="492" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2" rx="12"/>
  <rect x="40" y="40" width="720" height="60" fill="%230f172a" rx="8"/>
  <text x="60" y="78" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold" letter-spacing="3">REPUBLIC OF INDICA — PASSPORT</text>
  <text x="680" y="78" fill="%2338bdf8" font-family="monospace" font-size="16">TYPE P</text>
  
  <!-- Tampered Photo Replacement box with visible splice halo -->
  <rect x="52" y="126" width="188" height="238" fill="%23fef2f2" stroke="%23ef4444" stroke-width="3" stroke-dasharray="4,4" rx="8"/>
  <rect x="56" y="130" width="180" height="230" fill="%23fee2e2" rx="8"/>
  <circle cx="146" cy="205" r="48" fill="%23991b1b"/>
  <path d="M 86 330 C 86 270, 206 270, 206 330 Z" fill="%23991b1b"/>
  <text x="146" y="380" fill="%23dc2626" font-family="sans-serif" font-size="11" text-anchor="middle" font-weight="bold">PHOTO SPLICING DETECTED</text>
  
  <!-- Document Details with altered text highlight -->
  <text x="270" y="150" fill="%2364748b" font-family="sans-serif" font-size="11">FULL LEGAL SURNAME, GIVEN NAMES</text>
  <text x="270" y="175" fill="%230f172a" font-family="sans-serif" font-size="18" font-weight="bold">KUMAR, RAHUL</text>
  
  <text x="270" y="210" fill="%2364748b" font-family="sans-serif" font-size="11">PASSPORT NO.</text>
  <rect x="266" y="218" width="150" height="26" fill="%23fef08a" opacity="0.6"/>
  <text x="270" y="235" fill="%23854d0e" font-family="monospace" font-size="18" font-weight="bold">P9928172</text>
  
  <text x="470" y="210" fill="%2364748b" font-family="sans-serif" font-size="11">NATIONALITY</text>
  <text x="470" y="235" fill="%230f172a" font-family="sans-serif" font-size="16" font-weight="bold">IND</text>

  <text x="270" y="270" fill="%2364748b" font-family="sans-serif" font-size="11">DATE OF BIRTH</text>
  <text x="270" y="295" fill="%230f172a" font-family="sans-serif" font-size="15">12 APR 1998</text>

  <text x="470" y="270" fill="%2364748b" font-family="sans-serif" font-size="11">GENDER</text>
  <text x="470" y="295" fill="%230f172a" font-family="sans-serif" font-size="15">M</text>

  <text x="270" y="330" fill="%2364748b" font-family="sans-serif" font-size="11">DATE OF EXPIRY</text>
  <text x="270" y="355" fill="%230f172a" font-family="sans-serif" font-size="15" font-weight="bold">14 JAN 2031</text>

  <!-- Tampered Stamp -->
  <circle cx="680" cy="180" r="36" fill="none" stroke="%23ef4444" stroke-width="3" stroke-dasharray="4,4"/>
  <text x="680" y="185" fill="%23ef4444" font-family="sans-serif" font-size="9" text-anchor="middle" font-weight="bold">SEAL ALTERED</text>

  <!-- MRZ Zone with mismatch -->
  <rect x="40" y="420" width="720" height="80" fill="%23fff1f2" stroke="%23fda4af" rx="6"/>
  <text x="60" y="452" fill="%230f172a" font-family="monospace" font-size="16" letter-spacing="4">P&lt;INDKUMAR&lt;&lt;RAHUL&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="60" y="484" fill="%23be123c" font-family="monospace" font-size="16" letter-spacing="4">P1234567&lt;4IND9804128M3101142&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;4</text>
</svg>`;

export const SAMPLE_PERSON_MATCHING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="%230f172a"/>
  <circle cx="150" cy="115" r="55" fill="%2338bdf8"/>
  <path d="M 60 270 C 60 190, 240 190, 240 270 Z" fill="%2338bdf8"/>
  <circle cx="132" cy="110" r="6" fill="%230f172a"/>
  <circle cx="168" cy="110" r="6" fill="%230f172a"/>
  <path d="M 135 140 Q 150 152 165 140" stroke="%230f172a" stroke-width="3" fill="none"/>
  <rect x="10" y="10" width="280" height="280" fill="none" stroke="%2322c55e" stroke-width="2" rx="12"/>
  <text x="150" y="285" fill="%2322c55e" font-family="sans-serif" font-size="12" text-anchor="middle" font-weight="bold">LIVE CAPTURE: MATCH</text>
</svg>`;

export const SAMPLE_PERSON_MISMATCH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="%230f172a"/>
  <circle cx="150" cy="115" r="65" fill="%23f97316"/>
  <path d="M 50 270 C 50 180, 250 180, 250 270 Z" fill="%23f97316"/>
  <circle cx="130" cy="115" r="7" fill="%230f172a"/>
  <circle cx="170" cy="115" r="7" fill="%230f172a"/>
  <line x1="135" y1="145" x2="165" y2="145" stroke="%230f172a" stroke-width="3"/>
  <rect x="10" y="10" width="280" height="280" fill="none" stroke="%23ef4444" stroke-width="2" stroke-dasharray="6,4" rx="12"/>
  <text x="150" y="285" fill="%23ef4444" font-family="sans-serif" font-size="12" text-anchor="middle" font-weight="bold">LIVE CAPTURE: BIOMETRIC MISMATCH</text>
</svg>`;

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario_clean_passport',
    name: 'Scenario 1: Clean International Passport',
    badge: 'LOW RISK (PASS)',
    description: 'Authentic passport with valid temporal dates, verified MRZ modulus-7 checks, high photo integrity, and 96% live face match.',
    documentType: 'passport',
    expectedRiskLevel: 'LOW',
    expectedRiskScore: 14,
    sampleDocumentUrl: SAMPLE_DOC_PASSPORT_CLEAN,
    samplePersonUrl: SAMPLE_PERSON_MATCHING,
    ocrOverride: {
      overallConfidence: 0.982,
      mrz: 'P<INDKUMAR<<RAHUL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\nP1234567<4IND9804128M3101142<<<<<<<<<<<<<<<4',
      fields: {
        name: { key: 'name', label: 'Full Legal Name', value: 'KUMAR, RAHUL', confidence: 0.99, status: 'valid', isMandatory: true },
        documentNumber: { key: 'documentNumber', label: 'Passport Number', value: 'P1234567', confidence: 0.995, status: 'valid', isMandatory: true },
        nationality: { key: 'nationality', label: 'Nationality', value: 'IND', confidence: 0.99, status: 'valid', isMandatory: true },
        dateOfBirth: { key: 'dateOfBirth', label: 'Date of Birth', value: '12/04/1998', confidence: 0.98, status: 'valid', isMandatory: true },
        gender: { key: 'gender', label: 'Gender', value: 'M', confidence: 0.99, status: 'valid', isMandatory: true },
        dateOfIssue: { key: 'dateOfIssue', label: 'Date of Issue', value: '15/01/2021', confidence: 0.98, status: 'valid', isMandatory: true },
        dateOfExpiry: { key: 'dateOfExpiry', label: 'Date of Expiry', value: '14/01/2031', confidence: 0.98, status: 'valid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: true,
      checks: [
        { id: 'c1', label: 'Required Legal Fields', category: 'format', passed: true, status: 'valid', detail: 'All 7 mandatory fields present and parsed.' },
        { id: 'c2', label: 'Document Number Format', category: 'format', passed: true, status: 'valid', detail: 'Conforms to ICAO Doc 9303 Part 4 standard.' },
        { id: 'c3', label: 'Temporal Validity', category: 'expiration', passed: true, status: 'valid', detail: 'Valid until 14 Jan 2031 (> 4 years remaining).' },
        { id: 'c4', label: 'MRZ Optical Consistency', category: 'mrz_consistency', passed: true, status: 'valid', detail: 'VIZ passport number matches MRZ checksum perfectly.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 96,
      textIntegrity: 98,
      stampIntegrity: 93,
      metadataConsistency: 91,
      overallTamperingRisk: 'LOW',
      regions: [
        { id: 'r1', name: 'Portrait Photo Zone', type: 'photo', box: { x: 7, y: 24, width: 24, height: 44 }, integrity: 96, finding: 'Uniform pixel grain, no spatial halo or copy-paste artifacts.', confidence: 0.95, status: 'pass' },
        { id: 'r2', name: 'Text Matrix & Kerning', type: 'text', box: { x: 34, y: 26, width: 60, height: 35 }, integrity: 98, finding: 'Standard security typography baseline intact.', confidence: 0.97, status: 'pass' }
      ]
    },
    faceOverride: {
      similarity: 0.962,
      confidence: 0.96,
      matchResult: 'MATCH'
    },
    riskOverride: {
      score: 14,
      level: 'LOW',
      factors: [
        { id: 'rf1', label: 'High OCR Extraction Confidence', delta: -10, description: 'Clear optical fidelity across character blocks.', category: 'mrz' },
        { id: 'rf2', label: 'Valid Checksum & Active Expiration', delta: -15, description: 'Passport is active and strictly formatted.', category: 'validity' },
        { id: 'rf3', label: 'Biometric Face Match Verified', delta: -20, description: 'Presented individual matches document photo (96.2%).', category: 'biometric' }
      ],
      findingsSummary: [
        { text: 'High optical fidelity across all zones', type: 'pass', module: 'OCR' },
        { text: 'Temporal validity verified (> 4 years remaining)', type: 'pass', module: 'VALIDATION' },
        { text: 'No tampering artifacts found across forensic regions', type: 'pass', module: 'FORENSICS' },
        { text: 'Biometric face verification matched with 96.2% similarity', type: 'pass', module: 'FACE' }
      ]
    }
  },
  {
    id: 'scenario_tampered_document',
    name: 'Scenario 2: Tampered Photo Replacement & Number Alteration',
    badge: 'HIGH RISK (TAMPERED)',
    description: 'Document with physical photo replacement, localized compression halo, spliced document numbers, and MRZ checksum discrepancy.',
    documentType: 'passport',
    expectedRiskLevel: 'HIGH',
    expectedRiskScore: 78,
    sampleDocumentUrl: SAMPLE_DOC_TAMPERED,
    samplePersonUrl: SAMPLE_PERSON_MISMATCH,
    ocrOverride: {
      overallConfidence: 0.89,
      mrz: 'P<INDKUMAR<<RAHUL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\nP1234567<4IND9804128M3101142<<<<<<<<<<<<<<<4',
      fields: {
        name: { key: 'name', label: 'Full Legal Name', value: 'KUMAR, RAHUL', confidence: 0.95, status: 'valid', isMandatory: true },
        documentNumber: { key: 'documentNumber', label: 'Passport Number', value: 'P9928172', confidence: 0.82, status: 'warning', isMandatory: true, notes: 'Altered visual font' },
        nationality: { key: 'nationality', label: 'Nationality', value: 'IND', confidence: 0.98, status: 'valid', isMandatory: true },
        dateOfBirth: { key: 'dateOfBirth', label: 'Date of Birth', value: '12/04/1998', confidence: 0.94, status: 'valid', isMandatory: true },
        dateOfExpiry: { key: 'dateOfExpiry', label: 'Date of Expiry', value: '14/01/2031', confidence: 0.95, status: 'valid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: false,
      checks: [
        { id: 'c1', label: 'Required Legal Fields', category: 'format', passed: true, status: 'valid', detail: 'Mandatory fields extracted.' },
        { id: 'c2', label: 'MRZ Consistency Check', category: 'mrz_consistency', passed: false, status: 'invalid', detail: 'VIZ number (P9928172) DOES NOT MATCH MRZ line (P1234567).' },
        { id: 'c3', label: 'Document Number Kerning', category: 'format', passed: false, status: 'warning', detail: 'Splicing artifact detected around digits 9928.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 34,
      textIntegrity: 48,
      stampIntegrity: 42,
      metadataConsistency: 62,
      overallTamperingRisk: 'HIGH',
      regions: [
        { id: 'r1', name: 'Portrait Photo Region', type: 'photo', box: { x: 6, y: 22, width: 26, height: 48 }, integrity: 34, finding: 'Photo replacement detected: compression discontinuity and adhesive border halo.', confidence: 0.92, status: 'flagged' },
        { id: 'r2', name: 'Passport Number Zone', type: 'text', box: { x: 34, y: 38, width: 28, height: 12 }, integrity: 48, finding: 'Text manipulation: character misalignment and font weight inconsistency.', confidence: 0.88, status: 'flagged' },
        { id: 'r3', name: 'Official Seal Substrate', type: 'stamp', box: { x: 80, y: 28, width: 14, height: 18 }, integrity: 42, finding: 'Emblem pattern disrupted by digital raster stamp insertion.', confidence: 0.86, status: 'flagged' }
      ]
    },
    faceOverride: {
      similarity: 0.38,
      confidence: 0.94,
      matchResult: 'NO_MATCH'
    },
    riskOverride: {
      score: 78,
      level: 'HIGH',
      factors: [
        { id: 'rf1', label: 'Photo Manipulation / Replacement Flag', delta: +30, description: 'Portrait integrity scored 34%. Compression boundary detected.', category: 'tampering' },
        { id: 'rf2', label: 'MRZ & Text Inconsistency Flag', delta: +25, description: 'Visual number mismatch against encoded MRZ composite line.', category: 'validity' },
        { id: 'rf3', label: 'Biometric Face Mismatch', delta: +35, description: 'Presented individual does not match document portrait (38%).', category: 'biometric' }
      ],
      findingsSummary: [
        { text: 'Visual document number differs from encoded MRZ', type: 'alert', module: 'VALIDATION' },
        { text: 'Photo integrity failure (34%): Replacement halo detected', type: 'alert', module: 'FORENSICS' },
        { text: 'Text integrity failure (48%): Spliced alphanumeric characters', type: 'alert', module: 'FORENSICS' },
        { text: 'Face comparison failed: 38% similarity (NO MATCH)', type: 'alert', module: 'FACE' }
      ]
    }
  },
  {
    id: 'scenario_expired_visa',
    name: 'Scenario 3: Expired Transit Visa',
    badge: 'MEDIUM RISK (EXPIRED)',
    description: 'Genuine visa permit document that has passed its temporal validity date, requiring supervisor discretion.',
    documentType: 'visa',
    expectedRiskLevel: 'MEDIUM',
    expectedRiskScore: 46,
    sampleDocumentUrl: SAMPLE_DOC_PASSPORT_CLEAN,
    samplePersonUrl: SAMPLE_PERSON_MATCHING,
    ocrOverride: {
      overallConfidence: 0.97,
      fields: {
        visaNumber: { key: 'visaNumber', label: 'Visa Number', value: 'V1092841', confidence: 0.98, status: 'valid', isMandatory: true },
        visaType: { key: 'visaType', label: 'Visa Category', value: 'TRANSIT', confidence: 0.98, status: 'valid', isMandatory: true },
        name: { key: 'name', label: 'Full Legal Name', value: 'GUPTA, SURESH', confidence: 0.97, status: 'valid', isMandatory: true },
        passportNumber: { key: 'passportNumber', label: 'Linked Passport', value: 'P5819204', confidence: 0.99, status: 'valid', isMandatory: true },
        dateOfIssue: { key: 'dateOfIssue', label: 'Issue Date', value: '10/01/2023', confidence: 0.96, status: 'valid', isMandatory: true },
        dateOfExpiry: { key: 'dateOfExpiry', label: 'Expiry Date', value: '09/01/2024', confidence: 0.97, status: 'invalid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: false,
      checks: [
        { id: 'c1', label: 'Required Legal Fields', category: 'format', passed: true, status: 'valid', detail: 'All mandatory visa fields present.' },
        { id: 'c2', label: 'Temporal Expiration', category: 'expiration', passed: false, status: 'invalid', detail: 'DOCUMENT EXPIRED on 09/01/2024. Border transit prohibited.' },
        { id: 'c3', label: 'Entry Validity', category: 'format', passed: true, status: 'valid', detail: 'Single entry permit.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 92,
      textIntegrity: 94,
      stampIntegrity: 90,
      metadataConsistency: 86,
      overallTamperingRisk: 'LOW',
      regions: [
        { id: 'r1', name: 'Document Substrate', type: 'text', box: { x: 10, y: 15, width: 80, height: 70 }, integrity: 93, finding: 'No visual forgery or physical alteration detected.', confidence: 0.93, status: 'pass' }
      ]
    },
    faceOverride: {
      similarity: 0.94,
      confidence: 0.95,
      matchResult: 'MATCH'
    },
    riskOverride: {
      score: 46,
      level: 'MEDIUM',
      factors: [
        { id: 'rf1', label: 'Temporal Expiration Violation', delta: +35, description: 'Document validity expired in previous calendar cycle.', category: 'validity' },
        { id: 'rf2', label: 'Biometric Face Match Verified', delta: -15, description: 'Bearer identity matches valid travel record.', category: 'biometric' }
      ],
      findingsSummary: [
        { text: 'High OCR confidence across visa fields', type: 'pass', module: 'OCR' },
        { text: 'EXPIRED DOCUMENT: Temporal window terminated 09/01/2024', type: 'alert', module: 'VALIDATION' },
        { text: 'Physical substrate integrity intact (No tampering detected)', type: 'pass', module: 'FORENSICS' },
        { text: 'Biometric face match verified (94%)', type: 'pass', module: 'FACE' }
      ]
    }
  },
  {
    id: 'scenario_face_mismatch',
    name: 'Scenario 4: Biometric Impersonation / Face Mismatch',
    badge: 'CRITICAL (IMPERSONATOR)',
    description: 'Clean document presented by a different individual. Biometric facial cosine distance exceeds threshold.',
    documentType: 'national_id',
    expectedRiskLevel: 'CRITICAL',
    expectedRiskScore: 84,
    sampleDocumentUrl: SAMPLE_DOC_PASSPORT_CLEAN,
    samplePersonUrl: SAMPLE_PERSON_MISMATCH,
    ocrOverride: {
      overallConfidence: 0.98,
      fields: {
        name: { key: 'name', label: 'Full Legal Name', value: 'RAJESH CHANDRA', confidence: 0.98, status: 'valid', isMandatory: true },
        documentNumber: { key: 'documentNumber', label: 'Identity Number', value: '4912-8812-4019', confidence: 0.99, status: 'valid', isMandatory: true },
        dateOfBirth: { key: 'dateOfBirth', label: 'Date of Birth', value: '18/11/1985', confidence: 0.97, status: 'valid', isMandatory: true },
        gender: { key: 'gender', label: 'Gender', value: 'MALE', confidence: 0.99, status: 'valid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: true,
      checks: [
        { id: 'c1', label: 'Syntax & Formatting', category: 'format', passed: true, status: 'valid', detail: 'Verhoeff 12-digit format valid.' },
        { id: 'c2', label: 'Temporal State', category: 'expiration', passed: true, status: 'valid', detail: 'Active National ID record.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 94,
      textIntegrity: 96,
      stampIntegrity: 92,
      metadataConsistency: 89,
      overallTamperingRisk: 'LOW',
      regions: []
    },
    faceOverride: {
      similarity: 0.22,
      confidence: 0.96,
      matchResult: 'NO_MATCH'
    },
    riskOverride: {
      score: 84,
      level: 'CRITICAL',
      factors: [
        { id: 'rf1', label: 'Severe Biometric Face Discrepancy', delta: +50, description: 'Presented person matches portrait with only 22.1% cosine similarity. Extreme impersonation probability.', category: 'biometric' }
      ],
      findingsSummary: [
        { text: 'Document substrate and identifiers valid', type: 'pass', module: 'VALIDATION' },
        { text: 'CRITICAL ALERT: Presenting individual does not match document photo (22% similarity)', type: 'alert', module: 'FACE' },
        { text: 'Escalation to Secondary Border Inspection mandated', type: 'alert', module: 'FACE' }
      ]
    }
  },
  {
    id: 'scenario_stamp_forgery',
    name: 'Scenario 5: Official Seal / Stamp Forgery',
    badge: 'HIGH RISK (SEAL FORGERY)',
    description: 'Document with forged immigration entry stamp, severed micro-print guilloche border, and ink reflectance discrepancy.',
    documentType: 'travel_permit',
    expectedRiskLevel: 'HIGH',
    expectedRiskScore: 68,
    sampleDocumentUrl: SAMPLE_DOC_TAMPERED,
    samplePersonUrl: SAMPLE_PERSON_MATCHING,
    ocrOverride: {
      overallConfidence: 0.92,
      fields: {
        name: { key: 'name', label: 'Traveler Name', value: 'PRADEEP ADHIKARI', confidence: 0.94, status: 'valid', isMandatory: true },
        documentNumber: { key: 'documentNumber', label: 'Border Pass Token', value: 'BP-2026-9921', confidence: 0.91, status: 'warning', isMandatory: true },
        checkpoint: { key: 'checkpoint', label: 'Authorized Checkpost', value: 'Raxaul Border Terminal', confidence: 0.95, status: 'valid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: false,
      checks: [
        { id: 'c1', label: 'Checkpost Authority Seal', category: 'format', passed: false, status: 'invalid', detail: 'Immigration stamp signature hash does not match current SSB checkpost rotation token.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 88,
      textIntegrity: 86,
      stampIntegrity: 32,
      metadataConsistency: 70,
      overallTamperingRisk: 'HIGH',
      regions: [
        { id: 'r1', name: 'Frontier Stamp Zone', type: 'stamp', box: { x: 72, y: 15, width: 22, height: 25 }, integrity: 32, finding: 'Stamp forgery: Digital overlay artifacts and disrupted background guilloche wave pattern.', confidence: 0.91, status: 'flagged' }
      ]
    },
    faceOverride: {
      similarity: 0.88,
      confidence: 0.92,
      matchResult: 'MATCH'
    },
    riskOverride: {
      score: 68,
      level: 'HIGH',
      factors: [
        { id: 'rf1', label: 'Official Stamp Integrity Violation', delta: +35, description: 'Stamp integrity scored 32%. Optical pattern disruption detected.', category: 'tampering' },
        { id: 'rf2', label: 'Biometric Face Match Verified', delta: -10, description: 'Presented individual matches travel pass portrait.', category: 'biometric' }
      ],
      findingsSummary: [
        { text: 'High risk of stamp forgery identified in official seal zone', type: 'alert', module: 'FORENSICS' },
        { text: 'Visual seal is an uncalibrated digital reproduction', type: 'alert', module: 'FORENSICS' }
      ]
    }
  },
  {
    id: 'scenario_multiple_anomalies',
    name: 'Scenario 6: Multiple Warning Signals & Low Optical Resolution',
    badge: 'HIGH RISK (MULTI-SIGNAL)',
    description: 'Sub-optimal acquisition scan with metadata date anomalies, borderline facial similarity, and non-standard typography kerning.',
    documentType: 'driving_licence',
    expectedRiskLevel: 'HIGH',
    expectedRiskScore: 72,
    sampleDocumentUrl: SAMPLE_DOC_TAMPERED,
    samplePersonUrl: SAMPLE_PERSON_MATCHING,
    ocrOverride: {
      overallConfidence: 0.84,
      fields: {
        name: { key: 'name', label: 'Licence Holder Name', value: 'MOHAN LAL YADAV', confidence: 0.85, status: 'warning', isMandatory: true },
        documentNumber: { key: 'documentNumber', label: 'Licence Number', value: 'DL-04201800918', confidence: 0.82, status: 'warning', isMandatory: true },
        vehicleClass: { key: 'vehicleClass', label: 'Vehicle Class', value: 'LMV-TR', confidence: 0.88, status: 'valid', isMandatory: true }
      }
    },
    validationOverride: {
      isValid: false,
      checks: [
        { id: 'c1', label: 'State Transport Syntax', category: 'format', passed: true, status: 'valid', detail: 'Syntax pattern adheres to state code DL-04.' },
        { id: 'c2', label: 'Image Quality Assessment', category: 'format', passed: false, status: 'warning', detail: 'Sub-optimal optical resolution (150 DPI) may reduce forensic sensitivity.' }
      ]
    },
    tamperingOverride: {
      photoIntegrity: 68,
      textIntegrity: 62,
      stampIntegrity: 71,
      metadataConsistency: 44,
      overallTamperingRisk: 'MEDIUM',
      regions: [
        { id: 'r1', name: 'EXIF Metadata Stream', type: 'metadata', box: { x: 0, y: 0, width: 100, height: 100 }, integrity: 44, finding: 'EXIF metadata indicates image was modified via editing software 4 hours prior to screening.', confidence: 0.94, status: 'flagged' }
      ]
    },
    faceOverride: {
      similarity: 0.76,
      confidence: 0.88,
      matchResult: 'REVIEW'
    },
    riskOverride: {
      score: 72,
      level: 'HIGH',
      factors: [
        { id: 'rf1', label: 'Image Editing Metadata Artifact', delta: +20, description: 'Discrepancy between capture software and sensor profile.', category: 'metadata' },
        { id: 'rf2', label: 'Borderline Face Similarity', delta: +15, description: 'Similarity 76% (Near threshold of 75%). Requires visual verification.', category: 'biometric' },
        { id: 'rf3', label: 'Text Kerning & Quality Degradation', delta: +15, description: 'Optical noise detected across text lines.', category: 'tampering' }
      ],
      findingsSummary: [
        { text: 'Image metadata indicates third-party editing software signature', type: 'alert', module: 'FORENSICS' },
        { text: 'Borderline face match (76%) mandates manual officer confirmation', type: 'warning', module: 'FACE' },
        { text: 'Sub-optimal scan resolution detected', type: 'warning', module: 'OCR' }
      ]
    }
  }
];
