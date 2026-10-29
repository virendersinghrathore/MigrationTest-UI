import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { FieldDiffStatus } from '../../../utils/payloadComparison';

interface StatusBadgeProps {
  status: FieldDiffStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'MATCH':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Match
        </span>
      );
    case 'TYPE_MISMATCH':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Type Mismatch
        </span>
      );
    case 'NULL_VIOLATION':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Null Violation
        </span>
      );
    case 'REGEX_FAILED':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Rule Failed
        </span>
      );
    case 'MISSING_IN_NEW':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Missing
        </span>
      );
    case 'EXTRA_IN_NEW':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
          Extra
        </span>
      );
    case 'VALUE_MISMATCH':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Value Differ
        </span>
      );
    default:
      return null;
  }
};
