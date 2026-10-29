import React from 'react';
import { Zap } from 'lucide-react';
import { TabType } from '../../types';

interface HeaderProps {
  activeTab: TabType;
  onRunAllTests: () => void;
}

const TAB_TITLES: Record<TabType, string> = {
  dashboard: 'Dashboard',
  step1_store: 'Step 1: Stored Payloads',
  step2_rules: 'Step 2: Field Rules & Types',
  transforms: 'Validation Rules Library',
  step3_specs: 'Step 3: Endpoint Specs',
  step4_test: 'Step 4: Test & Compare',
  history: 'Run History & Results',
  settings: 'Application Settings'
};

export const Header: React.FC<HeaderProps> = ({ activeTab, onRunAllTests }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <h2 className="text-base font-bold text-slate-900">
          {TAB_TITLES[activeTab]}
        </h2>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRunAllTests}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Zap className="h-4 w-4 fill-current" />
          <span>Run All Tests</span>
        </button>
      </div>
    </header>
  );
};
