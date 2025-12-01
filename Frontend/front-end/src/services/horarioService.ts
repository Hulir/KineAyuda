// src/services/horarioService.ts
import api from "./api";

export interface HorarioKine {
    id?: number;
    hora_inicio: string;        // "08:00"
    hora_fin: string;           // "19:00"
    intervalo_minutos: number;  // 30, 45, 60...
    dias_activos: string[];     // ["lun","mar","mie",...]
}

// 🔹 Obtener horario guardado del kinesiólogo
export async function obtenerHorarioKine(): Promise<HorarioKine | null> {
    try {
        // TODO: reemplazar por tu endpoint real
        const res = await api.get("/kine/horario/");
        return res.data as HorarioKine;
    } catch (error) {
        console.warn("No se pudo cargar el horario del kinesiólogo:", error);
        return null;
    }
}

// 🔹 Guardar / actualizar horario del kinesiólogo
export async function guardarHorarioKine(
    datos: HorarioKine
): Promise<HorarioKine> {
    // TODO: si tu backend usa PUT/PATCH o necesita el id, ajusta esto
    const res = await api.post("/kine/horario/", datos);
    return res.data as HorarioKine;
}
