import { ValidationRuleItem } from './types';

export const INITIAL_VALIDATION_RULES: ValidationRuleItem[] = [
  { id: 'vr-1', key: 'trim', desc: 'Trims leading and trailing whitespace from string values.', regexPattern: '', isBuiltIn: true },
  { id: 'vr-2', key: 'lowercase', desc: 'Validates and normalizes string characters to lowercase.', regexPattern: '^[a-z0-9_@.\\-\\s]+$', isBuiltIn: true },
  { id: 'vr-3', key: 'uppercase', desc: 'Validates and normalizes string characters to uppercase.', regexPattern: '^[A-Z0-9_\\-\\s]+$', isBuiltIn: true },
  { id: 'vr-4', key: 'timestamp_to_datetime', desc: 'Validates and converts Epoch millisecond timestamps to DATETIME format.', regexPattern: '', isBuiltIn: true },
  { id: 'vr-5', key: 'json_stringify', desc: 'Validates and serializes nested objects/arrays into JSON string format.', regexPattern: '', isBuiltIn: true },
  { id: 'vr-6', key: 'email', desc: 'Validates standard email format using built-in default regex pattern.', regexPattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', isBuiltIn: true },
  { id: 'vr-7', key: 'alphanumeric', desc: 'Ensures field contains only letters, numbers, underscores, or hyphens.', regexPattern: '^[a-zA-Z0-9_-]+$', isBuiltIn: true },
  { id: 'vr-8', key: 'decimal', desc: 'Validates currency / decimal amount format with up to 2 decimal places.', regexPattern: '^\\d+(\\.\\d{1,2})?$', isBuiltIn: true },
];
