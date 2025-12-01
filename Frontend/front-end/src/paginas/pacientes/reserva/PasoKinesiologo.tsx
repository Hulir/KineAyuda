// src/paginas/pacientes/reserva/PasoKinesiologo.tsx
import React, { useEffect, useState } from "react";
import { FaUser, FaArrowRight, FaMoneyBillWave } from "react-icons/fa";
import { obtenerKinesiologosPublicos, type KinePublico } from "../../../services/pacientesPublicService";

interface Props {
    especialidadFiltro?: string;
    onSelectKinesiologo: (kine: KinePublico) => void;
}

const PasoKinesiologo: React.FC<Props> = ({ especialidadFiltro, onSelectKinesiologo }) => {
    const [kinesiologos, setKinesiologos] = useState<KinePublico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerKinesiologosPublicos();
                // Filtrar por especialidad si viene
                const filtrados = especialidadFiltro
                    ? data.filter((k: KinePublico) => k.especialidad === especialidadFiltro)
                    : data;
                setKinesiologos(filtrados);
            } catch (error) {
                console.error("Error al cargar kinesiólogos:", error);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [especialidadFiltro]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (kinesiologos.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <p className="text-slate-600 text-lg">
                    No hay profesionales disponibles
                    {especialidadFiltro && ` en ${especialidadFiltro}`}.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                    {especialidadFiltro ? `Profesionales en ${especialidadFiltro}` : 'Selecciona un Profesional'}
                </h2>
                <p className="text-slate-600">
                    Elige el kinesiólogo que mejor se adapte a tus necesidades
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kinesiologos.map((kine) => (
                    <div
                        key={kine.id}
                        className="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl group"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            {/* Foto de perfil */}
                            <div className="flex-shrink-0">
                                {kine.foto_url ? (
                                    <img
                                        src={kine.foto_url}
                                        alt={`${kine.nombre} ${kine.apellido || ''}`}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-100">
                                        <FaUser className="w-10 h-10 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Información */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    {kine.nombre} {kine.apellido}
                                </h3>
                                <p className="text-sm text-indigo-600 font-medium mb-2">
                                    {kine.especialidad}
                                </p>

                                {/* Precio destacado */}
                                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                                    <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                                    <span className="text-lg font-bold text-green-700">
                                        ${(kine.precio_consulta || 25000).toLocaleString('es-CL')}
                                    </span>
                                    <span className="text-xs text-green-600">CLP</span>
                                </div>
                            </div>
                        </div>

                        {/* Botón de selección */}
                        <button
                            onClick={() => onSelectKinesiologo(kine)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105"
                        >
                            <span>Seleccionar Profesional</span>
                            <FaArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasoKinesiologo;
