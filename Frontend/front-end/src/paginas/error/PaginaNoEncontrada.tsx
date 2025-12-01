// src/paginas/error/PaginaNoEncontrada.tsx
import { Link } from "react-router-dom";
import { rutas } from "../../rutas/Routes";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function PaginaNoEncontrada() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-indigo-800 via-purple-700 to-indigo-600 text-white px-6">
            {/* Animación de entrada */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-lg"
            >
                <h1 className="text-8xl font-extrabold text-white drop-shadow-lg">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Página no encontrada</h2>
                <p className="text-gray-200 mt-2">
                    Lo sentimos 😔, la página que estás buscando no existe o ha sido movida.
                </p>

                <div className="mt-8">
                    <Link
                        to={rutas.inicio}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
                    >
                        <Home size={20} />
                        Volver al inicio
                    </Link>
                </div>
            </motion.div>

            {/* Imagen decorativa opcional */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 flex justify-center mb-10"
            >
                <p className="text-sm text-gray-300">
                    KineAyuda © {new Date().getFullYear()} — Todos los derechos reservados
                </p>
            </motion.div>
        </div>
    );
}
