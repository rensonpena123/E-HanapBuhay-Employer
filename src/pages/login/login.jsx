import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../../assets/login-bg.png';
import Logo from '../../components/logo.jsx';
import PageTransition from '../../components/pageTransition.jsx';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return; 
    }

    setErrorMessage('');
    console.log("Logging in...");
    navigate('/dashboard'); 
  };

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
          
          {/* Email Input */}
          <div className="w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Email address"
              className={`w-full bg-transparent border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base
                ${errorMessage && !email ? 'border-red-500' : 'border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow'}
              `}
            />
          </div>

          {/* Password Input */}
          <div className="w-full relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Password"
              className={`w-full bg-transparent border-2 rounded-2xl px-5 py-4 pr-12 outline-none transition-all duration-300 text-white placeholder-gray-300 text-base
                ${errorMessage && password.length < 6 ? 'border-red-500' : 'border-brand-yellow hover:shadow-[0_0_12px_rgba(251,192,45,0.4)] focus:shadow-[0_0_16px_rgba(251,192,45,0.7)] focus:border-brand-yellow'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-yellow transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-400 text-sm pl-2 animate-pulse">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="w-full text-left pt-1">
            <a href="#" className="text-brand-yellow text-sm hover:underline hover:text-yellow-400 transition-colors tracking-wide">
              Forgot Password?
            </a>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-yellow hover:bg-brand-yellow hover:shadow-[0_0_20px_rgba(251,192,45,0.6)] text-white font-bold py-4 rounded-full text-lg transition-all duration-300 tracking-wide cursor-pointer"
            >
              Login
            </button>
          </div>

        {/* To signup */}
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

      </div>
    </div>
    </PageTransition>
  );
};

export default Login;