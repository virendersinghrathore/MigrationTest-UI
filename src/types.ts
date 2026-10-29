export type DataType = 
  | 'VARCHAR' 
  | 'INT' 
  | 'BIGINT' 
  | 'DECIMAL' 
  | 'BOOLEAN' 
  | 'JSON' 
  | 'DATETIME' 
  | 'TEXT' 
  | 'ENUM';

export interface FieldGroup {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface FieldMappingRule {
  id: string;
  couchField: string;        // e.g. "profile.contact.email" or "doc._id"
  mysqlColumn: string;       // e.g. "email" or "id"
  dataType: DataType;
  nullable: boolean;
  groupId?: string;          // Belongs to FieldGroup
  defaultValue?: string;
  transformRule?: string;    // e.g. "lowercase", "trim", "json_stringify", "timestamp_to_datetime"
  description?: string;
}

export interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  targetTable: string;
  mappings: FieldMappingRule[];
  createdAt: string;
  updatedAt: string;
  isMock?: boolean;
}

export interface CouchPayload {
  id: string;
  endpoint: string;          // e.g. "/api/v1/customers"
  method: 'GET' | 'POST' | 'PUT';
  title: string;
  description: string;
  payload: Record<string, any>;
  createdAt: string;
  tags: string[];
  isMock?: boolean;
}

export interface EndpointTestConfig {
  id: string;
  name: string;
  endpointId: string;
  templateId: string;
  mysqlTable: string;
  enabledRules: {
    fieldMapping: boolean;
    dataTypeCheck: boolean;
    nullConstraint: boolean;
    extraFieldsWarning: boolean;
  };
}

export interface ValidationFailure {
  id: string;
  runId: string;
  endpointId: string;
  endpointName: string;
  timestamp: string;
  severity: 'error' | 'warning';
  errorType: 'MISSING_FIELD' | 'TYPE_MISMATCH' | 'NULL_VIOLATION' | 'UNMAPPED_FIELD' | 'EXTRA_FIELD';
  fieldPath: string;
  mysqlColumn?: string;
  message: string;
  payloadSnippet: any;
  isMock?: boolean;
}

export interface TestRunResult {
  runId: string;
  timestamp: string;
  endpointId: string;
  endpointName: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  totalChecked: number;
  passedCount: number;
  failedCount: number;
  durationMs: number;
  failures: ValidationFailure[];
  isMock?: boolean;
}

export interface SchemaDiffItem {
  fieldPath: string;
  couchType: string;
  mysqlColumn: string;
  mysqlType: string;
  status: 'MATCH' | 'TYPE_MISMATCH' | 'MISSING_IN_MYSQL' | 'NULLABLE_MISMATCH' | 'UNMAPPED';
  details: string;
}

export interface ValidationRuleItem {
  id: string;
  key: string;
  desc: string;
  regexPattern?: string;
  isBuiltIn?: boolean;
}

export interface MigrationProfile {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type TabType = 
  | 'dashboard' 
  | 'step1_store' 
  | 'step2_rules' 
  | 'transforms' 
  | 'step3_specs' 
  | 'step4_test'
  | 'history'
  | 'settings';

export interface AppSettings {
  userName: string;
  storageMode: 'localstorage' | 'file';
  showMockData: boolean;
}



