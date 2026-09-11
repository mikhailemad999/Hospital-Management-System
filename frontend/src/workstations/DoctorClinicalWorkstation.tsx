import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';

export const DoctorClinicalWorkstation: React.FC = () => {
  const { patients, currentUser, batches } = useHospitalStore();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [chiefComplaint, setChiefComplaint] = useState('Recurrent substernal pressure and exertional dyspnea x 3 days.');
  const [assessment, setAssessment] = useState('Probable unstable angina vs acute coronary syndrome in high-risk patient.');
  const [icd10, setIcd10] = useState('I20.0');
  const [diagnosisDesc, setDiagnosisDesc] = useState('Unstable angina');

  // E-prescription state
  const [prescriptions, setPrescriptions] = useState<any[]>([
    { drug: 'Atorvastatin Calcium 20mg', dosage: '20mg', frequency: 'Once Daily at Bedtime', duration: '30 Days', qty: 30 },
    { drug: 'Enoxaparin Sodium 40mg', dosage: '40mg', frequency: 'Subcutaneous Q12H', duration: '5 Days', qty: 10 },
  ]);
  const [newDrug, setNewDrug] = useState(batches[0]?.name || 'Ceftriaxone Sodium 1g');
  const [newDosage, setNewDosage] = useState('1g');
  const [newFrequency, setNewFrequency] = useState('TID');
  const [newDuration, setNewDuration] = useState('7 Days');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddDrug = () => {
    setPrescriptions([...prescriptions, { drug: newDrug, dosage: newDosage, frequency: newFrequency, duration: newDuration, qty: 1 }]);
  };

  const handleFinalizeEncounter = () => {
    alert(`Encounter finalized for ${selectedPatient?.firstName} ${selectedPatient?.lastName}. Prescription dispatched to Central Pharmacy FEFO Queue!`);
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Clinical Encounter Suite & EHR
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">SOAP WORKSTATION</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Doctor Clinical Workstation & Electronic Health Record
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-secondary text-[10px] block font-mono">ATTENDING PHYSICIAN</span>
            <span className="font-bold text-on-surface">{currentUser.fullName}</span>
          </div>
          <button
            onClick={handleFinalizeEncounter}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Finalize & Sign Encounter</span>
          </button>
        </div>
      </div>

      {/* Patient Selector Strip */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 border border-outline-variant/30 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            {selectedPatient?.firstName[0]}
            {selectedPatient?.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPatient?.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="font-bold text-sm text-on-surface bg-transparent border-none outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.mrn})
                  </option>
                ))}
              </select>
              <span className="text-xs font-mono font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                {selectedPatient?.mrn}
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {selectedPatient?.age}y • {selectedPatient?.gender === 'M' ? 'Male' : 'Female'} • Blood: {selectedPatient?.bloodType} • Nat ID: {selectedPatient?.nationalId}
            </p>
          </div>
        </div>

        {/* Allergy Alert Pill */}
        <div className="flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-lg border border-error/20 text-xs">
          <span className="material-symbols-outlined text-[16px] text-error">warning</span>
          <span className="font-mono font-bold">ALLERGIES:</span>
          <span>
            {Array.isArray(selectedPatient?.allergies) ? selectedPatient.allergies.join(', ') : selectedPatient?.allergies}
          </span>
        </div>
      </div>

      {/* SOAP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Subjective & Objective */}
        <div className="space-y-5">
          {/* Subjective */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary uppercase">S • Subjective (Chief Complaint & HPI)</span>
              <span className="text-[10px] text-secondary font-mono">ICD-10 Mapped</span>
            </div>
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs rounded-lg border border-outline-variant/40 bg-surface outline-none focus:border-primary text-on-surface leading-relaxed"
            />
          </div>

          {/* Objective Examination & Vitals */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-primary uppercase block">O • Objective Examination</span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono p-2 rounded-lg bg-surface border border-outline-variant/30">
              <div>
                <span className="text-[10px] text-secondary block">HR</span>
                <span className="font-bold text-error">114 bpm</span>
              </div>
              <div>
                <span className="text-[10px] text-secondary block">BP</span>
                <span className="font-bold">168/104</span>
              </div>
              <div>
                <span className="text-[10px] text-secondary block">SpO2</span>
                <span className="font-bold text-error">91%</span>
              </div>
              <div>
                <span className="text-[10px] text-secondary block">TEMP</span>
                <span className="font-bold">38.6°C</span>
              </div>
            </div>
            <textarea
              defaultValue="Lungs: Bilateral bibasilar crackles noted. Heart: Regular rate, S1/S2 present, no audible friction rub. Abdomen: Soft, non-tender, nondistended. Extremities: 1+ bilateral lower extremity edema."
              rows={3}
              className="w-full p-3 text-xs rounded-lg border border-outline-variant/40 bg-surface outline-none focus:border-primary text-on-surface leading-relaxed"
            />
          </div>

          {/* Diagnostic Orders */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-primary uppercase block">STAT Diagnostic Orders</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded bg-surface border border-outline-variant/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span>Troponin I (High Sensitivity) STAT</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface border border-outline-variant/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span>12-Lead Electrocardiogram (ECG)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface border border-outline-variant/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span>CT Angiography Chest (PE Protocol)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-surface border border-outline-variant/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span>Comprehensive Metabolic Panel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Assessment, ICD-10 & e-Prescription */}
        <div className="space-y-5">
          {/* Assessment & ICD-10 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-primary uppercase block">A • Assessment & Clinical Diagnosis</span>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">ICD-10 Code</label>
                <select
                  value={icd10}
                  onChange={(e) => {
                    setIcd10(e.target.value);
                    const map: Record<string, string> = {
                      'I20.0': 'Unstable angina',
                      'I10': 'Essential (primary) hypertension',
                      'E11.9': 'Type 2 diabetes mellitus',
                      'I21.0': 'Acute STEMI of anterior wall',
                      'K35.80': 'Unspecified acute appendicitis',
                    };
                    setDiagnosisDesc(map[e.target.value] || 'Clinical Diagnosis');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface font-mono font-bold"
                >
                  <option value="I20.0">I20.0 - Unstable Angina</option>
                  <option value="I10">I10 - Essential Hypertension</option>
                  <option value="E11.9">E11.9 - Type 2 Diabetes</option>
                  <option value="I21.0">I21.0 - Acute STEMI</option>
                  <option value="K35.80">K35.80 - Acute Appendicitis</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-semibold mb-1">Diagnosis Description</label>
                <input
                  value={diagnosisDesc}
                  onChange={(e) => setDiagnosisDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface font-semibold"
                />
              </div>
            </div>
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs rounded-lg border border-outline-variant/40 bg-surface outline-none focus:border-primary text-on-surface"
            />
          </div>

          {/* e-Prescribing & Pharmacy Dispatch */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary uppercase">P • Plan & Electronic Prescription</span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                FEFO AUTO-DISPENSING LINKED
              </span>
            </div>

            {/* Prescribed Items Table */}
            <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-lg overflow-hidden text-xs">
              {prescriptions.map((p, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between bg-surface">
                  <div>
                    <span className="font-bold text-on-surface">{p.drug}</span>
                    <span className="text-secondary text-[11px] block">
                      {p.dosage} • {p.frequency} • {p.duration} (Qty: {p.qty})
                    </span>
                  </div>
                  <button
                    onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                    className="text-error hover:bg-error/10 p-1 rounded"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add medication controls */}
            <div className="p-3 bg-surface-container-low/50 rounded-lg border border-outline-variant/30 space-y-3 text-xs">
              <span className="font-semibold text-secondary text-[11px] block">Add Medication from Hospital Formulary</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newDrug}
                  onChange={(e) => setNewDrug(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant/50 bg-surface"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} (Exp: {b.expiryDate})
                    </option>
                  ))}
                </select>
                <input
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="Dose (e.g. 500mg)"
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant/50 bg-surface"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  placeholder="Frequency (e.g. BID)"
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant/50 bg-surface"
                />
                <input
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Duration (e.g. 7 Days)"
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant/50 bg-surface"
                />
                <button
                  type="button"
                  onClick={handleAddDrug}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold transition-colors"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
