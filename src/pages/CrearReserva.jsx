// src/pages/CrearReserva.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function CrearReserva() {
  const [espacios, setEspacios] = useState([]);
  const [form, setForm] = useState({
    espacio_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_evento: "",
    asistentes: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar espacios visibles
  useEffect(() => {
    const fetchEspacios = async () => {
      try {
        const res = await api.get("/espacios/visibles");
        setEspacios(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar espacios");
      } finally {
        setLoading(false);
      }
    };
    fetchEspacios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await api.post("/reservas", form);
      setMensaje("Reserva creada con éxito 🎉");
      setForm({
        espacio_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_evento: "",
        asistentes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear reserva");
    }
  };

  if (loading) return <p>Cargando espacios...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Crear nueva reserva</h2>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Espacio:</label>
          <select
            name="espacio_id"
            value={form.espacio_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un espacio</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} - {e.tipo} - Capacidad: {e.capacidad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha Inicio:</label>
          <input
            type="datetime-local"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Fecha Fin:</label>
          <input
            type="datetime-local"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo de evento:</label>
          <input
            type="text"
            name="tipo_evento"
            value={form.tipo_evento}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Asistentes:</label>
          <input
            type="number"
            name="asistentes"
            value={form.asistentes}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <button type="submit">Crear Reserva</button>
      </form>
    </div>
  );
}
