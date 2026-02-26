import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CircleUser, Pencil, Eye, EyeOff, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  COMPANY_SIZES,
  INDUSTRIES,
  validatePassword,
} from './userHelpers.jsx';
import { uploadAvatar, uploadPermit } from '../../api/profile.js';
import { changePassword } from '../../api/auth.js';
import AlertModal from '../../components/alertModal.jsx';

const inputClass    = "w-full bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-yellow/70 focus:bg-white transition-colors";
const inputErrClass = "w-full bg-gray-100 border border-red-400 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-400 focus:bg-white transition-colors";
const sectionClass  = "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full";
const sectionHeader = "bg-brand-dark px-6 py-3.5";
const sectionBody   = "px-6 py-5";
const labelClass    = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const btnYellow     = "bg-brand-yellow text-brand-dark text-sm font-semibold px-5 py-2 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const AVATAR_MAX_BYTES  = 5 * 1024 * 1024;
const PERMIT_MAX_BYTES  = 5 * 1024 * 1024;
const ALLOWED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Base server URL for resolving relative file paths
const SERVER_BASE = 'http://192.168.8.157:3000';

const emptyAlert = { isOpen: false, type: 'success', title: '', message: '' };

// PasswordInput — reusable password field with show/hide toggle
const PasswordInput = ({ value, onChange, show, onToggle, placeholder, hasError }) => (
  <div className="relative">
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${hasError ? inputErrClass : inputClass} pr-10`}
    />
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
);

// ProfileTopSection — Account & Profile card with avatar upload and Edit button
export const ProfileTopSection = ({ profile, onAvatarChange, onEditProfile, userId }) => {
  const fileRef             = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [alert,     setAlert]     = useState(emptyAlert);
  const closeAlert = () => setAlert(emptyAlert);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Avatar file validation
    if (!ALLOWED_IMG_TYPES.includes(file.type)) {
      setAlert({ isOpen: true, type: 'error', title: 'Invalid File Type', message: 'Only JPG, PNG, WEBP, or GIF images are accepted.' });
      e.target.value = '';
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAlert({ isOpen: true, type: 'error', title: 'File Too Large', message: 'Image must be 5MB or smaller. Please choose a smaller file.' });
      e.target.value = '';
      return;
    }

    setUploading(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Uploading photo…', message: '' });

    try {
      const res = await uploadAvatar(file);
      if (res.success) {
        onAvatarChange(res.data.avatar_url);
        setAlert({ isOpen: true, type: 'success', title: 'Photo Updated!', message: 'Your profile picture has been changed successfully.' });
      } else {
        setAlert({ isOpen: true, type: 'error', title: 'Upload Failed', message: res.message || 'Could not upload the photo. Please try again.' });
      }
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Connection Error', message: 'Could not reach the server. Please check your connection.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // avatarSrc — resolve relative path from server to full URL
  const avatarSrc = profile.avatar_url
    ? (profile.avatar_url.startsWith('http')
        ? profile.avatar_url
        : `${SERVER_BASE}${profile.avatar_url}`)
    : null;

  return (
    <>
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Account & Profile</h2>
        </div>
        <div className={sectionBody}>
          <div className="flex gap-6">

            {/* Avatar upload column */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {avatarSrc
                  ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                  : <CircleUser size={64} className="text-gray-400" strokeWidth={1.2} />
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <button
                onClick={() => fileRef.current.click()}
                className={btnYellow}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Change Photo'}
              </button>
              <p className="text-xs text-gray-400 text-center">JPG, PNG up to 5MB</p>
            </div>

            {/* Profile info rows */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 w-24 shrink-0">Full Name:</span>
                <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{profile.full_name || '—'}</span>
                {/* Edit button — opens the Edit Account & Profile modal */}
                <button
                  onClick={onEditProfile}
                  className="ml-3 flex items-center gap-1.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              </div>
              <div className="flex items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 w-24 shrink-0">Email:</span>
                <span className="text-sm font-semibold text-gray-800 truncate">{profile.email || '—'}</span>
              </div>
              <div className="flex items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 w-24 shrink-0">Phone:</span>
                <span className="text-sm font-semibold text-gray-800">{profile.phone_number || '—'}</span>
              </div>
              <div className="flex items-center py-3">
                <span className="text-sm text-gray-500 w-24 shrink-0">Location:</span>
                <span className="text-sm font-semibold text-gray-800">{profile.location || '—'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AlertModal — avatar upload result; onEdit re-opens the profile edit modal */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
        onEdit={
          alert.type === 'success' || alert.type === 'error'
            ? () => { closeAlert(); onEditProfile(); }
            : undefined
        }
      />
    </>
  );
};

// SecuritySection — password change + session timeout settings
export const SecuritySection = ({ sessionTimeout, onTimeoutChange }) => {
  const navigate = useNavigate();
  const [current,      setCurrent]      = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [showC,        setShowC]        = useState(false);
  const [showN,        setShowN]        = useState(false);
  const [showCo,       setShowCo]       = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [localTimeout, setLocalTimeout] = useState(sessionTimeout);
  const [timeoutError, setTimeoutError] = useState('');
  const timerRef = useRef(null);

  const [alert, setAlert] = useState(emptyAlert);
  const closeAlert = () => setAlert(emptyAlert);

  // Session timeout — auto-logout on inactivity
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

  const handleChangePassword = async () => {
    // Field-level validation
    const errs = {};
    if (!current.trim())         errs.current = 'Current password is required.';
    if (!newPass.trim())         errs.newPass = 'New password is required.';
    else if (newPass.length < 8) errs.newPass = 'Must be at least 8 characters.';
    if (!confirm.trim())         errs.confirm = 'Please confirm your new password.';
    else if (newPass !== confirm) errs.confirm = 'Passwords do not match.';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setSaving(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Changing password…', message: '' });

    try {
      const res = await changePassword(current, newPass);
      if (res.success) {
        setCurrent(''); setNewPass(''); setConfirm('');
        setAlert({ isOpen: true, type: 'success', title: 'Password Changed!', message: 'Your password has been updated successfully.' });
      } else {
        setAlert({ isOpen: true, type: 'error', title: 'Failed to Change Password', message: res.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Connection Error', message: 'Could not reach the server. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTimeout = () => {
    const val = Number(localTimeout);
    if (!Number.isInteger(val) || val < 5 || val > 120) {
      setTimeoutError('Please enter a whole number between 5 and 120.');
      return;
    }
    setTimeoutError('');
    setLocalTimeout(val);
    onTimeoutChange(val);
    setAlert({ isOpen: true, type: 'success', title: 'Timeout Saved!', message: `Session will automatically log out after ${val} minutes of inactivity.` });
  };

  return (
    <>
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Security</h2>
        </div>
        <div className={sectionBody}>

          <div className="mb-3">
            <label className={labelClass}>Current Password</label>
            <PasswordInput
              value={current} onChange={v => { setCurrent(v); setFieldErrors(p => ({ ...p, current: '' })); }}
              show={showC} onToggle={() => setShowC(p => !p)}
              placeholder="Enter current password"
              hasError={!!fieldErrors.current}
            />
            {fieldErrors.current && <p className="text-red-500 text-xs mt-1">{fieldErrors.current}</p>}
          </div>

          <div className="mb-3">
            <label className={labelClass}>New Password</label>
            <PasswordInput
              value={newPass} onChange={v => { setNewPass(v); setFieldErrors(p => ({ ...p, newPass: '' })); }}
              show={showN} onToggle={() => setShowN(p => !p)}
              placeholder="Min. 8 characters"
              hasError={!!fieldErrors.newPass}
            />
            {fieldErrors.newPass && <p className="text-red-500 text-xs mt-1">{fieldErrors.newPass}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClass}>Confirm Password</label>
            <PasswordInput
              value={confirm} onChange={v => { setConfirm(v); setFieldErrors(p => ({ ...p, confirm: '' })); }}
              show={showCo} onToggle={() => setShowCo(p => !p)}
              placeholder="Re-enter new password"
              hasError={!!fieldErrors.confirm}
            />
            {fieldErrors.confirm && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirm}</p>}
          </div>

          <button onClick={handleChangePassword} className={btnYellow} disabled={saving}>
            {saving ? 'Saving…' : 'Change Password'}
          </button>

          <div className="border-t border-gray-100 my-4" />

          <p className="text-sm font-semibold text-gray-700 mb-1">Session Timeout</p>
          <p className="text-xs text-gray-400 mb-3">Auto logout after inactivity (5–120 min)</p>
          <div className="flex items-center gap-2">
            <input
              type="number" min={5} max={120}
              value={localTimeout}
              onChange={e => { setLocalTimeout(e.target.value); setTimeoutError(''); }}
              className={`w-16 ${timeoutError ? 'border-red-400' : 'border-gray-200'} bg-gray-100 border text-gray-800 text-sm text-center rounded-lg px-2 py-2 focus:outline-none focus:border-brand-yellow/70`}
            />
            <span className="text-sm text-gray-500">min</span>
            <button onClick={handleSaveTimeout} className={btnYellow}>Save</button>
          </div>
          {timeoutError && <p className="text-red-500 text-xs mt-2">{timeoutError}</p>}

        </div>
      </div>

      <AlertModal isOpen={alert.isOpen} type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />
    </>
  );
};

// BusinessProfileSection — company details form
export const BusinessProfileSection = ({ business, onChange, onSave }) => {
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const isOther = business.industry === 'Other';
  const [saving,      setSaving]      = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [alert,       setAlert]       = useState(emptyAlert);
  const closeAlert = () => setAlert(emptyAlert);

  const handleIndustrySelect = (val) => {
    onChange('industry', val);
    if (val !== 'Other') onChange('customIndustry', '');
    setFieldErrors(p => ({ ...p, industry: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!business.companyName.trim())
      errs.companyName = 'Company name is required.';
    if (business.website.trim() && !/^https?:\/\/.+\..+/.test(business.website.trim()))
      errs.website = 'Enter a valid URL (e.g. https://yourcompany.com).';
    if (business.tinNumber.trim() && !/^\d{3}-\d{3}-\d{3}(-\d{3})?$/.test(business.tinNumber.trim()))
      errs.tinNumber = 'Invalid TIN. Use XXX-XXX-XXX or XXX-XXX-XXX-XXX.';
    if (business.industry === 'Other' && !business.customIndustry.trim())
      errs.industry = 'Please specify your industry.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Saving business profile…', message: '' });
    try {
      const res = await onSave();
      if (res && res.success) {
        setAlert({ isOpen: true, type: 'success', title: 'Business Profile Saved!', message: 'Your business information has been updated successfully.' });
      } else {
        setAlert({ isOpen: true, type: 'error', title: 'Save Failed', message: res?.message || 'Could not save business profile. Please try again.' });
      }
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Connection Error', message: 'Could not reach the server. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  };

  const clearErr = (field) => setFieldErrors(p => ({ ...p, [field]: '' }));

  return (
    <>
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Business Profile</h2>
        </div>
        <div className={sectionBody}>

          <div className="mb-4">
            <label className={labelClass}>Company Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={business.companyName}
              onChange={e => { onChange('companyName', e.target.value); clearErr('companyName'); }}
              className={fieldErrors.companyName ? inputErrClass : inputClass}
              placeholder="e.g. Acme Corporation"
            />
            {fieldErrors.companyName && <p className="text-red-500 text-xs mt-1">{fieldErrors.companyName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>Company Size</label>
              <select value={business.companySize} onChange={e => onChange('companySize', e.target.value)} className={selectClass}>
                <option value="">Select size…</option>
                {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select value={business.industry} onChange={e => handleIndustrySelect(e.target.value)} className={fieldErrors.industry ? inputErrClass + ' appearance-none cursor-pointer' : selectClass}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
              {isOther && (
                <input
                  type="text"
                  value={business.customIndustry || ''}
                  onChange={e => { onChange('customIndustry', e.target.value); clearErr('industry'); }}
                  placeholder="Specify industry"
                  className={`${fieldErrors.industry ? inputErrClass : inputClass} mt-2`}
                  autoFocus
                />
              )}
              {fieldErrors.industry && <p className="text-red-500 text-xs mt-1">{fieldErrors.industry}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>TIN (Tax Identification Number)</label>
            <input
              type="text"
              value={business.tinNumber}
              onChange={e => { onChange('tinNumber', e.target.value); clearErr('tinNumber'); }}
              className={fieldErrors.tinNumber ? inputErrClass : inputClass}
              placeholder="e.g. 123-456-789-000"
            />
            <p className="text-gray-400 text-[10px] mt-1">Format: XXX-XXX-XXX or XXX-XXX-XXX-XXX</p>
            {fieldErrors.tinNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.tinNumber}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClass}>Website</label>
            <input
              type="text"
              value={business.website}
              onChange={e => { onChange('website', e.target.value); clearErr('website'); }}
              className={fieldErrors.website ? inputErrClass : inputClass}
              placeholder="e.g. https://yourcompany.com"
            />
            {fieldErrors.website && <p className="text-red-500 text-xs mt-1">{fieldErrors.website}</p>}
          </div>

          <div className="mb-4">
            <label className={labelClass}>Headquarters</label>
            <input
              type="text"
              value={business.headquarters}
              onChange={e => onChange('headquarters', e.target.value)}
              className={inputClass}
              placeholder="e.g. Mandaluyong, Metro Manila"
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Company Description</label>
            <textarea
              value={business.description}
              onChange={e => onChange('description', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Brief description of your company"
            />
          </div>

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

          <button onClick={handleSave} className={btnYellow} disabled={saving}>
            {saving ? 'Saving…' : 'Save Business Profile'}
          </button>

        </div>
      </div>

      <AlertModal isOpen={alert.isOpen} type={alert.type} title={alert.title} message={alert.message} onClose={closeAlert} />
    </>
  );
};

// PdfPreviewModal — displays uploaded permit PDF in an iframe for content verification
const PdfPreviewModal = ({ isOpen, pdfUrl, fileName, onClose }) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl h-[85vh] overflow-hidden">

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-brand-dark shrink-0">
          <div className="flex flex-col min-w-0">
            <h2 className="text-white font-semibold text-sm">Business Permit Preview</h2>
            {fileName && (
              <p className="text-gray-400 text-xs truncate mt-0.5">{fileName}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {/* Open in new tab — fallback if browser blocks iframe PDF rendering */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-brand-yellow hover:text-yellow-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <ExternalLink size={14} />
              Open in Tab
            </a>
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF iframe viewer */}
        <div className="flex-1 bg-gray-100">
          <iframe
            src={pdfUrl}
            title="Business Permit PDF"
            className="w-full h-full border-0"
          />
        </div>

      </div>
    </div>
  );
};

// DocumentUploadSection — business permit upload with PDF preview
export const DocumentUploadSection = ({ business, onChange, userId }) => {
  const fileRef                      = useRef(null);
  const [uploading,  setUploading]   = useState(false);
  const [alert,      setAlert]       = useState(emptyAlert);
  const [pdfPreview, setPdfPreview]  = useState(false);
  const closeAlert      = () => setAlert(emptyAlert);
  const closePdfPreview = () => setPdfPreview(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Permit file validation
    if (file.type !== 'application/pdf') {
      setAlert({ isOpen: true, type: 'error', title: 'Invalid File Type', message: 'Only PDF files are accepted for business permits.' });
      e.target.value = '';
      return;
    }
    if (file.size > PERMIT_MAX_BYTES) {
      setAlert({ isOpen: true, type: 'error', title: 'File Too Large', message: 'PDF must be 5MB or smaller. Please compress or use a smaller file.' });
      e.target.value = '';
      return;
    }

    setUploading(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Uploading permit…', message: '' });

    try {
      const res = await uploadPermit(userId, file);
      if (res.success) {
        onChange('permitUrl', res.data.permit_url);
        setAlert({ isOpen: true, type: 'success', title: 'Permit Uploaded!', message: 'Your business permit has been uploaded. Click "View" to verify the file contents.' });
      } else {
        setAlert({ isOpen: true, type: 'error', title: 'Upload Failed', message: res.message || 'Could not upload the permit. Please try again.' });
      }
    } catch {
      setAlert({ isOpen: true, type: 'error', title: 'Connection Error', message: 'Could not reach the server. Please check your connection.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // permitFileName — extract display filename from stored URL
  const permitFileName = business.permitUrl
    ? business.permitUrl.split('/').pop()
    : null;

  // permitFullUrl — resolve relative path to full server URL for iframe src
  const permitFullUrl = business.permitUrl
    ? (business.permitUrl.startsWith('http')
        ? business.permitUrl
        : `${SERVER_BASE}${business.permitUrl}`)
    : null;

  return (
    <>
      <div className={sectionClass}>
        <div className={sectionHeader}>
          <h2 className="text-white font-semibold text-sm">Business Permit</h2>
        </div>
        <div className={sectionBody}>
          <p className="text-xs text-gray-400 mb-4">
            Upload your business permit (DTI Registration, SEC Registration, or Mayor's Permit) as a single PDF file. Max 5MB.
          </p>

          <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />

          {/* Upload drop zone */}
          <button
            onClick={() => fileRef.current.click()}
            className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-colors group ${
              uploading ? 'border-brand-yellow/40 bg-yellow-50' : 'border-gray-300 hover:border-brand-yellow/60'
            }`}
            disabled={uploading}
          >
            <svg
              className={`w-10 h-10 transition-colors ${uploading ? 'text-brand-yellow animate-pulse' : 'text-gray-400 group-hover:text-brand-yellow'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={`text-sm font-semibold ${uploading ? 'text-brand-yellow' : 'text-gray-600 group-hover:text-brand-dark'}`}>
              {uploading ? 'Uploading…' : 'Business Permit (PDF)'}
            </span>
            {permitFileName
              ? <span className="text-xs text-green-600 font-medium truncate max-w-full px-1">{permitFileName}</span>
              : <span className="text-xs text-gray-400">Click to upload PDF</span>
            }
          </button>

          {/* View PDF button — visible only when a permit exists and not currently uploading */}
          {permitFileName && !uploading && (
            <button
              onClick={() => setPdfPreview(true)}
              className="mt-3 w-full flex items-center justify-center gap-2 border border-brand-yellow/50 text-brand-dark text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-yellow/10 transition-colors"
            >
              <Eye size={16} />
              View Uploaded Permit
            </button>
          )}

        </div>
      </div>

      {/* AlertModal — permit upload result; onEdit triggers re-upload on success/error */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
        onEdit={
          alert.type === 'success' || alert.type === 'error'
            ? () => { closeAlert(); fileRef.current?.click(); }
            : undefined
        }
      />

      {/* PdfPreviewModal — shows the uploaded permit PDF for content verification */}
      <PdfPreviewModal
        isOpen={pdfPreview}
        pdfUrl={permitFullUrl}
        fileName={permitFileName}
        onClose={closePdfPreview}
      />
    </>
  );
};