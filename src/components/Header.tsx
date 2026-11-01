import React from 'react';
import { Sparkles, Bot, MapPin, Zap, CheckCircle2, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  hasApiKey: boolean;
  onSelectPreset: (preset: {
    eventType: string;
    guestCount: number;
    budgetInr: number;
    location: string;
    theme: string;
  }) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat, hasApiKey, onSelectPreset }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  EventGenie AI
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    GenAI Investment Assistant
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  Bengaluru Local Market Intelligence
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3 h-3" />
                  15% Synergy Bundle Optimization
                </span>
              </p>
            </div>
          </div>

          {/* Quick Presets & AI Chat Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 hidden lg:inline">Quick Presets:</span>
            <button
              onClick={() =>
                onSelectPreset({
                  eventType: 'Wedding',
                  guestCount: 150,
                  budgetInr: 250000,
                  location: 'Bengaluru (Whitefield / Indiranagar)',
                  theme: 'Eco-Chic Botanical Open-Air',
                })
              }
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
            >
              💍 Bengaluru Wedding (₹2.5L)
            </button>
            <button
              onClick={() =>
                onSelectPreset({
                  eventType: 'Birthday',
                  guestCount: 50,
                  budgetInr: 65000,
                  location: 'Koramangala, Bengaluru',
                  theme: 'Retro Arcade & Live Chaat Counter',
                })
              }
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
            >
              🎂 Birthday Gala (₹65K)
            </button>
            <button
              onClick={() =>
                onSelectPreset({
                  eventType: 'Community Event',
                  guestCount: 200,
                  budgetInr: 150000,
                  location: 'AECS Layout, Bengaluru',
                  theme: 'Cultural Folk & Food Showcase',
                })
              }
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
            >
              🎪 Community Fest (₹1.5L)
            </button>

            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition ml-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Strategist Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
