import React from 'react';

export const LaboratoryDiagnostics: React.FC = () => {
  const labOrders = [
    { id: '1', orderNum: 'LAB-2026-4401', patient: 'Johnathan Miller', mrn: 'MRN-92810', test: 'High-Sensitivity Cardiac Troponin I', priority: 'STAT', status: 'COMPLETED', result: '1.45 ng/mL (CRITICAL HIGH)', ref: '< 0.04 ng/mL', abnormal: true },
    { id: '2', orderNum: 'LAB-2026-4402', patient: 'Fatima Al-Sayed', mrn: 'MRN-84729', test: 'Arterial Blood Gas (ABG) Panel', priority: 'STAT', status: 'COMPLETED', result: 'pH 6.92, pCO2 22, HCO3 6', ref: 'pH 7.35 - 7.45', abnormal: true },
    { id: '3', orderNum: 'LAB-2026-4403', patient: 'Sophia Reynolds', mrn: 'MRN-33108', test: 'Complete Blood Count (CBC) with Diff', priority: 'ROUTINE', status: 'COMPLETED', result: 'WBC 14.2 K/uL, Hgb 12.8', ref: 'WBC 4.5 - 11.0', abnormal: true },
    { id: '4', orderNum: 'LAB-2026-4404', patient: 'Robert Martinez', mrn: 'MRN-55214', test: 'Serum Potassium & Electrolytes', priority: 'ROUTINE', status: 'ANALYZING', result: 'In Analyzer', ref: 'K+ 3.5 - 5.0 mEq/L', abnormal: false },
  ];

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Clinical Pathology & Molecular Diagnostics
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">ANALYZER ONLINE</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Laboratory Diagnostics & Sample Tracking Worklist
          </h1>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface">Active Pathology Orders & Analyzer Verification</h3>
          <span className="text-xs font-mono text-secondary">LIS Barcode Tracking</span>
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
                <th className="py-2.5 px-4">Reference Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {labOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{order.orderNum}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-on-surface">{order.patient}</p>
                    <span className="text-[10px] font-mono text-secondary">{order.mrn}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-on-surface">{order.test}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        order.priority === 'STAT' ? 'bg-error-container text-error animate-pulse' : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-mono font-bold">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={order.abnormal ? 'text-error' : 'text-on-surface'}>{order.result}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary text-[11px]">{order.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
