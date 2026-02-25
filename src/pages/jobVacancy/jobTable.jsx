import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';
import { getStatusStyle } from './jobHelpers.jsx';

const JobTable = ({ jobs, onAction }) => {
  const [activeId, setActiveId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setActiveId(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
      <thead className="bg-[#1a263e] text-brand-yellow text-[11px] uppercase tracking-wider">
        <tr>
          <th className="p-4 font-bold">Job Title</th>
          <th className="p-4 font-bold hidden md:table-cell">Department</th>
          <th className="p-4 text-center font-bold">Positions</th>
          <th className="p-4 text-center font-bold hidden sm:table-cell">Applications</th>
          <th className="p-4 text-center font-bold hidden lg:table-cell">Posted Date</th>
          <th className="p-4 text-center font-bold">Status</th>
          <th className="p-4 w-10"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {jobs.map((job) => (
          <tr key={job.id} className="hover:bg-gray-50 transition-colors">
            <td className="p-4 font-medium text-gray-900">{job.title}</td>
            <td className="p-4 text-gray-600 hidden md:table-cell">{job.dept}</td>
            <td className="p-4 text-center text-gray-600">{job.pos}</td>
            <td className="p-4 text-center text-gray-600 hidden sm:table-cell">{job.apps}</td>
            <td className="p-4 text-center text-gray-500 text-sm hidden lg:table-cell">{job.date}</td>
            <td className="p-4 text-center">
              <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusStyle(job.status)}`}>
                {job.status}
              </span>
            </td>
            <td className="p-4 relative">
              <button 
                onClick={() => setActiveId(activeId === job.id ? null : job.id)} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <MoreVertical size={18} />
              </button>

              {activeId === job.id && (
                <div ref={menuRef} className="absolute right-12 top-0 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-1 animate-in slide-in-from-right-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-2 border-b border-gray-50">Manage</p>
                  
                  {/* Edit is always available */}
                  <ActionButton onClick={() => { onAction('edit', job); setActiveId(null); }} icon={<Edit size={14}/>} label="Edit Details" />
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  {/* CONTEXT AWARE STATUS LOGIC */}
                  {job.status === 'Active' ? (
                    <>
                      <ActionButton 
                        onClick={() => { onAction('fill', job); setActiveId(null); }} 
                        icon={<Info size={14}/>} 
                        label="Mark as Filled" 
                        color="text-blue-600" 
                      />
                      <ActionButton 
                        onClick={() => { onAction('close', job); setActiveId(null); }} 
                        icon={<XCircle size={14}/>} 
                        label="Close Vacancy" 
                        color="text-gray-500" 
                      />
                    </>
                  ) : (
                    <ActionButton 
                      onClick={() => { onAction('activate', job); setActiveId(null); }} 
                      icon={<CheckCircle size={14}/>} 
                      label="Activate" 
                      color="text-green-600" 
                    />
                  )}

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <ActionButton onClick={() => { onAction('delete', job); setActiveId(null); }} icon={<Trash2 size={14}/>} label="Delete" color="text-red-600" />
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ActionButton = ({ icon, label, onClick, color = "text-gray-700" }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold hover:bg-gray-50 rounded-lg transition-colors ${color}`}
  >
    {icon} {label}
  </button>
);

export default JobTable;