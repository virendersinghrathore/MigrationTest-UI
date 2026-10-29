import { MappingTemplate, ValidationFailure } from '../types';
import { flattenPayloadKeys, getNestedValue } from './jsonHelper';

export type FieldDiffStatus =
  | 'MATCH'
  | 'TYPE_MISMATCH'
  | 'NULL_VIOLATION'
  | 'REGEX_FAILED'
  | 'MISSING_IN_NEW'
  | 'EXTRA_IN_NEW'
  | 'VALUE_MISMATCH';

export interface FieldComparisonItem {
  path: string;
  baselineVal: any;
  baselineType: string;
  newVal: any;
  newType: string;
  expectedType?: string;
  nullable?: boolean;
  transformRule?: string;
  status: FieldDiffStatus;
  failureMessage?: string;
}

export interface ComparisonReport {
  items: FieldComparisonItem[];
  matchScore: number;
  totalFields: number;
  matchedCount: number;
  mismatchedCount: number;
  missingCount: number;
  extraCount: number;
}

export function comparePayloads(
  baseline: Record<string, any> | null | undefined,
  newPayload: Record<string, any> | null | undefined,
  spec?: MappingTemplate | null,
  failures: ValidationFailure[] = []
): ComparisonReport {
  const baselineFlat = baseline ? flattenPayloadKeys(baseline) : [];
  const newFlat = newPayload ? flattenPayloadKeys(newPayload) : [];

  const pathMap = new Map<string, { baselineVal?: any; baselineType?: string; newVal?: any; newType?: string }>();

  baselineFlat.forEach((b) => {
    pathMap.set(b.path, { baselineVal: b.val, baselineType: b.type });
  });

  newFlat.forEach((n) => {
    const existing = pathMap.get(n.path) || {};
    pathMap.set(n.path, { ...existing, newVal: n.val, newType: n.type });
  });

  if (spec?.mappings) {
    spec.mappings.forEach((m) => {
      if (!pathMap.has(m.couchField)) {
        pathMap.set(m.couchField, {
          baselineVal: getNestedValue(baseline, m.couchField),
          baselineType: 'UNDEFINED'
        });
      }
    });
  }

  const items: FieldComparisonItem[] = [];
  const failureByPath = new Map<string, ValidationFailure>();
  failures.forEach((f) => failureByPath.set(f.fieldPath, f));

  let matchedCount = 0;
  let mismatchedCount = 0;
  let missingCount = 0;
  let extraCount = 0;

  Array.from(pathMap.keys()).sort().forEach((path) => {
    const entry = pathMap.get(path)!;
    const rule = spec?.mappings.find((m) => m.couchField === path);
    const failure = failureByPath.get(path);

    const hasBaseline = entry.baselineVal !== undefined;
    const hasNew = entry.newVal !== undefined;

    let status: FieldDiffStatus = 'MATCH';
    let message: string | undefined;

    if (failure) {
      message = failure.message;
      if (failure.errorType === 'NULL_VIOLATION') status = 'NULL_VIOLATION';
      else if (failure.message.includes('validation rule') || failure.message.includes('pattern')) status = 'REGEX_FAILED';
      else status = 'TYPE_MISMATCH';
      mismatchedCount++;
    } else if (hasBaseline && !hasNew) {
      status = 'MISSING_IN_NEW';
      message = 'Field exists in baseline specification but is missing in New API payload';
      missingCount++;
    } else if (!hasBaseline && hasNew && !rule) {
      status = 'EXTRA_IN_NEW';
      message = 'Field present in New API payload but not defined in baseline or specification';
      extraCount++;
    } else {
      // Both present and no validation failure logged
      const v1 = JSON.stringify(entry.baselineVal);
      const v2 = JSON.stringify(entry.newVal);
      if (hasBaseline && hasNew && v1 !== v2) {
        status = 'VALUE_MISMATCH';
        message = 'Value differs from baseline document';
        mismatchedCount++; // Treat as mismatch for score? User wants it highlighted.
      } else {
        matchedCount++;
      }
    }

    items.push({
      path,
      baselineVal: entry.baselineVal,
      baselineType: entry.baselineType || (entry.baselineVal === null ? 'NULL' : typeof entry.baselineVal).toUpperCase(),
      newVal: entry.newVal,
      newType: entry.newType || (entry.newVal === null ? 'NULL' : typeof entry.newVal).toUpperCase(),
      expectedType: rule?.dataType,
      nullable: rule?.nullable,
      transformRule: rule?.transformRule,
      status,
      failureMessage: message
    });
  });

  const totalFields = items.length;
  const matchScore = totalFields > 0 ? Math.max(0, Math.round((matchedCount / totalFields) * 100)) : 100;

  return {
    items,
    matchScore,
    totalFields,
    matchedCount,
    mismatchedCount,
    missingCount,
    extraCount
  };
}
