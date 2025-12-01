// src/services/resenasService.ts
import api from "./api";

export type SentimientoResena = "positiva" | "neutral" | "negativa";

export interface Resena {
    id: number;
    comentario: string;
    calificacion?: number;
    sentimiento: SentimientoResena | null;
    fecha_creacion: string;
}

// ============================================
// FASE 1: VALIDACIÓN IA Y ESTADÍSTICAS
// ============================================

export interface ValidacionSentimientoResponse {
    coincide: boolean;
    sentimiento_detectado: SentimientoResena;
    sugerencia: string;
    alerta_tipo: "info" | "warning";
    calificacion_enviada: number;
}

export interface EstadisticasResenas {
    total: number;
    promedio_calificacion: number;
    sentimientos: {
        positiva: number;
        neutral: number;
        negativa: number;
    };
    porcentajes: {
        positiva: number;
        neutral: number;
        negativa: number;
    };
    discrepancias: Array<{
        id: number;
        comentario: string;
        calificacion: number;
        sentimiento: string;
        fecha_creacion: string;
    }>;
}

// 🌟 Obtiene reseñas del kinesiólogo autenticado
export async function obtenerResenas(): Promise<Resena[]> {
    try {
        const response = await api.get("/reseñas/");
        return response.data as Resena[];
    } catch (error: any) {
        console.error("Error al obtener reseñas:", error.response?.data || error);
        throw error;
    }
}

// 🤖 Valida sentimiento del comentario antes de enviar reseña
export async function validarSentimiento(comentario: string, calificacion: number): Promise<ValidacionSentimientoResponse> {
    try {
        const response = await api.post("/public/validar-sentimiento/", {
            comentario,
            calificacion
        });
        return response.data;
    } catch (error: any) {
        console.error("Error al validar sentimiento:", error.response?.data || error);
        throw error;
    }
}

// 📊 Obtiene estadísticas de reseñas del kinesiólogo
export async function obtenerEstadisticasResenas(): Promise<EstadisticasResenas> {
    try {
        const response = await api.get("/kine/resenas/estadisticas/");
        return response.data;
    } catch (error: any) {
        console.error("Error al obtener estadísticas:", error.response?.data || error);
        throw error;
    }
}

// ============================================
// FASE 2: GR ÁFICOS Y ANALYTICS
// ============================================

export interface EvolucionMes {
    mes: string;
    total: number;
    positivas: number;
    neutrales: number;
    negativas: number;
}

export interface EvolucionResenas {
    evolucion: EvolucionMes[];
    meses_totales: number;
}

// 📈 Obtiene evolución temporal de sentimientos (para gráficos)
export async function obtenerEvolucionResenas(): Promise<EvolucionResenas> {
    try {
        const response = await api.get("/kine/resenas/evolucion/");
        return response.data;
    } catch (error: any) {
        console.error("Error al obtener evolución:", error.response?.data || error);
        throw error;
    }
}

export interface PalabraClave {
    palabra: string;
    frecuencia: number;
}

export interface PalabrasClaveResenas {
    positivas: PalabraClave[];
    negativas: PalabraClave[];
    total_positivas: number;
    total_negativas: number;
}

// 🔤 Obtiene palabras más frecuentes en reseñas
export async function obtenerPalabrasClave(): Promise<PalabrasClaveResenas> {
    try {
        const response = await api.get("/kine/resenas/palabras-clave/");
        return response.data;
    } catch (error: any) {
        console.error("Error al obtener palabras clave:", error.response?.data || error);
        throw error;
    }
}
