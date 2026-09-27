import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { formatISODateTime } from '../../lib/security';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  onRefresh: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.screeningId && log.screeningId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.verificationHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getStatusBadge = (status: 'SUCCESS' | 'WARNING' | 'ALERT') => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            OK
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono text-[11px] font-semibold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            WARNING
          </span>
        );
      case 'ALERT':
        return (
          <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono text-[11px] font-semibold">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            ALERT
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Officer', 'Screening ID', 'Station', 'Details', 'SHA256 Hash'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.action,
      `"${l.officerName}"`,
      l.screeningId || 'N/A',
      `"${l.station}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.verificationHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synapse_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
              CRYPTOGRAPHIC CHAIN OF CUSTODY
            </span>
            <span className="text-xs text-slate-500 font-mono">SHA-256 HASH VERIFIED</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Forensic Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, sequential event log documenting terminal logins, optical extractions, determinations, and report exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Log"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by officer, action, hash, or event details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Event Types</option>
            <option value="LOGIN">Officer Login</option>
            <option value="LOGOUT">Officer Logout</option>
            <option value="OFFICER_REVIEWED">Review Determination</option>
            <option value="REPORT_DOWNLOADED">Dossier Export</option>
            <option value="SETTINGS_UPDATED">Settings Update</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
                <th className="py-3 px-6 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Officer / Duty ID</th>
                <th className="py-3 px-4 font-semibold">Case Token</th>
                <th className="py-3 px-4 font-semibold">Custody Details</th>
                <th className="py-3 px-4 font-semibold">Integrity Hash</th>
                <th className="py-3 px-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatISODateTime(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                    <span className="font-semibold block">{log.officerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.officerId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-700 font-semibold whitespace-nowrap">
                    {log.screeningId || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 truncate max-w-[120px]" title={log.verificationHash}>
                    {log.verificationHash}
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching audit log entries found.
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
