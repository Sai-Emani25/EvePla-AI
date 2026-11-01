/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Zap,
  Clock,
  Terminal,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Header } from './components/Header';
import { ParameterForm, EventParameters } from './components/ParameterForm';
import { ExecutiveSynthesis } from './components/ExecutiveSynthesis';
import { BudgetEngineView } from './components/BudgetEngineView';
import { SmartCombosView } from './components/SmartCombosView';
import { TimelineWbsView } from './components/TimelineWbsView';
import { SocialScraperView } from './components/SocialScraperView';
import { PromptViewer } from './components/PromptViewer';
import { JsonViewer } from './components/JsonViewer';
import { AiChatDrawer } from './components/AiChatDrawer';

import {
  BudgetSummary,
  calculateBudgetBreakdown,
  formatINR,
} from './lib/budget-engine';
import {
  MarketAnalysisReport,
  analyzeEventMarketAndCombos,
  BENGALURU_VENDORS_DATABASE,
} from './lib/market-scraper';
import { WbsPhase, generateDefaultWbs } from './lib/timeline-wbs';

export default function App() {
  const [parameters, setParameters] = useState<EventParameters>({
    eventType: 'Wedding',
    guestCount: 150,
    budgetInr: 250000,
    location: 'Bengaluru (Indiranagar / Whitefield)',
    theme: 'Eco-Chic Garden Serenity with Floral Canopies',
    priorities: 'Artisanal Catering, Drone Cinematography, Photobooth',
    notes: 'Require vegetarian & Jain counters; prefer outdoor morning ceremony.',
  });

  const [activeTab, setActiveTab] = useState<
    'synthesis' | 'budget' | 'combos' | 'timeline' | 'scraper' | 'prompt' | 'json'
  >('synthesis');

  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [generatedFromAi, setGeneratedFromAi] = useState(false);

  // Core application state
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(() =>
    calculateBudgetBreakdown(250000, 'Wedding', 150)
  );

  const [marketReport, setMarketReport] = useState<MarketAnalysisReport>(() =>
    analyzeEventMarketAndCombos('Wedding', 250000, 'Bengaluru', 150)
  );

  const [wbsPhases, setWbsPhases] = useState<WbsPhase[]>(() =>
    generateDefaultWbs('Wedding', 150)
  );

  const [aiMarkdown, setAiMarkdown] = useState<string>(() => {
    const b = calculateBudgetBreakdown(250000, 'Wedding', 150);
    return `## 1. Executive Summary & Theme Concept
**Concept:** Eco-Chic Garden Serenity with Floral Canopies
Organizing a **Wedding** in **Bengaluru** for **150 guests** within a disciplined budget cap of **${formatINR(250000)}** (average **${formatINR(b.costPerGuest)} per guest**).
By activating micro-venue open-air spaces and leveraging pre-negotiated wholesale vendor bundles, we achieve high aesthetic impact while locking in **${formatINR(b.estimatedComboSavings)} (15%) in direct savings**.

---

## 2. Granular Budget Breakdown
| Item / Category | Estimated Cost (INR) | Smart Combo Saving | Key Strategic Notes |
| :--- | :--- | :--- | :--- |
${b.lineItems
  .map(
    (item) =>
      `| **${item.item}** (${item.categoryName}) | ${formatINR(item.estimatedCost)} | ${
        item.smartComboSaving > 0 ? formatINR(item.smartComboSaving) : '—'
      } | ${item.notes} |`
  )
  .join('\n')}
| **Contingency Buffer (10%)** | ${formatINR(b.contingencyAmount)} | Safeguard Reserve | Unforeseen weather, transit, or day-of surge |
| **TOTAL ALLOCATED** | **${formatINR(b.totalBudget)}** | **${formatINR(b.estimatedComboSavings)} Saved** | **Net Effective: ${formatINR(b.netEffectiveCost)}** |

---

## 3. High-ROI Investment Combos & Vendor Recommendations
### **${b.smartCombo.comboName}**
* **Included Services:** ${b.smartCombo.includedServices.join(', ')}
* **Base Standalone Cost:** ${formatINR(b.smartCombo.baseCostInr)}
* **Optimized Bundle Cost:** ${formatINR(b.smartCombo.optimizedCostInr)}
* **Direct Estimated Savings:** ${formatINR(b.smartCombo.estimatedSavingsInr)} (15% Wholesale Bundle Synergy)
* **ROI Rationale:** ${b.smartCombo.roiRationale}

#### Recommended Local Partners:
${b.smartCombo.recommendedVendors
  .map((v) => `- **${v.name}** (${v.category}): ${v.deal}`)
  .join('\n')}

---

## 4. Chronological Timeline & Checklist (T-Minus Schedule)
* **T-6 to T-4 Months:** Lock budget cap, reserve venue in Bengaluru, execute 3-way vendor synergy bundle.
* **T-3 to T-2 Months:** Finalize menu tasting with GreenLeaf Caterers; brief PixelCraft on drone permits; deploy WhatsApp RSVP bot.
* **T-1 Month to T-2 Weeks:** Reconcile RSVP headcount (+5% caterer buffer plate guarantee); inspect Bangalore SoundLab electrical load.
* **T-3 Days to 24 Hours:** Slot vendor ingress staggered arrivals; pack contingency emergency first-aid and cash envelopes.
* **Day-Of Execution:** 08:00 AM Decor Rigging -> 11:30 AM Catering Hygiene Audit -> 05:00 PM Guest Welcome -> 10:30 PM Leftover Food Donation.

---

## 5. Cost-Saving Social Hacks & Personalized Ideas
- Micro-venue fusion: Hosting Wedding in open-air garden cafes in AECS Layout/Whitefield to save 30% on rental overhead.
- Interactive DIY beverage and chaat bars instead of heavy sit-down counters to cut catering waste by 20%.
- Digital RSVP portals with automated WhatsApp reminder bots replacing traditional printed invitations.
- Eco-conscious upcycled flora & brass lanterns sourced from Avenue Road wholesale markets for 40% decor savings.
- Off-peak morning/high-tea slots instead of prime dinner reservations to cut venue baseline tariff by 25%.`;
  });

  // Note: Initial state is already generated deterministically; clicking "Generate GenAI Event & Investment Plan" will run server orchestrator!
  useEffect(() => {
    // Check server health silently
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHasApiKey(d.hasApiKey))
      .catch(() => {});
  }, []);

  const handleRunOrchestrator = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedFromAi(data.generatedFromAi);
        setAiMarkdown(data.aiMarkdown);
        if (data.budgetSummary) setBudgetSummary(data.budgetSummary);
        if (data.marketReport) setMarketReport(data.marketReport);
        if (data.wbsPhases) setWbsPhases(data.wbsPhases);
      } else {
        throw new Error('Server returned non-200');
      }
    } catch (err) {
      console.warn('Falling back to local orchestrator synthesis:', err);
      // Deterministic fallback
      const b = calculateBudgetBreakdown(
        parameters.budgetInr,
        parameters.eventType,
        parameters.guestCount
      );
      const m = analyzeEventMarketAndCombos(
        parameters.eventType,
        parameters.budgetInr,
        parameters.location,
        parameters.guestCount
      );
      const w = generateDefaultWbs(parameters.eventType, parameters.guestCount);
      setBudgetSummary(b);
      setMarketReport(m);
      setWbsPhases(w);
      setGeneratedFromAi(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshScraper = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/scrape-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: parameters.eventType,
          budgetInr: parameters.budgetInr,
          location: parameters.location,
          guestCount: parameters.guestCount,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketReport(data);
      }
    } catch (err) {
      const m = analyzeEventMarketAndCombos(
        parameters.eventType,
        parameters.budgetInr,
        parameters.location,
        parameters.guestCount
      );
      setMarketReport(m);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: {
    eventType: string;
    guestCount: number;
    budgetInr: number;
    location: string;
    theme: string;
  }) => {
    const updated = {
      ...parameters,
      ...preset,
    };
    setParameters(updated);
    // Recalculate
    const b = calculateBudgetBreakdown(preset.budgetInr, preset.eventType, preset.guestCount);
    const m = analyzeEventMarketAndCombos(preset.eventType, preset.budgetInr, preset.location, preset.guestCount);
    const w = generateDefaultWbs(preset.eventType, preset.guestCount);
    setBudgetSummary(b);
    setMarketReport(m);
    setWbsPhases(w);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        hasApiKey={hasApiKey}
        onSelectPreset={handleSelectPreset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Parameters Controller Form */}
        <ParameterForm
          parameters={parameters}
          onChange={setParameters}
          onSubmit={handleRunOrchestrator}
          isLoading={isLoading}
        />

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('synthesis')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'synthesis'
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Executive Synthesis</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'budget'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Budget & ROI Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('combos')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'combos'
                  ? 'border-purple-500 text-purple-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Smart Combos & Synergies</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                15% Save
              </span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-cyan-500 text-cyan-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Timeline & WBS Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'scraper'
                  ? 'border-rose-500 text-rose-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Terminal className="w-4 h-4 text-rose-400" />
              <span>Social Scraper (Python)</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'prompt'
                  ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>AI Studio Prompt</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'json'
                  ? 'border-blue-500 text-blue-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Structured JSON</span>
            </button>
          </nav>
        </div>

        {/* Tab Content Views */}
        <div className="pt-2">
          {activeTab === 'synthesis' && (
            <ExecutiveSynthesis
              markdown={aiMarkdown}
              budgetSummary={budgetSummary}
              marketReport={marketReport}
              wbsPhases={wbsPhases}
              generatedFromAi={generatedFromAi}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetEngineView
              budgetSummary={budgetSummary}
              eventType={parameters.eventType}
              guestCount={parameters.guestCount}
              onUpdateBudget={setBudgetSummary}
            />
          )}

          {activeTab === 'combos' && (
            <SmartCombosView
              smartCombo={budgetSummary.smartCombo}
              vendors={marketReport.top_local_vendors}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineWbsView phases={wbsPhases} onUpdatePhases={setWbsPhases} />
          )}

          {activeTab === 'scraper' && (
            <SocialScraperView
              report={marketReport}
              onRefreshScraper={handleRefreshScraper}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'prompt' && <PromptViewer />}

          {activeTab === 'json' && (
            <JsonViewer
              marketReport={marketReport}
              budgetSummary={budgetSummary}
              wbsPhases={wbsPhases}
            />
          )}
        </div>
      </main>

      {/* Floating AI Strategist Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        parameters={parameters}
      />
    </div>
  );
}
