import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePayloadAgainstSpec } from './validationEngine';
import { MappingTemplate, ValidationRuleItem } from '../types';

const mockTemplate: MappingTemplate = {
  id: 'tpl-test',
  name: 'Test Template',
  description: 'Test template for validation engine',
  targetTable: 'test_table',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  mappings: [
    { id: 'm-1', couchField: 'id', mysqlColumn: 'id', dataType: 'VARCHAR', nullable: false },
    { id: 'm-2', couchField: 'email', mysqlColumn: 'email', dataType: 'VARCHAR', nullable: false, transformRule: 'email' },
    { id: 'm-3', couchField: 'age', mysqlColumn: 'age', dataType: 'INT', nullable: true },
    { id: 'm-4', couchField: 'active', mysqlColumn: 'is_active', dataType: 'BOOLEAN', nullable: false },
  ]
};

const mockValidationRules: ValidationRuleItem[] = [
  { id: 'vr-1', key: 'email', desc: 'Email validation', regexPattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', isBuiltIn: true },
  { id: 'vr-2', key: 'uppercase', desc: 'Uppercase validation', regexPattern: '^[A-Z0-9_\\-\\s]+$', isBuiltIn: true },
];

test('validatePayloadAgainstSpec passes valid payload', () => {
  const payload = {
    id: 'user_123',
    email: 'valid.user@example.com',
    age: 28,
    active: true
  };

  const { result, failures } = validatePayloadAgainstSpec('p-1', mockTemplate, payload, mockValidationRules);

  assert.equal(result.status, 'SUCCESS');
  assert.equal(result.failedCount, 0);
  assert.equal(failures.length, 0);
});

test('validatePayloadAgainstSpec detects NOT NULL violation', () => {
  const payload = {
    id: null,
    email: 'valid@example.com',
    age: 30,
    active: true
  };

  const { result, failures } = validatePayloadAgainstSpec('p-1', mockTemplate, payload, mockValidationRules);

  assert.equal(result.status, 'FAILED');
  assert.equal(result.failedCount, 1);
  assert.equal(failures[0].errorType, 'NULL_VIOLATION');
});

test('validatePayloadAgainstSpec detects type mismatch', () => {
  const payload = {
    id: 'user_123',
    email: 'valid@example.com',
    age: 'not_an_int',
    active: true
  };

  const { result, failures } = validatePayloadAgainstSpec('p-1', mockTemplate, payload, mockValidationRules);

  assert.equal(result.status, 'FAILED');
  assert.equal(result.failedCount, 1);
  assert.equal(failures[0].errorType, 'TYPE_MISMATCH');
});

test('validatePayloadAgainstSpec detects regex failure', () => {
  const payload = {
    id: 'user_123',
    email: 'invalid-email-format',
    age: 25,
    active: false
  };

  const { result, failures } = validatePayloadAgainstSpec('p-1', mockTemplate, payload, mockValidationRules);

  assert.equal(result.status, 'FAILED');
  assert.equal(result.failedCount, 1);
  assert.equal(failures[0].errorType, 'TYPE_MISMATCH');
  assert.match(failures[0].message, /failed validation rule "email"/);
});
