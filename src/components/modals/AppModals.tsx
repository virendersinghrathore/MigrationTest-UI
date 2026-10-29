import React from 'react';
import { CouchPayload, FieldMappingRule, ValidationRuleItem, DataType, MappingTemplate, MigrationProfile } from '../../types';
import { ProfileModal } from './ProfileModal';
import { PayloadModal } from './PayloadModal';
import { FieldRuleModal } from './FieldRuleModal';
import { ValidationRuleModal } from './ValidationRuleModal';
import { EndpointSpecModal } from './EndpointSpecModal';
import { ImportModal } from './ImportModal';

interface AppModalsProps {
  isProfileModalOpen: boolean;
  onCloseProfileModal: () => void;
  onCreateProfile: (name: string, description: string) => void;
  onUpdateProfile: (id: string, name: string, description: string) => void;
  editingProfile: MigrationProfile | null;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
  onImportProfile: (name: string, data: any) => void;
  onImportHistory: (data: any[]) => void;
  isPayloadModalOpen: boolean;
  onClosePayloadModal: () => void;
  editingPayload: CouchPayload | null;
  onSavePayload: (payload: CouchPayload) => void;
  isFieldRuleModalOpen: boolean;
  onCloseFieldRuleModal: () => void;
  editingFieldRule: FieldMappingRule | null;
  defaultCouchField: string;
  defaultDataType: DataType;
  validationRules: ValidationRuleItem[];
  onSaveFieldRule: (rule: FieldMappingRule) => void;
  isValidationRuleModalOpen: boolean;
  onCloseValidationRuleModal: () => void;
  editingValidationRule: ValidationRuleItem | null;
  onSaveValidationRule: (rule: ValidationRuleItem) => void;
  isSpecModalOpen: boolean;
  onCloseSpecModal: () => void;
  onSaveSpec: (tpl: MappingTemplate) => void;
  payloads?: CouchPayload[];
  templates?: MappingTemplate[];
  fieldGroups?: FieldGroup[];
  initialSourcePayloadId?: string;
  initialCloneTemplateId?: string;
}

export const AppModals: React.FC<AppModalsProps> = (props) => {
  return (
    <>
      <ProfileModal isOpen={props.isProfileModalOpen} onClose={props.onCloseProfileModal} onCreateProfile={props.onCreateProfile} onUpdateProfile={props.onUpdateProfile} editingProfile={props.editingProfile} />
      <ImportModal isOpen={props.isImportModalOpen} onClose={props.onCloseImportModal} onImportProfile={props.onImportProfile} onImportHistory={props.onImportHistory} />
      <PayloadModal isOpen={props.isPayloadModalOpen} onClose={props.onClosePayloadModal} editingPayload={props.editingPayload} onSavePayload={props.onSavePayload} />
      <FieldRuleModal isOpen={props.isFieldRuleModalOpen} onClose={props.onCloseFieldRuleModal} editingRule={props.editingFieldRule} defaultCouchField={props.defaultCouchField} defaultDataType={props.defaultDataType} validationRules={props.validationRules} onSaveRule={props.onSaveFieldRule} />
      <ValidationRuleModal isOpen={props.isValidationRuleModalOpen} onClose={props.onCloseValidationRuleModal} editingRule={props.editingValidationRule} onSaveRule={props.onSaveValidationRule} />
      <EndpointSpecModal
        isOpen={props.isSpecModalOpen}
        onClose={props.onCloseSpecModal}
        onSaveSpec={props.onSaveSpec}
        payloads={props.payloads}
        templates={props.templates}
        fieldGroups={props.fieldGroups}
        initialSourcePayloadId={props.initialSourcePayloadId}
        initialCloneTemplateId={props.initialCloneTemplateId}
      />
    </>
  );
};
