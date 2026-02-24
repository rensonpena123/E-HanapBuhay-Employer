import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { directPasswordReset } from '../../api/auth';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    
    // Basic validation before calling API
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const loadToast = toast.loading('Updating password...');

    try {
      const res = await directPasswordReset(email, newPassword);
      
      if (res.success) {
        // --- SUCCESS ALERT ---
        toast.success(res.message || "Password Updated! You can now login.", { id: loadToast });
        
        setEmail('');
        setNewPassword('');
        
        setTimeout(() => onClose(), 1500); 
      } else {
        toast.error(res.message || "Failed to reset password. Check your email.", { id: loadToast });
      }
    } catch (err) {
      // --- NETWORK ERROR ALERT ---
      toast.error("Network error: Server is unreachable.", { id: loadToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Same glowing classes as used in Login.jsx
  const inputClasses = `w-full bg-transparent border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-brand-dark rounded-[2rem] p-8 md:p-10 shadow-2xl border-2 border-brand-yellow relative">
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-gray-400 hover:text-brand-yellow transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Reset Password
        </h2>
        
        <form onSubmit={handleReset} className="space-y-5">
          <div className="w-full">
            <input 
              type="email" 
              placeholder="Account Email" 
              className={inputClasses}
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className="w-full">
            <input 
              type="password" 
              placeholder="New Password" 
              className={inputClasses}
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-brand-yellow hover:shadow-[0_0_20px_rgba(251,192,45,0.6)] text-white font-bold py-4 rounded-full text-lg transition-all duration-300 tracking-wide cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;