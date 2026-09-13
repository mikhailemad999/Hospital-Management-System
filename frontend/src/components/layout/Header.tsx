import React, { useState } from 'react';
import { useHospitalStore } from '../../store/useHospitalStore';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    activeBranch,
    setActiveBranch,
    activeLanguage,
    toggleLanguage,
    setSearchModalOpen,
    setAlarmModalOpen,
    isAlarmActive,
    setLoginModalOpen,
    logout,
  } = useHospitalStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const availableRoles: { role: UserRole; title: string }[] = [
    { role: 'super_admin', title: 'Dr. Sarah Vance, MD (Super Admin)' },
    { role: 'doctor', title: 'Dr. Marcus Brody, MD (Cardiologist)' },
    { role: 'senior_doctor', title: 'Dr. Elena Rostova, MD (Chief Surgeon)' },
    { role: 'nurse', title: 'Nurse Emily Chen, RN (Charge Nurse)' },
    { role: 'emergency_staff', title: 'Dr. Robert Hayes, MD (ER Director)' },
    { role: 'pharmacist', title: 'Pharm. Tariq Al-Mansoor (Chief Pharmacist)' },
    { role: 'accountant', title: 'David Keller, CPA (Finance)' },
    { role: 'receptionist', title: 'Maya Lin (Admissions / Triage)' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/40 z-40 flex items-center justify-between px-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Left side: Branch & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-3xl">
        {/* Branch Selector */}
        <div className="relative">
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface transition-colors shrink-0 text-left text-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">domain</span>
            <span className="font-semibold truncate max-w-[190px]">{activeBranch}</span>
            <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
          </button>

          {branchDropdownOpen && (
            <div className="absolute top-10 left-0 w-64 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-lg py-1 z-50">
              {['Metro Central - Main Hospital', 'East Wing Specialty Pavilion'].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setActiveBranch(b);
                    setBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-container-low flex items-center justify-between ${
                    activeBranch === b ? 'font-semibold text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <span>{b}</span>
                  {activeBranch === b && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
            search
          </span>
          <input
            onClick={() => setSearchModalOpen(true)}
            readOnly
            className="w-full pl-8 pr-12 py-1.5 text-xs rounded-lg border border-outline-variant/60 bg-surface hover:border-primary cursor-pointer text-on-surface transition-all placeholder:text-secondary/70"
            placeholder={
              activeLanguage === 'ar'
                ? "ابحث برقم السجل الطبي MRN، الهوية الوطنية، الاسم (اضغط '/' أو ⌘K)..."
                : "Search Patient by MRN, National ID, Name, Staff Code (Press '/' to focus)..."
            }
            type="text"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-outline-variant/50 text-[10px] font-mono text-secondary bg-surface-container-low">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right side: Trauma badge, Staff profile, Language toggle, Notifications */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Critical Alert Pill */}
        <button
          onClick={() => setAlarmModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            isAlarmActive
              ? 'bg-error text-on-error border-error animate-bounce shadow-md font-bold'
              : 'bg-error-container text-on-error-container border-error/30 hover:bg-error-container/80'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-error">campaign</span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wide">
            Trauma Code Red: OR-3
          </span>
        </button>

        {/* Staff Pill & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">badge</span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-on-surface leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-secondary font-mono leading-tight">
                {currentUser.department}
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-1"></span>
            <span className="material-symbols-outlined text-[14px] text-secondary">expand_more</span>
          </button>

          {roleDropdownOpen && (
            <div className="absolute top-12 right-0 w-72 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-secondary border-b border-outline-variant/30">
                Switch Operational Persona
              </div>
              {availableRoles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-container-low flex items-center justify-between ${
                    currentUser.role === item.role ? 'bg-primary-container/10 font-bold text-primary' : 'text-on-surface'
                  }`}
                >
                  <span>{item.title}</span>
                  {currentUser.role === item.role && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
              ))}
              <div className="pt-1.5 mt-1 border-t border-outline-variant/30 px-2 space-y-1">
                <button
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full text-center py-1.5 text-xs font-bold rounded bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                  <span>Switch Station Persona</span>
                </button>
                <button
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-1.5 text-xs font-bold rounded bg-error-container/20 text-error hover:bg-error-container/40 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out / Lock</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lock / Sign Out Button */}
        <button
          onClick={logout}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-outline-variant/60 hover:border-error/50 hover:bg-error-container/20 text-on-surface text-[11px] font-semibold transition-all"
          title="Lock Workstation & Sign Out to Clinical Login Gate"
        >
          <span className="material-symbols-outlined text-[15px] text-error">lock</span>
          <span>Lock Station</span>
        </button>

        {/* Language Switcher (AR/EN) */}
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant text-[11px] font-mono font-bold transition-colors"
          title="Toggle Arabic / English (RTL layout)"
          type="button"
        >
          {activeLanguage === 'en' ? 'العربية (AR)' : 'ENGLISH (EN)'}
        </button>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
        </button>

        {/* User Avatar */}
        <button
          onClick={() => setLoginModalOpen(true)}
          className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-primary transition-all"
          title="User Account & Login"
        >
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
        </button>
      </div>
    </header>
  );
};
