import { create } from 'zustand';
import api from '../services/api';
import {
  User,
  UserRole,
  WorkstationId,
  Patient,
  EmergencyCase,
  Bed,
  MedicationBatch,
  MARRecord,
  OperationSchedule,
  Invoice,
  AuditRecord,
} from '../types';

interface HospitalStore {
  isAuthenticated: boolean;
  currentUser: User;
  activeWorkstation: WorkstationId;
  activeBranch: string;
  activeLanguage: 'en' | 'ar';
  isAlarmActive: boolean;
  alarmModalOpen: boolean;
  searchModalOpen: boolean;
  searchQuery: string;
  loginModalOpen: boolean;
  authNotification: string | null;

  // Data
  patients: Patient[];
  emergencyCases: EmergencyCase[];
  beds: Bed[];
  batches: MedicationBatch[];
  marRecords: MARRecord[];
  operations: OperationSchedule[];
  invoices: Invoice[];
  auditLogs: AuditRecord[];
  telemetry: any;
  loading: boolean;

  // Actions
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  setActiveWorkstation: (ws: WorkstationId) => void;
  setActiveBranch: (branch: string) => void;
  toggleLanguage: () => void;
  setAlarmActive: (active: boolean) => void;
  setAlarmModalOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setLoginModalOpen: (open: boolean) => void;
  setAuthNotification: (msg: string | null) => void;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Data Fetching & Mutations
  fetchInitialData: () => Promise<void>;
  updateBedStatus: (bedId: string, status: string, patientName?: string, mrn?: string) => Promise<void>;
  addEmergencyCase: (data: Partial<EmergencyCase>) => Promise<void>;
  updateEmergencyStatus: (caseId: string, status: string, bay?: string) => Promise<void>;
  administerMAR: (recordId: string, notes?: string) => Promise<void>;
  dispenseMedication: (medicationId: string, quantity: number, patientName: string, mrn: string) => Promise<boolean>;
  recordPayment: (invoiceId: string, amount: number, method: string) => Promise<void>;
  addPatient: (data: Partial<Patient>) => Promise<void>;
}

export const ROLE_DEFAULT_WORKSTATION: Record<string, WorkstationId> = {
  super_admin: 'admin-dashboard',
  hospital_admin: 'admin-dashboard',
  doctor: 'doctor-clinic',
  senior_doctor: 'doctor-clinic',
  surgeon: 'operating-theaters',
  nurse: 'nursing-and-mar',
  head_nurse: 'nursing-and-mar',
  emergency_staff: 'emergency-ed-board',
  pharmacist: 'pharmacy-and-fefo-stock',
  inventory_manager: 'pharmacy-and-fefo-stock',
  operating_room_manager: 'operating-theaters',
  accountant: 'billing-and-cashier',
  receptionist: 'patient-registration',
  hr: 'staff-rostering',
};

export const ROLE_ALLOWED_WORKSTATIONS: Record<string, WorkstationId[]> = {
  super_admin: [
    'admin-dashboard',
    'emergency-ed-board',
    'master-patient-index',
    'patient-registration',
    'admissions-and-beds',
    'doctor-clinic',
    'nursing-and-mar',
    'operating-theaters',
    'pharmacy-and-fefo-stock',
    'laboratory',
    'radiology',
    'billing-and-cashier',
    'payroll-and-commissions',
    'staff-rostering',
    'audit-trail',
  ],
  hospital_admin: [
    'admin-dashboard',
    'emergency-ed-board',
    'master-patient-index',
    'patient-registration',
    'admissions-and-beds',
    'doctor-clinic',
    'nursing-and-mar',
    'operating-theaters',
    'pharmacy-and-fefo-stock',
    'laboratory',
    'radiology',
    'billing-and-cashier',
    'payroll-and-commissions',
    'staff-rostering',
    'audit-trail',
  ],
  nurse: [
    'nursing-and-mar',
    'admissions-and-beds',
    'master-patient-index',
  ],
  head_nurse: [
    'nursing-and-mar',
    'admissions-and-beds',
    'master-patient-index',
    'staff-rostering',
  ],
  doctor: [
    'doctor-clinic',
    'master-patient-index',
    'admissions-and-beds',
    'laboratory',
    'radiology',
  ],
  senior_doctor: [
    'doctor-clinic',
    'master-patient-index',
    'admissions-and-beds',
    'laboratory',
    'radiology',
    'operating-theaters',
  ],
  surgeon: [
    'operating-theaters',
    'doctor-clinic',
    'admissions-and-beds',
    'radiology',
    'master-patient-index',
  ],
  operating_room_manager: [
    'operating-theaters',
    'doctor-clinic',
    'admissions-and-beds',
    'radiology',
  ],
  emergency_staff: [
    'emergency-ed-board',
    'master-patient-index',
    'admissions-and-beds',
    'laboratory',
  ],
  pharmacist: [
    'pharmacy-and-fefo-stock',
    'master-patient-index',
  ],
  inventory_manager: [
    'pharmacy-and-fefo-stock',
  ],
  accountant: [
    'billing-and-cashier',
    'payroll-and-commissions',
    'master-patient-index',
  ],
  receptionist: [
    'patient-registration',
    'master-patient-index',
    'billing-and-cashier',
  ],
  hr: [
    'staff-rostering',
    'payroll-and-commissions',
  ],
};

