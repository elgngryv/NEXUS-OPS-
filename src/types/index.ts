export type Role = 'Operator' | 'Manager' | 'Admin';

export type VehicleStatus = 'ONLINE' | 'BUSY' | 'IDLE' | 'WARNING' | 'OFFLINE';

export type TaskStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type Region = 'Baku' | 'Yasamal' | 'Nəsimi' | 'Nərimanov' | 'Binəqədi' | 'Xətai' | 'Səbail' | 'Gəncə';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone: string;
  status: VehicleStatus;
  speed: number; // km/h
  battery: number; // %
  fuelLevel: number; // %
  heading: number; // degrees
  location: LatLng;
  gpsAccuracy: number; // ±m
  lastUpdate: string; // ISO or relative
  currentTaskId?: string;
  currentTaskTitle?: string;
  assignedRegion: Region;
  model: string;
  etaMinutes: number;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  customerName: string;
  customerPhone: string;
  address: string;
  region: Region;
  location: LatLng;
  driverName: string;
  vehiclePlate: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  eta: string;
  type: 'Delivery' | 'Emergency' | 'Inspection' | 'Service' | 'Supply';
  notes?: string;
  barcode?: string;
}

export interface CustomerLocation {
  id: string;
  name: string;
  address: string;
  region: Region;
  lat: number;
  lng: number;
  contactPerson: string;
  phone: string;
  category: 'Hospital' | 'Commercial' | 'Industrial' | 'Residential' | 'Government';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  vehiclePlate?: string;
  driverName?: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface BarcodeScanRecord {
  id: string;
  barcode: string;
  productName: string;
  status: 'Assigned' | 'Delivered' | 'In Transit' | 'Unknown';
  destination: string;
  timestamp: string;
  scannedBy: string;
}

export interface SystemServiceHealth {
  name: string;
  serviceId: string;
  status: 'Operational' | 'Degraded' | 'Offline';
  latencyMs: number;
  uptime: string;
  lastCheck: string;
  version: string;
}

export type ActiveNavPage = 
  | 'dashboard'
  | 'live-map'
  | 'operations'
  | 'vehicles'
  | 'tasks'
  | 'customers'
  | 'reports'
  | 'scanner'
  | 'monitoring'
  | 'settings';
