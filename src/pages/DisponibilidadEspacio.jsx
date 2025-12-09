import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEspaciosVisibles } from "../api/espacios";
import { getReservasPorEspacio } from "../api/reservas";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

export default function DisponibilidadEspacio() {
  const { user } = useAuth();
  const [espacios, setEspacios] = useState([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState("");
  const [reservas, setReservas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [fechaFin, setFechaFin] = useState(
    format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEspacios();
  }, []);

  useEffect(() => {
    if (espacioSeleccionado) {
      cargarReservas();
    }
  }, [espacioSeleccionado, fechaInicio, fechaFin]);

  const cargarEspacios = async () => {
    try {
      const res = await getEspaciosVisibles();
      const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
      setEspacios(arr);
      if (arr.length > 0) {
        setEspacioSeleccionado(arr[0].id.toString());
      }
    } catch (err) {
      console.error("Error cargando espacios:", err);
    }
  };

  const cargarReservas = async () => {
    if (!espacioSeleccionado) return;
    setLoading(true);
    try {
      const res = await getReservasPorEspacio(espacioSeleccionado, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      setReservas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  const espacio = espacios.find((e) => e.id === parseInt(espacioSeleccionado));

  const dias = espacioSeleccionado
    ? eachDayOfInterval({
        start: new Date(fechaInicio),
        end: new Date(fechaFin),
      })
    : [];

  const getReservasDelDia = (dia) => {
    return reservas.filter((r) => isSameDay(new Date(r.fecha_inicio), dia));
  };

  const getEstadoHorario = (dia, hora) => {
    const reservasDia = getReservasDelDia(dia);
    const horaDate = new Date(dia);
    horaDate.setHours(parseInt(hora.split(":")[0]), parseInt(hora.split(":")[1]));

    for (const reserva of reservasDia) {
      const inicio = new Date(reserva.fecha_inicio);
      const fin = new Date(reserva.fecha_fin);
      if (horaDate >= inicio && horaDate < fin) {
        return {
          ocupado: true,
          estado: reserva.estado,
          reserva: reserva,
        };
      }
    }
    return { ocupado: false };
  };

  const horas = [];
  for (let h = 8; h <= 22; h++) {
    horas.push(`${h.toString().padStart(2, "0")}:00`);
  }

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 24 }}>Disponibilidad por Espacio</h2>

      {/* Filtros */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Espacio:
            </label>
            <select
              value={espacioSeleccionado}
              onChange={(e) => setEspacioSeleccionado(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="">Selecciona un espacio</option>
              {espacios.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Fecha Inicio:
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Fecha Fin:
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      </div>

      {/* Información del espacio */}
      {espacio && (
        <div
          style={{
            background: "#e8f4f8",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#003366" }}>{espacio.nombre}</h3>
          <p style={{ margin: "4px 0" }}>
            <strong>Ubicación:</strong> {espacio.ubicacion}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Capacidad:</strong> {espacio.capacidad} personas
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Horario:</strong> {espacio.hora_apertura?.slice(0, 5) || "08:00"} -{" "}
            {espacio.hora_cierre?.slice(0, 5) || "22:00"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Estado:</strong> {espacio.estado}
          </p>
        </div>
      )}

      {/* Tabla de disponibilidad */}
      {espacioSeleccionado && !loading && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 800,
            }}
          >
            <thead>
              <tr style={{ background: "#003366", color: "#fff" }}>
                <th style={{ padding: 12, textAlign: "left", position: "sticky", left: 0, background: "#003366", zIndex: 1 }}>Hora</th>
                {dias.map((dia) => (
                  <th key={dia.toISOString()} style={{ padding: 12, textAlign: "center", minWidth: 120 }}>
                    {format(dia, "EEE dd/MM")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora} style={{ borderBottom: "1px solid #eee" }}>
                  <td
                    style={{
                      padding: 8,
                      fontWeight: "bold",
                      position: "sticky",
                      left: 0,
                      background: "#fff",
                      zIndex: 1,
                    }}
                  >
                    {hora}
                  </td>
                  {dias.map((dia) => {
                    const estado = getEstadoHorario(dia, hora);
                    return (
                      <td
                        key={`${dia.toISOString()}-${hora}`}
                        style={{
                          padding: 4,
                          textAlign: "center",
                          backgroundColor: estado.ocupado
                            ? estado.estado === "aprobado"
                              ? "#d4edda"
                              : estado.estado === "pendiente"
                              ? "#fff3cd"
                              : "#f8d7da"
                            : "#f0f0f0",
                          border: "1px solid #ddd",
                        }}
                        title={
                          estado.ocupado
                            ? `${estado.reserva?.tipo_evento || ""} - ${estado.estado}`
                            : "Disponible"
                        }
                      >
                        {estado.ocupado && (
                          <div style={{ fontSize: 10, color: "#666" }}>
                            {estado.reserva?.tipo_evento?.slice(0, 3) || ""}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Leyenda */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 16,
              padding: 12,
              background: "#f9f9f9",
              borderRadius: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#f0f0f0",
                  border: "1px solid #ddd",
                }}
              />
              <span style={{ fontSize: 12 }}>Disponible</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#fff3cd",
                  border: "1px solid #ddd",
                }}
              />
              <span style={{ fontSize: 12 }}>Pendiente</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#d4edda",
                  border: "1px solid #ddd",
                }}
              />
              <span style={{ fontSize: 12 }}>Aprobado</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#f8d7da",
                  border: "1px solid #ddd",
                }}
              />
              <span style={{ fontSize: 12 }}>Rechazado</span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p>Cargando disponibilidad...</p>
        </div>
      )}

      {!espacioSeleccionado && (
        <div
          style={{
            background: "#fff",
            padding: 48,
            borderRadius: 8,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ color: "#555" }}>Selecciona un espacio para ver su disponibilidad</p>
        </div>
      )}
    </div>
  );
}

