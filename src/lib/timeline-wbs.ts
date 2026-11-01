/**
 * Timeline & WBS (Work Breakdown Structure) Engine
 * Generates actionable milestone checklists and day-of execution schedules.
 */

export interface WbsTask {
  id: string;
  phaseId: string;
  phaseTitle: string;
  title: string;
  description: string;
  category: "Venue" | "Catering" | "Decor" | "Media" | "Legal/Admin" | "Guest/RSVP" | "Tech";
  priority: "High" | "Medium" | "Low";
  targetTMinus: string;
  isCompleted: boolean;
  assignedVendor?: string;
  estimatedCost?: number;
}

export interface WbsPhase {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  tasks: WbsTask[];
}

export function generateDefaultWbs(eventType: string, guestCount: number): WbsPhase[] {
  const isWedding = eventType.toLowerCase().includes("wedding");

  return [
    {
      id: "phase-6m",
      title: "Foundation & Vendor Lockdown",
      timeframe: "T-6 to T-4 Months",
      description: "Establish vision, anchor budget, shortlist and lock anchor vendors before seasonal price hikes.",
      tasks: [
        {
          id: "task-1",
          phaseId: "phase-6m",
          phaseTitle: "Foundation & Vendor Lockdown",
          title: "Define Budget Cap & Category Split",
          description: `Lock baseline budget and reserve 10% for contingencies. Estimated guest count: ${guestCount} pax.`,
          category: "Legal/Admin",
          priority: "High",
          targetTMinus: "T-6 Months",
          isCompleted: true,
        },
        {
          id: "task-2",
          phaseId: "phase-6m",
          phaseTitle: "Foundation & Vendor Lockdown",
          title: "Site Visit & Venue Booking",
          description: "Inspect garden verandas and banquet spaces in preferred Bengaluru locality (Indiranagar / Whitefield). Verify sound cutoff rules.",
          category: "Venue",
          priority: "High",
          targetTMinus: "T-5 Months",
          isCompleted: true,
        },
        {
          id: "task-3",
          phaseId: "phase-6m",
          phaseTitle: "Foundation & Vendor Lockdown",
          title: "Lock Smart Synergy Bundle",
          description: "Engage GreenLeaf Caterers & Blossom & Twig Decor together to unlock the 15% wholesale bundle synergy.",
          category: "Catering",
          priority: "High",
          targetTMinus: "T-4 Months",
          isCompleted: false,
          assignedVendor: "GreenLeaf + Blossom & Twig",
        },
      ],
    },
    {
      id: "phase-3m",
      title: "Design, Taste & Media Briefing",
      timeframe: "T-3 to T-2 Months",
      description: "Sample menus, finalize aesthetic decor mockups, and brief cinematography crews.",
      tasks: [
        {
          id: "task-4",
          phaseId: "phase-3m",
          phaseTitle: "Design, Taste & Media Briefing",
          title: "Menu Food Tasting & Live Counter Selection",
          description: "Sample regional signature delicacies, confirm chaat counter varieties and mocktail menu ratios.",
          category: "Catering",
          priority: "Medium",
          targetTMinus: "T-3 Months",
          isCompleted: false,
          assignedVendor: "GreenLeaf Caterers",
        },
        {
          id: "task-5",
          phaseId: "phase-3m",
          phaseTitle: "Design, Taste & Media Briefing",
          title: "Cinematography Shot List & Drone Permissions",
          description: "Agree on candid moments, family group compositions, and confirm drone clearance with venue.",
          category: "Media",
          priority: "Medium",
          targetTMinus: "T-2.5 Months",
          isCompleted: false,
          assignedVendor: "PixelCraft Studios",
        },
        {
          id: "task-6",
          phaseId: "phase-3m",
          phaseTitle: "Design, Taste & Media Briefing",
          title: "Deploy Digital RSVP Portal & WhatsApp Bot",
          description: "Save ~80% on print invites; launch dynamic RSVP bot with dietary preferences and live dashboard sync.",
          category: "Tech",
          priority: "High",
          targetTMinus: "T-2 Months",
          isCompleted: false,
        },
      ],
    },
    {
      id: "phase-1m",
      title: "Logistics & Final Headcount",
      timeframe: "T-1 Month to T-2 Weeks",
      description: "Firm up headcount guarantees, sequence run-of-show cues, and coordinate power & sound permits.",
      tasks: [
        {
          id: "task-7",
          phaseId: "phase-1m",
          phaseTitle: "Logistics & Final Headcount",
          title: "Audit RSVP Headcount & Adjust Plate Guarantee",
          description: "Reconcile WhatsApp RSVP responses. Lock final buffer (+5% plates) with caterer to avoid wastage penalties.",
          category: "Guest/RSVP",
          priority: "High",
          targetTMinus: "T-3 Weeks",
          isCompleted: false,
        },
        {
          id: "task-8",
          phaseId: "phase-1m",
          phaseTitle: "Logistics & Final Headcount",
          title: "Acoustics & Power Generator Backup Check",
          description: "Inspect generator load capacity for stage LED wall, sound console, and floral illumination spotlights.",
          category: "Tech",
          priority: "High",
          targetTMinus: "T-2 Weeks",
          isCompleted: false,
          assignedVendor: "Bangalore SoundLab",
        },
      ],
    },
    {
      id: "phase-week",
      title: "Rehearsal & Zero-Hour Readiness",
      timeframe: "T-3 Days to T-24 Hours",
      description: "Dry run of schedule, green-room setups, vendor arrival checkpoints, and contingency cash dispatch.",
      tasks: [
        {
          id: "task-9",
          phaseId: "phase-week",
          phaseTitle: "Rehearsal & Zero-Hour Readiness",
          title: "Vendor Entry Pass & Setup Slots",
          description: "Slot decor load-in at 06:00 AM, caterer setup at 09:00 AM, sound check at 11:00 AM.",
          category: "Venue",
          priority: "High",
          targetTMinus: "T-2 Days",
          isCompleted: false,
        },
        {
          id: "task-10",
          phaseId: "phase-week",
          phaseTitle: "Rehearsal & Zero-Hour Readiness",
          title: "Emergency Contingency Kit Assembly",
          description: "First aid, sewing kit, spare battery packs, umbrella cache, cash envelopes for tips.",
          category: "Legal/Admin",
          priority: "Medium",
          targetTMinus: "T-1 Day",
          isCompleted: false,
        },
      ],
    },
    {
      id: "phase-dayof",
      title: "Day-Of Execution & Run of Show",
      timeframe: "Event Day (07:00 AM - 11:30 PM)",
      description: "Real-time step-by-step master chronology for coordinators and hosts.",
      tasks: [
        {
          id: "task-11",
          phaseId: "phase-dayof",
          phaseTitle: "Day-Of Execution & Run of Show",
          title: "08:00 AM - Decor Rigging & Lighting Inspection",
          description: "Verify photobooth backdrop stability, stage floral symmetry, and aisle carpeting.",
          category: "Decor",
          priority: "High",
          targetTMinus: "Day-Of 08:00 AM",
          isCompleted: false,
          assignedVendor: "Blossom & Twig",
        },
        {
          id: "task-12",
          phaseId: "phase-dayof",
          phaseTitle: "Day-Of Execution & Run of Show",
          title: "11:30 AM - Catering Readiness & Hygiene Audit",
          description: "Check warming trays, ice reserves for mocktail bar, sanitizer stations, and chef team briefing.",
          category: "Catering",
          priority: "High",
          targetTMinus: "Day-Of 11:30 AM",
          isCompleted: false,
          assignedVendor: "GreenLeaf Caterers",
        },
        {
          id: "task-13",
          phaseId: "phase-dayof",
          phaseTitle: "Day-Of Execution & Run of Show",
          title: "05:00 PM - Guest Welcome & Live Photography Kickoff",
          description: "Reception desk active, QR code gallery photo-sharing enabled, candid photographers positioned.",
          category: "Media",
          priority: "High",
          targetTMinus: "Day-Of 05:00 PM",
          isCompleted: false,
          assignedVendor: "PixelCraft Studios",
        },
        {
          id: "task-14",
          phaseId: "phase-dayof",
          phaseTitle: "Day-Of Execution & Run of Show",
          title: "10:30 PM - Vendor Sign-Off & Leftover Food Coordination",
          description: "Distribute remaining catered food via local food rescue charity (e.g. Robin Hood Army Bangalore).",
          category: "Legal/Admin",
          priority: "Medium",
          targetTMinus: "Day-Of 10:30 PM",
          isCompleted: false,
        },
      ],
    },
  ];
}
