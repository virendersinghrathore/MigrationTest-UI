import { MappingTemplate, ValidationFailure, TestRunResult, ValidationRuleItem } from '../types';
import { getNestedValue } from './jsonHelper';

export interface ValidationOutput {
  result: TestRunResult;
  failures: ValidationFailure[];
}

export function validatePayloadAgainstSpec(
  payloadId: string,
  targetTemplate: MappingTemplate,
  testPayloadObj: any,
  validationRules: ValidationRuleItem[]
): ValidationOutput {
  const runId = `run-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  let passed = 0;
  let failed = 0;
  const runFailures: ValidationFailure[] = [];

  targetTemplate.mappings.forEach((mapping) => {
    const val = getNestedValue(testPayloadObj, mapping.couchField);

    // Null constraint check
    if (!mapping.nullable && (val === null || val === undefined || val === '')) {
      failed++;
      runFailures.push({
        id: `vf-${Math.random().toString(36).substring(2, 7)}`,
        runId,
        endpointId: payloadId,
        endpointName: targetTemplate.name,
        timestamp: now,
        severity: 'error',
        errorType: 'NULL_VIOLATION',
        fieldPath: mapping.couchField,
        mysqlColumn: mapping.mysqlColumn,
        message: `Field "${mapping.couchField}" is null or empty, violating NOT NULL specification.`,
        payloadSnippet: { [mapping.couchField]: val }
      });
      return;
    }

    // Type validation
    if (val !== null && val !== undefined) {
      let typeValid = true;
      if (mapping.dataType === 'INT' || mapping.dataType === 'BIGINT') {
        if (typeof val !== 'number' || isNaN(val)) typeValid = false;
      } else if (mapping.dataType === 'DECIMAL') {
        if (typeof val !== 'number' && isNaN(Number(val))) typeValid = false;
      } else if (mapping.dataType === 'BOOLEAN') {
        if (typeof val !== 'boolean') typeValid = false;
      } else if (mapping.dataType === 'DATETIME') {
        if (typeof val !== 'number' && isNaN(Date.parse(String(val)))) typeValid = false;
      }

      if (!typeValid) {
        failed++;
        runFailures.push({
          id: `vf-${Math.random().toString(36).substring(2, 7)}`,
          runId,
          endpointId: payloadId,
          endpointName: targetTemplate.name,
          timestamp: now,
          severity: 'error',
          errorType: 'TYPE_MISMATCH',
          fieldPath: mapping.couchField,
          mysqlColumn: mapping.mysqlColumn,
          message: `Field "${mapping.couchField}" expected ${mapping.dataType}, received "${val}".`,
          payloadSnippet: { [mapping.couchField]: val }
        });
        return;
      }

      // Regex / Validation Rule check
      if (mapping.transformRule) {
        const ruleKey = mapping.transformRule;
        const foundRule = validationRules.find((r) => r.key === ruleKey);
        let pattern = foundRule?.regexPattern;

        if (!pattern) {
          if (ruleKey === 'email') pattern = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
          else if (ruleKey === 'alphanumeric') pattern = '^[a-zA-Z0-9_-]+$';
          else if (ruleKey === 'decimal') pattern = '^\\d+(\\.\\d{1,2})?$';
          else if (ruleKey.startsWith('regex:')) pattern = ruleKey.replace('regex:', '');
        }

        if (pattern) {
          try {
            const re = new RegExp(pattern);
            if (!re.test(String(val))) {
              failed++;
              runFailures.push({
                id: `vf-${Math.random().toString(36).substring(2, 7)}`,
                runId,
                endpointId: payloadId,
                endpointName: targetTemplate.name,
                timestamp: now,
                severity: 'error',
                errorType: 'TYPE_MISMATCH',
                fieldPath: mapping.couchField,
                mysqlColumn: mapping.mysqlColumn,
                message: `Field "${mapping.couchField}" failed validation rule "${ruleKey}" (pattern: ${pattern}).`,
                payloadSnippet: { [mapping.couchField]: val }
              });
              return;
            }
          } catch {
            // Ignore invalid regex pattern syntax
          }
        }
      }
    }

    passed++;
  });

  const status = failed > 0 ? 'FAILED' : 'SUCCESS';
  const result: TestRunResult = {
    runId,
    timestamp: now,
    endpointId: payloadId,
    endpointName: `New API vs ${targetTemplate.name}`,
    status,
    totalChecked: targetTemplate.mappings.length,
    passedCount: passed,
    failedCount: failed,
    durationMs: Math.floor(12 + Math.random() * 25),
    failures: runFailures
  };

  return { result, failures: runFailures };
}

export function validateJsonPayload(
  payloadId: string,
  targetTemplate: MappingTemplate,
  jsonText: string,
  validationRules: ValidationRuleItem[]
): ValidationOutput {
  try {
    const parsed = JSON.parse(jsonText);
    return validatePayloadAgainstSpec(payloadId, targetTemplate, parsed, validationRules);
  } catch (err: any) {
    const runId = `run-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const syntaxFailure: ValidationFailure = {
      id: `vf-${Math.random().toString(36).substring(2, 7)}`,
      runId,
      endpointId: payloadId,
      endpointName: targetTemplate.name,
      timestamp: now,
      severity: 'error',
      errorType: 'TYPE_MISMATCH',
      fieldPath: 'JSON_SYNTAX',
      message: `Invalid JSON syntax: ${err.message}`,
      payloadSnippet: {}
    };
    return {
      result: {
        runId,
        timestamp: now,
        endpointId: payloadId,
        endpointName: `New API vs ${targetTemplate.name}`,
        status: 'FAILED',
        totalChecked: 1,
        passedCount: 0,
        failedCount: 1,
        durationMs: 1,
        failures: [syntaxFailure]
      },
      failures: [syntaxFailure]
    };
  }
}

