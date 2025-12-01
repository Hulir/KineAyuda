// src/componentes/dashboard/PalabrasClave.tsx
import { useEffect, useState } from 'react';
import { obtenerPalabrasClave, type PalabrasClaveResenas } from '../../services/resenasService';

export default function PalabrasClave() {
    const [data, setData] = useState<PalabrasClaveResenas | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargar() {
            try {
                const palabras = await obtenerPalabrasClave();
                setData(palabras);
            } catch (err) {
                console.error('Error al cargar palabras clave:', err);
            } finally {
                setLoading(false);
            }
        }
        cargar();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (!data || (data.positivas.length === 0 && data.negativas.length === 0)) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔤</span>
                Palabras Más Mencionadas
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Palabras en reseñas positivas */}
                {data.positivas.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <span>😊</span> En Reseñas Positivas
                        </h3>
                        <div className="space-y-2">
                            {data.positivas.map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700 capitalize font-medium">
                                        {p.palabra}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 bg-green-200 rounded-full overflow-hidden w-24">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: `${(p.frecuencia / data.positivas[0].frecuencia) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-600 font-semibold w-8 text-right">
                                            {p.frecuencia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Palabras en reseñas negativas */}
                {data.negativas.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                            <span>😞</span> En Reseñas Negativas
                        </h3>
                        <div className="space-y-2">
                            {data.negativas.map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700 capitalize font-medium">
                                        {p.palabra}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 bg-red-200 rounded-full overflow-hidden w-24">
                                            <div
                                                className="h-full bg-red-500"
                                                style={{ width: `${(p.frecuencia / data.negativas[0].frecuencia) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-600 font-semibold w-8 text-right">
                                            {p.frecuencia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
                Análisis de {data.total_positivas + data.total_negativas} palabras
            </p>
        </div>
    );
}
