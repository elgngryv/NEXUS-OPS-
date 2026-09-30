import React, { useState } from 'react';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { useUIStore } from '../../../stores/useUIStore';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { Priority, Region, Task } from '../../../types';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Crosshair
} from 'lucide-react';

export const TaskCreationModal: React.FC = () => {
  const { isCreateTaskModalOpen, setCreateTaskModalOpen } = useUIStore();
  const { createTask, vehicles, customers, pinnedLocation } = useFleetStore();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTask, setSuccessTask] = useState<Task | null>(null);

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState<Region>('Nəsimi');
  const [lat, setLat] = useState(pinnedLocation ? String(pinnedLocation.lat) : '40.3854');
  const [lng, setLng] = useState(pinnedLocation ? String(pinnedLocation.lng) : '49.8672');
  const [taskType, setTaskType] = useState<Task['type']>('Delivery');
  const [selectedDriverVehicle, setSelectedDriverVehicle] = useState(
    vehicles[0] ? `${vehicles[0].driverName}|${vehicles[0].plate}` : ''
  );
  const [priority, setPriority] = useState<Priority>('High');
  const [scheduledTime, setScheduledTime] = useState('Immediate / Next Available Slot');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill from preset customers if selected
  const handleSelectCustomerPreset = (custId: string) => {
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setPhone(found.phone);
      setAddress(found.address);
      setRegion(found.region);
      setLat(String(found.lat));
      setLng(String(found.lng));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!customerName.trim()) newErrors.customerName = 'Customer or organization name is required';
      if (!phone.trim() || phone.length < 9) newErrors.phone = 'Valid phone number is required';
    } else if (currentStep === 2) {
      if (!address.trim()) newErrors.address = 'Destination address is required';
      if (!lat || isNaN(Number(lat))) newErrors.lat = 'Valid latitude coordinate is required';
      if (!lng || isNaN(Number(lng))) newErrors.lng = 'Valid longitude coordinate is required';
    } else if (currentStep === 3) {
      if (!selectedDriverVehicle) newErrors.driver = 'Select a driver and vehicle asset';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleUsePinnedCoords = () => {
    if (pinnedLocation) {
      setLat(pinnedLocation.lat.toFixed(5));
      setLng(pinnedLocation.lng.toFixed(5));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const [driverName, vehiclePlate] = selectedDriverVehicle.split('|');

    setTimeout(() => {
      const newTask = createTask({
        code: '',
        title: `${taskType}: ${customerName}`,
        customerName,
        customerPhone: phone,
        address,
        region,
        location: { lat: Number(lat), lng: Number(lng) },
        driverName: driverName || 'Elvin Məmmədov',
        vehiclePlate: vehiclePlate || '10-AA-101',
        priority,
        status: 'Assigned',
        eta: '18 min',
        type: taskType,
        notes: notes || 'Standard dispatch checklist verified.',
        barcode: `869000${Math.floor(10000 + Math.random() * 90000)}`,
      });

      setIsSubmitting(false);
      setSuccessTask(newTask);
    }, 600);
  };

  const handleResetAndClose = () => {
    setSuccessTask(null);
    setStep(1);
    setCreateTaskModalOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateTaskModalOpen}
      onClose={handleResetAndClose}
      title={t('create_task_title')}
      subtitle="Dispatch a new field mission with coordinates and live asset pairing"
      maxWidth="xl"
    >
      {/* Progress Steps Header */}
      {!successTask && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>1. Customer</span>
            <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>2. Location</span>
            <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>3. Fleet</span>
            <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>4. Priority</span>
            <span className={step >= 5 ? 'text-blue-400 font-bold' : ''}>5. Review</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Success View */}
      {successTask ? (
        <div className="py-6 flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 mb-4 animate-in zoom-in-75">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-base font-bold text-slate-100">
            {t('task_created_success')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Dispatched to <span className="text-blue-400 font-semibold">{successTask.driverName}</span> ({successTask.vehiclePlate}) with tracking code <span className="font-mono text-slate-200">{successTask.code}</span>.
          </p>

          <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl w-full text-left font-mono text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Mission:</span>
              <span className="text-slate-200 font-semibold">{successTask.title}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Destination:</span>
              <span className="text-slate-200">{successTask.address}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Barcode:</span>
              <span className="text-blue-400">{successTask.barcode}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="primary" size="sm" onClick={handleResetAndClose}>
              Done & Return to Dispatch
            </Button>
          </div>
        </div>
      ) : (
        /* Multi-step Form Content */
        <div className="space-y-4">
          {/* Step 1: Customer Profile */}
          {step === 1 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-2.5 bg-slate-800/40 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400 block mb-1.5">Quick fill from Baku customer registry:</span>
                <div className="flex flex-wrap gap-1.5">
                  {customers.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomerPreset(c.id)}
                      className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label={t('lbl_customer_name')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Baku Medical Center"
                error={errors.customerName}
                icon={<Building2 className="w-4 h-4" />}
              />

              <Input
                label={t('lbl_phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+994 50 123 4567"
                error={errors.phone}
              />

              <Select
                label={t('lbl_task_type')}
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as Task['type'])}
              >
                <option value="Delivery">Delivery (Commercial / Cargo)</option>
                <option value="Emergency">Emergency (Urgent Medical Supplies)</option>
                <option value="Service">Service (Field Inspection / Repair)</option>
                <option value="Supply">Supply (Warehouse Restock)</option>
              </Select>
            </div>
          )}

          {/* Step 2: Location & GPS */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <Input
                label={t('lbl_address')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Babək pr. 11A, Xətai"
                error={errors.address}
                icon={<MapPin className="w-4 h-4" />}
              />

              <Select
                label={t('region')}
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
              >
                <option value="Baku">Baku Central</option>
                <option value="Yasamal">Yasamal</option>
                <option value="Nəsimi">Nəsimi</option>
                <option value="Nərimanov">Nərimanov</option>
                <option value="Binəqədi">Binəqədi</option>
                <option value="Xətai">Xətai</option>
                <option value="Səbail">Səbail</option>
                <option value="Gəncə">Gəncə</option>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Latitude (GPS)"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  error={errors.lat}
                />
                <Input
                  label="Longitude (GPS)"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  error={errors.lng}
                />
              </div>

              {pinnedLocation && (
                <button
                  type="button"
                  onClick={handleUsePinnedCoords}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Use Pinned Coordinates from GIS Map ({pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)})</span>
                </button>
              )}
            </div>
          )}

          {/* Step 3: Driver & Vehicle */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="text-xs font-medium text-slate-300 block text-left">
                Select Fleet Asset & Driver:
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {vehicles
                  .filter((v) => v.status !== 'OFFLINE')
                  .map((v) => {
                    const isSelected = selectedDriverVehicle === `${v.driverName}|${v.plate}`;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedDriverVehicle(`${v.driverName}|${v.plate}`)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Truck className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              {v.driverName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {v.plate} · {v.model}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {v.status}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">{v.assignedRegion}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {errors.driver && (
                <span className="text-xs text-rose-400 block text-left">{errors.driver}</span>
              )}
            </div>
          )}

          {/* Step 4: Priority & Schedule */}
          {step === 4 && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <Select
                label={t('lbl_priority')}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Priority (Immediate Siren Dispatch)</option>
              </Select>

              <Input
                label="Scheduled Time Window"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-medium text-slate-300">
                  {t('lbl_notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Special instructions for the driver or gate access codes..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirmation */}
          {step === 5 && (
            <div className="space-y-3 animate-in fade-in duration-150 text-left">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-semibold text-slate-200">{customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-200">{phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Address & Region:</span>
                  <span className="text-slate-200">{address} ({region})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">GPS Coordinates:</span>
                  <span className="font-mono text-blue-400">{lat}, {lng}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Driver & Vehicle:</span>
                  <span className="font-semibold text-slate-200">{selectedDriverVehicle.replace('|', ' — ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority Level:</span>
                  <span className="font-bold text-amber-400">{priority}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" size="sm" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
                {t('btn_back')}
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button variant="primary" size="sm" onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
                {t('btn_next')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                {t('btn_submit')}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
