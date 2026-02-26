import React, { useState } from "react";
import { Eye, MoreHorizontal, Loader2 } from "lucide-react";
import ViewModal from "../actions/viewModal.jsx";
import UpdateStatusModal from "../actions/optionsModal.jsx";

const ApplicantTable = ({ applicants, loading, error, onReload }) => {
  const [selectedApplicant,   setSelectedApplicant]   = useState(null);
  const [applicantForUpdate,  setApplicantForUpdate]  = useState(null);

  // getStatusColor — badge colours per status value
  const getStatusColor = (status) => {
    switch (status) {
      case "Hired":       return "bg-green-500 text-white";
      case "Shortlisted": return "bg-blue-500 text-white";
      case "Submitted":   return "bg-brand-yellow text-brand-dark font-medium";
      case "Viewed":      return "bg-purple-400 text-white";
      case "Rejected":    return "bg-red-500 text-white";
      default:            return "bg-gray-400 text-white";
    }
  };

  // handleStatusUpdated — called by UpdateStatusModal after a successful PATCH
  const handleStatusUpdated = () => {
    setApplicantForUpdate(null);
    onReload();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-medium">Loading applications…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#1a263e] text-brand-yellow text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-bold">Applicant Name</th>
                  <th className="py-4 px-6 font-bold">Applied For</th>
                  <th className="py-4 px-6 font-bold text-center">Experience</th>
                  <th className="py-4 px-6 font-bold text-center">Status</th>
                  <th className="py-4 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400 text-sm">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{app.name}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{app.job_title ?? '—'}</td>
                      <td className="py-4 px-6 text-center text-gray-800 font-medium">
                        {app.experience_years != null ? `${app.experience_years} yr${app.experience_years !== 1 ? 's' : ''}` : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">

                          {/* View Resume */}
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="p-2 rounded-full border border-gray-300 hover:bg-brand-yellow/20 hover:border-brand-yellow transition-colors cursor-pointer group"
                            title="View Resume"
                          >
                            <Eye size={18} className="text-gray-600 group-hover:text-brand-dark" />
                          </button>

                          {/* Update Status */}
                          <button
                            onClick={() => setApplicantForUpdate(app)}
                            className="p-2 rounded-full border border-gray-300 hover:bg-brand-dark/10 hover:border-brand-dark transition-colors cursor-pointer group"
                            title="Update Status"
                          >
                            <MoreHorizontal size={18} className="text-gray-600 group-hover:text-brand-dark" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Resume Modal — animated */}
      <ViewModal
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />

      {/* Update Status Modal — animated, success/fail AlertModal inside */}
      <UpdateStatusModal
        isOpen={!!applicantForUpdate}
        onClose={() => setApplicantForUpdate(null)}
        applicant={applicantForUpdate}
        onStatusUpdated={handleStatusUpdated}
      />
    </>
  );
};

export default ApplicantTable;