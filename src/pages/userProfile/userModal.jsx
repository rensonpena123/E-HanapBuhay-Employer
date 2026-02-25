import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const inputClass    = "w-full bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-yellow/70 focus:bg-white transition-colors";
const inputErrClass = "w-full bg-gray-100 border border-red-400 text-gray-800 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-400 focus:bg-white transition-colors";
const labelClass    = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

/**
 * UserModal
 * Edits all four editable user fields in one place:
 *   users.full_name      → Full Name
 *   users.email          → Email
 *   users.phone_number   → Phone Number
 *   users.location       → Location
 *
 * Props:
 *   isOpen       {boolean}
 *   currentData  { full_name, email, phone_number, location }
 *   onClose      {function}
 *   onSave       {function(updatedFields)}
 *   saving       {boolean} — true while the API call is in-flight
 *   saveError    {string}  — API-level error message to display inside the modal
 */
const UserModal = ({ isOpen, currentData, onClose, onSave, saving, saveError }) => {
  const [fullName,    setFullName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location,    setLocation]    = useState('');
  const [errors,      setErrors]      = useState({});

  // Populate fields with current values every time the modal opens
  useEffect(() => {
    if (isOpen && currentData) {
      setFullName(currentData.full_name     || '');
      setEmail(currentData.email            || '');
      setPhoneNumber(currentData.phone_number || '');
      setLocation(currentData.location      || '');
      setErrors({});
    }
  }, [isOpen, currentData]);

  if (!isOpen) return null;

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.full_name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone: optional, but if provided must be digits/spaces/dashes/plus, 7–15 chars
    if (phoneNumber.trim() && !/^\+?[\d\s\-]{7,15}$/.test(phoneNumber.trim())) {
      newErrors.phone_number = 'Invalid phone number format.';
    }

    // Location: optional, no special validation needed
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      full_name:    fullName.trim(),
      email:        email.trim(),
      phone_number: phoneNumber.trim() || null,  // null so DB keeps it nullable
      location:     location.trim()    || null,
    });
  };

  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-dark">
          <h2 className="text-white font-bold text-base">Edit Account & Profile Details</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Full Name — users.full_name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => { setFullName(e.target.value); clearError('full_name'); }}
              placeholder="Enter your full name"
              className={errors.full_name ? inputErrClass : inputClass}
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Email — users.email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearError('email'); }}
              placeholder="Enter your email address"
              className={errors.email ? inputErrClass : inputClass}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number — users.phone_number */}
          <div>
            <label className={labelClass}>
              Phone Number <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => { setPhoneNumber(e.target.value); clearError('phone_number'); }}
              placeholder="e.g. 09123456789"
              className={errors.phone_number ? inputErrClass : inputClass}
            />
            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
          </div>

          {/* Location — users.location */}
          <div>
            <label className={labelClass}>
              Location <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={e => { setLocation(e.target.value); clearError('location'); }}
              placeholder="e.g. Mandaluyong, Metro Manila"
              className={errors.location ? inputErrClass : inputClass}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* API-level error (e.g. email already taken by another account) */}
          {saveError && (
            <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-yellow hover:bg-yellow-400 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserModal;