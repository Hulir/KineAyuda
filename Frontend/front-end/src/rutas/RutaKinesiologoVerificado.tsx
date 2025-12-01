// src/rutas/RutaKinesiologoVerificado.tsx
import { useEffect, useState, type ReactNode } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Navigate, useLocation } from "react-router-dom";
import { rutas } from "./Routes";
import api from "../services/api";

interface RutaKinesiologoVerificadoProps {
    children: ReactNode;
}

export const RutaKinesiologoVerificado = ({ children }: RutaKinesiologoVerificadoProps) => {
    const [usuario, setUsuario] = useState<any>(null);
    const [estadoVerificacion, setEstadoVerificacion] = useState<string | null>(null);
    const [suscripcionActiva, setSuscripcionActiva] = useState<boolean | null>(null);
    const [cargando, setCargando] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Obtener token para autenticación
                    const token = await user.getIdToken();

                    // Llamar al endpoint /me/ que devuelve los datos del kinesiólogo
                    const responseMe = await api.get("/me/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    console.log("📊 Datos del kinesiólogo desde /me/:", responseMe.data);

                    if (responseMe.data) {
                        setEstadoVerificacion(responseMe.data.estado_verificacion);
                        console.log("🔍 Estado de verificación:", responseMe.data.estado_verificacion);
                    }

                    // Verificar estado de suscripción con el endpoint /pagos/estado/
                    try {
                        const responseSubs = await api.get("/pagos/estado/", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        console.log("💳 Estado de suscripción:", responseSubs.data);
                        setSuscripcionActiva(responseSubs.data.activa === true);
                    } catch (error: any) {
                        console.log("⚠️ No se pudo verificar suscripción:", error);
                        // Si hay error al verificar suscripción, asumimos que no tiene
                        setSuscripcionActiva(false);
                    }

                    setUsuario(user);
                } catch (error: any) {
                    console.error("Error al verificar estado del kinesiólogo:", error);

                    // Si el error es 404, significa que no tiene perfil de kinesiólogo
                    if (error.response?.status === 404) {
                        console.log("❌ Usuario sin perfil de kinesiólogo");
                    }

                    setUsuario(null);
                }
            } else {
                setUsuario(null);
            }
            setCargando(false);
        });

        return () => unsubscribe();
    }, []);

    if (cargando) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-700 font-medium">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Si no hay usuario autenticado, redirige al login
    if (!usuario) {
        return (
            <Navigate
                to={rutas.loginKine}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    console.log("🔍 Estado de verificación detectado:", estadoVerificacion);
    console.log("💳 Suscripción activa:", suscripcionActiva);

    // Si el estado es pendiente, redirige a la página de aprobación pendiente
    if (estadoVerificacion === "pendiente") {
        console.log("⏰ Usuario pendiente, redirigiendo a aprobación pendiente...");
        return <Navigate to="/kinesiologo/aprobacion-pendiente" replace />;
    }

    // Si el estado es rechazado, redirige al login con mensaje
    if (estadoVerificacion === "rechazado") {
        console.log("❌ Usuario rechazado, redirigiendo al login...");
        return <Navigate to={rutas.loginKine} replace state={{ error: "Tu cuenta ha sido rechazada" }} />;
    }

    // Si está aprobado PERO no tiene suscripción activa, redirige a la página de bienvenida
    if (estadoVerificacion === "aprobado" && suscripcionActiva === false) {
        console.log("🎉 Usuario aprobado sin suscripción, redirigiendo a bienvenida...");
        return <Navigate to="/kinesiologo/bienvenida-verificado" replace />;
    }

    console.log("✅ Usuario verificado con suscripción, permitiendo acceso al panel");
    // Usuario autenticado, verificado Y con suscripción: muestra el contenido protegido
    return <>{children}</>;
};

export default RutaKinesiologoVerificado;
