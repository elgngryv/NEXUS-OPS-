import React from 'react';
import { Card } from '../../design-system/Card';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export const ReportsView: React.FC = () => {
  const performanceByRegion = [
    { region: 'Nəsimi', completed: 18, delayed: 1, onTimePct: 94.7 },
    { region: 'Səbail', completed: 14, delayed: 0, onTimePct: 100 },
    { region: 'Nərimanov', completed: 16, delayed: 2, onTimePct: 88.8 },
    { region: 'Yasamal', completed: 12, delayed: 1, onTimePct: 92.3 },
    { region: 'Xətai', completed: 15, delayed: 1, onTimePct: 93.7 },
    { region: 'Binəqədi', completed: 9, delayed: 0, onTimePct: 100 },
    { region: 'Gəncə', completed: 8, delayed: 1, onTimePct: 88.8 },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>Operational Dispatch Reports & SLA Metrics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Weekly delivery completion, regional turnaround latency, and fleet uptime
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider mb-4">
            Completed Missions by Region
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider mb-4">
            SLA On-Time Completion Rate (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[80, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="onTimePct" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="On-Time %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
