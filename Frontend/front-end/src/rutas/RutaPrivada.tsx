// src/rutas/RutaPrivada.tsx
import { useEffect, useState, type ReactNode } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Navigate, useLocation } from "react-router-dom";
import { rutas } from "./Routes";

interface RutaPrivadaProps {
    children: ReactNode;
}

export const RutaPrivada = ({ children }: RutaPrivadaProps) => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [cargando, setCargando] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setCargando(false);
        });

        return () => unsubscribe();
    }, []);

    if (cargando) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-700">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mr-3"></div>
                <p>Verificando sesión...</p>
            </div>
        );
    }

    // Si no hay usuario autenticado, redirige al login de kinesiólogo
    if (!usuario) {
        console.warn("⚠️ No hay usuario autenticado. Redirigiendo al login de kine...");
        return (
            <Navigate
                to={rutas.loginKine}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // Usuario autenticado: muestra el contenido protegido
    return <>{children}</>;
};

export default RutaPrivada;
