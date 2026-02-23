import React from 'react';

const FilterItem = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Yellow Label */}
      <label className="text-brand-yellow font-bold text-sm tracking-wide">
        {label}
      </label>
      
      <div className="h-[42px]">
        {children}
      </div>
    </div>
  );
};

export default FilterItem;