// src/pages/ReservasPendientes.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

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
    try {
      await api.put(`/reservas/${id}/aprobar`);
      fetchReservas();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleRechazar = async (id) => {
    const motivoInput = prompt("Ingrese motivo de rechazo:");
    if (!motivoInput) return;
    try {
      await api.put(`/reservas/${id}/rechazar`, { motivo_rechazo: motivoInput });
      fetchReservas();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Cargando reservas pendientes...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (reservas.length === 0) return <div>No hay reservas pendientes.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Reservas Pendientes</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ background: "#003366", color: "#fff" }}>
            <th style={{ padding: 8 }}>Espacio</th>
            <th style={{ padding: 8 }}>Usuario</th>
            <th style={{ padding: 8 }}>Fecha Inicio</th>
            <th style={{ padding: 8 }}>Fecha Fin</th>
            <th style={{ padding: 8 }}>Tipo de Evento</th>
            <th style={{ padding: 8 }}>Asistentes</th>
            <th style={{ padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: 8 }}>{r.espacio?.nombre || r.espacio_id}</td>
              <td style={{ padding: 8 }}>{r.usuario_id}</td>
              <td style={{ padding: 8 }}>{new Date(r.fecha_inicio).toLocaleString()}</td>
              <td style={{ padding: 8 }}>{new Date(r.fecha_fin).toLocaleString()}</td>
              <td style={{ padding: 8 }}>{r.tipo_evento}</td>
              <td style={{ padding: 8 }}>{r.asistentes}</td>
              <td style={{ padding: 8, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleAprobar(r.id)}
                  style={{ padding: 6, background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleRechazar(r.id)}
                  style={{ padding: 6, background: "#dc3545", color: "#fff", border: "none", borderRadius: 4 }}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
