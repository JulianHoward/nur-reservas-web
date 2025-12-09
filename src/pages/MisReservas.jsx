import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function MisReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/reservas/mis-reservas");
        setReservas(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error al cargar reservas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que querés cancelar esta reserva?")) return;
    try {
      await api.put(`/reservas/${id}/cancelar`);
      setReservas((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, estado: "rechazado", motivo_rechazo: "Cancelada por el usuario" }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo cancelar la reserva");
    }
  };

  const estadoBadge = (estado) => {
    const colors = {
      pendiente: "#f1c40f",
      aprobado: "#2ecc71",
      rechazado: "#e74c3c",
    };
    return (
      <span
        style={{
          backgroundColor: colors[estado] || "#bdc3c7",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "12px",
          fontWeight: 500,
          fontSize: "0.85rem",
        }}
      >
        {estado}
      </span>
    );
  };

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16, color: "#003366" }}>Mis Reservas</h2>

      <div style={{ marginBottom: 16 }}>
        <Link to="/dashboard/nueva-reserva">
          <button
            style={{
              padding: "8px 16px",
              background: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            Crear nueva reserva
          </button>
        </Link>
      </div>

      {reservas.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#555" }}>
          No tenés reservas aún. ¡Animate a crear la primera! 🎉
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#003366", color: "#fff" }}>
            <tr>
              <th>Espacio</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Tipo</th>
              <th>Asistentes</th>
              <th>Estado</th>
              <th>Motivo Rechazo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: "1px solid #eee",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <td style={{ padding: 12 }}>{r.espacio?.nombre || r.espacio_id}</td>
                <td style={{ padding: 12 }}>{new Date(r.fecha_inicio).toLocaleString()}</td>
                <td style={{ padding: 12 }}>{new Date(r.fecha_fin).toLocaleString()}</td>
                <td style={{ padding: 12 }}>{r.tipo_evento}</td>
                <td style={{ padding: 12 }}>{r.asistentes}</td>
                <td style={{ padding: 12, textAlign: "center" }}>{estadoBadge(r.estado)}</td>
                <td style={{ padding: 12 }}>{r.motivo_rechazo || "-"}</td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {r.documentos && r.documentos.length > 0 && (
                      <span style={{ fontSize: 12, color: "#555" }}>
                        📎 {r.documentos.length}
                      </span>
                    )}
                    {r.estado === "pendiente" && (
                      <button
                        onClick={() => handleCancelar(r.id)}
                        style={{
                          padding: "4px 10px",
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
