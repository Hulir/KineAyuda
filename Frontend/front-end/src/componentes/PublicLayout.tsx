// src/componentes/PublicLayout.tsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import HeaderPrincipal from "./HeaderPrincipal";
import Footer from "./Footer";

// Este componente envuelve todas las páginas públicas
// para que tengan el mismo Header y Footer.
export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-kineayuda-light text-gray-900 dark:text-gray-100 transition-colors duration-500">
            <HeaderPrincipal />

            <main className="flex-1 overflow-y-auto pt-24 md:pt-28">
                <Suspense fallback={<div className="p-6 text-center">Cargando contenido.</div>}>
                    <Outlet /> {/* Aquí se renderizan Inicio, Contacto, etc. */}
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}