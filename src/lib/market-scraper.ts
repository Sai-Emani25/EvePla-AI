/**
 * Social Media Scraper & Vendor Price Optimizer Module
 * Implements the localized market intelligence and synergy combo engine from the Python architecture.
 */

export interface ScrapedVendor {
  name: string;
  category: string;
  avg_cost: number;
  unit?: string;
  rating: number;
  deals: string;
  verified?: boolean;
  locality?: string;
  contact?: string;
}

export interface SmartInvestmentComboReport {
  combo_name: string;
  included_services: string[];
  base_cost_inr: number;
  optimized_cost_inr: number;
  estimated_savings_inr: number;
  roi_rationale: string;
}

export interface MarketAnalysisReport {
  timestamp: string;
  location: string;
  event_type: string;
  target_budget: number;
  top_local_vendors: ScrapedVendor[];
  social_media_trends: string[];
  smart_investment_combo: SmartInvestmentComboReport;
  raw_python_code?: string;
}

export const BENGALURU_VENDORS_DATABASE: ScrapedVendor[] = [
  {
    name: "Aura Celebrations",
    category: "Full Planning & Management",
    avg_cost: 45000,
    rating: 4.8,
    deals: "Free basic sound system setup with full package",
    locality: "Indiranagar, Bengaluru",
    verified: true,
  },
  {
    name: "GreenLeaf Caterers",
    category: "Catering",
    avg_cost: 650,
    unit: "per plate",
    rating: 4.6,
    deals: "10% off for bookings above 150 pax + complimentary welcome drinks",
    locality: "Koramangala, Bengaluru",
    verified: true,
  },
  {
    name: "PixelCraft Studios",
    category: "Photography & Video",
    avg_cost: 30000,
    rating: 4.9,
    deals: "Includes free drone shoot for weekday & Sunday afternoon events",
    locality: "HSR Layout, Bengaluru",
    verified: true,
  },
  {
    name: "Blossom & Twig Decor",
    category: "Decoration",
    avg_cost: 25000,
    rating: 4.7,
    deals: "Complimentary entrance photobooth setup and fairy-light tunnel",
    locality: "Whitefield, Bengaluru",
    verified: true,
  },
  {
    name: "Bangalore SoundLab & Lights",
    category: "Sound & Acoustics",
    avg_cost: 18000,
    rating: 4.7,
    deals: "Free wireless microphones and smoke machine upgrade",
    locality: "Jayanagar, Bengaluru",
    verified: true,
  },
  {
    name: "Serene Garden Verandas",
    category: "Venue",
    avg_cost: 60000,
    rating: 4.8,
    deals: "15% off for morning/day slots + waived outside vendor corkage",
    locality: "AECS Layout, Bengaluru",
    verified: true,
  },
  {
    name: "Saffron Royal Sweets & Chaat",
    category: "Specialty Live Counter",
    avg_cost: 12000,
    rating: 4.9,
    deals: "Free traditional filter coffee counter with live kachori station",
    locality: "Malleshwaram, Bengaluru",
    verified: true,
  },
];

/**
 * Direct TypeScript replica of the Python analyze_event_market_and_combos function.
 */
