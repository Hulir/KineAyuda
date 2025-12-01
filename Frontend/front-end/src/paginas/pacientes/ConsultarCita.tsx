import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaClock, FaUser, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';
import FormularioResena from './FormularioResena';

interface CitaData {
    id: number;
    fecha_hora: string;
    estado: string;
    kinesiologo: {
        nombre: string;
        especialidad: string;
        foto_url: string | null;
    };
    paciente: {
        nombre: string;
    };
    puede_resenar: boolean;
}

export default function ConsultarCita() {
    const { codigo } = useParams<{ codigo: string }>();
    const navigate = useNavigate();
    const [cita, setCita] = useState<CitaData | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarFormResena, setMostrarFormResena] = useState(false);

    useEffect(() => {
        if (codigo) {
            cargarCita();
        }
    }, [codigo]);

    const cargarCita = async () => {
        setCargando(true);
        setError('');

        try {
            const response = await api.get(`/public/citas/${codigo}/`);
            setCita(response.data);
        } catch (err: any) {
            console.error('Error cargando cita:', err);
            if (err.response?.status === 404) {
                setError('Cita no encontrada. Verifica el código e intenta nuevamente.');
            } else {
                setError('Error al cargar la cita. Por favor, intenta más tarde.');
            }
        } finally {
            setCargando(false);
        }
    };

    const handleResenaExitosa = () => {
        setMostrarFormResena(false);
        // Recargar cita para actualizar el estado puede_resenar
        cargarCita();
    };

    const formatearFecha = (fechaISO: string) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (fechaISO: string) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (cargando) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando información de la cita...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-4">
                        <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Oops...
                    </h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    if (!cita) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="kine-titulo-principal mb-2">
                        <span className="kine-titulo-texto">Detalles de tu </span>
                        <span className="kine-titulo-degradado">Cita</span>
                    </h1>
                    <p className="text-slate-600">
                        Código de cita: <span className="font-mono font-semibold">#{codigo}</span>
                    </p>
                </div>

                {/* Información de la Cita */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    {/* Estado */}
                    <div className="flex items-center justify-center mb-6">
                        {cita.estado === 'completada' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                                <FaCheckCircle className="text-green-600" />
                                <span className="text-green-700 font-semibold">Completada</span>
                            </div>
                        )}
                        {cita.estado === 'pendiente' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                                <FaClock className="text-yellow-600" />
                                <span className="text-yellow-700 font-semibold">Pendiente</span>
                            </div>
                        )}
                        {cita.estado === 'cancelada' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                                <FaExclamationCircle className="text-red-600" />
                                <span className="text-red-700 font-semibold">Cancelada</span>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Columna Izquierda - Info del Kinesiólogo */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                                Profesional
                            </h3>
                            <div className="flex items-center gap-4 mb-4">
                                {cita.kinesiologo.foto_url ? (
                                    <img
                                        src={cita.kinesiologo.foto_url}
                                        alt={cita.kinesiologo.nombre}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <FaUser className="w-8 h-8 text-indigo-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-lg text-slate-800">
                                        {cita.kinesiologo.nombre}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {cita.kinesiologo.especialidad}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha - Fecha y Hora */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
                                Fecha y Hora
                            </h3>

                            <div className="flex items-start gap-3 mb-3">
                                <FaCalendar className="text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-sm text-slate-600">Fecha</p>
                                    <p className="font-semibold text-slate-800 capitalize">
                                        {formatearFecha(cita.fecha_hora)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaClock className="text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-sm text-slate-600">Hora</p>
                                    <p className="font-semibold text-slate-800">
                                        {formatearHora(cita.fecha_hora)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de Reseña */}
                {cita.puede_resenar && !mostrarFormResena && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">
                                    ¡Comparte tu experiencia!
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    Tu opinión nos ayuda a mejorar y a otros pacientes a tomar decisiones informadas.
                                </p>
                            </div>
                            <button
                                onClick={() => setMostrarFormResena(true)}
                                className="ml-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                            >
                                Dejar Reseña
                            </button>
                        </div>
                    </div>
                )}

                {/* Formulario de Reseña */}
                {mostrarFormResena && (
                    <div className="mb-6">
                        <FormularioResena
                            citaId={cita.id}
                            nombreKine={cita.kinesiologo.nombre}
                            onSuccess={handleResenaExitosa}
                            onCancel={() => setMostrarFormResena(false)}
                        />
                    </div>
                )}

                {/* Mensaje si ya dejó reseña */}
                {cita.estado === 'completada' && !cita.puede_resenar && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                        <FaCheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            Gracias por tu reseña
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Ya has dejado una reseña para esta cita.
                        </p>
                    </div>
                )}

                {/* Botón Volver */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        ← Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
