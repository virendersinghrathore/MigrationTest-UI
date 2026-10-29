import React from 'react';
import { Plus } from 'lucide-react';
import { CouchPayload, MappingTemplate, FieldMappingRule } from '../../../types';
import { PayloadListView } from './PayloadListView';
import { PayloadDetailView } from './PayloadDetailView';

interface Step1StoreViewProps {
  payloads: CouchPayload[];
  selectedPayloadId: string;
  onSelectPayload: (id: string) => void;
  onOpenNewPayloadModal: () => void;
  onEditPayload: (p: CouchPayload) => void;
  onDeletePayload: (id: string) => void;
  currentTemplate?: MappingTemplate;
  onProceedToStep2: () => void;
  onAddNewRule: (fieldPath: string, detectedType: string) => void;
  onEditRule: (rule: FieldMappingRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onCreateSpecFromPayload?: (payloadId: string) => void;
}

export const Step1StoreView: React.FC<Step1StoreViewProps> = ({
  payloads,
  selectedPayloadId,
  onSelectPayload,
  onOpenNewPayloadModal,
  onEditPayload,
  onDeletePayload,
  currentTemplate,
  onProceedToStep2,
  onAddNewRule,
  onEditRule,
  onDeleteRule,
  onCreateSpecFromPayload
}) => {
  const selectedPayload = payloads.find((p) => p.id === selectedPayloadId) || payloads[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 1: Stored Payloads</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Store raw CouchDB API responses and configure validation rules directly per field.
          </p>
        </div>

        <button
          onClick={onOpenNewPayloadModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Payload</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PayloadListView
          payloads={payloads}
          selectedPayloadId={selectedPayloadId}
          onSelectPayload={onSelectPayload}
          onEditPayload={onEditPayload}
          onDeletePayload={onDeletePayload}
        />

        <div className="lg:col-span-2">
          <PayloadDetailView
            payload={selectedPayload}
            template={currentTemplate}
            onProceedToStep2={onProceedToStep2}
            onAddNewRule={onAddNewRule}
            onEditRule={onEditRule}
            onDeleteRule={onDeleteRule}
            onCreateSpecFromPayload={onCreateSpecFromPayload}
          />
        </div>
      </div>
    </div>
  );
};
