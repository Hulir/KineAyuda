// src/componentes/dashboard/GraficoEvolucion.tsx
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { obtenerEvolucionResenas, type EvolucionResenas } from '../../services/resenasService';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function GraficoEvolucion() {
    const [data, setData] = useState<EvolucionResenas | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargar() {
            try {
                const evolucion = await obtenerEvolucionResenas();
                setData(evolucion);
            } catch (err) {
                console.error('Error al cargar evolución:', err);
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
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-slate-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data || data.meses_totales === 0) {
        return null; // No mostrar si no hay datos
    }

    const chartData = {
        labels: data.evolucion.map(m => m.mes),
        datasets: [
            {
                label: '😊 Positivas',
                data: data.evolucion.map(m => m.positivas),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: '😐 Neutrales',
                data: data.evolucion.map(m => m.neutrales),
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: '😞 Negativas',
                data: data.evolucion.map(m => m.negativas),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Evolución de Sentimientos
                </h2>
                <span className="text-sm text-slate-600">
                    Últimos {data.meses_totales} meses
                </span>
            </div>
            <div className="h-80">
                <Line data={chartData} options={options} />
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
                Porcentaje de reseñas positivas, neutrales y negativas por mes
            </p>
        </div>
    );
}
