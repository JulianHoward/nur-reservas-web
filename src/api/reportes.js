import { api } from "./client";

// Obtener reportes de reservas con filtros
export const getReportesReservas = (filtros = {}) => {
  return api.get("/reportes/reservas", { params: filtros });
};

// Obtener espacios más utilizados
export const getEspaciosMasUtilizados = (filtros = {}) => {
  return api.get("/reportes/espacios-mas-utilizados", { params: filtros });
};

// Obtener reporte de eventos cancelados/rechazados
export const getEventosCancelados = (filtros = {}) => {
  return api.get("/reportes/eventos-cancelados", { params: filtros });
};

// Exportar reporte en PDF
export const exportarReportePDF = (filtros = {}) => {
  return api.get("/reportes/exportar-pdf", { 
    params: filtros,
    responseType: 'blob'
  });
};

// Exportar reporte en Excel
export const exportarReporteExcel = (filtros = {}) => {
  return api.get("/reportes/exportar-excel", { 
    params: filtros,
    responseType: 'blob'
  });
};

// Obtener estadísticas generales
export const getEstadisticas = () => {
  return api.get("/reportes/estadisticas");
};

