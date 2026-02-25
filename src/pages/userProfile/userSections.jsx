import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CircleUser, Pencil, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_SIZES, INDUSTRIES, DOCUMENT_SLOTS, validatePassword, validateRegistrationNumber, validateTaxId } from './userHelpers.jsx';

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
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
);

export const ProfileTopSection = ({ profile, onAvatarChange, onEditUsername }) => {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

      {/* Profile Picture */}
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Profile Picture</h2>
        </div>
        <div className={`${sectionBody} flex items-center gap-5`}>
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border-2 border-gray-300">
            {profile.avatar
              ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              : <CircleUser size={48} className="text-gray-400" strokeWidth={1.2} />
            }
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button onClick={() => fileRef.current.click()} className={btnYellow}>Choose File</button>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 2MB</p>
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
            <span className="text-sm text-gray-500 w-28 shrink-0">Username:</span>
            <span className="text-sm font-semibold text-gray-800 flex-1">{profile.username}</span>
            <button onClick={onEditUsername} className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors">
              <Pencil size={15} />
            </button>
          </div>
          <div className="flex items-center py-3">
            <span className="text-sm text-gray-500 w-28 shrink-0">Email:</span>
            <span className="text-sm font-semibold text-gray-800">{profile.email}</span>
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
    timerRef.current = window.setTimeout(() => {
      navigate('/');
    }, sessionTimeout * 60 * 1000);
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

        {/* Current Password */}
        <div className="mb-4">
          <label className={labelClass}>Current Password</label>
          <PasswordInput value={current} onChange={setCurrent} show={showC} onToggle={() => setShowC(p => !p)} placeholder="Enter Current Password" />
        </div>

        {/* New + Confirm */}
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

        {/* Session Timeout */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Session Timeout</p>
            <p className="text-xs text-gray-400 mt-0.5">Automatically log out after inactivity (5–120 min)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5} max={120}
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

export const BusinessProfileSection = ({ business, onChange }) => {
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const isOther = business.industry === 'Other';

  const handleIndustrySelect = (val) => {
    onChange('industry', val);
    if (val !== 'Other') onChange('customIndustry', '');
  };

  return (
    <div className={`${sectionClass} mb-4`}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Create business profile</h2>
      </div>
      <div className={sectionBody}>
        <div className="mb-4">
          <label className={labelClass}>Company Name</label>
          <input type="text" value={business.companyName} onChange={e => onChange('companyName', e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelClass}>Company Size</label>
            <select value={business.companySize} onChange={e => onChange('companySize', e.target.value)} className={selectClass}>
              {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <select value={business.industry} onChange={e => handleIndustrySelect(e.target.value)} className={selectClass}>
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
        <button className={btnYellow}>Create Business Profile</button>
      </div>
    </div>
  );
};

export const DocumentUploadSection = ({ docs, onUpload }) => {
  const fileRefs = useRef({});
  const [errors, setErrors] = useState({});

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, [key]: 'Only PDF files are accepted.' }));
      e.target.value = '';
      return;
    }

    setErrors(prev => ({ ...prev, [key]: null }));
    onUpload(key, file.name);
  };

  return (
    <div className={`${sectionClass} mb-4`}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Upload DTI/SEC, Mayor's Permit</h2>
      </div>
      <div className={`${sectionBody}`}>
        <p className="text-xs text-gray-400 mb-4">Only PDF files are accepted. Max 5MB per file.</p>
        <div className="flex flex-wrap gap-4">
          {DOCUMENT_SLOTS.map(({ key, label }) => (
            <div key={key} className="flex-1 min-w-[140px]">
              <input
                ref={el => fileRefs.current[key] = el}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={e => handleFileChange(key, e)}
              />
              <button
                onClick={() => fileRefs.current[key].click()}
                className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-colors group ${
                  errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-brand-yellow/60'
                }`}
              >
                <svg className={`w-8 h-8 transition-colors ${errors[key] ? 'text-red-400' : 'text-gray-400 group-hover:text-brand-yellow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`text-xs font-semibold ${errors[key] ? 'text-red-500' : 'text-gray-600 group-hover:text-brand-dark'}`}>{label}</span>
                {errors[key]
                  ? <span className="text-[10px] text-red-500 font-medium text-center">{errors[key]}</span>
                  : docs[key]
                    ? <span className="text-[10px] text-green-600 font-medium truncate max-w-full px-1">{docs[key]}</span>
                    : <span className="text-[10px] text-gray-400">Click to upload PDF</span>
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BusinessDetailsSection = ({ business, onChange }) => {
  const [errors, setErrors] = useState({ registrationNumber: '', taxId: '' });
  const [saved,  setSaved]  = useState(false);

  const handleSave = () => {
    const regErr = validateRegistrationNumber(business.registrationNumber);
    const taxErr = validateTaxId(business.taxId);
    setErrors({ registrationNumber: regErr, taxId: taxErr });
    if (regErr || taxErr) return;

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key, val) => {
    onChange(key, val);
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <div className={sectionClass}>
      <div className={sectionHeader}>
        <h2 className="text-white font-semibold text-sm">Update business details</h2>
      </div>
      <div className={sectionBody}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

          {/* Registration Number */}
          <div>
            <label className={labelClass}>Registration Number</label>
            <input
              type="text"
              value={business.registrationNumber}
              onChange={e => handleChange('registrationNumber', e.target.value)}
              placeholder="e.g. DTI-2024-001234 or SEC-2024-001234"
              className={errors.registrationNumber ? inputErrClass : inputClass}
            />
            {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
            <p className="text-gray-400 text-[10px] mt-1">Format: DTI-YYYY-XXXXXX or SEC-YYYY-XXXXXX</p>
          </div>

          {/* Tax ID (TIN) */}
          <div>
            <label className={labelClass}>Tax ID (TIN)</label>
            <input
              type="text"
              value={business.taxId}
              onChange={e => handleChange('taxId', e.target.value)}
              placeholder="e.g. 123-456-789-000"
              className={errors.taxId ? inputErrClass : inputClass}
            />
            {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
            <p className="text-gray-400 text-[10px] mt-1">Format: XXX-XXX-XXX or XXX-XXX-XXX-XXX</p>
          </div>

        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className={btnYellow}>Save Changes</button>
          {saved && <span className="text-green-600 text-xs font-medium">Changes saved!</span>}
        </div>
      </div>
    </div>
  );
};