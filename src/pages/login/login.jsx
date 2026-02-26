import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../../assets/login-bg.png';
import Logo from '../../components/logo.jsx';
import PageTransition from '../../components/pageTransition.jsx';
import { loginUser } from '../../api/auth.js';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import AlertModal from '../../components/alertModal.jsx';
import ForgotPasswordModal from './forgotPasswordModal.jsx';

const Login = () => {
  const [email,            setEmail]            = useState('');
  const [password,         setPassword]         = useState('');
  const [showPassword,     setShowPassword]     = useState(false);
  const [errorMessage,     setErrorMessage]     = useState('');
  const [isLoading,        setIsLoading]        = useState(false);
  const [isForgotModalOpen,setIsForgotModalOpen]= useState(false);

  // AlertModal state
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const navigate = useNavigate();

  const closeAlert = () => {
    const wasSuccess = alert.type === 'success';
    setAlert(prev => ({ ...prev, isOpen: false }));
    if (wasSuccess) navigate('/dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setAlert({ isOpen: true, type: 'loading', title: 'Verifying credentials…', message: '' });

    try {
      const response = await loginUser({ email, password });

      if (response.success) {
        const user = response.data.user;

        // Extra frontend guard — backend already enforces this, but belt-and-suspenders
        if (user.role !== 'employer' || user.role_id !== 2) {
          setAlert({
            isOpen: true,
            type: 'error',
            title: 'Access Denied',
            message: 'This portal is for employer accounts only. Please use the correct login page for your account.',
          });
          setIsLoading(false);
          return;
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));

        setAlert({
          isOpen: true,
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${user.full_name || user.email}. Redirecting to your dashboard…`,
        });
      } else {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'Login Failed',
          message: response.message || 'Invalid email or password.',
        });
        setErrorMessage(response.message || 'Login failed.');
      }
    } catch (err) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Could not reach the server. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClasses = `w-full bg-transparent border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow`;

  return (
    <PageTransition>
      <div
        className="min-h-screen w-full flex items-center justify-start pl-6 md:pl-20 lg:pl-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="w-full max-w-lg bg-brand-dark rounded-[2rem] px-8 pt-4 pb-8 md:px-12 md:pt-6 md:pb-12 shadow-2xl flex flex-col shrink-0">
          <Logo className="mb-2 -mt-2" />

          <h1 className="text-3xl md:text-4xl font-bold text-brand-yellow mb-8 leading-snug text-center">
            Welcome Back,<br />Employer!
          </h1>

          <form className="w-full space-y-5" onSubmit={handleLogin}>
            <div className="w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                placeholder="Email address"
                className={inputBaseClasses}
                disabled={isLoading}
              />
            </div>

            <div className="w-full relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                placeholder="Password"
                className={`${inputBaseClasses} pr-12`}
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

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-400 text-sm pl-2 animate-pulse">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="w-full text-left pt-1">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-brand-yellow text-sm hover:underline hover:text-yellow-400 transition-colors tracking-wide"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-yellow hover:shadow-[0_0_20px_rgba(251,192,45,0.6)] text-white font-bold py-4 rounded-full text-lg transition-all duration-300 tracking-wide cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Verifying…' : 'Login'}
              </button>
            </div>

            <div className="text-center mt-6 pt-2">
              <span className="text-gray-300 text-sm">Don't have an account? </span>
              <Link
                to="/signup"
                className="text-brand-yellow text-sm font-bold hover:underline hover:text-yellow-400 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>

          <ForgotPasswordModal
            isOpen={isForgotModalOpen}
            onClose={() => setIsForgotModalOpen(false)}
          />
        </div>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </PageTransition>
  );
};

export default Login;