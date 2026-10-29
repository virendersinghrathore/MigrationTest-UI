import test from 'node:test';
import assert from 'node:assert/strict';
import {
  saveResult,
  getSavedResults,
  deleteSavedResult,
  clearAllSavedResults,
  searchSavedResults
} from './savedResultsStorage';

test('savedResultsStorage saves and retrieves test runs', () => {
  const profile = `test_prof_${Date.now()}`;
  clearAllSavedResults(profile);

  const saved = saveResult(profile, {
    name: 'Customer Endpoint Test - Production',
    notes: 'Checking email and creditLimit',
    payloadId: 'doc_1',
    payloadTitle: 'Customer Baseline',
    templateId: 'tpl_1',
    templateName: 'Customer MySQL Mapping',
    baselinePayloadStr: '{"_id": "cust_1"}',
    newApiPayloadStr: '{"_id": "cust_1"}',
    matchScore: 100,
    status: 'SUCCESS',
    totalFields: 5,
    matchedCount: 5,
    mismatchedCount: 0,
    missingCount: 0,
    extraCount: 0
  });

  assert.ok(saved.id.startsWith('saved_run_'));
  assert.equal(saved.name, 'Customer Endpoint Test - Production');

  const retrieved = getSavedResults(profile);
  assert.equal(retrieved.length, 1);
  assert.equal(retrieved[0].id, saved.id);
  assert.equal(retrieved[0].matchScore, 100);
});

test('savedResultsStorage supports searching and status filtering', () => {
  const profile = `test_prof_search_${Date.now()}`;

  saveResult(profile, {
    name: 'Orders V2 Alpha',
    notes: 'Needs billing address',
    payloadId: 'doc_orders',
    payloadTitle: 'Order Document',
    templateId: 'tpl_orders',
    templateName: 'Orders Table Spec',
    baselinePayloadStr: '{}',
    newApiPayloadStr: '{}',
    matchScore: 60,
    status: 'FAILED',
    totalFields: 10,
    matchedCount: 6,
    mismatchedCount: 4,
    missingCount: 0,
    extraCount: 0
  });

  saveResult(profile, {
    name: 'Customer Profile Beta',
    payloadId: 'doc_cust',
    payloadTitle: 'Customer Profile',
    templateId: 'tpl_cust',
    templateName: 'Customer Spec',
    baselinePayloadStr: '{}',
    newApiPayloadStr: '{}',
    matchScore: 100,
    status: 'SUCCESS',
    totalFields: 5,
    matchedCount: 5,
    mismatchedCount: 0,
    missingCount: 0,
    extraCount: 0
  });

  const all = getSavedResults(profile);
  assert.equal(all.length, 2);

  const searchOrders = searchSavedResults(all, 'orders', 'ALL');
  assert.equal(searchOrders.length, 1);
  assert.equal(searchOrders[0].name, 'Orders V2 Alpha');

  const searchFailed = searchSavedResults(all, '', 'FAILED');
  assert.equal(searchFailed.length, 1);
  assert.equal(searchFailed[0].status, 'FAILED');

  const searchSuccess = searchSavedResults(all, '', 'SUCCESS');
  assert.equal(searchSuccess.length, 1);
  assert.equal(searchSuccess[0].status, 'SUCCESS');
});

test('savedResultsStorage deletes a saved run and clears', () => {
  const profile = `test_prof_del_${Date.now()}`;
  const r1 = saveResult(profile, {
    name: 'Run 1',
    payloadId: '1',
    payloadTitle: 'Title 1',
    templateId: 'tpl',
    templateName: 'Template',
    baselinePayloadStr: '{}',
    newApiPayloadStr: '{}',
    matchScore: 100,
    status: 'SUCCESS',
    totalFields: 1,
    matchedCount: 1,
    mismatchedCount: 0,
    missingCount: 0,
    extraCount: 0
  });

  const r2 = saveResult(profile, {
    name: 'Run 2',
    payloadId: '2',
    payloadTitle: 'Title 2',
    templateId: 'tpl',
    templateName: 'Template',
    baselinePayloadStr: '{}',
    newApiPayloadStr: '{}',
    matchScore: 80,
    status: 'FAILED',
    totalFields: 1,
    matchedCount: 0,
    mismatchedCount: 1,
    missingCount: 0,
    extraCount: 0
  });

  deleteSavedResult(profile, r1.id);
  const remaining = getSavedResults(profile);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, r2.id);

  clearAllSavedResults(profile);
  assert.equal(getSavedResults(profile).length, 0);
});
