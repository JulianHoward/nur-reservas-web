import { api } from "./client";

export const getEspacios = () => api.get("/espacios");
export const getMisEspacios = () => api.get("/espacios/mis-espacios");
export const getEspacioById = (id) => api.get(`/espacios/${id}`);
export const createEspacio = (data) => api.post("/espacios", data);
export const updateEspacio = (id, data) => api.put(`/espacios/${id}`, data);
export const deleteEspacio = (id) => api.delete(`/espacios/${id}`);
// Trae espacios visibles para cualquier usuario logueado
export const getEspaciosVisibles = () => api.get("/espacios/visibles");
