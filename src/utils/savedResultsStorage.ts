import { SavedTestRun } from '../types/savedResults';
import { safeJsonParse } from './jsonHelper';

const STORAGE_PREFIX = 'couch_saved_test_results_';
const memoryFallback = new Map<string, string>();

function getStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    // ignore access error
  }
  return memoryFallback.get(key) || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fallback
  }
  memoryFallback.set(key, value);
}

export function getSavedResultsKey(profileId = 'default'): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

export function getSavedResults(profileId = 'default'): SavedTestRun[] {
  const raw = getStorageItem(getSavedResultsKey(profileId));
  const parsed = safeJsonParse<SavedTestRun[]>(raw || '', []);
  if (!Array.isArray(parsed)) return [];
  // Return newest first
  return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveResult(
  profileId: string,
  runData: Omit<SavedTestRun, 'id' | 'createdAt' | 'profileId'>
): SavedTestRun {
  const current = getSavedResults(profileId);
  const newEntry: SavedTestRun = {
    ...runData,
    id: `saved_run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    profileId,
    createdAt: new Date().toISOString()
  };

  const updated = [newEntry, ...current];
  setStorageItem(getSavedResultsKey(profileId), JSON.stringify(updated));
  return newEntry;
}

export function deleteSavedResult(profileId: string, runId: string): void {
  const current = getSavedResults(profileId);
  const filtered = current.filter((r) => r.id !== runId);
  setStorageItem(getSavedResultsKey(profileId), JSON.stringify(filtered));
}

export function clearAllSavedResults(profileId: string): void {
  setStorageItem(getSavedResultsKey(profileId), JSON.stringify([]));
}

export function searchSavedResults(
  results: SavedTestRun[],
  searchTerm: string,
  filterStatus: 'ALL' | 'SUCCESS' | 'FAILED' = 'ALL'
): SavedTestRun[] {
  const term = searchTerm.trim().toLowerCase();
  return results.filter((run) => {
    const matchesStatus = filterStatus === 'ALL' || run.status === filterStatus;
    if (!matchesStatus) return false;

    if (!term) return true;
    const inName = run.name.toLowerCase().includes(term);
    const inNotes = (run.notes || '').toLowerCase().includes(term);
    const inEndpoint = run.templateName.toLowerCase().includes(term);
    const inDoc = run.payloadTitle.toLowerCase().includes(term);
    return inName || inNotes || inEndpoint || inDoc;
  });
}
