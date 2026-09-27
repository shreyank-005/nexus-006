import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  FileCheck2,
  BarChart3,
  ScrollText,
  Cpu,
  Settings,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-screening', label: 'New Screening', icon: FilePlus2, highlight: true },
    { id: 'screenings', label: 'Screening History', icon: FileCheck2 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Digital Audit Trail', icon: ScrollText },
    { id: 'system-status', label: 'System & API Gateway', icon: Cpu },
    { id: 'settings', label: 'Station Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      <div className="py-4">
        {/* Workstation Badge */}
        <div className="px-4 mb-4">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-semibold text-slate-900 truncate">
                SSB FRONTIER SEC II
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                TERMINAL ID: ICP-RX-04
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 font-semibold border border-slate-200/80 shadow-xs'
                    : item.highlight
                    ? 'bg-blue-50/70 text-blue-800 hover:bg-blue-50 border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : ''}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>MHA Security Protocol v2.6 Compliant</span>
        </div>
        <p className="text-[9px] text-slate-500 leading-relaxed">
          Screening assistance terminal. Final decisions remain with authorized border personnel.
        </p>
      </div>
    </aside>
  );
};
