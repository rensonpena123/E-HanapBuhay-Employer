import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { directPasswordReset } from '../../api/auth';
import AlertModal from '../../components/alertModal.jsx';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email,       setEmail]       = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [fieldError,  setFieldError]  = useState('');

  // AlertModal state
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
    if (alert.type === 'success') {
      // Clear form and close parent modal on success
      setEmail(''); setNewPassword(''); setConfirmPass(''); setFieldError('');
      onClose();
    }
  };

  if (!isOpen && !alert.isOpen) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    setFieldError('');

    if (!email.trim()) {
      setFieldError('Please enter your account email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFieldError('Please enter a valid email address.');
      return;
    }
    if (newPassword.length < 6) {
      setFieldError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPass) {
      setFieldError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Updating password…', message: '' });

    try {
      const res = await directPasswordReset(email.trim(), newPassword);

      if (res.success) {
        setAlert({
          isOpen: true,
          type: 'success',
          title: 'Password Updated!',
          message: res.message || 'Your password has been reset. You can now log in.',
        });
      } else {
        setAlert({ isOpen: false, type: 'success', title: '', message: '' });
        setFieldError(res.message || 'Failed to reset password. Check your email and try again.');
      }
    } catch (err) {
      setAlert({ isOpen: false, type: 'success', title: '', message: '' });
      setFieldError('Network error: Server is unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full bg-transparent border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow`;

  return (
    <>
      {/* Parent modal — hidden when alert is showing */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-brand-dark rounded-[2rem] p-8 md:p-10 shadow-2xl border-2 border-brand-yellow relative">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-brand-yellow transition-colors"
              disabled={isLoading}
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h2>
            <p className="text-gray-400 text-sm text-center mb-7">
              Enter your employer account email and a new password.
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Employer Account Email"
                  className={inputClasses}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="New Password"
                  className={`${inputClasses} pr-12`}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setFieldError(''); }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-yellow transition-colors"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm password — new field */}
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  className={`${inputClasses} pr-12`}
                  value={confirmPass}
                  onChange={(e) => { setConfirmPass(e.target.value); setFieldError(''); }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-yellow transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {fieldError && (
                <p className="text-red-400 text-sm text-center font-medium">{fieldError}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-brand-yellow hover:shadow-[0_0_20px_rgba(251,192,45,0.6)] text-white font-bold py-4 rounded-full text-lg transition-all duration-300 tracking-wide cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {isLoading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert modal rendered outside the parent modal so it always sits on top */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </>
  );
};

export default ForgotPasswordModal;