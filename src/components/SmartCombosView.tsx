import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle,
  ShieldCheck,
  Star,
  MapPin,
  Tag,
  PhoneCall,
  Check,
  ArrowRight,
} from 'lucide-react';
import { SmartInvestmentCombo, formatINR } from '../lib/budget-engine';
import { ScrapedVendor, BENGALURU_VENDORS_DATABASE } from '../lib/market-scraper';

interface SmartCombosViewProps {
  smartCombo: SmartInvestmentCombo;
  vendors: ScrapedVendor[];
}

export const SmartCombosView: React.FC<SmartCombosViewProps> = ({ smartCombo, vendors }) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([
    'GreenLeaf Caterers',
    'Blossom & Twig Decor',
    'PixelCraft Studios',
  ]);

  const toggleVendor = (vendorName: string) => {
    if (selectedVendors.includes(vendorName)) {
      if (selectedVendors.length > 1) {
        setSelectedVendors(selectedVendors.filter((v) => v !== vendorName));
      }
    } else {
      setSelectedVendors([...selectedVendors, vendorName]);
    }
  };

  // Calculate dynamic bundle savings based on active selections
  const activeVendorObjects = BENGALURU_VENDORS_DATABASE.filter((v) =>
    selectedVendors.includes(v.name)
  );

  const dynamicBaseCost = activeVendorObjects.reduce((sum, v) => {
    // If unit is per plate, simulate 150 pax
    const cost = v.unit === 'per plate' ? v.avg_cost * 150 : v.avg_cost;
    return sum + cost;
  }, 0);

  const bundleRate = selectedVendors.length >= 3 ? 0.15 : selectedVendors.length === 2 ? 0.10 : 0.05;
  const dynamicSavings = Math.round(dynamicBaseCost * bundleRate);
  const dynamicOptimized = dynamicBaseCost - dynamicSavings;

  return (
    <div className="space-y-6">
      {/* Hero Synergy Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950/60 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Wholesale Partner Synergy Protocol</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {smartCombo.comboName}
            </h3>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              {smartCombo.roiRationale}
            </p>
          </div>

          {/* Pricing Comparison Card */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 block mb-0.5">Standalone Total</span>
              <span className="text-lg font-bold text-slate-400 line-through">
                {formatINR(dynamicBaseCost)}
              </span>
            </div>

            <div className="hidden sm:block text-slate-600">→</div>

            <div className="text-center sm:text-left">
              <span className="text-xs text-emerald-400 font-semibold block mb-0.5">
                Bundled Synergy Price
              </span>
              <span className="text-2xl font-black text-emerald-300">
                {formatINR(dynamicOptimized)}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                Direct Savings
              </span>
              <span className="text-base font-extrabold text-purple-200">
                {formatINR(dynamicSavings)} ({(bundleRate * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Vendor Selector Pill Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-500/20">
          <span className="text-xs font-semibold text-slate-300 block mb-2.5">
            Interactive Bundle Builder (Toggle Vendors to Test Synergy Discounts):
          </span>
          <div className="flex flex-wrap gap-2">
            {BENGALURU_VENDORS_DATABASE.map((v) => {
              const isSelected = selectedVendors.includes(v.name);
              return (
                <button
                  key={v.name}
                  onClick={() => toggleVendor(v.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      isSelected ? 'bg-white text-indigo-700 font-bold' : 'border border-slate-600'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{v.name}</span>
                  <span className="text-[10px] opacity-75">({v.category})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Local Vendors Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Verified Local Vendor Partners (Bengaluru Intelligence)
            </h4>
            <p className="text-xs text-slate-400">
              Scraped from local wedding registers, community boards, and wholesale networks
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {BENGALURU_VENDORS_DATABASE.length} Pre-Vetted Vendors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENGALURU_VENDORS_DATABASE.map((vendor, idx) => {
            const isBundled = selectedVendors.includes(vendor.name);
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-slate-900 border transition flex flex-col justify-between ${
                  isBundled
                    ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h5 className="font-bold text-slate-100 text-sm">{vendor.name}</h5>
                      <span className="text-xs text-indigo-400 font-medium">{vendor.category}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{vendor.locality || 'Bengaluru'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      Exclusive Partner Deal
                    </span>
                    <p className="text-xs text-slate-200">{vendor.deals}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Baseline Tariff</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {formatINR(vendor.avg_cost)} {vendor.unit ? `/${vendor.unit}` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleVendor(vendor.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      isBundled
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isBundled ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>In Bundle</span>
                      </>
                    ) : (
                      <span>+ Add to Bundle</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
