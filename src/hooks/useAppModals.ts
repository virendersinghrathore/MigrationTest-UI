import { useState } from 'react';
import { CouchPayload, FieldMappingRule, ValidationRuleItem, DataType, MigrationProfile } from '../types';

export function useAppModals() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MigrationProfile | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [editingPayload, setEditingPayload] = useState<CouchPayload | null>(null);
  const [isFieldRuleModalOpen, setIsFieldRuleModalOpen] = useState(false);
  const [editingFieldRule, setEditingFieldRule] = useState<FieldMappingRule | null>(null);
  const [defaultCouchField, setDefaultCouchField] = useState('');
  const [defaultDataType, setDefaultDataType] = useState<DataType>('VARCHAR');
  const [isValidationRuleModalOpen, setIsValidationRuleModalOpen] = useState(false);
  const [editingValidationRule, setEditingValidationRule] = useState<ValidationRuleItem | null>(null);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [specModalPayloadId, setSpecModalPayloadId] = useState<string | undefined>(undefined);
  const [specModalCloneId, setSpecModalCloneId] = useState<string | undefined>(undefined);

  return {
    isProfileModalOpen, setIsProfileModalOpen, editingProfile, setEditingProfile,
    isImportModalOpen, setIsImportModalOpen, isPayloadModalOpen, setIsPayloadModalOpen,
    editingPayload, isFieldRuleModalOpen, setIsFieldRuleModalOpen, editingFieldRule,
    defaultCouchField, defaultDataType, isValidationRuleModalOpen, setIsValidationRuleModalOpen,
    editingValidationRule, isSpecModalOpen, setIsSpecModalOpen,
    specModalPayloadId, specModalCloneId,
    openNewSpec: (sourcePayloadId?: string, cloneTemplateId?: string) => {
      setSpecModalPayloadId(sourcePayloadId);
      setSpecModalCloneId(cloneTemplateId);
      setIsSpecModalOpen(true);
    },
    openAddRule: (path: string, type: string) => { setEditingFieldRule(null); setDefaultCouchField(path); setDefaultDataType(type === 'NUMBER' ? 'INT' : 'VARCHAR'); setIsFieldRuleModalOpen(true); },
    openEditRule: (r: FieldMappingRule) => { setEditingFieldRule(r); setDefaultCouchField(r.couchField); setDefaultDataType(r.dataType); setIsFieldRuleModalOpen(true); },
    openNewPayload: () => { setEditingPayload(null); setIsPayloadModalOpen(true); },
    openEditPayload: (p: CouchPayload) => { setEditingPayload(p); setIsPayloadModalOpen(true); },
    openNewValidationRule: () => { setEditingValidationRule(null); setIsValidationRuleModalOpen(true); },
    openEditValidationRule: (r: ValidationRuleItem) => { setEditingValidationRule(r); setIsValidationRuleModalOpen(true); },
    openNewProfile: () => { setEditingProfile(null); setIsProfileModalOpen(true); },
    openEditProfile: (p: MigrationProfile) => { setEditingProfile(p); setIsProfileModalOpen(true); }
  };
}
