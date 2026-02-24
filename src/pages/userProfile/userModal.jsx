import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// ─── Shared Input Style ───────────────────────────────────────────────────────
const inputClass = "w-full bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-yellow/70 focus:bg-white transition-colors";

// ─── Edit Username Modal ──────────────────────────────────────────────────────
const UserModal = ({ isOpen, currentUsername, onClose, onSave }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) { setValue(currentUsername); setError(''); }
  }, [isOpen, currentUsername]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!value.trim()) { setError('Username cannot be empty.'); return; }
    onSave(value.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-dark">
          <h2 className="text-white font-bold text-base">Edit Username</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              New Username
            </label>
            <input
              type="text"
              value={value}
              onChange={e => { setValue(e.target.value); setError(''); }}
              placeholder="Enter new username"
              className={inputClass}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-yellow hover:bg-yellow-400 rounded-lg transition-colors">
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserModal;