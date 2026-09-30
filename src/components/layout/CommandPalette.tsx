import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useFleetStore } from '../../stores/useFleetStore';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  Search, 
  LayoutDashboard, 
  Map, 
  Layers, 
  PlusCircle, 
  Truck, 
  QrCode, 
  Globe, 
  X,
  Code2
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    setActivePage, 
    setCreateTaskModalOpen,
    setEngineeringModalOpen,
    setLanguage
  } = useUIStore();

  const { vehicles, selectVehicle } = useFleetStore();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'cmd-dash',
      label: 'Go to Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-blue-400" />,
      run: () => {
        setActivePage('dashboard');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-map',
      label: 'Go to Live Map (GIS)',
      icon: <Map className="w-4 h-4 text-emerald-400" />,
      run: () => {
        setActivePage('live-map');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-ops',
      label: 'Go to Operations Registry',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      run: () => {
        setActivePage('operations');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-create',
      label: 'Create New Task (Multi-step)',
      icon: <PlusCircle className="w-4 h-4 text-amber-400" />,
      run: () => {
        setCreateTaskModalOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-scanner',
      label: 'Open Barcode & Freight Scanner',
      icon: <QrCode className="w-4 h-4 text-purple-400" />,
      run: () => {
        setActivePage('scanner');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-lang-en',
      label: 'Switch Language to English (EN)',
      icon: <Globe className="w-4 h-4 text-slate-400" />,
      run: () => {
        setLanguage('en');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-lang-az',
      label: 'Dili Azərbaycan dilinə dəyiş (AZ)',
      icon: <Globe className="w-4 h-4 text-slate-400" />,
      run: () => {
        setLanguage('az');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-eng',
      label: 'View Engineering Architecture Specs',
      icon: <Code2 className="w-4 h-4 text-cyan-400" />,
      run: () => {
        setEngineeringModalOpen(true);
        setCommandPaletteOpen(false);
      },
    },
  ];

  // Also include matching vehicle items
  const matchingVehicles = vehicles
    .filter((v) =>
      v.plate.toLowerCase().includes(query.toLowerCase()) ||
      v.driverName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-100"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or vehicle plate..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-500 hover:text-slate-300"
          >
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {matchingVehicles.length > 0 && (
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Fleet Assets
            </div>
          )}
          {matchingVehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                selectVehicle(v.id);
                setActivePage('live-map');
                setCommandPaletteOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span className="font-mono font-semibold">{v.plate}</span>
                <span className="text-slate-400">— {v.driverName}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{v.status}</span>
            </button>
          ))}

          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Commands & Navigation
          </div>
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={action.run}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
            >
              {action.icon}
              <span className="flex-1">{action.label}</span>
              <kbd className="text-[10px] font-mono text-slate-500">↵</kbd>
            </button>
          ))}

          {filteredActions.length === 0 && matchingVehicles.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              No matching commands or fleet assets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
