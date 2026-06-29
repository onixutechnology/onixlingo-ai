// Centralized API URL configuration
// IMPORTANT: In dev, we hardcode 127.0.0.1 because the backend (uvicorn) binds
// to 127.0.0.1:8022 (IPv4 only). Using "localhost" can resolve to ::1 (IPv6)
// on Windows, which causes "Failed to fetch" errors.
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.onixlingo.onixu.company'
  : 'http://127.0.0.1:8022';
