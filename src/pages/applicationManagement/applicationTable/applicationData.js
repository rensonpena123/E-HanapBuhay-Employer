import { useState, useEffect, useCallback } from "react";
import { fetchAllApplications } from "../../../api/applications.js";

// useApplications — fetches real applications from the backend and exposes filter state
export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // filters — all controlled here and passed down to the page for real-time filtering
  const [filters, setFilters] = useState({
    dateFrom:   '',
    dateTo:     '',
    skills:     '',
    experience: '',
  });

  // loadApplications — fetches from backend, normalises status casing for display
  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetchAllApplications();
      const list = Array.isArray(res) ? res : (res.data ?? []);
      // Normalise status to Title Case for badge display
      const normalised = list.map(app => ({
        ...app,
        status: normaliseStatus(app.status),
      }));
      setApplications(normalised);
    } catch (err) {
      setError("Failed to fetch applications. Please try again.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // filteredApplications — pure client-side, recalculates on every filter or data change
  const filteredApplications = applications.filter((app) => {
    // Date range filter — based on applied_at
    const appliedDate = new Date(app.applied_at);
    const fromDate    = filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00') : null;
    const toDate      = filters.dateTo   ? new Date(filters.dateTo   + 'T23:59:59') : null;
    if (fromDate && appliedDate < fromDate) return false;
    if (toDate   && appliedDate > toDate)   return false;

    // Skills filter — checks if any submitted skill text matches
    if (filters.skills) {
      // skills may be a comma-separated string or we check work_description
      const skillText = (app.skills || app.work_description || '').toLowerCase();
      if (!skillText.includes(filters.skills.toLowerCase())) return false;
    }

    // Experience filter — matches experience_years range bucket
    if (filters.experience) {
      const years = Number(app.experience_years ?? 0);
      if (filters.experience === '0-1'  && !(years >= 0  && years <= 1))  return false;
      if (filters.experience === '1-2'  && !(years >= 1  && years <= 2))  return false;
      if (filters.experience === '3-5'  && !(years >= 3  && years <= 5))  return false;
      if (filters.experience === '5+'   && !(years > 5))                   return false;
    }

    return true;
  });

  // Stat counts from the full unfiltered list
  const stats = {
    total:       applications.length,
    hired:       applications.filter(a => a.status === 'Hired').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    pending:     applications.filter(a => a.status === 'Submitted' || a.status === 'Viewed').length,
    rejected:    applications.filter(a => a.status === 'Rejected').length,
  };

  const clearFilters = () => setFilters({ dateFrom: '', dateTo: '', skills: '', experience: '' });

  return {
    applications: filteredApplications,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    stats,
    reload: loadApplications,
  };
};

// normaliseStatus — maps DB lowercase values to display Title Case
const normaliseStatus = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'submitted':   return 'Submitted';
    case 'viewed':      return 'Viewed';
    case 'shortlisted': return 'Shortlisted';
    case 'hired':       return 'Hired';
    case 'rejected':    return 'Rejected';
    default:            return status ?? 'Unknown';
  }
};