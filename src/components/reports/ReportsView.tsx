import React from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Building,
  FileCheck2
} from 'lucide-react';
import { ScreeningRecord } from '../../types';

interface ReportsViewProps {
  screenings: ScreeningRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ screenings }) => {
  const total = screenings.length;
  const cleared = screenings.filter(s => s.review?.decision === 'CLEAR').length;
  const reviewRequired = screenings.filter(s => s.review?.decision === 'REVIEW_REQUIRED').length;
  const escalated = screenings.filter(s => s.review?.decision === 'ESCALATE').length;

  const docTypeCounts: Record<string, number> = {};
  screenings.forEach(s => {
    docTypeCounts[s.documentType] = (docTypeCounts[s.documentType] || 0) + 1;
  });

  const handleExportCSV = () => {
    const headers = ['ScreeningID', 'DocumentType', 'CreatedAt', 'RiskScore', 'RiskLevel', 'Decision', 'Officer'];
    const rows = screenings.map(s => [
      s.id,
      s.documentType,
      s.createdAt,
      s.riskResult?.score || '',
      s.riskResult?.level || '',
      s.review?.decision || 'PENDING',
      s.officerName
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synapse_screening_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Station Operational Reports &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated document screening throughput, tampering vectors, and decision metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics (.CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Submissions
          </span>
          <p className="text-3xl font-extrabold font-mono text-slate-900 mt-2">{total}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Cumulative workstation log</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Cleared &amp; Admitted
          </span>
          <p className="text-3xl font-extrabold font-mono text-emerald-700 mt-2">{cleared}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {total > 0 ? `${Math.round((cleared / total) * 100)}%` : '0%'} clearance rate
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Secondary Review
          </span>
          <p className="text-3xl font-extrabold font-mono text-amber-700 mt-2">{reviewRequired}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {total > 0 ? `${Math.round((reviewRequired / total) * 100)}%` : '0%'} referral rate
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Escalated / Suspect
          </span>
          <p className="text-3xl font-extrabold font-mono text-rose-700 mt-2">{escalated}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Forensic fraud flags</span>
        </div>
      </div>

      {/* Document Substrate Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Volume Breakdown by Document Substrate
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(docTypeCounts).map(([type, count]) => (
            <div key={type} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 capitalize block">
                  {type.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {total > 0 ? `${Math.round((count / total) * 100)}%` : '0%'} of volume
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-slate-900">{count}</span>
            </div>
          ))}
          {Object.keys(docTypeCounts).length === 0 && (
            <div className="col-span-3 py-6 text-center text-xs text-slate-500">
              No documents processed yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
