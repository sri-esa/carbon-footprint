export const DEFAULT_INPUTS = Object.freeze({
  carKm: 300,
  busKm: 120,
  flightHours: 0,
  electricityKwh: 180,
  renewablePercent: 20,
  lpgKg: 12,
  dietType: "mixed",
  shoppingSpend: 5000,
  wasteKg: 20
});

export const EMISSION_FACTORS = Object.freeze({
  carKgPerKm: 0.171,
  publicTransitKgPerKm: 0.06,
  flightKgPerHour: 90,
  gridElectricityKgPerKwh: 0.708,
  lpgKgPerKg: 2.983,
  shoppingKgPerInr: 0.00018,
  landfillWasteKgPerKg: 0.58,
  dietMonthlyKg: Object.freeze({
    mixed: 180,
    lowMeat: 130,
    vegetarian: 95,
    vegan: 70
  })
});

export const CATEGORY_LABELS = Object.freeze({
  transport: "Transport",
  energy: "Home energy",
  food: "Food",
  consumption: "Shopping",
  waste: "Waste"
});

const LIMITS = Object.freeze({
  carKm: [0, 10000],
  busKm: [0, 10000],
  flightHours: [0, 100],
  electricityKwh: [0, 5000],
  renewablePercent: [0, 100],
  lpgKg: [0, 300],
  shoppingSpend: [0, 500000],
  wasteKg: [0, 500]
});

export function sanitizeInputs(rawInputs = {}) {
  const safe = { ...DEFAULT_INPUTS };

  for (const [key, [min, max]] of Object.entries(LIMITS)) {
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
  const recommendations = {
    transport: {
      title: "Replace short car trips",
      body: "Try shifting two short car trips each week to walking, cycling, carpooling, bus, or metro.",
      impact: "High impact when car travel is a major driver"
    },
    energy: {
      title: "Reduce home energy demand",
      body: "Set AC temperature a little higher, switch off idle appliances, and increase renewable electricity where possible.",
      impact: "Strong monthly savings from repeated home habits"
    },
    food: {
      title: "Choose lower-carbon meals",
      body: "Start with one more plant-forward meal day per week and reduce food waste through planned portions.",
      impact: "Steady impact without needing a complete diet change"
    },
    consumption: {
      title: "Buy fewer new goods",
      body: "Delay non-essential purchases, repair items, borrow rarely used products, or choose second-hand options.",
      impact: "Best for footprints driven by frequent shopping"
    },
    waste: {
      title: "Separate and reduce waste",
      body: "Segregate recyclables and compostable waste, then track what remains as mixed landfill waste.",
      impact: "Improves awareness and local disposal outcomes"
    }
  };

  return result.sortedCategories.slice(0, 3).map(([category, kg]) => ({
    category,
    kg,
    ...recommendations[category]
  }));
}

export function estimateReductionGap(yearlyTotalTonnes, targetTonnes = 2) {
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
