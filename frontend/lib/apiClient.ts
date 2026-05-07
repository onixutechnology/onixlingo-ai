// frontend/lib/apiClient.ts
import axios from 'axios';

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company/api/v1';
const BASE_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api/v1`;

// Creamos la instancia base apuntando a tu FastAPI
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Antes de que el mensaje salga, le pegamos el Gafete de Seguridad (Token)
apiClient.interceptors.request.use((config) => {
    // Asegurarnos de que estamos en el navegador (Next.js)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('onixlingo_access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;