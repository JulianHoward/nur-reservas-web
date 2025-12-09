// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // {id, nombre, correo, role, user_type}
  const [loading, setLoading] = useState(true);   // carga inicial (me)
  const [error, setError] = useState(null);       // errores de auth

  // Cargar sesión al iniciar (si hay token guardado)
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (err) {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- acciones de auth ---
  async function register(payload) {
    // payload: { nombre, apellido, correo, password, role?, user_type? }
    setError(null);
    const { data } = await api.post("/auth/register", payload);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login({ correo, password }) {
    setError(null);
    const { data } = await api.post("/auth/login", { correo, password });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function me() {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // si el backend ya invalidó o no existe, igual limpiamos
    } finally {
      clearAuthToken();
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, loading, error, register, login, me, logout, setError }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
