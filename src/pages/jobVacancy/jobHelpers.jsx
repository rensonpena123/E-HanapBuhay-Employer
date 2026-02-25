// ─── UI CONSTANTS ─────────────────────────────────────────────────────────────
export const STATUS_OPTIONS = ['Any', 'active', 'closed', 'filled', 'expired'];

export const JOB_TYPE_OPTIONS = ['Full-Time', 'Part-Time', 'Freelance', 'Contract'];

export const WORK_SETUP_OPTIONS = ['Onsite', 'Remote', 'Hybrid'];

export const ITEMS_PER_PAGE = 7;

// ─── STATUS DISPLAY HELPERS ──────────────────────────────────────────────────

/**
 * Returns Tailwind classes for the status badge.
 * Matches the DB constraint values: active | closed | filled | expired
 */
export const getStatusStyle = (status) => {
  switch (status) {
    case 'active':   return 'bg-green-50 text-green-600 border-green-200';
    case 'filled':   return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'expired':  return 'bg-orange-50 text-orange-500 border-orange-200';
    case 'closed':
    default:         return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

/**
 * Human-readable label for each status value.
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'active':   return 'Active';
    case 'filled':   return 'Filled';
    case 'expired':  return 'Expired';
    case 'closed':   return 'Closed';
    default:         return status ?? '—';
  }
};

/**
 * Format a DB ISO timestamp to a readable date string (e.g. Feb 23, 2026).
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};