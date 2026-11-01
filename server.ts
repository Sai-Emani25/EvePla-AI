import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  calculateBudgetBreakdown,
  formatINR,
} from './src/lib/budget-engine.ts';
import {
  analyzeEventMarketAndCombos,
  ORIGINAL_PYTHON_SOURCE,
  BENGALURU_VENDORS_DATABASE,
} from './src/lib/market-scraper.ts';
import { generateDefaultWbs } from './src/lib/timeline-wbs.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client (Server-Side Only)
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const EVENTGENIE_SYSTEM_PROMPT = `# Role and Objective
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

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/vendors', (req: Request, res: Response) => {
  res.json({
    vendors: BENGALURU_VENDORS_DATABASE,
  });
});

app.get('/api/python-source', (req: Request, res: Response) => {
  res.json({
    code: ORIGINAL_PYTHON_SOURCE,
  });
});

app.get('/api/system-prompt', (req: Request, res: Response) => {
  res.json({
    prompt: EVENTGENIE_SYSTEM_PROMPT,
  });
});

// Market Scraper Endpoint
app.post('/api/scrape-market', (req: Request, res: Response) => {
  try {
    const { eventType = 'Wedding', budgetInr = 250000, location = 'Bengaluru', guestCount = 150 } = req.body;
    const report = analyzeEventMarketAndCombos(eventType, Number(budgetInr), location, Number(guestCount));
    res.json(report);
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({ error: 'Failed to execute market scraper simulation' });
  }
});

// Full Orchestrator Endpoint
app.post('/api/orchestrate', async (req: Request, res: Response) => {
  const {
    eventType = 'Wedding',
    guestCount = 150,
    budgetInr = 250000,
    location = 'Bengaluru',
    theme = 'Modern Botanical with Traditional Heritage',
    priorities = 'Catering, Photography, Decor',
    notes = '',
  } = req.body;

  const numericBudget = Number(budgetInr) || 250000;
  const numericGuests = Number(guestCount) || 150;

  // Compute deterministic baseline first
  const deterministicBudget = calculateBudgetBreakdown(numericBudget, eventType, numericGuests);
  const marketReport = analyzeEventMarketAndCombos(eventType, numericBudget, location, numericGuests);
  const wbsPhases = generateDefaultWbs(eventType, numericGuests);

  let aiMarkdown = '';
  let generatedFromAi = false;

  if (process.env.GEMINI_API_KEY && aiClient) {
    try {
      const userMessage = `Generate a complete event and investment strategy for:
- Event Type: ${eventType}
- Location: ${location}, India
- Target Budget: ${formatINR(numericBudget)} (${numericBudget} INR)
- Expected Guests: ${numericGuests}
- Theme / Aesthetic: ${theme}
- Priority Focus: ${priorities}
- Special Notes / Constraints: ${notes || 'None'}

Please adhere strictly to the 5-part Output Format Template specified in your system instructions. Calculate realistic INR line items and highlight high-ROI wholesale vendor combos.`;

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction: EVENTGENIE_SYSTEM_PROMPT,
        },
      });

      // 10-second timeout guard
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 10000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      if (response && response.text) {
        aiMarkdown = response.text;
        generatedFromAi = true;
      }
    } catch (aiErr: any) {
      console.warn('Gemini API call timed out or failed, utilizing localized deterministic synthesizer:', aiErr?.message || aiErr);
    }
  }

  // If AI was not called or failed, synthesize a complete pristine Markdown report adhering to the template
  if (!aiMarkdown) {
    aiMarkdown = `## 1. Executive Summary & Theme Concept
**Concept:** ${theme || 'Eco-Chic Garden Synergy'}
Organizing a **${eventType}** in **${location}** for **${numericGuests} guests** within a disciplined budget cap of **${formatINR(numericBudget)}** (average **${formatINR(deterministicBudget.costPerGuest)} per guest**).
By activating micro-venue open-air spaces and leveraging pre-negotiated wholesale vendor bundles, we achieve high aesthetic impact while locking in **${formatINR(deterministicBudget.estimatedComboSavings)} (15%) in direct savings**.

---

## 2. Granular Budget Breakdown
| Item / Category | Estimated Cost (INR) | Smart Combo Saving | Key Strategic Notes |
| :--- | :--- | :--- | :--- |
${deterministicBudget.lineItems
  .map(
    (item) =>
      `| **${item.item}** (${item.categoryName}) | ${formatINR(item.estimatedCost)} | ${
        item.smartComboSaving > 0 ? formatINR(item.smartComboSaving) : '—'
      } | ${item.notes} |`
  )
  .join('\n')}
