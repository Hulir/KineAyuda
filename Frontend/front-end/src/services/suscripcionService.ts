// src/services/suscripcionService.ts
import api from "./api";

export interface EstadoSuscripcion {
    activa: boolean;
    vence: string | null; // fecha de expiración o null
}

export interface MetodoPago {
    id: number;
    nombre: string;
    codigo_interno: string;
    activo: boolean;
}

// 💳 Obtener estado actual de la suscripción del kinesiólogo
export async function obtenerEstadoSuscripcion(): Promise<EstadoSuscripcion> {
    try {
        const response = await api.get("/pagos/estado/");
        return response.data as EstadoSuscripcion;
    } catch (error: any) {
        console.error("Error al obtener estado de suscripción:", error.response?.data || error);
        throw error;
    }
}

// 🧾 Listar métodos de pago disponibles (Transbank, etc.)
export async function obtenerMetodosPago(): Promise<MetodoPago[]> {
    try {
        const response = await api.get("/pagos/metodos/");
        return response.data as MetodoPago[];
    } catch (error: any) {
        console.error("Error al obtener métodos de pago:", error.response?.data || error);
        throw error;
    }
}

// 🆕 Iniciar pago de suscripción con Webpay
// monto en CLP, por ejemplo 4990
export async function iniciarSuscripcionWebpay(monto: number) {
    try {
        const response = await api.post("/pagos/webpay/iniciar/", { monto });
        // backend responde con: { mensaje, orden_comercio, url, token, nota }
        return response.data;
    } catch (error: any) {
        console.error("Error al iniciar suscripción Webpay:", error.response?.data || error);
        throw error;
    }
}
