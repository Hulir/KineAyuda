// src/services/pagosService.ts
import api from "./api";

// Payload esperado por el backend para pagar una cita
export interface PagoCitaPayload {
    agenda_id: number;
    monto: number;
    email: string;
    rut: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    fecha_nacimiento?: string; // "YYYY-MM-DD"
}

export interface RespuestaInicioPagoCita {
    url: string;     // URL de Webpay
    token: string;   // token_ws
    cita_id: number; // id de la cita creada en estado pendiente
}

// 🆕 Iniciar pago de cita con Webpay (front público)
export async function iniciarPagoCita(payload: PagoCitaPayload) {
    try {
        const response = await api.post<RespuestaInicioPagoCita>(
            "/pagos/citas/webpay/iniciar/",
            payload
        );
        return response.data;
    } catch (error: any) {
        console.error("Error al iniciar pago de cita:", error.response?.data || error);
        throw error;
    }
}
