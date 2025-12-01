export interface Especialidad {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface Kinesiologo {
    id: number;
    nombre: string;
    apellido?: string;
    email?: string;
    especialidad: string;
    foto_url?: string | null;
    foto_perfil?: string;
    precio_consulta?: number;
    // Campos adicionales del backend
    atiende_consulta?: boolean;
    atiende_domicilio?: boolean;
    comuna?: string | null;
    region?: string | null;
    direccion_consulta?: string | null;
}

export interface AgendaSlot {
    id: number;
    kinesiologo: number;
    inicio: string;
    fin: string;
    estado: 'disponible' | 'reservado' | 'no_disponible' | 'expirado';
}

export interface PacienteData {
    nombre: string;
    apellido: string;
    rut: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    direccion_domicilio?: string;  // Para citas a domicilio
}

export interface BookingState {
    modoBusqueda: 'none' | 'profesional' | 'especialidad';
    especialidadSeleccionada?: Especialidad;
    kinesiologoSeleccionado?: Kinesiologo;
    slotSeleccionado?: AgendaSlot;
    pacienteData?: PacienteData;
    pasoActual: number;
    precioConsulta: number;
}

export const PRECIO_CONSULTA_DEFAULT = 25000;

export const PASOS = {
    INICIO: 0,
    ESPECIALIDAD: 1,
    KINESIOLOGO: 2,
    CALENDARIO: 3,
    PAGO: 4,
    CONFIRMACION: 5
};

// Export STEPS as an alias for compatibility
export const STEPS = [
    { id: 1, nombre: 'Especialidad', icon: () => null },
    { id: 2, nombre: 'Profesional', icon: () => null },
    { id: 3, nombre: 'Fecha', icon: () => null },
    { id: 4, nombre: 'Pago', icon: () => null }
];

// Export StepId type for type safety
export type StepId = typeof PASOS[keyof typeof PASOS];


