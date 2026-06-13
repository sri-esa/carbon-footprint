import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_INPUTS,
  buildRecommendations,
  calculateFootprint,
  estimateReductionGap,
  sanitizeInputs
} from "../carbon.js";

test("calculates the default footprint and top category", () => {
  const baseline = calculateFootprint(DEFAULT_INPUTS);

  assert.equal(baseline.monthlyTotal, 388.7);
  assert.equal(baseline.yearlyTotalTonnes, 4.66);
  assert.equal(baseline.topCategory, "food");
});

test("sanitizes unsafe, unsupported, and extreme inputs", () => {
  const clamped = sanitizeInputs({
    carKm: -20,
    electricityKwh: 9000,
    renewablePercent: 150,
    dietType: "unsupported",
    busKm: Number.NaN,
    wasteKg: Infinity
  });

  assert.equal(clamped.carKm, 0);
  assert.equal(clamped.electricityKwh, 5000);
  assert.equal(clamped.renewablePercent, 100);
  assert.equal(clamped.dietType, "mixed");
  assert.equal(clamped.busKm, DEFAULT_INPUTS.busKm);
  assert.equal(clamped.wasteKg, DEFAULT_INPUTS.wasteKg);
});

test("shows lower emissions for a lower-carbon diet choice", () => {
  const baseline = calculateFootprint(DEFAULT_INPUTS);
  const lowerCarbonDiet = calculateFootprint({
    ...DEFAULT_INPUTS,
    dietType: "vegan"
  });

  assert.ok(lowerCarbonDiet.monthlyTotal < baseline.monthlyTotal);
});

test("orders recommendations by the user's largest categories", () => {
  const baseline = calculateFootprint(DEFAULT_INPUTS);
  const recommendations = buildRecommendations(baseline);

  assert.equal(recommendations.length, 3);
  assert.equal(recommendations[0].category, baseline.topCategory);
});

test("calculates target status and reduction gap", () => {
  const withinTarget = estimateReductionGap(1.8, 2);
  const aboveTarget = estimateReductionGap(4.66, 2);

  assert.equal(withinTarget.isWithinTarget, true);
  assert.equal(withinTarget.gap, 0);
  assert.equal(aboveTarget.isWithinTarget, false);
  assert.equal(aboveTarget.gap, 2.66);
});
