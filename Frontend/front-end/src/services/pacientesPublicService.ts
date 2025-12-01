// src/services/pacientesPublicService.ts
import api from "./api";

import type { PacienteData } from "../paginas/pacientes/reserva/types";

/**
 * Kinesiólogo visible en la agenda pública
 */
export interface KinePublico {
    id: number;
    nombre: string;
    apellido?: string;
    email?: string;
    especialidad: string;
    foto_url?: string | null;
    precio_consulta?: number;
    // Campos para filtros
    atiende_consulta?: boolean;
    atiende_domicilio?: boolean;
    comuna?: string | null;
    region?: string | null;
    direccion_consulta?: string | null;
}

/**
 * Slot / bloque disponible en la agenda pública
 */
export interface SlotPublico {
    id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    inicio: string;
    fin: string;  // El backend devuelve el fin en formato ISO completo
}

/**
 * Filtros para búsqueda avanzada de kinesiologos
 */
export interface FiltrosKinesiologo {
    especialidad?: string;
    precioMin?: number;
    precioMax?: number;
    domicilio?: boolean;
    consulta?: boolean;
    comuna?: string;
    region?: string;
    ordenarPor?: 'precio' | 'precio_desc' | 'nombre';
}

/**
 * Estadísticas para poblar los filtros
 */
export interface EstadisticasFiltros {
    especialidades: string[];
    comunas: string[];
    regiones: string[];
    precioRango: {
        min: number;
        max: number;
    };
    modalidades: {
        domicilio: number;
        consulta: number;
    };
}

/**
 * Reseña de un kinesiólogo
 */
export interface Resena {
    id: number;
    comentario: string;
    sentimiento: 'positiva' | 'neutral' | 'negativa';
    fecha_creacion: string;
    cita: {
        paciente: {
            nombre: string;
            apellido: string;
        };
    };
}

/**
 * Agenda pública de un kinesiólogo
 */
export async function obtenerAgendaPublica(
    kinesiologoId: number
): Promise<SlotPublico[]> {
    const resp = await api.get(`/public/kinesiologos/${kinesiologoId}/horas/`);
    return resp.data;
}

/**
 * Obtiene todas las especialidades disponibles de forma pública.
 */
export async function obtenerEspecialidadesPublicas(): Promise<string[]> {
    try {
        const kines = await obtenerKinesiologosPublicos();
        const especialidadesUnicas = [...new Set(kines.map((k) => k.especialidad))];
        return especialidadesUnicas;
    } catch (error) {
        console.error("Error obteniendo especialidades:", error);
        return [];
    }
}

/**
 * Obtiene kinesiólogos públicos con filtros avanzados.
 */
export async function obtenerKinesiologosPublicos(
    filtros?: FiltrosKinesiologo
): Promise<KinePublico[]> {
    const params: Record<string, string | number | boolean> = {};

    if (filtros) {
        if (filtros.especialidad) params.especialidad = filtros.especialidad;
        if (filtros.precioMin !== undefined) params.precio_min = filtros.precioMin;
        if (filtros.precioMax !== undefined) params.precio_max = filtros.precioMax;
        if (filtros.domicilio !== undefined) params.atiende_domicilio = filtros.domicilio;
        if (filtros.consulta !== undefined) params.atiende_consulta = filtros.consulta;
        if (filtros.comuna) params.comuna = filtros.comuna;
        if (filtros.region) params.region = filtros.region;
        if (filtros.ordenarPor) {
            if (filtros.ordenarPor === 'precio') {
                params.ordering = 'precio_consulta';
            } else if (filtros.ordenarPor === 'precio_desc') {
                params.ordering = '-precio_consulta';
            } else {
                params.ordering = 'apellido';
            }
        }
    }

    const resp = await api.get("/public/kinesiologos/", { params });

    return resp.data as KinePublico[];
}

/**
 * Obtiene estadísticas para poblar los filtros de búsqueda
 */
export async function obtenerEstadisticasFiltros(): Promise<EstadisticasFiltros> {
    try {
        const resp = await api.get("/public/kinesiologos/estadisticas/");
        return resp.data as EstadisticasFiltros;
    } catch (error) {
        console.error("Error obteniendo estadísticas:", error);
        // Retornar valores por defecto en caso de error
        return {
            especialidades: [],
            comunas: [],
            regiones: [],
            precioRango: { min: 0, max: 100000 },
            modalidades: { domicilio: 0, consulta: 0 }
        };
    }
}

/**
 * Obtiene las reseñas de un kinesiólogo
 */
export async function obtenerResenasKinesiologo(kinesiologoId: number): Promise<Resena[]> {
    try {
        const resp = await api.get(`/public/kinesiologos/${kinesiologoId}/resenas/`);
        return resp.data as Resena[];
    } catch (error) {
        console.error("Error obteniendo reseñas:", error);
        return []; // Si no hay reseñas o hay error, retornar array vacío
    }
}

/**
 * Crear cita pública
 */
export async function crearCitaPublica(payload: {
    agenda_slot_id: number;
    paciente: PacienteData;
}) {
    await api.post("/public/agendar/", payload);
}
