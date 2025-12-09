import { useEffect, useState } from "react";
import { getEspacios, createEspacio, updateEspacio, deleteEspacio } from "../api/espacios";

export default function Espacios() {
  const [espacios, setEspacios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: "",
    equipamiento: "",
    estado: "disponible",
    hora_apertura: "08:00",
    hora_cierre: "22:00"
  });
  const [editingId, setEditingId] = useState(null);

  // Modal de confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = async () => {
    try {
      const res = await getEspacios();
      setEspacios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, equipamiento: form.equipamiento.split(",").map(e => e.trim()) };
      if (editingId) {
        await updateEspacio(editingId, data);
      } else {
        await createEspacio(data);
      }
      setForm({
        nombre: "",
        ubicacion: "",
        capacidad: "",
        equipamiento: "",
        estado: "disponible",
        hora_apertura: "08:00",
        hora_cierre: "22:00"
      });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (espacio) => {
    setEditingId(espacio.id);
    setForm({
      nombre: espacio.nombre,
      ubicacion: espacio.ubicacion,
      capacidad: espacio.capacidad,
      equipamiento: Array.isArray(espacio.equipamiento) ? espacio.equipamiento.join(", ") : espacio.equipamiento || "",
      estado: espacio.estado,
      hora_apertura: espacio.hora_apertura.slice(0,5),
      hora_cierre: espacio.hora_cierre.slice(0,5)
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEspacio(deleteId);
      setModalOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 16 }}>Gestión de Espacios</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 12,
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="capacidad"
          type="number"
          placeholder="Capacidad"
          value={form.capacidad}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="equipamiento"
          placeholder="Equipamiento (separado por comas)"
          value={form.equipamiento}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        >
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="time"
            name="hora_apertura"
            value={form.hora_apertura}
            onChange={handleChange}
            style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            type="time"
            name="hora_cierre"
            value={form.hora_cierre}
            onChange={handleChange}
            style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: 10,
            background: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <thead style={{ background: "#003366", color: "#fff" }}>
          <tr>
            <th style={{ padding: 12, textAlign: "left" }}>Nombre</th>
            <th style={{ padding: 12, textAlign: "left" }}>Ubicación</th>
            <th style={{ padding: 12, textAlign: "left" }}>Capacidad</th>
            <th style={{ padding: 12, textAlign: "left" }}>Equipamiento</th>
            <th style={{ padding: 12, textAlign: "left" }}>Estado</th>
            <th style={{ padding: 12, textAlign: "left" }}>Horario</th>
            <th style={{ padding: 12, textAlign: "left" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {espacios.map(e => (
            <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>{e.nombre}</td>
              <td style={{ padding: 12 }}>{e.ubicacion}</td>
              <td style={{ padding: 12 }}>{e.capacidad}</td>
              <td style={{ padding: 12 }}>{Array.isArray(e.equipamiento) ? e.equipamiento.join(", ") : e.equipamiento || ""}</td>
              <td style={{ padding: 12 }}>{e.estado}</td>
              <td style={{ padding: 12 }}>{e.hora_apertura.slice(0,5)} - {e.hora_cierre.slice(0,5)}</td>
              <td style={{ padding: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEdit(e)}
                  style={{
                    padding: 6,
                    background: "#0055a5",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(e.id)}
                  style={{
                    padding: 6,
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
            <p>¿Estás seguro de que deseas desactivar este espacio?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={confirmDelete}
                style={{
                  padding: 8,
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Sí, desactivar
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  padding: 8,
                  background: "#ccc",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
