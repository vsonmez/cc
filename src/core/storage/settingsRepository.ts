import type { Settings } from '../models/storage-schema';
import { loadAppData, saveAppData } from './storage-engine';

export function updateSettings(settings: Partial<Settings>): boolean {
  const data = loadAppData();
  data.settings = { ...data.settings, ...settings };
  return saveAppData(data);
}

export function getSettings(): Settings {
  const data = loadAppData();
  return { ...data.settings };
}
