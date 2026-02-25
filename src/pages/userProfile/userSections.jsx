import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CircleUser, Pencil, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  COMPANY_SIZES,
  INDUSTRIES,
  validatePassword,
  validateTinNumber,
} from './userHelpers.jsx';
import { uploadAvatar, uploadPermit } from '../../api/profile.js';

const inputClass    = "w-full bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-yellow/70 focus:bg-white transition-colors";
const inputErrClass = "w-full bg-gray-100 border border-red-400 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-400 transition-colors";
const sectionClass  = "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden";
const sectionHeader = "bg-brand-dark px-6 py-3.5";
const sectionBody   = "px-6 py-5";
const labelClass    = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const btnYellow     = "bg-brand-yellow text-brand-dark text-sm font-semibold px-5 py-2 rounded-lg hover:bg-yellow-400 transition-colors";

const PasswordInput = ({ value, onChange, show, onToggle, placeholder }) => (
  <div className="relative">
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} pr-10`}
    />
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
);

export const ProfileTopSection = ({ profile, onAvatarChange, onEditProfile, userId }) => {
  const fileRef    = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadAvatar(file);
      if (res.success) {
        onAvatarChange(res.data.avatar_url);
      } else {
        setError(res.message || 'Avatar upload failed.');
      }
    } catch {
      setError('Network error uploading avatar.');
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = profile.avatar_url
    ? (profile.avatar_url.startsWith('http')
        ? profile.avatar_url
        : `http://192.168.8.157:3000${profile.avatar_url}`)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

      {/* Profile Picture */}
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Profile Picture</h2>
        </div>
        <div className={`${sectionBody} flex items-center gap-5`}>
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border-2 border-gray-300">
            {avatarSrc
              ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              : <CircleUser size={48} className="text-gray-400" strokeWidth={1.2} />
            }
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button onClick={() => fileRef.current.click()} className={btnYellow} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Choose File'}
            </button>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      </div>

      {/* Account & Profile */}
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Account & Profile</h2>
        </div>
        <div className={sectionBody}>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-28 shrink-0">Full Name:</span>
            <span className="text-sm font-semibold text-gray-800 flex-1">{profile.full_name || '—'}</span>
            <button onClick={onEditProfile} className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors">
              <Pencil size={15} />
            </button>
          </div>
          <div className="flex items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-28 shrink-0">Email:</span>
            <span className="text-sm font-semibold text-gray-800">{profile.email || '—'}</span>
          </div>
          <div className="flex items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500 w-28 shrink-0">Phone:</span>
            <span className="text-sm font-semibold text-gray-800">{profile.phone_number || '—'}</span>
          </div>
          <div className="flex items-center py-3">
            <span className="text-sm text-gray-500 w-28 shrink-0">Location:</span>
            <span className="text-sm font-semibold text-gray-800">{profile.location || '—'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export const SecuritySection = ({ sessionTimeout, onTimeoutChange }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showC,   setShowC]   = useState(false);
  const [showN,   setShowN]   = useState(false);
  const [showCo,  setShowCo]  = useState(false);
  const [message, setMessage] = useState(null);
  const [localTimeout, setLocalTimeout] = useState(sessionTimeout);
  const [timeoutSaved, setTimeoutSaved] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { navigate('/'); }, sessionTimeout * 60 * 1000);
  }, [sessionTimeout, navigate]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  const handleChangePassword = () => {
    const error = validatePassword(current, newPass, confirm);
    if (error) { setMessage({ type: 'error', text: error }); return; }
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setCurrent(''); setNewPass(''); setConfirm('');
  };

  const handleSaveTimeout = () => {
    const val = Math.min(120, Math.max(5, localTimeout));
    setLocalTimeout(val);
    onTimeoutChange(val);
    setTimeoutSaved(true);
    window.setTimeout(() => setTimeoutSaved(false), 2000);
  };

  return (
    <div className={`${sectionClass} mb-4`}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Password reset, session timeout</h2>
      </div>
      <div className={sectionBody}>
        <div className="mb-4">
          <label className={labelClass}>Current Password</label>
          <PasswordInput value={current} onChange={setCurrent} show={showC} onToggle={() => setShowC(p => !p)} placeholder="Enter Current Password" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>New Password</label>
            <PasswordInput value={newPass} onChange={setNewPass} show={showN} onToggle={() => setShowN(p => !p)} placeholder="Enter New Password" />
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <PasswordInput value={confirm} onChange={setConfirm} show={showCo} onToggle={() => setShowCo(p => !p)} placeholder="Confirm New Password" />
          </div>
        </div>
        {message && (
          <p className={`text-xs mb-3 font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {message.text}
          </p>
        )}
        <button onClick={handleChangePassword} className={btnYellow}>Change Password</button>
        <div className="border-t border-gray-100 my-5" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Session Timeout</p>
            <p className="text-xs text-gray-400 mt-0.5">Automatically log out after inactivity (5–120 min)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number" min={5} max={120}
              value={localTimeout}
              onChange={e => setLocalTimeout(Number(e.target.value))}
              className="w-16 bg-gray-100 border border-gray-200 text-gray-800 text-sm text-center rounded-lg px-2 py-2 focus:outline-none focus:border-brand-yellow/70"
            />
            <span className="text-sm text-gray-500">min</span>
            <button onClick={handleSaveTimeout} className={btnYellow}>Save</button>
            {timeoutSaved && <span className="text-green-600 text-xs font-medium">Saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BusinessProfileSection
// ─────────────────────────────────────────────────────────────────────────────
export const BusinessProfileSection = ({ business, onChange, onSave }) => {
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const isOther = business.industry === 'Other';
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  const handleIndustrySelect = (val) => {
    onChange('industry', val);
    if (val !== 'Other') onChange('customIndustry', '');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await onSave();
      if (res && res.success) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
      } else {
        setError(res?.message || 'Failed to save business profile.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${sectionClass} mb-4`}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Business Profile</h2>
      </div>
      <div className={sectionBody}>

        <div className="mb-4">
          <label className={labelClass}>Company Name</label>
          <input type="text" value={business.companyName} onChange={e => onChange('companyName', e.target.value)} className={inputClass} placeholder="e.g. Acme Corporation" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Company Size</label>
            <select value={business.companySize} onChange={e => onChange('companySize', e.target.value)} className={selectClass}>
              <option value="">Select size…</option>
              {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <select value={business.industry} onChange={e => handleIndustrySelect(e.target.value)} className={selectClass}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
            {isOther && (
              <input
                type="text"
                value={business.customIndustry || ''}
                onChange={e => onChange('customIndustry', e.target.value)}
                placeholder="Please specify your industry"
                className={`${inputClass} mt-2`}
                autoFocus
              />
            )}
          </div>
        </div>

        {/* tin_number */}
        <div className="mb-4">
          <label className={labelClass}>TIN (Tax Identification Number)</label>
          <input type="text" value={business.tinNumber} onChange={e => onChange('tinNumber', e.target.value)} className={inputClass} placeholder="e.g. 123-456-789-000" />
          <p className="text-gray-400 text-[10px] mt-1">Format: XXX-XXX-XXX or XXX-XXX-XXX-XXX</p>
        </div>

        {/* website */}
        <div className="mb-4">
          <label className={labelClass}>Website</label>
          <input type="text" value={business.website} onChange={e => onChange('website', e.target.value)} className={inputClass} placeholder="e.g. https://yourcompany.com" />
        </div>

        {/* headquarters */}
        <div className="mb-4">
          <label className={labelClass}>Headquarters</label>
          <input type="text" value={business.headquarters} onChange={e => onChange('headquarters', e.target.value)} className={inputClass} placeholder="e.g. Mandaluyong, Metro Manila" />
        </div>

        {/* description */}
        <div className="mb-5">
          <label className={labelClass}>Company Description</label>
          <textarea
            value={business.description}
            onChange={e => onChange('description', e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Brief description of your company"
          />
        </div>

        {/* verification_status — read-only, admin-managed */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-gray-500">Verification Status:</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            business.verificationStatus === 'approved'
              ? 'bg-green-100 text-green-700'
              : business.verificationStatus === 'rejected'
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            {business.verificationStatus || 'pending'}
          </span>
        </div>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className={btnYellow} disabled={saving}>
            {saving ? 'Saving…' : 'Save Business Profile'}
          </button>
          {saved && <span className="text-green-600 text-xs font-medium">Saved!</span>}
        </div>

      </div>
    </div>
  );
};

export const DocumentUploadSection = ({ business, onChange, userId }) => {
  const fileRef    = useRef(null);
  const [error,     setError]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploaded,  setUploaded]  = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      e.target.value = '';
      return;
    }
    setError('');
    setUploading(true);
    try {
      const res = await uploadPermit(userId, file);
      if (res.success) {
        onChange('permitUrl', res.data.permit_url);
        setUploaded(true);
        window.setTimeout(() => setUploaded(false), 3000);
      } else {
        setError(res.message || 'Upload failed.');
      }
    } catch {
      setError('Network error uploading permit.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const permitFileName = business.permitUrl
    ? business.permitUrl.split('/').pop()
    : null;

  return (
    <div className={`${sectionClass} mb-4`}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Business Permit</h2>
      </div>
      <div className={sectionBody}>
        <p className="text-xs text-gray-400 mb-4">
          Upload your business permit (DTI Registration, SEC Registration, or Mayor's Permit) as a single PDF file. Max 5MB.
        </p>

        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />

        <button
          onClick={() => fileRef.current.click()}
          className={`w-full max-w-xs border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-colors group ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-brand-yellow/60'
          }`}
          disabled={uploading}
        >
          <svg className={`w-8 h-8 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-brand-yellow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className={`text-xs font-semibold ${error ? 'text-red-500' : 'text-gray-600 group-hover:text-brand-dark'}`}>
            {uploading ? 'Uploading…' : 'Business Permit (PDF)'}
          </span>
          {error
            ? <span className="text-[10px] text-red-500 font-medium text-center">{error}</span>
            : uploaded
              ? <span className="text-[10px] text-green-600 font-medium">Uploaded!</span>
              : permitFileName
                ? <span className="text-[10px] text-green-600 font-medium truncate max-w-full px-1">{permitFileName}</span>
                : <span className="text-[10px] text-gray-400">Click to upload PDF</span>
          }
        </button>
      </div>
    </div>
  );
};