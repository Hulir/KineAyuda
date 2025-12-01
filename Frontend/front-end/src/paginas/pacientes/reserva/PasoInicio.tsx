// src/paginas/pacientes/reserva/PasoInicio.tsx
import React from "react";
import { FaUser, FaCalendarCheck, FaStar, FaHome } from "react-icons/fa";

interface Props {
    onElegirModo: () => void;
}

const PasoInicio: React.FC<Props> = ({ onElegirModo }) => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="text-center mb-8 pt-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                    Agenda tu cita con un <span className="text-indigo-600">Kinesiólogo</span>
                </h1>
                <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto px-4">
                    Encuentra al profesional ideal para tu tratamiento y reserva tu hora en minutos
                </p>
            </div>

            {/* Features Cards */}
            <div className="max-w-5xl mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/40 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-100 p-2.5 rounded-lg">
                                <FaCalendarCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm">Disponibilidad en tiempo real</h3>
                        </div>
                        <p className="text-xs text-slate-600">
                            Ve los horarios disponibles al instante
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/40 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-100 p-2.5 rounded-lg">
                                <FaStar className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm">Profesionales verificados</h3>
                        </div>
                        <p className="text-xs text-slate-600">
                            Todos con título certificado y validado
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/40 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-cyan-100 p-2.5 rounded-lg">
                                <FaHome className="w-5 h-5 text-cyan-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm">Atención a domicilio</h3>
                        </div>
                        <p className="text-xs text-slate-600">
                            Profesionales que atienden en tu hogar
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Button - Única opción */}
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50">
                    <h2 className="text-xl md:text-2xl font-bold text-center text-slate-800 mb-6">
                        ¿Listo para agendar?
                    </h2>

                    {/* Único botón: Buscar Profesional */}
                    <button
                        onClick={onElegirModo}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl p-6 transition-all duration-300 group shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaUser className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Buscar Profesional
                                </h3>
                                <p className="text-sm text-white/90">
                                    Explora todos los kinesiólogos y filtra por especialidad, ubicación y precio
                                </p>
                            </div>
                            <div className="text-white group-hover:translate-x-1 transition-transform">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Trust indicators */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Pago seguro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Profesionales certificados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Confirmación inmediata</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasoInicio;
