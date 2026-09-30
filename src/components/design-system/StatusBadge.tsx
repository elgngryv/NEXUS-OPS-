import React from 'react';
import { VehicleStatus, TaskStatus, Priority } from '../../types';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md';
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    ONLINE: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse' },
    BUSY: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
    IDLE: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    WARNING: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dot: 'bg-rose-400 animate-ping' },
    OFFLINE: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', dot: 'bg-slate-500' },
  }[status] || { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', dot: 'bg-slate-500' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-md border ${
        config.bg
      } ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const styles = {
    Pending: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Assigned: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    'In Progress': 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    Completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Cancelled: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  }[status] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${styles}`}>
      <span>{status}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    Low: 'text-slate-400 border-slate-700 bg-slate-800/50',
    Medium: 'text-blue-400 border-blue-800/50 bg-blue-950/30',
    High: 'text-amber-400 border-amber-800/50 bg-amber-950/30',
    Critical: 'text-rose-400 border-rose-800/60 bg-rose-950/40 animate-pulse font-semibold',
  }[priority];

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[11px] rounded border ${styles}`}>
      {priority}
    </span>
  );
};
