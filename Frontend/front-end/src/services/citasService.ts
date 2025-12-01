// src/services/citasService.ts
import api from "./api";

export type EstadoCita = "pendiente" | "completada" | "cancelada";

export interface PacienteResumen {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rut?: string;
    telefono?: string;
}

export interface Cita {
    id: number;
    fecha_hora: string; // coincide con el backend
    estado: EstadoCita;
    nota?: string | null;
    estado_pago: "pendiente" | "pagado" | "fallido";
    paciente: PacienteResumen;
    paciente_detalle?: PacienteResumen;
}

// 🔹 Obtener citas del kinesiólogo autenticado
export async function obtenerCitasKine(): Promise<Cita[]> {
    // El ViewSet ya filtra por kinesiologo autenticado
    const res = await api.get("/citas/");
    return res.data as Cita[];
}

// 🔹 Cambiar estado de una cita (pendiente/completada/cancelada)
export async function actualizarEstadoCita(id: number, estado: EstadoCita) {
    const res = await api.patch(`/citas/${id}/`, { estado });
    return res.data as Cita;
}

// 🔹 Reagendar cita (cambiar fecha_hora)
export async function reagendarCita(id: number, nuevaFechaHoraISO: string) {
    const res = await api.patch(`/citas/${id}/`, { fecha_hora: nuevaFechaHoraISO });
    return res.data as Cita;
}

// Actualizar nota de la cita
export async function actualizarNotaCita(id: number, nota: string) {
    const res = await api.patch(`/citas/${id}/`, { nota });
    return res.data as Cita;
}
