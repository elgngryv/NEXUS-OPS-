import React from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { Card } from '../../design-system/Card';
import { PriorityBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import { CheckSquare, Plus, Clock, MapPin, Truck } from 'lucide-react';
import { TaskStatus } from '../../../types';

export const TasksView: React.FC = () => {
  const { tasks, updateTaskStatus } = useFleetStore();
  const { setCreateTaskModalOpen } = useUIStore();

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Pending', label: 'Pending Dispatch', color: 'border-amber-500/40 text-amber-400' },
    { status: 'Assigned', label: 'Assigned to Fleet', color: 'border-indigo-500/40 text-indigo-400' },
    { status: 'In Progress', label: 'In Transit / Progress', color: 'border-sky-500/40 text-sky-400' },
    { status: 'Completed', label: 'Delivered / Completed', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto text-left h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-400" />
            <span>Missions Pipeline & Dispatch Board</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational kanban board reflecting real-time dispatch states
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setCreateTaskModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {/* 4 Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl p-3 max-h-[75vh]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                {colTasks.slice(0, 15).map((task) => (
                  <Card key={task.id} className="p-3 bg-slate-950/80 border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-400">
                        {task.code}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                      {task.title}
                    </h4>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{task.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Truck className="w-3 h-3 text-slate-500" />
                          {task.vehiclePlate}
                        </span>
                        <span className="text-slate-400">ETA: {task.eta}</span>
                      </div>
                    </div>

                    {/* Quick Move Status buttons */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-1">
                      {col.status === 'Pending' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Assigned')}
                          className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30"
                        >
                          → Assign
                        </button>
                      )}
                      {col.status === 'Assigned' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'In Progress')}
                          className="px-2 py-0.5 text-[10px] rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30"
                        >
                          → In Transit
                        </button>
                      )}
                      {col.status === 'In Progress' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        >
                          ✓ Deliver
                        </button>
                      )}
                    </div>
                  </Card>
                ))}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No missions in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
