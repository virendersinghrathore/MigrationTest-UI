import React from 'react';
import { PlusCircle, ArrowRight, Edit3, Trash2, Plus, Layers } from 'lucide-react';
import { MappingTemplate, FieldMappingRule } from '../../../types';

interface Step2RulesViewProps {
  templates: MappingTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onOpenNewRuleModal: () => void;
  onEditRule: (rule: FieldMappingRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onProceedToStep3: () => void;
  onOpenNewSpecModal?: () => void;
  onDeleteSpec?: (id: string) => void;
}

export const Step2RulesView: React.FC<Step2RulesViewProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onOpenNewRuleModal,
  onEditRule,
  onDeleteRule,
  onProceedToStep3,
  onOpenNewSpecModal,
  onDeleteSpec
}) => {
  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 2: Field Rules & Types</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Specify data types and regex validation rules for each field in your mapping group.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewSpecModal && (
            <button
              onClick={onOpenNewSpecModal}
              className="bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>+ New Spec / Group</span>
            </button>
          )}

          <button
            onClick={onOpenNewRuleModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add Rule</span>
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 items-stretch">
        {templates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer shrink-0 min-w-[240px] max-w-[280px] bg-white flex flex-col justify-between group ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate" title={tpl.name}>
                    {tpl.name}
                  </div>
                  <div className="text-[11px] text-indigo-600 font-mono mt-0.5 truncate">
                    Target: {tpl.targetTable}
                  </div>
                </div>
                {onDeleteSpec && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSpec(tpl.id);
                    }}
                    title={`Delete "${tpl.name}" specification`}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                <span>{tpl.mappings.length} field rules</span>
                {isSelected && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {onOpenNewSpecModal && (
          <button
            type="button"
            onClick={onOpenNewSpecModal}
            className="px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer shrink-0 min-w-[200px] flex flex-col items-center justify-center gap-1.5 bg-white/50"
          >
            <Plus className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold">+ New Spec / Group</span>
          </button>
        )}
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <p className="text-xs font-bold text-slate-500">No Endpoint Specs Available</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">Create a new specification to define field rules, or enable mock data in Settings to see demo templates.</p>
          {onOpenNewSpecModal && (
            <button onClick={onOpenNewSpecModal} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /><span>Create First Spec</span>
            </button>
          )}
        </div>
      ) : (
      <>
      {/* Rules Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Field Rules & Constraints</h4>
            {currentTemplate && (
              <span className="font-semibold text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                {currentTemplate.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onDeleteSpec && currentTemplate && (
              <button
                type="button"
                onClick={() => onDeleteSpec(currentTemplate.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={`Delete specification "${currentTemplate.name}"`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Spec</span>
              </button>
            )}
            <button
              onClick={onProceedToStep3}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Next: Endpoint Specs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Field Path</th>
                <th className="px-6 py-3">Target Column</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Nullable</th>
                <th className="px-6 py-3">Rule / Regex</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {currentTemplate?.mappings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900">{m.couchField}</td>
                  <td className="px-6 py-4 font-mono text-indigo-600">{m.mysqlColumn}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">{m.dataType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.nullable ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {m.nullable ? 'NULLABLE' : 'NOT NULL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{m.transformRule || '---'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onEditRule(m)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer" title="Edit Rule">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDeleteRule(m.id)} className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer" title="Delete Rule">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
