import { useAppData } from './useAppData';
import {
  getSettings as getSettingsFromStorage,
  updateSettings as updateSettingsInStorage
} from '../../core/storage/repository';
import type { Settings } from '../../core/models/storage-schema';

export function useSettings() {
  const { refreshData } = useAppData();

  const settings = getSettingsFromStorage();

  const updateSettings = (newSettings: Partial<Settings>): boolean => {
    const success = updateSettingsInStorage(newSettings);
    if (success) {
      refreshData();
    }
    return success;
  };

  return {
    settings,
    updateSettings
  };
}
