// src/api/client.js
import axios from 'axios';

// En desarrollo, usar proxy de Vite. En producción, usar la URL completa
// Si VITE_API_URL está definida, usarla. Si no, en desarrollo usar proxy, en producción usar localhost:3000
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
const API_URL = import.meta.env.VITE_API_URL || 
  (isDev ? '/api' : 'http://localhost:3000');

// Debug: verificar la URL configurada
if (isDev) {
  console.log('🔧 Modo desarrollo detectado. API_URL:', API_URL);
}

// --- almacenamiento del token en localStorage ---
const TOKEN_KEY = 'nur_token';

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// --- instancia de axios ---
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// interceptor para adjuntar Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug: mostrar la URL completa que se está usando
  if (isDev) {
    const fullUrl = config.baseURL + config.url;
    console.log('🌐 Petición a:', fullUrl);
  }
  
  return config;
});

// opcional: interceptor de respuesta para manejar 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // si el backend responde 401, podrías limpiar token o redirigir
      // clearAuthToken();
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
