import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ArrowRight, CheckCircle2, Building, Shield } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DEFAULT_OFFICER, DEFAULT_SUPERVISOR, DEFAULT_ADMIN } from '../../services/storage/screeningStore';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [officialId, setOfficialId] = useState('SSB-DEL-49102');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICER');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'OFFICER') {
        onLoginSuccess(DEFAULT_OFFICER);
      } else if (selectedRole === 'SUPERVISOR') {
        onLoginSuccess(DEFAULT_SUPERVISOR);
      } else {
        onLoginSuccess(DEFAULT_ADMIN);
      }
    }, 350);
  };

  const handleQuickDutyLogin = (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'OFFICER') onLoginSuccess(DEFAULT_OFFICER);
      else if (role === 'SUPERVISOR') onLoginSuccess(DEFAULT_SUPERVISOR);
      else onLoginSuccess(DEFAULT_ADMIN);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between text-slate-900 relative">
      {/* Main Split Layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 py-12">
        
        {/* Left Side: Project Identity & Mission Context */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-mono w-fit shadow-2xs font-medium">
            <Building className="w-3.5 h-3.5 text-slate-700" />
            <span>MINISTRY OF HOME AFFAIRS · SASHASTRA SEEMA BAL (SSB)</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  SYNAPSE SCREEN
                </h1>
                <p className="text-sm font-semibold text-blue-700">
                  Document &amp; Identity Screening Workstation
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-xl">
              Official border and immigration identity verification terminal. Facilitates document boundary detection, optical character extraction, tampering forensics, biometric face comparison, and multi-signal risk calculation.
            </p>
          </div>

          {/* Visual Security Pipeline Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3.5 max-w-xl shadow-xs">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Multi-Layer Screening Architecture
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-900 font-semibold block text-[11px]">01. PREPROCESS</span>
                <span className="text-slate-500 text-[10px]">OpenCV Deskew</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-900 font-semibold block text-[11px]">02. OCR &amp; TEXT</span>
                <span className="text-slate-500 text-[10px]">Field Extraction</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-900 font-semibold block text-[11px]">03. FORENSICS</span>
                <span className="text-slate-500 text-[10px]">Tampering Inspection</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-900 font-semibold block text-[11px]">04. BIOMETRIC</span>
                <span className="text-slate-500 text-[10px]">Face Comparison</span>
              </div>
            </div>
          </div>

          <div className="border-l-2 border-slate-900 pl-3">
            <p className="text-xs font-semibold text-slate-800">AUTHORIZED PERSONNEL ONLY</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Secure terminal access for border control inspectors, supervisors, and intelligence officers.
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Workstation Sign In</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enter official service credentials</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Official Service ID / Gov Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={officialId}
                    onChange={e => setOfficialId(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    placeholder="e.g. SSB-DEL-49102"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Security Passphrase / Token
                  </label>
                  <span className="text-[11px] text-blue-700 hover:underline cursor-pointer font-medium">
                    Forgot Key?
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Remember Station Session</span>
                </label>
                <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  TLS 1.3 SECURE
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating Terminal...
                  </span>
                ) : (
                  <>
                    <span>Authenticate Station Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Profile Selection */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
                Designated Station Profiles
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDutyLogin('OFFICER')}
                  className="px-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-colors cursor-pointer"
                >
                  <span className="block text-[11px] font-semibold text-slate-900">Inspector</span>
                  <span className="block text-[10px] text-slate-500">V. Rathore</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDutyLogin('SUPERVISOR')}
                  className="px-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-colors cursor-pointer"
                >
                  <span className="block text-[11px] font-semibold text-slate-900">Commandant</span>
                  <span className="block text-[10px] text-slate-500">R. Singh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDutyLogin('ADMIN')}
                  className="px-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-colors cursor-pointer"
                >
                  <span className="block text-[11px] font-semibold text-slate-900">Administrator</span>
                  <span className="block text-[10px] text-slate-500">S. Deshmukh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 px-6 border-t border-slate-200 text-center text-[11px] text-slate-500">
        Ministry of Home Affairs · Sashastra Seema Bal (SSB), Police II Division
      </footer>
    </div>
  );
};
