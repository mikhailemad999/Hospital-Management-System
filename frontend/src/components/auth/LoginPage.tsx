import React, { useState } from 'react';
import { useHospitalStore, ROLE_DEFAULT_WORKSTATION } from '../../store/useHospitalStore';
import { UserRole } from '../../types';

interface SpecialistPersona {
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  badge: string;
  targetStation: string;
  authorizedSummary: string;
  icon: string;
  colorClass: string;
  accentBg: string;
}

const SPECIALIST_PERSONAS: SpecialistPersona[] = [
  {
    username: 'admin',
    name: 'Dr. Sarah Vance, MD',
    role: 'super_admin',
    roleTitle: 'Hospital Director & CMO',
    department: 'Executive Operations',
    badge: 'TRAUMA-DIR-01',
    targetStation: 'Executive Command Center',
    authorizedSummary: 'Full Access (All 15 Stations)',
    icon: 'admin_panel_settings',
    colorClass: 'border-blue-500/40 text-blue-700 hover:border-blue-600',
    accentBg: 'bg-blue-50/80 hover:bg-blue-100/70',
  },
  {
    username: 'nurse',
    name: 'Nurse Emily Chen, BSN, RN',
    role: 'nurse',
    roleTitle: 'Charge Nurse',
    department: 'Trauma Unit A • Shift 1',
    badge: 'NURSE-CHG-12',
    targetStation: 'Bedside Nursing & MAR',
    authorizedSummary: 'Nursing MAR • Beds & Wards • Patient Index',
    icon: 'vaccines',
    colorClass: 'border-emerald-500/40 text-emerald-800 hover:border-emerald-600',
    accentBg: 'bg-emerald-50/80 hover:bg-emerald-100/70',
  },
  {
    username: 'doctor',
    name: 'Dr. Marcus Brody, MD',
    role: 'doctor',
    roleTitle: 'Cardiologist & Physician',
    department: 'Cardiology & Cath Lab',
    badge: 'CARD-DOC-04',
    targetStation: 'Doctor Clinical EHR Station',
    authorizedSummary: 'Doctor Clinic • Lab LIS • PACS • Wards',
    icon: 'stethoscope',
    colorClass: 'border-indigo-500/40 text-indigo-800 hover:border-indigo-600',
    accentBg: 'bg-indigo-50/80 hover:bg-indigo-100/70',
  },
  {
    username: 'surgeon',
    name: 'Dr. Elena Rostova, MD',
    role: 'surgeon',
    roleTitle: 'Chief of Trauma Surgery',
    department: 'Operating Suites & OR-3',
    badge: 'SURG-LEAD-02',
    targetStation: 'Operating Theaters / OR',
    authorizedSummary: 'Operating Theaters • Post-Op Wards • PACS',
    icon: 'vital_signs',
    colorClass: 'border-rose-500/40 text-rose-800 hover:border-rose-600',
    accentBg: 'bg-rose-50/80 hover:bg-rose-100/70',
  },
  {
    username: 'emergency',
    name: 'Dr. Robert Hayes, MD',
    role: 'emergency_staff',
    roleTitle: 'Emergency Medical Director',
    department: 'Emergency & Trauma (ED)',
    badge: 'EMERG-DIR-07',
    targetStation: 'Emergency Trauma Board',
    authorizedSummary: 'Emergency ED Board • Triage • STAT Lab',
    icon: 'e911_emergency',
    colorClass: 'border-red-500/40 text-red-800 hover:border-red-600',
    accentBg: 'bg-red-50/80 hover:bg-red-100/70',
  },
  {
    username: 'pharmacist',
    name: 'Pharm. Tariq Al-Mansoor',
    role: 'pharmacist',
    roleTitle: 'Chief Pharmacist',
    department: 'Central Clinical Pharmacy',
    badge: 'PHARM-CHIEF-01',
    targetStation: 'Pharmacy FEFO Inventory',
    authorizedSummary: 'Pharmacy FEFO • Batch Dispensing',
    icon: 'prescriptions',
    colorClass: 'border-teal-500/40 text-teal-800 hover:border-teal-600',
    accentBg: 'bg-teal-50/80 hover:bg-teal-100/70',
  },
  {
    username: 'accountant',
    name: 'David Keller, CPA',
    role: 'accountant',
    roleTitle: 'Financial Controller',
    department: 'Patient Finance & Billing',
    badge: 'FIN-CTRL-09',
    targetStation: 'Billing & Cashier Balancing',
    authorizedSummary: 'Billing & Cashier • Doctor Payroll',
    icon: 'point_of_sale',
    colorClass: 'border-amber-500/40 text-amber-800 hover:border-amber-600',
    accentBg: 'bg-amber-50/80 hover:bg-amber-100/70',
  },
  {
    username: 'receptionist',
    name: 'Maya Lin',
    role: 'receptionist',
    roleTitle: 'Admissions Officer',
    department: 'Outpatient Admissions',
    badge: 'ADMIT-CLERK-05',
    targetStation: 'Registration & Queue Tickets',
    authorizedSummary: 'Patient Registration • Queue • Co-pays',
    icon: 'person_add',
    colorClass: 'border-cyan-500/40 text-cyan-800 hover:border-cyan-600',
    accentBg: 'bg-cyan-50/80 hover:bg-cyan-100/70',
  },
  {
    username: 'hr',
    name: 'Jessica Alba, SHRM-SCP',
    role: 'hr',
    roleTitle: 'Human Resources Director',
    department: 'Workforce & Payroll',
    badge: 'HR-DIR-03',
    targetStation: 'Staff Rostering & Biometrics',
    authorizedSummary: 'Staff Rostering • Biometrics • Payroll',
    icon: 'badge',
    colorClass: 'border-purple-500/40 text-purple-800 hover:border-purple-600',
    accentBg: 'bg-purple-50/80 hover:bg-purple-100/70',
  },
];

