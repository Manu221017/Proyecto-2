import { STORAGE_KEY } from '../utils/constants.js';

export function cargarItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function guardarItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
