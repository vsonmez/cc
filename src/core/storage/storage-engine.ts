import { createEmptyAppData, STORAGE_VERSION, type AppData } from '../models/storage-schema'

const STORAGE_KEY = 'homework-tracker-data'

export function loadAppData(): AppData {
  // Why: Try-catch because localStorage.getItem can throw in incognito/restricted modes
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (!storedData) {
      return createEmptyAppData()
    }

    const parsedData = JSON.parse(storedData) as AppData

    // Why: Version check enables data migration when schema changes in future versions
    if (parsedData.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, resetting data')
      return createEmptyAppData()
    }

    return parsedData
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
    return createEmptyAppData()
  }
}

export function saveAppData(data: AppData): boolean {
  // Why: Try-catch because localStorage.setItem throws when quota is exceeded
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, serializedData)
    return true
  } catch (error) {
    console.error('Failed to save data to localStorage:', error)
    return false
  }
}

export function clearAppData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
