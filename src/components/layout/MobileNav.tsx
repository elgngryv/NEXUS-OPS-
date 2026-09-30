import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { 
  LayoutDashboard, 
  Map, 
  CheckSquare, 
  Bell, 
  User, 
  Layers
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, setEngineeringModalOpen, unreadNotificationsCount, clearNotifications } = useUIStore();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#090d16]/95 border-t border-slate-800 z-30 flex items-center justify-around px-2 backdrop-blur-md">
      <button
        onClick={() => setActivePage('dashboard')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activePage === 'dashboard' ? 'text-blue-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span>Dash</span>
      </button>

      <button
        onClick={() => setActivePage('live-map')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activePage === 'live-map' ? 'text-blue-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Map className="w-4 h-4 mb-0.5" />
        <span>Map</span>
      </button>

      <button
        onClick={() => setActivePage('operations')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activePage === 'operations' ? 'text-blue-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <Layers className="w-4 h-4 mb-0.5" />
        <span>Ops</span>
      </button>

      <button
        onClick={() => setActivePage('tasks')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
          activePage === 'tasks' ? 'text-blue-400 font-semibold' : 'text-slate-400'
        }`}
      >
        <CheckSquare className="w-4 h-4 mb-0.5" />
        <span>Tasks</span>
      </button>

      <button
        onClick={() => {
          clearNotifications();
          setEngineeringModalOpen(true);
        }}
        className="flex flex-col items-center justify-center w-14 py-1 text-[10px] text-slate-400 relative"
      >
        <User className="w-4 h-4 mb-0.5" />
        <span>Profile</span>
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500" />
        )}
      </button>
    </nav>
  );
};
