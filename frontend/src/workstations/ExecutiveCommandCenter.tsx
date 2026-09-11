import React from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { TelemetryTicker } from '../components/layout/TelemetryTicker';

export const ExecutiveCommandCenter: React.FC = () => {
  const {
    telemetry,
    setAlarmModalOpen,
    setActiveWorkstation,
    activeLanguage,
    beds,
    emergencyCases,
  } = useHospitalStore();

  const occupiedCount = beds.filter((b) => b.status === 'occupied').length || 38;
  const totalBedsCount = beds.length || 45;
  const occupancyPct = Math.round((occupiedCount / totalBedsCount) * 100);

  const wardCapacity = telemetry?.wardCapacityMatrix || [
    { ward: 'Intensive Critical Care (ICU)', occupied: 18, total: 20, pct: 90, status: 'HIGH' },
    { ward: 'Cardiology Telemetry Ward', occupied: 24, total: 28, pct: 86, status: 'ELEVATED' },
    { ward: 'Post-Surgical Inpatient Ward', occupied: 32, total: 40, pct: 80, status: 'NOMINAL' },
    { ward: 'Pediatric Care Pavilion', occupied: 14, total: 25, pct: 56, status: 'STABLE' },
  ];

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Dynamic Operational Telemetry Ticker */}
      <TelemetryTicker />

      <div className="px-6 py-5">
        {/* Command Center Header Controls */}
        <div className="py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
                {activeLanguage === 'ar' ? 'جناح العمليات التنفيذية' : 'Executive Operations Suite'}
              </span>
              <span className="w-1 h-1 rounded-full bg-secondary"></span>
              <span className="text-[11px] font-mono text-primary font-bold">
                {activeLanguage === 'ar' ? 'القياس عن بُعد قيد التشغيل المباشر' : 'REAL-TIME TELEMETRY RUNNING'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
              {activeLanguage === 'ar'
                ? 'مركز القيادة التنفيذية ومصفوفة اللوجستيات الطبية'
                : 'Hospital Executive Command & Logistics Matrix'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveWorkstation('admissions-and-beds')}
              className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filter Wards</span>
            </button>
            <button
              onClick={() => alert('Shift Audit Export generated: HL7-DISPATCH-AUDIT.csv')}
              className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Shift Audit</span>
            </button>
            <button
              onClick={() => setAlarmModalOpen(true)}
              className="px-3.5 py-1.5 rounded bg-error hover:bg-on-error-container text-on-error font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
              <span>CODE BLUE / TRAUMA DISPATCH</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Top Executive KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {/* Active Patients KPI */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">Active In-Care</span>
              <span className="material-symbols-outlined text-[18px] text-primary">patient_list</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">1,428</span>
                <span className="text-[10px] font-mono text-emerald-600 bg-surface-container-low px-1.5 py-0.5 rounded font-bold">
                  +4.2%
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Admitted 24h: 184</span>
                <span>Discharged: 142</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Emergency ED Load KPI */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">Emergency ED Load</span>
              <span className="material-symbols-outlined text-[18px] text-error">emergency</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">
                  {emergencyCases.length > 0 ? emergencyCases.length : 42}
                </span>
                <span className="text-[10px] font-mono text-error bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
                  4 LEVEL 1
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Triage Backlog: 8</span>
                <span>Avg Wait: 14m</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-error h-full" style={{ width: '84%' }}></div>
            </div>
          </div>

          {/* Bed Occupancy KPI */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">Bed Occupancy</span>
              <span className="material-symbols-outlined text-[18px] text-primary">hotel</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">{occupancyPct}%</span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                  HIGH
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Occupied: {occupiedCount}/{totalBedsCount}</span>
                <span>Cleaning: 3</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${occupancyPct}%` }}></div>
            </div>
          </div>

          {/* OR Utilization KPI */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">OR Utilization</span>
              <span className="material-symbols-outlined text-[18px] text-primary">vital_signs</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">91%</span>
                <span className="text-[10px] font-mono text-error bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
                  CRITICAL
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Active ORs: 3/4</span>
                <span>Trauma Bypass: 1</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary-container h-full" style={{ width: '91%' }}></div>
            </div>
          </div>

          {/* Daily Revenue KPI */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">Gross Revenue Today</span>
              <span className="material-symbols-outlined text-[18px] text-emerald-600">payments</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">$184.5K</span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  +12.8%
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Target: $165K</span>
                <span>Direct: $82.4K</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Pending Discharges */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-secondary uppercase font-medium">Pending Discharges</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">output</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">18</span>
                <span className="text-[10px] font-mono text-secondary bg-surface-container-low px-1.5 py-0.5 rounded">
                  PLANNED
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-secondary text-[11px]">
                <span>Pharm Clear: 12</span>
                <span>Billing Clr: 6</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Capacity Matrix & High-Acuity Trauma Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ward Capacity Matrix (2 cols) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Real-Time Ward Capacity Matrix</h3>
                <p className="text-xs text-secondary">Live telemetry across inpatient pavilions and critical units</p>
              </div>
              <button
                onClick={() => setActiveWorkstation('admissions-and-beds')}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Bed Rack</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-4">
              {wardCapacity.map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-surface border border-outline-variant/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-on-surface">{item.ward}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-secondary">
                        {item.occupied} / {item.total} beds
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          item.pct >= 90
                            ? 'bg-error-container text-on-error-container'
                            : item.pct >= 80
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {item.pct}% {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.pct >= 90 ? 'bg-error' : item.pct >= 80 ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Trauma Stream & Quick Workstation Launchers */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-on-surface">Active Trauma Telemetry</h3>
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-error-container/30 border border-error/20 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-error">
                    <span>OR-3 TRAUMA BYPASS</span>
                    <span>ACTIVE</span>
                  </div>
                  <p className="mt-1 text-on-surface text-[11px] leading-relaxed">
                    Emergency laparotomy prepared for MedEvac trauma male. Lead: Dr. Elena Rostova.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface border border-outline-variant/30 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-primary">
                    <span>CATH LAB 1</span>
                    <span>14:00 CASE</span>
                  </div>
                  <p className="mt-1 text-secondary text-[11px]">
                    STEMI alert primary PCI completed. Patient transferred to CCU Bed 01.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface border border-outline-variant/30 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-secondary">
                    <span>PHARMACY FEFO ALERT</span>
                    <span>2 CRITICAL</span>
                  </div>
                  <p className="mt-1 text-secondary text-[11px]">
                    Ceftriaxone lot LOT-2026-1940 near expiration threshold. Auto-FEFO active.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Workstation Shortcuts */}
            <div className="mt-6 pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveWorkstation('emergency-ed-board')}
                className="p-2 text-xs font-semibold rounded-lg bg-error-container text-on-error-container hover:bg-error/20 text-center transition-colors"
              >
                Launch ED Board
              </button>
              <button
                onClick={() => setActiveWorkstation('doctor-clinic')}
                className="p-2 text-xs font-semibold rounded-lg bg-primary-container text-on-primary hover:bg-primary/90 text-center transition-colors"
              >
                Doctor EHR
              </button>
              <button
                onClick={() => setActiveWorkstation('pharmacy-and-fefo-stock')}
                className="p-2 text-xs font-semibold rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-center transition-colors"
              >
                FEFO Pharmacy
              </button>
              <button
                onClick={() => setActiveWorkstation('billing-and-cashier')}
                className="p-2 text-xs font-semibold rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-center transition-colors"
              >
                Cashier POS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
