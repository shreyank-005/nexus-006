import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Download,
  FileCheck2,
  User,
  Clock,
  Printer,
  FileText,
  Lock,
  ArrowRight,
  Info,
  Building,
  Type
} from 'lucide-react';
import { ScreeningRecord, ReviewDecision, UserProfile } from '../../types';
import { formatISODateTime } from '../../lib/security';
import { validateOfficerReviewSubmission } from '../../lib/validationSchemas';

interface FinalResultViewProps {
  screening: ScreeningRecord;
  currentUser: UserProfile | null;
  onSubmitReview: (decision: ReviewDecision, notes: string) => void;
  onDownloadReport: () => void;
  onNavigateToHistory: () => void;
}

export const FinalResultView: React.FC<FinalResultViewProps> = ({
  screening,
  currentUser,
  onSubmitReview,
  onDownloadReport,
  onNavigateToHistory
}) => {
  const [decision, setDecision] = useState<ReviewDecision>(
    screening.review?.decision || 'CLEAR'
  );
  const [notes, setNotes] = useState(
    screening.review?.notes || 'Physical document verified. Security traits within tolerance.'
  );
  const [expandedSection, setExpandedSection] = useState<string | null>('findings');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleReviewSubmit = () => {
    const val = validateOfficerReviewSubmission({ decision, notes });
    if (!val.valid) {
      setValidationError(val.error || 'Invalid submission');
      return;
    }
    setValidationError(null);
    setShowConfirmModal(true);
  };

  const confirmAndSave = () => {
    setShowConfirmModal(false);
    onSubmitReview(decision, notes);
  };

  const isCompleted = !!screening.review;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
              SCREENING DOSSIER
            </span>
            <span className="text-xs text-blue-700 font-mono font-bold">{screening.id}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Verification Dossier &amp; Officer Determination
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatISODateTime(screening.createdAt)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {screening.station}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {screening.officerName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onDownloadReport}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToHistory}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Dossier Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central Assessment Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Screening Risk Evaluation
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {screening.riskResult?.isApiConnected !== false && typeof screening.riskResult?.score === 'number'
                ? `RISK SCORE: ${screening.riskResult.score}/100`
                : 'RISK: UNVERIFIED'}
            </h2>
            <span
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold border ${
                screening.riskResult?.level === 'LOW'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : screening.riskResult?.level === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : screening.riskResult?.level === 'HIGH' || screening.riskResult?.level === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {screening.riskResult?.level || 'UNVERIFIED'} RATING
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
            {screening.riskResult?.isApiConnected !== false
              ? 'Multi-signal risk synthesis computed from active inspection engines.'
              : 'Automated AI scoring engines are offline. No artificial risk scores generated. Final disposition is established exclusively by physical inspection and officer review.'}
          </p>
        </div>

        {/* Current State / Decision Stamp */}
        <div className="shrink-0 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[180px]">
          <span className="text-[10px] text-slate-500 font-mono uppercase block font-semibold">
            Operational Custody Status
          </span>
          <div className="mt-1 font-bold font-mono text-sm">
            {screening.review ? (
              screening.review.decision === 'CLEAR' ? (
                <span className="text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> CLEARED
                </span>
              ) : screening.review.decision === 'REVIEW_REQUIRED' ? (
                <span className="text-amber-700 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> REVIEW REQ
                </span>
              ) : (
                <span className="text-rose-700 flex items-center justify-center gap-1">
                  <XCircle className="w-4 h-4" /> ESCALATED
                </span>
              )
            ) : (
              <span className="text-blue-700">PENDING OFFICER SIGN</span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Inspection Module Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: OCR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              1. OCR &amp; Text
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                screening.ocrResult?.isApiConnected
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : screening.ocrResult?.rawText
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
            >
              {screening.ocrResult?.isApiConnected
                ? 'PASSED'
                : screening.ocrResult?.rawText
                ? 'DIRECT TEXT'
                : 'OFFLINE'}
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900">
            {screening.ocrResult?.isApiConnected
              ? `${(screening.ocrResult.overallConfidence * 100).toFixed(1)}%`
              : screening.ocrResult?.rawText
              ? 'Text Input'
              : '—'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {screening.ocrResult?.rawText
              ? `${screening.ocrResult.rawText.length} chars supplied`
              : 'No OCR API connected'}
          </span>
        </div>

        {/* Module 2: Validation */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              2. Syntax Rules
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                screening.validationResult?.isValid
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}
            >
              {screening.validationResult?.isValid ? 'PASSED' : 'FLAGGED'}
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900">
            {screening.validationResult?.checks.filter(c => c.passed).length || 0} /{' '}
            {screening.validationResult?.checks.length || 0}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {screening.validationResult?.referenceDbStatus === 'CONNECTED'
              ? 'Registry Connected'
              : 'Database Offline'}
          </span>
        </div>

        {/* Module 3: Forensics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              3. Forensics
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                screening.tamperingResult?.isApiConnected && screening.tamperingResult?.overallTamperingRisk === 'LOW'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : screening.tamperingResult?.isApiConnected
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
            >
              {screening.tamperingResult?.isApiConnected
                ? `${screening.tamperingResult.overallTamperingRisk} RISK`
                : 'OFFLINE'}
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900">
            {screening.tamperingResult?.isApiConnected
              ? `${screening.tamperingResult.photoIntegrity}%`
              : '—'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {screening.tamperingResult?.isApiConnected
              ? `${screening.tamperingResult.regions.length} regions inspected`
              : 'No Forensics API'}
          </span>
        </div>

        {/* Module 4: Biometrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              4. Biometrics
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                screening.faceResult?.isApiConnected && screening.faceResult?.matchResult === 'MATCH'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : screening.faceResult?.isApiConnected
                  ? 'text-rose-700 bg-rose-50 border-rose-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}
            >
              {screening.faceResult?.isApiConnected
                ? screening.faceResult.matchResult
                : 'OFFLINE'}
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900">
            {screening.faceResult?.isApiConnected
              ? `${Math.round(screening.faceResult.similarity * 100)}%`
              : '—'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {screening.faceResult?.isApiConnected
              ? '1:1 Cosine Similarity'
              : 'No Biometrics API'}
          </span>
        </div>
      </div>

      {/* Extracted Text & Inspection Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Document Text &amp; Machine Readable Zone
            </span>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">
              Extracted Visual Attributes:
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 max-h-60 overflow-y-auto font-mono">
              {screening.ocrResult?.fields ? (
                Object.values(screening.ocrResult.fields).map(f => (
                  <div key={f.key} className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500">{f.label}:</span>
                    <span className="font-bold text-slate-900">{f.value}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-400">No structured fields extracted</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">
              Raw Extracted Text Stream:
            </span>
            <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {screening.ocrResult?.rawText || 'No raw text stream recorded.'}
            </pre>
          </div>
        </div>
      </div>

      {/* Officer Determination Console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Officer Final Review &amp; Statutory Determination</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mandatory sign-off adhering to Border Screening Rules.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            OFFICER: {currentUser?.fullName || 'Screening Officer'}
          </span>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Statutory Determination:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDecision('CLEAR')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  decision === 'CLEAR'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CLEAR &amp; ADMIT</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Document and biometric indicators verified authentic. Authorize standard entry.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REVIEW_REQUIRED')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  decision === 'REVIEW_REQUIRED'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SECONDARY REVIEW</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Minor discrepancies or optical glare. Forward to supervisor station for secondary inspection.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDecision('ESCALATE')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  decision === 'ESCALATE'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>ESCALATE &amp; DETAIN</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Suspected tampering, fraudulent substrate, or critical biometric mismatch. Alert duty officer.
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Officer Inspection Notes &amp; Rationalization:
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Record observation details, physical security observations, or justification..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500 font-mono">
              Digital Signature:{' '}
              <strong className="text-slate-800">
                SIG-SSB-{currentUser?.officialId || 'DEL-49102'}-{screening.id.slice(-4)}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleReviewSubmit}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Official Determination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Confirm Official Determination
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are recording decision <strong>{decision}</strong> for screening record{' '}
              <strong className="font-mono">{screening.id}</strong>. This action will be permanently recorded in the digital audit log.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndSave}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Confirm &amp; Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
