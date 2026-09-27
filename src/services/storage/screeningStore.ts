import { ScreeningRecord, AuditLogEntry, UserProfile, UserRole, ReviewDecision } from '../../types';
import { generateAuditHash } from '../../lib/security';

const STORAGE_KEY_SCREENINGS = 'synapse_screenings_v3';
const STORAGE_KEY_AUDIT = 'synapse_audit_v3';
const STORAGE_KEY_USER = 'synapse_user_v3';

// Clean legacy demo/fake records from localStorage once
try {
  localStorage.removeItem('synapse_screenings');
  localStorage.removeItem('synapse_screenings_v1');
  localStorage.removeItem('synapse_screenings_v2');
  localStorage.removeItem('synapse_audit');
  localStorage.removeItem('synapse_audit_v1');
  localStorage.removeItem('synapse_audit_v2');
} catch {}

export const DEFAULT_OFFICER: UserProfile = {
  id: 'usr_officer_910',
  officialId: 'SSB-DEL-49102',
  fullName: 'Vikramaditya Rathore',
  email: 'v.rathore@ssb.gov.in',
  rank: 'Inspector / Screening Officer',
  station: 'Integrated Checkpost (ICP) Raxaul, Sector HQ',
  role: 'OFFICER'
};

export const DEFAULT_SUPERVISOR: UserProfile = {
  id: 'usr_sup_802',
  officialId: 'SSB-HQ-10294',
  fullName: 'Col. Rajeshwar Singh (Retd.)',
  email: 'r.singh@ssb.gov.in',
  rank: 'Commandant / Supervisory Officer',
  station: 'Frontier Headquarters, Patna',
  role: 'SUPERVISOR'
};

export const DEFAULT_ADMIN: UserProfile = {
  id: 'usr_admin_001',
  officialId: 'MHA-TECH-0091',
  fullName: 'Dr. Sunita Deshmukh',
  email: 's.deshmukh@mha.gov.in',
  rank: 'Chief Systems Architect, Police II Div',
  station: 'Ministry of Home Affairs, North Block, New Delhi',
  role: 'ADMIN'
};

export class ScreeningStore {
  public static getUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) {
      this.setUser(DEFAULT_OFFICER);
      return DEFAULT_OFFICER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_OFFICER;
    }
  }

  public static setUser(user: UserProfile | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }

  // Returns ONLY real screenings submitted by the user. Zero hardcoded fake records.
  public static getScreenings(): ScreeningRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY_SCREENINGS);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static getScreeningById(id: string): ScreeningRecord | undefined {
    const screenings = this.getScreenings();
    return screenings.find(s => s.id === id);
  }

  public static saveScreening(screening: ScreeningRecord) {
    const screenings = this.getScreenings();
    const existingIndex = screenings.findIndex(s => s.id === screening.id);
    if (existingIndex >= 0) {
      screenings[existingIndex] = { ...screening, updatedAt: new Date().toISOString() };
    } else {
      screenings.unshift(screening);
    }
    localStorage.setItem(STORAGE_KEY_SCREENINGS, JSON.stringify(screenings));
  }

  public static async recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'verificationHash'>) {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    let logs: AuditLogEntry[] = [];
    if (raw) {
      try {
        logs = JSON.parse(raw);
      } catch {
        logs = [];
      }
    }

    const payload = `${entry.timestamp}-${entry.officerId}-${entry.action}-${entry.screeningId || ''}`;
    const verificationHash = await generateAuditHash(payload);

    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      verificationHash
    };

    logs.unshift(fullEntry);
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(0, 200)));
  }

  // Returns ONLY real audit logs from actual user actions. Zero fake seeds.
  public static getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static resetToFactoryDefaults() {
    localStorage.removeItem(STORAGE_KEY_SCREENINGS);
    localStorage.removeItem(STORAGE_KEY_AUDIT);
  }
}
