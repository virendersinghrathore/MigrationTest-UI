import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MigrationProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string, description: string) => void;
  onUpdateProfile: (id: string, name: string, description: string) => void;
  editingProfile: MigrationProfile | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onCreateProfile, onUpdateProfile, editingProfile }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (editingProfile) { setName(editingProfile.name); setDesc(editingProfile.description); }
    else { setName(''); setDesc(''); }
  }, [editingProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingProfile) onUpdateProfile(editingProfile.id, name.trim(), desc.trim());
    else onCreateProfile(name.trim(), desc.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-7 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{editingProfile ? 'Edit Profile' : 'New Profile'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Profile Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Staging EU" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-hidden" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Description (Optional)</label>
            <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Testing environment" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-hidden" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> {editingProfile ? 'Update Changes' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
