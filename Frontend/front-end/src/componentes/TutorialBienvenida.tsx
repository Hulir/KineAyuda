// src/componentes/TutorialBienvenida.tsx
import React, { useState } from "react";
import { FaCheckCircle, FaTimes, FaCalendarAlt, FaUsers, FaStar, FaCog } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface Props {
    onClose: () => void;
}

const TutorialBienvenida: React.FC<Props> = ({ onClose }) => {
    const [pasoActual, setPasoActual] = useState(0);
    const [noMostrarMas, setNoMostrarMas] = useState(false);

    const pasos = [
        {
            titulo: "¡Bienvenido a KineAyuda! 🎉",
            icono: <FaCheckCircle className="w-16 h-16 text-green-500" />,
            descripcion: "Estamos emocionados de tenerte con nosotros. Este es tu panel de control donde podrás gestionar todo lo relacionado con tu práctica kinesiológica.",
            contenido: (
                <div className="space-y-4">
                    <p className="text-slate-700">
                        En los siguientes pasos te mostraremos cómo utilizar cada sección de tu panel para que puedas:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <IoMdCheckmarkCircleOutline className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Gestionar tu agenda y disponibilidad</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <IoMdCheckmarkCircleOutline className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Administrar tus citas con pacientes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <IoMdCheckmarkCircleOutline className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Ver y responder reseñas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <IoMdCheckmarkCircleOutline className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Actualizar tu perfil profesional</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            titulo: "📅 Agenda",
            icono: <FaCalendarAlt className="w-16 h-16 text-indigo-600" />,
            descripcion: "Tu calendario es el corazón de tu práctica",
            contenido: (
                <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">¿Qué puedes hacer en Agenda?</h4>
                    <div className="space-y-3">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-medium text-indigo-900">1. Configurar tu disponibilidad</p>
                            <p className="text-sm text-indigo-700 mt-1">
                                Define tus horarios de atención semanales (ej: Lunes a Viernes, 9:00-18:00)
                            </p>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-medium text-indigo-900">2. Crear bloques de tiempo</p>
                            <p className="text-sm text-indigo-700 mt-1">
                                Puedes elegir duraciones de 30, 45 o 60 minutos por sesión
                            </p>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-medium text-indigo-900">3. Crear slots manuales</p>
                            <p className="text-sm text-indigo-700 mt-1">
                                Haz clic en cualquier espacio vacío para crear disponibilidad específica
                            </p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            <strong>💡 Tip:</strong> Los slots que crees aparecerán en verde y estarán disponibles para que los pacientes reserven.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            titulo: "👥 Citas",
            icono: <FaUsers className="w-16 h-16 text-purple-600" />,
            descripcion: "Administra todas tus citas con pacientes",
            contenido: (
                <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">¿Qué encontrarás aquí?</h4>
                    <div className="space-y-3">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="font-medium text-purple-900">📋 Lista completa de citas</p>
                            <p className="text-sm text-purple-700 mt-1">
                                Ve todas tus citas: pendientes, confirmadas, completadas y canceladas
                            </p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="font-medium text-purple-900">📊 Información del paciente</p>
                            <p className="text-sm text-purple-700 mt-1">
                                Accede a los datos de contacto y notas de cada cita
                            </p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="font-medium text-purple-900">✅ Gestión de estados</p>
                            <p className="text-sm text-purple-700 mt-1">
                                Marca las citas como completadas, cancela o reprograma según necesites
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            titulo: "⭐ Reseñas",
            icono: <FaStar className="w-16 h-16 text-yellow-500" />,
            descripcion: "Tu reputación profesional",
            contenido: (
                <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Construye tu reputación</h4>
                    <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="font-medium text-yellow-900">🌟 Ver todas tus reseñas</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Los pacientes pueden dejar reseñas después de cada sesión completada
                            </p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="font-medium text-yellow-900">💬 Responder a pacientes</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Agradece los comentarios positivos y responde profesionalmente a cualquier inquietud
                            </p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="font-medium text-yellow-900">📈 Mejora continua</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Usa el feedback para mejorar constantemente la calidad de tu atención
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            titulo: "👤 Perfil",
            icono: <FaCog className="w-16 h-16 text-slate-600" />,
            descripcion: "Tu carta de presentación profesional",
            contenido: (
                <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Mantén tu perfil actualizado</h4>
                    <div className="space-y-3">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <p className="font-medium text-slate-900">📝 Información profesional</p>
                            <p className="text-sm text-slate-700 mt-1">
                                Actualiza tu biografía, especialidades y experiencia
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <p className="font-medium text-slate-900">📸 Foto de perfil</p>
                            <p className="text-sm text-slate-700 mt-1">
                                Una buena foto profesional genera más confianza en los pacientes
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <p className="font-medium text-slate-900">📞 Datos de contacto</p>
                            <p className="text-sm text-slate-700 mt-1">
                                Asegúrate de que tu teléfono y email estén actualizados
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            titulo: "🚀 ¡Estás listo para comenzar!",
            icono: <FaCheckCircle className="w-16 h-16 text-green-500" />,
            descripcion: "Tu primer paso",
            contenido: (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                        <h4 className="font-bold text-indigo-900 text-lg mb-3">
                            🎯 Comienza configurando tu agenda
                        </h4>
                        <p className="text-slate-700 mb-4">
                            Te recomendamos que tu primer paso sea definir tu disponibilidad semanal. Esto permitirá que los pacientes puedan reservar horas contigo.
                        </p>
                        <ol className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                <span>Ve a la sección <strong>"Agenda"</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                <span>Haz clic en <strong>"Configurar Horario"</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                <span>Define tus días y horarios de atención</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">4</span>
                                <span>¡Listo! Los pacientes ya podrán agendar contigo</span>
                            </li>
                        </ol>
                    </div>
                    <p className="text-center text-slate-600 text-sm">
                        Puedes volver a ver este tutorial en cualquier momento desde el menú de ayuda.
                    </p>
                </div>
            ),
        },
    ];

    const handleSiguiente = () => {
        if (pasoActual < pasos.length - 1) {
            setPasoActual(pasoActual + 1);
        } else {
            if (noMostrarMas) {
                localStorage.setItem("kineayuda_tutorial_visto", "true");
            }
            onClose();
        }
    };

    const handleAnterior = () => {
        if (pasoActual > 0) {
            setPasoActual(pasoActual - 1);
        }
    };

    const handleOmitir = () => {
        if (noMostrarMas) {
            localStorage.setItem("kineayuda_tutorial_visto", "true");
        }
        onClose();
    };

    const paso = pasos[pasoActual];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 p-6 text-white relative">
                    <button
                        onClick={handleOmitir}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                    <div className="flex justify-center mb-4">
                        {paso.icono}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                        {paso.titulo}
                    </h2>
                    <p className="text-center text-white/90">
                        {paso.descripcion}
                    </p>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {paso.contenido}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                    {/* Indicador de progreso */}
                    <div className="flex justify-center gap-2 mb-6">
                        {pasos.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === pasoActual
                                    ? "w-8 bg-indigo-600"
                                    : index < pasoActual
                                        ? "w-2 bg-indigo-400"
                                        : "w-2 bg-slate-300"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Checkbox No mostrar más */}
                    <div className="mb-4 flex items-center justify-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={noMostrarMas}
                                onChange={(e) => setNoMostrarMas(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-600">No volver a mostrar este tutorial</span>
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={handleAnterior}
                            disabled={pasoActual === 0}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            ← Anterior
                        </button>

                        <button
                            onClick={handleOmitir}
                            className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                        >
                            Omitir tutorial
                        </button>

                        <button
                            onClick={handleSiguiente}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            {pasoActual === pasos.length - 1 ? "¡Empezar!" : "Siguiente →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialBienvenida;
