-- =============================================================================
-- SYNAPSE SCREEN — Secure Identity & Document Screening System
-- Ministry of Home Affairs / Sashastra Seema Bal (SSB), Police II Division
-- Database Schema for Supabase PostgreSQL
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Personnel & RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  official_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  rank VARCHAR(100) NOT NULL,
  station VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('OFFICER', 'SUPERVISOR', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Screenings Master Table
CREATE TABLE IF NOT EXISTS public.screenings (
  id VARCHAR(50) PRIMARY KEY, -- e.g. SYN-2026-9182
  officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  station VARCHAR(150) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  auto_detected BOOLEAN DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'CREATED' 
    CHECK (status IN ('CREATED', 'UPLOADING', 'UPLOADED', 'PREPROCESSING', 'OCR_PROCESSING', 'VALIDATING', 'FORENSIC_ANALYSIS', 'FACE_VERIFICATION', 'RISK_ANALYSIS', 'COMPLETED', 'REVIEW_REQUIRED', 'ESCALATED', 'FAILED')),
  is_demo_scenario BOOLEAN DEFAULT TRUE,
  scenario_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Documents Table (Sensitive File Storage Records)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL, -- Private bucket path
  is_camera_captured BOOLEAN DEFAULT FALSE,
  blur_score NUMERIC(5,2),
  glare_detected BOOLEAN DEFAULT FALSE,
  lighting_quality VARCHAR(30),
  resolution VARCHAR(30),
  quality_passed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OCR Results Table
CREATE TABLE IF NOT EXISTS public.ocr_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  fields_json JSONB NOT NULL,
  raw_text TEXT,
  mrz_string TEXT,
  overall_confidence NUMERIC(5,4) NOT NULL, -- e.g. 0.9850
  is_demo BOOLEAN DEFAULT TRUE,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Validation Results Table
CREATE TABLE IF NOT EXISTS public.validation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  is_valid BOOLEAN NOT NULL,
  checks_json JSONB NOT NULL,
  reference_db_status VARCHAR(50) DEFAULT 'NOT_CONNECTED_DEMO',
  reference_db_message TEXT,
  is_demo BOOLEAN DEFAULT TRUE,
  validated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Forensic & Tampering Results Table
CREATE TABLE IF NOT EXISTS public.forensic_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  photo_integrity NUMERIC(5,2) NOT NULL, -- 0-100
  text_integrity NUMERIC(5,2) NOT NULL,
  stamp_integrity NUMERIC(5,2) NOT NULL,
  metadata_consistency NUMERIC(5,2) NOT NULL,
  overall_tampering_risk VARCHAR(20) NOT NULL CHECK (overall_tampering_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  regions_json JSONB NOT NULL,
  metadata_exif JSONB,
  is_demo BOOLEAN DEFAULT TRUE,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Face Verification Results Table
CREATE TABLE IF NOT EXISTS public.face_verification_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  similarity NUMERIC(5,4) NOT NULL, -- 0.0000 - 1.0000
  confidence NUMERIC(5,4) NOT NULL,
  match_result VARCHAR(20) NOT NULL CHECK (match_result IN ('MATCH', 'REVIEW', 'NO_MATCH')),
  threshold NUMERIC(5,4) DEFAULT 0.7500,
  presented_image_storage_path TEXT,
  is_demo BOOLEAN DEFAULT TRUE,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Risk Engine Results Table
CREATE TABLE IF NOT EXISTS public.risk_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  risk_score NUMERIC(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  factors_json JSONB NOT NULL,
  findings_summary JSONB NOT NULL,
  is_demo BOOLEAN DEFAULT TRUE,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Officer Reviews Table (Human-in-the-loop Final Determination)
CREATE TABLE IF NOT EXISTS public.officer_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50) REFERENCES public.screenings(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  officer_name VARCHAR(150) NOT NULL,
  rank VARCHAR(100) NOT NULL,
  decision VARCHAR(30) NOT NULL CHECK (decision IN ('CLEAR', 'REVIEW_REQUIRED', 'ESCALATE')),
  notes TEXT NOT NULL,
  digital_signature VARCHAR(128) NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Trail Table (Immutable Security Ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id VARCHAR(50),
  officer_id VARCHAR(100) NOT NULL,
  officer_name VARCHAR(150) NOT NULL,
  station VARCHAR(150) NOT NULL,
  action VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'WARNING', 'ALERT')),
  verification_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance & rapid officer workstation querying
CREATE INDEX IF NOT EXISTS idx_screenings_officer_id ON public.screenings(officer_id);
CREATE INDEX IF NOT EXISTS idx_screenings_created_at ON public.screenings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenings_doc_type ON public.screenings(document_type);
CREATE INDEX IF NOT EXISTS idx_screenings_status ON public.screenings(status);
CREATE INDEX IF NOT EXISTS idx_risk_results_screening_id ON public.risk_results(screening_id);
CREATE INDEX IF NOT EXISTS idx_risk_results_risk_level ON public.risk_results(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_logs_screening_id ON public.audit_logs(screening_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forensic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Officers view authorized records, Supervisors/Admins view all
CREATE POLICY "Authorized personnel can view screenings"
  ON public.screenings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Officers can insert screenings"
  ON public.screenings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
