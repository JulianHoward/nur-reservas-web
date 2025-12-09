import { api } from "./client";

// Obtener configuración del sistema
export const getConfiguracion = () => {
  return api.get("/configuracion");
};

// Actualizar configuración
export const updateConfiguracion = (data) => {
  return api.put("/configuracion", data);
};

// Obtener políticas globales
export const getPoliticas = () => {
  return api.get("/configuracion/politicas");
};

// Actualizar políticas
export const updatePoliticas = (data) => {
  return api.put("/configuracion/politicas", data);
};