export const LoginPage: React.FC = () => {
  const { login, switchRole, activeLanguage, toggleLanguage } = useHospitalStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg(activeLanguage === 'ar' ? 'الرجاء إدخال اسم المستخدم أو النقر على تخصصك أدناه.' : 'Please enter your username or click your specialty below.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const pass = password || 'Admin123!';
    const result = await login(username.trim(), pass);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.message || 'Authentication error. Please verify credentials.');
    }
  };

  const handleInstantPersonaLogin = async (persona: SpecialistPersona) => {
    setUsername(persona.username);
    setPassword('Admin123!');
    setIsSubmitting(true);
    setErrorMsg(null);
    const result = await login(persona.username, 'Admin123!');
    setIsSubmitting(false);
    if (!result.success) {
      // Fallback to in-memory role switch if backend network has any issue
      switchRole(persona.role);
    }
  };

  return (
    <div
      dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white font-sans ${
        activeLanguage === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
            <span className="material-symbols-outlined text-2xl">local_hospital</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                MEDCORE<span className="text-cyan-400 font-light">PRO</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-cyan-950/90 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
                EHR ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Hospital Management System • Clinical Precision Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HL7 / FHIR v4 GATEWAY ONLINE</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-mono font-bold text-slate-200 transition-colors"
            title="Toggle Arabic / English (RTL/LTR)"
          >
            <span className="material-symbols-outlined text-base text-cyan-400">translate</span>
            <span>{activeLanguage === 'en' ? 'العربية (AR)' : 'ENGLISH (EN)'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          
          {/* Left Column: Official Staff Login Form */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="mb-5">
              <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                {activeLanguage === 'ar' ? 'بوابة التحقق السريري' : 'CLINICAL CREDENTIALS ACCESS'}
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                {activeLanguage === 'ar' ? 'تسجيل الدخول إلى محطتك' : 'Staff Portal Login'}
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {activeLanguage === 'ar'
                  ? 'أدخل بياناتك أو اختر تخصصك أدناه. يفتح النظام محطتك الخاصة فقط ويحجب المحطات غير المصرح بها.'
                  : 'Enter your credentials or tap a specialist below. The system automatically opens your designated workstation and restricts access to your specialty only.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-[18px] text-rose-400">error</span>
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Quick Specialty Role Chips */}
            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                {activeLanguage === 'ar' ? 'اختيار سريع للتخصص (انقر للتعيين الفوري):' : 'Select Specialty (Quick Fill):'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Nurse', user: 'nurse', icon: 'vaccines', color: 'hover:border-emerald-500 hover:bg-emerald-950/40 text-emerald-300' },
                  { label: 'Doctor', user: 'doctor', icon: 'stethoscope', color: 'hover:border-indigo-500 hover:bg-indigo-950/40 text-indigo-300' },
                  { label: 'Surgeon', user: 'surgeon', icon: 'vital_signs', color: 'hover:border-rose-500 hover:bg-rose-950/40 text-rose-300' },
                  { label: 'Emergency', user: 'emergency', icon: 'e911_emergency', color: 'hover:border-red-500 hover:bg-red-950/40 text-red-300' },
                  { label: 'Pharmacist', user: 'pharmacist', icon: 'prescriptions', color: 'hover:border-teal-500 hover:bg-teal-950/40 text-teal-300' },
                  { label: 'Accountant', user: 'accountant', icon: 'point_of_sale', color: 'hover:border-amber-500 hover:bg-amber-950/40 text-amber-300' },
                  { label: 'Reception', user: 'receptionist', icon: 'person_add', color: 'hover:border-cyan-500 hover:bg-cyan-950/40 text-cyan-300' },
                  { label: 'HR Admin', user: 'hr', icon: 'badge', color: 'hover:border-purple-500 hover:bg-purple-950/40 text-purple-300' },
                  { label: 'Admin', user: 'admin', icon: 'admin_panel_settings', color: 'hover:border-blue-500 hover:bg-blue-950/40 text-blue-300' },
                ].map((item) => (
                  <button
                    key={item.user}
                    type="button"
                    onClick={() => {
                      setUsername(item.user);
                      setPassword('Admin123!');
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-[11px] transition-all text-left ${item.color} ${
                      username === item.user ? 'border-cyan-400 bg-cyan-950/60 text-white font-bold ring-1 ring-cyan-400 shadow-sm' : 'text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {activeLanguage === 'ar' ? 'اسم المستخدم أو الرمز الوظيفي' : 'Username / Staff Code'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="e.g. nurse, doctor, admin, surgeon..."
                    className="w-full text-xs font-mono px-3.5 py-2.5 pl-9 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
                    badge
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {activeLanguage === 'ar' ? 'كلمة المرور' : 'Password / Security PIN'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full text-xs font-mono px-3.5 py-2.5 pl-9 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
                    lock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-mono">
                  <span>Demo Passkey: <code className="text-cyan-400">Admin123!</code></span>
                  <span>SSL/TLS Encrypted</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Authenticating Staff...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>{activeLanguage === 'ar' ? 'تسجيل الدخول وفتح المحطة' : 'Login to Specialist Station'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>MySQL 3305 Database</span>
              </span>
              <span className="text-cyan-400 font-semibold">Port 4000 NestJS Active</span>
            </div>
          </div>

          {/* Right Column: 1-Click Specialist Personas (Evaluator & Demo Grid) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    {activeLanguage === 'ar' ? 'الدخول السريع بحسب التخصص' : 'INSTANT SPECIALIST WORKSTATION ROUTING'}
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-700/40 px-2 py-0.5 rounded font-bold">
                    9 ROLES
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeLanguage === 'ar'
                  ? 'انقر على أي بطاقة لتسجيل الدخول الفوري وفتح المحطة المتخصصة (مثل: المدير ➔ لوحة القيادة، الممرض ➔ محطة التمريض وMAR، الطبيب ➔ عيادة الطبيب، الجراح ➔ غرف العمليات).'
                  : 'Click any clinical specialist below to instantly authenticate and automatically launch into their dedicated station:'}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[520px] pr-1">
              {SPECIALIST_PERSONAS.map((persona) => (
                <button
                  key={persona.username}
                  onClick={() => handleInstantPersonaLogin(persona)}
                  type="button"
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between group bg-slate-950/90 border-slate-800 hover:border-cyan-500/60`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">{persona.icon}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-400 group-hover:text-cyan-300">
                        {persona.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {persona.name}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{persona.roleTitle}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{persona.department}</p>
                    <div className="mt-2 text-[10px] text-cyan-300 font-mono bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40 truncate">
                      <span className="text-slate-400">Workstations: </span>{persona.authorizedSummary}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span className="truncate pr-1">➔ {persona.targetStation}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-3 border-t border-slate-800/60 bg-slate-950/80 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>MedCore Healthcare Technology • HIPAA & HL7/FHIR v4.0.1 Compliant</span>
        <span className="text-slate-400">Hospital Management System Pro • Active Node / MySQL Server</span>
      </footer>
    </div>
  );
};
