import assert from "node:assert/strict";
import {
  DEFAULT_INPUTS,
  buildRecommendations,
  calculateFootprint,
  estimateReductionGap,
  sanitizeInputs
} from "../carbon.js";

const baseline = calculateFootprint(DEFAULT_INPUTS);

assert.equal(baseline.monthlyTotal, 388.7);
assert.equal(baseline.yearlyTotalTonnes, 4.66);
assert.equal(baseline.topCategory, "food");

const clamped = sanitizeInputs({
  carKm: -20,
  electricityKwh: 9000,
  renewablePercent: 150,
  dietType: "unsupported"
});

assert.equal(clamped.carKm, 0);
assert.equal(clamped.electricityKwh, 5000);
assert.equal(clamped.renewablePercent, 100);
assert.equal(clamped.dietType, "mixed");

const lowerCarbonDiet = calculateFootprint({
  ...DEFAULT_INPUTS,
  dietType: "vegan"
});

assert.ok(lowerCarbonDiet.monthlyTotal < baseline.monthlyTotal);

const recommendations = buildRecommendations(baseline);
assert.equal(recommendations.length, 3);
assert.equal(recommendations[0].category, baseline.topCategory);

const target = estimateReductionGap(1.8, 2);
assert.equal(target.isWithinTarget, true);
assert.equal(target.gap, 0);

console.log("All carbon calculation tests passed.");
