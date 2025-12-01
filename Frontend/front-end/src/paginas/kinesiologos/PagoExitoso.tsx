// src/paginas/kinesiologos/PagoExitoso.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { rutas } from "../../rutas/Routes";

const PagoExitoso: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const orden = searchParams.get("orden");
    const estado = searchParams.get("estado");
    const expiracion = searchParams.get("expiracion");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleIrAlPanel = () => {
        // Asegurar que se muestre el tutorial al llegar al panel
        localStorage.removeItem("kineayuda_tutorial_visto");
        navigate(rutas.panelKine);
    };

    // Función para formatear la fecha de manera segura
    const formatearFecha = (fechaString: string | null): string | null => {
        if (!fechaString) return null;

        try {
            const fecha = new Date(fechaString);
            // Verificar si la fecha es válida
            if (isNaN(fecha.getTime())) {
                console.error("Fecha inválida:", fechaString);
                return null;
            }

            return fecha.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Error al parsear fecha:", error);
            return null;
        }
    };

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
                        onClick={handleIrAlPanel}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-xl"
                    >
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    const exitoso = estado === "pagado";
    const fechaFormateada = formatearFecha(expiracion);

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
                                ¡Pago Exitoso!
                            </h1>
                            <p className="text-xl text-slate-600">
                                Tu suscripción ha sido activada
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
                                {fechaFormateada && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-600">Válido hasta:</span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {fechaFormateada}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-indigo-800">
                                <strong>¡Bienvenido a KineAyuda!</strong> Tu panel ya está listo. Te mostraremos una guía rápida para que empieces a gestionar tu agenda y atender pacientes.
                            </p>
                        </div>

                        <button
                            onClick={handleIrAlPanel}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            ✨ Ir a mi Panel
                        </button>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">
                            Pago Fallido
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Tu pago no pudo ser procesado. Por favor, intenta nuevamente.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-red-800">
                                <strong>Orden:</strong> {orden || "N/A"}
                            </p>
                        </div>

                        <button
                            onClick={handleIrAlPanel}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-xl"
                        >
                            Volver e intentar de nuevo
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PagoExitoso;
