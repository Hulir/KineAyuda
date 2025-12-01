// src/paginas/pacientes/PagoCitaExitoso.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaHome, FaCalendarCheck } from "react-icons/fa";

const PagoCitaExitoso: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const orden = searchParams.get("orden");
    const estado = searchParams.get("estado");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
                    <FaSpinner className="w-16 h-16 text-indigo-600 mx-auto mb-6 animate-spin" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Procesando pago...
                    </h2>
                    <p className="text-slate-600">
                        Por favor espera un momento
                    </p>
                </div>
            </div>
        );
    }

    if (!orden || !estado) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-slate-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
                    <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Error
                    </h2>
                    <p className="text-slate-600 mb-8">
                        No se encontró información del pago. Por favor, intenta nuevamente.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-xl"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    const exitoso = estado === "pagado";

    return (
        <div className={`min-h-screen ${exitoso
            ? "bg-gradient-to-br from-green-50 via-emerald-50 to-slate-100"
            : "bg-gradient-to-br from-red-50 via-pink-50 to-slate-100"} 
      flex items-center justify-center px-4`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full">
                {exitoso ? (
                    <>
                        <div className="mb-6">
                            <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">
                                ¡Cita Reservada!
                            </h1>
                            <p className="text-xl text-slate-600">
                                Tu pago ha sido procesado exitosamente
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                            <div className="space-y-3 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Orden:</span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {orden}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Estado:</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        Pagado
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-indigo-800">
                                <strong><FaCalendarCheck className="inline w-4 h-4 mr-1" />Tu cita ha sido confirmada.</strong> Hemos enviado un email con los detalles. Te recomendamos llegar 10 minutos antes.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <FaHome className="w-5 h-5" />
                            <span>Volver al Inicio</span>
                        </button>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">
                            Pago Fallido
                        </h2>
                        <p className="text-slate-600 mb-8">
                            No pudimos procesar tu pago. Por favor, intenta nuevamente.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-red-800">
                                <strong>Orden:</strong> {orden || "N/A"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/reserva')}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-xl"
                            >
                                Intentar Nuevamente
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full border-2 border-slate-300 hover:border-indigo-500 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PagoCitaExitoso;
