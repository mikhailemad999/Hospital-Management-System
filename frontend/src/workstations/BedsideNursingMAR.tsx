import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import api from '../services/api';

export const BedsideNursingMAR: React.FC = () => {
  const { marRecords, administerMAR, patients, currentUser } = useHospitalStore();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);

  // Vitals form state
  const [temp, setTemp] = useState(37.2);
  const [pulse, setPulse] = useState(78);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [rr, setRr] = useState(16);
  const [vitalsNotes, setVitalsNotes] = useState('');

  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [nursingNoteText, setNursingNoteText] = useState('');
  const [shiftType, setShiftType] = useState('Day');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/nursing/vitals', {
        patientId: selectedPatient?.id || 'pat-1',
        temperature: temp,
        pulse,
        systolicBP: systolic,
        diastolicBP: diastolic,
        oxygenSaturation: spo2,
        respiratoryRate: rr,
        recordedBy: currentUser.fullName,
        notes: vitalsNotes,
      });
      alert('Vitals successfully recorded and synchronized into telemetry!');
      setVitalsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNursingNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/nursing/notes', {
        patientId: selectedPatient?.id || 'pat-1',
        shift: shiftType,
        nurseName: currentUser.fullName,
        content: nursingNoteText,
      });
      alert('Shift handover nursing note logged successfully.');
      setNotesModalOpen(false);
      setNursingNoteText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Bedside Care & e-MAR Telemetry
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">5-RIGHTS VERIFICATION</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Bedside Nursing & Medication Administration Record (MAR)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVitalsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">vital_signs</span>
            <span>Record Patient Vitals</span>
          </button>
          <button
            onClick={() => setNotesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Shift Handover Note</span>
          </button>
        </div>
      </div>

      {/* Patient Header Strip */}
      {selectedPatient && (
        <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 border border-outline-variant/30 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-base">
              {selectedPatient.firstName[0]}
              {selectedPatient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-on-surface">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <span className="font-mono text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded">
                  {selectedPatient.mrn}
                </span>
                <span className="text-xs font-bold text-error bg-error-container text-on-error-container px-2 py-0.5 rounded font-mono">
                  {selectedPatient.assignedBed || 'Bed ICU-B01'}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                {selectedPatient.age}y • {selectedPatient.gender === 'M' ? 'Male' : 'Female'} • Blood: {selectedPatient.bloodType} • Allergies:{' '}
                <span className="font-bold text-error">
                  {Array.isArray(selectedPatient.allergies) ? selectedPatient.allergies.join(', ') : selectedPatient.allergies}
                </span>
              </p>
            </div>
          </div>

          {/* Live Telemetry Pill */}
          <div className="flex items-center gap-4 text-xs font-mono bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30">
            <div>HR: <span className="font-bold text-error">114 bpm</span></div>
            <div>BP: <span className="font-bold text-on-surface">168/104</span></div>
            <div>SpO2: <span className="font-bold text-error">91% (ALERT)</span></div>
            <div>Temp: <span className="font-bold">38.6°C</span></div>
          </div>
        </div>
      )}

      {/* MAR Electronic Chart Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">medication</span>
            <h3 className="font-bold text-sm text-on-surface">Today's Scheduled Medication Administration Roster</h3>
          </div>
          <span className="text-xs font-mono text-secondary">
            Verified: Right Patient • Right Drug • Right Dose • Right Route • Right Time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Patient & Bed</th>
                <th className="py-2.5 px-3">Medication & Strength</th>
                <th className="py-2.5 px-3">Dose & Route</th>
                <th className="py-2.5 px-3">Scheduled Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Verification Details</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {marRecords.map((record) => {
                const isDue = record.status === 'DUE';
                const isAdministered = record.status === 'ADMINISTERED';
                return (
                  <tr key={record.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-on-surface text-xs">{record.patientName}</p>
                      <span className="text-[10px] font-mono text-primary font-semibold">{record.bedNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-on-surface">{record.medication}</p>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold">{record.dose}</span> ({record.route})
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-secondary">
                      {record.scheduledTime}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isAdministered
                            ? 'bg-emerald-100 text-emerald-950'
                            : isDue
                            ? 'bg-amber-100 text-amber-950 animate-pulse'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-secondary text-[11px]">
                      {isAdministered ? (
                        <span>
                          Given by <strong className="text-on-surface">{record.administeredBy}</strong> at{' '}
                          {record.administeredAt}
                        </span>
                      ) : (
                        <span className="text-secondary/70">Awaiting nurse clinical scan</span>
                      )}
                      {record.notes && <p className="text-[10px] italic mt-0.5 text-on-surface">{record.notes}</p>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isDue ? (
                        <button
                          onClick={() => administerMAR(record.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-xs"
                        >
                          Administer Dose
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-mono text-[11px] font-bold flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Complete</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Vitals Modal */}
      {vitalsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden">
            <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Bedside Patient Vitals</h3>
              <button onClick={() => setVitalsModalOpen(false)} className="text-on-primary/80 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRecordVitals} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${
                      temp > 38.0 ? 'border-error bg-error-container/20 text-error font-bold' : 'border-outline-variant/50'
                    }`}
                  />
                  {temp > 38.0 && <span className="text-[10px] text-error font-bold block mt-0.5">● FEBRILE HYPERTHERMIA</span>}
                </div>

                <div>
                  <label className="block font-semibold mb-1">Heart Rate (Pulse bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${
                      pulse > 100 ? 'border-error bg-error-container/20 text-error font-bold' : 'border-outline-variant/50'
                    }`}
                  />
                  {pulse > 100 && <span className="text-[10px] text-error font-bold block mt-0.5">● TACHYCARDIA</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Systolic BP</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Diastolic BP</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Oxygen Sat (SpO2 %)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${
                      spo2 < 93 ? 'border-error bg-error-container/20 text-error font-bold' : 'border-outline-variant/50'
                    }`}
                  />
                  {spo2 < 93 && <span className="text-[10px] text-error font-bold block mt-0.5">● HYPOXEMIA ALERT</span>}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Clinical Observation Notes</label>
                <textarea
                  value={vitalsNotes}
                  onChange={(e) => setVitalsNotes(e.target.value)}
                  rows={2}
                  placeholder="Patient demeanor, skin turgor, O2 delivery method..."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setVitalsModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Save Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nursing Shift Handover Note Modal */}
      {notesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden">
            <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
              <h3 className="font-bold text-sm">Log Shift Handover Nursing Note</h3>
              <button onClick={() => setNotesModalOpen(false)} className="text-on-primary/80 hover:text-white">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNursingNote} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Shift</label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface"
                >
                  <option value="Day">Day Shift (07:00 - 15:00)</option>
                  <option value="Evening">Evening Shift (15:00 - 23:00)</option>
                  <option value="Night">Night Shift (23:00 - 07:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Shift Summary & Care Plan Actions</label>
                <textarea
                  value={nursingNoteText}
                  onChange={(e) => setNursingNoteText(e.target.value)}
                  rows={4}
                  placeholder="Patient condition changes, pending blood tests, Foley catheter status, IV site inspection..."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setNotesModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Submit Handover Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
