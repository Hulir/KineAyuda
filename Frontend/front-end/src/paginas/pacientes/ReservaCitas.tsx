import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaUser, FaStethoscope, FaChevronRight, FaMoneyBillWave, FaSearch, FaStar, FaClock, FaMapMarkerAlt, FaHome, FaBriefcase } from "react-icons/fa";
import HeaderPrincipal from "../../componentes/HeaderPrincipal";
import Footer from "../../componentes/Footer";
import PasoInicio from "./reserva/PasoInicio";
import FiltrosBusqueda from "../../componentes/FiltrosBusqueda";
import BarraPasos from "../../componentes/BarraPasos";
import PasoCalendario from "./reserva/PasoCalendario";
import PasoDatosPaciente from "./reserva/PasoDatosPaciente";
import PasoPago from "./reserva/PasoPago";
import {
    obtenerEspecialidadesPublicas,
    obtenerKinesiologosPublicos,
    obtenerResenasKinesiologo,
    obtenerEstadisticasFiltros,
    type KinePublico,
    type Resena,
    type FiltrosKinesiologo,
    type EstadisticasFiltros
} from "../../services/pacientesPublicService";

const PASOS = {
    INICIO: 0,
    ESPECIALIDAD: 1,
    KINESIOLOGO: 2,
    DETALLE_PROFESIONAL: 3,
    CALENDARIO: 4,
    DATOS_PACIENTE: 5,
    PAGO: 6
};

