import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/logo.jsx';
import signupBg from '../../assets/signup-bg.jpg';
import PageTransition from '../../components/pageTransition.jsx';
import TermsModal from './termsModal.jsx';
import { registerEmployer } from '../../api/auth.js';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(''); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.address || !formData.password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms & Conditions.');
      return;
    }

    const payload = {
      full_name: formData.name, 
      email: formData.email,
      password: formData.password,
      location: formData.address 
    };

    setIsLoading(true);
    const loadToast = toast.loading('Creating your account...');

    try {
      const data = await registerEmployer(payload);

      if (data.success) {
        toast.success(data.message || 'Success! Redirecting to login...', { id: loadToast });
        setTimeout(() => navigate('/'), 2000);
      } else {
        // Backend sends specific errors like "Email already registered"
        toast.error(data.message || 'Registration failed', { id: loadToast });
        setErrorMessage(data.message);
      }
    } catch (err) {
      toast.error('Server connection failed', { id: loadToast });
      setErrorMessage("Network error: Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full bg-transparent border-2 rounded-2xl px-5 py-3 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow`;

  return (
    <PageTransition>
      <div 
        className="min-h-screen w-full flex items-center justify-end pr-6 md:pr-20 lg:pr-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${signupBg})` }}
      >
        <div className="w-full max-w-lg bg-brand-dark rounded-[2rem] px-8 pt-4 pb-8 md:px-12 md:pt-6 md:pb-12 shadow-2xl flex flex-col shrink-0"> 
          <div className="flex flex-col items-center mb-6">
            <Logo className="mb-2" />
            <h1 className="text-3xl md:text-3xl font-bold text-brand-yellow leading-snug text-center">
              Be an Employer
            </h1>
          </div>

          <form className="w-full space-y-3" onSubmit={handleSignup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={inputClasses}
              disabled={isLoading}
            />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name (Company or Your Name)"
              className={inputClasses}
              disabled={isLoading}
            />

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={inputClasses}
              disabled={isLoading}
            />

            <div className="w-full relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`${inputClasses} pr-12`} 
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-yellow transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 py-1">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 accent-brand-yellow cursor-pointer rounded"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-gray-300 text-sm select-none cursor-pointer">
                Agree with the 
                <button 
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-brand-yellow hover:underline font-bold ml-1 hover:text-yellow-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-400 text-sm pl-2 animate-pulse">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-yellow hover:shadow-[0_0_20px_rgba(251,192,45,0.6)] text-white font-bold py-3 rounded-full text-lg transition-all duration-300 tracking-wide cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center mt-3">
              <span className="text-gray-300 text-sm">Already have an account? </span>
              <Link to="/" className="text-brand-yellow text-sm font-bold hover:underline hover:text-yellow-400 transition-colors">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setAgreedToTerms(true)}
      />
    </PageTransition>
  );
};

export default Signup;