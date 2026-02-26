import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Briefcase, FileText, Loader2, Building2 } from 'lucide-react';
import {
  createJobPost,
  updateJobPost,
  deleteJobPost,
  updateJobStatus,
  fetchCategories,
  fetchBarangays,
} from '../../api/jobVacancy.js';
import { JOB_TYPE_OPTIONS, WORK_SETUP_OPTIONS } from './jobHelpers.jsx';

// ── Default blank form (matches job_posts schema) ─────────────────────────────
const BLANK_FORM = {
  title: '',
  company_name: '',
  description: '',
  responsibilities: '',
  requirements: '',
  category_id: '',
  barangay_id: '',
  salary_min: '',
  salary_max: '',
  job_type: 'Full-Time',
  work_setup: 'Onsite',
  experience_years: 0,
};

// ── formatSalaryDisplay — "25000" → "25,000" ──────────────────────────────────
const formatSalaryDisplay = (raw) => {
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-PH');
};

// ── parseSalaryRaw — "25,000" → "25000" ──────────────────────────────────────
const parseSalaryRaw = (display) => String(display).replace(/,/g, '');

// ── SalaryInput — shows comma-formatted value, stores raw digits ──────────────
const SalaryInput = ({ value, onChange, placeholder }) => {
  const [displayValue, setDisplayValue] = useState(
    value ? formatSalaryDisplay(value) : '',
  );
  const inputRef = useRef(null);

  useEffect(() => {
    setDisplayValue(value ? formatSalaryDisplay(value) : '');
  }, [value]);

  const handleChange = (e) => {
    const raw = parseSalaryRaw(e.target.value);
    if (raw && !/^\d+$/.test(raw)) return;
    const formatted = raw ? formatSalaryDisplay(raw) : '';
    setDisplayValue(formatted);
    onChange(raw);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
        ₱
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className="w-full border-2 border-gray-100 rounded-xl pl-7 pr-3 py-3 text-sm focus:border-brand-yellow outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

// ── Action label helpers ──────────────────────────────────────────────────────
const ACTION_LABELS = {
  create:   { confirm: 'List Vacancy',  title: 'Create Job Vacancy' },
  edit:     { confirm: 'Save Changes',  title: 'Edit Vacancy' },
  delete:   { confirm: 'Delete',        title: 'Confirm Delete' },
  fill:     { confirm: 'Confirm',       title: 'Mark as Filled' },
  close:    { confirm: 'Confirm',       title: 'Close Vacancy' },
  activate: { confirm: 'Confirm',       title: 'Activate Vacancy' },
};

// ── Success messages per action type ─────────────────────────────────────────
const SUCCESS_MESSAGES = {
  create:   { title: 'Vacancy Posted!',    message: 'The job vacancy has been created successfully.' },
  edit:     { title: 'Changes Saved!',     message: 'The job vacancy has been updated successfully.' },
  delete:   { title: 'Vacancy Deleted',    message: 'The job vacancy has been removed from the system.' },
  fill:     { title: 'Marked as Filled',   message: 'The vacancy has been marked as filled.' },
  close:    { title: 'Vacancy Closed',     message: 'The vacancy has been closed successfully.' },
  activate: { title: 'Vacancy Activated',  message: 'The vacancy is now active and visible to applicants.' },
};

// ── JobModal — main modal (create / edit / confirm actions) ───────────────────
const JobModal = ({ type, data, onClose, onRefresh, onAlert }) => {
  const [formData, setFormData] = useState(() => {
    if (type === 'edit' && data) {
      return {
        title:            data.title            ?? '',
        company_name:     data.company_name     ?? '',
        description:      data.description      ?? '',
        responsibilities: data.responsibilities ?? '',
        requirements:     data.requirements     ?? '',
        category_id:      data.category_id      ?? '',
        barangay_id:      data.barangay_id      ?? '',
        salary_min:       data.salary_min       ?? '',
        salary_max:       data.salary_max       ?? '',
        job_type:         data.job_type         ?? 'Full-Time',
        work_setup:       data.work_setup        ?? 'Onsite',
        experience_years: data.experience_years  ?? 0,
      };
    }
    return { ...BLANK_FORM };
  });

  const [categories, setCategories] = useState([]);
  const [barangays,  setBarangays]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [refLoading, setRefLoading] = useState(false);

  const isForm = type === 'create' || type === 'edit';

  // Load reference dropdowns for form types
  useEffect(() => {
    if (!isForm) return;
    const loadRef = async () => {
      setRefLoading(true);
      try {
        const [cats, bars] = await Promise.all([
          fetchCategories(),
          fetchBarangays(),
        ]);
        setCategories(cats.data ?? cats ?? []);
        setBarangays(bars.data  ?? bars  ?? []);
      } catch {
        onAlert('error', 'Reference Data Error', 'Failed to load categories or barangays. Please close and try again.');
      } finally {
        setRefLoading(false);
      }
    };
    loadRef();
  }, [isForm]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ── handleConfirm — executes API action and triggers success/error alert ───
  const handleConfirm = async () => {
    // Validate required fields
    if (isForm && !formData.title.trim()) {
      onAlert('error', 'Validation Error', 'Job title is required before submitting.');
      return;
    }

    setLoading(true);
    try {
      if (type === 'create') {
        // Create job vacancy
        const salaryMin = formData.salary_min ? Number(parseSalaryRaw(formData.salary_min)) : null;
        const salaryMax = formData.salary_max ? Number(parseSalaryRaw(formData.salary_max)) : null;
        const payload = {
          title:            formData.title.trim(),
          company_name:     formData.company_name.trim() || null,
          description:      formData.description      || null,
          responsibilities: formData.responsibilities || null,
          requirements:     formData.requirements     || null,
          category_id:      formData.category_id      ? Number(formData.category_id) : null,
          barangay_id:      formData.barangay_id      ? Number(formData.barangay_id) : null,
          salary_min:       salaryMin,
          salary_max:       salaryMax,
          salary_range:     salaryMin && salaryMax ? `₱${salaryMin.toLocaleString()}-₱${salaryMax.toLocaleString()}` : null,
          job_type:         formData.job_type,
          work_setup:       formData.work_setup,
          experience_years: Number(formData.experience_years) || 0,
        };
        const res = await createJobPost(payload);
        if (!res.success && (res.error || res.message)) throw new Error(res.error || res.message);

      } else if (type === 'edit') {
        // Save changes to existing vacancy
        const salaryMin = formData.salary_min ? Number(parseSalaryRaw(formData.salary_min)) : null;
        const salaryMax = formData.salary_max ? Number(parseSalaryRaw(formData.salary_max)) : null;
        const payload = {
          title:            formData.title.trim(),
          company_name:     formData.company_name.trim() || null,
          description:      formData.description      || null,
          responsibilities: formData.responsibilities || null,
          requirements:     formData.requirements     || null,
          category_id:      formData.category_id      ? Number(formData.category_id) : null,
          barangay_id:      formData.barangay_id      ? Number(formData.barangay_id) : null,
          salary_min:       salaryMin,
          salary_max:       salaryMax,
          salary_range:     salaryMin && salaryMax ? `₱${salaryMin.toLocaleString()}-₱${salaryMax.toLocaleString()}` : null,
          job_type:         formData.job_type,
          work_setup:       formData.work_setup,
          experience_years: Number(formData.experience_years) || 0,
        };
        const res = await updateJobPost(data.id, payload);
        if (!res.success && (res.error || res.message)) throw new Error(res.error || res.message);

      } else if (type === 'delete') {
        // Delete vacancy
        const res = await deleteJobPost(data.id);
        if (!res.success && res.error) throw new Error(res.error);

      } else {
        // Status change: activate | fill | close
        const statusMap = { activate: 'active', fill: 'filled', close: 'closed' };
        const newStatus = statusMap[type];
        const res = await updateJobStatus(data.id, newStatus);
        if (!res.success && res.error) throw new Error(res.error);
      }

      // Success — close modal, refresh list, show success alert
      onRefresh();
      onClose();
      const { title, message } = SUCCESS_MESSAGES[type] ?? { title: 'Success!', message: 'Action completed.' };
      onAlert('success', title, message);

    } catch (err) {
      // Failed — close modal, show error alert
      onClose();
      onAlert('error', 'Action Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Portal render ─────────────────────────────────────────────────────────
  return createPortal(
    <>
      {/* Full-viewport overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 10000 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered modal panel */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10001 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
              {isForm
                ? <><FileText size={18} />{ACTION_LABELS[type]?.title}</>
                : ACTION_LABELS[type]?.title ?? 'Confirm Action'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="p-6 md:p-8 max-h-[78vh] overflow-y-auto">
            {isForm ? (
              refLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
                  <Loader2 size={22} className="animate-spin" /> Loading fields…
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Job Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none transition-all"
                      placeholder="e.g. Senior React Developer"
                    />
                  </div>

                  {/* Company Name — free-text input */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        className="w-full border-2 border-gray-100 rounded-xl pl-9 pr-3 py-3 text-sm focus:border-brand-yellow outline-none transition-all"
                        placeholder="e.g. Google, Jollibee, SM Supermalls…"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                      Type any company name — it doesn't need to be pre-listed.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Job Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleChange('category_id', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none bg-white"
                    >
                      <option value="">— Select Category —</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Barangay */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Barangay
                    </label>
                    <select
                      value={formData.barangay_id}
                      onChange={(e) => handleChange('barangay_id', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none bg-white"
                    >
                      <option value="">— Select Barangay —</option>
                      {barangays.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Job Type
                    </label>
                    <select
                      value={formData.job_type}
                      onChange={(e) => handleChange('job_type', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none bg-white"
                    >
                      {JOB_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Work Setup */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Work Setup
                    </label>
                    <select
                      value={formData.work_setup}
                      onChange={(e) => handleChange('work_setup', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none bg-white"
                    >
                      {WORK_SETUP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Salary Min */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Salary Min
                    </label>
                    <SalaryInput
                      value={formData.salary_min}
                      onChange={(raw) => handleChange('salary_min', raw)}
                      placeholder="e.g. 25,000"
                    />
                  </div>

                  {/* Salary Max */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Salary Max
                    </label>
                    <SalaryInput
                      value={formData.salary_max}
                      onChange={(raw) => handleChange('salary_max', raw)}
                      placeholder="e.g. 50,000"
                    />
                  </div>

                  {/* Live salary preview */}
                  {(formData.salary_min || formData.salary_max) && (
                    <div className="md:col-span-2 bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase">Preview:</span>
                      <span className="text-sm font-bold text-brand-dark">
                        {formData.salary_min && formData.salary_max
                          ? `₱${Number(parseSalaryRaw(formData.salary_min)).toLocaleString()} – ₱${Number(parseSalaryRaw(formData.salary_max)).toLocaleString()}`
                          : formData.salary_min
                            ? `₱${Number(parseSalaryRaw(formData.salary_min)).toLocaleString()}+`
                            : `Up to ₱${Number(parseSalaryRaw(formData.salary_max)).toLocaleString()}`}
                      </span>
                    </div>
                  )}

                  {/* Experience Years */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={(e) => handleChange('experience_years', e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none"
                    />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block" />

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Job Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none resize-none transition-all"
                      placeholder="Brief overview of the role…"
                    />
                  </div>

                  {/* Responsibilities */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Responsibilities
                    </label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) => handleChange('responsibilities', e.target.value)}
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none resize-none transition-all"
                      placeholder="Key duties and responsibilities…"
                    />
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleChange('requirements', e.target.value)}
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm focus:border-brand-yellow outline-none resize-none transition-all"
                      placeholder="Skills, qualifications, education…"
                    />
                  </div>

                </div>
              )
            ) : (
              // ── Confirmation dialog (delete / fill / close / activate) ──
              <div className="text-center py-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 ${
                  type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-brand-yellow/20 text-brand-yellow'
                }`}>
                  {type === 'delete' ? <Trash2 size={40} /> : <Briefcase size={40} />}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 capitalize">
                  {type === 'fill'     && 'Mark this vacancy as Filled?'}
                  {type === 'close'    && 'Close this vacancy?'}
                  {type === 'delete'   && 'Delete this vacancy?'}
                  {type === 'activate' && 'Activate this vacancy?'}
                </h4>
                <p className="text-gray-500 text-sm">
                  Target Listing:{' '}
                  <span className="font-bold text-brand-dark">"{data?.title}"</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-colors order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || refLoading}
                className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 order-1 sm:order-2 disabled:opacity-60 flex items-center justify-center gap-2
                  ${type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-dark hover:bg-[#243252]'}`}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {ACTION_LABELS[type]?.confirm ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default JobModal;