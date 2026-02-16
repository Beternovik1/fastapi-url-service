import axios from 'axios';

// 1. Get the API URL from the environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 2. Create an Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Define the service methods used by App.jsx
export const urlService = {
  // Matches: await urlService.shorten(longUrl, alias) in App.jsx
  shorten: async (longUrl, customAlias) => {
    const payload = { 
      long_url: longUrl, 
      custom_alias: customAlias || undefined // Send undefined if alias is empty
    };
    const response = await api.post('/api/v1/shorten', payload);
    return response.data;
  },

  // Matches: await urlService.retrieve(searchId) in App.jsx
  retrieve: async (shortId) => {
    const payload = { short_id: shortId };
    const response = await api.post('/api/v1/retrieve', payload);
    return response.data;
  }
};