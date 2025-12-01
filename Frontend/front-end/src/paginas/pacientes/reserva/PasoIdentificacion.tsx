// src/paginas/pacientes/reserva/PasoIdentificacion.tsx
import React from "react";
import type { PacienteData } from "./types";

interface Props {
    data: PacienteData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const PasoIdentificacion: React.FC<Props> = ({
    data,
    onChange,
    onSubmit,
    isSubmitting,
}) => (
    <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Identificación del paciente
        </h2>
        <p className="text-center text-slate-600 mb-6">
            Usaremos estos datos para confirmar tu cita presencial.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
                name="rut"
                placeholder="RUT"
                value={data.rut}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
                name="fecha_nacimiento"
                type="date"
                value={data.fecha_nacimiento}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
                name="nombre"
                placeholder="Nombre"
                value={data.nombre}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
                name="apellido"
                placeholder="Apellidos"
                value={data.apellido}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
                name="email"
                placeholder="Correo electrónico"
                value={data.email}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
                name="telefono"
                placeholder="Teléfono móvil"
                value={data.telefono}
                onChange={onChange}
                className="border border-slate-300 rounded-lg px-3 py-2"
            />
        </div>
        <div className="mt-6 text-center">
            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
                {isSubmitting ? "Reservando..." : "Revisar y confirmar"}
            </button>
        </div>
    </div>
);
export default PasoIdentificacion;
