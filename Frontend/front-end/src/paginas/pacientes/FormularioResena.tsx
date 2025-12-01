import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import api from '../../services/api';
import { validarSentimiento, type ValidacionSentimientoResponse } from '../../services/resenasService';

interface Props {
    citaId: number;
    nombreKine: string;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default function FormularioResena({ citaId, nombreKine, onSuccess, onCancel }: Props) {
    const [calificacion, setCalificacion] = useState(0);
    const [hoverCalif, setHoverCalif] = useState(0);
    const [comentario, setComentario] = useState('');
    const [rut, setRut] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    // Estados para validación de sentimiento
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [alertaData, setAlertaData] = useState<ValidacionSentimientoResponse | null>(null);


    // Función para validar sentimiento primero
    const validarYEnviar = async () => {
        // Validaciones básicas primero
        if (!rut.trim()) {
            setError('Por favor, ingresa tu RUT');
            return;
        }

        if (calificacion === 0) {
            setError('Por favor, selecciona una calificación');
            return;
        }

        if (comentario.trim().length < 10) {
            setError('El comentario debe tener al menos 10 caracteres');
            return;
        }

        setError('');
        setEnviando(true);

        try {
            // Validar sentimiento con IA
            const validacion = await validarSentimiento(comentario.trim(), calificacion);

            if (!validacion.coincide) {
                // Mostrar alerta si no coincide
                setAlertaData(validacion);
                setMostrarAlerta(true);
                setEnviando(false);
                return;
            }

            // Si coincide, enviar directamente
            await enviarResenaDirecta();
        } catch (err) {
            console.error('Error en validación:', err);
            // Si falla la validación de sentimiento, enviar de todos modos
            await enviarResenaDirecta();
        }
    };

    // Función para enviar reseña (usada por validación y por "enviar de todos modos")
    const enviarResenaDirecta = async () => {
        setEnviando(true);
        setMostrarAlerta(false);

        try {
            await api.post(`/public/citas/${citaId}/resena/`, {
                rut: rut.trim(),
                calificacion,
                comentario: comentario.trim()
            });

            alert('¡Gracias por tu reseña! Nos ayuda a mejorar el servicio.');
            onSuccess();
        } catch (err: any) {
            console.error('Error al enviar reseña:', err);

            if (err.response?.data) {
                const errorData = err.response.data;
                if (typeof errorData === 'object') {
                    const firstError = Object.values(errorData)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
                } else {
                    setError(String(errorData));
                }
            } else {
                setError('Error al enviar la reseña. Por favor, intenta nuevamente.');
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                ¿Cómo fue tu sesión?
            </h2>
            <p className="text-slate-600 mb-6">
                Con <span className="font-semibold text-indigo-600">{nombreKine}</span>
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* RUT */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tu RUT
                </label>
                <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-9"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    disabled={enviando}
                />
                <p className="text-xs text-slate-500 mt-1">
                    Para verificar que eres el paciente de esta cita
                </p>
            </div>

            {/* Estrellas */}
            <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                    Calificación
                </p>
                <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setCalificacion(star)}
                            onMouseEnter={() => setHoverCalif(star)}
                            onMouseLeave={() => setHoverCalif(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                            disabled={enviando}
                        >
                            {(hoverCalif || calificacion) >= star ? (
                                <FaStar className="w-10 h-10 text-yellow-400" />
                            ) : (
                                <FaRegStar className="w-10 h-10 text-slate-300" />
                            )}
                        </button>
                    ))}
                    {calificacion > 0 && (
                        <span className="ml-3 text-slate-600 font-semibold">
                            {calificacion === 5 && '¡Excelente!'}
                            {calificacion === 4 && 'Muy bueno'}
                            {calificacion === 3 && 'Bueno'}
                            {calificacion === 2 && 'Regular'}
                            {calificacion === 1 && 'Mejorable'}
                        </span>
                    )}
                </div>
            </div>

            {/* Comentario */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cuéntanos tu experiencia
                </label>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="w-full h-32 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    placeholder="¿Cómo fue la atención? ¿Qué te pareció el profesional? ¿Mejoró tu condición?"
                    disabled={enviando}
                    maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-500">
                        Mínimo 10 caracteres
                    </p>
                    <p className="text-xs text-slate-500">
                        {comentario.length}/500
                    </p>
                </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        disabled={enviando}
                        className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    onClick={validarYEnviar}
                    disabled={enviando}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {enviando ? 'Enviando...' : 'Enviar Reseña'}
                </button>
            </div>

            {/* Modal de Alerta de Sentimiento */}
            {mostrarAlerta && alertaData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 mb-1">
                                    ¿Estás seguro?
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {alertaData.sugerencia}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-slate-600 mb-1">Tu reseña:</p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-0.5">
                                    {[...Array(calificacion)].map((_, i) => (
                                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                    {calificacion} {calificacion === 1 ? 'estrella' : 'estrellas'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 italic line-clamp-2">
                                "{comentario.substring(0, 100)}{comentario.length > 100 ? '...' : ''}"
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setMostrarAlerta(false);
                                    setAlertaData(null);
                                }}
                                className="flex-1 px-4 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                            >
                                Cambiar calificación
                            </button>
                            <button
                                onClick={enviarResenaDirecta}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                Enviar de todos modos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
