import React from 'react';
import { useHospitalStore, ROLE_DEFAULT_WORKSTATION } from '../../store/useHospitalStore';
import { WorkstationId } from '../../types';

interface NavItem {
  id: WorkstationId;
  label: string;
  icon: string;
  badge?: string;
  isError?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeWorkstation,
    setActiveWorkstation,
    activeLanguage,
    currentUser,
    setLoginModalOpen,
    logout,
  } = useHospitalStore();

  const primaryStation = ROLE_DEFAULT_WORKSTATION[currentUser.role] || 'admin-dashboard';

  const navGroups: NavGroup[] = [
    {
      title: activeLanguage === 'ar' ? '١. النظرة العامة والقيادة' : '1. Overview & Command',
      items: [
        { id: 'admin-dashboard', label: activeLanguage === 'ar' ? 'لوحة قيادة العمليات' : 'Admin Dashboard', icon: 'monitoring' },
        { id: 'emergency-ed-board', label: activeLanguage === 'ar' ? 'طوارئ والحوادث' : 'Emergency ED Board', icon: 'e911_emergency', isError: true },
      ],
    },
    {
      title: activeLanguage === 'ar' ? '٢. إدارة المرضى' : '2. Patient Management',
      items: [
        { id: 'master-patient-index', label: activeLanguage === 'ar' ? 'سجل المرضى الرئيسي' : 'Master Patient Index', icon: 'badge' },
        { id: 'patient-registration', label: activeLanguage === 'ar' ? 'الاستقبال والتذاكر' : 'Registration & Queue', icon: 'person_add' },
        { id: 'admissions-and-beds', label: activeLanguage === 'ar' ? 'التنويم والأسرة' : 'Admissions & Beds', icon: 'hotel' },
      ],
    },
    {
      title: activeLanguage === 'ar' ? '٣. محطات الأطباء والتمريض' : '3. Clinical Workstations',
      items: [
        { id: 'doctor-clinic', label: activeLanguage === 'ar' ? 'عيادة الطبيب والسجل الطبي' : 'Doctor EHR Clinic', icon: 'stethoscope' },
        { id: 'nursing-and-mar', label: activeLanguage === 'ar' ? 'التمريض وسجل الدواء MAR' : 'Nursing & MAR', icon: 'medication' },
        { id: 'operating-theaters', label: activeLanguage === 'ar' ? 'غرف العمليات الجراحية' : 'Operating Theaters / OR', icon: 'vital_signs' },
      ],
    },
    {
      title: activeLanguage === 'ar' ? '٤. التشخيص واللوجستيات' : '4. Diagnostics & Logistics',
      items: [
        { id: 'pharmacy-and-fefo-stock', label: activeLanguage === 'ar' ? 'الصيدلية ومخزون FEFO' : 'Pharmacy & FEFO Stock', icon: 'prescriptions' },
        { id: 'laboratory', label: activeLanguage === 'ar' ? 'المختبر والتحاليل' : 'Laboratory', icon: 'science' },
        { id: 'radiology', label: activeLanguage === 'ar' ? 'الأشعة والتصوير PACS' : 'Radiology & PACS', icon: 'radiology' },
      ],
    },
    {
      title: activeLanguage === 'ar' ? '٥. المالية والحوكمة' : '5. Finance & Governance',
      items: [
        { id: 'billing-and-cashier', label: activeLanguage === 'ar' ? 'الفواتير ونقطة البيع' : 'Billing & Cashier', icon: 'receipt_long' },
        { id: 'payroll-and-commissions', label: activeLanguage === 'ar' ? 'الرواتب وعمولات الأطباء' : 'Payroll & Commissions', icon: 'payments' },
        { id: 'staff-rostering', label: activeLanguage === 'ar' ? 'حضور الموظفين والبصمة' : 'Staff Rostering', icon: 'badge' },
        { id: 'audit-trail', label: activeLanguage === 'ar' ? 'سجل التدقيق والأمان' : 'Security Audit Trail', icon: 'verified_user' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 h-full w-64 bg-surface-container-lowest border-outline-variant/40 z-50 flex flex-col justify-between select-none shadow-[0_1px_8px_rgba(0,0,0,0.02)] ${
        activeLanguage === 'ar' ? 'right-0 border-l' : 'left-0 border-r'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-3 border-b border-outline-variant/30 shrink-0 bg-surface-container-lowest">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px]">local_hospital</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-primary tracking-tight font-semibold">MedCore EHR</span>
            <span className="font-label-code-sm text-[10px] text-secondary uppercase tracking-wider font-mono">Enterprise v4.8</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-2.5 pb-1 text-[11px] font-mono text-secondary uppercase tracking-wider font-medium">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const isActive = activeWorkstation === item.id;
                  const isPrimary = item.id === primaryStation;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveWorkstation(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[19px] shrink-0 ${
                            item.isError && !isActive ? 'text-error' : ''
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-[13px] truncate">{item.label}</span>
                      </div>
                      {isPrimary && (
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isActive
                              ? 'bg-on-primary/20 text-on-primary'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {activeLanguage === 'ar' ? 'مهمتك' : 'DUTY'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Active Staff Card & Fast Switch */}
        <div className="p-3 border-t border-outline-variant/30 shrink-0 bg-surface-container-low/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.fullName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-secondary font-mono truncate">{currentUser.badge}</p>
              </div>
            </div>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="p-1 rounded hover:bg-surface-container text-primary transition-colors"
              title="Switch Staff Persona / Login"
            >
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-secondary pt-1 border-t border-outline-variant/20 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-on-surface-variant font-medium">SYSTEM ONLINE</span>
            </div>
            <span className="text-secondary">HL7/FHIR v4</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
