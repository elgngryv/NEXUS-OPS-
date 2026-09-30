import React from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { VehicleStatusBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import { 
  X, 
  Battery, 
  Fuel, 
  Gauge, 
  Radio, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Navigation
} from 'lucide-react';

export const VehicleDetailPanel: React.FC = () => {
  const { vehicles, selectedVehicleId, selectVehicle } = useFleetStore();
  const { setCreateTaskModalOpen } = useUIStore();
  const { t } = useTranslation();

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId);

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
        <Radio className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
        <p className="text-xs">{t('map_no_vehicle')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 p-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold tracking-tight text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {vehicle.plate}
            </span>
            <VehicleStatusBadge status={vehicle.status} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">{vehicle.model}</p>
        </div>
        <button
          onClick={() => selectVehicle(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close vehicle details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Driver Info */}
      <div className="py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-300 font-semibold text-xs">
            {vehicle.driverName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">{vehicle.driverName}</div>
            <div className="text-[11px] text-slate-400 font-mono">{vehicle.driverPhone}</div>
          </div>
        </div>
        <a
          href={`tel:${vehicle.driverPhone}`}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
          title={t('call_driver')}
        >
          <Phone className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2.5 py-3 border-b border-slate-800">
        {/* Speed */}
        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              {t('speed')}
            </span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-100">
            {vehicle.speed} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
        </div>

        {/* GPS Accuracy */}
        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              {t('gps_accuracy')}
            </span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-100">
            ±{vehicle.gpsAccuracy} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
        </div>

        {/* Battery */}
        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center gap-1">
              <Battery className="w-3 h-3 text-amber-400" />
              {t('battery')}
            </span>
            <span className="font-mono text-[10px] text-slate-300">{vehicle.battery}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                vehicle.battery < 25 ? 'bg-rose-500' : vehicle.battery < 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${vehicle.battery}%` }}
            />
          </div>
        </div>

        {/* Fuel */}
        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3 text-indigo-400" />
              {t('fuel')}
            </span>
            <span className="font-mono text-[10px] text-slate-300">{vehicle.fuelLevel}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${vehicle.fuelLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Task & Location */}
      <div className="py-3 border-b border-slate-800 flex flex-col gap-2.5 text-left">
        <div>
          <span className="text-[11px] text-slate-400">{t('current_task')}</span>
          <div className="mt-0.5 text-xs font-semibold text-slate-200">
            {vehicle.currentTaskId ? (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="font-mono">{vehicle.currentTaskId}:</span>
                <span className="truncate">{vehicle.currentTaskTitle}</span>
              </span>
            ) : (
              <span className="text-slate-500">Standby (No active mission)</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] text-slate-400">{t('eta')}</span>
            <div className="font-mono font-bold text-slate-200">
              {vehicle.etaMinutes > 0 ? `${vehicle.etaMinutes} min` : 'At location'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">{t('region')}</span>
            <div className="font-medium text-slate-200">{vehicle.assignedRegion}</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">{t('last_update')}</span>
            <div className="font-mono text-[11px] text-slate-300">{vehicle.lastUpdate}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800 font-mono">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{vehicle.location.lat.toFixed(5)}, {vehicle.location.lng.toFixed(5)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 mt-auto flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={<Send className="w-3.5 h-3.5" />}
          onClick={() => setCreateTaskModalOpen(true)}
          className="w-full"
        >
          {t('assign_task')}
        </Button>
      </div>
    </div>
  );
};
