const BASE_URL = 'http://192.168.8.157:3000/api/user';

const getToken = () => localStorage.getItem('token');

export const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || null;
  } catch {
    return null;
  }
};

export const fetchProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const saveProfile = async (userId, payload) => {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const saveBusiness = async (userId, payload) => {
  const res = await fetch(`${BASE_URL}/business/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const uploadAvatar = async (file) => {
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(`${BASE_URL}/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  return res.json();
};

export const uploadPermit = async (userId, file) => {
  const form = new FormData();
  form.append('permit', file);
  const res = await fetch(`${BASE_URL}/permit/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  return res.json();
};