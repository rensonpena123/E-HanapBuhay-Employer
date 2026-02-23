import React, { useState } from "react";
import { 
  Scale, 
  FileCheck, 
  Ruler, 
  MessageSquareWarning, 
  CheckCircle2 
} from "lucide-react";
import ReportModal from "./reportModal.jsx";

const Compliance = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="p-2 flex justify-center">
      {/* Main Card Container */}
      <div className="w-full max-w-8xl bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header - Dark Blue Banner */}
        <div className="bg-brand-dark px-8 py-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Compliance
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-10 flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-12">
            
            {/* Section 1: Job Posting Guidelines */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Ruler size={28} className="text-gray-800" strokeWidth={2} />
                <h2 className="text-xl font-bold text-gray-900">Job Posting Guidelines</h2>
              </div>
              <ul className="space-y-3 pl-2">
                <CheckItem text="No Discrimination" />
                <CheckItem text="Wage Standards" />
                <CheckItem text="Clear Job Descriptions" />
                <CheckItem text="Zero Placement Fee" />
              </ul>
            </div>

            {/* Section 2: Legal Acknowledgement */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Scale size={28} className="text-gray-800" strokeWidth={2} />
                <h2 className="text-xl font-bold text-gray-900">Legal Acknowledgement</h2>
              </div>
              <ul className="space-y-3 pl-2">
                <CheckItem text="Data Privacy Act (2012) Compliance" />
                <CheckItem text="Mandatory Government Benefits: SSS, PhilHealth, Pag-IBIG" />
                <CheckItem text="Zero Placement Fee Policy" />
                <CheckItem text="Anti-Discrimination Commitment" />
                <CheckItem text="Occupational Safety and Health (OSH) Standards" />
              </ul>
            </div>

          </div>

          {/* VERTICAL DIVIDER  */}
          <div className="hidden lg:block w-px bg-gray-200 self-stretch"></div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 space-y-12">
            
            {/* Section 3: Documents */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileCheck size={28} className="text-gray-800" strokeWidth={2} />
                <h2 className="text-xl font-bold text-gray-900">Documents</h2>
              </div>
              <ul className="space-y-3 pl-2">
                <CheckItem text="Mayor's Business Permit" />
                <CheckItem text="DTI/SEC Registration" />
                <CheckItem text="Barangay Business Permit" />
                <CheckItem text="Sanitary Permit" />
                <CheckItem text="Fire Safety Inspection Certificate" />
              </ul>
            </div>

            {/* Section 4: Report a Violation */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MessageSquareWarning size={28} className="text-gray-800" strokeWidth={2} />
                <h2 className="text-xl font-bold text-gray-900">Report a Violation</h2>
              </div>
              <div className="pl-2">
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <MessageSquareWarning size={20} />
                  Report a Violation
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Render the Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

    </div>
  );
};

// Reusable Check Item Component to keep code clean
const CheckItem = ({ text }) => (
  <li className="flex items-start gap-3 text-gray-700 font-medium text-[15px]">
    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

export default Compliance;