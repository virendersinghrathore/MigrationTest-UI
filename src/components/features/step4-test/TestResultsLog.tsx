import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TestRunResult } from '../../../types';

interface TestResultsLogProps {
  testRuns: TestRunResult[];
}

export const TestResultsLog: React.FC<TestResultsLogProps> = ({ testRuns }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
      <h4 className="text-sm font-bold text-slate-900 mb-4">Latest Validation & Match Results</h4>

      {testRuns.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-12">
          No test runs executed yet. Run a validation test above.
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[500px]">
          {testRuns.map((run) => (
            <div key={run.runId} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {run.status === 'SUCCESS' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                  <span className="text-xs font-bold text-slate-900">{run.endpointName}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    run.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {run.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center gap-3">
                <span>
                  Passed: <strong>{run.passedCount}/{run.totalChecked}</strong> fields
                </span>
                <span>•</span>
                <span>{run.durationMs}ms</span>
              </div>

              {run.failures.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Mismatches / Violations</span>
                  {run.failures.map((f) => (
                    <div key={f.id} className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-900">
                      <div className="font-bold font-mono">{f.fieldPath}</div>
                      <div className="mt-0.5">{f.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
