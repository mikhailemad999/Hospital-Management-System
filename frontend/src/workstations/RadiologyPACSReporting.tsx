import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { RadiologyOrder } from '../types';

export const RadiologyPACSReporting: React.FC = () => {
  const { radiologyOrders, addRadiologyOrder, signRadiologyReport, patients, currentUser } = useHospitalStore();
  const [selectedStudy, setSelectedStudy] = useState<RadiologyOrder | null>(null);
  const [modalityFilter, setModalityFilter] = useState<'ALL' | 'CT' | 'MRI' | 'X-RAY' | 'ULTRASOUND'>('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  // PACS Viewer Controls Simulation
  const [viewPreset, setViewPreset] = useState<'SOFT_TISSUE' | 'BONE' | 'LUNG'>('SOFT_TISSUE');
  const [inverted, setInverted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // New Order Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [modality, setModality] = useState<'CT' | 'MRI' | 'X-RAY' | 'ULTRASOUND'>('CT');
  const [studyDesc, setStudyDesc] = useState('CT Chest/Abdomen/Pelvis with IV Contrast');
  const [priority, setPriority] = useState<'STAT' | 'URGENT' | 'ROUTINE'>('STAT');

  // Sign Report State
  const [findingsText, setFindingsText] = useState('');
  const [impressionText, setImpressionText] = useState('');

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const newOrder = await addRadiologyOrder({
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      mrn: selectedPatient.mrn,
      modality,
      studyDescription: studyDesc,
      priority,
      status: 'SCHEDULED',
      orderedBy: currentUser.fullName,
    });
    if (newOrder) setSelectedStudy(newOrder);
    setShowOrderModal(false);
  };

  const handleSignReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudy) return;
    await signRadiologyReport(selectedStudy.id, {
      findings: findingsText,
      impression: impressionText,
      radiologist: currentUser.fullName,
      status: 'REPORTED',
    });
    setSelectedStudy((prev) =>
      prev
        ? {
            ...prev,
            findings: findingsText,
            impression: impressionText,
            radiologist: currentUser.fullName,
            status: 'REPORTED',
          }
        : null
    );
    setShowSignModal(false);
  };

  const filteredOrders = radiologyOrders.filter((o) => {
    if (modalityFilter === 'ALL') return true;
    return o.modality === modalityFilter;
  });

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Medical Imaging & DICOM / PACS Worklist
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">DICOM PACS CONNECTED</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Radiology Imaging Worklist & PACS Reporting
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>Order Imaging Study</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Studies List (2 Cols) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Imaging Examinations & Diagnostic Studies</h3>
                <span className="text-xs font-mono text-secondary">Modalities: CT • MRI • X-RAY • US ({filteredOrders.length} records)</span>
              </div>

              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs font-mono">
                {(['ALL', 'CT', 'MRI', 'X-RAY', 'ULTRASOUND'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalityFilter(tab)}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      modalityFilter === tab ? 'bg-primary text-on-primary shadow-xs' : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                    <th className="py-2.5 px-4">Study # & Modality</th>
                    <th className="py-2.5 px-3">Patient & MRN</th>
                    <th className="py-2.5 px-3">Procedure Description</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-4 text-right">View Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-secondary text-sm">
                        No radiology studies match the selected modality.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedStudy?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => {
                            setSelectedStudy(order);
                            setFindingsText(order.findings || '');
                            setImpressionText(order.impression || '');
                          }}
                          className={`hover:bg-surface-container-low/40 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary-container/15 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-mono font-bold mr-2">
                              {order.modality}
                            </span>
                            <span className="font-mono font-bold text-on-surface">{order.orderNumber}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-on-surface">{order.patientName}</p>
                            <span className="text-[10px] font-mono text-secondary">{order.mrn}</span>
                          </td>
                          <td className="py-3 px-3 text-on-surface font-medium">{order.studyDescription}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                order.priority === 'STAT'
                                  ? 'bg-error-container text-error animate-pulse'
                                  : order.priority === 'URGENT'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-surface-container text-secondary'
                              }`}
                            >
                              {order.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                order.status === 'REPORTED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudy(order);
                                setFindingsText(order.findings || '');
                                setImpressionText(order.impression || '');
                              }}
                              className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[11px]"
                            >
                              Open PACS
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive DICOM / PACS Viewer Canvas */}
          {selectedStudy && (
            <div className="bg-neutral-950 rounded-xl shadow-lg border border-neutral-800 p-4 text-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-primary text-black font-mono font-bold text-[10px]">
                    DICOM 3.0 STREAM
                  </span>
                  <span className="font-mono text-xs text-neutral-300 font-bold">
                    {selectedStudy.modality} • {selectedStudy.studyDescription}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setInverted(!inverted)}
                    className={`px-2 py-1 rounded border border-neutral-700 ${inverted ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-300'}`}
                  >
                    Invert
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(60, z - 20))}
                    className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 hover:bg-neutral-800"
                  >
                    Zoom -
                  </button>
                  <span className="text-neutral-400">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 20))}
                    className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 hover:bg-neutral-800"
                  >
                    Zoom +
                  </button>
                  <select
                    value={viewPreset}
                    onChange={(e) => setViewPreset(e.target.value as any)}
                    className="bg-neutral-900 border border-neutral-700 text-neutral-200 rounded px-2 py-1"
                  >
                    <option value="SOFT_TISSUE">Window: Soft Tissue</option>
                    <option value="BONE">Window: Bone Matrix</option>
                    <option value="LUNG">Window: Pulmonary Lung</option>
                  </select>
                </div>
              </div>

              {/* Simulated High-Res Radiology Scan Grid */}
              <div
                className={`relative h-64 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-800 transition-all ${
                  inverted ? 'bg-neutral-100 text-neutral-900' : 'bg-black text-neutral-100'
                }`}
              >
                <div
                  className="flex flex-col items-center justify-center p-6 text-center select-none"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  <div className="w-36 h-36 rounded-full border-4 border-dashed border-neutral-600 flex items-center justify-center relative mb-2">
                    <div className="w-24 h-24 rounded-full border-2 border-neutral-500 opacity-60"></div>
                    <div className="w-12 h-12 rounded-full border border-neutral-400 opacity-40"></div>
                    <span className="absolute text-[10px] font-mono opacity-60">R • AXIAL SLICE 42/128</span>
                  </div>
                  <p className="font-mono text-[11px] opacity-75">
                    PATIENT: {selectedStudy.patientName} | MRN: {selectedStudy.mrn}
                  </p>
                  <p className="font-mono text-[10px] opacity-50">
                    PRESET: {viewPreset} | KVp 120 | mA 240 | SLICE 1.25mm
                  </p>
                </div>

                <div className="absolute top-2 left-3 text-[10px] font-mono opacity-50">
                  FOV: 350mm • Matrix: 512x512
                </div>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono opacity-50">
                  PACS SERVER: PAC-HQ-01.MEDCORE.LOCAL
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Report Viewer / Dictation Panel (1 Col) */}
        {selectedStudy ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 space-y-4 text-xs">
            <div className="pb-3 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-secondary font-bold">RADIOLOGICAL REPORT</span>
                <h2 className="text-base font-bold text-on-surface mt-0.5">{selectedStudy.studyDescription}</h2>
                <p className="text-secondary font-mono text-[11px] mt-0.5">
                  {selectedStudy.patientName} • {selectedStudy.mrn}
                </p>
              </div>
              <button
                onClick={() => {
                  setFindingsText(selectedStudy.findings || '');
                  setImpressionText(selectedStudy.impression || '');
                  setShowSignModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-xs hover:bg-primary/90 flex items-center gap-1 text-[11px]"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>{selectedStudy.status === 'REPORTED' ? 'Edit Findings' : 'Sign Report'}</span>
              </button>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-secondary font-bold block mb-1">CLINICAL FINDINGS</span>
              <p className="p-3 rounded-lg bg-surface border border-outline-variant/30 leading-relaxed text-on-surface min-h-20">
                {selectedStudy.findings || 'No formal findings transcribed yet. Click "Sign Report" to dictate findings.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-secondary font-bold block mb-1">IMPRESSION & ACTION PLAN</span>
              <p className="p-3 rounded-lg bg-primary-container/10 border border-primary/20 leading-relaxed font-bold text-primary min-h-16">
                {selectedStudy.impression || 'Awaiting formal diagnostic radiologist impression.'}
              </p>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-secondary">
              <span>
                Dictated by:{' '}
                <strong className="text-on-surface">{selectedStudy.radiologist || 'Pending Radiologist'}</strong>
              </span>
              <span
                className={`font-mono font-bold flex items-center gap-1 ${
                  selectedStudy.status === 'REPORTED' ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {selectedStudy.status === 'REPORTED' ? 'ELECTRONICALLY SIGNED' : 'AWAITING SIGN-OFF'}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-8 text-center text-secondary text-xs flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[36px] mb-2 text-outline">radiology</span>
            <span>Select any study row from the worklist to display radiologist findings, PACS images, and impressions.</span>
          </div>
        )}
      </div>

      {/* Order Imaging Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-bold text-base text-on-surface">Order Diagnostic Imaging Study</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-secondary mb-1">Modality</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                  >
                    <option value="CT">CT (Computed Tomography)</option>
                    <option value="MRI">MRI (Magnetic Resonance)</option>
                    <option value="X-RAY">X-Ray (Radiography)</option>
                    <option value="ULTRASOUND">Ultrasound / Sonography</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-secondary mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                  >
                    <option value="STAT">STAT (Emergency)</option>
                    <option value="URGENT">Urgent (Within 4h)</option>
                    <option value="ROUTINE">Routine (Elective)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">Procedure Description / Clinical Indication</label>
                <input
                  type="text"
                  value={studyDesc}
                  onChange={(e) => setStudyDesc(e.target.value)}
                  required
                  placeholder="e.g. CT Trauma Pan-Scan, Chest AP, Brain MRI"
                  className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 rounded-lg text-secondary hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold shadow-sm"
                >
                  Dispatch to PACS Worklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Report Modal */}
      {showSignModal && selectedStudy && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface">Dictate & Sign Radiology Report</h3>
                <span className="text-xs font-mono text-secondary">
                  {selectedStudy.orderNumber} • {selectedStudy.patientName}
                </span>
              </div>
              <button onClick={() => setShowSignModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSignReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">Radiological Findings</label>
                <textarea
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Detailed anatomical observations, density changes, fractures, organ margins..."
                  className="w-full p-3 rounded-lg border border-outline-variant/40 bg-surface text-on-surface leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">Diagnostic Impression & Recommendations</label>
                <textarea
                  value={impressionText}
                  onChange={(e) => setImpressionText(e.target.value)}
                  rows={3}
                  required
                  placeholder="Primary clinical diagnosis and recommended surgical or medical next steps..."
                  className="w-full p-3 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 rounded-lg text-secondary hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold shadow-sm hover:bg-emerald-700"
                >
                  Electronically Sign & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
