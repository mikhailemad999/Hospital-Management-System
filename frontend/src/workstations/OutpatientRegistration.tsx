import React, { useState, useEffect } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import api from '../services/api';

export const OutpatientRegistration: React.FC = () => {
  const { patients } = useHospitalStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [mrn, setMrn] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Marcus Brody, MD');
  const [deptName, setDeptName] = useState('Cardiology Suite');

  const fetchAppts = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAppts();
  }, []);

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments/ticket', {
        patientId: 'pat-gen',
        patientName: patientName || 'Walk-in Patient',
        mrn: mrn || 'MRN-AUTO',
        doctorName,
        departmentName: deptName,
        appointmentDate: new Date().toISOString().substring(0, 10),
        timeSlot: '14:30 - 15:00',
        fee: 150.00,
      });
      await fetchAppts();
      setTicketModalOpen(false);
      setPatientName('');
      setMrn('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallNext = async (id: string) => {
    await api.patch(`/appointments/${id}/status`, { status: 'CALLED' });
    await fetchAppts();
  };

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Reception & Clinic Ticketing
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">SMART QUEUEING</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Outpatient Registration & Queue Management
          </h1>
        </div>

        <button
          onClick={() => setTicketModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          <span>Issue Clinic Queue Ticket</span>
        </button>
      </div>

      {/* Calling Display Board */}
      <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-lg mb-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-on-primary-container block mb-1 font-bold">
            NOW CALLING TO CLINIC
          </span>
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-mono font-bold tracking-tight">T-102</span>
            <span className="text-xl font-medium text-on-primary/90">Cardiology Consultation • Room 204</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-primary-container/40 p-3 rounded-xl border border-on-primary/20">
          <span className="material-symbols-outlined text-[32px] text-on-primary-container animate-pulse">volume_up</span>
          <div>
            <span className="text-[10px] font-mono uppercase block text-on-primary-container">AUDIO ANNOUNCEMENT</span>
            <span className="text-xs font-semibold">"Ticket T-102 proceed to Room 204"</span>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface">Today's Clinic Appointment Queue</h3>
          <span className="text-xs font-mono text-secondary">Queue Priority System</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Ticket Number</th>
                <th className="py-2.5 px-3">Patient Name & MRN</th>
                <th className="py-2.5 px-3">Clinic & Doctor</th>
                <th className="py-2.5 px-3">Time Slot</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-secondary">
                    No waiting tickets issued yet. Click "Issue Clinic Queue Ticket" to begin.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-sm">
                      {appt.ticketNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-on-surface">{appt.patientName}</p>
                      <span className="text-[10px] font-mono text-secondary">{appt.mrn}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-on-surface block">{appt.departmentName}</span>
                      <span className="text-[11px] text-secondary">{appt.doctorName}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-secondary">{appt.timeSlot}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          appt.status === 'CALLED'
                            ? 'bg-amber-100 text-amber-950 animate-pulse'
                            : appt.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-950'
                            : 'bg-primary text-on-primary'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {appt.status === 'WAITING' && (
                        <button
                          onClick={() => handleCallNext(appt.id)}
                          className="px-3 py-1 rounded bg-primary text-on-primary font-bold text-xs hover:bg-primary-container"
                        >
                          Call Patient
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-on-surface">Issue Clinic Queue Ticket</h3>

            <form onSubmit={handleIssueTicket} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Select Patient or Enter Name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Full Name"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">MRN (if registered)</label>
                <input
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  placeholder="MRN-XXXXX"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Clinic Specialty</label>
                <select
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface font-semibold"
                >
                  <option value="Cardiology Suite">Cardiology Suite</option>
                  <option value="General & Trauma Surgery">General & Trauma Surgery</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Pediatrics Clinic">Pediatrics Clinic</option>
                  <option value="Orthopedic Clinic">Orthopedic Clinic</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Attending Physician</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-surface"
                >
                  <option value="Dr. Marcus Brody, MD">Dr. Marcus Brody, MD</option>
                  <option value="Dr. Elena Rostova, MD">Dr. Elena Rostova, MD</option>
                  <option value="Dr. Sarah Vance, MD">Dr. Sarah Vance, MD</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-surface-container text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                >
                  Generate Ticket & Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
