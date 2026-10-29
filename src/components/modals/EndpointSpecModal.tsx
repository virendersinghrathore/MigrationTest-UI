import React, { useState, useEffect } from 'react';
import { X, Layers, Save, Copy, FileText, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { CouchPayload, DataType, FieldGroup, FieldMappingRule, MappingTemplate } from '../../types';
import { generateFieldRulesFromPayload, camelToSnake } from '../../utils/fieldMappingHelper';

interface SelectableFieldRule extends FieldMappingRule {
  selected: boolean;
}

interface EndpointSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSpec: (tpl: MappingTemplate) => void;
  payloads?: CouchPayload[];
  templates?: MappingTemplate[];
  fieldGroups?: FieldGroup[];
  initialSourcePayloadId?: string;
  initialCloneTemplateId?: string;
}

const DATA_TYPES: DataType[] = [
  'VARCHAR',
  'INT',
  'BIGINT',
  'DECIMAL',
  'BOOLEAN',
  'JSON',
  'DATETIME',
  'TEXT',
  'ENUM'
];

export const EndpointSpecModal: React.FC<EndpointSpecModalProps> = ({
  isOpen,
  onClose,
  onSaveSpec,
  payloads = [],
  templates = [],
  fieldGroups = [],
  initialSourcePayloadId,
  initialCloneTemplateId
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [targetTable, setTargetTable] = useState('mysql_records');
  const [sourceMode, setSourceMode] = useState<'payload' | 'clone' | 'blank'>('payload');
  const [selectedPayloadId, setSelectedPayloadId] = useState('');
  const [selectedCloneTemplateId, setSelectedCloneTemplateId] = useState('');
  const [mappings, setMappings] = useState<SelectableFieldRule[]>([]);

  // Initialize source selection when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialCloneTemplateId) {
      setSourceMode('clone');
      setSelectedCloneTemplateId(initialCloneTemplateId);
      loadFromTemplate(initialCloneTemplateId);
    } else if (initialSourcePayloadId) {
      setSourceMode('payload');
      setSelectedPayloadId(initialSourcePayloadId);
      loadFromPayload(initialSourcePayloadId);
    } else if (payloads.length > 0) {
      setSourceMode('payload');
      const defaultId = payloads[0].id;
      setSelectedPayloadId(defaultId);
      loadFromPayload(defaultId);
    } else if (templates.length > 0) {
      setSourceMode('clone');
      const defaultId = templates[0].id;
      setSelectedCloneTemplateId(defaultId);
      loadFromTemplate(defaultId);
    } else {
      setSourceMode('blank');
      setName('New Endpoint Spec');
      setDesc('Defines mapping rules for CouchDB documents to MySQL');
      setTargetTable('mysql_records');
      setMappings([]);
    }
  }, [isOpen, initialSourcePayloadId, initialCloneTemplateId]);

  const loadFromPayload = (payloadId: string) => {
    const p = payloads.find((x) => x.id === payloadId);
    if (!p) return;

    const generated = generateFieldRulesFromPayload(p.payload, fieldGroups);
    setMappings(generated.map((r) => ({ ...r, selected: true })));

    setName(`${p.title} Mapping`);
    setDesc(`Maps CouchDB ${p.title} fields to MySQL`);
    const cleanWord = p.title.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/)[0].toLowerCase();
    setTargetTable(`mysql_${cleanWord || 'records'}`);
  };

  const loadFromTemplate = (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (!t) return;

    setMappings(
      t.mappings.map((r) => ({
        ...r,
        id: `m-clone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        selected: true
      }))
    );

    setName(`${t.name} (Copy)`);
    setDesc(`Cloned from ${t.name}: ${t.description}`);
    setTargetTable(t.targetTable || 'mysql_records');
  };

  if (!isOpen) return null;

  const handleSourceModeChange = (mode: 'payload' | 'clone' | 'blank') => {
    setSourceMode(mode);
    if (mode === 'payload' && payloads.length > 0) {
      const pid = selectedPayloadId || payloads[0].id;
      setSelectedPayloadId(pid);
      loadFromPayload(pid);
    } else if (mode === 'clone' && templates.length > 0) {
      const tid = selectedCloneTemplateId || templates[0].id;
      setSelectedCloneTemplateId(tid);
      loadFromTemplate(tid);
    } else if (mode === 'blank') {
      setName('');
      setDesc('');
      setTargetTable('mysql_records');
      setMappings([]);
    }
  };

  const handleToggleSelectAll = () => {
    const anyUnselected = mappings.some((m) => !m.selected);
    setMappings((prev) => prev.map((m) => ({ ...m, selected: anyUnselected })));
  };

  const handleToggleRule = (id: string) => {
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  };

  const handleUpdateRule = (id: string, updates: Partial<SelectableFieldRule>) => {
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleAddCustomField = () => {
    const newRule: SelectableFieldRule = {
      id: `m-custom-${Date.now()}`,
      couchField: 'newField',
      mysqlColumn: 'new_field',
      dataType: 'VARCHAR',
      nullable: true,
      selected: true,
      description: 'Custom added field'
    };
    setMappings((prev) => [...prev, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    const target = mappings.find((m) => m.id === id);
    const fieldName = target?.couchField ? `field "${target.couchField}"` : 'this field rule';
    if (!window.confirm(`Are you sure you want to remove ${fieldName} from this specification?`)) return;
    setMappings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedRules: FieldMappingRule[] = mappings
      .filter((m) => m.selected && m.couchField.trim())
      .map(({ selected, ...rule }) => ({
        ...rule,
        mysqlColumn: rule.mysqlColumn.trim() || camelToSnake(rule.couchField.split('.').pop() || 'col')
      }));

    const newTpl: MappingTemplate = {
      id: `tpl-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || `Schema mapping for ${targetTable.trim()}`,
      targetTable: targetTable.trim() || 'mysql_records',
      mappings: selectedRules,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveSpec(newTpl);
    onClose();
  };

  const selectedCount = mappings.filter((m) => m.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Create Endpoint Spec & Field Group</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Define a new endpoint specification like &ldquo;E-Commerce Order Mapping&rdquo; using existing payload fields or cloned specs.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Specification / Group Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. E-Commerce Order Mapping or Customer Profile Spec"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target MySQL Table *
              </label>
              <input
                type="text"
                required
                value={targetTable}
                onChange={(e) => setTargetTable(e.target.value)}
                placeholder="e.g. mysql_orders or mysql_customers"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Maps CouchDB order document to MySQL schema"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Source Selector Section */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Field Mapping Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSourceModeChange('payload')}
                className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  sourceMode === 'payload'
                    ? 'bg-white border-indigo-600 text-indigo-700 shadow-xs ring-2 ring-indigo-600/10'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate">From Stored Payload</div>
                  <div className="text-[10px] text-slate-400 font-normal">Auto-detect JSON keys</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSourceModeChange('clone')}
                className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  sourceMode === 'clone'
                    ? 'bg-white border-indigo-600 text-indigo-700 shadow-xs ring-2 ring-indigo-600/10'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Copy className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate">Clone Existing Spec</div>
                  <div className="text-[10px] text-slate-400 font-normal">Copy existing rules</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSourceModeChange('blank')}
                className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  sourceMode === 'blank'
                    ? 'bg-white border-indigo-600 text-indigo-700 shadow-xs ring-2 ring-indigo-600/10'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate">Start Blank</div>
                  <div className="text-[10px] text-slate-400 font-normal">Add fields manually</div>
                </div>
              </button>
            </div>

            {/* Source dropdowns */}
            {sourceMode === 'payload' && payloads.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Choose Stored Payload to Extract Fields From:
                </label>
                <select
                  value={selectedPayloadId}
                  onChange={(e) => {
                    setSelectedPayloadId(e.target.value);
                    loadFromPayload(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600 cursor-pointer shadow-2xs"
                >
                  {payloads.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.endpoint})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {sourceMode === 'clone' && templates.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Choose Spec to Clone:
                </label>
                <select
                  value={selectedCloneTemplateId}
                  onChange={(e) => {
                    setSelectedCloneTemplateId(e.target.value);
                    loadFromTemplate(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600 cursor-pointer shadow-2xs"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.mappings.length} rules)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Field Mappings Selection Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Field Mappings in this Group
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                  {selectedCount} of {mappings.length} Selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                {mappings.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {mappings.every((m) => m.selected) ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    <span>{mappings.every((m) => m.selected) ? 'Deselect All' : 'Select All'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Field</span>
                </button>
              </div>
            </div>

            {mappings.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <p>No fields in this group yet.</p>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Click here to add your first field rule
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2.5 w-10 text-center">Use</th>
                        <th className="px-4 py-2.5">CouchDB Field</th>
                        <th className="px-4 py-2.5">MySQL Target Column</th>
                        <th className="px-3 py-2.5 w-32">Data Type</th>
                        <th className="px-3 py-2.5 w-20 text-center">Nullable</th>
                        <th className="px-3 py-2.5 w-10 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {mappings.map((m) => (
                        <tr key={m.id} className={`hover:bg-slate-50/70 transition-colors ${m.selected ? 'bg-white' : 'bg-slate-50/40 opacity-60'}`}>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={m.selected}
                              onChange={() => handleToggleRule(m.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={m.couchField}
                              onChange={(e) => handleUpdateRule(m.id, { couchField: e.target.value })}
                              className="w-full bg-transparent font-mono text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden py-1"
                              placeholder="e.g. orderTotal"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={m.mysqlColumn}
                              onChange={(e) => handleUpdateRule(m.id, { mysqlColumn: e.target.value })}
                              className="w-full bg-transparent font-mono text-xs text-indigo-600 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden py-1"
                              placeholder="e.g. total_amount"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={m.dataType}
                              onChange={(e) => handleUpdateRule(m.id, { dataType: e.target.value as DataType })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-700 focus:outline-hidden focus:border-indigo-600 cursor-pointer"
                            >
                              {DATA_TYPES.map((dt) => (
                                <option key={dt} value={dt}>
                                  {dt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleUpdateRule(m.id, { nullable: !m.nullable })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                m.nullable ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {m.nullable ? 'YES' : 'NO'}
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                              title="Remove field"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {selectedCount > 0 ? (
                <span>Will create spec with <strong>{selectedCount}</strong> field rules.</span>
              ) : (
                <span className="text-amber-600 font-medium">Select at least one field, or add custom fields.</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Specification & Group ({selectedCount})</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
