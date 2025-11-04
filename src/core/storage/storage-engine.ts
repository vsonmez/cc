import { createEmptyAppData, type AppData } from '../models/storage-schema';
import type { Task } from '../models/Task';

const STORAGE_KEY = 'homework-tracker-data';

const STORAGE_VERSION_V1 = 1;
const STORAGE_VERSION_V2 = 2;

function migrateToV2(oldAppData: AppData): AppData {
  // Why: All existing tasks need taskCategory field for type safety in V2 schema
  const migratedTasks: Task[] = oldAppData.tasks.map((task) => ({
    ...task,
    taskCategory: 'general_homework' as const
  }));

  return {
    ...oldAppData,
    tasks: migratedTasks,
    version: STORAGE_VERSION_V2
  };
}

export function loadAppData(): AppData {
  // Why: Try-catch because localStorage.getItem can throw in incognito/restricted modes
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return createEmptyAppData();
    }

    const parsedData = JSON.parse(storedData) as AppData;

    // Why: Migration path allows upgrading old data instead of resetting everything
    if (parsedData.version === STORAGE_VERSION_V1) {
      const migratedData = migrateToV2(parsedData);
      // Why: Save migrated data immediately to avoid re-running migration on every load
      saveAppData(migratedData);
      return migratedData;
    }

    if (parsedData.version === STORAGE_VERSION_V2) {
      return parsedData;
    }

    // Why: Unknown version means incompatible schema, safer to reset than risk corrupt data
    console.warn('Unknown storage version, resetting data');
    return createEmptyAppData();
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return createEmptyAppData();
  }
}

export function saveAppData(data: AppData): boolean {
  // Why: Try-catch because localStorage.setItem throws when quota is exceeded
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    return false;
  }
}

export function clearAppData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
