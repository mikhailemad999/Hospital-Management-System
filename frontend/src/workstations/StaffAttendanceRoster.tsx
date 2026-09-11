import React, { useState, useEffect } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import api from '../services/api';

export const StaffAttendanceRoster: React.FC = () => {
  const { currentUser } = useHospitalStore();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [clockedIn, setClockedIn] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/payroll/attendance');
      setAttendance(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleClock = async () => {
    try {
      await api.post('/payroll/clock', {
        employeeCode: currentUser.badge || 'EMP-001',
        shiftType: 'Day',
      });
      setClockedIn(!clockedIn);
      await fetchAttendance();
      alert(`Biometric timestamp verified for ${currentUser.fullName}.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Workforce Management & Biometrics
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">BIOMETRIC TERMINAL #01</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Staff Rostering & Biometric Shift Attendance
          </h1>
        </div>

        {/* Punch Clock Button */}
        <button
          onClick={handleClock}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 ${
            clockedIn
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-primary hover:bg-primary-container text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">fingerprint</span>
          <span>{clockedIn ? 'Clock Out (Biometric Scan)' : 'Clock In (Biometric Scan)'}</span>
        </button>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface">Shift Attendance Log & Biometric Verifications</h3>
          <span className="text-xs font-mono text-secondary">Optical Fingerprint Engine Online</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Employee & Badge</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Shift Type</th>
                <th className="py-2.5 px-3">Clock In</th>
                <th className="py-2.5 px-3">Clock Out</th>
                <th className="py-2.5 px-3">Hours Worked</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Biometric Auth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface">{rec.employeeName}</p>
                    <span className="text-[10px] font-mono text-primary font-semibold">{rec.employeeCode}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-secondary">{rec.shiftDate}</td>
                  <td className="py-3 px-3 font-medium text-on-surface">{rec.shiftType}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">{rec.clockIn}</td>
                  <td className="py-3 px-3 font-mono text-secondary">{rec.clockOut || '--:--'}</td>
                  <td className="py-3 px-3 font-mono">{rec.workedHours} hrs</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-mono font-bold">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-600 font-mono text-[11px] font-bold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>100% Match</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
