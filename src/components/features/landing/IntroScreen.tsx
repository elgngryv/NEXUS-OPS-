import React from 'react';
import { useUIStore } from '../../../stores/useUIStore';
import { 
  Navigation, 
  Radio, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Code2
} from 'lucide-react';

export const IntroScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { setEngineeringModalOpen } = useUIStore();

  const capabilities = [
    {
      title: 'GIS Control',
      badge: 'Leaflet GIS',
      description: 'Multi-layer geospatial map with live orientation, accurate GPS rings, and coordinate pin mode.',
      icon: <Navigation className="w-5 h-5 text-sky-400" />,
    },
    {
      title: 'Real-Time State',
      badge: 'WebSocket Ready',
      description: 'High-frequency telemetry simulation engine tracking speed, battery health, and task ETAs.',
      icon: <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />,
    },
    {
      title: 'Operations Fleet',
      badge: 'High-Density Table',
      description: 'Enterprise task registry supporting multi-factor filters, pagination, and bulk status dispatch.',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Intelligent Automation',
      badge: 'AI Operations',
      description: 'Natural language queries returning structured, actionable fleet insights across city sectors.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#090d16] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center">
        {/* Brand Kicker */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 mb-6 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Enterprise B2B Logistics Infrastructure</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
          NEXUS <span className="text-blue-500">OPS</span>
        </h1>

        <p className="mt-3 text-base md:text-lg text-slate-400 max-w-xl font-normal">
          Real-Time Geospatial Operations & Fleet Telemetry Control Center
        </p>

        {/* 4 Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full my-8 text-left">
          {capabilities.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  {c.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                  {c.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{c.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>

        {/* Enter Control Center CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Open Control Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setEngineeringModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Engineering Specs</span>
          </button>
        </div>

        {/* Recruiter Footnote */}
        <div className="mt-8 text-xs text-slate-500 font-mono flex items-center gap-2">
          <span>Built with React + TypeScript</span>
          <span>·</span>
          <span>Zustand</span>
          <span>·</span>
          <span>Leaflet GIS</span>
          <span>·</span>
          <span>Azerbaijan Fleet Dataset</span>
        </div>
      </div>
    </div>
  );
};
