// src/paginas/pacientes/reserva/components/CalendarioMensual.tsx
import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { AgendaSlot } from "../types";

interface Props {
    agendaSlots: AgendaSlot[];
    onSelectFecha: (fecha: Date) => void;
    fechaSeleccionada: Date | null;
}

const CalendarioMensual: React.FC<Props> = ({ agendaSlots, onSelectFecha, fechaSeleccionada }) => {
    const [mesActual, setMesActual] = useState(new Date());

    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    // Obtener días del mes
    const diasDelMes = useMemo(() => {
        const year = mesActual.getFullYear();
        const month = mesActual.getMonth();

        const primerDia = new Date(year, month, 1);
        const ultimoDia = new Date(year, month + 1, 0);

        // Ajustar para que Lunes sea el primer día (0 = Domingo en JS)
        let primerDiaSemana = primerDia.getDay();
        primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

        const dias: (Date | null)[] = [];

        // Días vacíos al inicio
        for (let i = 0; i < primerDiaSemana; i++) {
            dias.push(null);
        }

        // Días del mes
        for (let d = 1; d <= ultimoDia.getDate(); d++) {
            dias.push(new Date(year, month, d));
        }

        return dias;
    }, [mesActual]);

    // Verificar si un día tiene slots disponibles
    const tieneDisponibilidad = (fecha: Date | null) => {
        if (!fecha) return false;

        const fechaStr = fecha.toISOString().split('T')[0];

        const resultado = agendaSlots.some(slot => {
            try {
                const slotDate = new Date(slot.inicio);
                if (isNaN(slotDate.getTime())) {
                    console.warn('⚠️ Fecha inválida en slot:', slot.inicio);
                    return false;
                }
                const slotFecha = slotDate.toISOString().split('T')[0];

                const coincide = slotFecha === fechaStr && slot.estado === 'disponible';

                if (coincide) {
                    console.log('✅ Fecha con disponibilidad:', fechaStr, 'Slot:', slot);
                }

                return coincide;
            } catch (error) {
                console.error('Error parsing slot date:', slot.inicio, error);
                return false;
            }
        });

        return resultado;
    };

    // Verificar si es el día seleccionado
    const esDiaSeleccionado = (fecha: Date | null) => {
        if (!fecha || !fechaSeleccionada) return false;
        return fecha.toDateString() === fechaSeleccionada.toDateString();
    };

    // Verificar si es hoy
    const esHoy = (fecha: Date | null) => {
        if (!fecha) return false;
        const hoy = new Date();
        return fecha.toDateString() === hoy.toDateString();
    };

    const mesAnterior = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
    };

    const mesSiguiente = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
    };

    const nombreMes = mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
            {/* Header con navegación */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={mesAnterior}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <FaChevronLeft className="w-4 h-4 text-slate-600" />
                </button>

                <h3 className="text-lg font-bold text-slate-800 capitalize">
                    {nombreMes}
                </h3>

                <button
                    onClick={mesSiguiente}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <FaChevronRight className="w-4 h-4 text-slate-600" />
                </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                {diasSemana.map(dia => (
                    <div
                        key={dia}
                        className="text-center text-xs font-semibold text-slate-600 py-1.5"
                    >
                        {dia}
                    </div>
                ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1.5">
                {diasDelMes.map((fecha, index) => {
                    if (!fecha) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const disponible = tieneDisponibilidad(fecha);
                    const seleccionado = esDiaSeleccionado(fecha);
                    const hoy = esHoy(fecha);

                    return (
                        <button
                            key={index}
                            onClick={() => disponible && onSelectFecha(fecha)}
                            disabled={!disponible}
                            className={`
                aspect-square rounded-lg font-medium text-xs transition-all
                ${disponible ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                ${seleccionado
                                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                                    : disponible
                                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                                        : 'bg-slate-50 text-slate-300'
                                }
                ${hoy && !seleccionado ? 'ring-2 ring-indigo-400' : ''}
              `}
                        >
                            {fecha.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-50 border-2 border-indigo-200"></div>
                    <span className="text-slate-600">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-600"></div>
                    <span className="text-slate-600">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200"></div>
                    <span className="text-slate-600">No disponible</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarioMensual;
