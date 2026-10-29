import React, { useState } from 'react';
import { TabType } from './types';
import { SavedTestRun } from './types/savedResults';
import { useMigrationData } from './hooks/useMigrationData';
import { useSavedResults } from './hooks/useSavedResults';
import { useAppModals } from './hooks/useAppModals';
import { useAppSettings } from './hooks/useAppSettings';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/features/dashboard/DashboardView';
import { Step1StoreView } from './components/features/step1-store/Step1StoreView';
import { Step2RulesView } from './components/features/step2-rules/Step2RulesView';
import { ValidationLibraryView } from './components/features/rules-library/ValidationLibraryView';
import { Step3SpecsView } from './components/features/step3-specs/Step3SpecsView';
import { Step4TestView } from './components/features/step4-test/Step4TestView';
import { HistoryView } from './components/features/history/HistoryView';
import { SettingsView } from './components/features/settings/SettingsView';
import { AppModals } from './components/modals/AppModals';
import { exportToJsonFile } from './utils/jsonHelper';

const DEFAULT_JSON = '{\n  "_id": "cust_99281",\n  "profile": {\n    "firstName": "Eleanor",\n    "lastName": "Vance",\n    "email": "eleanor.vance@enterprise.io"\n  },\n  "account": {\n    "creditLimit": 15000.00,\n    "isActive": true\n  }\n}';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('step1_store');
  const [selectedPayloadId, setSelectedPayloadId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [newApiTestPayload, setNewApiTestPayload] = useState(DEFAULT_JSON);

  const { settings, updateSettings } = useAppSettings();
  const modals = useAppModals();
  const data = useMigrationData(settings);
  const { savedRuns, removeResult, refresh: refreshSavedRuns } = useSavedResults(data.activeProfileId, settings.userName);

  // Fallback: if selected ID is not in visible list, pick the first visible one
  const currentPayloadId = (selectedPayloadId && data.payloads.some(p => p.id === selectedPayloadId))
    ? selectedPayloadId
    : (data.payloads[0]?.id || '');
  const currentTemplateId = (selectedTemplateId && data.templates.some(t => t.id === selectedTemplateId))
    ? selectedTemplateId
    : (data.templates[0]?.id || '');
  const currentTemplate = data.templates.find(t => t.id === currentTemplateId) || data.templates[0];
  const successRate = data.testRuns.length > 0 ? Math.round(((data.testRuns.length - data.testRuns.filter(r => r.status === 'FAILED').length) / data.testRuns.length) * 100) : 100;

  const handleSelectRun = (r: SavedTestRun) => { if (r.payloadId) setSelectedPayloadId(r.payloadId); if (r.templateId) setSelectedTemplateId(r.templateId); if (r.newApiPayloadStr) setNewApiTestPayload(r.newApiPayloadStr); setActiveTab('step4_test'); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-indigo-600 selection:text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profiles={data.profiles}
        activeProfileId={data.activeProfileId}
        setActiveProfileId={data.setActiveProfileId}
        onOpenProfileModal={modals.openNewProfile}
        onOpenEditProfileModal={modals.openEditProfile}
        onOpenImportModal={() => modals.setIsImportModalOpen(true)}
        payloadCount={data.payloads.length}
        successRate={successRate}
        onExportConfig={data.exportConfig}
        userName={settings.userName}
        storageMode={settings.storageMode}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header activeTab={activeTab} onRunAllTests={data.runAllTests} />
        <main className="px-6 py-6 lg:px-8 lg:py-7 w-full space-y-6">
          {activeTab === 'dashboard' && <DashboardView successRate={successRate} payloadCount={data.payloads.length} failuresCount={data.failures.length} templateCount={data.templates.length} onStartStep1={() => setActiveTab('step1_store')} />}
          {activeTab === 'step1_store' && <Step1StoreView payloads={data.payloads} selectedPayloadId={currentPayloadId} onSelectPayload={setSelectedPayloadId} onOpenNewPayloadModal={modals.openNewPayload} onEditPayload={modals.openEditPayload} onDeletePayload={data.deletePayload} currentTemplate={currentTemplate} onProceedToStep2={() => setActiveTab('step2_rules')} onAddNewRule={modals.openAddRule} onEditRule={modals.openEditRule} onDeleteRule={(rId) => currentTemplate && data.deleteMappingRule(currentTemplate.id, rId)} onCreateSpecFromPayload={(pId) => modals.openNewSpec(pId)} />}
          {activeTab === 'step2_rules' && <Step2RulesView templates={data.templates} selectedTemplateId={currentTemplateId} onSelectTemplate={setSelectedTemplateId} onOpenNewRuleModal={() => modals.openAddRule('', 'VARCHAR')} onEditRule={modals.openEditRule} onDeleteRule={(rId) => currentTemplate && data.deleteMappingRule(currentTemplate.id, rId)} onDeleteSpec={data.deleteTemplate} onProceedToStep3={() => setActiveTab('step3_specs')} onOpenNewSpecModal={() => modals.openNewSpec()} />}
          {activeTab === 'transforms' && <ValidationLibraryView validationRules={data.validationRules} onOpenNewRuleModal={modals.openNewValidationRule} onApplyRule={() => modals.openAddRule('', 'VARCHAR')} onEditDirect={modals.openEditValidationRule} onDeleteRule={data.deleteValidationRule} />}
          {activeTab === 'step3_specs' && <Step3SpecsView templates={data.templates} onOpenNewSpecModal={() => modals.openNewSpec()} onDeleteSpec={data.deleteTemplate} onSelectSpecAndTest={(id) => { setSelectedTemplateId(id); setActiveTab('step4_test'); }} onCloneSpec={(tplId) => modals.openNewSpec(undefined, tplId)} />}
          {activeTab === 'step4_test' && <Step4TestView payloads={data.payloads} selectedPayloadId={currentPayloadId} onSelectPayload={setSelectedPayloadId} templates={data.templates} selectedTemplateId={currentTemplateId} onSelectTemplate={setSelectedTemplateId} newApiTestPayload={newApiTestPayload} onChangeTestPayload={setNewApiTestPayload} onExecuteValidation={() => data.runValidation(currentPayloadId, currentTemplateId, newApiTestPayload)} testRuns={data.testRuns} activeProfileId={data.activeProfileId} onSavedRunsChanged={refreshSavedRuns} onViewHistory={() => setActiveTab('history')} userName={settings.userName} showMockData={settings.showMockData} />}
          {activeTab === 'history' && <HistoryView savedRuns={savedRuns} onRetrieveRun={handleSelectRun} onDeleteRun={removeResult} onExportAll={() => exportToJsonFile(`runs_${Date.now()}.json`, savedRuns)} />}
          {activeTab === 'settings' && <SettingsView settings={settings} onUpdateSettings={updateSettings} />}
        </main>
      </div>
      <AppModals
        isProfileModalOpen={modals.isProfileModalOpen}
        onCloseProfileModal={() => modals.setIsProfileModalOpen(false)}
        onCreateProfile={data.createProfile}
        onUpdateProfile={data.updateProfile}
        editingProfile={modals.editingProfile}
        isImportModalOpen={modals.isImportModalOpen}
        onCloseImportModal={() => modals.setIsImportModalOpen(false)}
        onImportProfile={data.importProfile}
        onImportHistory={data.importHistory}
        isPayloadModalOpen={modals.isPayloadModalOpen}
        onClosePayloadModal={() => modals.setIsPayloadModalOpen(false)}
        editingPayload={modals.editingPayload}
        onSavePayload={data.savePayload}
        isFieldRuleModalOpen={modals.isFieldRuleModalOpen}
        onCloseFieldRuleModal={() => modals.setIsFieldRuleModalOpen(false)}
        editingFieldRule={modals.editingFieldRule}
        defaultCouchField={modals.defaultCouchField}
        defaultDataType={modals.defaultDataType}
        validationRules={data.validationRules}
        onSaveFieldRule={(rule) => currentTemplate && data.saveMappingRule(currentTemplate.id, rule)}
        isValidationRuleModalOpen={modals.isValidationRuleModalOpen}
        onCloseValidationRuleModal={() => modals.setIsValidationRuleModalOpen(false)}
        editingValidationRule={modals.editingValidationRule}
        onSaveValidationRule={data.saveValidationRule}
        isSpecModalOpen={modals.isSpecModalOpen}
        onCloseSpecModal={() => modals.setIsSpecModalOpen(false)}
        onSaveSpec={(tpl) => {
          data.saveTemplate(tpl);
          setSelectedTemplateId(tpl.id);
        }}
        payloads={data.payloads}
        templates={data.templates}
        fieldGroups={data.fieldGroups}
        initialSourcePayloadId={modals.specModalPayloadId}
        initialCloneTemplateId={modals.specModalCloneId}
      />
    </div>
  );
}
