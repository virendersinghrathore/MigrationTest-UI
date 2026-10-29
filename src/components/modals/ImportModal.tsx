import React, { useState } from 'react';
import { X, Upload, FileJson, History, CheckCircle2 } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProfile: (name: string, data: any) => void;
  onImportHistory: (data: any[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportProfile, onImportHistory }) => {
  const [type, setFilterType] = useState<'PROFILE' | 'HISTORY'>('PROFILE');
  const [customName, setCustomName] = useState('');
  const [fileData, setFileData] = useState<any>(null);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setFileData(json);
        if (type === 'PROFILE' && json.profile) setCustomName(json.profile);
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!fileData) return;
    if (type === 'PROFILE') {
      onImportProfile(customName || 'Imported Profile', fileData);
    } else {
      onImportHistory(fileData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-7 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Import Data</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setFilterType('PROFILE')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${type === 'PROFILE' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}><FileJson className="w-4 h-4" />Profile</button>
          <button onClick={() => setFilterType('HISTORY')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${type === 'HISTORY' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}><History className="w-4 h-4" />History</button>
        </div>

        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-3 ${fileData ? 'text-emerald-500' : 'text-slate-400'}`} />
              <p className="text-xs font-bold text-slate-600">{fileName || 'Choose JSON file'}</p>
            </div>
            <input type="file" className="hidden" accept=".json" onChange={handleFileChange} />
          </label>

          {type === 'PROFILE' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Profile Display Name</label>
              <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter a name for this profile" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-hidden" />
            </div>
          )}
        </div>

        <button onClick={handleImport} disabled={!fileData} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
          <CheckCircle2 className="w-4 h-4" /> Confirm Import
        </button>
      </div>
    </div>
  );
};
