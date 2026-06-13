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

export const INPUT_LIMITS = Object.freeze({
  carKm: [0, 10000],
  busKm: [0, 10000],
  flightHours: [0, 100],
  electricityKwh: [0, 5000],
  renewablePercent: [0, 100],
  lpgKg: [0, 300],
  shoppingSpend: [0, 500000],
  wasteKg: [0, 500]
});

export const YEARLY_TARGET_TONNES = 2;
