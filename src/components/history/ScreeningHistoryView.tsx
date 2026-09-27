import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Download,
  ChevronRight,
  FileText
} from 'lucide-react';
import { ScreeningRecord, DocumentType } from '../../types';
import { formatISODateTime } from '../../lib/security';

interface ScreeningHistoryViewProps {
  screenings: ScreeningRecord[];
  onSelectScreening: (id: string) => void;
  onStartNewScreening: () => void;
}

export const ScreeningHistoryView: React.FC<ScreeningHistoryViewProps> = ({
  screenings,
  onSelectScreening,
  onStartNewScreening
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredScreenings = screenings.filter(s => {
    // Search filter
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rawInputText && s.rawInputText.toLowerCase().includes(searchTerm.toLowerCase()));

    // Doc type filter
    const matchesDocType = selectedDocType === 'all' || s.documentType === selectedDocType;

    // Risk level filter
    const matchesRisk = selectedRisk === 'all' || s.riskResult?.level === selectedRisk;

    // Status filter
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'CLEARED' && s.review?.decision === 'CLEAR') ||
      (selectedStatus === 'REVIEW_REQUIRED' && s.review?.decision === 'REVIEW_REQUIRED') ||
      (selectedStatus === 'ESCALATED' && s.review?.decision === 'ESCALATE') ||
      (selectedStatus === 'PENDING' && !s.review);

    return matchesSearch && matchesDocType && matchesRisk && matchesStatus;
  });

  const getRiskBadge = (level?: string, score?: number) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            LOW ({score !== undefined ? `${score}/100` : '—'})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            MED ({score !== undefined ? `${score}/100` : '—'})
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            HIGH ({score !== undefined ? `${score}/100` : '—'})
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            CRIT ({score !== undefined ? `${score}/100` : '—'})
          </span>
        );
      case 'UNVERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            UNVERIFIED
          </span>
        );
      default:
        return <span className="text-slate-400 font-mono text-xs">PENDING</span>;
    }
  };

  const getDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'CLEAR':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold font-mono text-[11px]">
            CLEARED
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold font-mono text-[11px]">
            REVIEW REQ
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold font-mono text-[11px]">
            ESCALATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[11px]">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Screening History &amp; Dossiers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete historical registry of processed documents and officer determinations.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewScreening}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <span>+ New Screening</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by ID, officer, or document type..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Doc Type Selector */}
          <div>
            <select
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Document Types</option>
              <option value="passport">Passport</option>
              <option value="visa">Visa Permit</option>
              <option value="national_id">National ID / Aadhaar</option>
              <option value="driving_licence">Driving Licence</option>
              <option value="travel_permit">Travel Permit</option>
            </select>
          </div>

          {/* Risk Level Selector */}
          <div>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Determinations</option>
              <option value="CLEARED">Cleared</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="ESCALATED">Escalated</option>
              <option value="PENDING">Pending Review</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Found <strong>{filteredScreenings.length}</strong> matching records
          </span>
          {(searchTerm || selectedDocType !== 'all' || selectedRisk !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedDocType('all');
                setSelectedRisk('all');
                setSelectedStatus('all');
              }}
              className="text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Screenings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
                <th className="py-3.5 px-6 font-semibold">Screening Token</th>
                <th className="py-3.5 px-4 font-semibold">Document Substrate</th>
                <th className="py-3.5 px-4 font-semibold">Acquisition Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Composite Risk</th>
                <th className="py-3.5 px-4 font-semibold">Determination</th>
                <th className="py-3.5 px-4 font-semibold">Officer</th>
                <th className="py-3.5 px-6 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScreenings.map(screening => (
                <tr
                  key={screening.id}
                  onClick={() => onSelectScreening(screening.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-6 font-mono font-bold text-blue-700">
                    {screening.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 capitalize">
                    {screening.documentType.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {formatISODateTime(screening.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getRiskBadge(screening.riskResult?.level, screening.riskResult?.score)}
                  </td>
                  <td className="py-3.5 px-4">{getDecisionBadge(screening.review?.decision)}</td>
                  <td className="py-3.5 px-4 text-slate-700 truncate max-w-[140px]">
                    {screening.officerName}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="text-slate-700 hover:text-slate-900 font-semibold inline-flex items-center gap-1">
                      Dossier <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
              {filteredScreenings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching screening records found in workstation database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
