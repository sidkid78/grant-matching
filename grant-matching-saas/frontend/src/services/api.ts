const API_BASE_URL = 'http://localhost:5000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export async function fetchGrants() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/grants`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch grants');
  }

  return response.json();
}

export async function fetchGrant(id: string) {
  return fetchWithAuth(`${API_BASE_URL}/grants/${id}`);
}

export async function fetchUserProfile() {
  return fetchWithAuth(`${API_BASE_URL}/profile`);
}

// Define an interface for the user profile data
interface UserProfileData {
  // Add specific fields expected in the user profile
  name: string;
  email: string;
  // Add other fields as necessary
}

export async function updateUserProfile(data: UserProfileData) {
  return fetchWithAuth(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadDocument(file: File) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload document');
  }

  return response.json();
}
