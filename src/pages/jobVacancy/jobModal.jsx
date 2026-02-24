import React, { useState } from 'react';
import { X, Trash2, Briefcase, FileText } from 'lucide-react';
import { DEPARTMENTS } from './jobHelpers.jsx';

const JobModal = ({ type, data, onClose, setJobs }) => {
  const [formData, setFormData] = useState(data || { 
    title: '', 
    dept: 'Engineering', 
    pos: 1,
    description: '' 
  });

  const handleConfirm = () => {
    if (type === 'create') {
      const newJob = { 
        ...formData, 
        id: Date.now(), 
        apps: 0, 
        date: new Date().toISOString().split('T')[0], 
        status: 'Active' 
      };
      setJobs(prev => [newJob, ...prev]);
    } else if (type === 'edit') {
      setJobs(prev => prev.map(j => j.id === data.id ? { ...j, ...formData } : j));
    } else if (type === 'delete') {
      setJobs(prev => prev.filter(j => j.id !== data.id));
    } else {
      const statusMap = { activate: 'Active', fill: 'Filled', close: 'Closed' };
      setJobs(prev => prev.map(j => j.id === data.id ? { ...j, status: statusMap[type] } : j));
    }
    onClose();
  };

  const isForm = type === 'create' || type === 'edit';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
            {isForm ? <><FileText size={18}/> {type === 'create' ? 'Post New Vacancy' : 'Edit Vacancy'}</> : 'Confirm Action'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {isForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none transition-all"
                  placeholder="e.g. Senior React Developer"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Department</label>
                <select 
                  value={formData.dept}
                  onChange={(e) => setFormData({...formData, dept: e.target.value})}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none bg-white"
                >
                  {DEPARTMENTS.filter(d => d !== 'Any').map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Positions</label>
                <input 
                  type="number" 
                  value={formData.pos} 
                  onChange={(e) => setFormData({...formData, pos: e.target.value})}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Job Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none resize-none transition-all"
                  placeholder="Tell potential applicants about the role, requirements, and benefits..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 ${type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-brand-yellow/20 text-brand-yellow'}`}>
                {type === 'delete' ? <Trash2 size={40}/> : <Briefcase size={40}/>}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Proceed with {type}?</h4>
              <p className="text-gray-500 text-sm">Target Listing: <span className="font-bold text-brand-dark">"{data?.title}"</span></p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-colors order-2 sm:order-1">Cancel</button>
            <button 
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 order-1 sm:order-2 ${type === 'delete' ? 'bg-red-600' : 'bg-brand-dark'}`}
            >
              {isForm ? (type === 'create' ? 'List Vacancy' : 'Save Changes') : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;