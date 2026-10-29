import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Trash2, Download, CheckCircle2, AlertTriangle, FileText, ArrowRight, Clock, Calendar, User } from 'lucide-react';
import { SavedTestRun } from '../../../types/savedResults';
import { searchSavedResults } from '../../../utils/savedResultsStorage';

interface HistoryViewProps {
  savedRuns: SavedTestRun[];
  onRetrieveRun: (run: SavedTestRun) => void;
  onDeleteRun: (id: string) => void;
  onExportAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  savedRuns,
  onRetrieveRun,
  onDeleteRun,
  onExportAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');

  const filteredRuns = useMemo(() => {
    return searchSavedResults(savedRuns, searchTerm, filterStatus);
  }, [savedRuns, searchTerm, filterStatus]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Run History & Saved Results</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated repository of all stored validation runs with full timestamps and diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedRuns.length > 0 && (
            <button
              onClick={onExportAll}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export History (JSON)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by run name, spec endpoint, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['ALL', 'SUCCESS', 'FAILED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === status ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status === 'ALL' ? 'All History' : status === 'SUCCESS' ? '100% Match' : 'Issues Found'}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredRuns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-xs">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <RotateCcw className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">No matching history found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {savedRuns.length === 0 
                ? 'Store your first test result in Step 4 to start building your history.' 
                : 'Try adjusting your search query or status filter.'}
            </p>
          </div>
        ) : (
          filteredRuns.map((run) => {
            const isPerfect = run.matchScore === 100 && run.mismatchedCount === 0;
            const { date, time } = formatDate(run.createdAt);

            return (
              <div key={run.id} className="bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl p-5 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between lg:justify-start lg:items-center gap-3">
                    <h4 className="font-bold text-slate-900 truncate text-sm">{run.name}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                      isPerfect ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isPerfect ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {run.matchScore}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{time}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{run.userName || 'Unknown User'}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 bg-indigo-50/40 px-2 py-1 rounded-lg border border-indigo-100/50 text-indigo-700 font-medium truncate">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Spec: {run.templateName}</span>
                    </div>
                  </div>

                  {run.notes && (
                    <div className="bg-slate-50 border-l-4 border-indigo-200 p-2.5 rounded-r-xl">
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        &ldquo;{run.notes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-right hidden sm:block pr-4 border-r border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Passed</div>
                    <div className="text-sm font-bold text-slate-800">{run.matchedCount}/{run.totalFields}</div>
                  </div>
                  
                  <button
                    onClick={() => onRetrieveRun(run)}
                    className="flex-1 lg:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 cursor-pointer transition-colors"
                  >
                    <span>Inspect / Retrieve</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteRun(run.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-rose-100"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
