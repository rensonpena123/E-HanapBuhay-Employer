const API_URL = 'http://192.168.8.157:3000/api/jobs';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchAllJobsAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/all`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const createJobPost = async (payload) => {
  const response = await fetch(`${API_URL}/admin/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const updateJobPost = async (id, payload) => {
  const response = await fetch(`${API_URL}/admin/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const updateJobStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/admin/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return response.json();
};

export const deleteJobPost = async (id) => {
  const response = await fetch(`${API_URL}/admin/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/admin/categories`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

// Hits: GET /api/jobs/admin/barangays
export const fetchBarangays = async () => {
  const response = await fetch(`${API_URL}/admin/barangays`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};