import React, { useState } from 'react';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { useUIStore } from '../../../stores/useUIStore';
import { useFleetStore } from '../../../stores/useFleetStore';
import { Settings, Shield, Bell, Database, Radio, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { role, setRole } = useUIStore();
  const { isSimulationRunning, toggleSimulation } = useFleetStore();
  const [gpsInterval, setGpsInterval] = useState('2000');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <span>System Settings & Operational Configurations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Telemetry poll rates, role privileges, and hardware gateway parameters
        </p>
      </div>

      <div className="space-y-4">
        {/* Telemetry Polling */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>GPS Ping & Simulation Engine Frequency</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Sets the virtual socket refresh cycle for live coordinate drift and speed vectors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Poll Rate</label>
              <select
                value={gpsInterval}
                onChange={(e) => setGpsInterval(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              >
                <option value="1000">1000 ms (High Frequency Real-time)</option>
                <option value="2000">2000 ms (Balanced Battery Saver)</option>
                <option value="5000">5000 ms (Standard Telematics)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Simulation State</label>
              <button
                onClick={toggleSimulation}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-colors ${
                  isSimulationRunning
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {isSimulationRunning ? '🟢 Running (Active Vector Engine)' : '⏸ Paused (Static Freeze)'}
              </button>
            </div>
          </div>
        </Card>

        {/* Access Privileges */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Switch your current role to test dynamic menu access and administrative locks.
          </p>

          <div className="flex gap-2">
            {(['Operator', 'Manager', 'Admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-1.5 px-3 text-xs rounded-lg font-mono border transition-all ${
                  role === r
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>

        {/* Audio Alerts */}
        <Card className="p-4 bg-slate-900/80 border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Barcode Scanner Sound Synthesis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Audible 1200Hz sine wave confirmation upon successful package intake
            </p>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
          />
        </Card>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Configurations updated successfully
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} className="ml-auto">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
