import React, { useState, useMemo } from 'react';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { TaskStatus, Priority, Region, Task } from '../../../types';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { TaskStatusBadge, PriorityBadge } from '../../design-system/StatusBadge';
import { Card } from '../../design-system/Card';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';

export const OperationsView: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, updateTaskStatus, bulkUpdateTasksStatus, selectTask, selectVehicle, vehicles } = useFleetStore();
  const { setCreateTaskModalOpen, setActivePage } = useUIStore();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<string>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<keyof Task>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Bulk Selection State
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Unique list of drivers for filter
  const uniqueDrivers = useMemo(() => {
    const list = Array.from(new Set(tasks.map((t) => t.driverName).filter((d) => d !== 'Unassigned')));
    return list;
  }, [tasks]);

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          task.code.toLowerCase().includes(query) ||
          task.title.toLowerCase().includes(query) ||
          task.customerName.toLowerCase().includes(query) ||
          task.address.toLowerCase().includes(query) ||
          task.driverName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      // Region
      if (regionFilter !== 'ALL' && task.region !== regionFilter) return false;
      // Priority
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      // Driver
      if (driverFilter !== 'ALL' && task.driverName !== driverFilter) return false;

      return true;
    }).sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [tasks, searchTerm, statusFilter, regionFilter, priorityFilter, driverFilter, sortField, sortAsc]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedTasks.map((t) => t.id);
      setSelectedTaskIds(Array.from(new Set([...selectedTaskIds, ...pageIds])));
    } else {
      const pageIds = paginatedTasks.map((t) => t.id);
      setSelectedTaskIds(selectedTaskIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleSelectTask = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((item) => item !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleBulkStatusChange = (status: TaskStatus) => {
    if (selectedTaskIds.length === 0) return;
    bulkUpdateTasksStatus(selectedTaskIds, status);
    setSelectedTaskIds([]);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Code,Title,Customer,Phone,Address,Region,Driver,Vehicle,Priority,Status,Created,ETA'];
    const rows = filteredTasks.map((t) =>
      `"${t.code}","${t.title}","${t.customerName}","${t.customerPhone}","${t.address}","${t.region}","${t.driverName}","${t.vehiclePlate}","${t.priority}","${t.status}","${t.createdAt}","${t.eta}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_ops_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleFocusVehicleOnMap = (vehiclePlate: string) => {
    const v = vehicles.find((item) => item.plate === vehiclePlate);
    if (v) {
      selectVehicle(v.id);
    }
    setActivePage('live-map');
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-mono text-white">
            {t('ops_title')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('ops_subtitle')} · <span className="font-mono text-blue-400">{tasks.length}</span> total missions in registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            {t('export_csv')}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setCreateTaskModalOpen(true)}
          >
            {t('new_task_btn')}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3 bg-slate-900/80 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('filter_search')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{t('filter_all_status')}</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{t('filter_all_regions')}</option>
            <option value="Baku">Baku Central</option>
            <option value="Yasamal">Yasamal</option>
            <option value="Nəsimi">Nəsimi</option>
            <option value="Nərimanov">Nərimanov</option>
            <option value="Binəqədi">Binəqədi</option>
            <option value="Xətai">Xətai</option>
            <option value="Səbail">Səbail</option>
            <option value="Gəncə">Gəncə</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{t('filter_all_priorities')}</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          {/* Driver Filter */}
          <select
            value={driverFilter}
            onChange={(e) => {
              setDriverFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{t('filter_all_drivers')}</option>
            {uniqueDrivers.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Action Bar (When rows selected) */}
        {selectedTaskIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-blue-950/20 px-3 py-2 rounded-lg border border-blue-800/40 animate-in fade-in">
            <span className="text-xs font-mono text-blue-300">
              <span className="font-bold">{selectedTaskIds.length}</span> {t('bulk_select')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('Completed')}
                className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                {t('bulk_action_complete')}
              </button>
              <button
                onClick={() => handleBulkStatusChange('Cancelled')}
                className="px-2.5 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
              >
                {t('bulk_action_cancel')}
              </button>
              <button
                onClick={() => setSelectedTaskIds([])}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Main Operations Table */}
      <Card className="overflow-hidden border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px]">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      paginatedTasks.length > 0 &&
                      paginatedTasks.every((t) => selectedTaskIds.includes(t.id))
                    }
                    onChange={handleSelectAllOnPage}
                    className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('code')}
                  className="p-3 cursor-pointer hover:text-slate-200"
                >
                  <span className="flex items-center gap-1">
                    {t('col_id')}
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </span>
                </th>
                <th className="p-3">{t('col_task')}</th>
                <th className="p-3">{t('col_customer')}</th>
                <th className="p-3">{t('col_driver')}</th>
                <th className="p-3">{t('col_vehicle')}</th>
                <th className="p-3">{t('col_region')}</th>
                <th
                  onClick={() => handleSort('priority')}
                  className="p-3 cursor-pointer hover:text-slate-200"
                >
                  <span className="flex items-center gap-1">
                    {t('col_priority')}
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="p-3 cursor-pointer hover:text-slate-200"
                >
                  <span className="flex items-center gap-1">
                    {t('col_status')}
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="p-3 cursor-pointer hover:text-slate-200"
                >
                  <span className="flex items-center gap-1">
                    {t('col_created')}
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </span>
                </th>
                <th className="p-3">{t('col_eta')}</th>
                <th className="p-3 text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedTasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id);
                return (
                  <tr
                    key={task.id}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectTask(task.id)}
                        className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-400">
                      {task.code}
                    </td>
                    <td className="p-3 font-medium text-slate-200 max-w-[200px] truncate" title={task.title}>
                      {task.title}
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{task.customerName}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {task.address}
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{task.driverName}</td>
                    <td className="p-3 font-mono text-slate-400">
                      {task.vehiclePlate !== '—' ? (
                        <button
                          onClick={() => handleFocusVehicleOnMap(task.vehiclePlate)}
                          className="hover:text-blue-400 underline decoration-slate-600"
                        >
                          {task.vehiclePlate}
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{task.region}</td>
                    <td className="p-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="p-3">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">
                      {task.createdAt}
                    </td>
                    <td className="p-3 font-mono text-slate-300 font-semibold">
                      {task.eta}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                            className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {task.status !== 'Cancelled' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Cancelled')}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                            title="Cancel Task"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500">
                    No tasks match the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="font-mono text-[11px]">
            {t('showing')} <span className="text-slate-200">{filteredTasks.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> - <span className="text-slate-200">{Math.min(currentPage * pageSize, filteredTasks.length)}</span> {t('of')} <span className="text-slate-200">{filteredTasks.length}</span> {t('total_records')}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
            >
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-2 text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
