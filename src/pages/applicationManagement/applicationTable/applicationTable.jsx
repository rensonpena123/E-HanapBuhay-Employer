import React, { useState } from "react";
import { Eye, MoreHorizontal, Loader2 } from "lucide-react";
import ViewModal from "../actions/viewModal.jsx"; 
import UpdateStatusModal from "../actions/optionsModal.jsx"; 

const ApplicantTable = ({ applicants, loading, error }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantForUpdate, setApplicantForUpdate] = useState(null);

  // Helper for table badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Hired": return "bg-green-500 text-white";
      case "Shortlisted": return "bg-red-400 text-white";
      case "Pending": return "bg-brand-yellow text-brand-dark font-medium";
      default: return "bg-gray-400 text-white";
    }
  };

  // Mock function to handle status updates
  const handleStatusUpdate = (id, newStatus) => {
    console.log(`Updating applicant ${id} to status: ${newStatus}`);
    setApplicantForUpdate(null); // Close modal after action
  };

  return (
    <>
      <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200 min-h-[400px]">
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading applicants...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-brand-dark text-brand-yellow">
              <tr>
                <th className="py-4 px-6 text-lg font-bold">Applicant Name</th>
                <th className="py-4 px-6 text-lg font-bold">Skills</th>
                <th className="py-4 px-6 text-lg font-bold text-center">Experience</th>
                <th className="py-4 px-6 text-lg font-bold text-center">Status</th>
                <th className="py-4 px-6 text-lg font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{app.name}</td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs leading-snug">{app.skills}</td>
                  <td className="py-4 px-6 text-center text-gray-800 font-medium">{app.exp}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      
                      {/* View Resume Button */}
                      <button 
                        onClick={() => setSelectedApplicant(app)}
                        className="p-2 rounded-full border border-gray-400 hover:bg-brand-yellow/20 hover:border-brand-yellow hover:text-brand-dark transition-colors cursor-pointer group"
                        title="View Resume"
                      >
                        <Eye size={18} className="text-gray-700 group-hover:text-brand-dark" />
                      </button>

                      {/* Update Status Button  */}
                      <button 
                        onClick={() => setApplicantForUpdate(app)}
                        className="p-2 rounded-full border border-gray-400 hover:bg-brand-dark/10 hover:border-brand-dark hover:text-brand-dark transition-colors cursor-pointer group"
                        title="Update Status"
                      >
                        <MoreHorizontal size={18} className="text-gray-700 group-hover:text-brand-dark" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RENDER MODALS */}
      
      {/*View Resume Modal */}
      {selectedApplicant && (
        <ViewModal 
          isOpen={true} 
          onClose={() => setSelectedApplicant(null)} 
          applicant={selectedApplicant} 
        />
      )}

      {/* Update Status Modal  */}
      {applicantForUpdate && (
        <UpdateStatusModal
          isOpen={true}
          onClose={() => setApplicantForUpdate(null)}
          applicant={applicantForUpdate}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default ApplicantTable;