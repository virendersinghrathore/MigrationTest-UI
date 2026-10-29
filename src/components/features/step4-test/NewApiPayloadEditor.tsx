import React, { useState } from 'react';
import { Play, Code, Eye, Code2, CheckCircle2, AlertCircle } from 'lucide-react';
import { MappingTemplate } from '../../../types';
import { ComparisonReport } from '../../../utils/payloadComparison';
import { VisualPayloadAnnotator } from './VisualPayloadAnnotator';

interface NewApiPayloadEditorProps {
  templates: MappingTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  newApiTestPayload: string;
  onChangeTestPayload: (val: string) => void;
  onExecuteValidation: () => void;
  report: ComparisonReport;
  onLoadPassingSample: () => void;
  onLoadFailingSample: () => void;
  showMockData?: boolean;
}

export const NewApiPayloadEditor: React.FC<NewApiPayloadEditorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  newApiTestPayload,
  onChangeTestPayload,
  onExecuteValidation,
  report,
  onLoadPassingSample,
  onLoadFailingSample,
  showMockData = false
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'visual'>('visual');

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(newApiTestPayload);
      onChangeTestPayload(JSON.stringify(parsed, null, 2));
    } catch {
      // syntax error
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">2. New API Payload (Target)</span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Test Target
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Live API response payload undergoing validation</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTemplateId}
            onChange={(e) => onSelectTemplate(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            {templates.length === 0 ? (
              <option value="" disabled>No specs available</option>
            ) : (
              templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.mappings.length} rules)
                </option>
              ))
            )}
          </select>

          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'visual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Status</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'editor' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON Code</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          {showMockData && (
            <>
              <span className="text-slate-500">Quick Presets:</span>
              <button
                onClick={onLoadPassingSample}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Load Passing Sample</span>
              </button>
              <button
                onClick={onLoadFailingSample}
                className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Load Sample with Violations</span>
              </button>
            </>
          )}
        </div>

        {viewMode === 'editor' && (
          <button
            onClick={handleFormatJson}
            className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3 h-3 text-slate-500" />
            <span>Beautify</span>
          </button>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col min-h-[380px]">
        {viewMode === 'editor' ? (
          <textarea
            rows={14}
            value={newApiTestPayload}
            onChange={(e) => onChangeTestPayload(e.target.value)}
            placeholder="Paste your New API JSON response here..."
            className="w-full flex-1 bg-slate-950 text-emerald-400 font-mono text-[11px] p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        ) : (
          <div className="flex-1">
            <VisualPayloadAnnotator report={report} />
          </div>
        )}

        <button
          onClick={onExecuteValidation}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Execute Validation & Match Analysis</span>
        </button>
      </div>
    </div>
  );
};
