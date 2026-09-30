import React from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { Card } from '../../design-system/Card';
import { Users, MapPin, Phone, Building2 } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers } = useFleetStore();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          <span>Client Facilities & Destination Hubs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Directory of hospitals, commercial high-rises, and industrial depots across Azerbaijan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <Card key={c.id} className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{c.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 mt-1 inline-block">
                  {c.category}
                </span>
              </div>
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>

            <div className="pt-3 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{c.address} ({c.region})</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono">{c.phone}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{c.contactPerson}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>GPS: {c.lat.toFixed(4)}, {c.lng.toFixed(4)}</span>
                <span className="text-blue-400">Verified Geofence</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
