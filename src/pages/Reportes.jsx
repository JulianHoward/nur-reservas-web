import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getReportesReservas,
  getEspaciosMasUtilizados,
  getEventosCancelados,
  exportarReportePDF,
  exportarReporteExcel,
  getEstadisticas,
} from "../api/reportes";
import { getEspaciosVisibles } from "../api/espacios";

export default function Reportes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reporteData, setReporteData] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [espacios, setEspacios] = useState([]);
  const [tipoReporte, setTipoReporte] = useState("reservas");
  const [filtros, setFiltros] = useState({
    espacio_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    tipo_evento: "",
    estado: "",
  });

  useEffect(() => {
    cargarEspacios();
    cargarEstadisticas();
  }, []);

  const cargarEspacios = async () => {
    try {
      const res = await getEspaciosVisibles();
      const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
      setEspacios(arr);
    } catch (err) {
      console.error("Error cargando espacios:", err);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const res = await getEstadisticas();
      setEstadisticas(res.data);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const generarReporte = async () => {
    setLoading(true);
    try {
      let res;
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      );

      switch (tipoReporte) {
        case "reservas":
          res = await getReportesReservas(filtrosLimpios);
          break;
        case "espacios-utilizados":
          res = await getEspaciosMasUtilizados(filtrosLimpios);
          break;
        case "cancelados":
          res = await getEventosCancelados(filtrosLimpios);
          break;
        default:
          res = await getReportesReservas(filtrosLimpios);
      }
      setReporteData(res.data);
    } catch (err) {
      console.error("Error generando reporte:", err);
      alert(err.response?.data?.message || "Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPDF = async () => {
    try {
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      );
      const res = await exportarReportePDF(filtrosLimpios);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exportando PDF:", err);
      alert("Error al exportar PDF");
    }
  };

  const handleExportarExcel = async () => {
    try {
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      );
      const res = await exportarReporteExcel(filtrosLimpios);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exportando Excel:", err);
      alert("Error al exportar Excel");
    }
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h2 style={{ color: "#003366", marginBottom: 24 }}>Reportes y Estadísticas</h2>

      {/* Estadísticas generales */}
      {estadisticas && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, color: "#555", fontSize: 14 }}>Total Reservas</h3>
            <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: "bold", color: "#003366" }}>
              {estadisticas.total_reservas || 0}
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, color: "#555", fontSize: 14 }}>Pendientes</h3>
            <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: "bold", color: "#f1c40f" }}>
              {estadisticas.pendientes || 0}
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, color: "#555", fontSize: 14 }}>Aprobadas</h3>
            <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: "bold", color: "#2ecc71" }}>
              {estadisticas.aprobadas || 0}
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, color: "#555", fontSize: 14 }}>Espacios Activos</h3>
            <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: "bold", color: "#003366" }}>
              {estadisticas.espacios_activos || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filtros y tipo de reporte */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#003366" }}>Generar Reporte</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Tipo de Reporte:
          </label>
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="reservas">Reservas por Filtros</option>
            <option value="espacios-utilizados">Espacios Más Utilizados</option>
            <option value="cancelados">Eventos Cancelados/Rechazados</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Espacio:</label>
            <select
              name="espacio_id"
              value={filtros.espacio_id}
              onChange={handleFiltroChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="">Todos</option>
              {espacios.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Fecha Inicio:</label>
            <input
              type="date"
              name="fecha_inicio"
              value={filtros.fecha_inicio}
              onChange={handleFiltroChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Fecha Fin:</label>
            <input
              type="date"
              name="fecha_fin"
              value={filtros.fecha_fin}
              onChange={handleFiltroChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Tipo de Evento:</label>
            <select
              name="tipo_evento"
              value={filtros.tipo_evento}
              onChange={handleFiltroChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="">Todos</option>
              <option value="académico">Académico</option>
              <option value="cultural">Cultural</option>
              <option value="deportivo">Deportivo</option>
              <option value="administrativo">Administrativo</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Estado:</label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={generarReporte}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
          {reporteData && (
            <>
              <button
                onClick={handleExportarPDF}
                style={{
                  padding: "10px 20px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Exportar PDF
              </button>
              <button
                onClick={handleExportarExcel}
                style={{
                  padding: "10px 20px",
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Exportar Excel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Resultados del reporte */}
      {reporteData && (
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#003366" }}>Resultados</h3>
          {Array.isArray(reporteData) && reporteData.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 16,
              }}
            >
              <thead style={{ background: "#003366", color: "#fff" }}>
                <tr>
                  {tipoReporte === "espacios-utilizados" ? (
                    <>
                      <th style={{ padding: 12, textAlign: "left" }}>Espacio</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Reservas</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Horas Totales</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: 12, textAlign: "left" }}>Espacio</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Fecha Inicio</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Fecha Fin</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Tipo</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Estado</th>
                      <th style={{ padding: 12, textAlign: "left" }}>Asistentes</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reporteData.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {tipoReporte === "espacios-utilizados" ? (
                      <>
                        <td style={{ padding: 12 }}>{item.espacio || item.nombre}</td>
                        <td style={{ padding: 12 }}>{item.total_reservas || 0}</td>
                        <td style={{ padding: 12 }}>{item.horas_totales || 0}</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 12 }}>
                          {item.espacio?.nombre || item.espacio_id}
                        </td>
                        <td style={{ padding: 12 }}>
                          {new Date(item.fecha_inicio).toLocaleString()}
                        </td>
                        <td style={{ padding: 12 }}>
                          {new Date(item.fecha_fin).toLocaleString()}
                        </td>
                        <td style={{ padding: 12 }}>{item.tipo_evento}</td>
                        <td style={{ padding: 12 }}>{item.estado}</td>
                        <td style={{ padding: 12 }}>{item.asistentes}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              No se encontraron resultados con los filtros seleccionados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

