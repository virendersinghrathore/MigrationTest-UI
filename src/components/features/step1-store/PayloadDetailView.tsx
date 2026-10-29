import React from 'react';
import { ArrowRight, Plus, Trash2, Layers } from 'lucide-react';
import { CouchPayload, MappingTemplate, FieldMappingRule } from '../../../types';
import { flattenPayloadKeys } from '../../../utils/jsonHelper';

interface PayloadDetailViewProps {
  payload?: CouchPayload;
  template?: MappingTemplate;
  onProceedToStep2: () => void;
  onAddNewRule: (fieldPath: string, detectedType: string) => void;
  onEditRule: (rule: FieldMappingRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onCreateSpecFromPayload?: (payloadId: string) => void;
}

export const PayloadDetailView: React.FC<PayloadDetailViewProps> = ({
  payload,
  template,
  onProceedToStep2,
  onAddNewRule,
  onEditRule,
  onDeleteRule,
  onCreateSpecFromPayload
}) => {
  if (!payload) {
    return <div className="text-slate-400 text-xs py-12 text-center">Select a stored payload to view details</div>;
  }

  const payloadFields = flattenPayloadKeys(payload.payload);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{payload.title}</h4>
          <span className="text-xs font-mono text-indigo-600 font-medium">{payload.endpoint}</span>
        </div>

        <div className="flex items-center gap-2">
          {onCreateSpecFromPayload && (
            <button
              onClick={() => onCreateSpecFromPayload(payload.id)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-indigo-200/60"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>Create Spec from Payload</span>
            </button>
          )}

          <button
            onClick={onProceedToStep2}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Next: Field Rules</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Field Data Type & Regex Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Field Validation Rules</h5>
          <button
            onClick={() => onAddNewRule(payloadFields[0]?.path || '', payloadFields[0]?.type || 'VARCHAR')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> + Add Rule
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Field Path</th>
                <th className="px-4 py-2.5">Detected Type</th>
                <th className="px-4 py-2.5">Mapped Type</th>
                <th className="px-4 py-2.5">Rule / Regex</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payloadFields.map((pf, idx) => {
                const rule = template?.mappings.find((m) => m.couchField === pf.path);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 font-mono">
                    <td className="px-4 py-3 font-bold text-slate-900">{pf.path}</td>
                    <td className="px-4 py-3 text-slate-600">{pf.type}</td>
                    <td className="px-4 py-3 text-indigo-600">
                      {rule ? rule.dataType : <span className="text-slate-400 italic">Unmapped</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {rule?.transformRule ? (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px]">
                          {rule.transformRule}
                        </span>
                      ) : rule && !rule.nullable ? (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                          NOT NULL
                        </span>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {rule ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onEditRule(rule)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteRule(rule.id)}
                            title="Remove Rule"
                            className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddNewRule(pf.path, pf.type)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer"
                        >
                          + Add Rule
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw JSON View */}
      <div className="space-y-2 pt-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Raw JSON Payload</h5>
        <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-[220px]">
          <pre>{JSON.stringify(payload.payload, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
