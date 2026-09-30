import React, { useState } from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { GisMap } from '../map/GisMap';
import { VehicleDetailPanel } from '../map/VehicleDetailPanel';
import { Card } from '../../design-system/Card';
import { TaskStatusBadge, PriorityBadge } from '../../design-system/StatusBadge';
import { 
  Truck, 
  CheckSquare, 
  Clock, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  Radio, 
  AlertCircle,
  Plus
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { vehicles, tasks, activityLogs, selectedVehicleId } = useFleetStore();
  const { setActivePage, setCreateTaskModalOpen } = useUIStore();

  const [rightPanelTab, setRightPanelTab] = useState<'vehicle' | 'activity'>('vehicle');

  // Stats calculation
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'ONLINE' || v.status === 'BUSY').length;
  const activeTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length;
  const criticalTasks = tasks.filter((t) => t.priority === 'Critical' && t.status !== 'Completed').length;
  const fleetUtilization = Math.round((activeVehicles / totalVehicles) * 100);

  // Recent 6 active tasks for the bottom quick operational view
  const recentTasks = tasks.slice(0, 6);

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 gap-4 overflow-y-auto">
      {/* 1. Operational Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Active Fleet */}
        <Card className="p-3 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('stat_total_vehicles')}</span>
            <Truck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              {activeVehicles}
            </span>
            <span className="text-[11px] font-mono text-slate-400">/ {totalVehicles} units</span>
          </div>
        </Card>

        {/* Active Missions */}
        <Card className="p-3 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('stat_active_tasks')}</span>
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              {activeTasks}
            </span>
            {criticalTasks > 0 && (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/30">
                {criticalTasks} critical
              </span>
            )}
          </div>
        </Card>

        {/* On-Time Rate */}
        <Card className="p-3 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('stat_on_time_rate')}</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              96.4%
            </span>
            <span className="text-[10px] font-mono text-emerald-400">+1.2%</span>
          </div>
        </Card>

        {/* Avg Response Time */}
        <Card className="p-3 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('stat_avg_response')}</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              8.4 min
            </span>
            <span className="text-[10px] font-mono text-slate-400">Baku sector</span>
          </div>
        </Card>

        {/* Fleet Utilization */}
        <Card className="p-3 bg-slate-900/80 border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('stat_fleet_utilization')}</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              {fleetUtilization}%
            </span>
            <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden self-center ml-2">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${fleetUtilization}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Main GIS Map (Left) & Right Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px] shrink-0">
        {/* Interactive GIS Map */}
        <div className="lg:col-span-8 h-full">
          <GisMap />
        </div>

        {/* Right Panel: Vehicle Detail / Real-time Activity Feed */}
        <div className="lg:col-span-4 h-full flex flex-col">
          {/* Segmented Tab Header */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg mb-2 shrink-0">
            <button
              onClick={() => setRightPanelTab('vehicle')}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                rightPanelTab === 'vehicle'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vehicle Telemetry
            </button>
            <button
              onClick={() => setRightPanelTab('activity')}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'activity'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Live Activity</span>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 min-h-0">
            {rightPanelTab === 'vehicle' ? (
              <VehicleDetailPanel />
            ) : (
              <Card className="h-full p-3 bg-slate-900/90 border-slate-800 overflow-y-auto flex flex-col text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Audit Stream
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{log.timestamp}</span>
                        {log.vehiclePlate && (
                          <span className="text-blue-400 font-semibold">{log.vehiclePlate}</span>
                        )}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Operational Queue Table */}
      <Card className="p-4 bg-slate-900/80 border-slate-800 shadow-xl text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Active Field Dispatch Queue
            </h3>
            <p className="text-xs text-slate-400">
              Live operational missions in flight across city corridors
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('new_task_btn')}</span>
            </button>

            <button
              onClick={() => setActivePage('operations')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <span>View All 75+ Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[11px]">
                <th className="py-2 px-3">Code</th>
                <th className="py-2 px-3">Task Details</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Driver</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3">Priority</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {recentTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-400">
                    {t.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200 max-w-[200px] truncate">
                    {t.title}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{t.customerName}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {t.driverName} <span className="font-mono text-slate-500 text-[11px]">({t.vehiclePlate})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{t.region}</td>
                  <td className="py-2.5 px-3">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="py-2.5 px-3">
                    <TaskStatusBadge status={t.status} />
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300 font-semibold">
                    {t.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
