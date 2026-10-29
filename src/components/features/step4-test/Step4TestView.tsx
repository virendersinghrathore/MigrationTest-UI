import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, History } from 'lucide-react';
import { CouchPayload, MappingTemplate, TestRunResult } from '../../../types';
import { SavedTestRun } from '../../../types/savedResults';
import { safeJsonParse } from '../../../utils/jsonHelper';
import { comparePayloads } from '../../../utils/payloadComparison';
import { getSavedResults, saveResult } from '../../../utils/savedResultsStorage';
import { BaselinePayloadViewer } from './BaselinePayloadViewer';
import { NewApiPayloadEditor } from './NewApiPayloadEditor';
import { MatchSummaryCard } from './MatchSummaryCard';
import { FieldComparisonTable } from './FieldComparisonTable';
import { TestResultsLog } from './TestResultsLog';
import { SaveResultModal } from './SaveResultModal';
import { PASS_SAMPLE, FAIL_SAMPLE } from './samplePayloads';

interface Step4TestViewProps {
  payloads: CouchPayload[];
  selectedPayloadId: string;
  onSelectPayload: (id: string) => void;
  templates: MappingTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  newApiTestPayload: string;
  onChangeTestPayload: (val: string) => void;
  onExecuteValidation: () => void;
  testRuns: TestRunResult[];
  activeProfileId?: string;
  onSavedRunsChanged?: () => void;
  onViewHistory?: () => void;
  userName?: string;
  showMockData?: boolean;
}

export const Step4TestView: React.FC<Step4TestViewProps> = ({
  payloads,
  selectedPayloadId,
  onSelectPayload,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  newApiTestPayload,
  onChangeTestPayload,
  onExecuteValidation,
  testRuns,
  activeProfileId = 'default',
  onSavedRunsChanged,
  onViewHistory,
  userName = 'Guest User',
  showMockData = false
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [savedRuns, setSavedRuns] = useState<SavedTestRun[]>(() => getSavedResults(activeProfileId));

  useEffect(() => {
    setSavedRuns(getSavedResults(activeProfileId));
  }, [activeProfileId]);

  const selectedPayload = payloads.find((p) => p.id === selectedPayloadId) || payloads[0];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const latestRun = testRuns[0];
  const parsedNewPayload = useMemo(() => safeJsonParse(newApiTestPayload, null), [newApiTestPayload]);

  const report = useMemo(() => {
    return comparePayloads(selectedPayload?.payload, parsedNewPayload, selectedTemplate, latestRun?.failures || []);
  }, [selectedPayload?.payload, parsedNewPayload, selectedTemplate, latestRun]);

  const showBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 4000);
  };

  const handleSaveResult = (name: string, notes: string) => {
    const isPerfect = report.matchScore === 100 && report.mismatchedCount === 0;
    saveResult(activeProfileId, {
      name, notes, userName, payloadId: selectedPayload?.id || '', payloadTitle: selectedPayload?.title || 'Unknown Doc',
      templateId: selectedTemplate?.id || '', templateName: selectedTemplate?.name || 'Unknown Spec',
      baselinePayloadStr: JSON.stringify(selectedPayload?.payload || {}, null, 2), newApiPayloadStr: newApiTestPayload,
      matchScore: report.matchScore, status: isPerfect ? 'SUCCESS' : 'FAILED',
      totalFields: report.totalFields, matchedCount: report.matchedCount, mismatchedCount: report.mismatchedCount,
      missingCount: report.missingCount, extraCount: report.extraCount, report, testRun: latestRun
    });
    setSavedRuns(getSavedResults(activeProfileId));
    onSavedRunsChanged?.();
    showBanner(`Saved result "${name}" successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 4: Test & Compare</h3>
          <p className="text-xs text-slate-500 mt-0.5">Visible manual check & automated verification between CouchDB and New API.</p>
        </div>
        <button
          onClick={onViewHistory}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
        >
          <History className="w-4 h-4 text-indigo-600" />
          <span>History Log</span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">{savedRuns.length}</span>
        </button>
      </div>

      {banner && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>{banner}</span></div>
          <button onClick={() => setBanner(null)} className="text-indigo-400 hover:text-indigo-700 font-bold ml-2">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <BaselinePayloadViewer payloads={payloads} selectedPayload={selectedPayload} onSelectPayload={onSelectPayload} onSyncToNewApi={(jsonStr) => onChangeTestPayload(jsonStr)} />
        <NewApiPayloadEditor templates={templates} selectedTemplateId={selectedTemplateId} onSelectTemplate={onSelectTemplate} newApiTestPayload={newApiTestPayload} onChangeTestPayload={onChangeTestPayload} onExecuteValidation={onExecuteValidation} report={report} onLoadPassingSample={() => onChangeTestPayload(PASS_SAMPLE)} onLoadFailingSample={() => onChangeTestPayload(FAIL_SAMPLE)} showMockData={showMockData} />
      </div>

      <MatchSummaryCard report={report} latestRun={latestRun} onOpenSaveModal={() => setIsSaveModalOpen(true)} />
      <FieldComparisonTable report={report} />
      <div className="pt-2"><TestResultsLog testRuns={testRuns} /></div>

      <SaveResultModal
        isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSaveResult}
        defaultName={`${selectedTemplate?.name || 'Endpoint'} Test Run`}
        matchScore={report.matchScore} matchedCount={report.matchedCount} totalFields={report.totalFields} mismatchedCount={report.mismatchedCount}
        templateName={selectedTemplate?.name || 'Specification'} docTitle={selectedPayload?.title || 'Baseline Document'}
      />
    </div>
  );
};
