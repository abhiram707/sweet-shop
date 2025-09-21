// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  SWEETS: {
    LIST: `${API_BASE_URL}/api/sweets`,
    SEARCH: `${API_BASE_URL}/api/sweets/search`,
    CREATE: `${API_BASE_URL}/api/sweets`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/sweets/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/sweets/${id}`,
    PURCHASE: (id: string) => `${API_BASE_URL}/api/sweets/${id}/purchase`,
    RESTOCK: (id: string) => `${API_BASE_URL}/api/sweets/${id}/restock`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};
