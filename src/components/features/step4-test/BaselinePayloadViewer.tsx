import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Database, Search } from 'lucide-react';
import { CouchPayload } from '../../../types';

interface BaselinePayloadViewerProps {
  payloads: CouchPayload[];
  selectedPayload: CouchPayload | undefined;
  onSelectPayload: (id: string) => void;
  onSyncToNewApi: (jsonString: string) => void;
}

export const BaselinePayloadViewer: React.FC<BaselinePayloadViewerProps> = ({
  payloads,
  selectedPayload,
  onSelectPayload,
  onSyncToNewApi
}) => {
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const formattedJson = selectedPayload ? JSON.stringify(selectedPayload.payload, null, 2) : '{}';

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = formattedJson.split('\n');
  const filteredIndices = filterQuery
    ? lines.map((l, i) => (l.toLowerCase().includes(filterQuery.toLowerCase()) ? i : -1)).filter((i) => i !== -1)
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">1. Baseline Payload (CouchDB)</span>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                Source of Truth
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Document spec used for validation comparison</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={selectedPayload?.id || ''}
            onChange={(e) => onSelectPayload(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 max-w-[170px] truncate cursor-pointer"
          >
            {payloads.length === 0 ? (
              <option value="" disabled>No payloads available</option>
            ) : (
              payloads.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))
            )}
          </select>

          <button
            onClick={handleCopy}
            title="Copy Baseline JSON"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onSyncToNewApi(formattedJson)}
            title="Copy baseline into New API Payload tester"
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 whitespace-nowrap"
          >
            <span>Sync to New API</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
            {selectedPayload?.method || 'N/A'}
          </span>
          <span className="font-mono text-slate-700">{selectedPayload?.endpoint || 'No baseline document selected'}</span>
        </div>
        <div className="relative w-44">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter fields..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full text-[11px] pl-7 pr-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-3 overflow-auto max-h-[420px] font-mono text-[11px] leading-5 text-slate-300">
        <pre className="m-0">
          {lines.map((line, idx) => {
            const isHighlighted = filteredIndices ? filteredIndices.includes(idx) : false;
            return (
              <div
                key={idx}
                className={`flex hover:bg-slate-900/80 px-1 rounded transition-colors ${
                  isHighlighted ? 'bg-amber-950/60 text-amber-300' : ''
                }`}
              >
                <span className="text-slate-600 select-none w-8 text-right pr-3 shrink-0">{idx + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
