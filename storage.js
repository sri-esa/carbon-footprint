import { DEFAULT_INPUTS, sanitizeInputs } from "./carbon.js";

export const STORAGE_KEY = "carbonwise.inputs.v1";

export function parseStoredInputs(serializedInputs) {
  if (!serializedInputs) {
    return DEFAULT_INPUTS;
  }

  try {
    const parsed = JSON.parse(serializedInputs);
    return isPlainObject(parsed) ? sanitizeInputs(parsed) : DEFAULT_INPUTS;
  } catch {
    return DEFAULT_INPUTS;
  }
}

export function loadInputs(storage = window.localStorage) {
  return parseStoredInputs(storage.getItem(STORAGE_KEY));
}

export function saveInputs(inputs, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(sanitizeInputs(inputs)));
}

export function clearInputs(storage = window.localStorage) {
  storage.removeItem(STORAGE_KEY);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
