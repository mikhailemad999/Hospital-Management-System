import React, { useState } from 'react';
import { useHospitalStore, ROLE_DEFAULT_WORKSTATION } from '../../store/useHospitalStore';
import { UserRole } from '../../types';

interface StaffPersona {
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  badge: string;
  targetPage: string;
  icon: string;
  color: string;
}

const STAFF_PERSONAS: StaffPersona[] = [
  {
    username: 'admin',
    name: 'Dr. Sarah Vance, MD',
    role: 'super_admin',
    roleTitle: 'Hospital Director & CMO',
    department: 'Executive Operations',
    badge: 'TRAUMA-DIR-01',
    targetPage: 'Executive Command Center',
    icon: 'admin_panel_settings',
    color: 'border-primary/50 text-primary bg-primary/5',
  },
  {
    username: 'doctor',
    name: 'Dr. Marcus Brody, MD',
    role: 'doctor',
    roleTitle: 'Cardiologist & Attending Physician',
    department: 'Cardiology & Cath Lab',
    badge: 'CARD-DOC-04',
    targetPage: 'Doctor Clinical Station & SOAP EHR',
    icon: 'stethoscope',
    color: 'border-secondary/50 text-secondary bg-secondary/5',
  },
  {
    username: 'emergency',
    name: 'Dr. Robert Hayes, MD',
    role: 'emergency_staff',
    roleTitle: 'Emergency Medical Director',
    department: 'Emergency & Trauma (ED)',
    badge: 'EMERG-DIR-07',
    targetPage: 'Emergency Trauma Board (L1-L5)',
    icon: 'e911_emergency',
    color: 'border-error/50 text-error bg-error/5',
  },
  {
    username: 'nurse',
    name: 'Nurse Emily Chen, BSN, RN',
    role: 'nurse',
    roleTitle: 'Charge Nurse',
    department: 'Trauma Unit A • Shift 1',
    badge: 'NURSE-CHG-12',
    targetPage: 'Bedside Nursing & MAR Dosing',
    icon: 'vaccines',
    color: 'border-tertiary/50 text-tertiary bg-tertiary/5',
  },
  {
    username: 'pharmacist',
    name: 'Pharm. Tariq Al-Mansoor',
    role: 'pharmacist',
    roleTitle: 'Chief Pharmacist',
    department: 'Central Clinical Pharmacy',
    badge: 'PHARM-CHIEF-01',
    targetPage: 'Pharmacy FEFO Stock & Lot Dispensing',
    icon: 'prescriptions',
    color: 'border-emerald-600/50 text-emerald-800 bg-emerald-50',
  },
  {
    username: 'surgeon',
    name: 'Dr. Elena Rostova, MD',
    role: 'surgeon',
    roleTitle: 'Chief of Trauma Surgery',
    department: 'Operating Suites & OR-3',
    badge: 'SURG-LEAD-02',
    targetPage: 'Operating Theaters & Surgical Consumables',
    icon: 'surgical',
    color: 'border-indigo-600/50 text-indigo-800 bg-indigo-50',
  },
  {
    username: 'accountant',
    name: 'David Keller, CPA',
    role: 'accountant',
    roleTitle: 'Financial Controller & Cashier',
    department: 'Revenue Cycle & Billing',
    badge: 'FIN-CTRL-09',
    targetPage: 'Patient Billing & Cashier Shift Balancing',
    icon: 'point_of_sale',
    color: 'border-amber-600/50 text-amber-800 bg-amber-50',
  },
  {
    username: 'receptionist',
    name: 'Maya Lin',
    role: 'receptionist',
    roleTitle: 'Admissions Officer',
    department: 'Outpatient Registration & Queue',
    badge: 'ADMIT-CLERK-05',
    targetPage: 'Outpatient Registration & Ticketing',
    icon: 'person_add',
    color: 'border-cyan-600/50 text-cyan-800 bg-cyan-50',
  },
  {
    username: 'hr',
    name: 'Jessica Alba, SHRM-SCP',
    role: 'hr',
    roleTitle: 'Human Resources Director',
    department: 'Payroll & Doctor Commissions',
    badge: 'HR-DIR-03',
    targetPage: 'Staff Payroll & Doctor Revenue Shares',
    icon: 'badge',
    color: 'border-purple-600/50 text-purple-800 bg-purple-50',
  },
];

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, switchRole, activeLanguage } = useHospitalStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    const result = await login(username, password);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.message || 'Authentication error. Please check credentials.');
    }
  };

  const handleQuickPersonaSelect = (persona: StaffPersona) => {
    setUsername(persona.username);
    setPassword('Admin123!');
    switchRole(persona.role);
    setLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-on-primary flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-on-primary/10 flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-3xl">local_hospital</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-on-primary/20 px-2 py-0.5 rounded font-bold tracking-wider">
                  MedCore EHR Enterprise v4.8
                </span>
                <span className="text-[10px] font-mono">HL7 / FHIR v4 Secure Gateway</span>
              </div>
              <h2 className="text-xl font-bold mt-0.5">
                {activeLanguage === 'ar' ? 'بوابة الدخول إلى النظام الصحي الذكي' : 'Clinical Staff Authentication & Role Dispatcher'}
              </h2>
              <p className="text-xs text-on-primary/80 mt-0.5">
                {activeLanguage === 'ar'
                  ? 'تسجيل الدخول يوجه المستخدم تلقائياً إلى محطة العمل الخاصة به مع الصلاحيات المحددة'
                  : 'Every verified clinical staff member is automatically routed to their designated workstation upon authentication.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 flex items-center justify-center text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col lg:flex-row gap-6">
          {/* Left Side: Standard Login Form */}
          <div className="lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-outline-variant/30 pb-6 lg:pb-0 lg:pr-6">
            <div>
              <span className="text-[11px] font-mono uppercase text-secondary font-bold tracking-wider block mb-3">
                {activeLanguage === 'ar' ? 'بيانات الاعتماد الرسمية' : 'OFFICIAL BADGE LOGIN'}
              </span>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-error">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    {activeLanguage === 'ar' ? 'اسم المستخدم أو رمز الموظف' : 'Staff Username / ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="e.g. doctor, nurse, admin"
                      className="w-full text-xs font-mono px-3 py-2 pl-8 rounded-lg bg-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-secondary">
                      badge
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    {activeLanguage === 'ar' ? 'كلمة المرور' : 'Secure Passkey / Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full text-xs font-mono px-3 py-2 pl-8 rounded-lg bg-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-secondary">
                      lock
                    </span>
                  </div>
                  <span className="text-[10px] text-secondary mt-1 block">Default demo password: Admin123! or 1234</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In & Route to Workstation'}</span>
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/20 text-[11px] text-secondary">
              <span className="font-semibold text-on-surface block">MySQL 3305 Backend Connected</span>
              <span>All authentication tokens are cryptographically validated with HMAC SHA-256 JWT.</span>
            </div>
          </div>

          {/* Right Side: Fast One-Click Persona Switcher */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-secondary font-bold tracking-wider">
                {activeLanguage === 'ar' ? 'الدخول السريع بحسب الدور الوظيفي' : 'ONE-CLICK ROLE DISPATCH (CLINICAL TEST PERSONAS)'}
              </span>
              <span className="text-[10px] font-mono bg-surface-container px-2 py-0.5 rounded text-secondary">
                9 Active Clinical Roles
              </span>
            </div>
            <p className="text-xs text-secondary mb-4">
              Select any clinical persona below to automatically authenticate and immediately land on their designated operational station.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[420px] pr-1">
              {STAFF_PERSONAS.map((p) => (
                <button
                  key={p.username}
                  onClick={() => handleQuickPersonaSelect(p)}
                  type="button"
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between ${p.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-xl">{p.icon}</span>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-surface border border-outline-variant/30 text-secondary">
                        {p.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-on-surface mt-2 leading-tight">{p.name}</h4>
                    <p className="text-[11px] font-medium text-secondary leading-tight mt-0.5">{p.roleTitle}</p>
                    <p className="text-[10px] text-secondary/80 font-mono mt-0.5">{p.department}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] font-bold">
                    <span className="truncate pr-1">➔ {p.targetPage}</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
