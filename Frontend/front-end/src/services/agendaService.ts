// src/services/agendaService.ts
import api from "./api";

export type EstadoHorario = "disponible" | "reservado" | "no_disponible" | "expirado";

export interface BloqueAgenda {
    id: number;
    inicio: string; // ISO
    fin: string;    // ISO
    estado: EstadoHorario;
    // paciente, cita, etc. pueden venir como null o anidados
}

// 📅 Obtener toda la agenda del kinesiólogo autenticado
export async function obtenerAgendaKine(): Promise<BloqueAgenda[]> {
    try {
        // OJO: en backend es /agendas/, no /agenda/
        const response = await api.get("/agendas/");
        return response.data as BloqueAgenda[];
    } catch (error: any) {
        console.error("Error al obtener agenda:", error.response?.data || error);
        throw error;
    }
}

// ➕ Crear nuevo bloque de agenda
export async function crearBloqueAgenda(bloque: { inicio: string; fin: string }) {
    try {
        const response = await api.post("/agendas/", bloque);
        return response.data as BloqueAgenda;
    } catch (error: any) {
        console.error("Error al crear bloque:", error.response?.data || error);
        throw error;
    }
}

// ✏️ Modificar bloque existente
export async function actualizarBloqueAgenda(id: number, bloque: Partial<BloqueAgenda>) {
    try {
        const response = await api.put(`/agendas/${id}/`, bloque);
        return response.data as BloqueAgenda;
    } catch (error: any) {
        console.error("Error al actualizar bloque:", error.response?.data || error);
        throw error;
    }
}

// ❌ Eliminar bloque de agenda
export async function eliminarBloqueAgenda(id: number) {
    try {
        const response = await api.delete(`/agendas/${id}/`);
        return response.data;
    } catch (error: any) {
        console.error("Error al eliminar bloque:", error.response?.data || error);
        throw error;
    }
}
