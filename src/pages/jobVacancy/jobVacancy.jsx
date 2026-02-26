import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, CheckCircle, Clock, XCircle, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import FilterBar from '../../components/filters/filterBar.jsx';
import FilterItem from '../../components/filters/filterItem.jsx';
import JobTable from './jobTable.jsx';
import JobModal from './jobModal.jsx';
import AlertModal from '../../components/alertModal.jsx';
import { fetchAllJobsAdmin } from '../../api/jobVacancy.js';
import { STATUS_OPTIONS, ITEMS_PER_PAGE, getStatusLabel } from './jobHelpers.jsx';

const JobVacancy = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({
    status: 'Any',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [modal, setModal]         = useState({ isOpen: false, type: '', data: null });
  const [currentPage, setCurrentPage] = useState(1);

  // ── Alert modal state ──────────────────────────────────────────────────────
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  // ── Show alert helper ──────────────────────────────────────────────────────
  const showAlert = useCallback((type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ── Fetch jobs from backend ────────────────────────────────────────────────
  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllJobsAdmin();
      // Support both { data: [...] } and plain array responses
      const list = Array.isArray(res) ? res : (res.data ?? []);
      setJobs(list);
    } catch (err) {
      showAlert('error', 'Failed to Load', 'Unable to load job vacancies. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ── Client-side filtering (real-time on every filter change) ───────────────
  const filteredJobs = jobs.filter((job) => {
    const searchTerm  = filters.search.toLowerCase().trim();
    const searchMatch = !searchTerm || job.title?.toLowerCase().includes(searchTerm);
    const statusMatch = filters.status === 'Any' || job.status === filters.status;
    const jobDate     = new Date(job.posted_at ?? job.created_at);
    // Normalize toDate to end-of-day so the selected day is fully included
    const fromDate    = filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00') : null;
    const toDate      = filters.dateTo   ? new Date(filters.dateTo   + 'T23:59:59') : null;
    const dateMatch   = (!fromDate || jobDate >= fromDate) && (!toDate || jobDate <= toDate);
    return searchMatch && statusMatch && dateMatch;
  });

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages   = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const currentItems = filteredJobs.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ── Stat card counts (from full unfiltered list) ───────────────────────────
  const totalJobs   = jobs.length;
  const activeJobs  = jobs.filter(j => j.status === 'active').length;
  const filledJobs  = jobs.filter(j => j.status === 'filled').length;
  const closedJobs  = jobs.filter(j => j.status === 'closed' || j.status === 'expired').length;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearFilters = () => setFilters({ status: 'Any', search: '', dateFrom: '', dateTo: '' });

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">

      {/* ── Header + Stats ── */}
      <div className="bg-[#1a263e] p-4 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Job Vacancy Management</h1>
            {!loading && (
              <p className="text-white/50 text-sm mt-1">{totalJobs} total vacancies in the system</p>
            )}
          </div>
          <button
            onClick={() => setModal({ isOpen: true, type: 'create', data: null })}
            className="w-full sm:w-auto bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="whitespace-nowrap">Create Job Vacancy</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value={loading ? '—' : totalJobs}
            icon={Briefcase}
          />
          <StatCard
            title="Active"
            value={loading ? '—' : activeJobs}
            icon={CheckCircle}
          />
          <StatCard
            title="Filled"
            value={loading ? '—' : filledJobs}
            icon={Clock}
          />
          <StatCard
            title="Closed / Expired"
            value={loading ? '—' : closedJobs}
            icon={XCircle}
          />
        </div>
      </div>

      {/* ── Filters (real-time — bound directly to state) ── */}
      <FilterBar onClear={clearFilters}>
        {/* Search */}
        <FilterItem label="Search">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search job title…"
            className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 text-sm outline-none w-full sm:w-52"
          />
        </FilterItem>

        {/* Date Range */}
        <FilterItem label="Date Range">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 text-sm outline-none w-full sm:w-auto"
            />
            <span className="text-brand-yellow font-bold text-xs hidden sm:inline">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 text-sm outline-none w-full sm:w-auto"
            />
          </div>
        </FilterItem>

        {/* Status */}
        <FilterItem label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="bg-[#2b3a55] text-white p-2 rounded border border-gray-600 w-full sm:w-44 text-sm outline-none"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'Any' ? 'Any' : getStatusLabel(opt)}
              </option>
            ))}
          </select>
        </FilterItem>
      </FilterBar>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Loading job vacancies…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <JobTable
              jobs={currentItems}
              onAction={(type, data) => setModal({ isOpen: true, type, data })}
            />
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium order-2 sm:order-1">
              Showing{' '}
              <span className="font-bold text-gray-700">
                {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredJobs.length)}
              </span>{' '}
              of <span className="font-bold text-gray-700">{filteredJobs.length}</span> vacancies
            </p>
            <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-bold text-sm transition-colors ${
                      safePage === i + 1
                        ? 'bg-brand-yellow text-brand-dark shadow-md'
                        : 'text-gray-500 hover:bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Job Action Modal ── */}
      {modal.isOpen && (
        <JobModal
          type={modal.type}
          data={modal.data}
          onClose={() => setModal({ isOpen: false, type: '', data: null })}
          onRefresh={loadJobs}
          onAlert={showAlert}
        />
      )}

      {/* ── Alert Response Modal ── */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default JobVacancy;