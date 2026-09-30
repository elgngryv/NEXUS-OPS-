import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { 
  Layers, 
  Crosshair, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Radio, 
  Navigation,
  Maximize2
} from 'lucide-react';
import { VehicleStatus } from '../../../types';

export const GisMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { t } = useTranslation();
  const {
    vehicles,
    customers,
    selectedVehicleId,
    selectVehicle,
    mapLayer,
    setMapLayer,
    isPinModeActive,
    setPinMode,
    pinnedLocation,
    setPinnedLocation,
  } = useFleetStore();

  const [localSearch, setLocalSearch] = useState('');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>([40.3953, 49.8622]);

  // Tile layer URLs
  const getTileUrl = (layer: string) => {
    switch (layer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'streets':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      case 'dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered at Baku central coordination
    const map = L.map(mapContainerRef.current, {
      center: [40.3854, 49.8672],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Pin mode click listener
    map.on('click', (e: L.LeafletMouseEvent) => {
      const store = useFleetStore.getState();
      if (store.isPinModeActive) {
        store.setPinnedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer on Layer Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(getTileUrl(mapLayer), {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [mapLayer]);

  // Status colors helper
  const getStatusHex = (status: VehicleStatus) => {
    switch (status) {
      case 'ONLINE':
        return '#10b981'; // emerald
      case 'BUSY':
        return '#3b82f6'; // blue
      case 'IDLE':
        return '#f59e0b'; // amber
      case 'WARNING':
        return '#f43f5e'; // rose
      case 'OFFLINE':
      default:
        return '#64748b'; // slate
    }
  };

  // Render Vehicles, Customers, Accuracy Circles, and Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Accuracy Circle for selected vehicle
    if (selectedVehicleId) {
      const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (selectedVehicle) {
        const accuracyCircle = L.circle(
          [selectedVehicle.location.lat, selectedVehicle.location.lng],
          {
            radius: selectedVehicle.gpsAccuracy * 10, // Visual scale for clarity
            color: getStatusHex(selectedVehicle.status),
            fillColor: getStatusHex(selectedVehicle.status),
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '4, 4',
          }
        );
        accuracyCircle.addTo(layerGroup);
        accuracyCircleRef.current = accuracyCircle;
      }
    }

    // Vehicle markers
    vehicles.forEach((vehicle) => {
      const isSelected = vehicle.id === selectedVehicleId;
      const statusColor = getStatusHex(vehicle.status);

      const html = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          ${isSelected ? `
            <div class="absolute -inset-2.5 rounded-full bg-blue-500/20 animate-ping"></div>
            <div class="absolute -inset-1.5 rounded-full border border-blue-400/80"></div>
          ` : ''}
          <div class="flex items-center gap-1.5 bg-slate-900/90 text-white px-2 py-1 rounded-lg border shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
               style="border-color: ${statusColor};">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${statusColor}; box-shadow: 0 0 8px ${statusColor};"></div>
            <div class="flex flex-col text-left">
              <span class="text-[10px] font-mono font-bold tracking-tight text-slate-100">${vehicle.plate}</span>
              <span class="text-[9px] text-slate-400 font-sans truncate max-w-[80px]">${vehicle.driverName.split(' ')[0]}</span>
            </div>
            <div class="text-[10px] text-slate-300 font-mono ml-0.5" style="transform: rotate(${vehicle.heading}deg);">
              ▲
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: html,
        iconSize: [100, 36],
        iconAnchor: [50, 18],
      });

      const marker = L.marker([vehicle.location.lat, vehicle.location.lng], { icon: customIcon });

      marker.on('click', () => {
        selectVehicle(vehicle.id);
      });

      marker.addTo(layerGroup);
    });

    // Customer / Destination Markers
    customers.forEach((cust) => {
      const custHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          <div class="w-7 h-7 rounded-full bg-indigo-950/90 border border-indigo-400/60 shadow-lg flex items-center justify-center text-indigo-300 hover:scale-110 transition-transform">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-900 text-slate-100 text-[10px] rounded border border-slate-700 shadow-xl whitespace-nowrap pointer-events-none z-50">
            ${cust.name}
          </div>
        </div>
      `;

      const custIcon = L.divIcon({
        className: 'custom-customer-marker',
        html: custHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const custMarker = L.marker([cust.lat, cust.lng], { icon: custIcon });
      custMarker.bindPopup(`
        <div class="p-3 text-left">
          <div class="text-xs font-bold text-slate-100">${cust.name}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${cust.address}</div>
          <div class="text-[11px] text-blue-400 mt-1 font-mono">${cust.phone}</div>
          <div class="text-[10px] text-slate-500 mt-1">Category: ${cust.category}</div>
        </div>
      `);
      custMarker.addTo(layerGroup);
    });

    // Pinned Location Marker (when dispatcher clicks on map)
    if (pinnedLocation) {
      const pinHtml = `
        <div class="relative" style="transform: translate(-50%, -100%);">
          <div class="p-1 bg-amber-500 rounded-full text-slate-950 shadow-xl animate-bounce">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `;
      const pinIcon = L.divIcon({
        className: 'pinned-coord-marker',
        html: pinHtml,
        iconSize: [24, 30],
        iconAnchor: [12, 30],
      });
      const pinMarker = L.marker([pinnedLocation.lat, pinnedLocation.lng], { icon: pinIcon });
      pinMarker.addTo(layerGroup);
    }

    // Operator location indicator (Locate me)
    if (userCoords) {
      const userHtml = `
        <div class="relative" style="transform: translate(-50%, -50%);">
          <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg"></div>
          <div class="absolute -inset-1.5 rounded-full bg-cyan-400/40 animate-ping"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'user-loc-marker',
        html: userHtml,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      userMarkerRef.current = L.marker(userCoords, { icon: userIcon }).addTo(layerGroup);
    }

  }, [vehicles, customers, selectedVehicleId, pinnedLocation, userCoords]);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords([lat, lng]);
          mapInstanceRef.current?.flyTo([lat, lng], 15, { duration: 1.2 });
        },
        () => {
          // Default Baku Central HQ
          setUserCoords([40.3953, 49.8622]);
          mapInstanceRef.current?.flyTo([40.3953, 49.8622], 14, { duration: 1.2 });
        }
      );
    } else {
      mapInstanceRef.current?.flyTo([40.3953, 49.8622], 14, { duration: 1.2 });
    }
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;

    // Match vehicle plate or driver or customer
    const foundVehicle = vehicles.find(
      (v) =>
        v.plate.toLowerCase().includes(localSearch.toLowerCase()) ||
        v.driverName.toLowerCase().includes(localSearch.toLowerCase())
    );

    if (foundVehicle) {
      selectVehicle(foundVehicle.id);
      mapInstanceRef.current?.flyTo([foundVehicle.location.lat, foundVehicle.location.lng], 15, { duration: 1.2 });
      return;
    }

    const foundCust = customers.find(
      (c) =>
        c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        c.region.toLowerCase().includes(localSearch.toLowerCase())
    );

    if (foundCust) {
      mapInstanceRef.current?.flyTo([foundCust.lat, foundCust.lng], 15, { duration: 1.2 });
    }
  };

  const handleCenterSelectedVehicle = () => {
    if (!selectedVehicleId) return;
    const v = vehicles.find((item) => item.id === selectedVehicleId);
    if (v && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([v.location.lat, v.location.lng], 15, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-[#090d16]">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Quick Location Search Bar */}
      <div className="absolute top-3 left-3 z-10 max-w-xs w-full">
        <form onSubmit={handleSearchLocation} className="relative flex items-center">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search vehicle or hub..."
            className="w-full bg-slate-900/90 text-xs text-slate-100 placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 shadow-lg backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
        </form>
      </div>

      {/* Top Right: Layer Switcher & Pin Mode */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {/* Pin Mode Toggle Button */}
        <button
          onClick={() => setPinMode(!isPinModeActive)}
          title={isPinModeActive ? 'Disable pin mode' : t('map_pin_mode')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border shadow-lg backdrop-blur-md transition-all ${
            isPinModeActive
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold ring-2 ring-amber-400/40'
              : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isPinModeActive ? 'Pin Mode Active' : 'Pin Mode'}</span>
        </button>

        {/* Map Layer Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Switch Map Tiles"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-white shadow-lg backdrop-blur-md transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize hidden sm:inline">{mapLayer}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-20 backdrop-blur-md">
              {(['dark', 'satellite', 'streets'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setMapLayer(layer);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    mapLayer === layer ? 'text-blue-400 font-medium bg-blue-500/10' : 'text-slate-300'
                  }`}
                >
                  <span className="capitalize">{layer}</span>
                  {mapLayer === layer && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pin Mode Banner Notification */}
      {isPinModeActive && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 bg-amber-500/95 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xl border border-amber-400 backdrop-blur-sm flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>{t('map_pin_active')}</span>
          {pinnedLocation && (
            <span className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-[11px]">
              {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
            </span>
          )}
        </div>
      )}

      {/* Bottom Right Floating Map Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
        {/* Center on selected vehicle */}
        {selectedVehicleId && (
          <button
            onClick={handleCenterSelectedVehicle}
            title={t('focus_on_map')}
            className="p-2 rounded-lg bg-blue-600/90 text-white border border-blue-500 shadow-xl backdrop-blur-md hover:bg-blue-500 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          title={t('map_locate_me')}
          className="p-2 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          title={t('map_zoom_in')}
          className="p-2 rounded-t-lg bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          title={t('map_zoom_out')}
          className="p-2 rounded-b-lg -mt-1.5 bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Legend Status Bar */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-slate-900/85 border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Online ({vehicles.filter(v => v.status === 'ONLINE').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Busy ({vehicles.filter(v => v.status === 'BUSY').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Idle ({vehicles.filter(v => v.status === 'IDLE').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>Alert ({vehicles.filter(v => v.status === 'WARNING').length})</span>
        </div>
      </div>
    </div>
  );
};
