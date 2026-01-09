import axios from 'axios';
import { notify } from './notify';

// API Base URL from environment variable (falls back to localhost for development)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create a configured axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export for use in other files that need the raw URL
export { API_URL };

// Request Interceptor: Inject Tokens and Context
api.interceptors.request.use(
    (config) => {
        // 1. Auth Token
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 2. Organization Context
        const companyId = localStorage.getItem('current_company_id');
        if (companyId) {
            config.headers['x-company-id'] = companyId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling (Optional)
// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 1. Auto-handle 401 (Session Expired)
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            if (!window.location.pathname.includes('/login')) {
                // Optional: You could rely on RequireAuth to redirect, 
                // but explicit redirect ensures hard reset of state.
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // 2. Global Feedback for Common Errors
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;

        if (status === 403) {
            notify.error('No tienes permisos para realizar esta acción.');
        } else if (status === 404) {
            // Only notify if it's not a background check (optional, but good for UX)
            notify.error('El recurso solicitado no existe.');
        } else if (status >= 500) {
            notify.error('Error interno del servidor. Inténtalo más tarde.');
        } else if (error.code === 'ERR_NETWORK') {
            notify.error('Error de conexión. Verifica tu internet.');
        } else if (serverMessage && typeof serverMessage === 'string') {
            // If backend sends a specific friendly message, show it
            notify.error(serverMessage);
        } else {
            notify.error('Ocurrió un error inesperado.');
        }

        return Promise.reject(error);
    }
);
