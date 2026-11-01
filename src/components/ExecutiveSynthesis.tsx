import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { BudgetSummary, formatINR } from '../lib/budget-engine';
import { MarketAnalysisReport } from '../lib/market-scraper';
import { WbsPhase } from '../lib/timeline-wbs';

interface ExecutiveSynthesisProps {
  markdown: string;
  budgetSummary: BudgetSummary;
  marketReport: MarketAnalysisReport;
  wbsPhases: WbsPhase[];
  generatedFromAi: boolean;
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveSynthesis: React.FC<ExecutiveSynthesisProps> = ({
  markdown,
  budgetSummary,
  marketReport,
  wbsPhases,
  generatedFromAi,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'markdown'>('visual');

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${marketReport.event_type.replace(/\s+/g, '_')}_EventGenie_Plan.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Model & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base">Executive Synthesis & Blueprint</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {generatedFromAi ? 'Powered by Gemini 3.8 Flash' : 'High-Fidelity Localized Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Structured 5-stage strategic event blueprint optimized for {marketReport.location}
            </p>
          </div>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === 'visual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Cards
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Markdown View
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1.5 text-xs"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1.5 text-xs"
            title="Download Plan (.md)"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {viewMode === 'markdown' ? (
        /* Raw Markdown View */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
          {markdown}
        </div>
      ) : (
        /* Visual Cards Mode */
        <div className="space-y-6">
          {/* Section 1: Executive Summary & Concept */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  1
                </span>
                <h4 className="text-base font-semibold text-white">Executive Summary & Theme Concept</h4>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Strategic Foundation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Budget Cap</span>
                <span className="text-lg font-bold text-emerald-400">{formatINR(budgetSummary.totalBudget)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">Expected Guests</span>
                <span className="text-lg font-bold text-amber-300">{marketReport.target_budget ? Math.round(budgetSummary.totalBudget / budgetSummary.costPerGuest) : 150} pax</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">Cost Per Guest</span>
                <span className="text-lg font-bold text-indigo-400">{formatINR(budgetSummary.costPerGuest)} / pax</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">Wholesale Synergy Savings</span>
                <span className="text-lg font-bold text-purple-400">+{formatINR(budgetSummary.estimatedComboSavings)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/20 border border-indigo-500/20 text-sm text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Aesthetic & Strategic Concept:</strong>
              Hosting an elevated {marketReport.event_type} in {marketReport.location} engineered around micro-venue open-air garden verandas and pre-vetted wholesale vendor synergy. This approach guarantees full aesthetic grandeur, artisanal live chaat/beverage stations, and cinematic dual-shooter coverage while preserving a 10% contingency buffer ({formatINR(budgetSummary.contingencyAmount)}).
            </div>
          </div>

          {/* Section 2: Granular Budget Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  2
                </span>
                <h4 className="text-base font-semibold text-white">Granular Budget Allocation</h4>
              </div>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
              >
                <span>Interactive Allocator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Line Item</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold text-right">Estimated Cost</th>
                    <th className="pb-3 font-semibold text-right">Combo Saving</th>
                    <th className="pb-3 font-semibold">Key Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {budgetSummary.lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-medium text-slate-100">{item.item}</td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-emerald-400">
                        {formatINR(item.estimatedCost)}
                      </td>
                      <td className="py-3 text-right font-medium text-purple-400">
                        {item.smartComboSaving > 0 ? (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs">
                            -{formatINR(item.smartComboSaving)}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-slate-400 max-w-xs">{item.notes}</td>
                    </tr>
                  ))}
                  {/* Contingency Line */}
                  <tr className="bg-slate-950/60 font-semibold text-slate-100">
                    <td className="py-3 text-amber-300">Contingency Buffer ({budgetSummary.contingencyPercentage}%)</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Risk Shield
                      </span>
                    </td>
                    <td className="py-3 text-right text-amber-400">{formatINR(budgetSummary.contingencyAmount)}</td>
                    <td className="py-3 text-right text-xs text-slate-500">Safe Reserve</td>
                    <td className="py-3 text-xs text-slate-400">Weather safeguards & guest surge protection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: High-ROI Investment Combos */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                  3
                </span>
                <h4 className="text-base font-semibold text-white">
                  High-ROI Investment Combos & Wholesale Synergies
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('combos')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
              >
                <span>Vendor Synergy Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-500/30 mb-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Recommended Synergy Pack
                  </span>
                  <h5 className="text-lg font-bold text-white mt-0.5">
                    {budgetSummary.smartCombo.comboName}
                  </h5>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block line-through">
                      {formatINR(budgetSummary.smartCombo.baseCostInr)}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      {formatINR(budgetSummary.smartCombo.optimizedCostInr)}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-center">
                    <span className="text-xs font-semibold block">You Save</span>
                    <span className="text-sm font-bold text-purple-200">
                      {formatINR(budgetSummary.smartCombo.estimatedSavingsInr)} (15%)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-indigo-200/90 mt-3 italic leading-relaxed">
                "{budgetSummary.smartCombo.roiRationale}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetSummary.smartCombo.recommendedVendors.map((vendor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-semibold text-slate-100 text-sm">{vendor.name}</h6>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {vendor.category}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">{vendor.deal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 & 5 Grid: Timeline & Social Hacks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                    4
                  </span>
                  <h4 className="text-base font-semibold text-white">Chronological Timeline (WBS)</h4>
                </div>
                <button
                  onClick={() => onNavigateTab('timeline')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                >
                  <span>Interactive WBS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {wbsPhases.slice(0, 4).map((phase) => (
                  <div key={phase.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-cyan-300">{phase.timeframe}</span>
                      <span className="text-[10px] text-slate-400">{phase.tasks.length} tasks</span>
                    </div>
                    <h6 className="text-sm font-semibold text-slate-100">{phase.title}</h6>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Hacks & Trends */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                    5
                  </span>
                  <h4 className="text-base font-semibold text-white">Cost-Saving Social Hacks</h4>
                </div>
                <button
                  onClick={() => onNavigateTab('scraper')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                >
                  <span>Social Scraper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {marketReport.social_media_trends.map((trend, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5"
                  >
                    <div className="mt-0.5 p-1 rounded bg-amber-500/10 text-amber-400 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
