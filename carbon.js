import {
  CATEGORY_LABELS,
  DEFAULT_INPUTS,
  EMISSION_FACTORS,
  INPUT_LIMITS,
  YEARLY_TARGET_TONNES
} from "./emission-model.js";
import { RECOMMENDATION_COPY } from "./recommendation-model.js";

export { CATEGORY_LABELS, DEFAULT_INPUTS, EMISSION_FACTORS, INPUT_LIMITS, YEARLY_TARGET_TONNES };

export function sanitizeInputs(rawInputs = {}) {
  const safe = { ...DEFAULT_INPUTS };

  for (const [key, [min, max]] of Object.entries(INPUT_LIMITS)) {
    const value = Number(rawInputs[key]);
    if (Number.isFinite(value)) {
      safe[key] = Math.min(Math.max(value, min), max);
    }
  }

  if (Object.hasOwn(EMISSION_FACTORS.dietMonthlyKg, rawInputs.dietType)) {
    safe.dietType = rawInputs.dietType;
  }

  return safe;
}

export function calculateFootprint(rawInputs = {}) {
  const inputs = sanitizeInputs(rawInputs);
  const nonRenewableShare = (100 - inputs.renewablePercent) / 100;

  const transport =
    inputs.carKm * EMISSION_FACTORS.carKgPerKm +
    inputs.busKm * EMISSION_FACTORS.publicTransitKgPerKm +
    inputs.flightHours * EMISSION_FACTORS.flightKgPerHour;

  const energy =
    inputs.electricityKwh * nonRenewableShare * EMISSION_FACTORS.gridElectricityKgPerKwh +
    inputs.lpgKg * EMISSION_FACTORS.lpgKgPerKg;

  const food = EMISSION_FACTORS.dietMonthlyKg[inputs.dietType];
  const consumption = inputs.shoppingSpend * EMISSION_FACTORS.shoppingKgPerInr;
  const waste = inputs.wasteKg * EMISSION_FACTORS.landfillWasteKgPerKg;

  const categories = {
    transport: round(transport),
    energy: round(energy),
    food: round(food),
    consumption: round(consumption),
    waste: round(waste)
  };

  const monthlyTotal = round(Object.values(categories).reduce((sum, value) => sum + value, 0));
  const yearlyTotalTonnes = round((monthlyTotal * 12) / 1000, 2);
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return {
    inputs,
    categories,
    monthlyTotal,
    yearlyTotalTonnes,
    topCategory: sortedCategories[0][0],
    sortedCategories
  };
}

export function buildRecommendations(result) {
  return result.sortedCategories.slice(0, 3).map(([category, kg]) => ({
    category,
    kg,
    ...RECOMMENDATION_COPY[category]
  }));
}

export function estimateReductionGap(yearlyTotalTonnes, targetTonnes = YEARLY_TARGET_TONNES) {
  const gap = Math.max(0, yearlyTotalTonnes - targetTonnes);
  const progress = targetTonnes <= 0
    ? 0
    : Math.max(0, Math.min(100, ((targetTonnes - gap) / targetTonnes) * 100));

  return {
    targetTonnes,
    gap: round(gap, 2),
    progress: round(progress, 1),
    isWithinTarget: yearlyTotalTonnes <= targetTonnes
  };
}

function round(value, precision = 1) {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
