import { useState, useEffect, useCallback } from 'react';
import { SavedTestRun } from '../types/savedResults';
import { getSavedResults, saveResult, deleteSavedResult } from '../utils/savedResultsStorage';

export function useSavedResults(activeProfileId: string, userName: string = 'Guest User') {
  const [savedRuns, setSavedRuns] = useState<SavedTestRun[]>(() => getSavedResults(activeProfileId));

  const refresh = useCallback(() => {
    setSavedRuns(getSavedResults(activeProfileId));
  }, [activeProfileId]);

  useEffect(() => {
    refresh();
  }, [activeProfileId, refresh]);

  const addResult = useCallback(
    (runData: Omit<SavedTestRun, 'id' | 'createdAt' | 'profileId' | 'userName'>) => {
      const saved = saveResult(activeProfileId, { ...runData, userName });
      setSavedRuns(getSavedResults(activeProfileId));
      return saved;
    },
    [activeProfileId, userName]
  );

  const removeResult = useCallback(
    (id: string) => {
      const run = savedRuns.find((r) => r.id === id);
      const name = run?.name ? `"${run.name}"` : 'this test run';
      if (!window.confirm(`Are you sure you want to permanently delete saved test run ${name}?`)) return;
      deleteSavedResult(activeProfileId, id);
      setSavedRuns(getSavedResults(activeProfileId));
    },
    [activeProfileId, savedRuns]
  );

  return { savedRuns, addResult, removeResult, refresh };
}
