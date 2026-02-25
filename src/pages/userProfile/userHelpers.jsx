
export const INITIAL_PROFILE = {
  full_name:    '',
  email:        '',
  phone_number: '',
  location:     '',
  avatar_url:   null,
};

export const INITIAL_BUSINESS = {
  companyName:        '',
  companySize:        '',
  industry:           '',
  tinNumber:          '',   // DB column: tin_number
  permitUrl:          '',   // DB column: permit_url
  website:            '',
  headquarters:       '',
  description:        '',
  verificationStatus: 'pending',
  customIndustry:     '',
};

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

export const validatePassword = (current, newPass, confirm) => {
  if (!current)            return 'Please enter your current password.';
  if (newPass.length < 8)  return 'New password must be at least 8 characters.';
  if (newPass !== confirm)  return 'Passwords do not match.';
  return null;
};

// Maps to business_profiles.tin_number
export const validateTinNumber = (value) => {
  if (!value.trim()) return 'TIN (Tax Identification Number) is required.';
  const pattern = /^\d{3}-\d{3}-\d{3}(-\d{3})?$/;
  if (!pattern.test(value.trim())) {
    return 'Invalid TIN format. Use XXX-XXX-XXX or XXX-XXX-XXX-XXX (e.g. 123-456-789-000).';
  }
  return '';
};