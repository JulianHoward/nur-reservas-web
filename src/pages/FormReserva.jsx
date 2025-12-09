// src/pages/FormReserva.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEspaciosVisibles } from "../api/espacios";
import { createReserva } from "../api/reservas";
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
  };

  const handleFileChange = (e) => {
    setArchivos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.espacio_id || !form.fecha_inicio || !form.fecha_fin || !form.tipo_evento) {
      alert("Por favor completa todos los campos.");
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
      alert(err.response?.data?.message || "Error al crear la reserva ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Nueva Reserva</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}
      >
        <label>
          Espacio:
          <select name="espacio_id" value={form.espacio_id} onChange={handleChange} required>
            <option value="">-- Selecciona un espacio --</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} - {e.tipo} - Capacidad: {e.capacidad}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha Inicio:
          <input type="datetime-local" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} required />
        </label>

        <label>
          Fecha Fin:
          <input type="datetime-local" name="fecha_fin" value={form.fecha_fin} onChange={handleChange} required />
        </label>

        <label>
          Tipo de Evento:
          <select name="tipo_evento" value={form.tipo_evento} onChange={handleChange} required>
            <option value="">-- Selecciona tipo --</option>
            <option value="académico">Académico</option>
            <option value="cultural">Cultural</option>
            <option value="deportivo">Deportivo</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </label>

        <label>
          Cantidad de Asistentes:
          <input type="number" name="asistentes" min="1" value={form.asistentes} onChange={handleChange} required />
        </label>

        <label>
          Documentos de respaldo (opcional):
          <input type="file" multiple onChange={handleFileChange} />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {loading ? "Creando..." : "Crear Reserva"}
        </button>
      </form>
    </div>
  );
}
