import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { ValidationRuleItem } from '../../../types';

interface ValidationLibraryViewProps {
  validationRules: ValidationRuleItem[];
  onOpenNewRuleModal: () => void;
  onApplyRule: (key: string) => void;
  onEditDirect: (rule: ValidationRuleItem) => void;
  onDeleteRule: (id: string) => void;
}

export const ValidationLibraryView: React.FC<ValidationLibraryViewProps> = ({
  validationRules,
  onOpenNewRuleModal,
  onApplyRule,
  onEditDirect,
  onDeleteRule
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Validation Rules Library</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-configured and custom regex rules for field data validation.
          </p>
        </div>
        <button
          onClick={onOpenNewRuleModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Rule</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Rule Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Regex Pattern</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {validationRules.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">{item.key}</td>
                <td className="px-6 py-4 text-slate-600">{item.desc}</td>
                <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                  {item.regexPattern ? (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                      {item.regexPattern}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Built-in format</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onApplyRule(item.key)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => onEditDirect(item)}
                      title="Edit Rule"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteRule(item.id)}
                      title="Delete Rule"
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
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
  );
};
