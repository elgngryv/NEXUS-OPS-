import React, { useState } from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { Card } from '../../design-system/Card';
import { VehicleStatusBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import { 
  Truck, 
  Battery, 
  Fuel, 
  Gauge, 
  MapPin, 
  Phone, 
  Navigation, 
  Search, 
  Radio,
  Clock
} from 'lucide-react';
import { VehicleStatus } from '../../../types';

export const VehiclesView: React.FC = () => {
  const { t } = useTranslation();
  const { vehicles, selectVehicle } = useFleetStore();
  const { setActivePage } = useUIStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        v.plate.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.assignedRegion.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    return true;
  });

  const handleFocusOnMap = (id: string) => {
    selectVehicle(id);
    setActivePage('live-map');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <span>Fleet Inventory & Asset Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active monitoring of {vehicles.length} commercial and emergency transport units
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plate or driver..."
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">ONLINE</option>
            <option value="BUSY">BUSY</option>
            <option value="IDLE">IDLE</option>
            <option value="WARNING">WARNING</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Grid of Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <Card key={v.id} className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {v.plate}
                  </span>
                  <VehicleStatusBadge status={v.status} size="sm" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{v.model}</div>
              </div>
              <button
                onClick={() => handleFocusOnMap(v.id)}
                className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-colors"
                title="Focus on Map"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>

            {/* Driver */}
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Driver</span>
                <span className="font-semibold text-slate-200">{v.driverName}</span>
              </div>
              <a
                href={`tel:${v.driverPhone}`}
                className="text-slate-400 hover:text-blue-400 font-mono text-[11px] flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {v.driverPhone}
              </a>
            </div>

            {/* Telemetry Stats */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800 text-center font-mono">
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block uppercase">Speed</span>
                <span className="text-xs font-bold text-slate-200">{v.speed} km/h</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block uppercase">Battery</span>
                <span className="text-xs font-bold text-amber-400">{v.battery}%</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block uppercase">GPS</span>
                <span className="text-xs font-bold text-emerald-400">±{v.gpsAccuracy}m</span>
              </div>
            </div>

            {/* Current Mission & Region */}
            <div className="pt-3 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Region:</span>
                <span className="text-slate-200 font-medium">{v.assignedRegion}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Last Ping:</span>
                <span className="text-slate-400 font-mono">{v.lastUpdate}</span>
              </div>
              {v.currentTaskTitle && (
                <div className="p-2 rounded bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-300 truncate mt-1">
                  <span className="font-mono font-bold">{v.currentTaskId}:</span> {v.currentTaskTitle}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
