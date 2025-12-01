// src/paginas/kinesiologos/registro/PasoCuenta.tsx
import React, { useState } from "react";
import type { DatosCuentaKine } from "./useRegistroKine";
import { validarRUT, validarEmail, formatearRUT, capitalizarNombre } from "../../../utils/validaciones";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import IndicadorFortaleza from "./IndicadorFortaleza";

interface Props {
    datos: DatosCuentaKine;
    onChange: (campo: keyof DatosCuentaKine, valor: string | boolean) => void;
    onContinuar: () => void;
}

const PasoCuenta: React.FC<Props> = ({ datos, onChange, onContinuar }) => {
    const [mostrarPass, setMostrarPass] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [rutMensaje, setRutMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

    // Estados de validación en tiempo real
    const [validacionNombre, setValidacionNombre] = useState<boolean | null>(null);
    const [validacionApellido, setValidacionApellido] = useState<boolean | null>(null);
    const [validacionEmail, setValidacionEmail] = useState<boolean | null>(null);

    function normalizarNombre(valor: string): string {
        // Eliminar números y caracteres especiales, permitir solo letras y espacios
        const limpio = valor.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, "").replace(/\s+/g, " ");
        // Capitalizar primera letra de cada palabra
        return capitalizarNombre(limpio);
    }

    function actualizarNombre(campo: "nombre" | "apellido", valor: string) {
        const normalizado = normalizarNombre(valor);
        onChange(campo, normalizado);

        // Validación en tiempo real
        if (normalizado.trim().length >= 2) {
            if (campo === "nombre") {
                setValidacionNombre(true);
            } else {
                setValidacionApellido(true);
            }
        } else {
            if (campo === "nombre") {
                setValidacionNombre(normalizado.length > 0 ? false : null);
            } else {
                setValidacionApellido(normalizado.length > 0 ? false : null);
            }
        }

        // Limpiar error al modificar
        if (errores[campo]) {
            setErrores(prev => ({ ...prev, [campo]: "" }));
        }
    }

    function actualizarRut(valor: string) {
        // Usar el formateador de nuevas utilidades
        const formateado = formatearRUT(valor);
        onChange("rut", formateado);

        // Validación en vivo
        if (!formateado || formateado.replace(/[.\-]/g, "").length < 7) {
            setRutMensaje(null);
            return;
        }

        const validacion = validarRUT(formateado);
        if (validacion.valido) {
            setRutMensaje({ tipo: "success", texto: "RUT válido ✓" });
        } else {
            setRutMensaje({ tipo: "error", texto: validacion.mensaje || "RUT inválido" });
        }

        // Limpiar error de submit al modificar
        if (errores.rut) {
            setErrores(prev => ({ ...prev, rut: "" }));
        }
    }

    function actualizarEmail(valor: string) {
        onChange("email", valor);

        // Validación en tiempo real de email
        if (valor.trim().length > 0) {
            const validacion = validarEmail(valor);
            setValidacionEmail(validacion.valido);
        } else {
            setValidacionEmail(null);
        }

        // Limpiar error al modificar
        if (errores.email) {
            setErrores(prev => ({ ...prev, email: "" }));
        }
    }

    function validarYContinuar(e: React.FormEvent) {
        e.preventDefault();
        const nuevos: Record<string, string> = {};

        // Validar nombre
        if (!datos.nombre.trim() || datos.nombre.length < 2) {
            nuevos.nombre = "Ingresa un nombre válido (mínimo 2 letras).";
        }

        // Validar apellido
        if (!datos.apellido.trim() || datos.apellido.length < 2) {
            nuevos.apellido = "Ingresa un apellido válido (mínimo 2 letras).";
        }

        // Validar email con nueva utilidad
        const validacionEmailResult = validarEmail(datos.email);
        if (!validacionEmailResult.valido) {
            nuevos.email = validacionEmailResult.mensaje || "Email inválido";
        }

        // Validar RUT con nueva utilidad
        const validacionRUT = validarRUT(datos.rut);
        if (!validacionRUT.valido) {
            nuevos.rut = validacionRUT.mensaje || "RUT inválido";
        }

        // Las validaciones de password se manejan en el hook, aquí solo validamos básico
        if (!datos.password || datos.password.length < 8) {
            nuevos.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        if (datos.password !== datos.confirmarPassword) {
            nuevos.confirmarPassword = "Las contraseñas no coinciden.";
        }

        if (!datos.aceptaTerminos) {
            nuevos.terminos = "Debes aceptar los términos y condiciones para continuar.";
        }

        setErrores(nuevos);

        if (Object.keys(nuevos).length === 0) {
            onContinuar();
        }
    }

    return (
        <form onSubmit={validarYContinuar} className="space-y-6">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Crea tu cuenta profesional
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Ingresa tus datos personales para comenzar tu registro.
                </p>
            </div>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={datos.nombre}
                            onChange={(e) =>
                                actualizarNombre("nombre", e.target.value)
                            }
                        />
                        {/* Icono de validación */}
                        {validacionNombre !== null && (
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                {validacionNombre ? (
                                    <FiCheck className="w-5 h-5 text-green-500" />
                                ) : (
                                    <FiX className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {errores.nombre && (
                        <p className="mt-1 text-xs text-red-500">
                            {errores.nombre}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={datos.apellido}
                            onChange={(e) =>
                                actualizarNombre("apellido", e.target.value)
                            }
                        />
                        {/* Icono de validación */}
                        {validacionApellido !== null && (
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                {validacionApellido ? (
                                    <FiCheck className="w-5 h-5 text-green-500" />
                                ) : (
                                    <FiX className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {errores.apellido && (
                        <p className="mt-1 text-xs text-red-500">
                            {errores.apellido}
                        </p>
                    )}
                </div>
            </div>

            {/* Correo */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                </label>
                <div className="relative">
                    <input
                        type="email"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={datos.email}
                        onChange={(e) => actualizarEmail(e.target.value)}
                    />
                    {/* Icono de validación */}
                    {validacionEmail !== null && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            {validacionEmail ? (
                                <FiCheck className="w-5 h-5 text-green-500" />
                            ) : (
                                <FiX className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    )}
                </div>
                {/* Mensaje de validación en vivo */}
                {validacionEmail === true && !errores.email && (
                    <p className="mt-1 text-xs text-green-600">
                        Correo válido ✓
                    </p>
                )}
                {validacionEmail === false && !errores.email && (
                    <p className="mt-1 text-xs text-red-500">
                        Correo inválido
                    </p>
                )}
                {errores.email && (
                    <p className="mt-1 text-xs text-red-500">
                        {errores.email}
                    </p>
                )}
            </div>

            {/* RUT */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT
                </label>
                <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={datos.rut}
                    onChange={(e) => actualizarRut(e.target.value)}
                    placeholder="12.345.678-9"
                />

                {/* Mensaje en vivo (solo si no hay error de submit) */}
                {rutMensaje && rutMensaje.tipo === "success" && !errores.rut && (
                    <p className="mt-1 text-xs text-green-600">
                        {rutMensaje.texto}
                    </p>
                )}
                {rutMensaje && rutMensaje.tipo === "error" && !errores.rut && (
                    <p className="mt-1 text-xs text-red-500">
                        {rutMensaje.texto}
                    </p>
                )}

                {/* Mensaje de validación al enviar el formulario */}
                {errores.rut && (
                    <p className="mt-1 text-xs text-red-500">{errores.rut}</p>
                )}
            </div>

            {/* Contraseña + Confirmación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={mostrarPass ? "text" : "password"}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={datos.password}
                            onChange={(e) =>
                                onChange("password", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() => setMostrarPass((v) => !v)}
                        >
                            {mostrarPass ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errores.password && (
                        <p className="mt-1 text-xs text-red-500">
                            {errores.password}
                        </p>
                    )}
                    <IndicadorFortaleza password={datos.password} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={mostrarConfirm ? "text" : "password"}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={datos.confirmarPassword}
                            onChange={(e) =>
                                onChange("confirmarPassword", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() => setMostrarConfirm((v) => !v)}
                        >
                            {mostrarConfirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errores.confirmarPassword && (
                        <p className="mt-1 text-xs text-red-500">
                            {errores.confirmarPassword}
                        </p>
                    )}
                </div>
            </div>

            {/* Términos */}
            <div className="flex items-start gap-2">
                <input
                    id="terminos"
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-purple-500 rounded border-gray-300 focus:ring-purple-400"
                    checked={datos.aceptaTerminos}
                    onChange={(e) =>
                        onChange("aceptaTerminos", e.target.checked)
                    }
                />
                <label htmlFor="terminos" className="text-xs text-gray-600">
                    Acepto los{" "}
                    <span className="text-purple-600 font-semibold">
                        términos y condiciones
                    </span>{" "}
                    y autorizo el tratamiento de mis datos para el uso de
                    KineAyuda.
                </label>
            </div>

            {errores.terminos && (
                <p className="mt-1 text-xs text-red-500">
                    {errores.terminos}
                </p>
            )}

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
                >
                    Continuar
                </button>
            </div>
        </form>
    );
};

export default PasoCuenta;
