import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { EmergencyCase, TriageUrgency } from '../types';

export const EmergencyTraumaBoard: React.FC = () => {
  const {
    emergencyCases,
    addEmergencyCase,
    updateEmergencyStatus,
    setAlarmModalOpen,
    activeLanguage,
  } = useHospitalStore();

  const [rapidIntakeModalOpen, setRapidIntakeModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('M');
  const [acuity, setAcuity] = useState<TriageUrgency>(1);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [bay, setBay] = useState('Resuscitation Bay 1');

  const l1Cases = emergencyCases.filter((c) => c.acuityLevel === 1);
  const l2Cases = emergencyCases.filter((c) => c.acuityLevel === 2);
  const l3Cases = emergencyCases.filter((c) => c.acuityLevel === 3);
  const l45Cases = emergencyCases.filter((c) => c.acuityLevel >= 4);

  const handleCreateIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmergencyCase({
      patientName: patientName || 'Trauma Walk-in / MedEvac',
      age,
      gender,
      acuityLevel: acuity,
      chiefComplaint: chiefComplaint || 'Acute traumatic injury or respiratory distress',
      bay,
      vitalsHr: 120,
      vitalsBp: '90/60',
      vitalsSpo2: 92,
      vitalsTemp: 37.0,
      vitalsRr: 24,
      status: 'Physician Exam',
    });
    setRapidIntakeModalOpen(false);
    setPatientName('');
    setChiefComplaint('');
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* EMERGENCY STAT & COMMAND HEAD */}
      <section className="w-full bg-surface-container-lowest shadow-sm rounded-xl p-4 mb-5 border border-outline-variant/30">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* ED Capacity & Metric Telemetry */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary-container text-on-primary font-bold text-lg">
                {emergencyCases.length}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-on-surface">Census / Cap</span>
                  <span className="text-[10px] font-mono text-secondary uppercase bg-surface-container px-1.5 py-0.5 rounded font-bold">
                    84% Load
                  </span>
                </div>
                <span className="text-[11px] text-secondary">
                  {emergencyCases.length} active / 45 max licensed beds
                </span>
              </div>
            </div>

            {/* Triage Urgency Distribution Spectrum */}
            <div className="flex items-center gap-1.5 bg-surface-container-low/70 p-1.5 rounded-lg border border-outline-variant/20 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container text-on-error-container font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                <span>L1: {l1Cases.length} RESUS</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-950 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                <span>L2: {l2Cases.length} EMERG</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-100 text-amber-950 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>L3: {l3Cases.length} URG</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-950 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>L4: {l45Cases.filter(c => c.acuityLevel === 4).length} LESS</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>L5: {l45Cases.filter(c => c.acuityLevel === 5).length} NON</span>
              </div>
            </div>

            {/* KPI Timing */}
            <div className="hidden md:flex items-center gap-5 pl-2 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-secondary uppercase">Door-to-Triage</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-bold text-primary text-sm">4.8</span>
                  <span className="text-[10px] text-secondary">min</span>
                  <span className="material-symbols-outlined text-[14px] text-emerald-600 ml-0.5">trending_down</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-secondary uppercase">Door-to-Physician</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-bold text-on-surface text-sm">16.2</span>
                  <span className="text-[10px] text-secondary">min</span>
                  <span className="text-[9px] font-mono text-secondary bg-surface-container px-1 rounded">Target: &lt;20m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Command Actions */}
          <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end">
            <button
              onClick={() => setRapidIntakeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors font-semibold text-xs shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Rapid Intake (Temp ID)</span>
            </button>
            <button
              onClick={() => setAlarmModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-error text-on-error hover:bg-on-error-container transition-all shadow-md active:scale-95 animate-pulse text-xs font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
              <span>ACTIVATE CODE TRAUMA</span>
            </button>
          </div>
        </div>
      </section>

      {/* MULTI-COLUMN LIVE ED TRIAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 items-start">
        {/* Column 1: LEVEL 1 RESUSCITATION */}
        <div className="bg-surface-container-lowest rounded-xl border-t-4 border-t-error border-x border-b border-outline-variant/30 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              <h3 className="font-bold text-xs text-error font-mono tracking-wide">LEVEL 1 • RESUSCITATION</h3>
            </div>
            <span className="font-mono text-xs font-bold text-error bg-error-container px-1.5 py-0.5 rounded">
              {l1Cases.length} Cases
            </span>
          </div>

          <div className="space-y-3">
            {l1Cases.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-error-container/20 border border-error/30 hover:border-error transition-all shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">{c.patientName}</span>
                  <span className="font-mono text-[10px] text-error font-bold bg-error-container px-1.5 py-0.5 rounded">
                    {c.bay}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {c.chiefComplaint}
                </p>
                {/* Vitals snapshot */}
                <div className="grid grid-cols-4 gap-1 p-1.5 bg-surface-container-lowest/80 rounded border border-outline-variant/30 text-[10px] font-mono">
                  <div>HR: <span className="font-bold text-error">{c.vitalsHr}</span></div>
                  <div>BP: <span className="font-bold text-on-surface">{c.vitalsBp}</span></div>
                  <div>SpO2: <span className="font-bold text-error">{c.vitalsSpo2}%</span></div>
                  <div>RR: <span className="font-bold">{c.vitalsRr}</span></div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px]">
                  <span className="font-mono text-secondary">Arr: {c.arrivalTime}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateEmergencyStatus(c.id, 'OR Bypass', 'OR-3 Trauma')}
                      className="px-2 py-0.5 rounded bg-error text-on-error font-bold hover:bg-error/90"
                    >
                      OR Bypass
                    </button>
                    <button
                      onClick={() => updateEmergencyStatus(c.id, 'Admitted', 'ICU-B01')}
                      className="px-2 py-0.5 rounded bg-primary text-on-primary font-semibold hover:bg-primary/90"
                    >
                      Admit ICU
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: LEVEL 2 EMERGENT */}
        <div className="bg-surface-container-lowest rounded-xl border-t-4 border-t-orange-600 border-x border-b border-outline-variant/30 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              <h3 className="font-bold text-xs text-orange-950 font-mono tracking-wide">LEVEL 2 • EMERGENT</h3>
            </div>
            <span className="font-mono text-xs font-bold text-orange-900 bg-orange-100 px-1.5 py-0.5 rounded">
              {l2Cases.length} Cases
            </span>
          </div>

          <div className="space-y-3">
            {l2Cases.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-orange-50/50 border border-orange-200 hover:border-orange-400 transition-all shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">{c.patientName}</span>
                  <span className="font-mono text-[10px] text-orange-900 font-bold bg-orange-100 px-1.5 py-0.5 rounded">
                    {c.bay}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {c.chiefComplaint}
                </p>
                <div className="grid grid-cols-4 gap-1 p-1.5 bg-surface-container-lowest rounded border border-outline-variant/30 text-[10px] font-mono">
                  <div>HR: <span className="font-bold text-orange-700">{c.vitalsHr}</span></div>
                  <div>BP: <span className="font-bold">{c.vitalsBp}</span></div>
                  <div>SpO2: <span className="font-bold">{c.vitalsSpo2}%</span></div>
                  <div>RR: <span className="font-bold">{c.vitalsRr}</span></div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px]">
                  <span className="font-mono text-secondary">{c.status}</span>
                  <button
                    onClick={() => updateEmergencyStatus(c.id, 'Diagnostics')}
                    className="px-2 py-0.5 rounded bg-surface-container text-primary font-semibold hover:bg-surface-container-high"
                  >
                    Order Cath / CT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: LEVEL 3 URGENT */}
        <div className="bg-surface-container-lowest rounded-xl border-t-4 border-t-amber-500 border-x border-b border-outline-variant/30 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-xs text-amber-950 font-mono tracking-wide">LEVEL 3 • URGENT</h3>
            </div>
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
              {l3Cases.length} Cases
            </span>
          </div>

          <div className="space-y-3">
            {l3Cases.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-amber-50/40 border border-amber-200 hover:border-amber-400 transition-all shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">{c.patientName}</span>
                  <span className="font-mono text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                    {c.bay}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {c.chiefComplaint}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px]">
                  <span className="font-mono text-secondary">{c.status}</span>
                  <button
                    onClick={() => updateEmergencyStatus(c.id, 'Discharged')}
                    className="px-2 py-0.5 rounded bg-surface-container text-secondary hover:text-on-surface font-semibold"
                  >
                    Discharge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: LEVEL 4 & 5 LESS/NON-URGENT */}
        <div className="bg-surface-container-lowest rounded-xl border-t-4 border-t-emerald-600 border-x border-b border-outline-variant/30 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h3 className="font-bold text-xs text-emerald-950 font-mono tracking-wide">LEVEL 4-5 • FAST TRACK</h3>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">
              {l45Cases.length} Cases
            </span>
          </div>

          <div className="space-y-3">
            {l45Cases.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-surface border border-outline-variant/30 hover:border-outline-variant transition-all shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">{c.patientName}</span>
                  <span className="font-mono text-[10px] text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                    {c.bay}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2">
                  {c.chiefComplaint}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px]">
                  <span className="font-mono text-secondary">{c.status}</span>
                  <button
                    onClick={() => updateEmergencyStatus(c.id, 'Discharged')}
                    className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rapid Intake Modal */}
      {rapidIntakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden">
            <div className="p-4 bg-primary-container text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <h3 className="font-bold text-sm">Rapid Emergency Patient Intake</h3>
              </div>
              <button onClick={() => setRapidIntakeModalOpen(false)} className="text-on-primary/80 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateIntake} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Patient Name or Temp ID</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Unidentified Trauma Male / Jane Doe"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Triage Acuity</label>
                  <select
                    value={acuity}
                    onChange={(e) => setAcuity(Number(e.target.value) as TriageUrgency)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary font-bold"
                  >
                    <option value={1}>L1 - Resuscitation (STAT)</option>
                    <option value={2}>L2 - Emergent</option>
                    <option value={3}>L3 - Urgent</option>
                    <option value={4}>L4 - Less Urgent</option>
                    <option value={5}>L5 - Non Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Assigned Trauma Bay</label>
                <select
                  value={bay}
                  onChange={(e) => setBay(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
                >
                  <option value="Resuscitation Bay 1">Resuscitation Bay 1</option>
                  <option value="Resuscitation Bay 2">Resuscitation Bay 2</option>
                  <option value="Trauma Bay 3">Trauma Bay 3</option>
                  <option value="Trauma Bay 4">Trauma Bay 4</option>
                  <option value="Acute Care Bay 5">Acute Care Bay 5</option>
                  <option value="Fast Track 1">Fast Track 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Chief Complaint & Mechanism</label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows={3}
                  placeholder="Clinical presentation, injury description, vital signs snapshot..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setRapidIntakeModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
                >
                  Dispatch to Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
