const API_URL = 'http://192.168.8.157:3000/api/auth'; 

// --- SIGNUP FUNCTIONS ---
export const registerEmployer = async (payload) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// --- NEW FORGOT PASSWORD FUNCTIONS ---
export const directPasswordReset = async (email, newPassword) => {
  const response = await fetch(`${API_URL}/reset-password-direct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  return response.json();
};