import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { Patient } from '../types';

export const MasterPatientIndex: React.FC = () => {
  const { patients, addPatient, activeLanguage } = useHospitalStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [dob, setDob] = useState('1985-05-15');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [bloodType, setBloodType] = useState('O+');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [allergies, setAllergies] = useState('None Known');
  const [chronicConditions, setChronicConditions] = useState('None');

  const filteredPatients = patients.filter(
    (p) =>
      p.mrn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.nationalId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activePatient = selectedPatient || (patients.length > 0 ? patients[0] : null);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPatient({
      firstName,
      lastName,
      nationalId,
      dateOfBirth: dob,
      age: 40,
      gender,
      bloodType,
      phone,
      allergies: allergies.split(',').map((s) => s.trim()),
      chronicConditions: chronicConditions.split(',').map((s) => s.trim()),
      insurance: { provider: 'MetLife Health', policyNumber: 'POL-AUTO-88', coveragePct: 80 },
      balance: 0,
      status: 'Outpatient',
    });
    setNewPatientModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Clinical Archive & Registry
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">HL7 FHIR v4.0.1</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Master Patient Index & Clinical Records Archive
          </h1>
        </div>

        <button
          onClick={() => setNewPatientModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors shadow-sm self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Patient Table (2 Columns) */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          {/* Table Search & Filter Bar */}
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between gap-4 bg-surface-container-low/40">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
                search
              </span>
              <input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by MRN, National ID, Patient Name..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-outline-variant/50 bg-surface text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div className="text-xs font-mono text-secondary">
              Total Records: <span className="font-bold text-on-surface">{patients.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                  <th className="py-2.5 px-4">Patient MRN & Name</th>
                  <th className="py-2.5 px-3">National ID</th>
                  <th className="py-2.5 px-3">Demographics</th>
                  <th className="py-2.5 px-3">Allergies</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredPatients.map((p) => {
                  const isSelected = activePatient?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary-container/10 font-semibold' : 'hover:bg-surface-container-low/50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {p.firstName[0]}
                            {p.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-xs">
                              {p.firstName} {p.lastName}
                            </p>
                            <span className="text-[10px] font-mono text-primary font-semibold">{p.mrn}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-secondary text-[11px]">{p.nationalId}</td>
                      <td className="py-3 px-3 text-secondary text-[11px]">
                        {p.age}y • {p.gender === 'M' ? 'Male' : 'Female'} • Blood: <span className="font-bold text-on-surface">{p.bloodType}</span>
                      </td>
                      <td className="py-3 px-3">
                        {p.allergies && p.allergies.length > 0 && p.allergies[0] !== 'None Known (NKDA)' ? (
                          <span className="px-2 py-0.5 rounded bg-error-container text-error text-[10px] font-mono font-bold">
                            {Array.isArray(p.allergies) ? p.allergies[0] : p.allergies}
                          </span>
                        ) : (
                          <span className="text-secondary text-[11px]">NKDA</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'Inpatient'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs font-semibold">
                        {Number(p.balance || 0) > 0 ? (
                          <span className="text-error">${Number(p.balance || 0).toFixed(2)}</span>
                        ) : (
                          <span className="text-emerald-700">$0.00</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Profile Drawer / Details Card (1 Column) */}
        {activePatient && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] font-mono uppercase text-secondary font-bold">MASTER PATIENT RECORD</span>
                <h2 className="text-lg font-bold text-on-surface">
                  {activePatient.firstName} {activePatient.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                    {activePatient.mrn}
                  </span>
                  <span className="text-xs text-secondary">Nat ID: {activePatient.nationalId}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-xs font-bold">
                {activePatient.status}
              </span>
            </div>

            {/* Allergies Warning Banner */}
            <div className="p-3 rounded-lg bg-error-container/30 border border-error/30 text-xs">
              <div className="flex items-center gap-1.5 text-error font-bold font-mono">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>DOCUMENTED ALLERGIES & CONTRAINDICATIONS</span>
              </div>
              <p className="mt-1 text-on-surface font-semibold text-[11px]">
                {Array.isArray(activePatient.allergies) ? activePatient.allergies.join(', ') : activePatient.allergies || 'None Known'}
              </p>
            </div>

            {/* Clinical Conditions */}
            <div className="space-y-1 text-xs">
              <span className="font-mono text-[10px] text-secondary uppercase font-bold">CHRONIC CONDITIONS & DIAGNOSES</span>
              <p className="p-2.5 rounded-lg bg-surface border border-outline-variant/30 text-on-surface font-medium text-[11px] leading-relaxed">
                {Array.isArray(activePatient.chronicConditions)
                  ? activePatient.chronicConditions.join(' • ')
                  : activePatient.chronicConditions || 'No active chronic conditions documented'}
              </p>
            </div>

            {/* Inpatient details if admitted */}
            {activePatient.assignedBed && (
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase">CURRENT ASSIGNED BED</span>
                  <p className="font-bold text-primary mt-0.5">{activePatient.assignedBed}</p>
                </div>
                <span className="text-[11px] font-mono text-secondary">Admit: {activePatient.admissionDate}</span>
              </div>
            )}

            {/* Insurance & Financial Status */}
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-secondary uppercase font-bold">INSURANCE POLICY</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {activePatient.insurance?.coveragePct || 80}% COVERED
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-secondary">Carrier:</span>
                <span className="font-semibold text-on-surface">{activePatient.insurance?.provider}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-secondary">Policy Number:</span>
                <span className="font-mono text-on-surface">{activePatient.insurance?.policyNumber}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/20">
                <span className="text-secondary">Outstanding Balance:</span>
                <span className="font-mono font-bold text-error">${Number(activePatient.balance || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="p-3 rounded-lg bg-surface border border-outline-variant/30 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-secondary uppercase font-bold">EMERGENCY CONTACT</span>
              <p className="font-semibold text-on-surface text-[11px]">
                {activePatient.emergencyContact?.name} ({activePatient.emergencyContact?.relationship})
              </p>
              <p className="font-mono text-secondary text-[11px]">{activePatient.emergencyContact?.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {newPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden">
            <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
              <h3 className="font-bold text-sm">Register New Patient Record (MRN Auto-Gen)</h3>
              <button onClick={() => setNewPatientModalOpen(false)} className="text-on-primary/80 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">National ID / Passport</label>
                  <input
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="NAT-XXXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Blood Type</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Allergies (comma-separated)</label>
                <input
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Latex"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Chronic Medical Conditions</label>
                <input
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes Mellitus"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setNewPatientModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
                >
                  Save & Generate MRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
