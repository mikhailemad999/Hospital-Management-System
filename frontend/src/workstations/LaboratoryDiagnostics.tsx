import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';
import { LabOrder } from '../types';

export const LaboratoryDiagnostics: React.FC = () => {
  const { labOrders, addLabOrder, updateLabStatus, recordLabResult, patients, currentUser } = useHospitalStore();
  const [filter, setFilter] = useState<'ALL' | 'STAT' | 'ANALYZING' | 'COMPLETED'>('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderForResults, setSelectedOrderForResults] = useState<LabOrder | null>(null);

  // New Lab Order Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [testName, setTestName] = useState('High-Sensitivity Cardiac Troponin I');
  const [priority, setPriority] = useState<'STAT' | 'URGENT' | 'ROUTINE'>('STAT');

  // Result entry form state
  const [paramName, setParamName] = useState('');
  const [val, setVal] = useState('');
  const [unit, setUnit] = useState('ng/mL');
  const [refRange, setRefRange] = useState('< 0.04');
  const [isAbnormal, setIsAbnormal] = useState(false);

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    await addLabOrder({
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      mrn: selectedPatient.mrn,
      testName,
      priority,
      status: 'PENDING',
      orderedBy: currentUser.fullName,
    });
    setShowOrderModal(false);
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForResults || !paramName || !val) return;
    await recordLabResult(selectedOrderForResults.id, {
      parameter: paramName,
      value: val,
      unit,
      referenceRange: refRange,
      isAbnormal,
    });
    setSelectedOrderForResults(null);
    setParamName('');
    setVal('');
  };

  const filteredOrders = labOrders.filter((o) => {
    if (filter === 'STAT') return o.priority === 'STAT';
    if (filter === 'ANALYZING') return o.status === 'ANALYZING' || o.status === 'PENDING' || o.status === 'SAMPLE_COLLECTED';
    if (filter === 'COMPLETED') return o.status === 'COMPLETED';
    return true;
  });

  const statCount = labOrders.filter((o) => o.priority === 'STAT').length;
  const analyzingCount = labOrders.filter((o) => o.status === 'ANALYZING').length;
  const completedCount = labOrders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Clinical Pathology & Molecular Diagnostics
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">LIS BARCODE ANALYZER ONLINE</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Laboratory Diagnostics & Sample Tracking Worklist
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">biotech</span>
            <span>Order Diagnostic Panel</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <span className="text-xs text-secondary font-mono block">TOTAL LAB ORDERS</span>
          <span className="text-2xl font-bold text-on-surface font-mono">{labOrders.length}</span>
          <span className="text-[10px] text-secondary block mt-1">Across all departments</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-error/20 bg-error-container/10 shadow-sm">
          <span className="text-xs text-error font-mono font-bold block">STAT EMERGENCY TESTS</span>
          <span className="text-2xl font-bold text-error font-mono">{statCount}</span>
          <span className="text-[10px] text-error block mt-1">Immediate priority protocol</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <span className="text-xs text-secondary font-mono block">IN ANALYZER QUEUE</span>
          <span className="text-2xl font-bold text-amber-500 font-mono">{analyzingCount}</span>
          <span className="text-[10px] text-secondary block mt-1">Active spectrometry runs</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <span className="text-xs text-secondary font-mono block">VERIFIED & COMPLETED</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono">{completedCount}</span>
          <span className="text-[10px] text-secondary block mt-1">Dispatched to clinical charts</span>
        </div>
      </div>

      {/* Worklist Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-on-surface">Active Pathology Orders & Analyzer Verification</h3>
            <span className="text-xs font-mono text-secondary">({filteredOrders.length} records)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg text-xs font-mono">
            {(['ALL', 'STAT', 'ANALYZING', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  filter === tab
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-secondary hover:text-on-surface'
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
                <th className="py-2.5 px-4">Order #</th>
                <th className="py-2.5 px-3">Patient & MRN</th>
                <th className="py-2.5 px-3">Test Panel</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Verified Results</th>
                <th className="py-2.5 px-4">Actions / Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-secondary text-sm">
                    No laboratory orders match the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const hasResults = order.results && order.results.length > 0;
                  const abnormalResult = order.results?.find((r) => r.isAbnormal);

                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-on-surface">{order.patientName}</p>
                        <span className="text-[10px] font-mono text-secondary">{order.mrn}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-on-surface">
                        <div>{order.testName}</div>
                        <span className="text-[10px] text-secondary font-mono">By {order.orderedBy}</span>
                      </td>
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
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'ANALYZING'
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {hasResults ? (
                          <div className="space-y-1">
                            {order.results?.map((res, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className={`font-bold ${res.isAbnormal ? 'text-error' : 'text-on-surface'}`}>
                                  {res.parameter}: {res.value} {res.unit}
                                </span>
                                {res.isAbnormal && (
                                  <span className="px-1 bg-error-container text-error rounded text-[9px] font-bold">
                                    ABNORMAL
                                  </span>
                                )}
                                <span className="text-[10px] text-secondary">({res.referenceRange})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-secondary italic">Awaiting Analyzer Run</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => updateLabStatus(order.id, 'SAMPLE_COLLECTED')}
                              className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-[11px] font-semibold"
                            >
                              Collect Sample
                            </button>
                          )}
                          {(order.status === 'PENDING' || order.status === 'SAMPLE_COLLECTED') && (
                            <button
                              onClick={() => updateLabStatus(order.id, 'ANALYZING')}
                              className="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-semibold"
                            >
                              Load Analyzer
                            </button>
                          )}
                          {order.status !== 'COMPLETED' && (
                            <button
                              onClick={() => {
                                setSelectedOrderForResults(order);
                                setParamName(order.testName.split(' ')[0] || 'Analyte');
                              }}
                              className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-semibold"
                            >
                              Enter Results
                            </button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Signed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Diagnostic Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-bold text-base text-on-surface">Order Diagnostic Laboratory Panel</h3>
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

              <div>
                <label className="block font-semibold text-secondary mb-1">Diagnostic Test / Panel</label>
                <select
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                >
                  <option value="High-Sensitivity Cardiac Troponin I">High-Sensitivity Cardiac Troponin I</option>
                  <option value="Arterial Blood Gas (ABG) Panel">Arterial Blood Gas (ABG) Panel</option>
                  <option value="Complete Blood Count (CBC) with Diff">Complete Blood Count (CBC) with Diff</option>
                  <option value="Comprehensive Metabolic Panel (CMP)">Comprehensive Metabolic Panel (CMP)</option>
                  <option value="Serum Potassium & Electrolytes">Serum Potassium & Electrolytes</option>
                  <option value="Coagulation Panel (PT/INR, PTT)">Coagulation Panel (PT/INR, PTT)</option>
                  <option value="Blood Lactate STAT">Blood Lactate STAT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">Priority Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ROUTINE', 'URGENT', 'STAT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-2 rounded-lg font-mono font-bold text-center border ${
                        priority === p
                          ? p === 'STAT'
                            ? 'bg-error text-white border-error'
                            : 'bg-primary text-white border-primary'
                          : 'bg-surface border-outline-variant/40 text-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
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
                  Dispatch to Analyzer Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Result Modal */}
      {selectedOrderForResults && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface">Enter Verified Analyzer Result</h3>
                <span className="text-xs font-mono text-secondary">{selectedOrderForResults.orderNumber} • {selectedOrderForResults.patientName}</span>
              </div>
              <button onClick={() => setSelectedOrderForResults(null)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddResult} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">Analyte Parameter</label>
                <input
                  type="text"
                  value={paramName}
                  onChange={(e) => setParamName(e.target.value)}
                  required
                  placeholder="e.g. Troponin I, WBC, Potassium"
                  className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-secondary mb-1">Measured Value</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    required
                    placeholder="e.g. 1.45, 14.2"
                    className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-secondary mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. ng/mL, K/uL, mEq/L"
                    className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">Reference Range</label>
                <input
                  type="text"
                  value={refRange}
                  onChange={(e) => setRefRange(e.target.value)}
                  placeholder="e.g. < 0.04 ng/mL, 3.5 - 5.0"
                  className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-outline-variant/30">
                <input
                  type="checkbox"
                  id="abnormalToggle"
                  checked={isAbnormal}
                  onChange={(e) => setIsAbnormal(e.target.checked)}
                  className="rounded text-error"
                />
                <label htmlFor="abnormalToggle" className="font-semibold text-on-surface cursor-pointer">
                  Flag as Clinically Abnormal / Critical Value
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForResults(null)}
                  className="px-4 py-2 rounded-lg text-secondary hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold shadow-sm hover:bg-emerald-700"
                >
                  Sign & Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
