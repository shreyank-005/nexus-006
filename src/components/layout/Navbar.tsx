import React, { useState } from 'react';
import { Shield, User, LogOut, CheckCircle2, Bell } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface NavbarProps {
  user: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
  onSwitchRole
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* Zone 1: Brand title, clean single text element with deep navy shield */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              SYNAPSE SCREEN
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                SSB · POLICE II
              </span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Document &amp; Identity Screening System
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Clean text links) */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`transition-colors hover:text-slate-900 ${currentView === 'dashboard' ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('new-screening')}
          className={`transition-colors hover:text-slate-900 ${currentView === 'new-screening' ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5' : ''}`}
        >
          New Screening
        </button>
        <button
          onClick={() => onNavigate('screenings')}
          className={`transition-colors hover:text-slate-900 ${currentView === 'screenings' ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5' : ''}`}
        >
          History &amp; Dossiers
        </button>
        <button
          onClick={() => onNavigate('audit')}
          className={`transition-colors hover:text-slate-900 ${currentView === 'audit' ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5' : ''}`}
        >
          Audit Trail
        </button>
        <button
          onClick={() => onNavigate('system-status')}
          className={`transition-colors hover:text-slate-900 ${currentView === 'system-status' ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5' : ''}`}
        >
          AI Engines &amp; Gateway
        </button>
      </nav>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2.5">
        {/* System Status Operational Badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-md bg-slate-100 border border-slate-200 text-slate-700"
          title="All inspection engines operational"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="font-semibold text-emerald-700">ONLINE</span>
          <span className="text-slate-400 text-[10px]">· GATEWAY SECURE</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative border border-transparent hover:border-slate-200"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
              <div className="px-3.5 py-2 font-semibold text-slate-900 border-b border-slate-100 flex items-center justify-between">
                <span>Operational Alerts</span>
                <span className="text-[10px] text-slate-500 font-normal">Station ICP Raxaul</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-3.5 py-2.5 hover:bg-slate-50">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optical Engines Online</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Preprocessing and Character Recognition modules operational.
                  </p>
                </div>
                <div className="px-3.5 py-2.5 hover:bg-slate-50">
                  <div className="flex items-center gap-1.5 text-blue-700 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Central Registry Sync</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Central watchlist database synced with border control server.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile & Role Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              {user?.fullName.slice(0, 2).toUpperCase() || 'OF'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-medium leading-none text-slate-900 truncate max-w-[120px]">
                {user?.fullName || 'Screening Officer'}
              </span>
              <span className="text-[9px] text-slate-500 font-mono leading-tight mt-0.5">
                {user?.role}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500">{user?.rank}</p>
                <p className="text-[10px] font-mono text-blue-700 mt-1 font-semibold">{user?.officialId}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{user?.station}</p>
              </div>

              {/* Station Account Roles */}
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Active Station Role
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(['OFFICER', 'SUPERVISOR', 'ADMIN'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        onSwitchRole(role);
                        setShowProfileMenu(false);
                      }}
                      className={`px-1.5 py-1 text-[10px] rounded-md font-medium transition-colors cursor-pointer ${
                        user?.role === role
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setShowProfileMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Station</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
