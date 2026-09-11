import React, { useState } from 'react';
import { useHospitalStore } from '../store/useHospitalStore';

export const SecurityAuditTrail: React.FC = () => {
  const { auditLogs } = useHospitalStore();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = severityFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter((l) => l.severity === severityFilter);

  return (
    <div className="flex flex-col w-full p-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-secondary tracking-wider font-semibold">
              Enterprise System Governance & Traceability
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-mono text-primary font-bold">IMMUTABLE WRITE-ONCE</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-0.5">
            Security Audit Trail & Governance Matrix
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARN', 'INFO'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                severityFilter === s
                  ? s === 'CRITICAL'
                    ? 'bg-error text-on-error'
                    : s === 'WARN'
                    ? 'bg-amber-600 text-white'
                    : 'bg-primary text-on-primary'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
            <h3 className="font-bold text-sm text-on-surface">Cryptographically Verified Audit Stream</h3>
          </div>
          <span className="text-xs font-mono text-secondary">HIPAA / ISO-27799 Compliant Log Store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-[11px] font-mono text-secondary uppercase">
                <th className="py-2.5 px-4">Timestamp & IP</th>
                <th className="py-2.5 px-3">Actor (User / Role)</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity Reference</th>
                <th className="py-2.5 px-4">Audit Payload & Details</th>
                <th className="py-2.5 px-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-mono text-xs">
              {filteredLogs.map((log) => {
                const isCrit = log.severity === 'CRITICAL';
                return (
                  <tr key={log.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{log.timestamp}</div>
                      <span className="text-[10px] text-secondary">{log.ipAddress}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-bold text-on-surface">{log.user}</div>
                      <span className="text-[10px] text-primary">{log.role}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-primary">
                      {log.action}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-on-surface">
                        {log.entity}: {log.entityId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-secondary text-[11px] max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? 'bg-error-container text-error animate-pulse'
                            : log.severity === 'WARN'
                            ? 'bg-amber-100 text-amber-950'
                            : 'bg-surface-container text-secondary'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
