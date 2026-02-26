import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import AlertModal from './alertModal.jsx';

// Base server URL for resolving relative upload paths
const SERVER_BASE = 'http://192.168.8.157:3000';

// getStoredUser — reads the logged-in user object from localStorage
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

// resolveAvatarUrl — converts relative server path to full URL, null if no avatar
const resolveAvatarUrl = (avatar_url) => {
  if (!avatar_url || avatar_url === 'null' || avatar_url === 'undefined') return null;
  if (avatar_url.startsWith('http')) return avatar_url;
  return `${SERVER_BASE}${avatar_url}`;
};

// getInitial — first letter of full_name or email for the default avatar
const getInitial = (user) => {
  const name = user.full_name || user.email || '';
  return name.charAt(0).toUpperCase() || '?';
};

// DefaultAvatar — yellow initials circle, shown when no photo is uploaded
const DefaultAvatar = ({ user }) => (
  <div className="w-full h-full bg-brand-yellow flex items-center justify-center text-brand-dark font-bold text-sm rounded-full select-none">
    {getInitial(user)}
  </div>
);

// AvatarDisplay — photo if uploaded and loads OK, DefaultAvatar otherwise
const AvatarDisplay = ({ avatarSrc, user }) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [avatarSrc]);

  if (avatarSrc && !imgFailed) {
    return (
      <img
        key={avatarSrc}
        src={avatarSrc}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return <DefaultAvatar user={user} />;
};

const Header = () => {
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuRef   = useRef(null);

  // Alert modal state for sign-out feedback
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Listen for profileUpdated event dispatched after avatar/profile saves
  useEffect(() => {
    const handleProfileUpdate = () => setCurrentUser(getStoredUser());
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // handleLogout — show success alert then wipe auth and redirect
  const handleLogout = () => {
    setIsMenuOpen(false);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAlert({
        isOpen:  true,
        type:    'success',
        title:   'Signed Out',
        message: 'You have been successfully signed out. See you next time!',
      });
    } catch {
      setAlert({
        isOpen:  true,
        type:    'error',
        title:   'Sign Out Failed',
        message: 'Something went wrong while signing out. Please try again.',
      });
    }
  };

  // closeAlert — on success dismiss, navigate to login
  const closeAlert = () => {
    const wasSuccess = alert.type === 'success';
    setAlert(prev => ({ ...prev, isOpen: false }));
    if (wasSuccess) navigate('/');
  };

  const isProfilePage = location.pathname === '/users';
  const displayName   = currentUser.full_name || currentUser.email || 'User';
  const roleLabel     = (currentUser.role === 'employer' || currentUser.role_id === 2)
    ? 'Employer'
    : currentUser.role || 'Employer';
  const avatarSrc     = resolveAvatarUrl(currentUser.avatar_url);

  return (
    <>
      <header className="h-20 bg-brand-dark flex items-center justify-between px-8 border-b-2 border-l-2 border-brand-yellow/80 shrink-0 relative z-20">

        {/* Search Bar */}
        <div className="relative w-[400px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-brand-yellow" />
          </div>
          <input
            type="text"
            placeholder="Search ..."
            className="w-full bg-white text-gray-800 rounded-md py-2 pl-10 pr-4 outline-none border-2 border-brand-yellow focus:shadow-[0_0_8px_rgba(251,192,45,0.5)] transition-shadow text-sm"
          />
        </div>

        <div className="flex items-center h-full gap-4">

          <button className="hover:opacity-80 transition-opacity cursor-pointer">
            <Bell size={24} className="text-brand-yellow" />
          </button>

          <div className="h-10 border-l-2 border-brand-yellow/80 mx-2" />

          {/* Profile trigger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer border ${
                isMenuOpen || isProfilePage
                  ? 'bg-brand-yellow/10 border-brand-yellow/50'
                  : 'border-transparent hover:bg-white/5'
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-brand-yellow/60">
                <AvatarDisplay avatarSrc={avatarSrc} user={currentUser} />
              </div>

              <div className="flex flex-col text-left">
                <span className={`font-medium text-[15px] leading-tight transition-colors max-w-[150px] truncate ${
                  isMenuOpen || isProfilePage ? 'text-brand-yellow' : 'text-white'
                }`}>
                  {displayName}
                </span>
                <span className="text-gray-300 text-xs">{roleLabel}</span>
              </div>

              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="p-1">
                  <Link
                    to="/users"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-dark rounded-lg transition-colors"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  {/* Sign Out button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Sign-out alert — success (green border) or error (red border) */}
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

export default Header;