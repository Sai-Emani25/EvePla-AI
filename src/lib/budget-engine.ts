/**
 * Budget Allocation & ROI Investment Engine for EventGenie AI
 */

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  allocatedAmount: number;
  description: string;
  suggestedVendors?: string[];
  icon: string;
}

export interface LineItem {
  id: string;
  categoryId: string;
  categoryName: string;
  item: string;
  estimatedCost: number;
  actualCost?: number;
  smartComboSaving: number;
  notes: string;
}

export interface SmartInvestmentCombo {
  comboName: string;
  includedServices: string[];
  baseCostInr: number;
  optimizedCostInr: number;
  estimatedSavingsInr: number;
  savingsPercentage: number;
  roiRationale: string;
  recommendedVendors: Array<{
    name: string;
    category: string;
    deal: string;
  }>;
}

export interface BudgetSummary {
  totalBudget: number;
  allocatedTotal: number;
  contingencyAmount: number;
  contingencyPercentage: number;
  costPerGuest: number;
  estimatedComboSavings: number;
  netEffectiveCost: number;
  categories: BudgetCategory[];
  lineItems: LineItem[];
  smartCombo: SmartInvestmentCombo;
}

/** Default category percentages by event type */
export const EVENT_BUDGET_PROFILES: Record<string, Record<string, number>> = {
  Wedding: {
    venue: 22,
    catering: 32,
    decor: 16,
    photography: 12,
    entertainment: 8,
    contingency: 10,
  },
  Birthday: {
    venue: 20,
    catering: 35,
    decor: 18,
    entertainment: 12,
    photography: 7,
    contingency: 8,
  },
  "Community Event": {
    venue: 25,
    catering: 28,
    decor: 12,
    entertainment: 15,
    photography: 8,
    contingency: 12,
  },
  "Corporate Gala": {
    venue: 30,
    catering: 30,
    tech_av: 15,
    decor: 10,
    photography: 7,
    contingency: 8,
  },
};

export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  // Format to Indian numbering system (Lakhs and Crores)
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));
  
  const numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return (isNegative ? "-₹" : "₹") + formatted;
}

