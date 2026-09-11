export type UserRole = 
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'senior_doctor'
  | 'surgeon'
  | 'nurse'
  | 'head_nurse'
  | 'emergency_staff'
  | 'pharmacist'
  | 'inventory_manager'
  | 'operating_room_manager'
  | 'accountant'
  | 'hr'
  | 'receptionist';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  badge: string;
  avatarUrl?: string;
}

export type WorkstationId =
  | 'admin-dashboard'
  | 'emergency-ed-board'
  | 'master-patient-index'
  | 'patient-registration'
  | 'admissions-and-beds'
  | 'doctor-clinic'
  | 'nursing-and-mar'
  | 'operating-theaters'
  | 'pharmacy-and-fefo-stock'
  | 'laboratory'
  | 'radiology'
  | 'billing-and-cashier'
  | 'payroll-and-commissions'
  | 'staff-rostering'
  | 'audit-trail'
  | 'hospital-settings';

export interface Patient {
  id: string;
  mrn: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'Other';
  dateOfBirth: string;
  age: number;
  bloodType: string;
  phone: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[] | string;
  chronicConditions: string[] | string;
  insurance?: {
    provider: string;
    policyNumber: string;
    coveragePct: number;
  };
  balance: number;
  status: string;
  assignedBed?: string;
  admissionDate?: string;
}

export type TriageUrgency = 1 | 2 | 3 | 4 | 5;

export interface EmergencyCase {
  id: string;
  caseNumber: string;
  patientId?: string;
  patientName: string;
  age: number;
  gender: string;
  arrivalTime: string;
  acuityLevel: TriageUrgency;
  acuityLabel: 'RESUS' | 'EMERG' | 'URG' | 'LESS' | 'NON';
  chiefComplaint: string;
  bay: string;
  vitals?: {
    hr: number;
    bp: string;
    spo2: number;
    temp: number;
    rr: number;
  };
  vitalsHr?: number;
  vitalsBp?: string;
  vitalsSpo2?: number;
  vitalsTemp?: number;
  vitalsRr?: number;
  status: string;
  doorToTriageMin?: number;
  doorToDocMin?: number;
  attendingPhysician?: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  roomNumber: string;
  wardName: string;
  wardType: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
  patientId?: string;
  patientName?: string;
  mrn?: string;
  admitTime?: string;
  attendingDoctor?: string;
  nurseInCharge?: string;
  o2Telemetry?: string;
  dailyRate?: number;
}

export interface MedicationBatch {
  id: string;
  medicationId: string;
  name: string;
  genericName: string;
  form: string;
  strength: string;
  batchNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  quantity: number;
  unitCost: number;
  sellingPrice: number;
  location: string;
  isLowStock: boolean;
  isExpiringSoon: boolean;
}

export interface MARRecord {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  medication: string;
  dose: string;
  route: string;
  scheduledTime: string;
  status: 'DUE' | 'ADMINISTERED' | 'HELD' | 'REFUSED';
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
}

export interface OperationSchedule {
  id: string;
  operationNumber: string;
  patientName: string;
  mrn: string;
  procedure?: string;
  procedureName?: string;
  orRoom: string;
  leadSurgeon: string;
  anesthetist: string;
  nurse?: string;
  circulatingNurse?: string;
  scheduledTime: string;
  actualDuration?: string;
  status: string;
  preOpDiagnosis: string;
  postOpDiagnosis?: string;
  consumablesCost: number;
  surgeonShare: number;
  grossRevenue: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  mrn: string;
  date: string;
  items?: {
    description: string;
    category: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  status: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  details: string;
  severity: string;
}
