import { DataType, FieldGroup, FieldMappingRule } from '../types';
import { flattenPayloadKeys } from './jsonHelper';

export function camelToSnake(str: string): string {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/[\s\.-]+/g, '_')
    .toLowerCase();
}

export function inferDataType(fieldName: string, val: any, detectedType: string): DataType {
  const lowerName = fieldName.toLowerCase();
  
  if (lowerName.includes('date') || lowerName.includes('time') || lowerName.endsWith('_at') || lowerName.endsWith('at')) {
    return 'DATETIME';
  }
  if (
    lowerName === 'is_active' ||
    lowerName === 'isactive' ||
    lowerName.startsWith('is_') ||
    lowerName.startsWith('has_') ||
    detectedType === 'BOOLEAN'
  ) {
    return 'BOOLEAN';
  }
  if (detectedType === 'ARRAY' || detectedType === 'OBJECT' || (val !== null && typeof val === 'object')) {
    return 'JSON';
  }
  if (detectedType === 'NUMBER') {
    if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        return Math.abs(val) > 2147483647 ? 'BIGINT' : 'INT';
      }
      return 'DECIMAL';
    }
    return 'DECIMAL';
  }
  if (
    lowerName.includes('price') ||
    lowerName.includes('amount') ||
    lowerName.includes('total') ||
    lowerName.includes('cost') ||
    lowerName.includes('balance') ||
    lowerName.includes('limit')
  ) {
    return 'DECIMAL';
  }
  if (lowerName.includes('status') || lowerName.includes('type') || lowerName.includes('currency')) {
    return 'VARCHAR';
  }
  if (typeof val === 'string' && val.length > 255) {
    return 'TEXT';
  }
  return 'VARCHAR';
}

export function inferGroupId(fieldName: string, fieldGroups: FieldGroup[] = []): string | undefined {
  const lower = fieldName.toLowerCase();
  if (
    lower === '_id' ||
    lower === 'id' ||
    lower === '_rev' ||
    lower.includes('uuid') ||
    lower.endsWith('_id') ||
    lower.endsWith('id')
  ) {
    return fieldGroups.find(g => g.name.toLowerCase().includes('identity') || g.id === 'g-1')?.id || 'g-1';
  }
  if (
    lower.includes('email') ||
    lower.includes('phone') ||
    lower.includes('name') ||
    lower.includes('address') ||
    lower.includes('contact')
  ) {
    return fieldGroups.find(g => g.name.toLowerCase().includes('contact') || g.id === 'g-2')?.id || 'g-2';
  }
  if (
    lower.includes('price') ||
    lower.includes('total') ||
    lower.includes('credit') ||
    lower.includes('amount') ||
    lower.includes('currency') ||
    lower.includes('cost') ||
    lower.includes('billing')
  ) {
    return fieldGroups.find(g => g.name.toLowerCase().includes('financial') || g.id === 'g-3')?.id || 'g-3';
  }
  if (
    lower.includes('created') ||
    lower.includes('updated') ||
    lower.includes('time') ||
    lower.includes('date') ||
    lower.includes('status') ||
    lower.includes('version') ||
    lower.includes('meta')
  ) {
    return fieldGroups.find(g => g.name.toLowerCase().includes('audit') || g.id === 'g-4')?.id || 'g-4';
  }
  return fieldGroups[0]?.id;
}

export function generateFieldRulesFromPayload(
  payloadObj: any,
  fieldGroups: FieldGroup[] = []
): FieldMappingRule[] {
  const flattened = flattenPayloadKeys(payloadObj);
  return flattened.map((f, index) => {
    const segments = f.path.split('.');
    const lastPart = segments[segments.length - 1];
    let mysqlCol = camelToSnake(lastPart);
    if (f.path === '_id') mysqlCol = 'id';
    if (f.path === '_rev') mysqlCol = 'couch_rev';

    const dataType = inferDataType(f.path, f.val, f.type);
    const groupId = inferGroupId(f.path, fieldGroups);

    return {
      id: `m-gen-${Date.now()}-${index}`,
      couchField: f.path,
      mysqlColumn: mysqlCol,
      dataType,
      nullable: f.val === null || f.path === '_rev',
      groupId,
      description: `Auto-mapped from ${f.path}`
    };
  });
}
