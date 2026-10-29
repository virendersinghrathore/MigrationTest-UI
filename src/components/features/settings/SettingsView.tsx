import React, { useState } from 'react';
import { User, HardDrive, FileJson, Save, CheckCircle2, Info, FlaskConical, EyeOff, Eye } from 'lucide-react';
import { AppSettings } from '../../../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn pb-12">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Application Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Configure your user profile and preferred data storage engine.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Identity Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><User className="w-5 h-5 text-indigo-600" /></div>
            <h4 className="font-bold text-slate-800 text-sm">User Identity</h4>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
              placeholder="e.g. John Doe"
              required
            />
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5"><Info className="w-3 h-3" /> This name will be attached to all data you store in history.</p>
          </div>
        </div>

        {/* Storage Mode Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><HardDrive className="w-5 h-5 text-emerald-600" /></div>
            <h4 className="font-bold text-slate-800 text-sm">Storage Engine</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, storageMode: 'localstorage' })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.storageMode === 'localstorage' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <HardDrive className={`w-6 h-6 ${formData.storageMode === 'localstorage' ? 'text-indigo-600' : 'text-slate-400'}`} />
                {formData.storageMode === 'localstorage' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-sm">Local Storage</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight text-balance">Data stays in your browser's private database. Simple and fast.</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, storageMode: 'file' })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.storageMode === 'file' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className={`w-6 h-6 ${formData.storageMode === 'file' ? 'text-indigo-600' : 'text-slate-400'}`} />
                {formData.storageMode === 'file' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-sm">File System</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight text-balance">Data is synced to JSON files on the server. Persistent across machines.</div>
            </button>
          </div>
        </div>

        {/* Mock & Sample Data Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><FlaskConical className="w-5 h-5 text-amber-600" /></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Mock & Sample Data</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Control visibility of built-in demo records across the entire workspace.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showMockData: false })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${!formData.showMockData ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <EyeOff className={`w-6 h-6 ${!formData.showMockData ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!formData.showMockData && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-sm">Clean Workspace</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight text-balance">Hide all built-in mock data. Only your own records will be visible and exported.</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, showMockData: true })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.showMockData ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Eye className={`w-6 h-6 ${formData.showMockData ? 'text-indigo-600' : 'text-slate-400'}`} />
                {formData.showMockData && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="font-bold text-slate-900 text-sm">Show Default Mock Data</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight text-balance">Display built-in sample payloads, templates, and test runs for reference and learning.</div>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><Info className="w-3 h-3" /> When hidden, mock data is excluded from all views, dashboard counts, and exported files.</p>
        </div>

        <button
          type="submit"
          disabled={saved}
          className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'}`}
        >
          {saved ? <><CheckCircle2 className="w-5 h-5" /> Settings Saved</> : <><Save className="w-5 h-5" /> Update Configuration</>}
        </button>
      </form>
    </div>
  );
};
