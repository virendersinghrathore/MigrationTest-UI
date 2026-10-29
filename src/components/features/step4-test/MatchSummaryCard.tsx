import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Copy, Check, ShieldCheck, Bookmark } from 'lucide-react';
import { ComparisonReport } from '../../../utils/payloadComparison';
import { TestRunResult } from '../../../types';

interface MatchSummaryCardProps {
  report: ComparisonReport;
  latestRun: TestRunResult | undefined;
  onOpenSaveModal?: () => void;
}

export const MatchSummaryCard: React.FC<MatchSummaryCardProps> = ({ report, latestRun, onOpenSaveModal }) => {
  const [copied, setCopied] = useState(false);
  const isPerfect = report.matchScore === 100 && report.mismatchedCount === 0 && report.missingCount === 0;

  const handleCopySummary = () => {
    const text = `Validation & Match Report:\nStatus: ${isPerfect ? 'PERFECT MATCH' : 'VIOLATIONS FOUND'}\nScore: ${report.matchScore}%\nMatched: ${report.matchedCount}/${report.totalFields}\nMismatches: ${report.mismatchedCount}\nMissing: ${report.missingCount}\nExtra: ${report.extraCount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
              isPerfect
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-500/10'
                : 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm shadow-rose-500/10'
            }`}
          >
            <span className="text-lg leading-none">{report.matchScore}%</span>
            <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5">Match</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Payload Compatibility & Match Result</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isPerfect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPerfect ? 'Verified Compatible' : 'Action Required'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isPerfect
                ? 'Every mapped field matches the CouchDB specification requirements.'
                : `${report.mismatchedCount + report.missingCount} discrepancies identified between baseline and target payload.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {latestRun && (
            <span className="text-xs text-slate-400 font-mono">
              Run: {latestRun.runId} ({latestRun.durationMs}ms)
            </span>
          )}
          {onOpenSaveModal && (
            <button
              onClick={onOpenSaveModal}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
              <span>Store Result</span>
            </button>
          )}
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Passed / Matched</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-xl font-bold text-emerald-900">
            {report.matchedCount} <span className="text-xs font-normal text-emerald-700">/ {report.totalFields}</span>
          </div>
        </div>

        <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Violations</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-1 text-xl font-bold text-rose-900">{report.mismatchedCount}</div>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Missing in Target</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1 text-xl font-bold text-amber-900">{report.missingCount}</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Extra Fields</span>
            <ShieldCheck className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-1 text-xl font-bold text-slate-800">{report.extraCount}</div>
        </div>
      </div>
    </div>
  );
};