const DEFAULT_USER: User = {
  id: 'usr-sarah-vance',
  username: 'admin',
  fullName: 'Dr. Sarah Vance, MD',
  email: 'sarah.vance@medcore.health',
  role: 'super_admin',
  department: 'Trauma Unit A • Shift 1',
  badge: 'TRAUMA-DIR-01',
};

export const useHospitalStore = create<HospitalStore>((set, get) => ({
  isAuthenticated: false,
  currentUser: DEFAULT_USER,
  activeWorkstation: 'admin-dashboard',
  activeBranch: 'Metro Central - Main',
  activeLanguage: 'en',
  isAlarmActive: false,
  alarmModalOpen: false,
  searchModalOpen: false,
  searchQuery: '',
  loginModalOpen: false,
  authNotification: null,

  patients: [],
  emergencyCases: [],
  beds: [],
  batches: [],
  marRecords: [],
  operations: [],
  invoices: [],
  auditLogs: [],
  telemetry: null,
  loading: false,

  setCurrentUser: (user) => set({ currentUser: user }),

  switchRole: (role: UserRole) => {
    const roleProfiles: Record<UserRole, Partial<User>> = {
      super_admin: { fullName: 'Dr. Sarah Vance, MD', department: 'Executive Command Suite', badge: 'TRAUMA-DIR-01', username: 'admin' },
      hospital_admin: { fullName: 'Arthur Pendelton, MHA', department: 'Hospital Administration', badge: 'HOSP-ADM-01', username: 'admin' },
      doctor: { fullName: 'Dr. Marcus Brody, MD', department: 'Cardiology & Cath Lab', badge: 'CARD-DOC-04', username: 'doctor' },
      senior_doctor: { fullName: 'Dr. Marcus Brody, MD', department: 'Cardiology & Cath Lab', badge: 'CARD-DOC-04', username: 'doctor' },
      surgeon: { fullName: 'Dr. Elena Rostova, MD', department: 'Chief of Trauma Surgery', badge: 'SURG-LEAD-02', username: 'surgeon' },
      nurse: { fullName: 'Nurse Emily Chen, BSN, RN', department: 'Trauma Unit A • Shift 1', badge: 'NURSE-CHG-12', username: 'nurse' },
      head_nurse: { fullName: 'Nurse Lisa Adams, MSN, RN', department: 'Inpatient Nursing Super.', badge: 'NURSE-HEAD-01', username: 'nurse' },
      emergency_staff: { fullName: 'Dr. Robert Hayes, MD', department: 'Emergency Trauma Triage', badge: 'EMERG-DIR-07', username: 'emergency' },
      pharmacist: { fullName: 'Pharm. Tariq Al-Mansoor', department: 'Central Clinical Pharmacy', badge: 'PHARM-CHIEF-01', username: 'pharmacist' },
      inventory_manager: { fullName: 'Carlos Rivera', department: 'Supply Chain & FEFO Logistics', badge: 'INV-MGR-02', username: 'pharmacist' },
      operating_room_manager: { fullName: 'Dr. Nathan Vance, MD', department: 'Surgical Suite & Anesthesia', badge: 'OR-MGR-01', username: 'surgeon' },
      accountant: { fullName: 'David Keller, CPA', department: 'Patient Finance & Cashier', badge: 'FIN-CTRL-09', username: 'accountant' },
      hr: { fullName: 'Jessica Alba, SHRM-SCP', department: 'Human Resources & Payroll', badge: 'HR-DIR-03', username: 'hr' },
      receptionist: { fullName: 'Maya Lin', department: 'Patient Registration & Queues', badge: 'ADMIT-CLERK-05', username: 'receptionist' },
    };
    const profile = roleProfiles[role] || roleProfiles.super_admin;
    const targetWorkstation = ROLE_DEFAULT_WORKSTATION[role] || 'admin-dashboard';
    set((state) => ({
      isAuthenticated: true,
      currentUser: {
        ...state.currentUser,
        role,
        username: profile.username || state.currentUser.username,
        fullName: profile.fullName || state.currentUser.fullName,
        department: profile.department || state.currentUser.department,
        badge: profile.badge || state.currentUser.badge,
      },
      activeWorkstation: targetWorkstation,
      authNotification: `Authenticated as ${profile.fullName} (${role}). Active specialty workstation: ${targetWorkstation}.`,
    }));
  },

  setActiveWorkstation: (ws) => {
    const { currentUser } = get();
    const allowed = ROLE_ALLOWED_WORKSTATIONS[currentUser.role] || ['admin-dashboard'];
    if (allowed.includes(ws)) {
      set({ activeWorkstation: ws });
    } else {
      const defaultWs = ROLE_DEFAULT_WORKSTATION[currentUser.role] || 'admin-dashboard';
      set({
        activeWorkstation: defaultWs,
        authNotification: `Access Restricted: Your clinical role (${currentUser.role}) does not have permission for that station.`,
      });
    }
  },
  setActiveBranch: (branch) => set({ activeBranch: branch }),
  toggleLanguage: () => set((state) => ({ activeLanguage: state.activeLanguage === 'en' ? 'ar' : 'en' })),
  setAlarmActive: (active) => set({ isAlarmActive: active }),
  setAlarmModalOpen: (open) => set({ alarmModalOpen: open }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoginModalOpen: (open) => set({ loginModalOpen: open }),
  setAuthNotification: (msg) => set({ authNotification: msg }),

  login: async (username: string, password: string) => {
    try {
      set({ loading: true });
      const res = await api.post('/auth/login', { username, password });
      const { accessToken, user } = res.data;
      if (accessToken) {
        localStorage.setItem('hospital_pro_token', accessToken);
      }
      const targetWs = ROLE_DEFAULT_WORKSTATION[user.role] || 'admin-dashboard';
      set({
        isAuthenticated: true,
        currentUser: user,
        activeWorkstation: targetWs,
        loading: false,
        loginModalOpen: false,
        authNotification: `Welcome ${user.fullName}. Automatically routed to your specialist workstation: ${targetWs}.`,
      });
      return { success: true };
    } catch (err: any) {
      const cleanUser = username.trim().toLowerCase();
      const fallbackRoleMap: Record<string, UserRole> = {
        admin: 'super_admin',
        nurse: 'nurse',
        doctor: 'doctor',
        surgeon: 'surgeon',
        emergency: 'emergency_staff',
        pharmacist: 'pharmacist',
        accountant: 'accountant',
        receptionist: 'receptionist',
        hr: 'hr',
      };
      if (fallbackRoleMap[cleanUser]) {
        get().switchRole(fallbackRoleMap[cleanUser]);
        set({ loading: false, loginModalOpen: false });
        return { success: true };
      }
      set({ loading: false });
      return {
        success: false,
        message: err.response?.data?.message || 'Authentication failed. Please verify credentials.',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('hospital_pro_token');
    set({
      isAuthenticated: false,
      currentUser: DEFAULT_USER,
      activeWorkstation: 'admin-dashboard',
      authNotification: 'Session terminated. Please authenticate with your staff credentials.',
    });
  },

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [
        telemetryRes,
        patientsRes,
        emergRes,
        bedsRes,
        batchesRes,
        marRes,
        opsRes,
        invoicesRes,
        auditRes,
      ] = await Promise.all([
        api.get('/telemetry/command-center'),
        api.get('/patients'),
        api.get('/emergency/cases'),
        api.get('/hospital/beds'),
        api.get('/pharmacy/batches'),
        api.get('/nursing/mar'),
        api.get('/operations/schedules'),
        api.get('/billing/invoices'),
        api.get('/audit/logs'),
      ]);

      set({
        telemetry: telemetryRes.data,
        patients: patientsRes.data,
        emergencyCases: emergRes.data,
        beds: bedsRes.data,
        batches: batchesRes.data,
        marRecords: marRes.data,
        operations: opsRes.data,
        invoices: invoicesRes.data,
        auditLogs: auditRes.data,
        loading: false,
      });
    } catch (err) {
      console.error('Error loading data from API:', err);
      set({ loading: false });
    }
  },

  updateBedStatus: async (bedId, status, patientName, mrn) => {
    try {
      await api.patch(`/hospital/beds/${bedId}/status`, { status, patientName, mrn });
      set((state) => ({
        beds: state.beds.map((b) =>
          b.id === bedId
            ? {
                ...b,
                status: status as any,
                patientName: status === 'available' ? undefined : (patientName || b.patientName),
                mrn: status === 'available' ? undefined : (mrn || b.mrn),
              }
            : b
        ),
      }));
    } catch (err) {
      console.error('Error updating bed:', err);
    }
  },

  addEmergencyCase: async (data) => {
    try {
      const res = await api.post('/emergency/intake', data);
      set((state) => ({
        emergencyCases: [res.data, ...state.emergencyCases],
      }));
    } catch (err) {
      console.error('Error creating emergency case:', err);
    }
  },

  updateEmergencyStatus: async (caseId, status, bay) => {
    try {
      await api.patch(`/emergency/cases/${caseId}/status`, { status, bay });
      set((state) => ({
        emergencyCases: state.emergencyCases.map((c) =>
          c.id === caseId ? { ...c, status: status as any, bay: bay || c.bay } : c
        ),
      }));
    } catch (err) {
      console.error('Error updating emergency status:', err);
    }
  },

  administerMAR: async (recordId, notes) => {
    try {
      const nurseName = get().currentUser.fullName;
      await api.post(`/nursing/mar/${recordId}/administer`, { nurseName, notes });
      set((state) => ({
        marRecords: state.marRecords.map((m) =>
          m.id === recordId
            ? {
                ...m,
                status: 'ADMINISTERED',
                administeredBy: nurseName,
                administeredAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST',
                notes: notes || m.notes,
              }
            : m
        ),
      }));
    } catch (err) {
      console.error('Error administering MAR:', err);
    }
  },

  dispenseMedication: async (medicationId, quantity, patientName, mrn) => {
    try {
      const performedBy = get().currentUser.fullName;
      const res = await api.post('/pharmacy/dispense', {
        medicationId,
        quantity,
        patientName,
        mrn,
        performedBy,
      });
      if (res.data.success) {
        // Refresh batches
        const batchesRes = await api.get('/pharmacy/batches');
        set({ batches: batchesRes.data });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error dispensing medication:', err);
      return false;
    }
  },

  recordPayment: async (invoiceId, amount, method) => {
    try {
      const cashierName = get().currentUser.fullName;
      const res = await api.post('/billing/payments', { invoiceId, amount, method, cashierName });
      if (res.data.success) {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId ? res.data.updatedInvoice : inv
          ),
        }));
      }
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  },

  addPatient: async (data) => {
    try {
      const res = await api.post('/patients', data);
      set((state) => ({
        patients: [res.data, ...state.patients],
      }));
    } catch (err) {
      console.error('Error creating patient:', err);
    }
  },
}));
