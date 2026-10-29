export interface FlattenedField {
  path: string;
  val: any;
  type: string;
}

export function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function flattenPayloadKeys(obj: any, prefix = ''): FlattenedField[] {
  let res: FlattenedField[] = [];
  if (!obj || typeof obj !== 'object') return res;

  for (const k in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    const fullPath = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    const t = v === null ? 'NULL' : Array.isArray(v) ? 'ARRAY' : typeof v;

    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      res = res.concat(flattenPayloadKeys(v, fullPath));
    } else {
      res.push({ path: fullPath, val: v, type: t.toUpperCase() });
    }
  }
  return res;
}

export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export function exportToJsonFile(filename: string, data: any): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
