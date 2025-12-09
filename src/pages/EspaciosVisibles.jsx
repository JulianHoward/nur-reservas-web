// src/pages/EspaciosVisibles.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function EspaciosVisibles() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Cargando espacios...</p>;
  if (error) return <p>{error}</p>;

  if (espacios.length === 0) return <p>No hay espacios disponibles.</p>;

  return (
    <div>
      <h2>Espacios disponibles</h2>
      <ul>
        {espacios.map((e) => (
          <li key={e.id}>
            <strong>{e.nombre}</strong> - {e.tipo} - Capacidad: {e.capacidad}
          </li>
        ))}
      </ul>
    </div>
  );
}
