// src/paginas/kinesiologos/dashboard/Resenas.tsx
import { useEffect, useState } from "react";
import {
    obtenerResenas,
    type Resena,
} from "../../../services/resenasService";
import EstadisticasResenas from "../../../componentes/dashboard/EstadisticasResenas";
import GraficoEvolucion from "../../../componentes/dashboard/GraficoEvolucion";
import PalabrasClave from "../../../componentes/dashboard/PalabrasClave";

export default function Resenas() {
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarResenas() {
            try {
                const data = await obtenerResenas();
                setResenas(data || []);
            } catch (error) {
                console.error("Error al cargar reseñas:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarResenas();
    }, []);

    if (loading) return <p className="text-gray-600">Cargando reseñas...</p>;

    const formatearSentimiento = (s?: string | null) => {
        if (!s) return "Sin dato";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const claseSentimiento = (s?: string | null) => {
        if (s === "positiva")
            return "bg-green-100 text-green-600";
        if (s === "negativa")
            return "bg-red-100 text-red-600";
        if (s === "neutral")
            return "bg-yellow-100 text-yellow-600";
        return "bg-gray-100 text-gray-500";
    };

    const emojiSentimiento = (s?: string | null) => {
        if (s === "positiva") return "😊";
        if (s === "negativa") return "😞";
        if (s === "neutral") return "😐";
        return "❓";
    };

    return (
        <div>
            {/* Estadísticas - Solo si hay reseñas */}
            {resenas.length > 0 && <EstadisticasResenas />}

            {/* Gráfico de Evolución */}
            {resenas.length > 0 && <GraficoEvolucion />}

            {/* Palabras Clave */}
            {resenas.length > 0 && <PalabrasClave />}

            {/* Lista de Reseñas */}
            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mis Reseñas</h1>

                {resenas.length === 0 ? (
                    <p className="text-gray-500">Aún no tienes reseñas.</p>
                ) : (
                    resenas.map((r) => (
                        <div
                            key={r.id}
                            className="border-b py-3 flex justify-between items-center last:border-none"
                        >
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">
                                    {new Date(r.fecha_creacion).toLocaleString("es-CL")}
                                </p>
                                <p className="text-gray-700 mb-1">{r.comentario}</p>
                                {r.calificacion && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-sm">
                                            {'⭐'.repeat(r.calificacion)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ({r.calificacion}/5)
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span
                                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${claseSentimiento(
                                    r.sentimiento
                                )}`}
                            >
                                <span>{emojiSentimiento(r.sentimiento)}</span>
                                {formatearSentimiento(r.sentimiento)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
