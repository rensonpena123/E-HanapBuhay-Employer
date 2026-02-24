import React, { useState } from 'react';
import { Briefcase, CheckCircle, Clock, Edit3, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import FilterBar from '../../components/filters/filterBar.jsx';
import FilterItem from '../../components/filters/filterItem.jsx';
import JobTable from './jobTable.jsx';
import JobModal from './jobModal.jsx';
import { initialJobs, STATUS_OPTIONS, DEPARTMENTS, ITEMS_PER_PAGE } from './jobHelpers.jsx';

const JobVacancy = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [filters, setFilters] = useState({ status: 'Any', dept: 'Any', dateFrom: '', dateTo: '', search: '' });
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = jobs.filter(job => {
    const searchMatch = job.title.toLowerCase().includes(filters.search.toLowerCase());
    const statusMatch = filters.status === 'Any' || job.status === filters.status;
    const deptMatch = filters.dept === 'Any' || job.dept === filters.dept;
    const jobDate = new Date(job.date);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    const dateMatch = (!fromDate || jobDate >= fromDate) && (!toDate || jobDate <= toDate);
    return searchMatch && statusMatch && deptMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentItems = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="bg-[#1a263e] p-4 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Job Vacancy Management</h1>
          <button 
            onClick={() => setModal({ isOpen: true, type: 'create' })} 
            className="w-full sm:w-auto bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} /> <span className="whitespace-nowrap">Create Job Vacancy</span>
          </button>
        </div>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Jobs" value={jobs.length} icon={Briefcase} />
          <StatCard title="Active" value={jobs.filter(j => j.status === 'Active').length} icon={CheckCircle} />
          <StatCard title="Pending" value={jobs.filter(j => j.status === 'Pending Review').length} icon={Clock} />
          <StatCard title="Filled" value={jobs.filter(j => j.status === 'Filled').length} icon={Edit3} />
        </div>
      </div>

      {/* Filter Bar handles responsiveness internally via your FilterBar component */}
      <FilterBar onClear={() => { setFilters({ status: 'Any', dept: 'Any', dateFrom: '', dateTo: '', search: '' }); setCurrentPage(1); }}>
        <FilterItem label="Range Date">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 text-sm outline-none w-full sm:w-auto" />
            <span className="text-brand-yellow font-bold text-xs hidden sm:inline">To</span>
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 text-sm outline-none w-full sm:w-auto" />
          </div>
        </FilterItem>
        <FilterItem label="Status">
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 w-full sm:w-44 text-sm outline-none">
            {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Department">
          <select value={filters.dept} onChange={(e) => setFilters({...filters, dept: e.target.value})} className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 w-full sm:w-44 text-sm outline-none">
            {DEPARTMENTS.map(dept => <option key={dept}>{dept}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <JobTable jobs={currentItems} onAction={(type, data) => setModal({ isOpen: true, type, data })} />
        </div>
        
        {/* Responsive Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500 font-medium order-2 sm:order-1">
            Showing {filteredJobs.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"><ChevronLeft size={18} /></button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg font-bold text-sm ${currentPage === i + 1 ? "bg-brand-yellow text-brand-dark shadow-md" : "text-gray-500 hover:bg-white"}`}>{i + 1}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {modal.isOpen && <JobModal type={modal.type} data={modal.data} onClose={() => setModal({ isOpen: false, type: '', data: null })} setJobs={setJobs} />}
    </div>
  );
};

export default JobVacancy;