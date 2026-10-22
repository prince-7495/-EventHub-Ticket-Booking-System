// API Service - Centralized frontend API calls
// Uses environment variable VITE_API_URL for base URL

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_TIMEOUT = 5000; // 5 seconds timeout

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function with timeout
const fetchWithTimeout = (url, options = {}, timeout = API_TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('API request timeout')), timeout)
    ),
  ]);
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        status: response.status,
        message: error.message || 'API error',
        details: error.details,
      };
    }

    return response.json();
  } catch (error) {
    if (error.message === 'API request timeout') {
      throw {
        status: 408,
        message: 'Request timeout - Server took too long to respond',
      };
    }
    throw error;
  }
};

// Auth endpoints
export const authAPI = {
  login: (email) =>
    makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// Event endpoints
export const eventAPI = {
  getAll: () => makeRequest('/api/v1/events'),
  getById: (id) => makeRequest(`/api/v1/events/${id}`),
};

// Ticket endpoints
export const ticketAPI = {
  create: (eventId, quantity) =>
    makeRequest('/api/v1/tickets', {
      method: 'POST',
      body: JSON.stringify({ eventId, quantity }),
    }),
  getMyTickets: () => makeRequest('/api/v1/tickets/my'),
  updateStatus: (ticketId, status) =>
    makeRequest(`/api/v1/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export default { authAPI, eventAPI, ticketAPI };
