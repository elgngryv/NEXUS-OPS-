import React, { useEffect, useState } from 'react';
import { useFleetStore } from './stores/useFleetStore';
import { useUIStore } from './stores/useUIStore';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { CommandPalette } from './components/layout/CommandPalette';
import { EngineeringModal } from './components/layout/EngineeringModal';
import { TaskCreationModal } from './components/features/tasks/TaskCreationModal';
import { AiOperationsDrawer } from './components/features/ai-assistant/AiOperationsDrawer';
import { IntroScreen } from './components/features/landing/IntroScreen';

// Feature Views
import { MainDashboard } from './components/features/dashboard/MainDashboard';
import { GisMap } from './components/features/map/GisMap';
import { OperationsView } from './components/features/operations/OperationsView';
import { VehiclesView } from './components/features/vehicles/VehiclesView';
import { TasksView } from './components/features/tasks/TasksView';
import { CustomersView } from './components/features/customers/CustomersView';
import { ReportsView } from './components/features/reports/ReportsView';
import { BarcodeScannerView } from './components/features/scanner/BarcodeScannerView';
import { MonitoringView } from './components/features/monitoring/MonitoringView';
import { SettingsView } from './components/features/settings/SettingsView';

export default function App() {
  const { tickSimulation } = useFleetStore();
  const { activePage } = useUIStore();

  // Control whether the user sees the Case Study Intro entry screen first
  // Initialized to true as requested in Requirement 18:
  // "Before entering the dashboard, create a minimal professional intro screen."
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  // Real-time telemetry simulation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      tickSimulation();
    }, 2500);

    return () => clearInterval(timer);
  }, [tickSimulation]);

  if (!hasEnteredApp) {
    return (
      <>
        <IntroScreen onEnter={() => setHasEnteredApp(true)} />
        <EngineeringModal />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <MainDashboard />;
      case 'live-map':
        return (
          <div className="flex-1 p-3 sm:p-4 h-full flex flex-col">
            <GisMap />
          </div>
        );
      case 'operations':
        return <OperationsView />;
      case 'vehicles':
        return <VehiclesView />;
      case 'tasks':
        return <TasksView />;
      case 'customers':
        return <CustomersView />;
      case 'reports':
        return <ReportsView />;
      case 'scanner':
        return <BarcodeScannerView />;
      case 'monitoring':
        return <MonitoringView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans">
      {/* Offline Mode Banner (PWA) */}
      <OfflineBanner />

      {/* Strict One-Row Top Bar Contract */}
      <TopBar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible Sidebar */}
        <Sidebar />

        {/* Center / Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#0b0f19] relative pb-16 lg:pb-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (lg:hidden) */}
      <MobileNav />

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette />

      {/* Task Creation Multi-Step Wizard Modal */}
      <TaskCreationModal />

      {/* Recruiter Engineering Architecture Modal */}
      <EngineeringModal />

      {/* AI Operations Copilot Drawer */}
      <AiOperationsDrawer />
    </div>
  );
}
