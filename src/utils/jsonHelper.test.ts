import test from 'node:test';
import assert from 'node:assert/strict';
import { getNestedValue, flattenPayloadKeys, safeJsonParse } from './jsonHelper';

test('getNestedValue retrieves shallow and deeply nested properties', () => {
  const obj = {
    user: {
      profile: {
        name: 'Alice',
        score: 95
      }
    },
    active: true
  };

  assert.equal(getNestedValue(obj, 'active'), true);
  assert.equal(getNestedValue(obj, 'user.profile.name'), 'Alice');
  assert.equal(getNestedValue(obj, 'user.profile.score'), 95);
  assert.equal(getNestedValue(obj, 'user.nonExistent'), undefined);
});

test('flattenPayloadKeys extracts all paths with types', () => {
  const obj = {
    id: '123',
    details: {
      count: 10,
      enabled: false
    }
  };

  const keys = flattenPayloadKeys(obj);
  assert.equal(keys.length, 3);
  assert.equal(keys[0].path, 'id');
  assert.equal(keys[0].type, 'STRING');
  assert.equal(keys[1].path, 'details.count');
  assert.equal(keys[1].type, 'NUMBER');
  assert.equal(keys[2].path, 'details.enabled');
  assert.equal(keys[2].type, 'BOOLEAN');
});

test('safeJsonParse falls back cleanly on invalid json', () => {
  const fallback = { ok: true };
  assert.deepEqual(safeJsonParse('{"ok": false}', fallback), { ok: false });
  assert.deepEqual(safeJsonParse('{invalid json}', fallback), fallback);
  assert.deepEqual(safeJsonParse('', fallback), fallback);
});
