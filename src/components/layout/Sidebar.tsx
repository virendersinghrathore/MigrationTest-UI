import React from 'react';
import {
  Database, UserPlus, LayoutDashboard, FileCode, Sliders, Terminal,
  FileSpreadsheet, GitCompare, ChevronRight, Upload, Download, Clock, Edit2
} from 'lucide-react';
import { MigrationProfile, TabType } from '../../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profiles: MigrationProfile[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  onOpenProfileModal: () => void;
  onOpenEditProfileModal: (p: MigrationProfile) => void;
  onOpenImportModal: () => void;
  payloadCount: number;
  successRate: number;
  onExportConfig: () => void;
  userName?: string;
  storageMode?: 'localstorage' | 'file';
}

const NAV_ITEMS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'step1_store', label: '1. Payloads', icon: FileCode },
  { id: 'step2_rules', label: '2. Field Rules', icon: Sliders },
  { id: 'transforms', label: 'Rules Library', icon: Terminal },
  { id: 'step3_specs', label: '3. Endpoint Specs', icon: FileSpreadsheet },
  { id: 'step4_test', label: '4. Test & Compare', icon: GitCompare },
  { id: 'history', label: 'Run History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Sliders }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, profiles, activeProfileId, setActiveProfileId,
  onOpenProfileModal, onOpenEditProfileModal, onOpenImportModal,
  payloadCount, successRate, onExportConfig,
  userName = 'Guest User', storageMode = 'localstorage'
}) => {
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 sticky top-0 h-screen shadow-xs">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white"><Database className="h-5 w-5" /></div>
          <div><h1 className="text-sm font-extrabold text-slate-900 tracking-tight">CouchToMySQL</h1><p className="text-[11px] text-slate-500 font-medium">Migration & Testing</p></div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Environment</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <select value={activeProfileId} onChange={(e) => setActiveProfileId(e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer shadow-xs">
                {profiles.map((prof) => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
              </select>
              <button onClick={onOpenProfileModal} title="New Profile" className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-600 border border-slate-300 transition-all cursor-pointer shadow-xs shrink-0"><UserPlus className="h-4 w-4" /></button>
            </div>
            {activeProfile && (
              <button onClick={() => onOpenEditProfileModal(activeProfile)} className="flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-2xs cursor-pointer transition-all">
                <Edit2 className="w-3 h-3" /> Edit Profile Name
              </button>
            )}
          </div>
        </div>

        <div className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Steps</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <div className="flex items-center space-x-2.5"><Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} /><span>{item.label}</span></div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1"><span>Endpoints</span><span className="font-bold text-slate-800">{payloadCount}</span></div>
        <div className="flex items-center justify-between text-xs text-slate-500 px-1"><span>Passing</span><span className="font-bold text-emerald-600">{successRate}%</span></div>
        <div className="pt-1 flex items-center space-x-2">
          <button onClick={onOpenImportModal} className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"><Upload className="h-3.5 w-3.5 text-slate-500" /><span>Import</span></button>
          <button onClick={onExportConfig} className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"><Download className="h-3.5 w-3.5 text-slate-500" /><span>Export</span></button>
        </div>

        {/* User Identity Footer */}
        <div
          onClick={() => setActiveTab('settings')}
          className="pt-2 mt-1 border-t border-slate-200/70 flex items-center justify-between gap-2 px-1 py-1 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer group"
          title="Click to view/edit User Settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {(userName.trim() || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {userName.trim() || 'Guest User'}
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>{storageMode === 'file' ? 'File Sync' : 'Local Storage'}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors shrink-0"
            title="Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
