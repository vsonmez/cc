import type { Child } from './child';
import type { Task } from './task';

export interface Settings {
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format (24-hour)
  lastSelectedChildId: string | null;
}

export interface AppData {
  children: Child[];
  tasks: Task[];
  settings: Settings;
  version: number;
}

export const DEFAULT_SETTINGS: Settings = {
  reminderEnabled: false,
  reminderTime: '18:00',
  lastSelectedChildId: null
};

export const STORAGE_VERSION = 1;

export function createEmptyAppData(): AppData {
  return {
    children: [],
    tasks: [],
    settings: DEFAULT_SETTINGS,
    version: STORAGE_VERSION
  };
}
