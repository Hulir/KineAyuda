// src/types/modelos.ts
export interface Kinesiologo {
  id: number;
  nombre: string;
  especialidad: string;
  correo: string;
  verificado: boolean;
}

export interface Paciente {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
}

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  paciente: Paciente;
  kinesiologo: Kinesiologo;
  estado: string;
}
