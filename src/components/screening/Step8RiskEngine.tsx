import React from 'react';
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { RiskEngineResult } from '../../types';

interface Step8RiskEngineProps {
  riskResult: RiskEngineResult;
  onNext: () => void;
  onBack: () => void;
}

export const Step8RiskEngine: React.FC<Step8RiskEngineProps> = ({
  riskResult,
  onNext,
  onBack
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'text-emerald-800 border-emerald-200 bg-emerald-50';
      case 'MEDIUM':
        return 'text-amber-800 border-amber-200 bg-amber-50';
      case 'HIGH':
        return 'text-orange-800 border-orange-200 bg-orange-50';
      case 'CRITICAL':
        return 'text-rose-800 border-rose-200 bg-rose-50';
      case 'UNVERIFIED':
      default:
        return 'text-slate-800 border-slate-300 bg-slate-100';
    }
  };

  const isConnected = riskResult.isApiConnected !== false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span>Composite Risk Engine &amp; Synthesis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent, explainable risk scoring attributing positive and negative score deltas to verified signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold shadow-2xs ${getLevelColor(
              riskResult.level
            )}`}
          >
            {isConnected ? `${riskResult.level} RISK · ${riskResult.score}/100` : 'LEVEL: UNVERIFIED (OFFLINE)'}
          </span>
        </div>
      </div>

      {!isConnected && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Automated AI Engines Offline — Manual Assessment Required</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              No automated risk scoring API endpoint or Gemini API key is connected. The system will not generate fake points or synthetic risk numbers. Admissibility and risk determination must be established through physical inspection and officer interview.
            </p>
          </div>
        </div>
      )}

      {/* Main Risk Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Composite Assessment
          </span>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {isConnected ? riskResult.score : '—'}
              <span className="text-sm font-normal text-slate-400"> / 100</span>
            </h3>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${getLevelColor(
                riskResult.level
              )}`}
            >
              LEVEL: {riskResult.level}
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
            {isConnected
              ? 'Composite index calculated from OCR confidence, MRZ check digits, temporal document validity, forensic splicing cues, and facial biometric embedding comparison.'
              : 'Automated AI scoring engines are offline. Review individual module findings below or enter physical review notes on the next screen.'}
          </p>
        </div>

        {/* Visual Gauge Bar */}
        <div className="w-full md:w-72 space-y-2 shrink-0">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-emerald-700 font-medium">Safe (0-25)</span>
            <span className="text-slate-500">Threshold: 50</span>
            <span className="text-rose-700 font-medium">Critical (75+)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex">
            <div className="w-1/4 h-full bg-emerald-500" />
            <div className="w-1/4 h-full bg-amber-400" />
            <div className="w-1/4 h-full bg-orange-500" />
            <div className="w-1/4 h-full bg-rose-500" />
          </div>
          <div className="text-right text-[11px] font-mono text-slate-500">
            Active Score Indicator: <strong>{isConnected ? `${riskResult.score}%` : 'Offline'}</strong>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Factor Deltas vs Findings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Detailed Factor Contribution Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Factor Risk Contributions
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Explainable Point Attribution
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {riskResult.factors.map(factor => {
              const isRiskIncrease = factor.delta > 0;
              const isNeutral = factor.delta === 0;

              return (
                <div key={factor.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{factor.label}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {factor.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {factor.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono text-xs font-bold border ${
                          isRiskIncrease
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isNeutral
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isRiskIncrease ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-rose-600" />
                            +{factor.delta}
                          </>
                        ) : isNeutral ? (
                          '0'
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-emerald-600" />
                            {factor.delta}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Aggregated Findings List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Synthesized Operational Findings
            </h3>

            <div className="space-y-2.5">
              {riskResult.findingsSummary.map((finding, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    finding.type === 'pass'
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : finding.type === 'warning'
                      ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {finding.type === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {finding.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {finding.type === 'alert' && <XCircle className="w-4 h-4 text-rose-600" />}
                  </div>

                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold tracking-wider opacity-70 block">
                      [{finding.module}]
                    </span>
                    <span className="leading-relaxed font-medium">{finding.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <span>Complete Screening &amp; Review Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
