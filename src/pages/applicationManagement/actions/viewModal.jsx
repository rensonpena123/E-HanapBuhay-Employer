import React, { useState, useEffect } from "react";
import { X, Download, Phone, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react";

// SERVER_BASE — for resolving relative resume file paths
const SERVER_BASE = 'http://192.168.8.157:3000';

const ViewModal = ({ isOpen, onClose, applicant }) => {
  // visible drives CSS enter/exit animation separately from isOpen
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  // resumeFullUrl — resolve relative path from server to full URL
  const resumeFullUrl = applicant?.resume_url
    ? (applicant.resume_url.startsWith('http')
        ? applicant.resume_url
        : `${SERVER_BASE}${applicant.resume_url}`)
    : null;

  // formatDateRange — renders a readable date range from DB date strings
  const formatDateRange = (from, to, current, label) => {
    if (!from) return null;
    const f = new Date(from).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' });
    const t = current ? 'Present' : (to ? new Date(to).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }) : '');
    return `${f}${t ? ' – ' + t : ''}`;
  };

  // animClass — slide-up in, slide-down out
  const backdropAnim = isOpen ? 'opacity-100' : 'opacity-0';
  const panelAnim    = isOpen
    ? 'animate-[modalSlideIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
    : 'animate-[modalSlideOut_0.20s_ease-in_forwards]';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ${backdropAnim}`}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden ${panelAnim}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-white text-lg font-bold">Resume</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[80vh]">

          {/* Name + Download */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-6 border-b border-gray-100 bg-white">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{applicant?.name ?? '—'}</h1>
              {applicant?.job_title && (
                <p className="text-sm text-gray-500 mt-1">Applied for: <span className="font-semibold text-brand-dark">{applicant.job_title}</span></p>
              )}
            </div>
            {resumeFullUrl ? (
              <a
                href={resumeFullUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
              >
                <Download size={18} />
                Download Resume
              </a>
            ) : (
              <span className="mt-4 sm:mt-0 text-xs text-gray-400 italic">No resume file uploaded</span>
            )}
          </div>

          {/* Two column layout */}
          <div className="flex flex-col md:flex-row min-h-[400px]">

            {/* LEFT — Contact, Skills */}
            <div className="w-full md:w-1/3 bg-blue-50/50 p-6 border-r border-gray-100">

              {/* Contact Info — real data from DB */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  {applicant?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-brand-dark shrink-0" />
                      <span>{applicant.phone}</span>
                    </div>
                  )}
                  {applicant?.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-brand-dark shrink-0" />
                      <span className="truncate">{applicant.email}</span>
                    </div>
                  )}
                  {applicant?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-brand-dark shrink-0" />
                      <span>{applicant.location}</span>
                    </div>
                  )}
                  {!applicant?.phone && !applicant?.email && !applicant?.location && (
                    <p className="text-gray-400 text-xs italic">No contact info provided</p>
                  )}
                </div>
              </div>

              {/* Experience years */}
              {applicant?.experience_years != null && (
                <div className="mb-8">
                  <h3 className="text-gray-900 font-bold mb-3 text-sm uppercase tracking-wider">Experience</h3>
                  <p className="text-sm text-gray-700 font-semibold">
                    {applicant.experience_years} year{applicant.experience_years !== 1 ? 's' : ''} required
                  </p>
                </div>
              )}

            </div>

            {/* RIGHT — Work Experience, Education */}
            <div className="w-full md:w-2/3 p-8 bg-white">

              {/* Work Experience — from application form fields */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2">
                  <Briefcase size={18} /> Work Experience
                </h3>

                {applicant?.job_title_held ? (
                  <div className="relative pl-4 border-l-2 border-gray-200">
                    <h4 className="font-bold text-gray-800">{applicant.job_title_held}</h4>
                    {applicant.company_name && (
                      <p className="text-sm text-gray-500">{applicant.company_name}{applicant.work_city ? `, ${applicant.work_city}` : ''}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDateRange(applicant.work_from, applicant.work_to, applicant.currently_working)}
                    </p>
                    {applicant.work_description && (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{applicant.work_description}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No work experience provided.</p>
                )}
              </div>

              {/* Education — from application form fields */}
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2">
                  <GraduationCap size={18} /> Education
                </h3>

                {applicant?.school_name ? (
                  <div className="relative pl-4 border-l-2 border-gray-200">
                    <h4 className="font-bold text-gray-800">
                      {[applicant.degree, applicant.major].filter(Boolean).join(' in ') || 'Degree not specified'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {applicant.school_name}{applicant.edu_city ? `, ${applicant.edu_city}` : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateRange(applicant.edu_from, applicant.edu_to, applicant.currently_studying)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No education info provided.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;