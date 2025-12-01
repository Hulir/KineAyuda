import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginKinesiologo } from "@/services/authService";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginFormKine() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const { backendData } = await loginKinesiologo(email, password);

            // Verificar estado del kinesiólogo
            const kineData = backendData?.kinesiologo;

            if (kineData) {
                // 1️⃣ Si está PENDIENTE de verificación → pantalla de espera
                if (kineData.estado_verificacion === "pendiente") {
                    navigate("/kinesiologo/aprobacion-pendiente");
                    return;
                }

                // 2️⃣ Si fue RECHAZADO → mostrar error
                if (kineData.estado_verificacion === "rechazado") {
                    setError("Tu cuenta ha sido rechazada. Por favor contacta a soporte.");
                    setCargando(false);
                    return;
                }
            }

            // ✅ Si está APROBADO → Panel directamente
            // La suscripción se verificará dentro del panel
            navigate("/panel-kine");

        } catch (err: any) {
            console.error("Error en login:", err);

            // Manejar errores específicos
            let errorMsg = "Error al iniciar sesión. Verifica tus datos.";

            if (err.message?.includes("auth/user-not-found")) {
                errorMsg = "No existe una cuenta registrada con este correo.";
            } else if (err.message?.includes("auth/wrong-password") || err.message?.includes("auth/invalid-credential")) {
                errorMsg = "Credenciales incorrectas. Verifica tu correo y contraseña.";
            } else if (err.message?.includes("auth/too-many-requests")) {
                errorMsg = "Demasiados intentos fallidos. Por seguridad, espera unos minutos antes de intentar nuevamente.";
            } else if (err.message?.includes("Token used too early")) {
                errorMsg = "Error de sincronización. Verifica que la hora de tu computadora sea correcta e intenta nuevamente.";
            } else if (err.message?.includes("Token")) {
                errorMsg = "Error de autenticación. Intenta nuevamente.";
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-indigo-600">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Accede a tu panel de kinesiólogo
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={mostrarPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {mostrarPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-red-700 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {cargando ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Ingresando...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Entrar</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">¿Aún no tienes cuenta?</span>
                        </div>
                    </div>

                    {/* Registration Link */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/kinesiologo/registro")}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline transition-colors"
                        >
                            Registrarse como kinesiólogo
                        </button>
                    </div>
                </div>

                {/* Helper text */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Al iniciar sesión, aceptas nuestros{" "}
                    <a href="#" className="text-indigo-600 hover:underline">términos y condiciones</a>
                </p>
            </div>
        </div>
    );
}
