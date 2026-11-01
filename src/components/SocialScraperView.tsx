import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCw,
  Copy,
  Check,
  Download,
  Sparkles,
  TrendingUp,
  MapPin,
  Star,
  Layers,
  Code2,
  FileCode,
} from 'lucide-react';
import {
  MarketAnalysisReport,
  ORIGINAL_PYTHON_SOURCE,
  ScrapedVendor,
} from '../lib/market-scraper';
import { formatINR } from '../lib/budget-engine';

interface SocialScraperViewProps {
  report: MarketAnalysisReport;
  onRefreshScraper: () => void;
  isLoading: boolean;
}

export const SocialScraperView: React.FC<SocialScraperViewProps> = ({
  report,
  onRefreshScraper,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'vendors' | 'python' | 'raw_json'>('trends');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ORIGINAL_PYTHON_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Scraper Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Social Media Scraper & Vendor Price Optimizer
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Python Engine Replicated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulated real-time social boards, local deal aggregators, and wholesale pricing for{' '}
                <strong className="text-slate-200">{report.location}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshScraper}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Mining Market Data...' : 'Run Local Scraper'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'trends'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Social Media Trends ({report.social_media_trends.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'vendors'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Top Local Vendors ({report.top_local_vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'python'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Script Source</span>
          </button>

          <button
            onClick={() => setActiveTab('raw_json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'raw_json'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Structured Output (JSON)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.social_media_trends.map((trend, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Trending Hack #{idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Synergy Combo Highlight Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Extracted Investment Synergy Combo
              </h4>
              <span className="text-xs font-bold text-emerald-400">
                Savings: {formatINR(report.smart_investment_combo.estimated_savings_inr)} (15%)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {report.smart_investment_combo.roi_rationale}
            </p>
            <div className="flex flex-wrap gap-2">
              {report.smart_investment_combo.included_services.map((svc, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                >
                  ✓ {svc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vendors */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.top_local_vendors.map((vendor, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white text-base">{vendor.name}</h4>
                  <span className="text-xs text-indigo-400 font-medium">{vendor.category}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{vendor.locality || `${report.location}`}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Exclusive Promotional Deal
                </span>
                <p className="text-xs text-slate-300">{vendor.deals}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Average Rate:</span>
                <span className="font-bold text-emerald-400">
                  {formatINR(vendor.avg_cost)} {vendor.unit ? `(${vendor.unit})` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Python Source Code */}
      {activeTab === 'python' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Python 3.x production scraper snippet with simulated market intelligence:
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Python'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-xs text-emerald-400 font-mono leading-relaxed">
            {ORIGINAL_PYTHON_SOURCE}
          </pre>
        </div>
      )}

      {/* Tab 4: Raw JSON */}
      {activeTab === 'raw_json' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Output schema strictly matching <code>json.dumps(analysis_result, indent=2)</code>:
            </span>
            <button
              onClick={handleCopyJson}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-xs text-cyan-300 font-mono leading-relaxed">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
