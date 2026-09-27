import React from 'react';
import {
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play
} from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../../services/mock/demoScenarios';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                SIH Evaluation Demo Scenarios (1-Click Test Suite)
              </h2>
              <p className="text-xs text-slate-400">
                Instantly load simulated border cases with deterministic forensic and biometric evidence.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scenarios List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {DEMO_SCENARIOS.map(sc => {
            const isLow = sc.expectedRiskLevel === 'LOW';
            const isMed = sc.expectedRiskLevel === 'MEDIUM';
            const isHigh = sc.expectedRiskLevel === 'HIGH';
            const isCrit = sc.expectedRiskLevel === 'CRITICAL';

            return (
              <div
                key={sc.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isLow
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : isMed
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : isHigh
                          ? 'bg-orange-950 text-orange-300 border-orange-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {sc.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white">{sc.name}</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span>Substrate: <strong className="text-slate-200 uppercase">{sc.documentType}</strong></span>
                    <span>·</span>
                    <span>Expected Score: <strong className="text-cyan-400">{sc.expectedRiskScore}/100</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectScenario(sc);
                      onClose();
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Screening</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>All scenarios use synthetic demo identities. No real citizen data is included.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
