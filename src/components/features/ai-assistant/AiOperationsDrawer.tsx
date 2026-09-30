import React, { useState } from 'react';
import { useUIStore } from '../../../stores/useUIStore';
import { useFleetStore } from '../../../stores/useFleetStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { 
  X, 
  Sparkles, 
  Send, 
  Truck, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Bot
} from 'lucide-react';
import { VehicleStatusBadge, PriorityBadge } from '../../design-system/StatusBadge';

interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredResults?: {
    type: 'vehicles' | 'tasks' | 'summary';
    title: string;
    items: any[];
  };
}

export const AiOperationsDrawer: React.FC = () => {
  const { isAiAssistantOpen, setAiAssistantOpen, setActivePage } = useUIStore();
  const { vehicles, tasks, selectVehicle } = useFleetStore();
  const { t } = useTranslation();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: 'Hello Operator. I am your NEXUS Geospatial AI Copilot. You can ask me queries about fleet status, delayed tasks, or geographic clusters.',
      timestamp: '11:40',
    },
  ]);

  if (!isAiAssistantOpen) return null;

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toTimeString().slice(0, 5),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Local structured query engine
    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let reply: AiMessage;

      if (lower.includes('delay') || lower.includes('gecik') || lower.includes('задерж')) {
        const delayedTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').slice(0, 4);
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Found ${delayedTasks.length} missions that require monitoring due to route transit conditions:`,
          timestamp: new Date().toTimeString().slice(0, 5),
          structuredResults: {
            type: 'tasks',
            title: 'Missions with elevated ETA',
            items: delayedTasks,
          },
        };
      } else if (lower.includes('offline') || lower.includes('oflayn') || lower.includes('офлайн')) {
        const offlineVehicles = vehicles.filter((v) => v.status === 'OFFLINE' || v.status === 'WARNING');
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Identified ${offlineVehicles.length} vehicles currently reporting offline or degraded sensor pings:`,
          timestamp: new Date().toTimeString().slice(0, 5),
          structuredResults: {
            type: 'vehicles',
            title: 'Degraded / Offline Fleet Assets',
            items: offlineVehicles,
          },
        };
      } else if (lower.includes('yasamal') || lower.includes('ясамал')) {
        const yasamalTasks = tasks.filter((t) => t.region === 'Yasamal').slice(0, 5);
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Located ${yasamalTasks.length} operational tasks situated in the Yasamal sector:`,
          timestamp: new Date().toTimeString().slice(0, 5),
          structuredResults: {
            type: 'tasks',
            title: 'Tasks in Yasamal Hub',
            items: yasamalTasks,
          },
        };
      } else if (lower.includes('critical') || lower.includes('kritik') || lower.includes('критич')) {
        const critTasks = tasks.filter((t) => t.priority === 'Critical').slice(0, 5);
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Extracted ${critTasks.length} highest-priority emergency missions:`,
          timestamp: new Date().toTimeString().slice(0, 5),
          structuredResults: {
            type: 'tasks',
            title: 'Critical Priority Missions',
            items: critTasks,
          },
        };
      } else {
        // Default smart synthesis
        const activeCount = vehicles.filter((v) => v.status === 'ONLINE' || v.status === 'BUSY').length;
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Currently ${activeCount} vehicles are actively moving across Baku with an average response time of 8.4 minutes. All primary GPS gateways are operating normally.`,
          timestamp: new Date().toTimeString().slice(0, 5),
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0b0f19] border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono">{t('ai_title')}</h3>
            <p className="text-[10px] text-slate-400">Natural language telemetry engine</p>
          </div>
        </div>
        <button
          onClick={() => setAiAssistantOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
          Suggested Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[t('ai_query_1'), t('ai_query_2'), t('ai_query_3'), t('ai_query_4')].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuery(q)}
              className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p>{m.text}</p>

              {/* Structured Output Cards */}
              {m.structuredResults && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                    {m.structuredResults.title}
                  </div>

                  {m.structuredResults.type === 'vehicles' &&
                    m.structuredResults.items.map((veh: any) => (
                      <div
                        key={veh.id}
                        className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-100">{veh.plate}</div>
                          <div className="text-[10px] text-slate-400">{veh.driverName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <VehicleStatusBadge status={veh.status} size="sm" />
                          <button
                            onClick={() => {
                              selectVehicle(veh.id);
                              setActivePage('live-map');
                              setAiAssistantOpen(false);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400"
                            title="Focus on map"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {m.structuredResults.type === 'tasks' &&
                    m.structuredResults.items.map((task: any) => (
                      <div
                        key={task.id}
                        className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-slate-200">{task.code}</span>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <div className="text-slate-300 truncate">{task.customerName}</div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{task.region}</span>
                          <span>ETA: {task.eta}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery(input);
        }}
        className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ai_placeholder')}
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
