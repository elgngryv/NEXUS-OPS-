import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { usePWA } from '../../hooks/usePWA';
import { WifiOff, Clock } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline: simulatedOnline } = useUIStore();
  const { isOnline: browserOnline } = usePWA();

  const isActuallyOnline = simulatedOnline && browserOnline;

  if (isActuallyOnline) return null;

  return (
    <div className="bg-amber-600/90 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg border-b border-amber-500/50 backdrop-blur-sm z-40 relative">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>You are currently operating in Offline Cached Shell Mode. Telemetry updates are buffered locally.</span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] opacity-90">
        <Clock className="w-3.5 h-3.5" />
        <span>Last synchronized: 11:42 AM</span>
      </div>
    </div>
  );
};
