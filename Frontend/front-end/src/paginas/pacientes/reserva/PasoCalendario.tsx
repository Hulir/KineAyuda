// src/paginas/pacientes/reserva/PasoCalendario.tsx
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaHome, FaBriefcase } from "react-icons/fa";
import { obtenerAgendaPublica, type KinePublico } from "../../../services/pacientesPublicService";
import CalendarioMensual from "./components/CalendarioMensual";
import SelectorHoras from "./components/SelectorHoras";
import type { AgendaSlot } from "./types";

interface Props {
    kinesiologo: KinePublico;
    onSelectSlot: (slot: AgendaSlot) => void;
}

const PasoCalendario: React.FC<Props> = ({ kinesiologo, onSelectSlot }) => {
    const [agendaSlots, setAgendaSlots] = useState<AgendaSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
    const [slotSeleccionado, setSlotSeleccionado] = useState<AgendaSlot | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                console.log('🔍 Cargando agenda para kinesiólogo:', kinesiologo.id);
                const data = await obtenerAgendaPublica(kinesiologo.id);
                console.log('📅 Slots recibidos del backend:', data);

                // Transform SlotPublico to AgendaSlot
                // El backend ya devuelve 'inicio' y 'fin' en formato ISO completo
                const transformedSlots: AgendaSlot[] = data.map(slot => ({
                    id: slot.id,
                    kinesiologo: kinesiologo.id,
                    inicio: slot.inicio,
                    fin: slot.fin || `${slot.fecha}T${slot.hora_fin}`, // Usar slot.fin del backend
                    estado: 'disponible' as const
                }));

                console.log('✅ Slots transformados:', transformedSlots);
                transformedSlots.forEach(s => {
                    console.log(`Slot ID ${s.id}: Inicio=${s.inicio} (${new Date(s.inicio).toString()}), Fin=${s.fin} (${new Date(s.fin).toString()})`);
                });
                setAgendaSlots(transformedSlots);
            } catch (error) {
                console.error("❌ Error al cargar agenda:", error);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [kinesiologo.id]);

    const handleSelectFecha = (fecha: Date) => {
        setFechaSeleccionada(fecha);
        setSlotSeleccionado(null); // Reset slot cuando cambia la fecha
    };

    const handleSelectSlot = (slot: AgendaSlot) => {
        setSlotSeleccionado(slot);
    };

    const handleContinuar = () => {
        if (slotSeleccionado) {
            onSelectSlot(slotSeleccionado);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header con info del profesional */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-start gap-4">
                    {kinesiologo.foto_url ? (
                        <img
                            src={kinesiologo.foto_url}
                            alt={`${kinesiologo.nombre} ${kinesiologo.apellido}`}
                            className="w-16 h-16 rounded-full border-3 border-white/40 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-3 border-white/40 flex-shrink-0">
                            <FaUser className="w-8 h-8" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">
                            {kinesiologo.nombre} {kinesiologo.apellido}
                        </h2>
                        <p className="text-white/90 text-sm mb-3">{kinesiologo.especialidad}</p>

                        {/* Modalidades de atención */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {kinesiologo.atiende_consulta && (
                                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                                    <FaBriefcase className="w-3.5 h-3.5" />
                                    En consulta
                                </span>
                            )}
                            {kinesiologo.atiende_domicilio && (
                                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                                    <FaHome className="w-3.5 h-3.5" />
                                    A domicilio
                                </span>
                            )}
                        </div>

                        {/* Dirección de atención */}
                        {kinesiologo.atiende_consulta && (kinesiologo.direccion_consulta || kinesiologo.comuna) && (
                            <div className="flex items-start gap-2 text-white/95 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    {kinesiologo.direccion_consulta && (
                                        <p className="font-medium">{kinesiologo.direccion_consulta}</p>
                                    )}
                                    <p className="text-white/80 text-xs">
                                        {kinesiologo.comuna}{kinesiologo.region && `, ${kinesiologo.region}`}
                                    </p>
                                </div>
                            </div>
                        )}
                        {kinesiologo.atiende_domicilio && !kinesiologo.atiende_consulta && kinesiologo.comuna && (
                            <div className="flex items-start gap-2 text-white/95 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-white/80 text-xs">
                                    Atiende en {kinesiologo.comuna}{kinesiologo.region && `, ${kinesiologo.region}`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Título */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                    <FaCalendarAlt className="w-6 h-6 text-indigo-600" />
                    Selecciona Día y Hora
                </h3>
                <p className="text-slate-600 text-sm">
                    Elige la fecha y hora que mejor te acomode
                </p>
            </div>

            {/* Contenido principal - Layout Vertical */}
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Calendario Centrado */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                    <CalendarioMensual
                        agendaSlots={agendaSlots}
                        onSelectFecha={handleSelectFecha}
                        fechaSeleccionada={fechaSeleccionada}
                    />
                </div>

                {/* Selector de horas - Debajo del calendario */}
                <div className="transition-all duration-500 ease-in-out">
                    {fechaSeleccionada ? (
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 animate-fade-in-up">
                            <div className="mb-6 text-center border-b border-slate-100 pb-4">
                                <h4 className="text-xl font-semibold text-slate-800 capitalize">
                                    {fechaSeleccionada.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </h4>
                                <p className="text-slate-500 text-sm mt-1">
                                    Selecciona un horario disponible
                                </p>
                            </div>

                            <SelectorHoras
                                fecha={fechaSeleccionada}
                                slots={agendaSlots}
                                onSelectSlot={handleSelectSlot}
                                slotSeleccionado={slotSeleccionado}
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-8 border-2 border-dashed border-slate-300 text-center opacity-70">
                            <p className="text-slate-500 font-medium">
                                Selecciona un día en el calendario para ver los horarios
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón continuar */}
            {slotSeleccionado && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleContinuar}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Continuar con el Pago →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PasoCalendario;
