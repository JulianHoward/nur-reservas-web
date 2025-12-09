// src/pages/FormReserva.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEspaciosVisibles } from "../api/espacios";
import { createReserva, getDisponibilidadEspacio } from "../api/reservas";
import { useNavigate } from "react-router-dom";

export default function FormReserva() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [espacios, setEspacios] = useState([]);
  const [form, setForm] = useState({
    espacio_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_evento: "",
    asistentes: 1,
  });
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [verificando, setVerificando] = useState(false);

  // cargar espacios disponibles
  useEffect(() => {
    const cargarEspacios = async () => {
      try {
        const res = await getEspaciosVisibles();
        const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
        setEspacios(arr);
      } catch (err) {
        console.error("Error cargando espacios:", err);
        setError("No se pudieron cargar los espacios disponibles.");
      }
    };
    cargarEspacios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setDisponibilidad(null);
  };

  // Verificar disponibilidad cuando cambian espacio o fechas
  useEffect(() => {
    if (form.espacio_id && form.fecha_inicio && form.fecha_fin) {
      const verificarDisponibilidad = async () => {
        setVerificando(true);
        try {
          const res = await getDisponibilidadEspacio(
            form.espacio_id,
            form.fecha_inicio,
            form.fecha_fin
          );
          setDisponibilidad(res.data);
        } catch (err) {
          console.error("Error verificando disponibilidad:", err);
          setDisponibilidad({ disponible: false, mensaje: "Error al verificar disponibilidad" });
        } finally {
          setVerificando(false);
        }
      };
      const timeoutId = setTimeout(verificarDisponibilidad, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [form.espacio_id, form.fecha_inicio, form.fecha_fin]);

  const handleFileChange = (e) => {
    setArchivos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.espacio_id || !form.fecha_inicio || !form.fecha_fin || !form.tipo_evento) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    // Validar que fecha fin sea después de fecha inicio
    if (new Date(form.fecha_fin) <= new Date(form.fecha_inicio)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    // Validar disponibilidad
    if (disponibilidad && !disponibilidad.disponible) {
      setError(disponibilidad.mensaje || "El espacio no está disponible en ese horario.");
      return;
    }

    // Validar capacidad
    const espacioSeleccionado = espacios.find((e) => e.id === parseInt(form.espacio_id));
    if (espacioSeleccionado && form.asistentes > espacioSeleccionado.capacidad) {
      setError(
        `La cantidad de asistentes (${form.asistentes}) excede la capacidad del espacio (${espacioSeleccionado.capacidad}).`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Crear FormData
      const data = new FormData();
      data.append("usuario_id", user.id);
      data.append("espacio_id", form.espacio_id);
      data.append("fecha_inicio", form.fecha_inicio);
      data.append("fecha_fin", form.fecha_fin);
      data.append("tipo_evento", form.tipo_evento);
      data.append("asistentes", form.asistentes);

      archivos.forEach((file, idx) => {
        data.append("documentos", file); // backend debe aceptar "documentos" como array
      });

      await createReserva(data, true); // el segundo parámetro indica que es FormData
      alert("Reserva creada con éxito ✅");
      navigate("/dashboard/mis-reservas");
    } catch (err) {
      console.error("Error creando reserva:", err);
      const errorMsg = err.response?.data?.message || "Error al crear la reserva ❌";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const espacioSeleccionado = espacios.find((e) => e.id === parseInt(form.espacio_id));

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 24 }}>Nueva Reserva</h2>

      {error && (
        <div
          style={{
            background: "#fee",
            color: "#900",
            padding: 12,
            borderRadius: 4,
            marginBottom: 16,
            border: "1px solid #fcc",
          }}
        >
          {error}
        </div>
      )}

      {disponibilidad && (
        <div
          style={{
            background: disponibilidad.disponible ? "#efe" : "#fee",
            color: disponibilidad.disponible ? "#060" : "#900",
            padding: 12,
            borderRadius: 4,
            marginBottom: 16,
            border: `1px solid ${disponibilidad.disponible ? "#cfc" : "#fcc"}`,
          }}
        >
          {verificando ? "Verificando disponibilidad..." : disponibilidad.mensaje}
        </div>
      )}

      {espacioSeleccionado && (
        <div
          style={{
            background: "#e8f4f8",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#003366" }}>Información del Espacio</h3>
          <p style={{ margin: "4px 0" }}>
            <strong>Capacidad:</strong> {espacioSeleccionado.capacidad} personas
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Ubicación:</strong> {espacioSeleccionado.ubicacion}
          </p>
          {espacioSeleccionado.equipamiento && espacioSeleccionado.equipamiento.length > 0 && (
            <p style={{ margin: "4px 0" }}>
              <strong>Equipamiento:</strong>{" "}
              {Array.isArray(espacioSeleccionado.equipamiento)
                ? espacioSeleccionado.equipamiento.join(", ")
                : espacioSeleccionado.equipamiento}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Espacio: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="espacio_id"
            value={form.espacio_id}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="">-- Selecciona un espacio --</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} - Capacidad: {e.capacidad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Fecha y Hora Inicio: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Fecha y Hora Fin: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Tipo de Evento: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="tipo_evento"
            value={form.tipo_evento}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="">-- Selecciona tipo --</option>
            <option value="académico">Académico</option>
            <option value="cultural">Cultural</option>
            <option value="deportivo">Deportivo</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Cantidad de Asistentes: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="asistentes"
            min="1"
            max={espacioSeleccionado?.capacidad || 999}
            value={form.asistentes}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
          {espacioSeleccionado && (
            <small style={{ color: "#666", display: "block", marginTop: 4 }}>
              Máximo: {espacioSeleccionado.capacidad} personas
            </small>
          )}
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Documentos de respaldo (opcional):
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <small style={{ color: "#666", display: "block", marginTop: 4 }}>
            Puedes adjuntar múltiples archivos (carta, autorización, etc.)
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || verificando || (disponibilidad && !disponibilidad.disponible)}
          style={{
            padding: "12px 24px",
            background: loading || verificando || (disponibilidad && !disponibilidad.disponible)
              ? "#ccc"
              : "#003366",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor:
              loading || verificando || (disponibilidad && !disponibilidad.disponible)
                ? "not-allowed"
                : "pointer",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {loading ? "Creando..." : verificando ? "Verificando..." : "Crear Reserva"}
        </button>
      </form>
      </div>
    </div>
  );
}
