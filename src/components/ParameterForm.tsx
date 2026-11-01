import React from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Sparkles,
  Sliders,
  CheckCircle,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { formatINR } from '../lib/budget-engine';

export interface EventParameters {
  eventType: string;
  guestCount: number;
  budgetInr: number;
  location: string;
  theme: string;
  priorities: string;
  notes: string;
}

interface ParameterFormProps {
  parameters: EventParameters;
  onChange: (params: EventParameters) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const BENGALURU_LOCALITIES = [
  'Whitefield',
  'AECS Layout',
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Malleshwaram',
  'Lavelle Road',
  'Jayanagar',
];

const EVENT_TYPES = ['Wedding', 'Birthday', 'Community Event', 'Corporate Gala', 'Anniversary'];

export const ParameterForm: React.FC<ParameterFormProps> = ({
  parameters,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const updateField = <K extends keyof EventParameters>(field: K, value: EventParameters[K]) => {
    onChange({
      ...parameters,
      [field]: value,
    });
  };

  const handleLocalityClick = (locality: string) => {
    updateField('location', `${locality}, Bengaluru`);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Event & Investment Parameters</h2>
            <p className="text-xs text-slate-400">
              Configure parameters to trigger the multi-step Agentic Orchestrator & localized market mining
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Real-time Bengaluru Scraper Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Event Type
          </label>
          <select
            value={parameters.eventType}
            onChange={(e) => updateField('eventType', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Guest Headcount
            </span>
            <span className="text-[11px] text-slate-400">{parameters.guestCount} pax</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="10"
              max="2000"
              value={parameters.guestCount}
              onChange={(e) => updateField('guestCount', Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            />
          </div>
          {/* Quick pax badges */}
          <div className="flex gap-1.5 mt-1.5">
            {[50, 100, 150, 250, 500].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateField('guestCount', count)}
                className={`text-[10px] px-2 py-0.5 rounded transition ${
                  parameters.guestCount === count
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Cap */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget Cap (INR)
            </span>
            <span className="text-xs font-bold text-emerald-400">{formatINR(parameters.budgetInr)}</span>
          </label>
          <input
            type="number"
            step="5000"
            min="20000"
            value={parameters.budgetInr}
            onChange={(e) => updateField('budgetInr', Math.max(1000, parseInt(e.target.value) || 0))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-medium text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
          {/* Quick budget badges */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {[
              { label: '₹65K', val: 65000 },
              { label: '₹1.5L', val: 150000 },
              { label: '₹2.5L', val: 250000 },
              { label: '₹5L', val: 500000 },
            ].map((b) => (
              <button
                key={b.val}
                type="button"
                onClick={() => updateField('budgetInr', b.val)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                  parameters.budgetInr === b.val
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Location / Local Market
          </label>
          <input
            type="text"
            value={parameters.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. Whitefield, Bengaluru"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
          />
          {/* Quick Bengaluru localities */}
          <div className="flex gap-1 mt-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {BENGALURU_LOCALITIES.slice(0, 4).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocalityClick(loc)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 hover:text-rose-300 hover:bg-slate-700/80 transition whitespace-nowrap"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Theme & Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-800/80">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Theme / Concept & Aesthetic Vision
          </label>
          <input
            type="text"
            value={parameters.theme}
            onChange={(e) => updateField('theme', e.target.value)}
            placeholder="e.g. Eco-Chic Garden Serenity with Marigold & Fairy Lights"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Top Priorities
          </label>
          <input
            type="text"
            value={parameters.priorities}
            onChange={(e) => updateField('priorities', e.target.value)}
            placeholder="e.g. Gourmet Catering, Drone Photography"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Agentic Orchestration: <strong>Budget Engine</strong> + <strong>WBS Milestone Gen</strong> +{' '}
            <strong>Social Scraper</strong>
          </span>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Orchestrating Event Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate GenAI Event & Investment Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
