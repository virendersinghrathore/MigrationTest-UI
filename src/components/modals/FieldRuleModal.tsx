import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FieldMappingRule, DataType, ValidationRuleItem } from '../../types';

interface FieldRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRule: FieldMappingRule | null;
  defaultCouchField?: string;
  defaultDataType?: DataType;
  validationRules: ValidationRuleItem[];
  onSaveRule: (rule: FieldMappingRule) => void;
}

export const FieldRuleModal: React.FC<FieldRuleModalProps> = ({
  isOpen,
  onClose,
  editingRule,
  defaultCouchField = '',
  defaultDataType = 'VARCHAR',
  validationRules,
  onSaveRule
}) => {
  const [couchField, setCouchField] = useState(defaultCouchField);
  const [mysqlCol, setMysqlCol] = useState('');
  const [dataType, setDataType] = useState<DataType>(defaultDataType);
  const [nullable, setNullable] = useState(false);
  const [transformRule, setTransformRule] = useState('');

  useEffect(() => {
    if (editingRule) {
      setCouchField(editingRule.couchField);
      setMysqlCol(editingRule.mysqlColumn);
      setDataType(editingRule.dataType);
      setNullable(editingRule.nullable);
      setTransformRule(editingRule.transformRule || '');
    } else {
      setCouchField(defaultCouchField);
      setMysqlCol(defaultCouchField.replace(/\./g, '_') || 'column_name');
      setDataType(defaultDataType);
      setNullable(false);
      setTransformRule('');
    }
  }, [editingRule, defaultCouchField, defaultDataType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couchField.trim() || !mysqlCol.trim()) return;

    const rule: FieldMappingRule = {
      id: editingRule?.id || `m-${Date.now()}`,
      couchField: couchField.trim(),
      mysqlColumn: mysqlCol.trim(),
      dataType,
      nullable,
      transformRule: transformRule.trim()
    };
    onSaveRule(rule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">{editingRule ? 'Edit Field Rule' : 'Define Field Type & Rule'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">CouchDB Field Path</label>
              <input
                type="text"
                required
                value={couchField}
                onChange={(e) => setCouchField(e.target.value)}
                placeholder="e.g. profile.email"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">MySQL Column</label>
              <input
                type="text"
                required
                value={mysqlCol}
                onChange={(e) => setMysqlCol(e.target.value)}
                placeholder="e.g. email"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Data Type</label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as DataType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 cursor-pointer"
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="JSON">JSON</option>
                <option value="DATETIME">DATETIME</option>
                <option value="TEXT">TEXT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Validation Rule</label>
              <select
                value={transformRule}
                onChange={(e) => setTransformRule(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 cursor-pointer"
              >
                <option value="">-- None (No Rule) --</option>
                {validationRules.map((vr) => (
                  <option key={vr.id} value={vr.key}>
                    {vr.key} ({vr.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="nullableCheck"
              checked={nullable}
              onChange={(e) => setNullable(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="nullableCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
              Allow NULL in MySQL
            </label>
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
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
