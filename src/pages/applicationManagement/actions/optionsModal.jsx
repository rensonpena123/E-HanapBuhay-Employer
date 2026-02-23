import React from "react";
import { X } from "lucide-react";

const UpdateStatusModal = ({ isOpen, onClose, applicant, onUpdateStatus }) => {
  if (!isOpen || !applicant) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Hired": return "text-green-600";
      case "Shortlisted": return "text-red-500";
      case "Pending": return "text-brand-yellow"; 
      default: return "text-gray-600";
    }
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold tracking-wide">Update Application Status</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-8">
          
          {/* Applicant Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Applicant Name:</span>
              <span className="text-gray-900 font-bold text-base">{applicant.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Current Status:</span>
              <span className={`font-bold text-base ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <button 
              onClick={() => onUpdateStatus(applicant.id, "Rejected")}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm"
            >
              Reject
            </button>
            
            <button 
              onClick={() => onUpdateStatus(applicant.id, "Hired")}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm"
            >
              Hire
            </button>
            
            <button 
              onClick={() => onUpdateStatus(applicant.id, "Shortlisted")}
              className="flex-1 bg-red-300 hover:bg-red-400 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm"
            >
              Shortlist
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;