export function calculateBudgetBreakdown(
  totalBudget: number,
  eventType: string,
  guestCount: number,
  customPercentages?: Record<string, number>
): BudgetSummary {
  const profile = customPercentages || EVENT_BUDGET_PROFILES[eventType] || EVENT_BUDGET_PROFILES.Wedding;
  
  const categories: BudgetCategory[] = [
    {
      id: "catering",
      name: "Catering & Beverages",
      percentage: profile.catering ?? 32,
      allocatedAmount: Math.round(totalBudget * ((profile.catering ?? 32) / 100)),
      description: "Live counters, interactive drinks bar, multi-course feast, service staff",
      icon: "Utensils",
    },
    {
      id: "venue",
      name: "Venue & Hospitality",
      percentage: profile.venue ?? 22,
      allocatedAmount: Math.round(totalBudget * ((profile.venue ?? 22) / 100)),
      description: "Hall / garden rental, basic electricity, green rooms, valet coordination",
      icon: "Building2",
    },
    {
      id: "decor",
      name: "Decoration & Floral Ambience",
      percentage: profile.decor ?? 16,
      allocatedAmount: Math.round(totalBudget * ((profile.decor ?? 16) / 100)),
      description: "Entrance photobooth, stage backdrop, ambient lighting, sustainable floral styling",
      icon: "Sparkles",
    },
    {
      id: "photography",
      name: "Photography & Cinematography",
      percentage: profile.photography ?? 12,
      allocatedAmount: Math.round(totalBudget * ((profile.photography ?? 12) / 100)),
      description: "Candid & traditional team, drone coverage, teaser reel, digital gallery cloud",
      icon: "Camera",
    },
    {
      id: "entertainment",
      name: "Entertainment & Sound",
      percentage: profile.entertainment ?? 8,
      allocatedAmount: Math.round(totalBudget * ((profile.entertainment ?? 8) / 100)),
      description: "DJ / acoustic live band, sound acoustics, emcee/host, dance floor rigging",
      icon: "Music",
    },
    {
      id: "contingency",
      name: "Contingency & Incidentals",
      percentage: profile.contingency ?? 10,
      allocatedAmount: Math.round(totalBudget * ((profile.contingency ?? 10) / 100)),
      description: "Last-minute guest additions, transit spikes, weather safeguards, generator fuel",
      icon: "ShieldAlert",
    },
  ];

  const allocatedTotal = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const contingencyCategory = categories.find((c) => c.id === "contingency");
  const contingencyAmount = contingencyCategory ? contingencyCategory.allocatedAmount : 0;
  const costPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;

  // Generate Granular Line Items with Smart Combo Savings
  const lineItems: LineItem[] = [
    {
      id: "item-1",
      categoryId: "catering",
      categoryName: "Catering",
      item: `Curated Buffet / Live Counters (${guestCount} pax)`,
      estimatedCost: Math.round(categories[0].allocatedAmount * 0.75),
      smartComboSaving: Math.round(categories[0].allocatedAmount * 0.10),
      notes: "Leverage GreenLeaf Caterers volume tier discount for 150+ pax",
    },
    {
      id: "item-2",
      categoryId: "catering",
      categoryName: "Catering",
      item: "Interactive DIY Beverage & Mocktail Bar",
      estimatedCost: Math.round(categories[0].allocatedAmount * 0.25),
      smartComboSaving: Math.round(categories[0].allocatedAmount * 0.05),
      notes: "Cuts standard bar overhead by 20% through self-serve mixology",
    },
    {
      id: "item-3",
      categoryId: "venue",
      categoryName: "Venue",
      item: "Open-Air Garden / Banquet Space Rental",
      estimatedCost: Math.round(categories[1].allocatedAmount * 0.85),
      smartComboSaving: Math.round(categories[1].allocatedAmount * 0.15),
      notes: "Micro-venue rental in Whitefield / AECS Layout saves 30% overhead",
    },
    {
      id: "item-4",
      categoryId: "venue",
      categoryName: "Venue",
      item: "Generator Backup, Valet & Cleaning Fees",
      estimatedCost: Math.round(categories[1].allocatedAmount * 0.15),
      smartComboSaving: 0,
      notes: "Mandatory municipal compliance & facility services",
    },
    {
      id: "item-5",
      categoryId: "decor",
      categoryName: "Decoration",
      item: "Stage Backdrop & Geometric Photo Corner",
      estimatedCost: Math.round(categories[2].allocatedAmount * 0.65),
      smartComboSaving: Math.round(categories[2].allocatedAmount * 0.15),
      notes: "Complimentary entrance photobooth setup via Blossom & Twig combo",
    },
    {
      id: "item-6",
      categoryId: "decor",
      categoryName: "Decoration",
      item: "Fairy Light Canopies & Table Centerpieces",
      estimatedCost: Math.round(categories[2].allocatedAmount * 0.35),
      smartComboSaving: Math.round(categories[2].allocatedAmount * 0.08),
      notes: "Local marigold and recycled brass fixtures reduce waste",
    },
    {
      id: "item-7",
      categoryId: "photography",
      categoryName: "Photography",
      item: "Candid + Traditional Dual Shooter Package",
      estimatedCost: Math.round(categories[3].allocatedAmount * 0.80),
      smartComboSaving: Math.round(categories[3].allocatedAmount * 0.12),
      notes: "PixelCraft Studios bundle includes complimentary drone teaser",
    },
    {
      id: "item-8",
      categoryId: "photography",
      categoryName: "Photography",
      item: "Same-Day Teaser Reel & High-Res Cloud Gallery",
      estimatedCost: Math.round(categories[3].allocatedAmount * 0.20),
      smartComboSaving: Math.round(categories[3].allocatedAmount * 0.05),
      notes: "Immediate social sharing drives engagement",
    },
    {
      id: "item-9",
      categoryId: "entertainment",
      categoryName: "Entertainment",
      item: "Sound Engineering & Acoustic DJ Setup",
      estimatedCost: Math.round(categories[4].allocatedAmount * 0.80),
      smartComboSaving: Math.round(categories[4].allocatedAmount * 0.15),
      notes: "Free sound equipment integration with Aura Celebrations package",
    },
    {
      id: "item-10",
      categoryId: "entertainment",
      categoryName: "Entertainment",
      item: "Emcee / Event Facilitator",
      estimatedCost: Math.round(categories[4].allocatedAmount * 0.20),
      smartComboSaving: 0,
      notes: "Bilingual host for guest coordination & games",
    },
  ];

  // Calculate Smart Investment Combo
  const comboBase = Math.round(
    (categories[0].allocatedAmount * 0.8) +
    (categories[2].allocatedAmount * 0.9) +
    (categories[3].allocatedAmount * 0.9)
  );
  const bundleDiscountRate = 0.15; // 15% wholesale bundle synergy
  const comboSavings = Math.round(comboBase * bundleDiscountRate);
  const comboOptimized = comboBase - comboSavings;

  const smartCombo: SmartInvestmentCombo = {
    comboName: "Local Market Synergy Triple Pack",
    includedServices: [
      "Tier-1 Catering (GreenLeaf Caterers)",
      "Botanical Decor & Photobooth (Blossom & Twig)",
      "Drone + Candid Cinematography (PixelCraft Studios)",
    ],
    baseCostInr: comboBase,
    optimizedCostInr: comboOptimized,
    estimatedSavingsInr: comboSavings,
    savingsPercentage: 15,
    roiRationale:
      "Bundling high-volume catering with pre-vetted decor partners and visual media unlocks Tier-1 wholesale pricing without sacrificing guest experience.",
    recommendedVendors: [
      {
        name: "GreenLeaf Caterers",
        category: "Catering",
        deal: "10% off for bookings above 150 pax + free live dessert counter",
      },
      {
        name: "Blossom & Twig Decor",
        category: "Decoration",
        deal: "Complimentary entrance photobooth & floral backdrop styling",
      },
      {
        name: "PixelCraft Studios",
        category: "Photography",
        deal: "Includes free 4K aerial drone shoot & same-day social reel",
      },
    ],
  };

  return {
    totalBudget,
    allocatedTotal,
    contingencyAmount,
    contingencyPercentage: profile.contingency ?? 10,
    costPerGuest,
    estimatedComboSavings: comboSavings,
    netEffectiveCost: totalBudget - comboSavings,
    categories,
    lineItems,
    smartCombo,
  };
}
