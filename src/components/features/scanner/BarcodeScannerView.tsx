import React, { useState, useRef, useEffect } from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Card } from '../../design-system/Card';
import { 
  Camera, 
  CameraOff, 
  Sparkles, 
  CheckCircle2, 
  Package, 
  Search, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  QrCode,
  Volume2
} from 'lucide-react';
import { BarcodeScanRecord } from '../../../types';

export const BarcodeScannerView: React.FC = () => {
  const { t } = useTranslation();
  const { scannedRecords, addScannedRecord, tasks } = useFleetStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [latestScan, setLatestScan] = useState<BarcodeScanRecord | null>(scannedRecords[0] || null);

  // Play audio beep using Web Audio API on successful scan
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable in silent environments
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error or rejected:', err);
      setCameraError('Camera unavailable in preview frame. Seamlessly running in simulated hardware demo mode.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const triggerScanWithCode = (code: string) => {
    playBeep();

    // Check if code matches an existing task
    const matchingTask = tasks.find((t) => t.barcode === code);

    const newRecord = {
      barcode: code,
      productName: matchingTask ? matchingTask.title : 'Certified Medical Supply Box #482',
      status: (matchingTask ? matchingTask.status : 'Assigned') as BarcodeScanRecord['status'],
      destination: matchingTask ? matchingTask.address : 'Baku Medical Center — Babək pr. 11A',
      scannedBy: 'Elvin Məmmədov (Operator)',
    };

    addScannedRecord(newRecord);
    setLatestScan({
      ...newRecord,
      id: `scan-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
    });
  };

  const handleDemoScan = () => {
    const demoCodes = [
      '86900048218',
      '86900048225',
      '86900048243',
      '86900048259',
      '86900048301',
    ];
    const picked = demoCodes[Math.floor(Math.random() * demoCodes.length)];
    triggerScanWithCode(picked);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    triggerScanWithCode(manualCode.trim());
    setManualCode('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-left">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-blue-400" />
          <span>{t('scanner_title')}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('scanner_subtitle')}
        </p>
      </div>

      {/* Main Grid: Camera/Frame on Left, Scan Result & Manual on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl bg-[#070a12] border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Live Video */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {/* Simulated viewfinder if camera not active */}
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900/60 to-slate-950/90">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                  <Camera className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                  {cameraError ? 'Demo Hardware Emulation Mode' : 'Optical Barcode Sensor Standby'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {cameraError || 'Activate the device camera or trigger a simulated barcode intake test below.'}
                </p>
              </div>
            )}

            {/* Scan Reticle Frame */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="relative w-64 h-40 border-2 border-blue-500/40 rounded-xl">
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />

                {/* Animated Laser Scanning Line */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-lg shadow-blue-500 animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Top Bar Status on Viewport */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isCameraActive ? 'CAMERA STREAM ACTIVE' : 'SIMULATION MODE'}</span>
            </div>
          </div>

          {/* Camera Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            {!isCameraActive ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Camera className="w-4 h-4" />}
                onClick={startCamera}
              >
                {t('btn_start_camera')}
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                icon={<CameraOff className="w-4 h-4" />}
                onClick={stopCamera}
              >
                {t('btn_stop_camera')}
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-amber-400" />}
              onClick={handleDemoScan}
            >
              {t('btn_demo_scan')}
            </Button>
          </div>
        </div>

        {/* Right Column: Scan Result & Manual Input */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Latest Scan Result Card */}
          <Card className="p-4 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {t('scan_result')}
              </span>
              {latestScan && (
                <span className="text-[10px] font-mono text-slate-400">
                  {latestScan.timestamp}
                </span>
              )}
            </div>

            {latestScan ? (
              <div className="pt-3 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Barcode Identifier:</span>
                  <div className="font-mono text-base font-bold text-white tracking-widest mt-0.5">
                    {latestScan.barcode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{t('product_name')}:</span>
                    <span className="font-semibold text-slate-200 truncate block mt-0.5">
                      {latestScan.productName}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{t('col_status')}:</span>
                    <span className="font-semibold text-emerald-400 block mt-0.5">
                      {latestScan.status}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 block">{t('destination')}:</span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{latestScan.destination}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Operator: {latestScan.scannedBy}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No barcode scanned yet. Use camera or manual entry.
              </div>
            )}
          </Card>

          {/* Manual Barcode Input Card */}
          <Card className="p-4 border-slate-800 bg-slate-900/60">
            <h3 className="text-xs font-semibold text-slate-200 mb-2">
              Manual Barcode Intake
            </h3>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('manual_barcode_input')}
                className="text-xs font-mono"
              />
              <Button type="submit" variant="primary" size="sm">
                {t('btn_verify')}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Recent Scans History Table */}
      <Card className="p-4 border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
            {t('recent_scans')}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {scannedRecords.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2">Barcode</th>
                <th className="pb-2">Product Description</th>
                <th className="pb-2">Destination Facility</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scannedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-mono text-blue-400 font-semibold">{rec.barcode}</td>
                  <td className="py-2.5 text-slate-200 font-medium">{rec.productName}</td>
                  <td className="py-2.5 text-slate-400">{rec.destination}</td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-500">{rec.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
