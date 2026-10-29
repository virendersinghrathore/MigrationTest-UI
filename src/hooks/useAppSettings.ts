import { useState, useCallback } from 'react';
import { AppSettings } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  return { settings, updateSettings };
}
