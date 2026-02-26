// API base for applications endpoint
const API_URL = 'http://192.168.8.157:3000/api/applications';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// fetchAllApplications — GET /api/applications/employer/all
// Returns all applications across all job posts owned by the logged-in employer
export const fetchAllApplications = async () => {
  const response = await fetch(`${API_URL}/employer/all`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

// updateApplicationStatus — PATCH /api/applications/:id/status
// Updates the status of a single application (submitted | shortlisted | hired | rejected)
export const updateApplicationStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method:  'PATCH',
    headers: getAuthHeaders(),
    body:    JSON.stringify({ status }),
  });
  return response.json();
};