import React, { useState, useEffect } from 'react';

export const TelemetryTicker: React.FC = () => {
  const [timeStr, setTimeStr] = useState('14:28:49 EST');
  const [secondsRemaining, setSecondsRemaining] = useState(252); // 04m 12s

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EST');
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 252));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const countdownFormatted = `${minutes < 10 ? '0' : ''}${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  return (
    <div className="bg-surface-container-low border-b border-outline-variant/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Critical Priority Notice */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-error-container text-on-error-container">
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            LEVEL 1 CRITICAL PRIORITY
          </span>
        </div>
        <p className="text-xs text-on-surface">
          Resuscitation Bay 2: Trauma Inflow via MedEvac ETA{' '}
          <span className="font-mono font-bold text-error bg-error/10 px-1 rounded">{countdownFormatted}</span>. OR-3 on active bypass standby.
        </p>
      </div>

      {/* Real-time telemetry gauges */}
      <div className="flex items-center gap-5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-secondary uppercase">METRO GRID FREQUENCY</span>
          <span className="font-mono font-semibold text-on-surface">59.98 Hz</span>
        </div>
        <div className="w-px h-3 bg-outline-variant/50"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-secondary uppercase">CENTRAL O2 PRESSURE</span>
          <span className="font-mono font-semibold text-primary">4.32 bar (OPTIMAL)</span>
        </div>
        <div className="w-px h-3 bg-outline-variant/50"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-secondary uppercase">SYNCHRONIZED HL7</span>
          <span className="font-mono font-semibold text-secondary">{timeStr}</span>
        </div>
      </div>
    </div>
  );
};
