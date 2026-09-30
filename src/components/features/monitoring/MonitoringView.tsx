import React from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { Card } from '../../design-system/Card';
import { 
  Activity, 
  Server, 
  Radio, 
  Map, 
  Database, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';

export const MonitoringView: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      name: 'Central Dispatch REST API',
      id: 'api-service',
      status: 'Operational' as const,
      latency: 42,
      lastCheck: '1 sec ago',
      uptime: '99.98%',
      version: 'v4.1.2',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'WebSocket Telemetry Gateway',
      id: 'ws-gateway',
      status: 'Operational' as const,
      latency: 18,
      lastCheck: 'just now',
      uptime: '99.99%',
      version: 'v3.8.0',
      icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />,
    },
    {
      name: 'Geospatial Vector Map Tiles',
      id: 'map-tiles',
      status: 'Operational' as const,
      latency: 35,
      lastCheck: '3 sec ago',
      uptime: '100.0%',
      version: 'Leaflet CDN',
      icon: <Map className="w-4 h-4 text-sky-400" />,
    },
    {
      name: 'PostgreSQL Relational Shard',
      id: 'db-cluster',
      status: 'Operational' as const,
      latency: 12,
      lastCheck: '2 sec ago',
      uptime: '99.95%',
      version: 'pg-16.2',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Camera & Optical Intake Pipeline',
      id: 'camera-service',
      status: 'Operational' as const,
      latency: 24,
      lastCheck: '8 sec ago',
      uptime: '99.92%',
      version: 'WebRTC / WASM',
      icon: <Camera className="w-4 h-4 text-indigo-400" />,
    },
  ];

  // Realistic mock performance time-series
  const latencyData = [
    { time: '11:00', latency: 38, throughput: 120, sockets: 420 },
    { time: '11:05', latency: 42, throughput: 145, sockets: 432 },
    { time: '11:10', latency: 45, throughput: 180, sockets: 440 },
    { time: '11:15', latency: 39, throughput: 165, sockets: 448 },
    { time: '11:20', latency: 51, throughput: 210, sockets: 462 },
    { time: '11:25', latency: 47, throughput: 195, sockets: 470 },
    { time: '11:30', latency: 41, throughput: 185, sockets: 475 },
    { time: '11:35', latency: 43, throughput: 220, sockets: 480 },
    { time: '11:40', latency: 38, throughput: 235, sockets: 485 },
  ];

  const systemEvents = [
    {
      time: '11:41:02',
      source: 'Geo-Routing Cluster',
      event: 'Baku Central sub-graph re-indexed with live congestion matrices',
      level: 'INFO',
    },
    {
      time: '11:39:15',
      source: 'Telemetry Worker #3',
      event: 'GPS Accuracy threshold filter calibrated (±5m precision)',
      level: 'INFO',
    },
    {
      time: '11:35:40',
      source: 'Database Autoscaler',
      event: 'Read-replica pool capacity verified: 4 nodes active',
      level: 'SUCCESS',
    },
    {
      time: '11:28:11',
      source: 'Freight Intake Gateway',
      event: 'Batch scan validation synced 42 parcels to regional hub',
      level: 'INFO',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-left">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span>{t('monitoring_title')}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('monitoring_subtitle')}
        </p>
      </div>

      {/* Service Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {services.map((svc) => (
          <Card key={svc.id} className="p-3.5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                {svc.icon}
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {svc.status}
              </span>
            </div>

            <h3 className="text-xs font-semibold text-slate-200 truncate">
              {svc.name}
            </h3>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Latency</span>
                <span className="text-slate-200 font-bold">{svc.latency} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Uptime</span>
                <span className="text-emerald-400">{svc.uptime}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Latency & Response */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                {t('metric_latency')}
              </h3>
              <p className="text-[11px] text-slate-400">95th percentile response across API endpoints</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400">
              Avg: 41.6 ms
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#latencyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Throughput (Tasks Processed / min) */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                {t('metric_throughput')}
              </h3>
              <p className="text-[11px] text-slate-400">Real-time dispatched mission throughput</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Peak: 235 tasks/min
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="throughput" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* System Audit Timeline */}
      <Card className="p-4 bg-slate-900/80 border-slate-800">
        <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{t('system_events')}</span>
        </h3>

        <div className="space-y-2.5">
          {systemEvents.map((evt, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 shrink-0">
                  {evt.time}
                </span>
                <span className="font-mono text-[11px] text-blue-400 font-semibold shrink-0">
                  [{evt.source}]
                </span>
                <span className="text-slate-300">{evt.event}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 self-start sm:self-center">
                {evt.level}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
