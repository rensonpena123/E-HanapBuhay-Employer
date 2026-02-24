// ─── Initial State ────────────────────────────────────────────────────────────
export const INITIAL_PROFILE = {
  username: 'John Doe',
  email: 'jdoe@gmail.com',
  avatar: null,
};

export const INITIAL_BUSINESS = {
  companyName: 'Tech Innovations Inc.',
  companySize: '51-200 employees',
  industry: 'Technology',
  registrationNumber: 'DTI-2024-001234',
  taxId: '123-456-789-000',
  customIndustry: '',
};

// ─── Dropdown Options ─────────────────────────────────────────────────────────
export const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

export const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education',
  'Retail', 'Manufacturing', 'Marketing', 'Other',
];

export const DOCUMENT_SLOTS = [
  { key: 'dti',    label: 'DTI Registration' },
  { key: 'sec',    label: 'SEC Registration'  },
  { key: 'mayors', label: "Mayor's Permit"    },
];

// ─── Password Validation ──────────────────────────────────────────────────────
export const validatePassword = (current, newPass, confirm) => {
  if (!current)             return 'Please enter your current password.';
  if (newPass.length < 8)   return 'New password must be at least 8 characters.';
  if (newPass !== confirm)  return 'Passwords do not match.';
  return null;
};

// ─── PH Registration Number Validation ───────────────────────────────────────
// Accepts: DTI-YYYY-XXXXXX or SEC-YYYY-XXXXXX (6-digit number)
export const validateRegistrationNumber = (value) => {
  if (!value.trim()) return 'Registration number is required.';
  const pattern = /^(DTI|SEC)-\d{4}-\d{6}$/i;
  if (!pattern.test(value.trim())) {
    return 'Invalid format. Use DTI-YYYY-XXXXXX or SEC-YYYY-XXXXXX (e.g. DTI-2024-001234).';
  }
  return '';
};

// ─── PH Tax Identification Number (TIN) Validation ───────────────────────────
// BIR TIN format: XXX-XXX-XXX or XXX-XXX-XXX-XXX (with optional branch code)
export const validateTaxId = (value) => {
  if (!value.trim()) return 'Tax ID (TIN) is required.';
  const pattern = /^\d{3}-\d{3}-\d{3}(-\d{3})?$/;
  if (!pattern.test(value.trim())) {
    return 'Invalid TIN format. Use XXX-XXX-XXX or XXX-XXX-XXX-XXX (e.g. 123-456-789-000).';
  }
  return '';
};