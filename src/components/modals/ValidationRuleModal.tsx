import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ValidationRuleItem } from '../../types';

interface ValidationRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRule: ValidationRuleItem | null;
  onSaveRule: (rule: ValidationRuleItem) => void;
}

export const ValidationRuleModal: React.FC<ValidationRuleModalProps> = ({
  isOpen,
  onClose,
  editingRule,
  onSaveRule
}) => {
  const [key, setKey] = useState('');
  const [desc, setDesc] = useState('');
  const [regexPattern, setRegexPattern] = useState('');

  useEffect(() => {
    if (editingRule) {
      setKey(editingRule.key);
      setDesc(editingRule.desc);
      setRegexPattern(editingRule.regexPattern || '');
    } else {
      setKey('');
      setDesc('');
      setRegexPattern('');
    }
  }, [editingRule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !desc.trim()) return;

    const rule: ValidationRuleItem = {
      id: editingRule?.id || `vr-${Date.now()}`,
      key: key.trim(),
      desc: desc.trim(),
      regexPattern: regexPattern.trim()
    };
    onSaveRule(rule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            {editingRule ? 'Edit Validation Rule Direct' : 'Add Validation Rule'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Rule Name / Keyword</label>
            <input
              type="text"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. phone, uuid, postal_code"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Validation Description</label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Validates 10-digit mobile number format"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Regex Pattern (Optional)</label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="e.g. ^\+?[1-9]\d{1,14}$"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">Leave empty if validation uses standard sanitization or type logic.</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer"
            >
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
