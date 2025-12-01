import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';

interface Resena {
    id: number;
    paciente_nombre: string;
    calificacion: number;
    comentario: string;
    fecha: string;
}

interface Props {
    resenas: Resena[];
    onClose: () => void;
    nombreKine: string;
}

const VistaResenas: React.FC<Props> = ({ resenas, onClose, nombreKine }) => {
    const promedio = resenas.length > 0
        ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
        : "0.0";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold">Reseñas de Pacientes</h3>
                            <p className="text-indigo-100 text-sm mt-1">
                                {nombreKine}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-bold">{promedio}</span>
                        <div className="mb-1.5">
                            <div className="flex text-yellow-400 text-lg">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={star <= Math.round(Number(promedio)) ? "fill-current" : "text-white/30"}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-indigo-100 mt-0.5">
                                {resenas.length} {resenas.length === 1 ? 'valoración' : 'valoraciones'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Reseñas */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {resenas.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>No hay reseñas disponibles todavía.</p>
                        </div>
                    ) : (
                        resenas.map((resena) => (
                            <div key={resena.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                                            <FaUserCircle />
                                        </div>
                                        <span className="font-semibold text-slate-800 text-sm">
                                            {resena.paciente_nombre}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(resena.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex text-yellow-400 text-xs mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < resena.calificacion ? "fill-current" : "text-slate-200"}
                                        />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    "{resena.comentario}"
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VistaResenas;
