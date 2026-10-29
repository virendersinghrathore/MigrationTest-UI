import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comparePayloads } from './payloadComparison';
import { MappingTemplate, ValidationFailure } from '../types';

test('comparePayloads computes 100% match when payloads align', () => {
  const baseline = { id: 'c1', name: 'Alice', age: 30 };
  const newPayload = { id: 'c1', name: 'Alice', age: 30 };
  const report = comparePayloads(baseline, newPayload);

  assert.equal(report.matchScore, 100);
  assert.equal(report.matchedCount, 3);
  assert.equal(report.mismatchedCount, 0);
  assert.equal(report.missingCount, 0);
});

test('comparePayloads detects missing fields and extra fields', () => {
  const baseline = { id: 'c1', name: 'Alice', email: 'alice@test.com' };
  const newPayload = { id: 'c1', name: 'Alice', extraTag: 'VIP' };
  const report = comparePayloads(baseline, newPayload);

  assert.equal(report.missingCount, 1); // email missing
  assert.equal(report.extraCount, 1);   // extraTag extra
  assert.equal(report.matchedCount, 2); // id and name
});

test('comparePayloads assigns validation failures to paths', () => {
  const baseline = { id: 'c1', age: 30 };
  const newPayload = { id: 'c1', age: 'invalid_num' };
  const failures: ValidationFailure[] = [{
    id: 'f1',
    runId: 'r1',
    endpointId: 'ep1',
    endpointName: 'test',
    timestamp: '2026-10-28',
    severity: 'error',
    errorType: 'TYPE_MISMATCH',
    fieldPath: 'age',
    message: 'Expected INT received string',
    payloadSnippet: {}
  }];

  const report = comparePayloads(baseline, newPayload, null, failures);
  assert.equal(report.mismatchedCount, 1);
  const ageItem = report.items.find(i => i.path === 'age');
  assert.equal(ageItem?.status, 'TYPE_MISMATCH');
  assert.equal(ageItem?.failureMessage, 'Expected INT received string');
});

test('comparePayloads detects value mismatches even if schema matches', () => {
  const baseline = { id: 'c1', score: 100 };
  const newPayload = { id: 'c1', score: 95 }; // Score differs
  const report = comparePayloads(baseline, newPayload);

  assert.equal(report.matchedCount, 1); // id matches
  assert.equal(report.mismatchedCount, 1); // score differs
  const scoreItem = report.items.find(i => i.path === 'score');
  assert.equal(scoreItem?.status, 'VALUE_MISMATCH');
  assert.equal(scoreItem?.failureMessage, 'Value differs from baseline document');
});
