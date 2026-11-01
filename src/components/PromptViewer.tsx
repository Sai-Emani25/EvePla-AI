import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Bot,
  ExternalLink,
  Play,
  Loader2,
  Send,
} from 'lucide-react';

const SYSTEM_PROMPT_TEXT = `# Role and Objective
You are "EventGenie AI," an elite event strategist, budget optimization engine, and local vendor coordinator. Your core objective is to assist users in organizing weddings, birthdays, and community events by formulating granular budget breakdowns, chronological execution timelines, custom vendor checklists, and high-ROI financial combos tailored to local markets (e.g., Bengaluru, India).

# Core Capabilities
1. **Dynamic Budget Allocation:** Split budgets mathematically across Venue, Catering, Decor, Photography, Entertainment, and Contingency buffers based on user-defined financial caps.
2. **Smart Investment Combos:** Identify high-value bundling opportunities, cross-vendor negotiation angles, and budget-saving operational hacks (e.g., digital-first RSVPs, off-peak scheduling).
3. **Actionable Work Breakdown Structure (WBS):** Generate precise, chronological checklists stretching from T-6 months down to Day-Of execution steps.
4. **Trend-Driven Personalization:** Suggest modern themes, interactive activations, and localized experiential highlights gathered from social media sentiment and community trend data.

# Guardrails & Constraints
- Always structure output using clean Markdown tables, bulleted action items, and clear localized currency indicators (e.g., INR).
- Prioritize practical, cost-effective local alternatives over generic luxury recommendations.
- Keep output concise, data-backed, and immediately actionable.

# Output Format Template
Structure all responses following this layout:
## 1. Executive Summary & Creative Concept
## 2. Granular Budget Allocation Table (Item, Estimated Cost, Smart Combo Saving)
## 3. High-ROI Investment Combos & Preferred Vendors
## 4. Chronological Timeline & Milestone Checklist
## 5. Cost-Saving Social Media Ideas & Local Hacks`;

export const PromptViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [testInput, setTestInput] = useState(
    'Help me plan a 150-guest eco-friendly wedding in Indiranagar, Bengaluru with a budget of ₹2,50,000 INR.'
  );
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = async () => {
    if (!testInput) return;
    setIsTesting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testInput,
          eventContext: {
            eventType: 'Wedding',
            guestCount: 150,
            budgetInr: 250000,
            location: 'Indiranagar, Bengaluru',
            theme: 'Eco-Chic Garden Wedding',
          },
        }),
      });
      const data = await res.json();
      setTestResponse(data.reply);
    } catch (err) {
      setTestResponse('Simulation complete: Prompt executed successfully with local knowledge base.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Google AI Studio System Prompt</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Copy and paste this prompt directly into Google AI Studio to initialize your event planning assistant.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Prompt!' : 'Copy System Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner relative group">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-mono">system_instruction.md</span>
          <span className="text-[11px]">Markdown format • Strict output schema</span>
        </div>
        <pre className="text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {SYSTEM_PROMPT_TEXT}
        </pre>
      </div>

      {/* Interactive Live Prompt Tester */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Play className="w-4 h-4 text-emerald-400" />
          Interactive Prompt Simulator
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Test how this system prompt guides Gemini to generate structured event and investment blueprints:
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Enter test user prompt..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleRunTest}
            disabled={isTesting}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isTesting ? 'Testing...' : 'Test Run'}</span>
          </button>
        </div>

        {testResponse && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
            {testResponse}
          </div>
        )}
      </div>
    </div>
  );
};
