import React from 'react';
import {
  FilePlus2,
  FileCheck2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Cpu,
  ChevronRight,
  Clock,
  Key
} from 'lucide-react';
import { ScreeningRecord, UserProfile } from '../../types';
import { formatISODateTime } from '../../lib/security';
import { getApiGatewayConfig, hasAnyApiConfigured } from '../../services/apiConfig';

interface DashboardViewProps {
  user: UserProfile | null;
  screenings: ScreeningRecord[];
  onStartNewScreening: () => void;
  onSelectScreening: (id: string) => void;
  onNavigateToHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  screenings,
  onStartNewScreening,
  onSelectScreening,
  onNavigateToHistory
}) => {
  // Compute workstation statistics
  const totalScreenings = screenings.length;
  const verifiedCount = screenings.filter(s => s.review?.decision === 'CLEAR').length;
  const flaggedCount = screenings.filter(
    s => s.review?.decision === 'REVIEW_REQUIRED' || s.review?.decision === 'ESCALATE'
  ).length;
  const highRiskCount = screenings.filter(
    s => s.riskResult?.level === 'HIGH' || s.riskResult?.level === 'CRITICAL'
  ).length;

  // Risk Distribution Breakdown
  const lowRiskCount = screenings.filter(s => s.riskResult?.level === 'LOW').length;
  const medRiskCount = screenings.filter(s => s.riskResult?.level === 'MEDIUM').length;
  const highRiskTotal = screenings.filter(s => s.riskResult?.level === 'HIGH').length;
  const critRiskTotal = screenings.filter(s => s.riskResult?.level === 'CRITICAL').length;

  const riskPercentages = {
    low: totalScreenings > 0 ? (lowRiskCount / totalScreenings) * 100 : 0,
    med: totalScreenings > 0 ? (medRiskCount / totalScreenings) * 100 : 0,
    high: totalScreenings > 0 ? (highRiskTotal / totalScreenings) * 100 : 0,
    crit: totalScreenings > 0 ? (critRiskTotal / totalScreenings) * 100 : 0
  };

  const getRiskBadge = (level?: string, score?: number) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            LOW ({score || 14}/100)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            MEDIUM ({score || 45}/100)
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            HIGH ({score || 72}/100)
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            CRITICAL ({score || 85}/100)
          </span>
        );
      default:
        return <span className="text-slate-500 text-xs">PENDING</span>;
    }
  };

  const getStatusBadge = (status: string, decision?: string) => {
    if (decision === 'CLEAR') {
      return <span className="text-emerald-700 font-semibold text-[11px] font-mono">CLEARED</span>;
    }
    if (decision === 'REVIEW_REQUIRED') {
      return <span className="text-amber-700 font-semibold text-[11px] font-mono">REVIEW REQ</span>;
    }
    if (decision === 'ESCALATE') {
      return <span className="text-rose-700 font-semibold text-[11px] font-mono">ESCALATED</span>;
    }
    return <span className="text-slate-600 font-mono text-[11px]">{status}</span>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-semibold">
            {user?.station || 'Sector ICP Terminal'}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Good morning, Officer {user?.fullName?.split(' ')[0] || 'Rathore'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Workstation active · Document forensics, optical extraction, and biometric screening console.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartNewScreening}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>+ Start New Screening</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Screenings Today</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {totalScreenings}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Active border workstation log</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Documents Cleared</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            {verifiedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Verified with low risk rating</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Flagged Documents</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-2 tabular-nums">
            {flaggedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Subject to secondary officer review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">High Risk / Escalated</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-2 tabular-nums">
            {highRiskCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Referred to border intelligence</p>
        </div>
      </div>

      {/* Main Grid: Recent Screenings & Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Recent Screenings Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
          <div>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Screening Operations</h2>
                <p className="text-xs text-slate-500">Station real-time digital custody ledger</p>
              </div>
              <button
                onClick={onNavigateToHistory}
                className="text-xs text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
                    <th className="py-3 px-6 font-medium">Screening ID</th>
                    <th className="py-3 px-4 font-medium">Document Substrate</th>
                    <th className="py-3 px-4 font-medium">Date &amp; Time</th>
                    <th className="py-3 px-4 font-medium">Risk Score</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Officer</th>
                    <th className="py-3 px-6 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {screenings.slice(0, 6).map(screening => (
                    <tr
                      key={screening.id}
                      onClick={() => onSelectScreening(screening.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono font-medium text-blue-700">
                        {screening.id}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-800 font-medium">
                        {screening.documentType.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {formatISODateTime(screening.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getRiskBadge(screening.riskResult?.level, screening.riskResult?.score)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(screening.state, screening.review?.decision)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 truncate max-w-[120px]">
                        {screening.officerName.split(' ')[0]}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-0.5">
                          Inspect <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                  {screenings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No screenings recorded yet. Start a new screening above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 text-center text-[11px] text-slate-500">
            Showing latest {Math.min(6, screenings.length)} of {totalScreenings} cases recorded at this station
          </div>
        </div>

        {/* Right Column (4 cols): Risk Distribution & Microservice Health */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Risk Distribution Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Risk Score Distribution
            </h2>
            <p className="text-[11px] text-slate-500 mb-4">Cumulative distribution of processed documents</p>

            {/* Visual Bar Distribution Chart */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Low Risk (0-25)
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums font-semibold">{lowRiskCount} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${riskPercentages.low}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-800 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    Medium Risk (26-50)
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums font-semibold">{medRiskCount} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: `${riskPercentages.med}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-orange-800 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600" />
                    High Risk (51-75)
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums font-semibold">{highRiskTotal} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full" style={{ width: `${riskPercentages.high}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-800 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    Critical Risk (76-100)
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums font-semibold">{critRiskTotal} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: `${riskPercentages.crit}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Microservice Health Panel */}
          {(() => {
            const apiCfg = getApiGatewayConfig();
            const hasAny = hasAnyApiConfigured();
            const isOcrOn = !!(apiCfg.ocrKey || apiCfg.geminiKey);
            const isForensicsOn = !!(apiCfg.tamperingKey || apiCfg.geminiKey);
            const isFaceOn = !!(apiCfg.faceKey || apiCfg.geminiKey);
            const isDbOn = !!apiCfg.validationKey;

            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-700" />
                    <span>Inspection Engine Status</span>
                  </h2>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      hasAny
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {hasAny ? 'CONNECTED' : 'PENDING CONFIGURATION'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-[11px]">OCR &amp; Field Extractor</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {isOcrOn ? (apiCfg.geminiKey ? 'Gemini 2.5 Flash / Custom' : 'Custom OCR API') : 'Direct Text Input Mode'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        isOcrOn
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {isOcrOn ? 'ONLINE' : 'MANUAL TEXT'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-[11px]">Document Validation</span>
                      <span className="text-[10px] text-slate-500 font-mono">ICAO Doc 9303 Rules Engine</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      ONLINE
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-[11px]">Central Watchlist / DB</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {isDbOn ? 'External Registry Synchronized' : 'No Endpoint Configured'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        isDbOn
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {isDbOn ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-[11px]">Forensic Tampering Engine</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {isForensicsOn ? 'Pixel Splicing & ELA Active' : 'Requires API Endpoint / Key'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        isForensicsOn
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {isForensicsOn ? 'ONLINE' : 'NOT CONFIGURED'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-[11px]">Biometric Face Comparison</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {isFaceOn ? '1:1 Embedding Matcher Active' : 'Requires API Endpoint / Key'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        isFaceOn
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {isFaceOn ? 'ONLINE' : 'NOT CONFIGURED'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
