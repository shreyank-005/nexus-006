import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Database
} from 'lucide-react';
import { DocumentValidationResult } from '../../types';

interface Step5ValidationProps {
  validationResult: DocumentValidationResult;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Validation: React.FC<Step5ValidationProps> = ({
  validationResult,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Document Syntax &amp; Format Validation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic compliance verification against ICAO / National Standards and temporal limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs ${
              validationResult.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {validationResult.isValid ? 'ALL COMPLIANCE CHECKS PASSED' : 'ANOMALIES DETECTED'}
          </span>
        </div>
      </div>

      {/* Rules Engine Checks List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Format, Expiry &amp; Modulus Checks
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            {validationResult.checks.filter(c => c.passed).length} / {validationResult.checks.length} Verified
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {validationResult.checks.map(check => {
            const isPass = check.status === 'valid';
            const isWarning = check.status === 'warning';
            const isFail = check.status === 'invalid';
            const isUnverified = check.status === 'unverified';

            return (
              <div key={check.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-600" />}
                      {isUnverified && <HelpCircle className="w-4 h-4 text-slate-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{check.label}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {check.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{check.detail}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${
                      isPass
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isWarning
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isFail
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isPass ? 'PASS' : isWarning ? 'WARNING' : isFail ? 'FAILED' : 'UNVERIFIED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Central Database Status Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Central Watchlist &amp; Registry Verification
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">{validationResult.referenceDbMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {validationResult.referenceDbStatus === 'CONNECTED' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              REGISTRY SYNCHRONIZED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              DATABASE NOT CONFIGURED
            </span>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>Proceed to Forensic Tampering Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
