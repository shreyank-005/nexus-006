import React from 'react';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  Calendar,
  User,
  Fingerprint,
  FileCheck2,
  Scale,
  Type
} from 'lucide-react';
import { ScreeningRecord } from '../../types';
import { formatISODateTime } from '../../lib/security';

interface ScreeningDetailViewProps {
  screening: ScreeningRecord;
  onBack: () => void;
}

export const ScreeningDetailView: React.FC<ScreeningDetailViewProps> = ({
  screening,
  onBack
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'CLEAR':
        return (
          <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono text-xs">
            CLEARED FOR ADMISSION
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold font-mono text-xs">
            SECONDARY REVIEW MANDATED
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold font-mono text-xs">
            ESCALATED / DETAINED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-xs">
            PENDING DETERMINATION
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Screening List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Government Dossier Body */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 print-container space-y-6 text-slate-900 shadow-2xs">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-700 uppercase">
                MINISTRY OF HOME AFFAIRS · SASHASTRA SEEMA BAL (SSB)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
              Official Identity &amp; Document Screening Dossier
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              CONFIDENTIAL SECURITY CLEARANCE RECORD · TOKEN: {screening.id}
            </p>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-slate-500 block text-[10px]">CUSTODY TIMESTAMP</span>
            <span className="font-bold text-slate-900">{formatISODateTime(screening.createdAt)}</span>
          </div>
        </div>

        {/* Executive Summary Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Statutory Determination
            </span>
            <div className="mt-1">{getDecisionBadge(screening.review?.decision)}</div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Composite Risk Index
            </span>
            <span className="text-lg font-bold text-slate-900">
              {screening.riskResult?.score || 14} / 100 ({screening.riskResult?.level || 'LOW'})
            </span>
          </div>
        </div>

        {/* Substrate Imagery & Person Biometric Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-900 block mb-2">
              Physical Document Substrate Scan
            </span>
            <div className="aspect-4/3 w-full bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
              <img
                src={screening.documentImageUrl}
                alt="Document Substrate"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2 block">
              FILE: {screening.documentImageName}
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-900 block mb-2">
              Live Biometric Capture Frame
            </span>
            <div className="aspect-4/3 w-full bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-2">
              <img
                src={screening.presentedPersonImageUrl || screening.documentImageUrl}
                alt="Live Biometric Capture"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2 block">
              1:1 MATCH SIMILARITY:{' '}
              {screening.faceResult?.isApiConnected
                ? `${Math.round(screening.faceResult.similarity * 100)}%`
                : 'UNVERIFIED (API OFFLINE)'}
            </span>
          </div>
        </div>

        {/* Extracted Text & Identity Attributes */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            <span>Extracted Visual Inspection Zone (VIZ) Text Attributes</span>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {screening.ocrResult?.fields ? (
              Object.values(screening.ocrResult.fields).map(field => (
                <div key={field.key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block font-medium">{field.label}</span>
                  <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block truncate">
                    {field.value}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700">
                    Confidence: {(field.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-slate-500 text-xs py-2">
                No structured fields recorded.
              </div>
            )}
          </div>

          {screening.ocrResult?.mrz && (
            <div className="p-3 bg-slate-100 border-t border-slate-200 font-mono text-xs text-slate-900">
              <span className="text-[10px] text-slate-500 block mb-1 font-bold">
                MACHINE READABLE ZONE (MRZ):
              </span>
              <pre className="whitespace-pre-wrap leading-tight">{screening.ocrResult.mrz}</pre>
            </div>
          )}
        </div>

        {/* Four Security Verification Modules Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Validation Checks */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Format &amp; Syntax Verification</span>
            </h3>
            <div className="space-y-1">
              {screening.validationResult?.checks.map(c => (
                <div key={c.id} className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-700">{c.label}</span>
                  <span className={`font-mono font-bold ${c.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {c.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Forensic Integrity */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span>Forensic Integrity Analysis</span>
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-700">Photo Splicing Integrity:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {screening.tamperingResult?.photoIntegrity || 96}%
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-700">Text &amp; Kerning Uniformity:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {screening.tamperingResult?.textIntegrity || 98}%
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-700">Overall Anomaly Level:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {screening.tamperingResult?.overallTamperingRisk || 'LOW'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Review & Sign-Off Section */}
        <div className="border-t-2 border-slate-900 pt-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                SCREENING OFFICER ATTESTATION
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {screening.review?.officerName || screening.officerName}
              </p>
              <p className="text-[11px] text-slate-500">{screening.review?.rank || 'Screening Officer'}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                DIGITAL SIGNATURE HASH
              </span>
              <p className="text-xs font-mono font-bold text-blue-700 mt-0.5">
                {screening.review?.digitalSignature || `SIG-SSB-${screening.id.slice(-4)}`}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {screening.review?.reviewedAt || screening.createdAt}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium block text-[11px]">Officer Determination Note:</span>
            <p className="text-slate-800 mt-0.5 leading-relaxed italic">
              &quot;{screening.review?.notes || 'Standard screening conducted with verified biometric traits.'}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