| **Contingency Buffer (10%)** | ${formatINR(deterministicBudget.contingencyAmount)} | Safeguard Reserve | Unforeseen weather, transit, or day-of surge |
| **TOTAL ALLOCATED** | **${formatINR(deterministicBudget.totalBudget)}** | **${formatINR(deterministicBudget.estimatedComboSavings)} Saved** | **Net Effective: ${formatINR(deterministicBudget.netEffectiveCost)}** |

---

## 3. High-ROI Investment Combos & Vendor Recommendations
### **${deterministicBudget.smartCombo.comboName}**
* **Included Services:** ${deterministicBudget.smartCombo.includedServices.join(', ')}
* **Base Standalone Cost:** ${formatINR(deterministicBudget.smartCombo.baseCostInr)}
* **Optimized Bundle Cost:** ${formatINR(deterministicBudget.smartCombo.optimizedCostInr)}
* **Direct Estimated Savings:** ${formatINR(deterministicBudget.smartCombo.estimatedSavingsInr)} (15% Wholesale Bundle Synergy)
* **ROI Rationale:** ${deterministicBudget.smartCombo.roiRationale}

#### Recommended Local Partners:
${deterministicBudget.smartCombo.recommendedVendors
  .map((v) => `- **${v.name}** (${v.category}): ${v.deal}`)
  .join('\n')}

---

## 4. Chronological Timeline & Checklist (T-Minus Schedule)
* **T-6 to T-4 Months:** Lock budget cap, reserve venue in ${location}, execute 3-way vendor synergy bundle.
* **T-3 to T-2 Months:** Finalize menu tasting with GreenLeaf Caterers; brief PixelCraft on drone permits; deploy WhatsApp RSVP bot.
* **T-1 Month to T-2 Weeks:** Reconcile RSVP headcount (+5% caterer buffer plate guarantee); inspect Bangalore SoundLab electrical load.
* **T-3 Days to 24 Hours:** Slot vendor ingress staggered arrivals; pack contingency emergency first-aid and cash envelopes.
* **Day-Of Execution:** 08:00 AM Decor Rigging -> 11:30 AM Catering Hygiene Audit -> 05:00 PM Guest Welcome -> 10:30 PM Leftover Food Donation.

---

## 5. Cost-Saving Social Hacks & Personalized Ideas
${marketReport.social_media_trends.map((trend) => `- ${trend}`).join('\n')}
- **Real-Time Photo Sharing QR:** Place tabletop QR cards syncing directly to PixelCraft's live cloud folder, saving 100% of printed photo favors.
- **Sustainable Floral Dispersal:** Donate leftover floral backdrops to local community temples or compost partners to eliminate venue waste disposal penalties.`;
  }

  res.json({
    generatedFromAi,
    aiMarkdown,
    budgetSummary: deterministicBudget,
    marketReport,
    wbsPhases,
  });
});

// Conversational AI Assistant Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history = [], eventContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (process.env.GEMINI_API_KEY && aiClient) {
    try {
      const contextPrompt = eventContext
        ? `CURRENT EVENT CONTEXT:
- Type: ${eventContext.eventType}
- Guests: ${eventContext.guestCount}
- Budget: INR ${eventContext.budgetInr}
- Location: ${eventContext.location}
- Theme: ${eventContext.theme}`
        : '';

      const chat = aiClient.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: `${EVENTGENIE_SYSTEM_PROMPT}\n\n${contextPrompt}\n\nProvide direct, practical, and highly specific tactical advice in INR for this user. Keep answers crisp and bulleted.`,
        },
      });

      const chatPromise = chat.sendMessage({
        message,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Chat timeout')), 8000)
      );

      const response: any = await Promise.race([chatPromise, timeoutPromise]);

      return res.json({
        reply: response.text ?? 'I have reviewed your request. What specific vendor or budget line would you like to refine?',
      });
    } catch (err: any) {
      console.warn('Gemini chat error or timeout:', err?.message || err);
    }
  }

  // Graceful conversational response when API key is pending
  let fallbackReply = `Here is a tactical recommendation for your ${eventContext?.eventType || 'event'}:
- **Vendor Negotiation Tip:** Request a 10% cash discount or complimentary dessert counter when booking GreenLeaf Caterers and Blossom & Twig Decor simultaneously.
- **Budget Optimization:** Consider shaving 10% from floral staging and reallocating towards the interactive live beverage counter, which delivers 3x guest satisfaction ROI.
- **Local Bengaluru Hack:** Book morning slots (10:00 AM - 03:00 PM) at open garden verandas in Whitefield or AECS Layout to enjoy naturally filtered lighting for PixelCraft's drone photography while slashing venue rental costs by up to 25%.`;

  res.json({ reply: fallbackReply });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventGenie Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
