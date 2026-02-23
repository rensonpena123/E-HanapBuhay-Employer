import React from 'react';

const FilterBar = ({ children, onClear }) => {
  return (
    <div className="w-full bg-[#1a263e] p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex flex-col lg:flex-row items-end gap-6 justify-between">
        
        <div className="flex flex-wrap items-end gap-6 w-full">
          {children}
        </div>

        {/* Clear Button  */}
        <button
          onClick={onClear}
          className="bg-gray-300 hover:bg-white text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap h-[42px]"
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
};

export default FilterBar;