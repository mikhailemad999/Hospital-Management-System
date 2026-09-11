import React, { useState } from 'react';
import { useHospitalStore } from '../../store/useHospitalStore';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, patients, setActiveWorkstation } = useHospitalStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!searchModalOpen) return null;

  const filtered = patients.filter(
    (p) =>
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px] text-primary">search</span>
          <input
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient MRN, National ID, Full Name, Contact..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-on-surface placeholder:text-secondary"
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            className="px-2 py-1 text-xs rounded hover:bg-surface-container-low text-secondary"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-outline-variant/20">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary">
              No matching clinical records or patients found for "{searchTerm}".
            </div>
          ) : (
            filtered.map((patient) => (
              <div
                key={patient.id}
                onClick={() => {
                  setSearchModalOpen(false);
                  setActiveWorkstation('master-patient-index');
                }}
                className="p-3 hover:bg-surface-container-low cursor-pointer rounded-lg transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-on-surface">
                        {patient.firstName} {patient.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                        {patient.mrn}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {patient.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-secondary mt-0.5">
                      {patient.age}y • {patient.gender === 'M' ? 'Male' : 'Female'} • Blood: {patient.bloodType} • Nat ID: {patient.nationalId}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-secondary">arrow_forward</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
