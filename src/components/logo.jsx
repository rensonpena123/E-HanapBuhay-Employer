import React from 'react';
import logoImg from '../assets/logo.png';

const Logo = ({ className = "", variant = "login" }) => {
  
  // The Small Sidebar Version
    if (variant === "sidebar") {
    return (
      <div className={`flex items-center ${className}`}>
        <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
        
        <span className="-ml-4 pr-8 text-xl font-bold tracking-wide whitespace-nowrap">
          <span className="text-[#fbc02d]">e-</span>
          <span className="text-blue-500">HanapBuhay</span>
        </span>
      </div>
    );
  }

  // The Big Login Version 
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={logoImg} alt="Logo" className="h-28 w-auto object-contain" />
      <span className="-ml-10 pr-10 text-2xl font-bold tracking-wider relative z-10">
        <span className="text-[#fbc02d]">e-</span>
        <span className="text-blue-500">HanapBuhay</span>
      </span>
    </div>
  );
};

export default Logo;