import React from "react";
import { X, ShieldCheck } from "lucide-react";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand-yellow" size={24} />
            <h2 className="text-white text-lg font-bold">Terms and Conditions</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-4">
          <p>
            Welcome to <strong>e-HanapBuhay</strong> ("Platform"). By signing up as an Employer, you agree to comply with and be bound by the following Terms and Conditions ("Terms"). Please review them carefully.
          </p>

          <h3 className="font-bold text-brand-dark mt-4">1. Acceptance of Terms</h3>
          <p>By creating an account, posting a job, or utilizing our applicant management services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use our services.</p>

          <h3 className="font-bold text-brand-dark mt-4">2. Employer Eligibility & Verification</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>2.1.</strong> You represent that you are a legitimate business entity or an authorized representative of one.</li>
            <li><strong>2.2.</strong> You agree to provide accurate, current, and complete information during registration (e.g., DTI/SEC registration, Business Permits).</li>
            <li><strong>2.3.</strong> e-HanapBuhay reserves the right to verify your business documents and suspend accounts that fail to provide proof of legitimacy.</li>
          </ul>

          <h3 className="font-bold text-brand-dark mt-4">3. Job Posting Guidelines</h3>
          <p>To maintain a safe marketplace, all job postings must adhere to the following standards:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>3.1. Accuracy:</strong> Job descriptions must accurately reflect the role, responsibilities, and requirements.</li>
            <li><strong>3.2. No Discrimination:</strong> You agree not to discriminate based on age, gender, religion, or ethnicity, in compliance with local labor laws.</li>
            <li><strong>3.3. Zero Placement Fee:</strong> As per our Compliance Policy, collecting placement fees from applicants is strictly prohibited.</li>
            <li><strong>3.4. Prohibited Content:</strong> You may not post jobs related to illegal activities, multi-level marketing (MLM), or "get rich quick" schemes.</li>
          </ul>

          <h3 className="font-bold text-brand-dark mt-4">4. Compliance with Labor Laws</h3>
          <p>You acknowledge your responsibility to adhere to all applicable Philippine labor laws, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>General Labor Standards:</strong> Minimum wage, holiday pay, and overtime pay.</li>
            <li><strong>Mandatory Benefits:</strong> Registration and contribution to SSS, PhilHealth, and Pag-IBIG for hired employees.</li>
            <li><strong>Occupational Safety:</strong> Adherence to OSH (Occupational Safety and Health) standards.</li>
          </ul>

          <h3 className="font-bold text-brand-dark mt-4">5. Data Privacy & Applicant Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>5.1.</strong> You agree to handle all applicant data in accordance with the Data Privacy Act of 2012 (RA 10173).</li>
            <li><strong>5.2.</strong> You shall use applicant information solely for recruitment purposes. Selling, sharing, or using this data for marketing is strictly prohibited.</li>
            <li><strong>5.3.</strong> You are responsible for the security of the personal data you download or store from our Platform.</li>
          </ul>

          <h3 className="font-bold text-brand-dark mt-4">6. Account Security</h3>
          <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to notify e-HanapBuhay immediately of any unauthorized use of your account.</p>

          <h3 className="font-bold text-brand-dark mt-4">7. Limitation of Liability</h3>
          <p>e-HanapBuhay acts as a facilitator connecting Employers and Applicants. We do not guarantee the quality, safety, or legality of the applicants. We are not liable for any employment disputes, hiring decisions, or damages arising from your use of the Platform.</p>

          <h3 className="font-bold text-brand-dark mt-4">8. Termination of Service</h3>
          <p>e-HanapBuhay reserves the right to suspend or terminate your account without prior notice if you:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Violate these Terms.</li>
            <li>Are reported for abusive behavior or scams.</li>
            <li>Fail to provide necessary compliance documents upon request.</li>
          </ul>

          <h3 className="font-bold text-brand-dark mt-4">9. Governing Law</h3>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines.</p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-6 py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
          >
            I Accept
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;