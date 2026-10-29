import React from 'react';

interface DashboardViewProps {
  successRate: number;
  payloadCount: number;
  failuresCount: number;
  templateCount: number;
  onStartStep1: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  successRate,
  payloadCount,
  failuresCount,
  templateCount,
  onStartStep1
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Migration Health</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{successRate}%</span>
            <span className="text-xs font-bold text-emerald-600">Passing</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${successRate}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stored Endpoints</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{payloadCount}</span>
            <span className="text-xs font-bold text-indigo-600">CouchDB APIs</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Captured response payloads</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Failures</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{failuresCount}</span>
            <span className="text-xs font-bold text-rose-600">Mismatches</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Type or regex violations</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Endpoint Specs</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{templateCount}</span>
            <span className="text-xs font-bold text-purple-600">Defined</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Ready for new API matching</p>
        </div>
      </div>

      {/* Workflow Guidance Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-indigo-900">Recommended Migration Workflow</h3>
          <p className="text-xs text-indigo-700 mt-1">
            Follow the 4 steps in the sidebar: Store CouchDB API call ➔ Define Data Types & Regex Rules ➔ Save Endpoint Specs ➔ Match against New API.
          </p>
        </div>
        <button
          onClick={onStartStep1}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          Start Step 1
        </button>
      </div>
    </div>
  );
};
