// src/paginas/kinesiologos/dashboard/Perfil.tsx
import { useEffect, useState } from "react";
import { getAuth, verifyBeforeUpdateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {
    obtenerPerfilKine,
    actualizarPerfilKine,
    type Kinesiologo,
} from "../../../services/kinesiologosService";

import { REGIONES_Y_COMUNAS } from "../../../utils/regionesYComunas";

export default function Perfil() {
    const [perfil, setPerfil] = useState<Kinesiologo | null>(null);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    // Estado del formulario (editable)
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        rut: "",
        especialidad: "",
        nro_titulo: "",
        doc_verificacion: "",
        precio_consulta: 25000,
        atiende_consulta: true,
        atiende_domicilio: false,
        direccion_consulta: "",
        comuna: "",
        region: "",
        comunas_domicilio: [] as string[],
    });

    // Estado para cambio de contraseña
    const [cambiarPassword, setCambiarPassword] = useState(false);
    const [passwordAntigua, setPasswordAntigua] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [passwordConfirmar, setPasswordConfirmar] = useState("");
    const [guardandoPassword, setGuardandoPassword] = useState(false);

    // Cargar perfil al montar
    useEffect(() => {
        async function cargarPerfil() {
            try {
                setLoading(true);
                const data = await obtenerPerfilKine();
                setPerfil(data);
                setForm({
                    nombre: data.nombre || "",
                    apellido: data.apellido || "",
                    email: data.email || "",
                    rut: data.rut || "",
                    especialidad: data.especialidad || "",
                    nro_titulo: data.nro_titulo || "",
                    doc_verificacion: data.doc_verificacion || "",
                    precio_consulta: data.precio_consulta || 25000,
                    atiende_consulta: data.atiende_consulta ?? true,
                    atiende_domicilio: data.atiende_domicilio ?? false,
                    direccion_consulta: data.direccion_consulta || "",
                    comuna: data.comuna || "",
                    region: data.region || "",
                    comunas_domicilio: data.comunas_domicilio || [],
                });
            } catch (err: any) {
                console.error("Error al cargar perfil:", err);
                setError(
                    err.response?.data?.detail ||
                    "No se pudo cargar el perfil. ¿Ya creaste tu cuenta de kinesiólogo?"
                );
            } finally {
                setLoading(false);
            }
        }
        cargarPerfil();
    }, []);

    // Sincronizar email de Firebase con Django automáticamente
    useEffect(() => {
        async function sincronizarEmail() {
            if (!perfil) return;

            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) return;

            // Si el email de Firebase es diferente al de Django, sincronizar
            if (user.email !== perfil.email) {
                console.log(`Sincronizando email: Firebase="${user.email}" vs Django="${perfil.email}"`);
                try {
                    const actualizado = await actualizarPerfilKine({ email: user.email });
                    setPerfil(actualizado);
                    // user.email ya fue validado arriba que no es null
                    setForm(prev => ({ ...prev, email: user.email! }));
                    console.log("Email sincronizado exitosamente con Django");
                } catch (err) {
                    console.error("Error al sincronizar email:", err);
                    // Silencioso: no mostramos error al usuario, se intentará en próxima carga
                }
            }
        }

        sincronizarEmail();
    }, [perfil]);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setForm((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setError(null);
        setExito(null);

        try {
            // Sincronizar email con Firebase si cambió
            if (perfil && form.email !== perfil.email) {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user || !user.email) {
                    setError("Debes volver a iniciar sesión para actualizar el email.");
                    setGuardando(false);
                    return;
                }

                try {
                    const pwd = window.prompt("Ingresa tu contraseña actual para confirmar el cambio de email:");
                    if (!pwd) {
                        setError("Cambio de email cancelado: no se ingresó la contraseña.");
                        setGuardando(false);
                        return;
                    }
                    const credential = EmailAuthProvider.credential(user.email, pwd);
                    await reauthenticateWithCredential(user, credential);

                    // Enviar email de verificación al nuevo correo
                    await verifyBeforeUpdateEmail(user, form.email);

                    // Informar al usuario que debe verificar su correo
                    setExito(
                        `Se ha enviado un correo de verificación a ${form.email}. ` +
                        "Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar el cambio de email."
                    );
                    setGuardando(false);
                    return; // No continuar con la actualización del perfil aún
                } catch (firebaseError: any) {
                    const code = firebaseError.code;
                    if (code === 'auth/wrong-password') {
                        setError("Contraseña incorrecta. Intenta nuevamente.");
                    } else if (code === 'auth/requires-recent-login') {
                        setError("Debes volver a iniciar sesión y reintentar el cambio de email.");
                    } else if (code === 'auth/email-already-in-use') {
                        setError("Este email ya está en uso por otra cuenta.");
                    } else if (code === 'auth/invalid-email') {
                        setError("El formato del email no es válido.");
                    } else if (code === 'auth/operation-not-allowed') {
                        setError("El cambio de email no está permitido. Contacta a soporte.");
                    } else {
                        setError(`Error al cambiar email: ${firebaseError.message}`);
                    }
                    setGuardando(false);
                    return;
                }
            }

            // Actualizar perfil en Django
            const actualizado = await actualizarPerfilKine({
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
                especialidad: form.especialidad,
                nro_titulo: form.nro_titulo,
                doc_verificacion: form.doc_verificacion,
                precio_consulta: form.precio_consulta,
                atiende_consulta: form.atiende_consulta,
                atiende_domicilio: form.atiende_domicilio,
                direccion_consulta: form.direccion_consulta,
                comuna: form.comuna,
                region: form.region,
                comunas_domicilio: form.comunas_domicilio,
            });

            setPerfil(actualizado);
            setExito("Perfil actualizado correctamente.");
        } catch (err: any) {
            console.error("Error al guardar perfil:", err);
            setError(
                err.response?.data?.detail ||
                err.message ||
                "No se pudo guardar el perfil. Revisa los datos ingresados."
            );
        } finally {
            setGuardando(false);
        }
    };

    // Función para cambiar contraseña
    const handleCambiarPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardandoPassword(true);
        setError(null);
        setExito(null);

        // Validaciones
        if (!passwordAntigua || !passwordNueva || !passwordConfirmar) {
            setError("Todos los campos de contraseña son requeridos.");
            setGuardandoPassword(false);
            return;
        }

        if (passwordNueva.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            setGuardandoPassword(false);
            return;
        }

        if (passwordNueva !== passwordConfirmar) {
            setError("Las contraseñas nuevas no coinciden.");
            setGuardandoPassword(false);
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) {
                setError("Usuario no autenticado.");
                setGuardandoPassword(false);
                return;
            }

            // Reautenticar usuario
            const credential = EmailAuthProvider.credential(user.email, passwordAntigua);
            await reauthenticateWithCredential(user, credential);

            // Cambiar contraseña
            await updatePassword(user, passwordNueva);

            // Limpiar campos
            setPasswordAntigua("");
            setPasswordNueva("");
            setPasswordConfirmar("");
            setCambiarPassword(false);
            setExito("Contraseña cambiada exitosamente.");
        } catch (err: any) {
            const code = err.code;
            if (code === 'auth/wrong-password') {
                setError("Contraseña actual incorrecta.");
            } else if (code === 'auth/requires-recent-login') {
                setError("Debes volver a iniciar sesión para cambiar tu contraseña.");
            } else if (code === 'auth/weak-password') {
                setError("La contraseña es muy débil. Debe tener al menos 6 caracteres.");
            } else {
                setError(`Error al cambiar contraseña: ${err.message}`);
            }
        } finally {
            setGuardandoPassword(false);
        }
    };


    if (loading) {
        return <p className="text-gray-600">Cargando perfil...</p>;
    }

    if (!perfil) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-2">Mi Perfil</h1>
                <p className="text-gray-600">
                    No se encontró un perfil de kinesiólogo asociado a tu cuenta.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}
            {exito && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
                    {exito}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>

                {/* Apellido */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                    </label>
                    <input
                        type="text"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>

                {/* Email (editable) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>

                {/* RUT (sólo lectura) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        RUT (no editable)
                    </label>
                    <input
                        type="text"
                        name="rut"
                        value={form.rut}
                        readOnly
                        disabled
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500"
                    />
                </div>

                {/* Especialidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidad
                    </label>
                    <input
                        type="text"
                        name="especialidad"
                        value={form.especialidad}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>

                {/* Número de título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de título
                    </label>
                    <input
                        type="text"
                        name="nro_titulo"
                        value={form.nro_titulo}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>

                {/* Precio de Consulta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio de Consulta (CLP) 💰
                    </label>
                    <input
                        type="number"
                        name="precio_consulta"
                        value={form.precio_consulta}
                        onChange={handleChange}
                        min="1000"
                        step="1000"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Este precio se mostrará a los pacientes al reservar cita</p>
                </div>

                {/* Modalidades de Atención */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Modalidades de Atención</h3>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                name="atiende_consulta"
                                checked={form.atiende_consulta}
                                onChange={handleChange}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block text-sm font-medium text-gray-700">Atención en Consulta</span>
                                <span className="block text-xs text-gray-500">Dispongo de box/consulta</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                name="atiende_domicilio"
                                checked={form.atiende_domicilio}
                                onChange={handleChange}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block text-sm font-medium text-gray-700">Atención a Domicilio</span>
                                <span className="block text-xs text-gray-500">Voy al hogar del paciente</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Ubicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Región
                            </label>
                            <select
                                name="region"
                                value={form.region}
                                onChange={(e) => {
                                    setForm(prev => ({
                                        ...prev,
                                        region: e.target.value,
                                        comuna: "" // Reset comuna when region changes
                                    }));
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                required
                            >
                                <option value="">Selecciona una región</option>
                                {REGIONES_Y_COMUNAS.map(reg => (
                                    <option key={reg.nombre} value={reg.nombre}>{reg.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Comuna - solo si atiende en consulta */}
                        {form.atiende_consulta && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Comuna
                                </label>
                                <select
                                    name="comuna"
                                    value={form.comuna}
                                    onChange={handleChange}
                                    disabled={!form.region}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                    required
                                >
                                    <option value="">
                                        {form.region ? "Selecciona una comuna" : "Selecciona una región primero"}
                                    </option>
                                    {form.region && REGIONES_Y_COMUNAS.find(r => r.nombre === form.region)?.comunas.map(comuna => (
                                        <option key={comuna} value={comuna}>{comuna}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Dirección Consulta - solo si atiende en consulta */}
                        {form.atiende_consulta && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección de Consulta (Calle y Número)
                                </label>
                                <input
                                    type="text"
                                    name="direccion_consulta"
                                    value={form.direccion_consulta}
                                    onChange={handleChange}
                                    placeholder="Ej: Av. Providencia 1234, Of. 505"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo si atiendes en consulta/box</p>
                            </div>
                        )}

                        {/* Multi-select Comunas Domicilio */}
                        {form.atiende_domicilio && form.region && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comunas donde atiende a domicilio
                                </label>
                                <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                                    {REGIONES_Y_COMUNAS.find(r => r.nombre === form.region)?.comunas.map(comuna => (
                                        <label key={comuna} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.comunas_domicilio.includes(comuna)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setForm(prev => ({
                                                            ...prev,
                                                            comunas_domicilio: [...prev.comunas_domicilio, comuna]
                                                        }));
                                                    } else {
                                                        setForm(prev => ({
                                                            ...prev,
                                                            comunas_domicilio: prev.comunas_domicilio.filter(c => c !== comuna)
                                                        }));
                                                    }
                                                }}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-700">{comuna}</span>
                                        </label>
                                    ))}
                                </div>
                                {form.comunas_domicilio.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {form.comunas_domicilio.map(c => (
                                            <span key={c} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Código doc verificación (opcional) */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de verificación / glosa
                    </label>
                    <input
                        type="text"
                        name="doc_verificacion"
                        value={form.doc_verificacion}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Ej: Registro MINSAL, N° de certificado, etc."
                    />
                </div>

                {/* Estado verificación (sólo lectura) */}
                <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">
                        Estado de verificación:
                    </span>{" "}
                    <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ml-1 ${perfil.estado_verificacion === "aprobado"
                            ? "bg-green-100 text-green-700"
                            : perfil.estado_verificacion === "rechazado"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {perfil.estado_verificacion.toUpperCase()}
                    </span>
                </div>

                {/* Botón guardar */}
                <div className="md:col-span-2 flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={guardando}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>

            {/* Sección de cambio de contraseña */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                    {!cambiarPassword && (
                        <button
                            onClick={() => setCambiarPassword(true)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            Cambiar contraseña
                        </button>
                    )}
                </div>

                {cambiarPassword && (
                    <form onSubmit={handleCambiarPassword} className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-4">
                            {/* Contraseña actual */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    value={passwordAntigua}
                                    onChange={(e) => setPasswordAntigua(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Nueva contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={passwordNueva}
                                    onChange={(e) => setPasswordNueva(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={passwordConfirmar}
                                    onChange={(e) => setPasswordConfirmar(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCambiarPassword(false);
                                        setPasswordAntigua("");
                                        setPasswordNueva("");
                                        setPasswordConfirmar("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardandoPassword}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
                                >
                                    {guardandoPassword ? "Cambiando..." : "Cambiar contraseña"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
