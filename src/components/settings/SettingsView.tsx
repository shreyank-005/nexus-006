import React, { useState } from 'react';
import { Settings, Shield, HardDrive, RefreshCw, CheckCircle2, User, Building, KeyRound, Globe, Save } from 'lucide-react';
import { UserProfile } from '../../types';
import { ScreeningStore } from '../../services/storage/screeningStore';

interface SettingsViewProps {
  user: UserProfile | null;
  onResetStationData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onResetStationData }) => {
  const [stationName, setStationName] = useState(user?.station || 'Integrated Checkpost (ICP) Raxaul Terminal 04');
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [mrzChecksumEnforce, setMrzChecksumEnforce] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Station &amp; Terminal Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure local workstation operational settings, checkpost identification, and compliance rules.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Station parameters saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-2xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Checkpost / Station Physical Designation
          </label>
          <input
            type="text"
            value={stationName}
            onChange={e => setStationName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Automated Inspection Rules
          </span>

          <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <input
              type="checkbox"
              checked={autoEnhance}
              onChange={e => setAutoEnhance(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Automatic Contrast Optimization &amp; Deskew</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Execute four-point perspective warp and CLAHE histogram equalization on document acquisition.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <input
              type="checkbox"
              checked={mrzChecksumEnforce}
              onChange={e => setMrzChecksumEnforce(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Strict ICAO 9303 Check Digit Enforcement</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Automatically raise secondary review flag if Modulus 7 check digits fail on MRZ line 2.
              </span>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Workstation Settings</span>
          </button>
        </div>
      </form>

      {/* Terminal Storage Management */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-600" />
            <span>Terminal Database &amp; Cache Maintenance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset local browser terminal cache and restore initial station state.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Clear Local Workstation Data</span>
            <span className="text-[11px] text-slate-500">
              Resets locally stored test screening records and audit trail logs.
            </span>
          </div>

          <button
            type="button"
            onClick={onResetStationData}
            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Station Data
          </button>
        </div>
      </div>
    </div>
  );
};