const ReservaCitas: React.FC = () => {
    const [paso, setPaso] = useState(PASOS.INICIO);
    const [searchEspecialidad, setSearchEspecialidad] = useState("");
    const [searchKinesiologo, setSearchKinesiologo] = useState("");
    const [especialidades, setEspecialidades] = useState<string[]>([]);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string | null>(null);
    const [kinesiologos, setKinesiologos] = useState<KinePublico[]>([]);
    const [kinesiologoSeleccionado, setKinesiologoSeleccionado] = useState<KinePublico | null>(null);
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [loading, setLoading] = useState(false);

    // Nuevos estados para filtros
    const [estadisticas, setEstadisticas] = useState<EstadisticasFiltros | null>(null);
    const [filtrosActivos, setFiltrosActivos] = useState<FiltrosKinesiologo>({});

    // Estados para el flujo de reserva
    const [slotSeleccionado, setSlotSeleccionado] = useState<any | null>(null);
    const [datosPaciente, setDatosPaciente] = useState<any | null>(null);

    // Calculate rating from sentimiento
    const calcularRating = (resenas: Resena[]): number => {
        if (resenas.length === 0) return 0;
        const positivas = resenas.filter(r => r.sentimiento === 'positiva').length;
        const neutrales = resenas.filter(r => r.sentimiento === 'neutral').length;
        const negativas = resenas.filter(r => r.sentimiento === 'negativa').length;
        return Number(((positivas * 5 + neutrales * 3 + negativas * 1) / resenas.length).toFixed(1));
    };

    const averageRating = calcularRating(resenas);

    // Cargar estadísticas al entrar a selección de kinesiólogos
    useEffect(() => {
        if (paso === PASOS.KINESIOLOGO && !estadisticas) {
            obtenerEstadisticasFiltros()
                .then(data => setEstadisticas(data))
                .catch(err => console.error('Error cargando estadísticas:', err));
        }
    }, [paso, estadisticas]);

    useEffect(() => {
        if (paso === PASOS.ESPECIALIDAD) {
            setLoading(true);
            obtenerEspecialidadesPublicas()
                .then(data => setEspecialidades(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [paso]);

    // Cargar kinesiologos con filtros
    useEffect(() => {
        if (paso === PASOS.KINESIOLOGO) {
            setLoading(true);

            // Combinar filtros con especialidad seleccionada si existe
            const filtros: FiltrosKinesiologo = {
                ...filtrosActivos,
                ...(especialidadSeleccionada ? { especialidad: especialidadSeleccionada } : {})
            };

            obtenerKinesiologosPublicos(filtros)
                .then(data => setKinesiologos(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [paso, especialidadSeleccionada, filtrosActivos]);

    // Load reviews when professional is selected
    useEffect(() => {
        if (paso === PASOS.DETALLE_PROFESIONAL && kinesiologoSeleccionado) {
            setLoading(true);
            obtenerResenasKinesiologo(kinesiologoSeleccionado.id)
                .then(data => setResenas(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [paso, kinesiologoSeleccionado]);

    const handleElegirModo = () => {
        setPaso(PASOS.KINESIOLOGO);
    };

    const handleVolver = () => {
        if (paso === PASOS.KINESIOLOGO) {
            setPaso(PASOS.INICIO);
            setSearchKinesiologo("");
        } else if (paso === PASOS.DETALLE_PROFESIONAL) {
            setPaso(PASOS.KINESIOLOGO);
            setKinesiologoSeleccionado(null);
            setResenas([]);
        } else if (paso === PASOS.CALENDARIO) {
            setPaso(PASOS.DETALLE_PROFESIONAL);
        } else if (paso === PASOS.DATOS_PACIENTE) {
            setPaso(PASOS.CALENDARIO);
        } else if (paso === PASOS.PAGO) {
            setPaso(PASOS.DATOS_PACIENTE);
        }
    };

    const especialidadesFiltradas = especialidades.filter(esp =>
        esp.toLowerCase().includes(searchEspecialidad.toLowerCase())
    );

    const kinesiologosFiltrados = kinesiologos.filter(kine => {
        const nombreCompleto = `${kine.nombre} ${kine.apellido || ''}`.toLowerCase();
        const search = searchKinesiologo.toLowerCase();
        return nombreCompleto.includes(search) || kine.especialidad.toLowerCase().includes(search);
    });

    const getPasoActualNumber = () => {
        if (paso === PASOS.KINESIOLOGO) return 1;
        if (paso === PASOS.DETALLE_PROFESIONAL) return 1;
        if (paso === PASOS.CALENDARIO) return 2;
        if (paso === PASOS.DATOS_PACIENTE) return 3;
        if (paso === PASOS.PAGO) return 4;
        return 0;
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <HeaderPrincipal />

            {/* Progress Bar */}
            {paso !== PASOS.INICIO && (
                <div className="pt-24 pb-4">
                    <BarraPasos pasoActual={getPasoActualNumber()} />
                </div>
            )}

            <main className={`flex-1 ${paso === PASOS.INICIO ? 'pt-20' : ''}`}>
                {/* Back Button */}
                {paso > PASOS.INICIO && (
                    <div className="bg-white border-b border-slate-100">
                        <div className="max-w-4xl mx-auto px-4 py-3">
                            <button
                                onClick={handleVolver}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                <span>Volver</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="py-6">
                    {/* PASO 0: INICIO */}
                    {paso === PASOS.INICIO && <PasoInicio onElegirModo={handleElegirModo} />}

                    {/* PASO 1: ESPECIALIDAD */}
                    {paso === PASOS.ESPECIALIDAD && (
                        <div className="max-w-3xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Selecciona una Especialidad</h2>
                                <p className="text-sm text-slate-600 mb-4">Elige la especialidad para tu tratamiento</p>

                                <div className="relative max-w-xl mx-auto">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchEspecialidad}
                                        onChange={(e) => setSearchEspecialidad(e.target.value)}
                                        placeholder="Buscar especialidad..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : especialidadesFiltradas.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-slate-600 text-sm">No se encontraron especialidades</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {especialidadesFiltradas.map((esp, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setEspecialidadSeleccionada(esp);
                                                setPaso(PASOS.KINESIOLOGO);
                                                setSearchEspecialidad("");
                                            }}
                                            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                                    <FaStethoscope className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="font-medium text-slate-800 text-sm">{esp}</span>
                                            </div>
                                            <FaChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PASO 2: KINESIOLOGO */}
                    {paso === PASOS.KINESIOLOGO && (
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    {especialidadSeleccionada ? `${especialidadSeleccionada}` : ' Selecciona un Profesional'}
                                </h2>
                                <p className="text-sm text-slate-600 mb-4">Elige el kinesiólogo para tu cita</p>
                            </div>

                            <FiltrosBusqueda
                                onFiltrosChange={(nuevosFiltros) => {
                                    setFiltrosActivos(nuevosFiltros);
                                }}
                                estadisticas={estadisticas}
                            />

                            <div className="relative max-w-xl mx-auto mb-6">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchKinesiologo}
                                    onChange={(e) => setSearchKinesiologo(e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                />
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : kinesiologosFiltrados.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-slate-600 text-sm">No se encontraron profesionales</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {kinesiologosFiltrados.map(kine => (
                                        <div
                                            key={kine.id}
                                            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
                                        >
                                            <div className="flex-shrink-0">
                                                {kine.foto_url ? (
                                                    <img
                                                        src={kine.foto_url}
                                                        alt={`${kine.nombre} ${kine.apellido}`}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-100">
                                                        <FaUser className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-800 text-sm truncate">
                                                    {kine.nombre} {kine.apellido}
                                                </h4>
                                                <p className="text-xs text-slate-600 truncate mb-1">{kine.especialidad}</p>

                                                {/* Modalities & Location */}
                                                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                    {kine.atiende_consulta && (
                                                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                            <FaBriefcase className="w-3 h-3" /> En consulta
                                                        </span>
                                                    )}
                                                    {kine.atiende_domicilio && (
                                                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                                            <FaHome className="w-3 h-3" /> A domicilio
                                                        </span>
                                                    )}
                                                </div>
                                                {kine.atiende_consulta && kine.direccion_consulta && (
                                                    <p className="text-xs text-slate-400 mt-1 truncate">
                                                        <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                                                        {kine.direccion_consulta}, {kine.comuna}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Price & Duration */}
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-green-600">
                                                    ${(kine.precio_consulta || 25000).toLocaleString('es-CL')}
                                                </p>
                                                <p className="text-xs text-slate-500">60 min</p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setKinesiologoSeleccionado(kine);
                                                    setPaso(PASOS.DETALLE_PROFESIONAL);
                                                    setSearchKinesiologo("");
                                                }}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                                            >
                                                Ver
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PASO 3: DETALLE PROFESIONAL */}
                    {paso === PASOS.DETALLE_PROFESIONAL && kinesiologoSeleccionado && (
                        <div className="max-w-3xl mx-auto px-4">
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                                    <div className="flex-shrink-0">
                                        {kinesiologoSeleccionado.foto_url ? (
                                            <img
                                                src={kinesiologoSeleccionado.foto_url}
                                                alt={`${kinesiologoSeleccionado.nombre} ${kinesiologoSeleccionado.apellido}`}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-100">
                                                <FaUser className="w-10 h-10 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-slate-800 mb-1">
                                            {kinesiologoSeleccionado.nombre} {kinesiologoSeleccionado.apellido}
                                        </h2>
                                        <p className="text-sm text-indigo-600 font-medium mb-2">{kinesiologoSeleccionado.especialidad}</p>

                                        {resenas.length > 0 && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-slate-600 font-medium">
                                                    {averageRating.toFixed(1)} ({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3 mt-3">
                                            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                                                <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-bold text-green-700">
                                                    ${(kinesiologoSeleccionado.precio_consulta || 25000).toLocaleString('es-CL')}
                                                </span>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">
                                                <FaClock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700">60 min</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            {kinesiologoSeleccionado.atiende_consulta && (
                                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                                    <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-slate-800">Consulta:</span>
                                                        <p>{kinesiologoSeleccionado.direccion_consulta || 'Dirección no especificada'}, {kinesiologoSeleccionado.comuna}, {kinesiologoSeleccionado.region}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {kinesiologoSeleccionado.atiende_domicilio && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <FaHome className="w-4 h-4 text-green-500" />
                                                    <span className="font-medium text-slate-800">Atención a Domicilio disponible</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-bold text-slate-800 mb-2">Sobre el Profesional</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Kinesiólogo profesional especializado en {kinesiologoSeleccionado.especialidad}, dedicado a proporcionar tratamientos personalizados.
                                    </p>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : resenas.length > 0 ? (
                                    <div className="mb-6">
                                        <h3 className="text-base font-bold text-slate-800 mb-3">Reseñas de Pacientes</h3>
                                        <div className="space-y-3">
                                            {resenas.slice(0, 5).map(resena => (
                                                <div key={resena.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                                <FaUser className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800 text-sm">
                                                                    {resena.cita?.paciente?.nombre || 'Paciente'} {resena.cita?.paciente?.apellido?.[0] || ''}.
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {new Date(resena.fecha_creacion).toLocaleDateString('es-CL')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded ${resena.sentimiento === 'positiva' ? 'bg-green-100 text-green-700' :
                                                            resena.sentimiento === 'neutral' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {resena.sentimiento === 'positiva' ? '😊' : resena.sentimiento === 'neutral' ? '😐' : '😞'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{resena.comentario}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 text-center py-4">
                                        <p className="text-sm text-slate-500">Aún no hay reseñas para este profesional</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleVolver}
                                        className="flex-1 border-2 border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        onClick={() => setPaso(PASOS.CALENDARIO)}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASO 4: CALENDARIO */}
                    {paso === PASOS.CALENDARIO && kinesiologoSeleccionado && (
                        <PasoCalendario
                            kinesiologo={kinesiologoSeleccionado}
                            onSelectSlot={(slot) => {
                                console.log("Slot seleccionado:", slot);
                                setSlotSeleccionado(slot);
                                setPaso(PASOS.DATOS_PACIENTE);
                            }}
                        />
                    )}

                    {/* PASO 5: DATOS PACIENTE */}
                    {paso === PASOS.DATOS_PACIENTE && (
                        <PasoDatosPaciente
                            onContinue={(datos) => {
                                setDatosPaciente(datos);
                                setPaso(PASOS.PAGO);
                            }}
                            onBack={() => setPaso(PASOS.CALENDARIO)}
                        />
                    )}

                    {/* PASO 6: PAGO */}
                    {paso === PASOS.PAGO && kinesiologoSeleccionado && slotSeleccionado && datosPaciente && (
                        <PasoPago
                            kinesiologo={kinesiologoSeleccionado}
                            slot={slotSeleccionado}
                            pacienteData={datosPaciente}
                            onBack={() => setPaso(PASOS.DATOS_PACIENTE)}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReservaCitas;
