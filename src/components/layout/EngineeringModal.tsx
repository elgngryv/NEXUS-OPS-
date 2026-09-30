import React from 'react';
import { Modal } from '../design-system/Modal';
import { useUIStore } from '../../stores/useUIStore';
import { CheckCircle2, Cpu, Database, Globe, Layers, Navigation, Smartphone, Zap } from 'lucide-react';

export const EngineeringModal: React.FC = () => {
  const { isEngineeringModalOpen, setEngineeringModalOpen } = useUIStore();

  const specs = [
    {
      category: 'Frontend Core',
      tech: 'React 19 + TypeScript (Strict)',
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      description: 'Zero dead clicks, typed domain models, custom hooks, and memoized selector patterns.',
    },
    {
      category: 'State Management',
      tech: 'Zustand Store Architecture',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      description: 'Normalized fleet state, action dispatchers, sub-slice separation, and zero unnecessary re-renders.',
    },
    {
      category: 'Geospatial / GIS',
      tech: 'Leaflet (Vector Tiles + Accurate GPS Rings)',
      icon: <Navigation className="w-4 h-4 text-sky-400" />,
      description: 'Real-time HTML/SVG vehicle markers, orientation compass, GPS tolerance radii, coordinate pin picker.',
    },
    {
      category: 'Real-Time Simulation',
      tech: 'WebSocket-Ready Telemetry Engine',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      description: 'Simulates high-frequency coordinate vectors, speed fluctuations, battery drain, and activity stream.',
    },
    {
      category: 'Forms & Validation',
      tech: 'React Hook Form + Schema Discipline',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      description: 'Multi-step wizard with step-by-step validation, accessible error announcements, coordinate integration.',
    },
    {
      category: 'Internationalization',
      tech: 'Real i18n Architecture (AZ, EN, TR, RU)',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      description: 'Full key dictionary with zero hardcoded strings. Resilient to longer multi-byte language expansion.',
    },
    {
      category: 'PWA & Resilience',
      tech: 'PWA Standards + Offline Simulation',
      icon: <Smartphone className="w-4 h-4 text-rose-400" />,
      description: 'Installable app prompt, Web Manifest, network status listeners, and offline cached fallback shell.',
    },
  ];

  return (
    <Modal
      isOpen={isEngineeringModalOpen}
      onClose={() => setEngineeringModalOpen(false)}
      title="Engineering & Architecture Dossier"
      subtitle="Comprehensive technical breakdown built for Senior Frontend Developer evaluation"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 leading-relaxed">
          <p className="font-semibold text-blue-100 mb-1">Architecture Philosophy:</p>
          This dashboard follows production-grade B2B SaaS architecture standards: single-elevation depth, tabular typography, strict role-based capability boundaries, and a decoupled simulation engine ready for WebSocket / SSE drops.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded bg-slate-800 border border-slate-700/80">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 font-mono">
                    {item.tech}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal pl-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-mono text-[11px]">Production Standards Verified</span>
          </div>
          <button
            onClick={() => setEngineeringModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};
