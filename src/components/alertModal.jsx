import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// AlertModal — full-screen blur overlay with success (green) / error (red) / loading states
const AlertModal = ({ isOpen, type = 'success', title, message, onClose, onEdit, autoCloseMs }) => {
  // visible drives the CSS enter/exit animation independently from isOpen
  const [visible, setVisible] = useState(false);

  // Sync visible with isOpen: enter immediately, exit with delay for animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // Hold visible for 220ms so the fade-out animation completes before unmounting
      const t = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Auto-close for success alerts
  useEffect(() => {
    if (!isOpen || type !== 'success' || !autoCloseMs || !onClose) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [isOpen, type, autoCloseMs, onClose]);

  if (!isOpen && !visible) return null;

  const config = {
    success: {
      icon:         <CheckCircle size={72} strokeWidth={1.5} className="text-green-400" />,
      borderColor:  'border-green-500',
      ring:         'ring-green-500/30',
      btnClass:     'bg-green-500 hover:bg-green-400',
      defaultTitle: 'Success!',
    },
    error: {
      icon:         <XCircle size={72} strokeWidth={1.5} className="text-red-400" />,
      borderColor:  'border-red-500',
      ring:         'ring-red-500/30',
      btnClass:     'bg-red-500 hover:bg-red-400',
      defaultTitle: 'Something went wrong',
    },
    loading: {
      icon:         <Loader2 size={72} strokeWidth={1.5} className="text-brand-yellow animate-spin" />,
      borderColor:  'border-white/10',
      ring:         'ring-brand-yellow/30',
      btnClass:     '',
      defaultTitle: 'Please wait…',
    },
  };

  const { icon, borderColor, ring, btnClass, defaultTitle } = config[type] || config.success;
  const showActions = type !== 'loading' && onClose;

  // animClass — fade+scale in when opening, fade+scale out when closing
  const animClass = isOpen
    ? 'animate-[alertIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
    : 'animate-[alertOut_0.20s_ease-in_forwards]';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
    >
      {/* Blurred backdrop — fades with the card */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Modal card */}
      <div
        className={`
          relative bg-brand-dark border-2 ${borderColor} rounded-3xl shadow-2xl
          w-full max-w-sm mx-auto flex flex-col items-center text-center
          px-8 py-10 gap-5
          ring-4 ${ring}
          ${animClass}
        `}
      >
        {/* Icon */}
        <div className="flex items-center justify-center">{icon}</div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold leading-snug">
          {title || defaultTitle}
        </h2>

        {/* Message / description */}
        {message && (
          <p className="text-gray-300 text-base leading-relaxed">{message}</p>
        )}

        {/* Action buttons — hidden during loading */}
        {showActions && (
          onEdit ? (
            <div className="mt-2 flex gap-3 w-full">
              {/* Edit — secondary action */}
              <button
                onClick={onEdit}
                className="flex-1 py-3.5 rounded-2xl text-brand-dark font-bold text-base bg-brand-yellow hover:bg-yellow-400 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Edit
              </button>
              {/* OK — primary dismiss */}
              <button
                onClick={onClose}
                className={`flex-1 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 active:scale-95 cursor-pointer ${btnClass}`}
              >
                OK
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`mt-2 w-full py-3.5 rounded-2xl text-white font-bold text-lg transition-all duration-200 active:scale-95 cursor-pointer ${btnClass}`}
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