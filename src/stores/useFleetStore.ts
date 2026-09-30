import { create } from 'zustand';
import { Vehicle, Task, CustomerLocation, ActivityLog, BarcodeScanRecord, LatLng, TaskStatus } from '../types';
import { INITIAL_VEHICLES, INITIAL_CUSTOMERS, generateInitialTasks, INITIAL_ACTIVITY_LOGS } from '../services/mockData';

export type MapLayerType = 'dark' | 'satellite' | 'streets';

interface FleetState {
  vehicles: Vehicle[];
  tasks: Task[];
  customers: CustomerLocation[];
  activityLogs: ActivityLog[];
  selectedVehicleId: string | null;
  selectedTaskId: string | null;
  mapLayer: MapLayerType;
  isPinModeActive: boolean;
  pinnedLocation: LatLng | null;
  isSimulationRunning: boolean;
  simulationTicks: number;
  scannedRecords: BarcodeScanRecord[];
  
  // Actions
  selectVehicle: (id: string | null) => void;
  selectTask: (id: string | null) => void;
  setMapLayer: (layer: MapLayerType) => void;
  setPinMode: (active: boolean) => void;
  setPinnedLocation: (loc: LatLng | null) => void;
  toggleSimulation: () => void;
  tickSimulation: () => void;
  createTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  bulkUpdateTasksStatus: (taskIds: string[], status: TaskStatus) => void;
  addScannedRecord: (record: Omit<BarcodeScanRecord, 'id' | 'timestamp'>) => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  vehicles: INITIAL_VEHICLES,
  tasks: generateInitialTasks(),
  customers: INITIAL_CUSTOMERS,
  activityLogs: INITIAL_ACTIVITY_LOGS,
  selectedVehicleId: 'v-101',
  selectedTaskId: null,
  mapLayer: 'dark',
  isPinModeActive: false,
  pinnedLocation: null,
  isSimulationRunning: true,
  simulationTicks: 0,
  scannedRecords: [
    {
      id: 'scan-1',
      barcode: '86900048218',
      productName: 'Medical Diagnostic Supply Kit',
      status: 'Assigned',
      destination: 'Baku Medical Center',
      timestamp: '11:30:12',
      scannedBy: 'Elvin Məmmədov',
    },
    {
      id: 'scan-2',
      barcode: '86900048243',
      productName: 'Cold Chain Vaccine Vial Batch #88',
      status: 'In Transit',
      destination: 'Yasamal Innovation Hub',
      timestamp: '11:15:40',
      scannedBy: 'Kamran Quliyev',
    },
    {
      id: 'scan-3',
      barcode: '86900048251',
      productName: 'Hydraulic Seal Replacement Units',
      status: 'Delivered',
      destination: 'Binəqədi Sənaye Zonası',
      timestamp: '10:52:19',
      scannedBy: 'Rauf İbrahimov',
    }
  ],

  selectVehicle: (id) => set({ selectedVehicleId: id }),
  selectTask: (id) => set({ selectedTaskId: id }),
  setMapLayer: (layer) => set({ mapLayer: layer }),
  setPinMode: (active) => set({ isPinModeActive: active }),
  setPinnedLocation: (loc) => set({ pinnedLocation: loc }),
  toggleSimulation: () => set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),

  tickSimulation: () => {
    const { isSimulationRunning, vehicles, simulationTicks, activityLogs } = get();
    if (!isSimulationRunning) return;

    const newTicks = simulationTicks + 1;

    // Move online and busy vehicles slightly along continuous trajectories
    const updatedVehicles = vehicles.map((v, index) => {
      if (v.status === 'OFFLINE') return v;

      if (v.status === 'IDLE') {
        // Occasionally switch idle to busy or change pings
        return {
          ...v,
          lastUpdate: `${(index * 3 + newTicks) % 25} sec ago`,
        };
      }

      // Smooth coordinate drift
      const speedVariation = Math.sin(newTicks * 0.5 + index) * 4;
      const currentSpeed = Math.max(15, Math.min(85, Math.round(v.speed + speedVariation)));
      
      const angle = (v.heading + (index % 2 === 0 ? 1 : -1) * 3) % 360;
      const rad = (angle * Math.PI) / 180;
      const step = 0.00035 * (currentSpeed / 40);

      const newLat = v.location.lat + Math.cos(rad) * step;
      const newLng = v.location.lng + Math.sin(rad) * step;

      // Slight battery drain
      const newBattery = Math.max(8, Number((v.battery - 0.05).toFixed(1)));
      const newEta = v.etaMinutes > 1 ? v.etaMinutes - (newTicks % 15 === 0 ? 1 : 0) : 1;

      return {
        ...v,
        location: { lat: newLat, lng: newLng },
        speed: currentSpeed,
        heading: angle,
        battery: newBattery,
        etaMinutes: newEta,
        lastUpdate: 'just now',
        gpsAccuracy: Math.round(5 + Math.random() * 4),
      };
    });

    // Periodically add realistic activity event
    let newLogs = activityLogs;
    if (newTicks % 4 === 0) {
      const activeV = updatedVehicles[newTicks % updatedVehicles.length];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const eventTypes: ActivityLog['type'][] = ['info', 'success', 'warning'];
      const chosenType = activeV.status === 'WARNING' ? 'warning' : eventTypes[newTicks % eventTypes.length];
      
      const messages = [
        `GPS Telemetry ping refreshed: ${activeV.plate} (${activeV.speed} km/h) in ${activeV.assignedRegion}`,
        `Waypoint verified: ${activeV.driverName} reached sector waypoint`,
        `Route optimization computed for ${activeV.plate} — ETA ${activeV.etaMinutes} min`,
        `Asset status validated: Battery ${activeV.battery}% / Fuel ${activeV.fuelLevel}%`,
      ];

      const newLogItem: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        vehiclePlate: activeV.plate,
        driverName: activeV.driverName,
        message: messages[newTicks % messages.length],
        type: chosenType,
      };

      newLogs = [newLogItem, ...activityLogs.slice(0, 19)];
    }

    set({
      vehicles: updatedVehicles,
      simulationTicks: newTicks,
      activityLogs: newLogs,
    });
  },

  createTask: (newTaskData) => {
    const { tasks, activityLogs } = get();
    const newId = `task-${tasks.length + 1}`;
    const codeNum = 4900 + tasks.length;
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const createdTask: Task = {
      ...newTaskData,
      id: newId,
      code: `TSK-${codeNum}`,
      createdAt: timeStr,
    };

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: now.toTimeString().split(' ')[0],
      vehiclePlate: createdTask.vehiclePlate,
      driverName: createdTask.driverName,
      message: `New mission dispatched: ${createdTask.code} for ${createdTask.customerName}`,
      type: 'success',
    };

    set({
      tasks: [createdTask, ...tasks],
      activityLogs: [newLog, ...activityLogs],
    });

    return createdTask;
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  },

  bulkUpdateTasksStatus: (taskIds, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (taskIds.includes(t.id) ? { ...t, status } : t)),
    }));
  },

  addScannedRecord: (record) => {
    const newRecord: BarcodeScanRecord = {
      ...record,
      id: `scan-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
    };
    set((state) => ({
      scannedRecords: [newRecord, ...state.scannedRecords],
    }));
  },
}));
