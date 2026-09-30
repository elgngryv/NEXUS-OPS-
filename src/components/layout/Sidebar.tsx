import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useTranslation } from '../../i18n/useTranslation';
import { ActiveNavPage, Role } from '../../types';
import { 
  LayoutDashboard, 
  Map, 
  Layers, 
  Truck, 
  CheckSquare, 
  Users, 
  BarChart3, 
  QrCode, 
  Activity, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Code2,
  X
} from 'lucide-react';

interface NavItem {
  id: ActiveNavPage;
  labelKey: any;
  icon: React.ReactNode;
  allowedRoles: Role[];
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const {
    activePage,
    setActivePage,
    role,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    setEngineeringModalOpen,
  } = useUIStore();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'nav_dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
    },
    {
      id: 'live-map',
      labelKey: 'nav_liveMap',
      icon: <Map className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
      badge: 'LIVE',
    },
    {
      id: 'operations',
      labelKey: 'nav_operations',
      icon: <Layers className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
    },
    {
      id: 'vehicles',
      labelKey: 'nav_vehicles',
      icon: <Truck className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
    },
    {
      id: 'tasks',
      labelKey: 'nav_tasks',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
    },
    {
      id: 'customers',
      labelKey: 'nav_customers',
      icon: <Users className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Manager', 'Admin'],
    },
    {
      id: 'reports',
      labelKey: 'nav_reports',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Manager', 'Admin'],
    },
    {
      id: 'scanner',
      labelKey: 'nav_scanner',
      icon: <QrCode className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Operator', 'Manager', 'Admin'],
      badge: 'CAM',
    },
    {
      id: 'monitoring',
      labelKey: 'nav_monitoring',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Admin'],
      badge: '99.9%',
    },
    {
      id: 'settings',
      labelKey: 'nav_settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
      allowedRoles: ['Admin'],
    },
  ];

  // Filter based on dynamic role
  const accessibleNavItems = navItems.filter((item) => item.allowedRoles.includes(role));

  const renderContent = () => (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Brand / Nav Links */}
      <div className="flex flex-col">
        {/* Role Badge Container */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Shield className="w-3.5 h-3.5" />
              </span>
              {!isSidebarCollapsed && (
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    {t('currentRole')}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {role}
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="p-2 space-y-1">
          {accessibleNavItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={isSidebarCollapsed ? t(item.labelKey) : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{t(item.labelKey)}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Engineering Specs Trigger */}
      <div className="p-2 border-t border-slate-800/80">
        <button
          onClick={() => setEngineeringModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-blue-300 hover:bg-slate-800/60 transition-colors"
          title="Recruiter Engineering Specs"
        >
          <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
          {!isSidebarCollapsed && (
            <span className="truncate text-left font-mono text-[11px]">Engineering Specs</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-800 bg-[#090d16] transition-all duration-200 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {renderContent()}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-[#090d16] border-r border-slate-800 h-full z-10 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm tracking-tight text-white font-mono">
                NEXUS<span className="text-blue-500">OPS</span>
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
