import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ComparisonReport } from '../../../utils/payloadComparison';
import { StatusBadge } from './StatusBadge';

interface FieldComparisonTableProps {
  report: ComparisonReport;
}

export const FieldComparisonTable: React.FC<FieldComparisonTableProps> = ({ report }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'FAILURES' | 'MATCHES' | 'DIFF'>('ALL');

  const filteredItems = report.items.filter((item) => {
    if (search && !item.path.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'FAILURES') return item.status !== 'MATCH' && item.status !== 'EXTRA_IN_NEW';
    if (filter === 'MATCHES') return item.status === 'MATCH';
    if (filter === 'DIFF') return item.status !== 'MATCH';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Side-by-Side Field Comparison & Verification</h4>
          <p className="text-xs text-slate-500 mt-0.5">Visual check between CouchDB baseline and New API</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button onClick={() => setFilter('ALL')} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              All ({report.totalFields})
            </button>
            <button onClick={() => setFilter('FAILURES')} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${filter === 'FAILURES' ? 'bg-white text-rose-700 shadow-xs' : 'text-rose-600 hover:text-rose-900'}`}>
              Violations ({report.mismatchedCount + report.missingCount})
            </button>
            <button onClick={() => setFilter('MATCHES')} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${filter === 'MATCHES' ? 'bg-white text-emerald-700 shadow-xs' : 'text-emerald-600 hover:text-emerald-900'}`}>
              Matches ({report.matchedCount})
            </button>
          </div>
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search field path..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
              <th className="py-2.5 px-4">Field Path</th>
              <th className="py-2.5 px-4">Baseline CouchDB</th>
              <th className="py-2.5 px-4">New API Payload</th>
              <th className="py-2.5 px-4">Spec Constraint</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Diagnostic Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-xs">No fields match current filter criteria.</td></tr>
            ) : (
              filteredItems.map((item) => {
                const isFail = item.status !== 'MATCH' && item.status !== 'EXTRA_IN_NEW';
                return (
                  <tr key={item.path} className={`hover:bg-slate-50/80 transition-colors ${isFail ? 'bg-rose-50/40' : item.status === 'MATCH' ? 'bg-emerald-50/20' : ''}`}>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{item.path}</td>
                    <td className="py-2.5 px-4 font-mono">
                      <div className="text-slate-800 font-medium">{item.baselineVal !== undefined ? JSON.stringify(item.baselineVal) : <span className="text-slate-400 italic">None</span>}</div>
                      <div className="text-[10px] text-slate-400">{item.baselineType}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      <div className={item.status === 'VALUE_MISMATCH' ? 'text-amber-700 font-bold' : isFail ? 'text-rose-700 font-bold' : 'text-slate-800 font-medium'}>
                        {item.newVal !== undefined ? JSON.stringify(item.newVal) : <span className="text-slate-400 italic">None</span>}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.newType}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      {item.expectedType ? (
                        <div className="text-[11px]"><span className="font-bold text-indigo-700">{item.expectedType}</span>
                          <span className="text-slate-500 text-[10px] block">{item.nullable ? 'Nullable' : 'Not Null'}{item.transformRule ? ` • ${item.transformRule}` : ''}</span>
                        </div>
                      ) : <span className="text-slate-400 text-[10px] italic">No rule set</span>}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                    <td className="py-2.5 px-4 text-[11px]">{item.failureMessage ? <span className="text-rose-700 font-medium">{item.failureMessage}</span> : <span className="text-emerald-700 font-medium">Exact Match</span>}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
