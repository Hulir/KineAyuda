// src/componentes/dashboard/EstadisticasResenas.tsx
import { useEffect, useState } from 'react';
import { obtenerEstadisticasResenas, type EstadisticasResenas as EstadisticasType } from '../../services/resenasService';
import { FaStar } from 'react-icons/fa';

export default function EstadisticasResenas() {
    const [stats, setStats] = useState<EstadisticasType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function cargar() {
            try {
                const data = await obtenerEstadisticasResenas();
                setStats(data);
            } catch (err) {
                console.error('Error al cargar estadísticas:', err);
                setError('No se pudieron cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        }
        cargar();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="animate-pulse flex items-center gap-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return null; // No mostrar nada si hay error
    }

    if (stats.total === 0) {
        return null; // No mostrar si no hay reseñas
    }

    const getSentimientoColor = (tipo: 'positiva' | 'neutral' | 'negativa') => {
        switch (tipo) {
            case 'positiva': return 'bg-green-500';
            case 'neutral': return 'bg-yellow-500';
            case 'negativa': return 'bg-red-500';
        }
    };

    const getSentimientoEmoji = (tipo: 'positiva' | 'neutral' | 'negativa') => {
        switch (tipo) {
            case 'positiva': return '😊';
            case 'neutral': return '😐';
            case 'negativa': return '😞';
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Análisis de Reseñas
            </h2>

            {/* Resumen */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-indigo-200">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FaStar className="text-yellow-400 w-6 h-6" />
                        <span className="text-3xl font-bold text-slate-800">
                            {stats.promedio_calificacion}
                        </span>
                        <span className="text-slate-600 text-sm">/5</span>
                    </div>
                    <p className="text-xs text-slate-600">Promedio general</p>
                </div>
                <div className="h-12 w-px bg-indigo-200"></div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                    <p className="text-xs text-slate-600">
                        {stats.total === 1 ? 'Reseña' : 'Reseñas'} total{stats.total !== 1 ? 'es' : ''}
                    </p>
                </div>
            </div>

            {/* Distribución por Sentimiento */}
            <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                    Análisis de Comentarios:
                </p>

                {(['positiva', 'neutral', 'negativa'] as const).map((tipo) => (
                    <div key={tipo} className="flex items-center gap-3">
                        <span className="text-2xl w-8 text-center">
                            {getSentimientoEmoji(tipo)}
                        </span>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-slate-700 capitalize">
                                    {tipo === 'positiva' ? 'Positivos' : tipo === 'neutral' ? 'Neutrales' : 'Negativos'}
                                </span>
                                <span className="text-sm font-semibold text-slate-800">
                                    {stats.sentimientos[tipo]} ({stats.porcentajes[tipo]}%)
                                </span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getSentimientoColor(tipo)} transition-all duration-500`}
                                    style={{ width: `${stats.porcentajes[tipo]}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alertas de Discrepancias */}
            {stats.discrepancias && stats.discrepancias.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">⚠️</span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-900 mb-1">
                                {stats.discrepancias.length} reseña{stats.discrepancias.length !== 1 ? 's' : ''} requiere{stats.discrepancias.length === 1 ? '' : 'n'} atención
                            </p>
                            <p className="text-xs text-amber-800">
                                {stats.discrepancias.length === 1
                                    ? 'Hay una reseña con alta calificación pero comentario negativo, o viceversa.'
                                    : 'Hay reseñas con alta calificación pero comentarios negativos, o viceversa.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
