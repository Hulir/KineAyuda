// src/paginas/pacientes/reserva/PasoDatosPaciente.tsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendar, FaChevronRight, FaCheck, FaTimes, FaHome } from 'react-icons/fa';
import type { PacienteData } from './types';
import { validarRUT, formatearRUT, validarEmail, capitalizarNombre } from '../../../utils/validaciones';

interface Props {
    onContinue: (datosPaciente: PacienteData) => void;
    onBack: () => void;
}

const PasoDatosPaciente: React.FC<Props> = ({ onContinue, onBack }) => {
    const [formData, setFormData] = useState<PacienteData>({
        nombre: '',
        apellido: '',
        rut: '',
        email: '',
        telefono: '+56',
        fecha_nacimiento: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PacienteData, string>>>({});

    // Estados de validación visual (null = sin validar, true = válido, false = inválido)
    const [validStatus, setValidStatus] = useState<Partial<Record<keyof PacienteData, boolean | null>>>({
        nombre: null,
        apellido: null,
        rut: null,
        email: null,
        telefono: null,
        fecha_nacimiento: null
    });

    // Normalizar nombre/apellido: Solo letras y espacios, capitalizado
    const normalizeName = (value: string) => {
        // Eliminar números y símbolos, dejar solo letras y espacios
        const clean = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        // Capitalizar
        return capitalizarNombre(clean);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        // Lógica específica por campo
        if (name === 'nombre' || name === 'apellido') {
            newValue = normalizeName(value);
        } else if (name === 'rut') {
            newValue = formatearRUT(value);
        } else if (name === 'telefono') {
            // Mantener el prefijo +56
            if (!value.startsWith('+56')) {
                newValue = '+56' + value.replace(/[^0-9]/g, '');
            } else {
                newValue = '+56' + value.slice(3).replace(/[^0-9]/g, '');
            }
            // Limitar largo (9 dígitos + prefijo = 12 chars)
            if (newValue.length > 12) newValue = newValue.slice(0, 12);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Validación en tiempo real
        validateField(name as keyof PacienteData, newValue);
    };

    const validateField = (name: keyof PacienteData, value: string) => {
        let isValid = false;

        switch (name) {
            case 'nombre':
            case 'apellido':
                isValid = value.trim().length >= 2;
                break;
            case 'rut':
                if (value.length > 1) {
                    const rutValido = validarRUT(value);
                    isValid = rutValido.valido;
                } else {
                    isValid = false;
                }
                break;
            case 'email':
                if (value.length > 0) {
                    const emailValido = validarEmail(value);
                    isValid = emailValido.valido;
                } else {
                    isValid = false;
                }
                break;
            case 'telefono':
                // Validar que tenga 9 dígitos después del +56
                isValid = value.length === 12; // +56 + 9 dígitos
                break;
            case 'fecha_nacimiento':
                if (value) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    isValid = age >= 18;
                } else {
                    isValid = false;
                }
                break;
        }

        setValidStatus(prev => ({ ...prev, [name]: value ? isValid : null }));

        // Actualizar errores solo si es inválido y hay valor (para no mostrar error al borrar todo)
        if (value && !isValid) {
            // No setear error inmediatamente al escribir, dejar que el usuario termine
            // Pero sí actualizamos el status visual
        } else {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PacienteData, string>> = {};
        let isFormValid = true;

        // Nombre
        if (formData.nombre.length < 2) {
            newErrors.nombre = 'El nombre es requerido';
            isFormValid = false;
        }

        // Apellido
        if (formData.apellido.length < 2) {
            newErrors.apellido = 'El apellido es requerido';
            isFormValid = false;
        }

        // RUT
        const rutValido = validarRUT(formData.rut);
        if (!rutValido.valido) {
            newErrors.rut = rutValido.mensaje || 'RUT inválido';
            isFormValid = false;
        }

        // Email
        const emailValido = validarEmail(formData.email);
        if (!emailValido.valido) {
            newErrors.email = emailValido.mensaje || 'Email inválido';
            isFormValid = false;
        }

        // Teléfono
        if (formData.telefono.length !== 12) {
            newErrors.telefono = 'Teléfono inválido (debe tener 9 dígitos)';
            isFormValid = false;
        }

        // Fecha Nacimiento
        if (!formData.fecha_nacimiento) {
            newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
            isFormValid = false;
        } else {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.fecha_nacimiento = 'Debes ser mayor de 18 años';
                isFormValid = false;
            }
        }

        setErrors(newErrors);

        // Actualizar todos los status visuales
        setValidStatus({
            nombre: formData.nombre.length >= 2,
            apellido: formData.apellido.length >= 2,
            rut: rutValido.valido,
            email: emailValido.valido,
            telefono: formData.telefono.length === 12,
            fecha_nacimiento: !newErrors.fecha_nacimiento
        });

        return isFormValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onContinue(formData);
        }
    };

    // Componente para el icono de validación
    const ValidationIcon = ({ status }: { status?: boolean | null }) => {
        if (status === null || status === undefined) return null;
        return (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {status ? (
                    <FaCheck className="w-4 h-4 text-green-500" />
                ) : (
                    <FaTimes className="w-4 h-4 text-red-500" />
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Datos del Paciente</h2>
                    <p className="text-slate-600 text-sm">
                        Completa tu información personal para agendar la cita
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <FaUser className="w-4 h-4 text-indigo-600" />
                                Nombre
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.nombre === false ? 'border-red-500 focus:ring-red-200' :
                                        validStatus.nombre === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                        }`}
                                    placeholder="Juan"
                                />
                                <ValidationIcon status={validStatus.nombre} />
                            </div>
                            {errors.nombre && (
                                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                            )}
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <FaUser className="w-4 h-4 text-indigo-600" />
                                Apellido
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.apellido === false ? 'border-red-500 focus:ring-red-200' :
                                        validStatus.apellido === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                        }`}
                                    placeholder="Pérez"
                                />
                                <ValidationIcon status={validStatus.apellido} />
                            </div>
                            {errors.apellido && (
                                <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                            )}
                        </div>
                    </div>

                    {/* RUT */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaIdCard className="w-4 h-4 text-indigo-600" />
                            RUT
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="rut"
                                value={formData.rut}
                                onChange={handleChange}
                                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.rut === false ? 'border-red-500 focus:ring-red-200' :
                                    validStatus.rut === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                    }`}
                                placeholder="12.345.678-9"
                                maxLength={12}
                            />
                            <ValidationIcon status={validStatus.rut} />
                        </div>
                        {errors.rut && (
                            <p className="text-red-500 text-xs mt-1">{errors.rut}</p>
                        )}
                        {validStatus.rut === true && !errors.rut && (
                            <p className="text-green-600 text-xs mt-1">RUT válido ✓</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaEnvelope className="w-4 h-4 text-indigo-600" />
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.email === false ? 'border-red-500 focus:ring-red-200' :
                                    validStatus.email === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                    }`}
                                placeholder="juan.perez@example.com"
                            />
                            <ValidationIcon status={validStatus.email} />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaPhone className="w-4 h-4 text-indigo-600" />
                            Teléfono (WhatsApp)
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.telefono === false ? 'border-red-500 focus:ring-red-200' :
                                    validStatus.telefono === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                    }`}
                                placeholder="+56912345678"
                            />
                            <ValidationIcon status={validStatus.telefono} />
                        </div>
                        {errors.telefono && (
                            <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                        )}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaCalendar className="w-4 h-4 text-indigo-600" />
                            Fecha de Nacimiento
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validStatus.fecha_nacimiento === false ? 'border-red-500 focus:ring-red-200' :
                                    validStatus.fecha_nacimiento === true ? 'border-green-500 focus:ring-green-200' : 'border-slate-300'
                                    }`}
                            />
                            <ValidationIcon status={validStatus.fecha_nacimiento} />
                        </div>
                        {errors.fecha_nacimiento && (
                            <p className="text-red-500 text-xs mt-1">{errors.fecha_nacimiento}</p>
                        )}
                    </div>

                    {/* Dirección para atención a domicilio (opcional) */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FaHome className="w-4 h-4 text-indigo-600" />
                            Dirección (solo si necesitas atención a domicilio)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="direccion_domicilio"
                                value={formData.direccion_domicilio || ''}
                                onChange={handleChange}
                                className="w-full pl-4 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                placeholder="Ej: Av. Providencia 1234, Depto 305 (Opcional)"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Completa solo si el kinesiólogo atiende a domicilio
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            Continuar al Pago
                            <FaChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasoDatosPaciente;
