import React from "react";
import { X, Download, Phone, Mail, Linkedin, MapPin } from "lucide-react";

const ViewModal = ({ isOpen, onClose, applicant }) => {
  if (!isOpen || !applicant) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={handleContentClick}
      >
        
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-white text-lg font-bold">Resume</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-0">
          
          {/* Top Row: Name & Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-6 border-b border-gray-100 bg-white">
            <h1 className="text-3xl font-bold text-gray-800">{applicant.name}</h1>
            <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
              <Download size={18} />
              Download
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col md:flex-row min-h-[400px]">
            
            {/* LEFT COLUMN: Sidebar (Contact, Skills) */}
            <div className="w-full md:w-1/3 bg-blue-50/50 p-6 border-r border-gray-100">
              
              {/* Contact Info */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-brand-dark" />
                    <span>+63 995 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-brand-dark" />
                    <span className="truncate">applicant@email.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin size={16} className="text-brand-dark" />
                    <span className="truncate">linkedin.com/in/profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-brand-dark" />
                    <span>Manila, Philippines</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Parsing the skills string from your data or using defaults */}
                  {applicant.skills ? applicant.skills.split(', ').map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No skills listed</span>
                  )}
                </div>
              </div>

               {/* Languages  */}
               <div>
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Languages</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>English (Native)</li>
                  <li>Filipino (Fluent)</li>
                </ul>
              </div>

            </div>

            {/* RIGHT COLUMN: Main Content (Experience, Education) */}
            <div className="w-full md:w-2/3 p-8 bg-white">
              
              {/* Experience Section */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold text-lg mb-4 border-b pb-2">Experience</h3>
                
                {/* Job Item 1 */}
                <div className="mb-6 relative pl-4 border-l-2 border-gray-200">
                  <h4 className="font-bold text-gray-800">Senior Web Developer</h4>
                  <p className="text-sm text-gray-500 mb-2">Tech Solutions Inc. | 2023 - Present</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Led development of key frontend modules using React.</li>
                    <li>Mentored junior developers and conducted code reviews.</li>
                  </ul>
                </div>

                {/* Job Item 2 */}
                <div className="mb-6 relative pl-4 border-l-2 border-gray-200">
                  <h4 className="font-bold text-gray-800">Junior Developer</h4>
                  <p className="text-sm text-gray-500 mb-2">Startup Hub | 2021 - 2023</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Assisted in building responsive UI components.</li>
                    <li>Collaborated with design team to implement pixel-perfect designs.</li>
                  </ul>
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-4 border-b pb-2">Education</h3>
                
                <div className="relative pl-4 border-l-2 border-gray-200">
                  <h4 className="font-bold text-gray-800">BS Computer Science</h4>
                  <p className="text-sm text-gray-500">University of the Philippines | 2017 - 2021</p>
                  <p className="text-sm text-gray-600 mt-2">Magna Cum Laude, President of Computing Society.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewModal;