import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
} from "../api/notificaciones";

export default function Notificaciones() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
    // Recargar cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await getNotificaciones();
      setNotificaciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await marcarLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (err) {
      console.error("Error marcando notificación:", err);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch (err) {
      console.error("Error marcando todas:", err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta notificación?")) return;
    try {
      await eliminarNotificacion(id);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error eliminando notificación:", err);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTipoIcono = (tipo) => {
    const iconos = {
      aprobacion: "✅",
      rechazo: "❌",
      recordatorio: "⏰",
      nueva_solicitud: "📋",
      cancelacion: "🚫",
    };
    return iconos[tipo] || "📢";
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#003366", margin: 0 }}>Notificaciones</h2>
        {noLeidas > 0 && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#555" }}>
              {noLeidas} {noLeidas === 1 ? "no leída" : "no leídas"}
            </span>
            <button
              onClick={handleMarcarTodasLeidas}
              style={{
                padding: "8px 16px",
                background: "#003366",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 48,
            borderRadius: 8,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ color: "#555", fontSize: 18 }}>No tienes notificaciones</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notificaciones.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: notif.leida ? "#fff" : "#e8f4f8",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderLeft: notif.leida ? "4px solid transparent" : "4px solid #003366",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{getTipoIcono(notif.tipo)}</span>
                  <h3
                    style={{
                      margin: 0,
                      color: "#003366",
                      fontSize: 16,
                      fontWeight: notif.leida ? "normal" : "bold",
                    }}
                  >
                    {notif.titulo}
                  </h3>
                </div>
                <p style={{ margin: "8px 0", color: "#555", lineHeight: 1.5 }}>
                  {notif.mensaje}
                </p>
                <p style={{ margin: "8px 0 0", color: "#999", fontSize: 12 }}>
                  {formatFecha(notif.created_at || notif.fecha)}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                {!notif.leida && (
                  <button
                    onClick={() => handleMarcarLeida(notif.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Marcar leída
                  </button>
                )}
                <button
                  onClick={() => handleEliminar(notif.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

