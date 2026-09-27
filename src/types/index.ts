export type DocumentType =
  | 'passport'
  | 'visa'
  | 'national_id'
  | 'driving_licence'
  | 'residence_permit'
  | 'travel_permit'
  | 'other';

export type UserRole = 'OFFICER' | 'SUPERVISOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  officialId: string;
  fullName: string;
  email: string;
  rank: string;
  station: string;
  role: UserRole;
  avatarUrl?: string;
}

export type ScreeningState =
  | 'CREATED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'PREPROCESSING'
  | 'OCR_PROCESSING'
  | 'VALIDATING'
  | 'FORENSIC_ANALYSIS'
  | 'FACE_VERIFICATION'
  | 'RISK_ANALYSIS'
  | 'COMPLETED'
  | 'REVIEW_REQUIRED'
  | 'ESCALATED'
  | 'FAILED';

export interface ImageQualityAssessment {
  overallPass: boolean;
  blurScore: number; // 0-100 (higher is sharper)
  glareDetected: boolean;
  resolution: string;
  lightingQuality: 'OPTIMAL' | 'SUB_OPTIMAL' | 'POOR';
  cropDetected: boolean;
  orientationDegrees: number;
  advisoryMessage?: string;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number; // 0 - 1.0
  status: 'valid' | 'warning' | 'invalid';
  isMandatory: boolean;
  notes?: string;
}

export interface OCRResult {
  documentType: DocumentType;
  fields: Record<string, ExtractedField>;
  rawText: string;
  mrz?: string;
  overallConfidence: number;
  processedAt: string;
  isApiConnected?: boolean;
  apiMessage?: string;
}

export interface ValidationCheck {
  id: string;
  label: string;
  category: 'format' | 'checksum' | 'expiration' | 'mrz_consistency' | 'reference_db';
  passed: boolean;
  status: 'valid' | 'warning' | 'invalid' | 'unverified';
  detail: string;
}

export interface DocumentValidationResult {
  checks: ValidationCheck[];
  isValid: boolean;
  referenceDbStatus: 'CONNECTED' | 'DISCONNECTED';
  referenceDbMessage: string;
  validatedAt: string;
  isApiConnected?: boolean;
}

export interface ForensicRegion {
  id: string;
  name: string;
  type: 'photo' | 'text' | 'stamp' | 'security_pattern' | 'metadata';
  box: { x: number; y: number; width: number; height: number }; // percentage 0-100
  integrity: number; // 0-100%
  finding: string;
  confidence: number;
  status: 'pass' | 'review' | 'flagged';
}

export interface TamperingResult {
  photoIntegrity: number; // 0-100%
  textIntegrity: number; // 0-100%
  stampIntegrity: number; // 0-100%
  metadataConsistency: number; // 0-100%
  overallTamperingRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNVERIFIED';
  regions: ForensicRegion[];
  metadataExif: Record<string, string>;
  analyzedAt: string;
  isApiConnected?: boolean;
  statusMessage?: string;
}

export interface FaceVerificationResult {
  similarity: number; // 0 - 1.0 (e.g. 0.94)
  confidence: number; // 0 - 1.0
  matchResult: 'MATCH' | 'REVIEW' | 'NO_MATCH' | 'UNVERIFIED';
  threshold: number;
  verifiedAt: string;
  disclaimer: string;
  isApiConnected?: boolean;
  statusMessage?: string;
}

export interface RiskFactor {
  id: string;
  label: string;
  delta: number; // positive increases risk, negative decreases risk
  description: string;
  category: 'biometric' | 'tampering' | 'validity' | 'mrz' | 'metadata' | 'quality';
}

export interface RiskEngineResult {
  score: number; // 0-100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNVERIFIED';
  factors: RiskFactor[];
  findingsSummary: Array<{
    text: string;
    type: 'pass' | 'warning' | 'alert';
    module: 'OCR' | 'VALIDATION' | 'FORENSICS' | 'FACE' | 'ENGINE';
  }>;
  calculatedAt: string;
  isApiConnected?: boolean;
  statusMessage?: string;
}

export type ReviewDecision = 'CLEAR' | 'REVIEW_REQUIRED' | 'ESCALATE';

export interface OfficerReview {
  officerId: string;
  officerName: string;
  rank: string;
  decision: ReviewDecision;
  notes: string;
  reviewedAt: string;
  digitalSignature: string;
}

export interface ScreeningRecord {
  id: string; // e.g., "SYN-2026-9182"
  state: ScreeningState;
  documentType: DocumentType;
  autoDetected?: boolean;
  documentImageName: string;
  documentImageUrl: string;
  presentedPersonImageUrl?: string;
  rawInputText?: string;
  qualityAssessment?: ImageQualityAssessment;
  ocrResult?: OCRResult;
  validationResult?: DocumentValidationResult;
  tamperingResult?: TamperingResult;
  faceResult?: FaceVerificationResult;
  riskResult?: RiskEngineResult;
  review?: OfficerReview;
  createdAt: string;
  updatedAt: string;
  station: string;
  officerId: string;
  officerName: string;
  scenarioName?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  screeningId?: string;
  officerId: string;
  officerName: string;
  station: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'SCREENING_CREATED'
    | 'DOCUMENT_UPLOADED'
    | 'DOCUMENT_CAPTURED'
    | 'PREPROCESSING_COMPLETED'
    | 'OCR_COMPLETED'
    | 'VALIDATION_COMPLETED'
    | 'FORENSICS_COMPLETED'
    | 'FACE_VERIFICATION_COMPLETED'
    | 'RISK_CALCULATED'
    | 'OFFICER_REVIEWED'
    | 'REPORT_DOWNLOADED'
    | 'SETTINGS_UPDATED';
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  verificationHash: string;
}

export interface SystemServiceStatus {
  serviceId: string;
  serviceName: string;
  type: 'OCR' | 'VALIDATION' | 'TAMPERING' | 'FACE' | 'RISK';
  status: 'ONLINE' | 'ACTIVE' | 'OFFLINE';
  apiUrl: string;
  latencyMs: number;
  lastChecked: string;
  isMock: boolean;
}
