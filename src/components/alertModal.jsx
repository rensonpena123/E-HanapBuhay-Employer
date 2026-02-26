import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * AlertModal — Centered, full-screen blur overlay alert.
 *
 * Props:
 *   isOpen      {boolean}
 *   type        {'success' | 'error' | 'loading'}
 *   title       {string}
 *   message     {string}
 *   onClose     {function}  — called when user clicks OK (not shown for loading)
 *   onEdit      {function}  — optional: shows an "Edit" button alongside OK (success/error only)
 *   autoCloseMs {number}    — optional: auto-close after N ms (success only)
 */
const AlertModal = ({ isOpen, type = 'success', title, message, onClose, onEdit, autoCloseMs }) => {
  // Auto-close for success alerts when autoCloseMs is provided
  useEffect(() => {
    if (!isOpen || type !== 'success' || !autoCloseMs || !onClose) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [isOpen, type, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle size={72} strokeWidth={1.5} className="text-green-400" />,
      ring: 'ring-green-400/40',
      btnClass: 'bg-green-500 hover:bg-green-400',
      defaultTitle: 'Success!',
    },
    error: {
      icon: <XCircle size={72} strokeWidth={1.5} className="text-red-400" />,
      ring: 'ring-red-400/40',
      btnClass: 'bg-red-500 hover:bg-red-400',
      defaultTitle: 'Something went wrong',
    },
    loading: {
      icon: <Loader2 size={72} strokeWidth={1.5} className="text-brand-yellow animate-spin" />,
      ring: 'ring-brand-yellow/30',
      btnClass: '',
      defaultTitle: 'Please wait…',
    },
  };

  const { icon, ring, btnClass, defaultTitle } = config[type] || config.success;

  // Show action buttons only when not loading
  const showActions = type !== 'loading' && onClose;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal card */}
      <div
        className={`
          relative bg-brand-dark border-2 border-white/10 rounded-3xl shadow-2xl
          w-full max-w-sm mx-auto flex flex-col items-center text-center
          px-8 py-10 gap-5
          ring-4 ${ring}
          animate-[fadeScaleIn_0.25s_ease-out]
        `}
      >
        {/* Icon */}
        <div className="flex items-center justify-center">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold leading-snug">
          {title || defaultTitle}
        </h2>

        {/* Message */}
        {message && (
          <p className="text-gray-300 text-base leading-relaxed">
            {message}
          </p>
        )}

        {/* Action buttons — hidden during loading */}
        {showActions && (
          onEdit ? (
            // Edit + OK side by side when onEdit is provided
            <div className="mt-2 flex gap-3 w-full">
              {/* Edit button — secondary action */}
              <button
                onClick={onEdit}
                className="flex-1 py-3.5 rounded-2xl text-brand-dark font-bold text-base bg-brand-yellow hover:bg-yellow-400 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Edit
              </button>
              {/* OK button — primary dismiss */}
              <button
                onClick={onClose}
                className={`flex-1 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 active:scale-95 cursor-pointer ${btnClass}`}
              >
                OK
              </button>
            </div>
          ) : (
            // Standard full-width OK button — backward compatible when no onEdit passed
            <button
              onClick={onClose}
              className={`
                mt-2 w-full py-3.5 rounded-2xl text-white font-bold text-lg
                transition-all duration-200 active:scale-95 cursor-pointer
                ${btnClass}
              `}
            >
              OK
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AlertModal;