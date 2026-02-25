import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';
import { getStatusStyle, getStatusLabel, formatDate } from './jobHelpers.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// DropdownMenu — rendered via React Portal into document.body so it is
// NEVER clipped by the table's overflow:hidden or any parent container.
// Position is calculated from the trigger button's bounding rect.
// ─────────────────────────────────────────────────────────────────────────────
const DropdownMenu = ({ job, triggerRect, onAction, onClose }) => {
  const menuRef = useRef(null);

  // Close when clicking anywhere outside the menu
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const MENU_WIDTH = 208;
  const MENU_EST_HEIGHT = 185;

  const left = Math.min(
    triggerRect.right - MENU_WIDTH,
    window.innerWidth - MENU_WIDTH - 8,
  );
  const openUpward = triggerRect.bottom + 4 + MENU_EST_HEIGHT > window.innerHeight;
  const top = openUpward
    ? triggerRect.top - MENU_EST_HEIGHT - 4
    : triggerRect.bottom + 4;

  const style = {
    position: 'fixed',
    top: `${Math.max(8, top)}px`,
    left: `${Math.max(8, left)}px`,
    width: `${MENU_WIDTH}px`,
    zIndex: 9999,
  };

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="bg-white border border-gray-100 rounded-xl shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-150"
    >
      <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-2 border-b border-gray-50">
        Manage
      </p>

      <ActionButton
        onClick={() => { onAction('edit', job); onClose(); }}
        icon={<Edit size={14} />}
        label="Edit Details"
      />

      <div className="border-t border-gray-100 my-1" />

      {job.status === 'active' ? (
        <>
          <ActionButton
            onClick={() => { onAction('fill', job); onClose(); }}
            icon={<Info size={14} />}
            label="Mark as Filled"
            color="text-blue-600"
          />
          <ActionButton
            onClick={() => { onAction('close', job); onClose(); }}
            icon={<XCircle size={14} />}
            label="Close Vacancy"
            color="text-gray-500"
          />
        </>
      ) : (
        <ActionButton
          onClick={() => { onAction('activate', job); onClose(); }}
          icon={<CheckCircle size={14} />}
          label="Activate"
          color="text-green-600"
        />
      )}

      <div className="border-t border-gray-100 my-1" />

      <ActionButton
        onClick={() => { onAction('delete', job); onClose(); }}
        icon={<Trash2 size={14} />}
        label="Delete"
        color="text-red-600"
      />
    </div>,
    document.body,
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// JobTable — main table component
// ─────────────────────────────────────────────────────────────────────────────
const JobTable = ({ jobs, onAction }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleTriggerClick = useCallback((e, job) => {
    e.stopPropagation();
    if (activeMenu?.jobId === job.id) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveMenu({ jobId: job.id, triggerRect: rect, job });
    }
  }, [activeMenu]);

  const closeMenu = useCallback(() => setActiveMenu(null), []);

  if (!jobs || jobs.length === 0) {
    return (
      <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
        <thead className="bg-[#1a263e] text-brand-yellow text-[11px] uppercase tracking-wider">
          <TableHeaders />
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="p-10 text-center text-gray-400 text-sm">
              No job vacancies found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <>
      <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
        <thead className="bg-[#1a263e] text-brand-yellow text-[11px] uppercase tracking-wider">
          <TableHeaders />
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              {/* Title */}
              <td className="p-4 font-medium text-gray-900 max-w-[200px]">
                <span className="block truncate">{job.title}</span>
                <span className="text-[10px] text-gray-400 font-semibold md:hidden">
                  {job.job_type} · {job.work_setup}
                </span>
              </td>

              {/* Company */}
              <td className="p-4 text-gray-600 hidden md:table-cell">
                {job.company_name ?? '—'}
              </td>

              {/* Category */}
              <td className="p-4 text-gray-600 hidden lg:table-cell">
                {job.category_name ?? '—'}
              </td>

              {/* Salary Range */}
              <td className="p-4 text-gray-600 hidden sm:table-cell text-sm whitespace-nowrap">
                {job.salary_min && job.salary_max
                  ? `₱${Number(job.salary_min).toLocaleString()} – ₱${Number(job.salary_max).toLocaleString()}`
                  : job.salary_min
                    ? `₱${Number(job.salary_min).toLocaleString()}+`
                    : '—'}
              </td>

              {/* Applications count */}
              <td className="p-4 text-center text-gray-600 hidden sm:table-cell">
                {job.application_count ?? 0}
              </td>

              {/* Posted Date */}
              <td className="p-4 text-center text-gray-500 text-sm hidden lg:table-cell">
                {formatDate(job.posted_at ?? job.created_at)}
              </td>

              {/* Status Badge */}
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusStyle(job.status)}`}>
                  {getStatusLabel(job.status)}
                </span>
              </td>

              {/* Three-dot trigger — NO relative/overflow here, dropdown lives in portal */}
              <td className="p-4 w-12">
                <button
                  onClick={(e) => handleTriggerClick(e, job)}
                  className={`p-2 rounded-full transition-colors ${
                    activeMenu?.jobId === job.id
                      ? 'bg-gray-200 text-gray-700'
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  aria-label="Open actions menu"
                >
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Portal dropdown — rendered directly into document.body, outside everything */}
      {activeMenu && (
        <DropdownMenu
          job={activeMenu.job}
          triggerRect={activeMenu.triggerRect}
          onAction={onAction}
          onClose={closeMenu}
        />
      )}
    </>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const TableHeaders = () => (
  <tr>
    <th className="p-4 font-bold">Job Title</th>
    <th className="p-4 font-bold hidden md:table-cell">Company</th>
    <th className="p-4 font-bold hidden lg:table-cell">Category</th>
    <th className="p-4 font-bold hidden sm:table-cell">Salary Range</th>
    <th className="p-4 text-center font-bold hidden sm:table-cell">Apps</th>
    <th className="p-4 text-center font-bold hidden lg:table-cell">Posted Date</th>
    <th className="p-4 text-center font-bold">Status</th>
    <th className="p-4 w-12" />
  </tr>
);

const ActionButton = ({ icon, label, onClick, color = 'text-gray-700' }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold hover:bg-gray-50 rounded-lg transition-colors ${color}`}
  >
    {icon} {label}
  </button>
);

export default JobTable;