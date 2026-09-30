import { create } from 'zustand';
import { Role, ActiveNavPage } from '../types';
import { SupportedLanguage } from '../i18n/translations';

interface UIState {
  role: Role;
  language: SupportedLanguage;
  activePage: ActiveNavPage;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isEngineeringModalOpen: boolean;
  isAiAssistantOpen: boolean;
  isIntroModalOpen: boolean;
  isOnline: boolean;
  unreadNotificationsCount: number;

  // Actions
  setRole: (role: Role) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setActivePage: (page: ActiveNavPage) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCreateTaskModalOpen: (open: boolean) => void;
  setEngineeringModalOpen: (open: boolean) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setIntroModalOpen: (open: boolean) => void;
  toggleOnlineStatus: () => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  role: 'Operator',
  language: 'az',
  activePage: 'dashboard',
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isCommandPaletteOpen: false,
  isCreateTaskModalOpen: false,
  isEngineeringModalOpen: false,
  isAiAssistantOpen: false,
  isIntroModalOpen: false, // will allow user to open anytime from header/menu or initial entry
  isOnline: true,
  unreadNotificationsCount: 3,

  setRole: (role) => set({ role }),
  setLanguage: (language) => set({ language }),
  setActivePage: (activePage) => set({ activePage, isMobileSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  setCreateTaskModalOpen: (isCreateTaskModalOpen) => set({ isCreateTaskModalOpen }),
  setEngineeringModalOpen: (isEngineeringModalOpen) => set({ isEngineeringModalOpen }),
  setAiAssistantOpen: (isAiAssistantOpen) => set({ isAiAssistantOpen }),
  setIntroModalOpen: (isIntroModalOpen) => set({ isIntroModalOpen }),
  toggleOnlineStatus: () => set((state) => ({ isOnline: !state.isOnline })),
  clearNotifications: () => set({ unreadNotificationsCount: 0 }),
}));
