import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import api from '../services/api';

export const OperatingTheatersOR: React.FC = () => {
  const { operations, fetchInitialData } = useHospitalStore();
  const [newOpModalOpen, setNewOpModalOpen] = useState(false);

  // New Operation state
  const [patientName, setPatientName] = useState('Arthur Pendelton');
  const [mrn, setMrn] = useState('MRN-92810');
  const [procedure, setProcedure] = useState('Emergency Laparotomy');
  const [orRoom, setOrRoom] = useState('OR-3 (Trauma Suite)');
  const [leadSurgeon, setLeadSurgeon] = useState('Dr. Elena Rostova, MD');
  const [revenue, setRevenue] = useState(6500.00);
  const [consumables, setConsumables] = useState(1200.00);

  const handleCreateOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/operations/schedules', {
        patientName,
        mrn,
        procedureName: procedure,
        orRoom,
        leadSurgeon,
        anesthetist: 'Dr. Nathan Vance, MD',
        circulatingNurse: 'Nurse Lisa Adams, RN',
        scheduledTime: '15:30 EST',
        preOpDiagnosis: 'Acute surgical abdomen',
        consumablesCost: consumables,
        grossRevenue: revenue,
        status: 'IN_SURGERY',
      });
      await fetchInitialData();
      alert('Surgical operation scheduled and OR suite prepped!');
      setNewOpModalOpen(false);
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
              Surgical Suite Telemetry & OR Matrix
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">4 THEATERS ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Operating Theaters & Surgical Suite Management
          </h1>
        </div>

        <button
          onClick={() => setNewOpModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Schedule Surgical Procedure</span>
        </button>
      </div>

      {/* 4 OR Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['OR-1 (Minimally Invasive)', 'OR-2 (Orthopedic Suite)', 'OR-3 (Trauma Bypass)', 'OR-4 (Cardiovascular)'].map((room, idx) => {
          const isTrauma = room.includes('OR-3');
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
                isTrauma
                  ? 'bg-error-container/20 border-error/40'
                  : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs font-mono">{room}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isTrauma
                        ? 'bg-error text-on-error animate-pulse'
                        : 'bg-emerald-100 text-emerald-950'
                    }`}
                  >
                    {isTrauma ? 'IN USE - STAT' : 'AVAILABLE'}
                  </span>
                </div>
                <p className="text-xs text-secondary">
                  {isTrauma ? 'Exploratory Laparotomy in progress' : 'Scheduled turnaround & sterilization ready'}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono text-secondary">
                <span>HEPA POSITIVE PRES</span>
                <span className="text-primary font-bold">99.97%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Operations Table with Surgeon Revenue Share */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">vital_signs</span>
            <h3 className="font-bold text-sm text-on-surface">Operating Room Schedule & Surgeon Profit Share Engine</h3>
          </div>
          <span className="text-xs font-mono text-secondary">Formula: (Gross Revenue - Consumables) × 35% Rule</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Operation & Room</th>
                <th className="py-2.5 px-3">Patient & MRN</th>
                <th className="py-2.5 px-3">Surgical Team</th>
                <th className="py-2.5 px-3">Scheduled Time / Duration</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Consumables Cost</th>
                <th className="py-2.5 px-3">Surgeon Share (35%)</th>
                <th className="py-2.5 px-4 text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {operations.map((op) => (
                <tr key={op.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface text-xs">{op.procedureName}</p>
                    <span className="text-[10px] font-mono text-primary font-semibold">{op.orRoom}</span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-on-surface">{op.patientName}</p>
                    <span className="text-[10px] font-mono text-secondary">{op.mrn}</span>
                  </td>
                  <td className="py-3 px-3 text-secondary text-[11px]">
                    <span className="font-semibold text-on-surface block">Surgeon: {op.leadSurgeon}</span>
                    <span>Anesth: {op.anesthetist}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div>{op.scheduledTime}</div>
                    {op.actualDuration && <span className="text-secondary">Elapsed: {op.actualDuration}</span>}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        op.status === 'IN_SURGERY'
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : 'bg-emerald-100 text-emerald-950'
                      }`}
                    >
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-secondary">
                    ${Number(op.consumablesCost).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                    ${Number(op.surgeonShare).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-primary text-sm">
                    ${Number(op.grossRevenue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {newOpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">Book & Dispatch Surgical Operation</h3>

            <form onSubmit={handleCreateOperation} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Surgical Procedure Name</label>
                <input
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Patient Name</label>
                  <input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">MRN</label>
                  <input
                    value={mrn}
                    onChange={(e) => setMrn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Operating Theater</label>
                  <select
                    value={orRoom}
                    onChange={(e) => setOrRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface font-mono"
                  >
                    <option value="OR-1 (Minimally Invasive)">OR-1 (Minimally Invasive)</option>
                    <option value="OR-2 (Orthopedic Suite)">OR-2 (Orthopedic Suite)</option>
                    <option value="OR-3 (Trauma Suite)">OR-3 (Trauma Suite)</option>
                    <option value="OR-4 (Cardiovascular)">OR-4 (Cardiovascular)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Lead Surgeon</label>
                  <select
                    value={leadSurgeon}
                    onChange={(e) => setLeadSurgeon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface"
                  >
                    <option value="Dr. Elena Rostova, MD">Dr. Elena Rostova, MD</option>
                    <option value="Dr. Marcus Brody, MD">Dr. Marcus Brody, MD</option>
                    <option value="Dr. Sarah Vance, MD">Dr. Sarah Vance, MD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Gross Procedure Revenue ($)</label>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estimated Consumables ($)</label>
                  <input
                    type="number"
                    value={consumables}
                    onChange={(e) => setConsumables(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setNewOpModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Schedule & Deduct Consumables
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
