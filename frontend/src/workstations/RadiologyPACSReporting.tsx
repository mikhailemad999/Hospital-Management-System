import React, { useState } from 'react';

export const RadiologyPACSReporting: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<any | null>(null);

  const radiologyOrders = [
    {
      id: '1',
      orderNum: 'RAD-2026-1081',
      patient: 'Unidentified Trauma Male',
      mrn: 'MRN-ED-TEMP-01',
      modality: 'CT',
      study: 'CT Trauma Pan-Scan (Head, C-Spine, Chest, Abdomen, Pelvis)',
      priority: 'STAT',
      status: 'REPORTED',
      radiologist: 'Dr. Nathan Drake, MD',
      findings: 'Grade IV splenic laceration with active contrast extravasation into perisplenic space. Moderate hemoperitoneum. Displaced left 5th-8th rib fractures.',
      impression: 'Severe blunt abdominal trauma requiring immediate surgical intervention.',
    },
    {
      id: '2',
      orderNum: 'RAD-2026-1082',
      patient: 'Sophia Reynolds',
      mrn: 'MRN-33108',
      modality: 'ULTRASOUND',
      study: 'Ultrasound Appendix / Pelvis',
      priority: 'URGENT',
      status: 'REPORTED',
      radiologist: 'Dr. Lisa Wong, MD',
      findings: 'Non-compressible dilated appendix measuring 9.4mm in diameter with surrounding fat stranding and appendicolith.',
      impression: 'Findings consistent with acute appendicitis.',
    },
    {
      id: '3',
      orderNum: 'RAD-2026-1083',
      patient: 'Johnathan Miller',
      mrn: 'MRN-92810',
      modality: 'X-RAY',
      study: 'Portable Chest Radiograph (AP)',
      priority: 'STAT',
      status: 'REPORTED',
      radiologist: 'Dr. Nathan Drake, MD',
      findings: 'Endotracheal tube tip positioned 4.2cm above carina. Bilateral pulmonary vascular congestion with small left pleural effusion.',
      impression: 'Mild congestive failure; endotracheal position satisfactory.',
    },
  ];

  return (
    <div className="flex flex-col w-full p-6 pb-12">
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Studies List (2 Cols) */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
            <h3 className="font-bold text-sm text-on-surface">Imaging Examinations & Diagnostic Studies</h3>
            <span className="text-xs font-mono text-secondary">Modalities: CT • MRI • X-RAY • US</span>
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
                {radiologyOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedStudy(order)}
                    className="hover:bg-surface-container-low/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-mono font-bold mr-2">
                        {order.modality}
                      </span>
                      <span className="font-mono font-bold text-on-surface">{order.orderNum}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-on-surface">{order.patient}</p>
                      <span className="text-[10px] font-mono text-secondary">{order.mrn}</span>
                    </td>
                    <td className="py-3 px-3 text-secondary font-medium">{order.study}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-error-container text-error">
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudy(order)}
                        className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold"
                      >
                        Read Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Report Viewer (1 Col) */}
        {selectedStudy ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 space-y-4 text-xs">
            <div className="pb-3 border-b border-outline-variant/30">
              <span className="text-[10px] font-mono uppercase text-secondary font-bold">RADIOLOGICAL REPORT</span>
              <h2 className="text-base font-bold text-on-surface mt-0.5">{selectedStudy.study}</h2>
              <p className="text-secondary font-mono text-[11px] mt-0.5">
                {selectedStudy.patient} • {selectedStudy.mrn}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-secondary font-bold block mb-1">FINDINGS</span>
              <p className="p-3 rounded-lg bg-surface border border-outline-variant/30 leading-relaxed text-on-surface">
                {selectedStudy.findings}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-secondary font-bold block mb-1">IMPRESSION</span>
              <p className="p-3 rounded-lg bg-primary-container/10 border border-primary/20 leading-relaxed font-bold text-primary">
                {selectedStudy.impression}
              </p>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-secondary">
              <span>Dictated by: <strong className="text-on-surface">{selectedStudy.radiologist}</strong></span>
              <span className="font-mono text-emerald-700 font-bold">● SIGNED</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-8 text-center text-secondary text-xs flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[36px] mb-2 text-outline">radiology</span>
            <span>Select any study row from the worklist to display radiologist findings and PACS impressions.</span>
          </div>
        )}
      </div>
    </div>
  );
};
