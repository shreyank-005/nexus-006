/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { NewScreeningFlow } from './components/screening/NewScreeningFlow';
import { ScreeningHistoryView } from './components/history/ScreeningHistoryView';
import { ScreeningDetailView } from './components/history/ScreeningDetailView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { ReportsView } from './components/reports/ReportsView';
import { SystemStatusView } from './components/admin/SystemStatusView';
import { SettingsView } from './components/settings/SettingsView';

import {
  UserProfile,
  UserRole,
  ScreeningRecord,
  AuditLogEntry
} from './types';
import {
  ScreeningStore,
  DEFAULT_OFFICER,
  DEFAULT_SUPERVISOR,
  DEFAULT_ADMIN
} from './services/storage/screeningStore';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    ScreeningStore.getUser()
  );
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedScreeningId, setSelectedScreeningId] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>(() =>
    ScreeningStore.getScreenings()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    ScreeningStore.getAuditLogs()
  );

  // Sync state on updates
  const refreshData = () => {
    setScreenings(ScreeningStore.getScreenings());
    setAuditLogs(ScreeningStore.getAuditLogs());
  };

  const handleLoginSuccess = async (user: UserProfile) => {
    ScreeningStore.setUser(user);
    setCurrentUser(user);
    await ScreeningStore.recordAuditLog({
      timestamp: new Date().toISOString(),
      officerId: user.id,
      officerName: user.fullName,
      station: user.station,
      action: 'LOGIN',
      details: `Officer authenticated via Secure Workstation Portal (${user.role}).`,
      status: 'SUCCESS'
    });
    refreshData();
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    if (currentUser) {
      await ScreeningStore.recordAuditLog({
        timestamp: new Date().toISOString(),
        officerId: currentUser.id,
        officerName: currentUser.fullName,
        station: currentUser.station,
        action: 'LOGOUT',
        details: 'Officer signed out of terminal session.',
        status: 'SUCCESS'
      });
    }
    ScreeningStore.setUser(null);
    setCurrentUser(null);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    let newUser: UserProfile = DEFAULT_OFFICER;
    if (newRole === 'SUPERVISOR') newUser = DEFAULT_SUPERVISOR;
    if (newRole === 'ADMIN') newUser = DEFAULT_ADMIN;
    ScreeningStore.setUser(newUser);
    setCurrentUser(newUser);
  };

  const handleStartNewScreening = () => {
    setCurrentView('new-screening');
  };

  const handleSelectScreening = (id: string) => {
    setSelectedScreeningId(id);
    setCurrentView('screening-detail');
  };

  const handleScreeningCompleted = (record: ScreeningRecord) => {
    refreshData();
    setSelectedScreeningId(record.id);
  };

  const handleDownloadReport = async (record: ScreeningRecord) => {
    if (currentUser) {
      await ScreeningStore.recordAuditLog({
        timestamp: new Date().toISOString(),
        screeningId: record.id,
        officerId: currentUser.id,
        officerName: currentUser.fullName,
        station: currentUser.station,
        action: 'REPORT_DOWNLOADED',
        details: `Official PDF screening dossier exported for token ${record.id}.`,
        status: 'SUCCESS'
      });
      refreshData();
    }
    window.print();
  };

  const handleResetData = () => {
    ScreeningStore.resetToFactoryDefaults();
    refreshData();
  };

  // If unauthenticated, display the government login screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const selectedScreeningRecord = selectedScreeningId
    ? screenings.find(s => s.id === selectedScreeningId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <div className="no-print">
        <Navbar
          user={currentUser}
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      </div>

      {/* Main Container with Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        <div className="no-print">
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            userRole={currentUser.role}
          />
        </div>

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 scrollbar-thin">
          {currentView === 'dashboard' && (
            <DashboardView
              user={currentUser}
              screenings={screenings}
              onStartNewScreening={handleStartNewScreening}
              onSelectScreening={handleSelectScreening}
              onNavigateToHistory={() => setCurrentView('screenings')}
            />
          )}

          {currentView === 'new-screening' && (
            <NewScreeningFlow
              currentUser={currentUser}
              onScreeningCompleted={handleScreeningCompleted}
              onDownloadReport={handleDownloadReport}
              onNavigateToHistory={() => setCurrentView('screenings')}
            />
          )}

          {currentView === 'screenings' && (
            <ScreeningHistoryView
              screenings={screenings}
              onSelectScreening={handleSelectScreening}
              onStartNewScreening={handleStartNewScreening}
            />
          )}

          {currentView === 'screening-detail' && selectedScreeningRecord && (
            <ScreeningDetailView
              screening={selectedScreeningRecord}
              onBack={() => setCurrentView('screenings')}
            />
          )}

          {currentView === 'audit' && (
            <AuditTrailView logs={auditLogs} onRefresh={refreshData} />
          )}

          {currentView === 'reports' && <ReportsView screenings={screenings} />}

          {currentView === 'system-status' && <SystemStatusView />}

          {currentView === 'settings' && (
            <SettingsView user={currentUser} onResetStationData={handleResetData} />
          )}
        </main>
      </div>
    </div>
  );
}
