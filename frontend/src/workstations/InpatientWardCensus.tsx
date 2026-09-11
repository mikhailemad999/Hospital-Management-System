import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { Bed } from '../types';

export const InpatientWardCensus: React.FC = () => {
  const { beds, updateBedStatus, activeLanguage } = useHospitalStore();
  const [wardFilter, setWardFilter] = useState('ALL');
  const [transferModalBed, setTransferModalBed] = useState<Bed | null>(null);
  const [targetBedNumber, setTargetBedNumber] = useState('');

  const filteredBeds = wardFilter === 'ALL' ? beds : beds.filter((b) => b.wardType === wardFilter);

  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const available = beds.filter((b) => b.status === 'available').length;
  const cleaning = beds.filter((b) => b.status === 'cleaning').length;

  const handleTransfer = async () => {
    if (!transferModalBed || !targetBedNumber) return;
    // Set old bed to cleaning
    await updateBedStatus(transferModalBed.id, 'cleaning');
    // Set target bed to occupied
    const targetBed = beds.find((b) => b.bedNumber === targetBedNumber);
    if (targetBed) {
      await updateBedStatus(
        targetBed.id,
        'occupied',
        transferModalBed.patientName,
        transferModalBed.mrn
      );
    }
    setTransferModalBed(null);
    setTargetBedNumber('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-primary text-on-primary border-primary';
      case 'available':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'cleaning':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'maintenance':
        return 'bg-error-container text-on-error-container border-error/40';
      case 'reserved':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      default:
        return 'bg-surface-container text-on-surface border-outline-variant/30';
    }
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Ward Census & Rack Telemetry
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">45 LICENSED BEDS</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Inpatient Bed Management & Ward Census Rack
          </h1>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40">
            <span className="text-secondary text-[10px] block">OCCUPIED</span>
            <span className="font-bold text-primary text-sm">{occupied}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-secondary text-[10px] block">AVAILABLE</span>
            <span className="font-bold text-emerald-700 text-sm">{available}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-secondary text-[10px] block">CLEANING</span>
            <span className="font-bold text-amber-700 text-sm">{cleaning}</span>
          </div>
        </div>
      </div>

      {/* Ward Filter Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['ALL', 'ICU', 'CARDIOLOGY', 'SURGERY', 'PEDIATRICS'].map((w) => (
          <button
            key={w}
            onClick={() => setWardFilter(w)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              wardFilter === w
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            {w === 'ALL' ? 'All Hospital Wards' : `${w} Ward`}
          </button>
        ))}
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'occupied';
          return (
            <div
              key={bed.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Top Row: Bed # & Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-on-surface font-mono">{bed.bedNumber}</span>
                    <span className="text-[10px] text-secondary font-mono bg-surface-container px-1.5 py-0.5 rounded">
                      {bed.roomNumber}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getStatusColor(
                      bed.status
                    )}`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div className="text-[11px] text-secondary font-medium mb-3">
                  {bed.wardName}
                </div>

                {/* Patient Information if occupied */}
                {isOccupied ? (
                  <div className="p-3 rounded-lg bg-surface border border-outline-variant/20 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-secondary uppercase block">PATIENT</span>
                      <p className="font-bold text-on-surface text-sm">{bed.patientName}</p>
                      <span className="text-[10px] font-mono text-primary font-semibold">{bed.mrn}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/20">
                      <span className="text-secondary">Admit Time:</span>
                      <span className="font-mono text-on-surface">{bed.admitTime || 'Recent'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-secondary">Attending:</span>
                      <span className="font-medium text-on-surface">{bed.attendingDoctor || 'On-Call MD'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-secondary">O2 Telemetry:</span>
                      <span className="font-mono font-bold text-primary">{bed.o2Telemetry}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-surface border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[28px] text-secondary mb-1">
                      {bed.status === 'cleaning' ? 'sanitizer' : 'hotel'}
                    </span>
                    <p className="text-xs text-secondary capitalize font-medium">
                      {bed.status === 'cleaning' ? 'Sanitization in progress' : 'Ready for Patient Intake'}
                    </p>
                    <span className="text-[10px] font-mono text-secondary mt-1">Rate: ${bed.dailyRate}/day</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2 text-xs">
                {isOccupied ? (
                  <>
                    <button
                      onClick={() => setTransferModalBed(bed)}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold transition-colors"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => updateBedStatus(bed.id, 'cleaning')}
                      className="px-2.5 py-1 rounded bg-error-container text-error font-semibold hover:bg-error/20 transition-colors"
                    >
                      Discharge
                    </button>
                  </>
                ) : bed.status === 'cleaning' ? (
                  <button
                    onClick={() => updateBedStatus(bed.id, 'available')}
                    className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                  >
                    Mark Sanitized & Ready
                  </button>
                ) : (
                  <button
                    onClick={() => updateBedStatus(bed.id, 'cleaning')}
                    className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-secondary"
                  >
                    Set Cleaning
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Bed Modal */}
      {transferModalBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">
              Transfer Patient {transferModalBed.patientName}
            </h3>
            <p className="text-secondary">
              Currently assigned to: <span className="font-bold text-on-surface">{transferModalBed.bedNumber}</span> ({transferModalBed.wardName})
            </p>

            <div>
              <label className="block font-semibold mb-1">Select Destination Available Bed</label>
              <select
                value={targetBedNumber}
                onChange={(e) => setTargetBedNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface outline-none focus:border-primary font-mono"
              >
                <option value="">-- Choose destination bed --</option>
                {beds
                  .filter((b) => b.status === 'available')
                  .map((b) => (
                    <option key={b.id} value={b.bedNumber}>
                      {b.bedNumber} • {b.wardName} (${b.dailyRate}/day)
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
              <button
                onClick={() => setTransferModalBed(null)}
                className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!targetBedNumber}
                className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
