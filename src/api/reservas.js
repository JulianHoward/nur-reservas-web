import { api } from "./client";

export const getReservasByUsuario = (usuarioId) =>
  api.get("/reservas", { params: { usuario_id: usuarioId } });

export const getMisReservas = () => api.get("/reservas/mis-reservas");

// Obtener todas las reservas (admin)
export const getAllReservas = (filtros = {}) => {
  return api.get("/reservas", { params: filtros });
};

// Obtener reservas por espacio
export const getReservasPorEspacio = (espacioId, filtros = {}) => {
  return api.get(`/reservas/espacio/${espacioId}`, { params: filtros });
};

// Ajuste para FormData
export const createReserva = (data, isFormData = false) => {
  const config = {};
  if (!isFormData) {
    config.headers = { "Content-Type": "application/json" };
  }
  return api.post("/reservas", data, config);
};

export const updateReserva = (id, data) => api.put(`/reservas/${id}`, data);
export const deleteReserva = (id) => api.delete(`/reservas/${id}`);
export const cancelarReserva = (id) => api.put(`/reservas/${id}/cancelar`);

// Aprobar reserva
export const aprobarReserva = (id) => api.put(`/reservas/${id}/aprobar`);

// Rechazar reserva
export const rechazarReserva = (id, motivo) => 
  api.put(`/reservas/${id}/rechazar`, { motivo_rechazo: motivo });

// Obtener disponibilidad de un espacio
export const getDisponibilidadEspacio = (espacioId, fechaInicio, fechaFin) => {
  return api.get(`/reservas/disponibilidad/${espacioId}`, {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  });
};

// Descargar documento de reserva
export const descargarDocumento = (reservaId, documentoId) => {
  return api.get(`/reservas/${reservaId}/documentos/${documentoId}`, {
    responseType: 'blob'
  });
};
