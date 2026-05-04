// frontend/lib/apiClient.ts
import axios from 'axios';

// Creamos la instancia base apuntando a tu FastAPI
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
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