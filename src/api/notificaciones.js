import { api } from "./client";

// Obtener todas las notificaciones del usuario
export const getNotificaciones = () => {
  return api.get("/notificaciones");
};

// Marcar notificación como leída
export const marcarLeida = (id) => {
  return api.put(`/notificaciones/${id}/leida`);
};

// Marcar todas como leídas
export const marcarTodasLeidas = () => {
  return api.put("/notificaciones/marcar-todas-leidas");
};

// Eliminar notificación
export const eliminarNotificacion = (id) => {
  return api.delete(`/notificaciones/${id}`);
};

// Obtener cantidad de notificaciones no leídas
export const getNotificacionesNoLeidas = () => {
  return api.get("/notificaciones/no-leidas");
};

