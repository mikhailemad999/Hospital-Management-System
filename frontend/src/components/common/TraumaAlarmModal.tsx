import React from 'react';
import { useHospitalStore } from '../../store/useHospitalStore';

export const TraumaAlarmModal: React.FC = () => {
  const { alarmModalOpen, setAlarmModalOpen, isAlarmActive, setAlarmActive } = useHospitalStore();

  if (!alarmModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border-2 border-error overflow-hidden">
        {/* Urgent Header */}
        <div className="bg-error p-5 text-on-error flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] animate-bounce">e911_emergency</span>
            <div>
              <h3 className="font-bold text-base tracking-wide">STAT TRAUMA CODE RED ALERT</h3>
              <p className="text-xs text-on-error/80 font-mono">LEVEL 1 PRIORITY ACTIVATION</p>
            </div>
          </div>
          <button
            onClick={() => setAlarmModalOpen(false)}
            className="p-1 rounded-lg hover:bg-black/20 text-on-error"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-error-container/40 border border-error/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-error">
              <span>INFLOW LOCATION: OR-3 & BAY 2</span>
              <span>ETA: 03m 48s</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">
              MedEvac inbound with multiple high-velocity trauma casualties. Operating Theater 3 is assigned for emergency laparotomy bypass. Blood bank crossmatch priority level zero has been requested.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
              <span className="text-[10px] font-mono text-secondary uppercase">ATTENDING SURGEON</span>
              <p className="font-semibold text-on-surface mt-1">Dr. Elena Rostova, MD</p>
              <span className="text-[10px] text-emerald-600 font-medium">● IN THEATER</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
              <span className="text-[10px] font-mono text-secondary uppercase">BLOOD BANK RESERVE</span>
              <p className="font-semibold text-on-surface mt-1">6 Units O-Negative</p>
              <span className="text-[10px] text-primary font-medium">● THAWED & DISPATCHED</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-outline-variant/30">
            <button
              onClick={() => {
                setAlarmActive(false);
                setAlarmModalOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              Stand Down Code
            </button>
            <button
              onClick={() => {
                setAlarmActive(true);
                setAlarmModalOpen(false);
              }}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-error hover:bg-on-error-container text-on-error transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">broadcast_on_personal</span>
              <span>BROADCAST CODE TO ALL UNITS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
