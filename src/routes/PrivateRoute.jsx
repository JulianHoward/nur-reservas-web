// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Cargando sesión…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
