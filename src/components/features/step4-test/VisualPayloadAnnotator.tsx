import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';
import { ComparisonReport, FieldComparisonItem } from '../../../utils/payloadComparison';

interface VisualPayloadAnnotatorProps {
  report: ComparisonReport;
  onSelectField?: (fieldPath: string) => void;
}

export const VisualPayloadAnnotator: React.FC<VisualPayloadAnnotatorProps> = ({ report, onSelectField }) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'FAILED' | 'MATCHED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredItems = report.items.filter((item) => {
    if (search && !item.path.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterMode === 'FAILED') return item.status !== 'MATCH' && item.status !== 'EXTRA_IN_NEW';
    if (filterMode === 'MATCHED') return item.status === 'MATCH';
    return true;
  });

  const getStatusBadge = (item: FieldComparisonItem) => {
    switch (item.status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            VALID MATCH
          </span>
        );
      case 'TYPE_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            TYPE MISMATCH
          </span>
        );
      case 'NULL_VIOLATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            NULL VIOLATION
          </span>
        );
      case 'REGEX_FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            RULE VIOLATION
          </span>
        );
      case 'MISSING_IN_NEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            MISSING FIELD
          </span>
        );
      case 'EXTRA_IN_NEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            EXTRA FIELD
          </span>
        );
      case 'VALUE_MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            VALUE DIFF
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden">
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
              filterMode === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({report.totalFields})
          </button>
          <button
            onClick={() => setFilterMode('FAILED')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
              filterMode === 'FAILED' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-white'
            }`}
          >
            Violations ({report.mismatchedCount + report.missingCount})
          </button>
          <button
            onClick={() => setFilterMode('MATCHED')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
              filterMode === 'MATCHED' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
            }`}
          >
            Matched ({report.matchedCount})
          </button>
        </div>

        <div className="relative w-36">
          <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-[11px] pl-6 pr-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="p-3 overflow-y-auto max-h-[420px] space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">No fields match current filter</div>
        ) : (
          filteredItems.map((item) => {
            const hasError = item.status !== 'MATCH' && item.status !== 'EXTRA_IN_NEW';
            return (
              <div
                key={item.path}
                onClick={() => onSelectField?.(item.path)}
                className={`p-2.5 rounded-lg border transition-all text-xs font-mono cursor-pointer ${
                  hasError
                    ? item.status === 'VALUE_MISMATCH'
                      ? 'bg-amber-950/20 border-amber-600/60 hover:bg-amber-950/40 shadow-xs shadow-amber-900/20'
                      : 'bg-rose-950/40 border-rose-600/80 hover:bg-rose-950/60 shadow-xs shadow-rose-900/30'
                    : item.status === 'MATCH'
                    ? 'bg-slate-850 bg-slate-800/60 border-emerald-900/40 hover:bg-slate-800'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-bold text-slate-200 truncate">{item.path}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-700/80 rounded text-slate-300">
                      {item.newType}
                    </span>
                  </div>
                  {getStatusBadge(item)}
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[280px]">
                    Value: <span className={item.status === 'VALUE_MISMATCH' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{JSON.stringify(item.newVal ?? null)}</span>
                  </span>
                  {item.expectedType && (
                    <span className="text-[10px] text-indigo-300 shrink-0">
                      Expect: {item.expectedType}
                      {item.nullable ? ' (null)' : ' (req)'}
                    </span>
                  )}
                </div>

                {item.failureMessage && (
                  <div className="mt-2 p-2 bg-rose-900/50 border border-rose-500/40 rounded text-rose-200 text-[11px] leading-relaxed">
                    <strong>Failure:</strong> {item.failureMessage}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
