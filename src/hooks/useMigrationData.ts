import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  CouchPayload, MappingTemplate, FieldGroup, FieldMappingRule,
  TestRunResult, ValidationFailure, ValidationRuleItem,
  MigrationProfile, AppSettings
} from '../types';
import { validateJsonPayload } from '../utils/validationEngine';
import { safeJsonParse, exportToJsonFile } from '../utils/jsonHelper';
import {
  DEFAULT_PROFILES,
  loadProfileData,
  saveProfileData,
  saveToFileSystem,
  loadFromFileSystem
} from '../utils/storage';
import { getSavedResultsKey } from '../utils/savedResultsStorage';
import {
  isMockPayload,
  isMockTemplate,
  isMockRun,
  isMockFailure
} from '../mockData';

export function useMigrationData(settings?: AppSettings) {
  const [profiles, setProfiles] = useState<MigrationProfile[]>(() =>
    safeJsonParse(localStorage.getItem('couch_migration_profiles_light') || '', DEFAULT_PROFILES)
  );
  const [activeProfileId, setActiveProfileId] = useState<string>(() =>
    localStorage.getItem('couch_active_profile_id_light') || 'prof-default'
  );

  const [payloads, setPayloads] = useState<CouchPayload[]>(() => loadProfileData(activeProfileId).payloads);
  const [templates, setTemplates] = useState<MappingTemplate[]>(() => loadProfileData(activeProfileId).templates);
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>(() => loadProfileData(activeProfileId).fieldGroups);
  const [testRuns, setTestRuns] = useState<TestRunResult[]>(() => loadProfileData(activeProfileId).testRuns);
  const [failures, setFailures] = useState<ValidationFailure[]>(() => loadProfileData(activeProfileId).failures);
  const [validationRules, setValidationRules] = useState<ValidationRuleItem[]>(() => loadProfileData(activeProfileId).validationRules);

  const isStorageLoadingRef = useRef(false);
  const skipSaveRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFileMode = settings?.storageMode === 'file';

  // Load profiles from file system if in file storage mode
  useEffect(() => {
    if (isFileMode) {
      loadFromFileSystem<MigrationProfile[]>('profiles', profiles).then(({ data: loadedProfiles, exists }) => {
        if (exists && Array.isArray(loadedProfiles) && loadedProfiles.length > 0) {
          setProfiles(loadedProfiles);
          localStorage.setItem('couch_migration_profiles_light', JSON.stringify(loadedProfiles));
        } else if (!exists) {
          saveToFileSystem('profiles', profiles);
        }
      });
    }
  }, [isFileMode]);

  // Load profile data when activeProfileId changes or when storageMode changes
  useEffect(() => {
    localStorage.setItem('couch_active_profile_id_light', activeProfileId);
    localStorage.setItem('couch_migration_profiles_light', JSON.stringify(profiles));

    if (isFileMode) {
      isStorageLoadingRef.current = true;
      const fallbackData = loadProfileData(activeProfileId);

      loadFromFileSystem(`profile_${activeProfileId}`, fallbackData).then(({ data: loaded, exists }) => {
        if (exists && loaded) {
          skipSaveRef.current = true;
          setPayloads(loaded.payloads || fallbackData.payloads);
          setTemplates(loaded.templates || fallbackData.templates);
          setFieldGroups(loaded.fieldGroups || fallbackData.fieldGroups);
          setTestRuns(loaded.testRuns || []);
          setFailures(loaded.failures || []);
          setValidationRules(loaded.validationRules || fallbackData.validationRules);
          saveProfileData(activeProfileId, loaded);
        } else if (!exists) {
          // Initialize file on disk with current fallback
          saveToFileSystem(`profile_${activeProfileId}`, fallbackData);
        }
        isStorageLoadingRef.current = false;
      });
    } else {
      const loaded = loadProfileData(activeProfileId);
      skipSaveRef.current = true;
      setPayloads(loaded.payloads);
      setTemplates(loaded.templates);
      setFieldGroups(loaded.fieldGroups);
      setTestRuns(loaded.testRuns);
      setFailures(loaded.failures);
      setValidationRules(loaded.validationRules);
    }
  }, [activeProfileId, isFileMode]);

  // Auto-save changes (debounced for file system writes)
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }

    if (isStorageLoadingRef.current) {
      return;
    }

    const data = { payloads, templates, fieldGroups, testRuns, failures, validationRules };
    saveProfileData(activeProfileId, data);

    if (isFileMode) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveToFileSystem(`profile_${activeProfileId}`, data);
      }, 300);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [payloads, templates, fieldGroups, testRuns, failures, validationRules, activeProfileId, isFileMode]);

  const runValidation = useCallback((pId: string, tId: string, json: string) => {
    const tpl = templates.find(t => t.id === tId); if (!tpl) return null;
    const { result, failures: f } = validateJsonPayload(pId, tpl, json, validationRules);
    setTestRuns(prev => [result, ...prev]); if (f.length > 0) setFailures(prev => [...f, ...prev]); return result;
  }, [templates, validationRules]);

  const showMock = Boolean(settings?.showMockData);

  const visiblePayloads = useMemo(
    () => (showMock ? payloads : payloads.filter((p) => !isMockPayload(p))),
    [payloads, showMock]
  );
  const visibleTemplates = useMemo(
    () => (showMock ? templates : templates.filter((t) => !isMockTemplate(t))),
    [templates, showMock]
  );
  const visibleTestRuns = useMemo(
    () => (showMock ? testRuns : testRuns.filter((r) => !isMockRun(r))),
    [testRuns, showMock]
  );
  const visibleFailures = useMemo(
    () => (showMock ? failures : failures.filter((f) => !isMockFailure(f))),
    [failures, showMock]
  );

  return {
    profiles, activeProfileId, setActiveProfileId, 
    createProfile: (name: string, description: string) => {
      const n = { id: `prof-${Date.now()}`, name, description, createdAt: new Date().toISOString() };
      setProfiles(p => {
        const next = [...p, n];
        localStorage.setItem('couch_migration_profiles_light', JSON.stringify(next));
        if (isFileMode) saveToFileSystem('profiles', next);
        return next;
      });
      setActiveProfileId(n.id);
    },
    updateProfile: (id: string, name: string, description: string) => {
      setProfiles(p => {
        const next = p.map(x => x.id === id ? { ...x, name, description } : x);
        localStorage.setItem('couch_migration_profiles_light', JSON.stringify(next));
        if (isFileMode) saveToFileSystem('profiles', next);
        return next;
      });
    },
    payloads: visiblePayloads,
    rawPayloads: payloads,
    savePayload: (p: CouchPayload) => setPayloads(prev => prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev]),
    deletePayload: (id: string) => {
      const p = payloads.find(x => x.id === id);
      const title = p?.title ? `"${p.title}"` : 'this payload';
      if (!window.confirm(`Are you sure you want to delete ${title}? This action cannot be undone.`)) return;
      setPayloads(prev => prev.filter(x => x.id !== id));
    },
    templates: visibleTemplates,
    rawTemplates: templates,
    saveTemplate: (t: MappingTemplate) => setTemplates(prev => prev.some(x => x.id === t.id) ? prev.map(x => x.id === t.id ? t : x) : [...prev, t]),
    deleteTemplate: (id: string) => {
      const t = templates.find(x => x.id === id);
      const name = t?.name ? `"${t.name}"` : 'this specification';
      if (!window.confirm(`Are you sure you want to delete specification ${name} and all its field rules? This action cannot be undone.`)) return;
      setTemplates(prev => prev.filter(x => x.id !== id));
    },
    fieldGroups,
    saveMappingRule: (tId: string, r: FieldMappingRule) => setTemplates(prev => prev.map(t => t.id !== tId ? t : { ...t, mappings: t.mappings.some(m => m.id === r.id) ? t.mappings.map(m => m.id === r.id ? r : m) : [...t.mappings, r], updatedAt: new Date().toISOString() })),
    deleteMappingRule: (tId: string, rId: string) => {
      const t = templates.find(x => x.id === tId);
      const r = t?.mappings.find(m => m.id === rId);
      const fieldDesc = r?.couchField ? `rule for field "${r.couchField}"` : 'this field mapping rule';
      if (!window.confirm(`Are you sure you want to delete the ${fieldDesc}?`)) return;
      setTemplates(prev => prev.map(t => t.id === tId ? { ...t, mappings: t.mappings.filter(m => m.id !== rId), updatedAt: new Date().toISOString() } : t));
    },
    validationRules,
    saveValidationRule: (r: ValidationRuleItem) => setValidationRules(prev => prev.some(x => x.id === r.id) ? prev.map(x => x.id === r.id ? r : x) : [...prev, r]),
    deleteValidationRule: (id: string) => {
      const r = validationRules.find(x => x.id === id);
      const desc = r?.desc ? `"${r.desc}"` : 'this validation rule';
      if (!window.confirm(`Are you sure you want to delete validation rule ${desc}?`)) return;
      setValidationRules(prev => prev.filter(x => x.id !== id));
    },
    testRuns: visibleTestRuns,
    failures: visibleFailures,
    runValidation,
    runAllTests: () => {
      if (visiblePayloads.length === 0 || visibleTemplates.length === 0) {
        alert('No active payloads or specifications found to test. Create a payload and spec or enable mock data in Settings.');
        return;
      }
      visiblePayloads.forEach(p => visibleTemplates[0] && runValidation(p.id, visibleTemplates[0].id, JSON.stringify(p.payload, null, 2)));
    },
    exportConfig: () => exportToJsonFile(`profile_${activeProfileId}.json`, { profile: profiles.find(p => p.id === activeProfileId)?.name, payloads: visiblePayloads, templates: visibleTemplates, fieldGroups, validationRules, testRuns: visibleTestRuns, failures: visibleFailures }),
    importProfile: (name: string, data: any) => {
      const nId = `prof-${Date.now()}`;
      const nP = { id: nId, name, description: `Imported`, createdAt: new Date().toISOString() };
      setProfiles(p => {
        const next = [...p, nP];
        localStorage.setItem('couch_migration_profiles_light', JSON.stringify(next));
        if (isFileMode) saveToFileSystem('profiles', next);
        return next;
      });
      saveProfileData(nId, data);
      if (isFileMode) saveToFileSystem(`profile_${nId}`, data);
      setActiveProfileId(nId);
    },
    importHistory: (data: any[]) => { if (!Array.isArray(data)) return; const k = getSavedResultsKey(activeProfileId); const e = safeJsonParse(localStorage.getItem(k) || '', []); localStorage.setItem(k, JSON.stringify([...data, ...e])); alert(`Imported ${data.length} runs`); }
  };
}
