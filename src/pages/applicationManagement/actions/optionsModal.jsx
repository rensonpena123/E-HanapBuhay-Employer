import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import AlertModal from "../../../components/alertModal.jsx";
import { updateApplicationStatus } from "../../../api/applications.js";

const UpdateStatusModal = ({ isOpen, onClose, applicant, onStatusUpdated }) => {
  // visible drives CSS enter/exit animation separately from isOpen
  const [visible,  setVisible]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [alert,    setAlert]    = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // Sync visible with isOpen for smooth enter/exit
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const closeAlert = () => {
    const wasSuccess = alert.type === 'success';
    setAlert(prev => ({ ...prev, isOpen: false }));
    if (wasSuccess) onStatusUpdated();
  };

  // getStatusColor — display colour for current status label
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'hired':       return 'text-green-600';
      case 'shortlisted': return 'text-blue-600';
      case 'rejected':    return 'text-red-500';
      case 'submitted':
      case 'viewed':      return 'text-brand-yellow';
      default:            return 'text-gray-600';
    }
  };

  // handleAction — calls PATCH /api/applications/:id/status and shows alert
  const handleAction = async (newStatus) => {
    if (!applicant?.id) return;
    setLoading(true);
    try {
      const res = await updateApplicationStatus(applicant.id, newStatus);
      if (res.success) {
        setAlert({
          isOpen:  true,
          type:    'success',
          title:   statusSuccessTitle(newStatus),
          message: `${applicant.name}'s application has been marked as ${newStatus}.`,
        });
      } else {
        setAlert({
          isOpen:  true,
          type:    'error',
          title:   'Update Failed',
          message: res.message || 'Could not update the application status. Please try again.',
        });
      }
    } catch {
      setAlert({
        isOpen:  true,
        type:    'error',
        title:   'Connection Error',
        message: 'Unable to reach the server. Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // animClass — slide-up in, slide-down out
  const backdropAnim = isOpen ? 'opacity-100' : 'opacity-0';
  const panelAnim    = isOpen
    ? 'animate-[modalSlideIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
    : 'animate-[modalSlideOut_0.20s_ease-in_forwards]';

  return (
    <>
      {/* Backdrop + panel */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ${backdropAnim}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden ${panelAnim}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-brand-dark px-6 py-4 flex items-center justify-between">
            <h2 className="text-white text-lg font-bold tracking-wide">Update Application Status</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={loading}>
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">

            {/* Applicant info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Applicant Name:</span>
                <span className="text-gray-900 font-bold text-base">{applicant?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Applied For:</span>
                <span className="text-gray-900 font-semibold">{applicant?.job_title ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Current Status:</span>
                <span className={`font-bold text-base ${getStatusColor(applicant?.status)}`}>
                  {applicant?.status}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-3">

              {/* Reject — red */}
              <button
                onClick={() => handleAction('rejected')}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                Reject
              </button>

              {/* Hire — green */}
              <button
                onClick={() => handleAction('hired')}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm"
              >
                Hire
              </button>

              {/* Shortlist — blue (distinct from Reject red) */}
              <button
                onClick={() => handleAction('shortlisted')}
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-md transition-colors shadow-sm"
              >
                Shortlist
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Success / fail alert — overlays on top of everything */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </>
  );
};

// statusSuccessTitle — friendly title per action for success alert
const statusSuccessTitle = (status) => {
  switch (status) {
    case 'rejected':    return 'Application Rejected';
    case 'hired':       return 'Applicant Hired! 🎉';
    case 'shortlisted': return 'Added to Shortlist';
    default:            return 'Status Updated';
  }
};

export default UpdateStatusModal;