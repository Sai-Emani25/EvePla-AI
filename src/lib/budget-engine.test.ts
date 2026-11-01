import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudgetBreakdown, formatINR, EVENT_BUDGET_PROFILES } from './budget-engine.ts';
import { analyzeEventMarketAndCombos } from './market-scraper.ts';

test('formatINR formats numbers correctly in Indian numbering system', () => {
  assert.equal(formatINR(250000), '₹2,50,000');
  assert.equal(formatINR(1000000), '₹10,00,000');
  assert.equal(formatINR(500), '₹500');
  assert.equal(formatINR(0), '₹0');
});

test('calculateBudgetBreakdown allocates budget accurately with 15% smart combo savings', () => {
  const budget = 250000;
  const guests = 150;
  const result = calculateBudgetBreakdown(budget, 'Wedding', guests);

  assert.equal(result.totalBudget, 250000);
  assert.equal(result.categories.length, 6);

  // Check cost per guest calculation
  assert.equal(result.costPerGuest, Math.round(250000 / 150));

  // Check contingency amount matches 10%
  assert.equal(result.contingencyPercentage, 10);
  assert.equal(result.contingencyAmount, 25000);

  // Check smart combo savings
  assert.ok(result.smartCombo.estimatedSavingsInr > 0);
  assert.equal(result.smartCombo.savingsPercentage, 15);
  assert.equal(
    result.smartCombo.optimizedCostInr,
    result.smartCombo.baseCostInr - result.smartCombo.estimatedSavingsInr
  );

  // Check line items exist and have savings
  assert.ok(result.lineItems.length >= 8);
  const totalItemSavings = result.lineItems.reduce((acc, item) => acc + item.smartComboSaving, 0);
  assert.ok(totalItemSavings > 0);
});

test('analyzeEventMarketAndCombos replicates Python scraper schema exactly', () => {
  const report = analyzeEventMarketAndCombos('Wedding', 250000, 'Bengaluru', 150);

  assert.equal(report.event_type, 'Wedding');
  assert.equal(report.location, 'Bengaluru');
  assert.equal(report.target_budget, 250000);
  assert.ok(report.timestamp.length > 0);

  // Top local vendors check
  assert.ok(report.top_local_vendors.length >= 4);
  const greenLeaf = report.top_local_vendors.find((v) => v.name === 'GreenLeaf Caterers');
  assert.ok(greenLeaf);
  assert.equal(greenLeaf.category, 'Catering');
  assert.equal(greenLeaf.unit, 'per plate');

  // Smart investment combo schema check
  assert.equal(report.smart_investment_combo.combo_name, 'All-in-One Local Synergy Pack');
  assert.equal(report.smart_investment_combo.included_services.length, 3);
  
  // Math verification: 15% savings
  const expectedSavings = Math.round(report.smart_investment_combo.base_cost_inr * 0.15);
  assert.equal(report.smart_investment_combo.estimated_savings_inr, expectedSavings);
  assert.equal(
    report.smart_investment_combo.optimized_cost_inr,
    report.smart_investment_combo.base_cost_inr - expectedSavings
  );

  // Social media trends check
  assert.ok(report.social_media_trends.length >= 3);
  assert.ok(report.social_media_trends.some((t) => t.includes('Micro-venue fusion')));
});
