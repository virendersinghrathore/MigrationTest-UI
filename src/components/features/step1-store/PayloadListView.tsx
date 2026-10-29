import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { CouchPayload } from '../../../types';

interface PayloadListViewProps {
  payloads: CouchPayload[];
  selectedPayloadId: string;
  onSelectPayload: (id: string) => void;
  onEditPayload: (p: CouchPayload) => void;
  onDeletePayload: (id: string) => void;
}

export const PayloadListView: React.FC<PayloadListViewProps> = ({
  payloads,
  selectedPayloadId,
  onSelectPayload,
  onEditPayload,
  onDeletePayload
}) => {
  return (
    <div className="space-y-3">
      {payloads.length === 0 && (
        <div className="p-6 bg-white border border-dashed border-slate-300 rounded-2xl text-center">
          <p className="text-xs font-bold text-slate-500">No Payloads Available</p>
          <p className="text-[11px] text-slate-400 mt-1">Create a new payload to get started, or enable mock data in Settings.</p>
        </div>
      )}
      {payloads.map((p) => {
        const isSelected = selectedPayloadId === p.id;
        return (
          <div
            key={p.id}
            onClick={() => onSelectPayload(p.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                {p.method}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPayload(p);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Edit Payload"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePayload(p.id);
                  }}
                  className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Payload"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-2">{p.title}</h4>
            <p className="text-[11px] text-indigo-600 font-mono mt-0.5 truncate">{p.endpoint}</p>
          </div>
        );
      })}
    </div>
  );
};
