// src/paginas/pacientes/reserva/PasoPago.tsx
import React, { useState } from 'react';
import { FaUser, FaCalendar, FaClock, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import type { KinePublico } from '../../../services/pacientesPublicService';
import type { AgendaSlot, PacienteData } from './types';

interface Props {
    kinesiologo: KinePublico;
    slot: AgendaSlot;
    pacienteData: PacienteData;
    onBack: () => void;
}

const PasoPago: React.FC<Props> = ({ kinesiologo, slot, pacienteData, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const precio = kinesiologo.precio_consulta || 25000;

    const handlePagar = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/pagos/citas/webpay/iniciar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agenda_id: slot.id,
                    monto: precio,
                    nombre: pacienteData.nombre,
                    apellido: pacienteData.apellido,
                    rut: pacienteData.rut,
                    email: pacienteData.email,
                    telefono: pacienteData.telefono,
                    fecha_nacimiento: pacienteData.fecha_nacimiento
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al iniciar el pago');
            }

            const data = await response.json();

            // Redirect to Webpay
            if (data.url && data.token) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.url;

                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'token_ws';
                tokenInput.value = data.token;

                form.appendChild(tokenInput);
                document.body.appendChild(form);
                form.submit();
            } else {
                throw new Error('No se recibió URL de pago');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setLoading(false);
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return {
            fecha: date.toLocaleDateString('es-CL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            hora: date.toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const { fecha, hora } = formatDateTime(slot.inicio);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Resumen de la Reserva</h2>
                    <p className="text-slate-600 text-sm">
                        Verifica los detalles antes de proceder al pago
                    </p>
                </div>

                {/* Resumen */}
                <div className="space-y-4 mb-6">
                    {/* Profesional */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <FaUser className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Profesional</p>
                            <p className="text-sm font-bold text-slate-800">
                                {kinesiologo.nombre} {kinesiologo.apellido}
                            </p>
                            <p className="text-xs text-indigo-600">{kinesiologo.especialidad}</p>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                            <FaCalendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Fecha</p>
                                <p className="text-sm font-bold text-slate-800 capitalize">{fecha}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                            <FaClock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Hora</p>
                                <p className="text-sm font-bold text-slate-800">{hora}</p>
                                <p className="text-xs text-slate-500">60 min</p>
                            </div>
                        </div>
                    </div>

                    {/* Paciente */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <FaUser className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-indigo-700 font-medium mb-1">Datos del Paciente</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <p><span className="font-semibold text-slate-800">Nombre:</span> <span className="text-slate-600">{pacienteData.nombre} {pacienteData.apellido}</span></p>
                                <p><span className="font-semibold text-slate-800">RUT:</span> <span className="text-slate-600">{pacienteData.rut}</span></p>
                                <p><span className="font-semibold text-slate-800">Email:</span> <span className="text-slate-600">{pacienteData.email}</span></p>
                                <p><span className="font-semibold text-slate-800">Teléfono:</span> <span className="text-slate-600">{pacienteData.telefono}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-3">
                            <FaMoneyBillWave className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="text-xs text-green-700 font-medium">Total a Pagar</p>
                                <p className="text-2xl font-bold text-green-700">
                                    ${precio.toLocaleString('es-CL')}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-green-600 text-right">
                            <p>Pago seguro</p>
                            <p>mediante Webpay</p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        disabled={loading}
                        className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Volver
                    </button>
                    <button
                        onClick={handlePagar}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <FaCreditCard className="w-5 h-5" />
                                Pagar con Webpay
                            </>
                        )}
                    </button>
                </div>

                {/* Info Webpay */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 text-center">
                        Serás redirigido a Webpay Plus para completar el pago de forma segura
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasoPago;
