// src/paginas/pacientes/reserva/PasoEspecialidad.tsx
import React, { useEffect, useState } from "react";
import { FaStethoscope, FaArrowRight } from "react-icons/fa";
import { obtenerEspecialidadesPublicas } from "../../../services/pacientesPublicService";
import type { Especialidad } from "./types";

interface Props {
    onSelectEspecialidad: (especialidad: Especialidad) => void;
}

const PasoEspecialidad: React.FC<Props> = ({ onSelectEspecialidad }) => {
    const [especialidades, setEspecialidades] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerEspecialidadesPublicas();
                setEspecialidades(data);
            } catch (error) {
                console.error("Error al cargar especialidades:", error);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                    Selecciona una Especialidad
                </h2>
                <p className="text-slate-600">
                    Elige la especialidad que necesitas para tu tratamiento
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {especialidades.map((especialidad, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectEspecialidad({ id: index + 1, nombre: especialidad })}
                        className="group bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl p-6 transition-all duration-200 hover:shadow-lg text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-100 group-hover:bg-indigo-600 p-3 rounded-lg transition-colors">
                                <FaStethoscope className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {especialidad}
                                </h3>
                                <div className="flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-medium">Seleccionar</span>
                                    <FaArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PasoEspecialidad;
