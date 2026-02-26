import React from "react";
import StatCard from "../../components/statCard.jsx";
import FilterBar from "../../components/filters/filterBar.jsx";
import FilterItem from "../../components/filters/filterItem.jsx";
import ApplicantTable from "./applicationTable/applicationTable.jsx";
import { Briefcase, XCircle, Clock, BookMarked, UserX } from "lucide-react";
import { useApplications } from "./applicationTable/applicationData.js";

const ApplicationManagement = () => {
  const {
    applications,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    stats,
    reload,
  } = useApplications();

  const inputClass = "w-full h-full bg-brand-dark border border-gray-400 rounded-lg px-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow transition-colors text-sm";

  return (
    // Max width matches Job Vacancy Management (max-w-[1600px]) for uniform layout
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">

      {/* SECTION 1: Header & Stats */}
      <div className="bg-[#1a263e] p-4 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Application Management</h1>
            {!loading && (
              <p className="text-white/50 text-sm mt-1">{stats.total} total applications received</p>
            )}
          </div>
        </div>

        {/* Stat cards — driven by real DB data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={loading ? '—' : stats.total}       icon={Briefcase}  />
          <StatCard title="Shortlisted"         value={loading ? '—' : stats.shortlisted} icon={BookMarked} />
          <StatCard title="Pending / Viewed"    value={loading ? '—' : stats.pending}     icon={Clock}      />
          <StatCard title="Total Hired"         value={loading ? '—' : stats.hired}       icon={XCircle}    />
        </div>
      </div>

      {/* SECTION 2: Filter Bar — all filters are real-time and functional */}
      <FilterBar onClear={clearFilters}>

        {/* Date Range */}
        <FilterItem label="Date Range">
          <div className="flex items-center gap-2 h-full">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className={`${inputClass} w-40`}
            />
            <span className="text-brand-yellow font-bold text-sm shrink-0">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className={`${inputClass} w-40`}
            />
          </div>
        </FilterItem>

        {/* Skills — free-text search against applicant's work description */}
        <FilterItem label="Skills">
          <div className="w-56 h-full">
            <input
              type="text"
              value={filters.skills}
              onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="e.g. React, Node.js…"
              className={inputClass}
            />
          </div>
        </FilterItem>

        {/* Experience — bucket filter against job_posts.experience_years */}
        <FilterItem label="Experience">
          <div className="w-48 h-full">
            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className={inputClass}
            >
              <option value="">Any</option>
              <option value="0-1">0–1 Year</option>
              <option value="1-2">1–2 Years</option>
              <option value="3-5">3–5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
        </FilterItem>

      </FilterBar>

      {/* SECTION 3: Applicant Table */}
      <ApplicantTable
        applicants={applications}
        loading={loading}
        error={error}
        onReload={reload}
      />

    </div>
  );
};

export default ApplicationManagement;