import { api } from "./client";

export const getReservasByUsuario = (usuarioId) =>
  api.get("/reservas", { params: { usuario_id: usuarioId } });

export const getMisReservas = () => api.get("/reservas/mis-reservas");

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
