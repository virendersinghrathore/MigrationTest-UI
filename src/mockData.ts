import { FieldGroup, MappingTemplate, CouchPayload, TestRunResult, ValidationFailure } from './types';
export { INITIAL_VALIDATION_RULES } from './mockValidationRules';

export const INITIAL_FIELD_GROUPS: FieldGroup[] = [
  { id: 'g-1', name: 'Identity & Keys', description: 'Primary keys, UUIDs, revision identifiers', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { id: 'g-2', name: 'Contact Info', description: 'Emails, phones, physical addresses', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'g-3', name: 'Financial & Billing', description: 'Prices, currencies, credit status, tax IDs', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'g-4', name: 'Audit & Metadata', description: 'Timestamps, version tags, state flags', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
];

export const MOCK_PAYLOAD_IDS = new Set(['cp-1', 'cp-2', 'cp-3']);
export const MOCK_TEMPLATE_IDS = new Set(['tpl-customer', 'tpl-order']);
export const MOCK_RUN_IDS = new Set(['run-9021', 'run-9020', 'run-8994']);
export const MOCK_FAILURE_IDS = new Set(['vf-1', 'vf-2', 'vf-3', 'vf-4']);

export const isMockPayload = (p: { id: string; isMock?: boolean }): boolean =>
  Boolean(p.isMock || MOCK_PAYLOAD_IDS.has(p.id));

export const isMockTemplate = (t: { id: string; isMock?: boolean }): boolean =>
  Boolean(t.isMock || MOCK_TEMPLATE_IDS.has(t.id));

export const isMockRun = (r: { runId: string; endpointId?: string; isMock?: boolean }): boolean =>
  Boolean(r.isMock || MOCK_RUN_IDS.has(r.runId) || (r.endpointId && MOCK_PAYLOAD_IDS.has(r.endpointId)));

export const isMockFailure = (f: { id: string; runId?: string; endpointId?: string; isMock?: boolean }): boolean =>
  Boolean(f.isMock || MOCK_FAILURE_IDS.has(f.id) || (f.runId && MOCK_RUN_IDS.has(f.runId)) || (f.endpointId && MOCK_PAYLOAD_IDS.has(f.endpointId)));

export const INITIAL_MAPPING_TEMPLATES: MappingTemplate[] = [
  {
    id: 'tpl-customer',
    isMock: true,
    name: 'Customer Profile Mapping',
    description: 'Maps CouchDB customer document structure to MySQL customers table',
    targetTable: 'mysql_customers',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
    mappings: [
      { id: 'm-1', couchField: '_id', mysqlColumn: 'id', dataType: 'VARCHAR', nullable: false, groupId: 'g-1', description: 'CouchDB doc ID mapped to customer UUID' },
      { id: 'm-2', couchField: '_rev', mysqlColumn: 'couch_rev', dataType: 'VARCHAR', nullable: true, groupId: 'g-1', description: 'CouchDB revision token' },
      { id: 'm-3', couchField: 'profile.firstName', mysqlColumn: 'first_name', dataType: 'VARCHAR', nullable: false, groupId: 'g-2', transformRule: 'trim' },
      { id: 'm-4', couchField: 'profile.lastName', mysqlColumn: 'last_name', dataType: 'VARCHAR', nullable: false, groupId: 'g-2', transformRule: 'trim' },
      { id: 'm-5', couchField: 'profile.email', mysqlColumn: 'email', dataType: 'VARCHAR', nullable: false, groupId: 'g-2', transformRule: 'lowercase' },
      { id: 'm-6', couchField: 'account.creditLimit', mysqlColumn: 'credit_limit', dataType: 'DECIMAL', nullable: true, groupId: 'g-3', defaultValue: '0.00' },
      { id: 'm-7', couchField: 'account.isActive', mysqlColumn: 'is_active', dataType: 'BOOLEAN', nullable: false, groupId: 'g-4', defaultValue: 'true' },
      { id: 'm-8', couchField: 'createdAt', mysqlColumn: 'created_at', dataType: 'DATETIME', nullable: false, groupId: 'g-4', transformRule: 'timestamp_to_datetime' }
    ]
  },
  {
    id: 'tpl-order',
    isMock: true,
    name: 'E-Commerce Order Mapping',
    description: 'Maps CouchDB order document to MySQL orders & items schema',
    targetTable: 'mysql_orders',
    createdAt: '2026-01-18T11:20:00Z',
    updatedAt: '2026-02-22T09:15:00Z',
    mappings: [
      { id: 'mo-1', couchField: '_id', mysqlColumn: 'order_id', dataType: 'VARCHAR', nullable: false, groupId: 'g-1' },
      { id: 'mo-2', couchField: 'customerId', mysqlColumn: 'customer_id', dataType: 'VARCHAR', nullable: false, groupId: 'g-1' },
      { id: 'mo-3', couchField: 'orderTotal', mysqlColumn: 'total_amount', dataType: 'DECIMAL', nullable: false, groupId: 'g-3' },
      { id: 'mo-4', couchField: 'currency', mysqlColumn: 'currency_code', dataType: 'ENUM', nullable: false, groupId: 'g-3', defaultValue: 'USD' },
      { id: 'mo-5', couchField: 'items', mysqlColumn: 'order_items_json', dataType: 'JSON', nullable: true, groupId: 'g-3', transformRule: 'json_stringify' },
      { id: 'mo-6', couchField: 'status', mysqlColumn: 'order_status', dataType: 'VARCHAR', nullable: false, groupId: 'g-4' }
    ]
  }
];

export const INITIAL_PAYLOADS: CouchPayload[] = [
  {
    id: 'cp-1',
    isMock: true,
    endpoint: '/api/v1/customers/cust_99281',
    method: 'POST',
    title: 'Standard Customer Document',
    description: 'Typical customer record from CouchDB users database with nested profile and account details.',
    createdAt: '2026-10-24T08:30:00Z',
    tags: ['Customer', 'Production', 'US-East'],
    payload: {
      _id: "cust_99281",
      _rev: "4-a89b2c3d4e5f6g7h",
      type: "customer",
      profile: { firstName: "Eleanor", lastName: "Vance", email: "eleanor.vance@enterprise.io", phone: "+1-555-019-2831" },
      account: { creditLimit: 15000.00, isActive: true, tier: "enterprise" },
      metadata: { source: "web_signup", ipAddress: "192.168.1.45" },
      createdAt: 1772184600000
    }
  },
  {
    id: 'cp-2',
    isMock: true,
    endpoint: '/api/v1/customers/cust_invalid_null',
    method: 'POST',
    title: 'Customer with Missing Mandatory Fields',
    description: 'Malformed CouchDB payload missing email and invalid null values to test constraint validation.',
    createdAt: '2026-10-25T14:10:00Z',
    tags: ['Customer', 'Test', 'Negative'],
    payload: {
      _id: "cust_invalid_null",
      _rev: "1-x99z",
      type: "customer",
      profile: { firstName: "Marcus", lastName: null, email: "", phone: null },
      account: { creditLimit: "INVALID_DECIMAL", isActive: "not_a_boolean" },
      createdAt: "not-a-timestamp"
    }
  },
  {
    id: 'cp-3',
    isMock: true,
    endpoint: '/api/v1/orders/ord_882910',
    method: 'POST',
    title: 'Bulk Order Document with Items Array',
    description: 'Complex CouchDB order document containing nested line items array and tax breakdowns.',
    createdAt: '2026-10-26T16:45:00Z',
    tags: ['Orders', 'Production', 'Inventory'],
    payload: {
      _id: "ord_882910",
      _rev: "2-9b8a7f",
      customerId: "cust_99281",
      orderTotal: 432.50,
      currency: "USD",
      items: [
        { sku: "SKU-PRO-01", qty: 2, unitPrice: 150.00 },
        { sku: "SKU-ACC-09", qty: 1, unitPrice: 132.50 }
      ],
      status: "processing"
    }
  }
];

export const INITIAL_FAILURES: ValidationFailure[] = [
  {
    id: 'vf-1',
    isMock: true,
    runId: 'run-9021',
    endpointId: 'cp-2',
    endpointName: '/api/v1/customers/cust_invalid_null',
    timestamp: '2026-10-27T08:12:00Z',
    severity: 'error',
    errorType: 'NULL_VIOLATION',
    fieldPath: 'profile.lastName',
    mysqlColumn: 'last_name',
    message: 'Field evaluated to null, but MySQL column "last_name" has NOT NULL constraint.',
    payloadSnippet: { firstName: "Marcus", lastName: null }
  },
  {
    id: 'vf-2',
    isMock: true,
    runId: 'run-9021',
    endpointId: 'cp-2',
    endpointName: '/api/v1/customers/cust_invalid_null',
    timestamp: '2026-10-27T08:12:00Z',
    severity: 'error',
    errorType: 'TYPE_MISMATCH',
    fieldPath: 'account.creditLimit',
    mysqlColumn: 'credit_limit',
    message: 'Expected DECIMAL for MySQL column "credit_limit", received string "INVALID_DECIMAL".',
    payloadSnippet: { creditLimit: "INVALID_DECIMAL" }
  },
  {
    id: 'vf-3',
    isMock: true,
    runId: 'run-9021',
    endpointId: 'cp-2',
    endpointName: '/api/v1/customers/cust_invalid_null',
    timestamp: '2026-10-27T08:12:00Z',
    severity: 'warning',
    errorType: 'TYPE_MISMATCH',
    fieldPath: 'createdAt',
    mysqlColumn: 'created_at',
    message: 'Expected DATETIME timestamp, received non-numeric string "not-a-timestamp".',
    payloadSnippet: { createdAt: "not-a-timestamp" }
  },
  {
    id: 'vf-4',
    isMock: true,
    runId: 'run-8994',
    endpointId: 'cp-3',
    endpointName: '/api/v1/orders/ord_882910',
    timestamp: '2026-10-26T19:30:00Z',
    severity: 'warning',
    errorType: 'UNMAPPED_FIELD',
    fieldPath: 'status',
    mysqlColumn: undefined,
    message: 'CouchDB field "status" is present in payload but has no active MySQL column mapping.',
    payloadSnippet: { status: "processing" }
  }
];

export const INITIAL_TEST_RUNS: TestRunResult[] = [
  {
    runId: 'run-9021',
    isMock: true,
    timestamp: '2026-10-27 08:12:00',
    endpointId: 'cp-2',
    endpointName: '/api/v1/customers/cust_invalid_null',
    status: 'FAILED',
    totalChecked: 8,
    passedCount: 5,
    failedCount: 3,
    durationMs: 42,
    failures: INITIAL_FAILURES.slice(0, 3)
  },
  {
    runId: 'run-9020',
    isMock: true,
    timestamp: '2026-10-27 08:10:00',
    endpointId: 'cp-1',
    endpointName: '/api/v1/customers/cust_99281',
    status: 'SUCCESS',
    totalChecked: 8,
    passedCount: 8,
    failedCount: 0,
    durationMs: 28,
    failures: []
  },
  {
    runId: 'run-8994',
    isMock: true,
    timestamp: '2026-10-26 19:30:00',
    endpointId: 'cp-3',
    endpointName: '/api/v1/orders/ord_882910',
    status: 'WARNING',
    totalChecked: 6,
    passedCount: 5,
    failedCount: 1,
    durationMs: 35,
    failures: INITIAL_FAILURES.slice(3)
  }
];
