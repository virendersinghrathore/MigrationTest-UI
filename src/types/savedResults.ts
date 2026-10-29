import { TestRunResult } from '../types';
import { ComparisonReport } from '../utils/payloadComparison';

export interface SavedTestRun {
  id: string;
  name: string;
  notes?: string;
  createdAt: string;
  profileId: string;
  payloadId: string;
  payloadTitle: string;
  templateId: string;
  templateName: string;
  baselinePayloadStr: string;
  newApiPayloadStr: string;
  matchScore: number;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  totalFields: number;
  matchedCount: number;
  mismatchedCount: number;
  missingCount: number;
  extraCount: number;
  userName?: string;
  report?: ComparisonReport;
  testRun?: TestRunResult;
}
