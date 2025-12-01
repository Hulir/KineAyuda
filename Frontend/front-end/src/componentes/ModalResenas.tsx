// src/componentes/ModalResenas.tsx
import React from "react";
import { FaStar, FaTimes } from "react-icons/fa";

interface Resena {
    id: number;
    nombre_paciente: string;
    puntuacion: number;
    comentario: string;
    fecha: string;
}

interface Props {
    resenas: Resena[];
    onClose: () => void;
    nombreKine: string;
}

const ModalResenas: React.FC<Props> = ({ resenas, onClose, nombreKine }) => {
    const promedioEstrellas =
        resenas.length > 0
            ? resenas.reduce((sum, r) => sum + r.puntuacion, 0) / resenas.length
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Reseñas de {nombreKine}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-yellow-300">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={
                                            star <= promedioEstrellas
                                                ? "fill-current"
                                                : "fill-white/30"
                                        }
                                    />
                                ))}
                            </div>
                            <span className="text-sm">
                                {promedioEstrellas.toFixed(1)} • {resenas.length} reseñas
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Reseñas */}
                <div className="p-6 space-y-4">
                    {resenas.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">
                            Este kinesiólogo aún no tiene reseñas.
                        </p>
                    ) : (
                        resenas.map((resena) => (
                            <div
                                key={resena.id}
                                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {resena.nombre_paciente}
                                        </p>
                                        <div className="flex text-yellow-500 text-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={
                                                        star <= resena.puntuacion
                                                            ? "fill-current"
                                                            : "fill-slate-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(resena.fecha).toLocaleDateString("es-CL")}
                                    </span>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {resena.comentario}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalResenas;
