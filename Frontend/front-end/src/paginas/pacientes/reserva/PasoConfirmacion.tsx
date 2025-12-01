// src/paginas/pacientes/reserva/PasoConfirmacion.tsx
import React from "react";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Kinesiologo, AgendaSlot } from "./types";

interface Props {
    kinesiologo: Kinesiologo;
    slot: AgendaSlot;
}

const PasoConfirmacion: React.FC<Props> = ({ kinesiologo, slot }) => {
    const navigate = useNavigate();

    const fechaHora = new Date(slot.inicio);
    const horaFormateada = fechaHora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
    const fechaFormateada = fechaHora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <div className="inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-bounce">
                        <FaCheckCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-slate-800 mb-3">
                    ¡Cita Reservada con Éxito!
                </h2>
                <p className="text-lg text-slate-600">
                    Hemos enviado un correo de confirmación con los detalles de tu cita
                </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Detalles de tu Cita</h3>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <FaUser className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Profesional</p>
                            <p className="text-lg font-semibold text-slate-800">
                                {kinesiologo.nombre} {kinesiologo.apellido}
                            </p>
                            <p className="text-sm text-indigo-600">{kinesiologo.especialidad}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FaCalendarAlt className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Fecha</p>
                            <p className="text-lg font-semibold text-slate-800 capitalize">{fechaFormateada}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                        <div className="bg-pink-100 p-3 rounded-lg">
                            <FaClock className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Hora</p>
                            <p className="text-lg font-semibold text-slate-800">{horaFormateada}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                    <strong>💡 Recordatorio:</strong> Te recomendamos llegar 10 minutos antes de tu cita.
                    Si necesitas cancelar o reprogramar, por favor contacta al profesional con anticipación.
                </p>
            </div>

            <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
                <FaHome className="w-5 h-5" />
                <span>Volver al Inicio</span>
            </button>
        </div>
    );
};

export default PasoConfirmacion;
