// src/services/pacientesService.ts
import api from "./api";

export interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
}

// 👥 Lista de pacientes
// Nota: actualmente el backend devuelve todos los pacientes.
// Si luego quieres filtrarlos por kinesiólogo, habrá que ajustar el backend.
export async function obtenerPacientes(): Promise<Paciente[]> {
    try {
        const response = await api.get("/pacientes/");
        return response.data as Paciente[];
    } catch (error: any) {
        console.error("Error al obtener pacientes:", error.response?.data || error);
        throw error;
    }
}
