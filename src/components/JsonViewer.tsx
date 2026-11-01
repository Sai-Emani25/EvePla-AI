import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Layers } from 'lucide-react';
import { MarketAnalysisReport } from '../lib/market-scraper';
import { BudgetSummary } from '../lib/budget-engine';
import { WbsPhase } from '../lib/timeline-wbs';

interface JsonViewerProps {
  marketReport: MarketAnalysisReport;
  budgetSummary: BudgetSummary;
  wbsPhases: WbsPhase[];
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  marketReport,
  budgetSummary,
  wbsPhases,
}) => {
  const [copied, setCopied] = useState(false);

  // Combine into a master export payload
  const exportPayload = {
    metadata: {
      generated_by: 'EventGenie AI',
      architecture_version: '2.5.0-pro-spec',
      timestamp: marketReport.timestamp,
      location: marketReport.location,
      currency: 'INR',
    },
    event_parameters: {
      event_type: marketReport.event_type,
      budget_inr: marketReport.target_budget,
      cost_per_guest_inr: budgetSummary.costPerGuest,
      contingency_percentage: budgetSummary.contingencyPercentage,
      contingency_amount_inr: budgetSummary.contingencyAmount,
    },
    market_intelligence: {
      top_local_vendors: marketReport.top_local_vendors,
      social_media_trends: marketReport.social_media_trends,
    },
    smart_investment_combo: marketReport.smart_investment_combo,
    budget_breakdown: {
      categories: budgetSummary.categories,
      line_items: budgetSummary.lineItems,
      total_allocated_inr: budgetSummary.allocatedTotal,
      net_effective_cost_inr: budgetSummary.netEffectiveCost,
      total_synergy_savings_inr: budgetSummary.estimatedComboSavings,
    },
    timeline_wbs: wbsPhases,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([jsonString], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${marketReport.event_type.replace(/\s+/g, '_')}_EventGenie_Data.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Full Structured Synthesis (JSON)</h3>
            <p className="text-xs text-slate-400">
              Valid parseable JSON payload containing budget, scraped market data, synergy bundles, and WBS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-x-auto shadow-inner">
        <pre className="text-xs font-mono text-cyan-300 leading-relaxed max-h-[600px] overflow-y-auto scrollbar-thin">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
