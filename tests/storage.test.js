import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_INPUTS } from "../carbon.js";
import { STORAGE_KEY, clearInputs, loadInputs, parseStoredInputs, saveInputs } from "../storage.js";

test("falls back to defaults for missing or malformed stored data", () => {
  assert.deepEqual(parseStoredInputs(null), DEFAULT_INPUTS);
  assert.deepEqual(parseStoredInputs("{not json"), DEFAULT_INPUTS);
  assert.deepEqual(parseStoredInputs("[]"), DEFAULT_INPUTS);
});

test("sanitizes stored values before returning them", () => {
  const parsed = parseStoredInputs(JSON.stringify({
    carKm: -1,
    electricityKwh: 999999,
    renewablePercent: 80,
    dietType: "vegetarian"
  }));

  assert.equal(parsed.carKm, 0);
  assert.equal(parsed.electricityKwh, 5000);
  assert.equal(parsed.renewablePercent, 80);
  assert.equal(parsed.dietType, "vegetarian");
});

test("loads, saves, and clears inputs through a storage adapter", () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key)
  };

  saveInputs({ ...DEFAULT_INPUTS, carKm: 42 }, storage);
  assert.equal(JSON.parse(memory.get(STORAGE_KEY)).carKm, 42);
  assert.equal(loadInputs(storage).carKm, 42);

  clearInputs(storage);
  assert.equal(memory.has(STORAGE_KEY), false);
});
