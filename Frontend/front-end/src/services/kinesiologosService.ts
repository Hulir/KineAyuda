// src/services/kinesiologosService.ts
import api from "./api";

export interface Kinesiologo {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rut: string;
    especialidad: string;
    nro_titulo: string;
    doc_verificacion: string;
    estado_verificacion: "pendiente" | "aprobado" | "rechazado";
    precio_consulta?: number;
    atiende_consulta?: boolean;
    atiende_domicilio?: boolean;
    direccion_consulta?: string;
    comuna?: string;
    comunas_domicilio?: string[];
    region?: string;
    // agrega aquí otros campos si los necesitas (foto_perfil, etc.)
}

// 👤 Obtener perfil del kinesiólogo autenticado
export async function obtenerPerfilKine(): Promise<Kinesiologo> {
    try {
        const response = await api.get("/me/");
        return response.data as Kinesiologo;
    } catch (error: any) {
        console.error("Error al obtener perfil:", error.response?.data || error);
        throw error;
    }
}

// ✏️ Actualizar perfil del kinesiólogo (parcial, usando PATCH)
export async function actualizarPerfilKine(
    datos: Partial<Kinesiologo>
): Promise<Kinesiologo> {
    try {
        // 1) primero obtenemos el perfil para saber el id
        const perfil = await obtenerPerfilKine();
        const id = perfil.id;

        // 2) enviamos sólo los campos que cambian
        const response = await api.patch(`/kinesiologos/${id}/`, datos);
        return response.data as Kinesiologo;
    } catch (error: any) {
        console.error("Error al actualizar perfil:", error.response?.data || error);
        throw error;
    }
}