export function analyzeEventMarketAndCombos(
  eventType: string,
  budgetInr: number,
  location: string = "Bengaluru",
  guestCountOverride?: number
): MarketAnalysisReport {
  const isWedding = eventType.toLowerCase().includes("wedding");
  const estimatedGuests = guestCountOverride ?? (isWedding ? 150 : 50);

  // Scaled costs based on event type and budget
  const cateringPlateCost = isWedding ? 650 : 450;
  const cateringTotal = cateringPlateCost * estimatedGuests;
  const decorTotal = isWedding ? 25000 : 18000;
  const photoTotal = isWedding ? 30000 : 20000;

  const totalEstimated = cateringTotal + decorTotal + photoTotal;
  const savingsCombo = Math.round(totalEstimated * 0.15); // 15% bundle discount
  const optimizedCost = totalEstimated - savingsCombo;

  const trendingIdeas = [
    `Micro-venue fusion: Hosting ${eventType} in open-air garden spaces or boutique cafés to cut rental overhead by up to 30%.`,
    "Interactive DIY beverage or regional chaat stations instead of multi-course sit-down meals to minimize catering waste.",
    "Digital RSVP invitation landing pages with automated WhatsApp notification bots to eliminate printing costs.",
    `Eco-conscious upcycled flora & brass lanterns sourced from Avenue Road wholesale markets for 40% decor savings.`,
    `Off-peak morning/high-tea slots instead of prime dinner reservations to cut venue baseline tariff by 25%.`,
  ];

  const scrapedVendors: ScrapedVendor[] = [
    {
      name: "Aura Celebrations",
      category: "Full Planning",
      avg_cost: 45000,
      rating: 4.8,
      deals: "Free basic sound system setup with full package",
      locality: `${location} Central`,
    },
    {
      name: "GreenLeaf Caterers",
      category: "Catering",
      avg_cost: cateringPlateCost,
      unit: "per plate",
      rating: 4.6,
      deals: "10% off for bookings above 150 pax",
      locality: `${location} South`,
    },
    {
      name: "PixelCraft Studios",
      category: "Photography",
      avg_cost: photoTotal,
      rating: 4.9,
      deals: "Includes free drone shoot for weekday events",
      locality: `${location} Tech Hub`,
    },
    {
      name: "Blossom & Twig Decor",
      category: "Decoration",
      avg_cost: decorTotal,
      rating: 4.7,
      deals: "Complimentary entrance photobooth setup",
      locality: `${location} East`,
    },
  ];

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").substring(0, 19);

  return {
    timestamp,
    location,
    event_type: eventType,
    target_budget: budgetInr,
    top_local_vendors: scrapedVendors,
    social_media_trends: trendingIdeas,
    smart_investment_combo: {
      combo_name: "All-in-One Local Synergy Pack",
      included_services: [
        "Catering (GreenLeaf)",
        "Decoration (Blossom & Twig)",
        "Photography (PixelCraft)",
      ],
      base_cost_inr: totalEstimated,
      optimized_cost_inr: optimizedCost,
      estimated_savings_inr: savingsCombo,
      roi_rationale:
        "Bundling catering volume with preferred local decor partners unlocks wholesale pricing tiers without sacrificing guest experience.",
    },
  };
}

export const ORIGINAL_PYTHON_SOURCE = `import json
import os
from datetime import datetime

def analyze_event_market_and_combos(event_type: str, budget_inr: float, location: str = "Bengaluru"):
    """
    Simulates a localized social media and vendor scraper to extract cost-effective 
    ideas, budget-friendly local planners, and high-ROI investment combos.
    """
    # Simulated data reflecting local market intelligence for Bengaluru
    scraped_vendors = [
        {"name": "Aura Celebrations", "category": "Full Planning", "avg_cost": 45000, "rating": 4.8, "deals": "Free basic sound system setup with full package"},
        {"name": "GreenLeaf Caterers", "category": "Catering", "avg_cost": 650, "unit": "per plate", "rating": 4.6, "deals": "10% off for bookings above 150 pax"},
        {"name": "PixelCraft Studios", "category": "Photography", "avg_cost": 30000, "rating": 4.9, "deals": "Includes free drone shoot for weekday events"},
        {"name": "Blossom & Twig Decor", "category": "Decoration", "avg_cost": 25000, "rating": 4.7, "deals": "Complimentary entrance photobooth setup"}
    ]
    
    trending_ideas = [
        f"Micro-venue fusion: Hosting {event_type} in open-air garden spaces or boutique cafés to cut rental overhead by up to 30%.",
        "Interactive DIY beverage or regional chaat stations instead of multi-course sit-down meals to minimize catering waste.",
        "Digital RSVP invitation landing pages with automated WhatsApp notification bots to eliminate printing costs."
    ]
    
    # Calculate smart investment combos
    estimated_guests = 150 if event_type.lower() == "wedding" else 50
    catering_total = scraped_vendors[1]["avg_cost"] * estimated_guests
    decor_total = scraped_vendors[3]["avg_cost"]
    photo_total = scraped_vendors[2]["avg_cost"]
    
    total_estimated = catering_total + decor_total + photo_total
    savings_combo = total_estimated * 0.15 # 15% bundle discount simulation
    
    report = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "location": location,
        "event_type": event_type,
        "target_budget": budget_inr,
        "top_local_vendors": scraped_vendors,
        "social_media_trends": trending_ideas,
        "smart_investment_combo": {
            "combo_name": "All-in-One Local Synergy Pack",
            "included_services": ["Catering (GreenLeaf)", "Decoration (Blossom & Twig)", "Photography (PixelCraft)"],
            "base_cost_inr": total_estimated,
            "optimized_cost_inr": total_estimated - savings_combo,
            "estimated_savings_inr": savings_combo,
            "roi_rationale": "Bundling catering volume with preferred local decor partners unlocks wholesale pricing tiers without sacrificing guest experience."
        }
    }
    
    return report

# Execution example for a wedding in Bengaluru with a 2,50,000 INR budget
analysis_result = analyze_event_market_and_combos("Wedding", 250000.0, "Bengaluru")
print(json.dumps(analysis_result, indent=2))
`;
