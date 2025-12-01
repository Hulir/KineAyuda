// src/paginas/pacientes/reserva/components/SelectorHoras.tsx
import React from "react";
import { FaClock } from "react-icons/fa";
import type { AgendaSlot } from "../types";

interface Props {
    fecha: Date;
    slots: AgendaSlot[];
    onSelectSlot: (slot: AgendaSlot) => void;
    slotSeleccionado?: AgendaSlot | null;
}

const SelectorHoras: React.FC<Props> = ({ fecha, slots, onSelectSlot, slotSeleccionado }) => {
    // Filtrar slots para la fecha seleccionada
    const slotsDelDia = slots.filter(slot => {
        const slotFecha = new Date(slot.inicio);
        return slotFecha.toDateString() === fecha.toDateString() && slot.estado === 'disponible';
    });

    // Agrupar por hora
    const slotsOrdenados = slotsDelDia.sort((a, b) => {
        return new Date(a.inicio).getTime() - new Date(b.inicio).getTime();
    });

    if (slotsOrdenados.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-600">No hay horarios disponibles para este día</p>
            </div>
        );
    }

    const formatearHora = (inicioIso: string, finIso: string) => {
        const inicio = new Date(inicioIso);
        const fin = new Date(finIso);

        const formato = (date: Date) => date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });

        return `${formato(inicio)} - ${formato(fin)}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <FaClock className="w-5 h-5 text-indigo-600" />
                <h4 className="text-lg font-semibold text-slate-800">
                    Horarios Disponibles
                </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slotsOrdenados.map((slot) => {
                    const estaSeleccionado = slotSeleccionado?.id === slot.id;

                    return (
                        <button
                            key={slot.id}
                            onClick={() => onSelectSlot(slot)}
                            className={`
                px-4 py-3 rounded-lg font-semibold text-sm transition-all
                ${estaSeleccionado
                                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                    : 'bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400'
                                }
              `}
                        >
                            {formatearHora(slot.inicio, slot.fin)}
                        </button>
                    );
                })}
            </div>

            {/* Siguiente hora disponible destacada */}
            {slotsOrdenados.length > 0 && !slotSeleccionado && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-green-800">
                        <strong>Siguiente hora disponible:</strong> {formatearHora(slotsOrdenados[0].inicio, slotsOrdenados[0].fin)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SelectorHoras;
