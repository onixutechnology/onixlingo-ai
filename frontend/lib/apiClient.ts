// frontend/lib/apiClient.ts
import axios from 'axios';
import Cookies from 'js-cookie';

let RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company/api/v1';

// Autodetección para usar el backend local si el frontend corre en localhost
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    RAW_URL = 'http://127.0.0.1:8000/api/v1';
}

const BASE_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api/v1`;

// Creamos la instancia base apuntando a tu FastAPI
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Solicitud: Inyectamos el token desde Cookies
apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de Respuesta: Manejo global de errores 401 (Sesión expirada)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpiamos las cookies de sesión
            Cookies.remove('access_token');
            Cookies.remove('username');

            // Redirigimos al login si no estamos ya allí
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
