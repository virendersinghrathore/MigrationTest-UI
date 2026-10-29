import React, { useState, useEffect } from 'react';
import { X, Bookmark, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SaveResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, notes: string) => void;
  defaultName: string;
  matchScore: number;
  matchedCount: number;
  totalFields: number;
  mismatchedCount: number;
  templateName: string;
  docTitle: string;
}

export const SaveResultModal: React.FC<SaveResultModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultName,
  matchScore,
  matchedCount,
  totalFields,
  mismatchedCount,
  templateName,
  docTitle
}) => {
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setNotes('');
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), notes.trim());
    onClose();
  };

  const isPerfect = matchScore === 100 && mismatchedCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base">Store Test & Comparison Result</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">{templateName}</span>
              <span className="text-slate-500 text-[11px]">Baseline: {docTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  isPerfect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPerfect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {matchScore}% Match
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                ({matchedCount}/{totalFields})
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Result Name / Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer API v2.1 Verification"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes or Review Observations <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details, e.g. Passed all email regex constraints; creditLimit coerced successfully..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Store Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
