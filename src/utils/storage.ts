import { safeJsonParse } from './jsonHelper';
import {
  CouchPayload,
  MappingTemplate,
  FieldGroup,
  TestRunResult,
  ValidationFailure,
  ValidationRuleItem,
  MigrationProfile,
  AppSettings
} from '../types';
import {
  INITIAL_FIELD_GROUPS,
  INITIAL_MAPPING_TEMPLATES,
  INITIAL_PAYLOADS,
  INITIAL_VALIDATION_RULES
} from '../mockData';

export const DEFAULT_PROFILES: MigrationProfile[] = [
  { id: 'prof-default', name: 'Production (US-East)', description: 'Primary production migration environment', createdAt: new Date().toISOString() },
  { id: 'prof-staging', name: 'Staging (EU-West)', description: 'Staging environment and pre-release testing', createdAt: new Date().toISOString() }
];

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Guest User',
  storageMode: 'localstorage',
  showMockData: false
};

export function loadSettings(): AppSettings {
  const loaded = safeJsonParse<Partial<AppSettings>>(localStorage.getItem('couch_app_settings') || '', {});
  return {
    userName: loaded.userName || DEFAULT_SETTINGS.userName,
    storageMode: loaded.storageMode || DEFAULT_SETTINGS.storageMode,
    showMockData: typeof loaded.showMockData === 'boolean' ? loaded.showMockData : false
  };
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem('couch_app_settings', JSON.stringify(settings));
}

export function loadProfileData(profileId: string) {
  return {
    payloads: safeJsonParse<CouchPayload[]>(localStorage.getItem(`couch_payloads_light_${profileId}`) || '', INITIAL_PAYLOADS),
    templates: safeJsonParse<MappingTemplate[]>(localStorage.getItem(`couch_templates_light_${profileId}`) || '', INITIAL_MAPPING_TEMPLATES),
    fieldGroups: safeJsonParse<FieldGroup[]>(localStorage.getItem(`couch_groups_light_${profileId}`) || '', INITIAL_FIELD_GROUPS),
    testRuns: safeJsonParse<TestRunResult[]>(localStorage.getItem(`couch_runs_light_${profileId}`) || '', []),
    failures: safeJsonParse<ValidationFailure[]>(localStorage.getItem(`couch_failures_light_${profileId}`) || '', []),
    validationRules: safeJsonParse<ValidationRuleItem[]>(localStorage.getItem(`couch_validation_rules_light_${profileId}`) || '', INITIAL_VALIDATION_RULES),
  };
}

export function saveProfileData(profileId: string, data: any) {
  localStorage.setItem(`couch_payloads_light_${profileId}`, JSON.stringify(data.payloads));
  localStorage.setItem(`couch_templates_light_${profileId}`, JSON.stringify(data.templates));
  localStorage.setItem(`couch_groups_light_${profileId}`, JSON.stringify(data.fieldGroups));
  localStorage.setItem(`couch_runs_light_${profileId}`, JSON.stringify(data.testRuns));
  localStorage.setItem(`couch_failures_light_${profileId}`, JSON.stringify(data.failures));
  localStorage.setItem(`couch_validation_rules_light_${profileId}`, JSON.stringify(data.validationRules));
}

// API Storage Helpers
export async function saveToFileSystem(key: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/storage/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    console.error('File storage failed', e);
    return false;
  }
}

export async function loadFromFileSystem<T = any>(key: string, fallback: T): Promise<{ data: T; exists: boolean }> {
  try {
    const res = await fetch(`/api/storage/${encodeURIComponent(key)}`);
    if (res.ok) {
      const data = await res.json();
      return { data, exists: true };
    }
    return { data: fallback, exists: false };
  } catch (e) {
    console.warn(`Could not load ${key} from file system, using fallback`, e);
    return { data: fallback, exists: false };
  }
}
