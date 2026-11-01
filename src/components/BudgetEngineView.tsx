import React, { useState } from 'react';
import {
  Calculator,
  PieChart,
  ShieldAlert,
  Users,
  TrendingDown,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Utensils,
  Building2,
  Camera,
  Music,
  CheckCircle,
} from 'lucide-react';
import {
  BudgetSummary,
  BudgetCategory,
  LineItem,
  formatINR,
  calculateBudgetBreakdown,
} from '../lib/budget-engine';

interface BudgetEngineViewProps {
  budgetSummary: BudgetSummary;
  eventType: string;
  guestCount: number;
  onUpdateBudget: (newSummary: BudgetSummary) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  catering: 'from-amber-500 to-orange-600',
  venue: 'from-blue-500 to-indigo-600',
  decor: 'from-pink-500 to-rose-600',
  photography: 'from-purple-500 to-violet-600',
  entertainment: 'from-cyan-500 to-teal-600',
  contingency: 'from-emerald-500 to-green-600',
};

export const BudgetEngineView: React.FC<BudgetEngineViewProps> = ({
  budgetSummary,
  eventType,
  guestCount,
  onUpdateBudget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('catering');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Handle category slider change
  const handleSliderChange = (categoryId: string, newPercentage: number) => {
    const updatedCategories = budgetSummary.categories.map((c) => {
      if (c.id === categoryId) {
        return {
          ...c,
          percentage: newPercentage,
          allocatedAmount: Math.round(budgetSummary.totalBudget * (newPercentage / 100)),
        };
      }
      return c;
    });

    const customPercentages: Record<string, number> = {};
    updatedCategories.forEach((c) => {
      customPercentages[c.id] = c.percentage;
    });

    const recalculated = calculateBudgetBreakdown(
      budgetSummary.totalBudget,
      eventType,
      guestCount,
      customPercentages
    );
    onUpdateBudget({
      ...recalculated,
      lineItems: budgetSummary.lineItems, // keep custom line items
    });
  };

  // Handle line item delete
  const handleDeleteItem = (id: string) => {
    const updatedLineItems = budgetSummary.lineItems.filter((i) => i.id !== id);
    onUpdateBudget({
      ...budgetSummary,
      lineItems: updatedLineItems,
    });
  };

  // Handle add line item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemCost) return;

    const cost = parseFloat(newItemCost) || 0;
    const cat = budgetSummary.categories.find((c) => c.id === newItemCategory);

    const newItem: LineItem = {
      id: `custom-${Date.now()}`,
      categoryId: newItemCategory,
      categoryName: cat?.name || 'Custom',
      item: newItemName,
      estimatedCost: cost,
      smartComboSaving: Math.round(cost * 0.12), // 12% default combo estimate
      notes: newItemNotes || 'User added item',
    };

    onUpdateBudget({
      ...budgetSummary,
      lineItems: [...budgetSummary.lineItems, newItem],
    });

    setNewItemName('');
    setNewItemCost('');
    setNewItemNotes('');
    setShowAddModal(false);
  };

  // Reset allocations to standard baseline
  const handleReset = () => {
    const recalculated = calculateBudgetBreakdown(budgetSummary.totalBudget, eventType, guestCount);
    onUpdateBudget(recalculated);
  };

  const totalPercentage = budgetSummary.categories.reduce((acc, c) => acc + c.percentage, 0);
  const filteredLineItems =
    selectedCategory === 'all'
      ? budgetSummary.lineItems
      : budgetSummary.lineItems.filter((i) => i.categoryId === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top KPIs Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Total Budget Cap</span>
          <span className="text-xl font-bold text-white">{formatINR(budgetSummary.totalBudget)}</span>
          <span className="text-[11px] text-slate-500 block mt-1">100% baseline target</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Cost Per Guest</span>
          <span className="text-xl font-bold text-indigo-400">{formatINR(budgetSummary.costPerGuest)}</span>
          <span className="text-[11px] text-slate-500 block mt-1">For {guestCount} guests</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 block mb-1">Contingency Buffer</span>
          <span className="text-xl font-bold text-amber-400">{formatINR(budgetSummary.contingencyAmount)}</span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {budgetSummary.contingencyPercentage}% reserved for risks
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/20">
          <span className="text-xs font-medium text-purple-300 block mb-1">Wholesale Synergy Savings</span>
          <span className="text-xl font-bold text-emerald-400">
            +{formatINR(budgetSummary.estimatedComboSavings)}
          </span>
          <span className="text-[11px] text-emerald-500/90 block mt-1">15% bundle discount unlocked</span>
        </div>
      </div>

      {/* Dynamic Category Allocator Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              Dynamic Category Allocation Sliders
            </h3>
            <p className="text-xs text-slate-400">
              Tune percentage distributions to your priorities. All allocations auto-rebalance line items.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                totalPercentage === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              Sum: {totalPercentage}% {totalPercentage === 100 ? '(Balanced)' : `(${100 - totalPercentage}% remaining)`}
            </span>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs"
              title="Reset to recommended profile"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgetSummary.categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-slate-200 text-sm">{cat.name}</span>
                <span className="text-sm font-bold text-white">{cat.percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                <span>Allocated:</span>
                <span>{formatINR(cat.allocatedAmount)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={cat.percentage}
                onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-2 truncate" title={cat.description}>
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Line Items Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Granular Line Items & Combo Savings Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Detailed vendor quotes, cost estimates, and wholesale synergy savings
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {budgetSummary.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Item & Description</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold text-right">Estimated Cost</th>
                <th className="pb-3 font-semibold text-right">Synergy Saving</th>
                <th className="pb-3 font-semibold">Optimization Strategy</th>
                <th className="pb-3 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLineItems.map((item) => (
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
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs font-semibold">
                        -{formatINR(item.smartComboSaving)}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 text-xs text-slate-400 max-w-sm">{item.notes}</td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete line item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="text-base font-semibold text-white mb-3">Add Custom Budget Line Item</h4>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Traditional Dhol Players, Return Gifts"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {budgetSummary.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estimated Cost (INR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Strategic Notes / Vendor
                </label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g. Local vendor negotiated with 5% discount"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Add Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
