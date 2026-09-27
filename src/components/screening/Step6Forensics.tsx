import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Layers,
  FileSearch,
  ShieldCheck
} from 'lucide-react';
import { TamperingResult, ForensicRegion } from '../../types';

interface Step6ForensicsProps {
  documentImageUrl: string;
  tamperingResult: TamperingResult;
  onNext: () => void;
  onBack: () => void;
}

export const Step6Forensics: React.FC<Step6ForensicsProps> = ({
  documentImageUrl,
  tamperingResult,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<
    'heatmap' | 'original' | 'text' | 'photo' | 'stamp' | 'metadata'
  >('heatmap');
  const [selectedRegion, setSelectedRegion] = useState<ForensicRegion | null>(
    tamperingResult.regions[0] || null
  );

  const getRiskBadge = (risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNVERIFIED') => {
    switch (risk) {
      case 'LOW':
        return (
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold">
            LOW TAMPERING RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-semibold">
            MEDIUM SUSPICION RATING
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs font-semibold">
            HIGH ANOMALY DETECTED
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-mono text-xs font-semibold">
            STATUS: UNVERIFIED (API OFFLINE)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Forensic Tampering &amp; Splicing Inspection</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial noise frequency, error level analysis (ELA), font kerning consistency, and security substrate inspection.
          </p>
        </div>

        <div className="flex items-center gap-2">{getRiskBadge(tamperingResult.overallTamperingRisk)}</div>
      </div>

      {!tamperingResult.isApiConnected && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Forensics API Offline — Pixel Analysis Pending</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Automated error level analysis (ELA), copy-move forgery detection, and noise print inspection require an active Forensics API endpoint or Gemini API key. No fake integrity scores are generated. Physical document inspection is mandated.
            </p>
          </div>
        </div>
      )}

      {/* 4 Core Integrity Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Photo Region Integrity
          </span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                !tamperingResult.isApiConnected
                  ? 'text-slate-500'
                  : tamperingResult.photoIntegrity >= 85
                  ? 'text-emerald-700'
                  : tamperingResult.photoIntegrity >= 65
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {tamperingResult.isApiConnected ? `${tamperingResult.photoIntegrity}%` : '—'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {tamperingResult.isApiConnected ? 'Pixel Uniformity' : 'API Offline'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                !tamperingResult.isApiConnected
                  ? 'bg-slate-300'
                  : tamperingResult.photoIntegrity >= 85
                  ? 'bg-emerald-600'
                  : tamperingResult.photoIntegrity >= 65
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${tamperingResult.isApiConnected ? tamperingResult.photoIntegrity : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Text &amp; Kerning Uniformity
          </span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                !tamperingResult.isApiConnected
                  ? 'text-slate-500'
                  : tamperingResult.textIntegrity >= 85
                  ? 'text-emerald-700'
                  : tamperingResult.textIntegrity >= 65
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {tamperingResult.isApiConnected ? `${tamperingResult.textIntegrity}%` : '—'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {tamperingResult.isApiConnected ? 'Font Baseline' : 'API Offline'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                !tamperingResult.isApiConnected
                  ? 'bg-slate-300'
                  : tamperingResult.textIntegrity >= 85
                  ? 'bg-emerald-600'
                  : tamperingResult.textIntegrity >= 65
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${tamperingResult.isApiConnected ? tamperingResult.textIntegrity : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Stamp &amp; Seal Consistency
          </span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                !tamperingResult.isApiConnected
                  ? 'text-slate-500'
                  : tamperingResult.stampIntegrity >= 85
                  ? 'text-emerald-700'
                  : tamperingResult.stampIntegrity >= 65
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {tamperingResult.isApiConnected ? `${tamperingResult.stampIntegrity}%` : '—'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {tamperingResult.isApiConnected ? 'Ink Boundary' : 'API Offline'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                !tamperingResult.isApiConnected
                  ? 'bg-slate-300'
                  : tamperingResult.stampIntegrity >= 85
                  ? 'bg-emerald-600'
                  : tamperingResult.stampIntegrity >= 65
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${tamperingResult.isApiConnected ? tamperingResult.stampIntegrity : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            File Exif &amp; Structure
          </span>
          <div className="flex items-baseline justify-between mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                !tamperingResult.isApiConnected
                  ? 'text-slate-500'
                  : tamperingResult.metadataConsistency >= 85
                  ? 'text-emerald-700'
                  : tamperingResult.metadataConsistency >= 65
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {tamperingResult.isApiConnected ? `${tamperingResult.metadataConsistency}%` : '—'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {tamperingResult.isApiConnected ? 'Header Profile' : 'API Offline'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                !tamperingResult.isApiConnected
                  ? 'bg-slate-300'
                  : tamperingResult.metadataConsistency >= 85
                  ? 'bg-emerald-600'
                  : tamperingResult.metadataConsistency >= 65
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${tamperingResult.isApiConnected ? tamperingResult.metadataConsistency : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Forensic Analysis Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forensic Spatial Inspector */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Forensic Layer Visualizer</span>
              </span>

              {/* View filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('heatmap')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeTab === 'heatmap' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Anomaly Map
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('original')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeTab === 'original' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Clean View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('metadata')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeTab === 'metadata' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  File EXIF
                </button>
              </div>
            </div>

            {/* Document Forensic Viewport */}
            {activeTab !== 'metadata' ? (
              <div className="relative aspect-4/3 w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <img
                  src={documentImageUrl}
                  alt="Forensic inspection"
                  className="max-h-full max-w-full object-contain rounded-md shadow-2xs"
                />

                {/* Overlaid Forensic Inspection Zones */}
                {activeTab === 'heatmap' &&
                  tamperingResult.regions.map(region => {
                    const isSelected = selectedRegion?.id === region.id;
                    const isFlagged = region.status === 'flagged';
                    const isReview = region.status === 'review';

                    return (
                      <div
                        key={region.id}
                        onClick={() => setSelectedRegion(region)}
                        className={`absolute border-2 transition-all cursor-pointer rounded-xs flex items-start justify-end p-1 ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/30'
                            : isFlagged
                            ? 'border-rose-500/80 bg-rose-500/15'
                            : isReview
                            ? 'border-amber-500/80 bg-amber-500/15'
                            : 'border-emerald-500/60 bg-emerald-500/10'
                        }`}
                        style={{
                          left: `${region.box.x}%`,
                          top: `${region.box.y}%`,
                          width: `${region.box.width}%`,
                          height: `${region.box.height}%`
                        }}
                      >
                        <span
                          className={`text-[9px] font-mono font-bold px-1 rounded shadow-2xs ${
                            isFlagged
                              ? 'bg-rose-600 text-white'
                              : isReview
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {region.integrity}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Extracted Image File Headers
                </h4>
                {Object.entries(tamperingResult.metadataExif).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-slate-900 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-spectral region inspection active</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {tamperingResult.regions.length} regions inspected
            </span>
          </div>
        </div>

        {/* Right: Regions List & Selected Region Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-blue-600" />
              <span>Inspected Document Regions</span>
            </h3>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {tamperingResult.regions.map(region => {
                const isSelected = selectedRegion?.id === region.id;
                const isFlagged = region.status === 'flagged';
                const isReview = region.status === 'review';

                return (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isFlagged ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : isReview ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="text-xs font-bold text-slate-900">{region.name}</span>
                      </div>

                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isFlagged
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isReview
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {region.integrity}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 pl-5.5 leading-relaxed">{region.finding}</p>
                  </div>
                );
              })}
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
          <span>Proceed to Biometric Face Match</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
