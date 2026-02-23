import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, CircleUser, LogOut, User, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/'); 
  };

  const isProfilePage = location.pathname === '/users';

  return (
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

        <div className="h-10 border-l-2 border-brand-yellow/80 mx-2"></div>

        <div className="relative" ref={menuRef}>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer border ${
              isMenuOpen || isProfilePage
                ? "bg-brand-yellow/10 border-brand-yellow/50" 
                : "border-transparent hover:bg-white/5"
            }`}
          >
            <CircleUser 
              size={36} 
              strokeWidth={1.5} 
              className={`text-brand-yellow transition-transform ${isMenuOpen || isProfilePage ? "fill-brand-yellow/20" : ""}`} 
            />
            
            <div className="flex flex-col text-left">
              <span className={`font-medium text-[15px] leading-tight transition-colors ${
                isMenuOpen || isProfilePage ? "text-brand-yellow" : "text-white"
              }`}>
                Sample Profile
              </span>
              <span className="text-gray-300 text-xs">System Admin</span>
            </div>

            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
              
              <div className="p-2 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase px-3 py-1">Account</p>
              </div>

              <div className="p-1">
                <Link 
                to="/users" 
                onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-dark rounded-lg transition-colors"
                >
                  <User size={18} />
                  My Profile
                </Link>

                {/* Logout button */}
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
  );
};

export default Header;