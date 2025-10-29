import { useAppData } from './useAppData';
import {
  getSettings as getSettingsFromStorage,
  updateSettings as updateSettingsInStorage
} from '../../core/storage';
import type { Settings } from '../../core/models/storage-schema';

export function useSettings() {
  const { refreshData } = useAppData();

  const settings = getSettingsFromStorage();

  const updateSettings = (newSettings: Partial<Settings>): boolean => {
    const success = updateSettingsInStorage(newSettings);
    if (!success) return false;

    refreshData();
    return true;
  };

  return {
    settings,
    updateSettings
  };
}
