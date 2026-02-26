const API_URL = 'http://192.168.8.157:3000/api/auth';

const getToken = () => localStorage.getItem('token');

// --- SIGNUP ---
export const registerEmployer = async (payload) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};

// --- LOGIN ---
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// --- FORGOT PASSWORD (unauthenticated — verifies email belongs to employer account) ---
export const directPasswordReset = async (email, newPassword) => {
  const response = await fetch(`${API_URL}/reset-password-direct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  return response.json();
};

// --- CHANGE PASSWORD (authenticated — requires Bearer token + current password verification) ---
export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response.json();
};