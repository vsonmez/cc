import { useState, useEffect, useCallback } from 'react';
import { loadAppData } from '../../core/storage/storage-engine';

// Why: This hook provides reactive access to localStorage data and handles multi-tab sync
export function useAppData() {
  const [dataVersion, setDataVersion] = useState(0);

  // Why: Force re-render when data changes by incrementing version
  const refreshData = useCallback(() => {
    setDataVersion((version) => version + 1);
  }, []);

  // Why: Listen to storage events for multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'homework-tracker-data') {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshData]);

  // Why: Return fresh data on each access to ensure components see latest changes
  const getData = useCallback(() => {
    return loadAppData();
  }, [dataVersion]);

  return { getData, refreshData };
}
