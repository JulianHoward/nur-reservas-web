import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getConfiguracion,
  updateConfiguracion,
  getPoliticas,
  updatePoliticas,
} from "../api/configuracion";

export default function Configuracion() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    dias_minimos_anticipacion: 2,
    duracion_maxima_horas: 8,
    horario_apertura_default: "08:00",
    horario_cierre_default: "22:00",
  });
  const [politicas, setPoliticas] = useState({
    prioridad_academico: false,
    permitir_reservas_fines_semana: true,
    notificaciones_activas: true,
    dias_recordatorio: 1,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [configRes, politicasRes] = await Promise.all([
        getConfiguracion().catch(() => ({ data: config })),
        getPoliticas().catch(() => ({ data: politicas })),
      ]);
      if (configRes.data) setConfig(configRes.data);
      if (politicasRes.data) setPoliticas(politicasRes.data);
    } catch (err) {
      console.error("Error cargando configuración:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handlePoliticasChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPoliticas({
      ...politicas,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGuardarConfig = async () => {
    setSaving(true);
    try {
      await updateConfiguracion(config);
      alert("Configuración guardada exitosamente ✅");
    } catch (err) {
      console.error("Error guardando configuración:", err);
      alert(err.response?.data?.message || "Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarPoliticas = async () => {
    setSaving(true);
    try {
      await updatePoliticas(politicas);
      alert("Políticas guardadas exitosamente ✅");
    } catch (err) {
      console.error("Error guardando políticas:", err);
      alert(err.response?.data?.message || "Error al guardar políticas");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "#e74c3c" }}>
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 24 }}>Configuración del Sistema</h2>

      {/* Configuración General */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#003366" }}>Configuración General</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Días Mínimos de Anticipación:
            </label>
            <input
              type="number"
              name="dias_minimos_anticipacion"
              value={config.dias_minimos_anticipacion}
              onChange={handleConfigChange}
              min="0"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <small style={{ color: "#666" }}>
              Mínimo de días antes de la fecha del evento para solicitar reserva
            </small>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Duración Máxima (horas):
            </label>
            <input
              type="number"
              name="duracion_maxima_horas"
              value={config.duracion_maxima_horas}
              onChange={handleConfigChange}
              min="1"
              max="24"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <small style={{ color: "#666" }}>
              Duración máxima permitida para una reserva
            </small>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Horario Apertura Default:
            </label>
            <input
              type="time"
              name="horario_apertura_default"
              value={config.horario_apertura_default}
              onChange={handleConfigChange}
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
              Horario Cierre Default:
            </label>
            <input
              type="time"
              name="horario_cierre_default"
              value={config.horario_cierre_default}
              onChange={handleConfigChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleGuardarConfig}
          disabled={saving}
          style={{
            padding: "10px 20px",
            background: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>

      {/* Políticas Globales */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#003366" }}>Políticas Globales</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="prioridad_academico"
              checked={politicas.prioridad_academico}
              onChange={handlePoliticasChange}
              style={{ width: 20, height: 20 }}
            />
            <span>Prioridad para eventos académicos</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="permitir_reservas_fines_semana"
              checked={politicas.permitir_reservas_fines_semana}
              onChange={handlePoliticasChange}
              style={{ width: 20, height: 20 }}
            />
            <span>Permitir reservas en fines de semana</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="notificaciones_activas"
              checked={politicas.notificaciones_activas}
              onChange={handlePoliticasChange}
              style={{ width: 20, height: 20 }}
            />
            <span>Notificaciones automáticas activas</span>
          </label>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Días de Anticipación para Recordatorio:
            </label>
            <input
              type="number"
              name="dias_recordatorio"
              value={politicas.dias_recordatorio}
              onChange={handlePoliticasChange}
              min="0"
              max="7"
              style={{
                width: "100%",
                maxWidth: 200,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <small style={{ color: "#666" }}>
              Días antes del evento para enviar recordatorio
            </small>
          </div>
        </div>

        <button
          onClick={handleGuardarPoliticas}
          disabled={saving}
          style={{
            padding: "10px 20px",
            background: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Guardando..." : "Guardar Políticas"}
        </button>
      </div>
    </div>
  );
}

