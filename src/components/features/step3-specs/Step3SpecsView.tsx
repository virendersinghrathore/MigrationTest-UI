import React from 'react';
import { Plus, Trash2, ArrowRight, Copy, FileSpreadsheet } from 'lucide-react';
import { MappingTemplate } from '../../../types';

interface Step3SpecsViewProps {
  templates: MappingTemplate[];
  onOpenNewSpecModal: () => void;
  onDeleteSpec: (id: string) => void;
  onSelectSpecAndTest: (id: string) => void;
  onCloneSpec?: (templateId: string) => void;
}

export const Step3SpecsView: React.FC<Step3SpecsViewProps> = ({
  templates,
  onOpenNewSpecModal,
  onDeleteSpec,
  onSelectSpecAndTest,
  onCloneSpec
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 3: Endpoint Specs & Mapping Groups</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Saved specifications bundled with field rules and types, ready for testing against new APIs.
          </p>
        </div>

        <button
          onClick={onOpenNewSpecModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Spec / Group</span>
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No Endpoint Specs Created Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first specification group by extracting fields from a stored payload or starting from scratch.
            </p>
          </div>
          <button
            onClick={onOpenNewSpecModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Spec</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={tpl.name}>{tpl.name}</h4>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => (onCloneSpec ? onCloneSpec(tpl.id) : onOpenNewSpecModal())}
                      className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                      title="Duplicate / Clone Spec"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSpec(tpl.id)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                      title="Delete Spec"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Target Table:</span>
                  <span className="font-bold text-indigo-600">{tpl.targetTable}</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Fields Mapped:</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                      {tpl.mappings.length} rules
                    </span>
                  </div>

                  {tpl.mappings.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tpl.mappings.slice(0, 4).map((m) => (
                        <span key={m.id} className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md truncate max-w-[140px]">
                          {m.couchField}
                        </span>
                      ))}
                      {tpl.mappings.length > 4 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                          +{tpl.mappings.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onSelectSpecAndTest(tpl.id)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <span>Test This Spec</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
