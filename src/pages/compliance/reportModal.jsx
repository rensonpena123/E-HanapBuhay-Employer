import React from "react";
import { X, Paperclip } from "lucide-react";

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Backdrop with blur effect
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header - Dark Blue */}
        <div className="bg-brand-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold">Report a Violation</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          
          <p className="text-sm text-gray-600 mb-4">
            Help us keep the platform safe. Describe any Violation and Provide any details.
          </p>

          {/* Text Area */}
          <textarea 
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-gray-50 mb-4 transition-all"
            placeholder="Message here.."
          ></textarea>

          {/* Attachment Link */}
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black mb-6 transition-colors cursor-pointer">
            <Paperclip size={16} />
            <span>Attach the support evidences (Screenshot, etc).</span>
          </button>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-transform active:scale-95 text-sm"
              onClick={() => {
                // Add submit logic here
                onClose();
              }}
            >
              Submit Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportModal;