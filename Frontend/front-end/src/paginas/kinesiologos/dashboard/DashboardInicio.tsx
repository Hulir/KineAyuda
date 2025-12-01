// src/paginas/kinesiologos/dashboard/DashboardInicio.tsx
import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Star } from "lucide-react";
import { obtenerCitasKine } from "../../../services/citasService";
import { obtenerResenas } from "../../../services/resenasService";
import TutorialBienvenida from "../../../componentes/TutorialBienvenida";

export default function DashboardInicio() {
    const [citas, setCitas] = useState<any[]>([]);
    const [resenas, setResenas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mostrarTutorial, setMostrarTutorial] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                const citasData = await obtenerCitasKine();
                const resenasData = await obtenerResenas();
                setCitas(citasData || []);
                setResenas(resenasData || []);
            } catch (error) {
                console.error("Error al cargar datos del panel:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarDatos();

        // Tutorial ya NO se muestra automáticamente
        // Solo se muestra cuando el usuario hace click en el botón "Ver Tutorial"
    }, []);

    const handleCerrarTutorial = () => {
        localStorage.setItem("kineayuda_tutorial_visto", "true");
        setMostrarTutorial(false);
    };

    const handleMostrarTutorialDeNuevo = () => {
        setMostrarTutorial(true);
    };

    if (loading) return <p className="text-gray-600">Cargando datos...</p>;

    return (
        <>
            {/* Tutorial de bienvenida */}
            {mostrarTutorial && (
                <TutorialBienvenida onClose={handleCerrarTutorial} />
            )}

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Bienvenido a tu Panel 👋
                        </h1>
                        <p className="text-gray-600">
                            Resumen general de tus próximas citas y reseñas recientes.
                        </p>
                    </div>
                    <button
                        onClick={handleMostrarTutorialDeNuevo}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                        📚 Ver Tutorial
                    </button>
                </div>

                {/* Tarjetas dinámicas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
                        <Clock className="text-blue-500" />
                        <div>
                            <h3 className="text-sm text-gray-500">Citas Pendientes</h3>
                            <p className="text-xl font-semibold">
                                {citas.filter((c) => c.estado === "pendiente").length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="text-green-500" />
                        <div>
                            <h3 className="text-sm text-gray-500">Citas Completadas</h3>
                            <p className="text-xl font-semibold">
                                {citas.filter((c) => c.estado === "completada").length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
                        <Calendar className="text-indigo-500" />
                        <div>
                            <h3 className="text-sm text-gray-500">Total de Citas</h3>
                            <p className="text-xl font-semibold">{citas.length}</p>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
                        <Star className="text-yellow-500" />
                        <div>
                            <h3 className="text-sm text-gray-500">Reseñas Recientes</h3>
                            <p className="text-xl font-semibold">{resenas.length}</p>
                        </div>
                    </div>
                </div>

                {/* Mensaje de ayuda para nuevos usuarios */}
                {citas.length === 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-indigo-900 mb-2">
                            🎯 ¡Comienza configurando tu agenda!
                        </h3>
                        <p className="text-slate-700 mb-4">
                            Para empezar a recibir pacientes, primero debes definir tu disponibilidad semanal en la sección Agenda.
                        </p>
                        <button
                            onClick={handleMostrarTutorialDeNuevo}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Ver guía paso a paso
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
