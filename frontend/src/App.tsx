import React, { useEffect } from 'react';
import { useHospitalStore } from './store/useHospitalStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SearchModal } from './components/common/SearchModal';
import { TraumaAlarmModal } from './components/common/TraumaAlarmModal';
import { LoginModal } from './components/common/LoginModal';
import { LoginPage } from './components/auth/LoginPage';

// Workstations
import { ExecutiveCommandCenter } from './workstations/ExecutiveCommandCenter';
import { EmergencyTraumaBoard } from './workstations/EmergencyTraumaBoard';
import { MasterPatientIndex } from './workstations/MasterPatientIndex';
import { OutpatientRegistration } from './workstations/OutpatientRegistration';
import { InpatientWardCensus } from './workstations/InpatientWardCensus';
import { DoctorClinicalWorkstation } from './workstations/DoctorClinicalWorkstation';
import { BedsideNursingMAR } from './workstations/BedsideNursingMAR';
import { OperatingTheatersOR } from './workstations/OperatingTheatersOR';
import { PharmacyFEFOInventory } from './workstations/PharmacyFEFOInventory';
import { LaboratoryDiagnostics } from './workstations/LaboratoryDiagnostics';
import { RadiologyPACSReporting } from './workstations/RadiologyPACSReporting';
import { BillingCashierBalancing } from './workstations/BillingCashierBalancing';
import { PayrollDoctorCommissions } from './workstations/PayrollDoctorCommissions';
import { StaffAttendanceRoster } from './workstations/StaffAttendanceRoster';
import { SecurityAuditTrail } from './workstations/SecurityAuditTrail';

export const App: React.FC = () => {
  const {
    isAuthenticated,
    activeWorkstation,
    activeLanguage,
    setSearchModalOpen,
    fetchInitialData,
    authNotification,
    setAuthNotification,
  } = useHospitalStore();

  useEffect(() => {
    fetchInitialData();

    // Global keyboard shortcut: '/' or '⌘K'
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (authNotification) {
      const timer = setTimeout(() => {
        setAuthNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authNotification]);

  const renderWorkstation = () => {
    switch (activeWorkstation) {
      case 'admin-dashboard':
        return <ExecutiveCommandCenter />;
      case 'emergency-ed-board':
        return <EmergencyTraumaBoard />;
      case 'master-patient-index':
        return <MasterPatientIndex />;
      case 'patient-registration':
        return <OutpatientRegistration />;
      case 'admissions-and-beds':
        return <InpatientWardCensus />;
      case 'doctor-clinic':
        return <DoctorClinicalWorkstation />;
      case 'nursing-and-mar':
        return <BedsideNursingMAR />;
      case 'operating-theaters':
        return <OperatingTheatersOR />;
      case 'pharmacy-and-fefo-stock':
        return <PharmacyFEFOInventory />;
      case 'laboratory':
        return <LaboratoryDiagnostics />;
      case 'radiology':
        return <RadiologyPACSReporting />;
      case 'billing-and-cashier':
        return <BillingCashierBalancing />;
      case 'payroll-and-commissions':
        return <PayrollDoctorCommissions />;
      case 'staff-rostering':
        return <StaffAttendanceRoster />;
      case 'audit-trail':
        return <SecurityAuditTrail />;
      default:
        return <ExecutiveCommandCenter />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div
      dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-surface font-sans text-on-surface antialiased ${
        activeLanguage === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={activeLanguage === 'ar' ? 'pr-64' : 'pl-64'}>
        {/* Top Header */}
        <Header />

        {/* Auth / Role Switch Banner Toast */}
        {authNotification && (
          <div className="fixed top-16 right-6 z-50 animate-bounce">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary text-on-primary shadow-xl border border-on-primary/20 text-xs">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="font-semibold">{authNotification}</span>
              <button
                onClick={() => setAuthNotification(null)}
                className="ml-2 hover:opacity-75"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Workstation View Container */}
        <main className="w-full pt-14 bg-surface min-h-screen">
          {renderWorkstation()}
        </main>
      </div>

      {/* Interactive Modals */}
      <SearchModal />
      <TraumaAlarmModal />
      <LoginModal />
    </div>
  );
};
