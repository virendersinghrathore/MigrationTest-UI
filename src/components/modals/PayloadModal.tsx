import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CouchPayload } from '../../types';

interface PayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPayload: CouchPayload | null;
  onSavePayload: (payload: CouchPayload) => void;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({
  isOpen,
  onClose,
  editingPayload,
  onSavePayload
}) => {
  const [endpoint, setEndpoint] = useState('/api/v1/resource');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [jsonText, setJsonText] = useState('{\n  "_id": "doc_123",\n  "title": "Sample Document",\n  "active": true\n}');

  useEffect(() => {
    if (editingPayload) {
      setEndpoint(editingPayload.endpoint);
      setTitle(editingPayload.title);
      setDesc(editingPayload.description);
      setJsonText(JSON.stringify(editingPayload.payload, null, 2));
    } else {
      setEndpoint('/api/v1/resource');
      setTitle('');
      setDesc('');
      setJsonText('{\n  "_id": "doc_123",\n  "title": "Sample Document",\n  "active": true\n}');
    }
  }, [editingPayload, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonText);
      const payloadObj: CouchPayload = {
        id: editingPayload?.id || `cp-${Date.now()}`,
        endpoint: endpoint.trim(),
        method: 'POST',
        title: title.trim() || 'Custom Payload',
        description: desc.trim(),
        createdAt: editingPayload?.createdAt || new Date().toISOString(),
        tags: editingPayload?.tags || ['Custom'],
        payload: parsedJson
      };
      onSavePayload(payloadObj);
      onClose();
    } catch {
      alert('Invalid JSON format in payload editor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            {editingPayload ? 'Edit CouchDB Payload' : 'Store CouchDB Payload'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Customer Record"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">API Endpoint</label>
              <input
                type="text"
                required
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="e.g. /api/v1/customers"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Description (Optional)</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Payload containing user profile and account details"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">CouchDB JSON Payload</label>
            <textarea
              rows={8}
              required
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl focus:outline-none"
            />
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
              Save Payload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
