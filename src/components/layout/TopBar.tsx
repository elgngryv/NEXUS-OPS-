import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useFleetStore } from '../../stores/useFleetStore';
import { useTranslation } from '../../i18n/useTranslation';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';
import { Role } from '../../types';
import { 
  Search, 
  Globe, 
  Radio, 
  Pause, 
  Play, 
  Sparkles, 
  Bell, 
  Shield, 
  User, 
  Code2, 
  Menu,
  ChevronDown,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const TopBar: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const {
    role,
    setRole,
    setCommandPaletteOpen,
    setAiAssistantOpen,
    setEngineeringModalOpen,
    toggleSidebar,
    setMobileSidebarOpen,
    isOnline,
    toggleOnlineStatus,
    unreadNotificationsCount,
    clearNotifications,
  } = useUIStore();

  const { isSimulationRunning, toggleSimulation } = useFleetStore();
  const { isInstallable, install } = usePWA();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-14 border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-md px-4 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
      {/* Zone 1: Mobile Toggle & Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-base tracking-tight text-white font-mono flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-sm shadow-blue-500/50" />
            NEXUS<span className="text-blue-500">OPS</span>
          </span>
          <span className="hidden xl:inline text-[11px] text-slate-400 font-normal border-l border-slate-700/80 pl-2">
            Geospatial Control Center
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search & Shortcut */}
      <div className="flex-1 max-w-md hidden md:flex items-center">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-colors shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{t('search_placeholder')}</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Telemetry, AI Assistant, Language, Role, Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live / Offline Network Indicator with manual toggle for testing */}
        <button
          onClick={toggleOnlineStatus}
          title={isOnline ? 'Online (Click to simulate offline)' : 'Offline (Click to restore)'}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-medium border transition-colors ${
            isOnline
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
              : 'bg-rose-950/40 text-rose-400 border-rose-800/60 animate-pulse'
          }`}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-[11px]">{t('status_live')}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline text-[11px]">{t('status_reconnecting')}</span>
            </>
          )}
        </button>

        {/* Simulation Pause / Resume */}
        <button
          onClick={toggleSimulation}
          title={isSimulationRunning ? t('pause_sim') : t('resume_sim')}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isSimulationRunning
              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/40'
          }`}
        >
          {isSimulationRunning ? (
            <>
              <Pause className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">Pause Sim</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-amber-400" />
              <span className="text-[11px]">Resume</span>
            </>
          )}
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-600/40 text-blue-300 hover:text-white hover:border-blue-500 transition-colors shadow-sm"
          title={t('open_ai_assistant')}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">AI Ops</span>
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Shield className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline font-mono">{role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-40 backdrop-blur-md">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {t('switchRole')}
              </div>
              {(['Operator', 'Manager', 'Admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    role === r ? 'text-blue-400 font-medium bg-blue-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] uppercase font-mono font-semibold">{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-40 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-40">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    language === lang.code ? 'text-blue-400 font-medium bg-blue-500/10' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {language === lang.code && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={clearNotifications}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={t('notifications')}
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* Engineering Specs & Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 text-xs font-bold hover:ring-2 hover:ring-blue-400/30 transition-all"
            title="User & Engineering Profile"
          >
            EQ
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-40">
              <div className="px-3 pb-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-white">Elgün Qarayev</div>
                <div className="text-[11px] text-slate-400 truncate">Senior Frontend Candidate</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {role} Level Access
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setEngineeringModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-blue-400 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Engineering Specs (Portfolio)</span>
                </button>

                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{t('install_pwa')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
