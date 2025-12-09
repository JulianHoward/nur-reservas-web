// src/pages/ReservasPendientes.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { aprobarReserva, rechazarReserva } from "../api/reservas";

export default function ReservasPendientes() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [motivo, setMotivo] = useState("");

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/reservas?estado=pendiente");
      setReservas(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleAprobar = async (id) => {
    if (!window.confirm("¿Estás seguro de aprobar esta reserva?")) return;
    try {
      await aprobarReserva(id);
      alert("Reserva aprobada exitosamente ✅");
      fetchReservas();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleRechazar = async (id) => {
    const motivoInput = prompt("Ingrese motivo de rechazo:");
    if (!motivoInput || motivoInput.trim() === "") {
      alert("Debe ingresar un motivo de rechazo");
      return;
    }
    try {
      await rechazarReserva(id, motivoInput);
      alert("Reserva rechazada");
      fetchReservas();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const verDocumentos = (reserva) => {
    if (!reserva.documentos || reserva.documentos.length === 0) {
      alert("Esta reserva no tiene documentos adjuntos");
      return;
    }
    // Mostrar modal o lista de documentos
    const docsList = reserva.documentos
      .map((doc, idx) => `${idx + 1}. ${doc.nombre || doc}`)
      .join("\n");
    alert(`Documentos adjuntos:\n\n${docsList}`);
  };

  if (loading) return <div>Cargando reservas pendientes...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (reservas.length === 0) return <div>No hay reservas pendientes.</div>;

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 16 }}>Reservas Pendientes</h2>
      {reservas.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 48,
            borderRadius: 8,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ color: "#555", fontSize: 18 }}>No hay reservas pendientes</p>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#003366", color: "#fff" }}>
            <th style={{ padding: 12 }}>Espacio</th>
            <th style={{ padding: 12 }}>Usuario</th>
            <th style={{ padding: 12 }}>Fecha Inicio</th>
            <th style={{ padding: 12 }}>Fecha Fin</th>
            <th style={{ padding: 12 }}>Tipo de Evento</th>
            <th style={{ padding: 12 }}>Asistentes</th>
            <th style={{ padding: 12 }}>Documentos</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr 
              key={r.id} 
              style={{ 
                borderBottom: "1px solid #eee",
                transition: "0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              <td style={{ padding: 12 }}>{r.espacio?.nombre || r.espacio_id}</td>
              <td style={{ padding: 12 }}>{r.usuario?.nombre || r.usuario_id}</td>
              <td style={{ padding: 12 }}>{new Date(r.fecha_inicio).toLocaleString()}</td>
              <td style={{ padding: 12 }}>{new Date(r.fecha_fin).toLocaleString()}</td>
              <td style={{ padding: 12 }}>{r.tipo_evento}</td>
              <td style={{ padding: 12 }}>{r.asistentes}</td>
              <td style={{ padding: 12 }}>
                {r.documentos && r.documentos.length > 0 ? (
                  <button
                    onClick={() => verDocumentos(r)}
                    style={{
                      padding: "4px 8px",
                      background: "#0055a5",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    📎 Ver ({r.documentos.length})
                  </button>
                ) : (
                  <span style={{ color: "#999" }}>-</span>
                )}
              </td>
              <td style={{ padding: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleAprobar(r.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleRechazar(r.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
}
