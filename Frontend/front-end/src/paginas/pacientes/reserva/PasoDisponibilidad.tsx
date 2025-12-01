// src/paginas/pacientes/reserva/PasoDisponibilidad.tsx
import React, { useMemo, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { AgendaSlot, Kinesiologo } from "./types";

type TimeFilter = "all" | "manana" | "tarde";

interface Props {
    selectedKine: Kinesiologo | null;
    agendaSlots: AgendaSlot[];
    isLoading: boolean;
    onSelectSlot: (slot: AgendaSlot) => void;
    slotSeleccionado: AgendaSlot | null;
}

// helpers
const formatFechaSoloDia = (key: string) => {
    const [y, m, d] = key.split("-");
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString("es-CL", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });
};

const formatHora = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getWeekKeyFromDateKey = (dateKey: string) => {
    const [y, m, d] = dateKey.split("-");
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const tmp = new Date(date.getTime());
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const weekYear = tmp.getFullYear();
    const week1 = new Date(weekYear, 0, 4);
    const weekNumber =
        1 +
        Math.round(
            ((tmp.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7
        );
    return `${weekYear}-W${weekNumber}`;
};

const PasoDisponibilidad: React.FC<Props> = ({
    selectedKine,
    agendaSlots,
    isLoading,
    onSelectSlot,
    slotSeleccionado,
}) => {
    const [selectedDateKey, setSelectedDateKey] = useState<string>("");
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

    // Agrupar slots por fecha (YYYY-MM-DD)
    const slotsByDate = useMemo(() => {
        const groups: Record<string, AgendaSlot[]> = {};
        agendaSlots.forEach((slot) => {
            const dateKey = slot.inicio.split("T")[0];
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(slot);
        });
        // Ordenar fechas
        return Object.keys(groups)
            .sort()
            .reduce((acc, key) => {
                acc[key] = groups[key].sort(
                    (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
                );
                return acc;
            }, {} as Record<string, AgendaSlot[]>);
    }, [agendaSlots]);

    const allDates = Object.keys(slotsByDate);

    // Agrupar fechas por semana
    const semanas = useMemo(() => {
        const weeks: string[][] = [];
        let currentWeek: string[] = [];
        let lastWeekKey = "";

        allDates.forEach((dateKey) => {
            const wk = getWeekKeyFromDateKey(dateKey);
            if (wk !== lastWeekKey) {
                if (currentWeek.length > 0) weeks.push(currentWeek);
                currentWeek = [dateKey];
                lastWeekKey = wk;
            } else {
                currentWeek.push(dateKey);
            }
        });
        if (currentWeek.length > 0) weeks.push(currentWeek);
        return weeks;
    }, [allDates]);

    // Seleccionar primera fecha al cargar
    useEffect(() => {
        if (allDates.length > 0 && !selectedDateKey) {
            setSelectedDateKey(allDates[0]);
        }
    }, [allDates, selectedDateKey]);

    const semanaActual = semanas[currentWeekIndex] || [];
    const primeraFechaSemana = semanaActual[0];
    const ultimaFechaSemana = semanaActual[semanaActual.length - 1];

    const slotsDiaSeleccionado = slotsByDate[selectedDateKey] || [];

    const slotsFiltrados = useMemo(
        () =>
            slotsDiaSeleccionado.filter((slot) => {
                if (timeFilter === "all") return true;
                const hour = new Date(slot.inicio).getHours();
                if (timeFilter === "manana") return hour < 12;
                if (timeFilter === "tarde") return hour >= 12 && hour <= 21;
                return true;
            }),
        [slotsDiaSeleccionado, timeFilter]
    );

    const canGoPrevWeek = currentWeekIndex > 0;
    const canGoNextWeek = currentWeekIndex < semanas.length - 1;

    const goPrevWeek = () => {
        if (!canGoPrevWeek) return;
        const newIndex = currentWeekIndex - 1;
        setCurrentWeekIndex(newIndex);
        const nuevaSemana = semanas[newIndex];
        if (nuevaSemana && nuevaSemana.length > 0) {
            setSelectedDateKey(nuevaSemana[0]);
        }
    };

    const goNextWeek = () => {
        if (!canGoNextWeek) return;
        const newIndex = currentWeekIndex + 1;
        setCurrentWeekIndex(newIndex);
        const nuevaSemana = semanas[newIndex];
        if (nuevaSemana && nuevaSemana.length > 0) {
            setSelectedDateKey(nuevaSemana[0]);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)] gap-8">
            {/* Profesional */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 h-fit">
                {selectedKine ? (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {selectedKine.nombre.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">
                                    {selectedKine.nombre} {selectedKine.apellido}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {selectedKine.especialidad}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                            Modalidad: <strong>Consulta presencial</strong>
                        </p>
                        <p className="text-xs text-slate-500 mt-3">
                            * La dirección de la consulta será enviada a tu correo al
                            confirmar la cita.
                        </p>

                        {/* Resumen de selección */}
                        {slotSeleccionado && (
                            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <p className="text-xs font-semibold text-indigo-800 mb-1">
                                    ✓ Hora seleccionada
                                </p>
                                <p className="text-sm text-indigo-900 font-medium">
                                    {new Date(slotSeleccionado.inicio).toLocaleDateString("es-CL", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long"
                                    })}
                                </p>
                                <p className="text-lg font-bold text-indigo-700">
                                    {formatHora(slotSeleccionado.inicio)}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-slate-600">Selecciona primero un kinesiólogo.</p>
                )}
            </div>

            {/* Agenda */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Selecciona tu hora
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                    <strong>Paso 1:</strong> Elige un día disponible · <strong>Paso 2:</strong> Selecciona tu hora preferida
                </p>

                {isLoading ? (
                    <p className="text-center text-slate-600 mt-8">Cargando agenda...</p>
                ) : agendaSlots.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 font-medium mb-2">
                            No hay horarios disponibles
                        </p>
                        <p className="text-sm text-amber-700">
                            Este kinesiólogo no tiene bloques de atención configurados actualmente.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* header semana + filtros */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={goPrevWeek}
                                    disabled={!canGoPrevWeek}
                                    className={`p-2 rounded-full border text-slate-500 hover:bg-slate-100 ${!canGoPrevWeek
                                        ? "opacity-40 cursor-default"
                                        : "border-slate-300"
                                        }`}
                                >
                                    <FaChevronLeft size={14} />
                                </button>
                                <div className="text-sm text-slate-700">
                                    {primeraFechaSemana && ultimaFechaSemana ? (
                                        <>
                                            Semana del{" "}
                                            <span className="font-semibold">
                                                {formatFechaSoloDia(primeraFechaSemana)}
                                            </span>{" "}
                                            al{" "}
                                            <span className="font-semibold">
                                                {formatFechaSoloDia(ultimaFechaSemana)}
                                            </span>
                                        </>
                                    ) : (
                                        "Disponibilidad"
                                    )}
                                </div>
                                <button
                                    onClick={goNextWeek}
                                    disabled={!canGoNextWeek}
                                    className={`p-2 rounded-full border text-slate-500 hover:bg-slate-100 ${!canGoNextWeek
                                        ? "opacity-40 cursor-default"
                                        : "border-slate-300"
                                        }`}
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>

                            <div className="flex gap-2 text-xs md:text-sm">
                                <button
                                    onClick={() => setTimeFilter("all")}
                                    className={`px-3 py-1 rounded-full border ${timeFilter === "all"
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "border-slate-300 text-slate-600 bg-white"
                                        }`}
                                >
                                    Todos los horarios
                                </button>
                                <button
                                    onClick={() => setTimeFilter("manana")}
                                    className={`px-3 py-1 rounded-full border ${timeFilter === "manana"
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "border-slate-300 text-slate-600 bg-white"
                                        }`}
                                >
                                    Mañana
                                </button>
                                <button
                                    onClick={() => setTimeFilter("tarde")}
                                    className={`px-3 py-1 rounded-full border ${timeFilter === "tarde"
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "border-slate-300 text-slate-600 bg-white"
                                        }`}
                                >
                                    Tarde
                                </button>
                            </div>
                        </div>

                        {/* días de la semana */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {semanaActual.map((dateKey) => {
                                const activo = dateKey === selectedDateKey;
                                return (
                                    <button
                                        key={dateKey}
                                        onClick={() => setSelectedDateKey(dateKey)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${activo
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                                            }`}
                                    >
                                        {formatFechaSoloDia(dateKey)}
                                    </button>
                                );
                            })}
                        </div>

                        {/* horarios */}
                        {slotsFiltrados.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No hay horarios que coincidan con el filtro seleccionado.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {slotsFiltrados.map((slot: AgendaSlot) => {
                                    const isSelected = slotSeleccionado?.id === slot.id;
                                    return (
                                        <button
                                            key={slot.id}
                                            onClick={() => onSelectSlot(slot)}
                                            className={`px-4 py-2 border rounded-lg text-center font-medium transition-colors ${isSelected
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "border-slate-300 text-slate-800 hover:bg-indigo-600 hover:text-white"
                                                }`}
                                        >
                                            {formatHora(slot.inicio)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PasoDisponibilidad;
