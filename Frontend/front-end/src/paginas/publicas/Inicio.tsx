// src/paginas/publicas/Inicio.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroInicioCarrusel from "../../componentes/HeroInicioCarrusel";
import ServiciosCarrusel from "../../componentes/ServiciosCarrusel";
import Resenas from "../../componentes/Resenas";
import { rutas } from "../../rutas/Routes";

export default function Inicio() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [resenas] = useState<any[]>([]); // se llenará con backend después

    // Scroll al inicio al cargar la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full text-gray-900 overflow-x-hidden">
            {/* ======================================================
               HERO PRINCIPAL — Estilo profesional
            ======================================================= */}
            {/* HERO PRINCIPAL */}
            <section className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Columna izquierda */}
                <div className="space-y-6">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-700">
                        Bienestar kinésico digital
                        <span className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        <span className="text-slate-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                            Bienvenidos a
                        </span>{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                            KineAyuda
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed">
                        En{" "}
                        <span className="font-semibold text-indigo-600">
                            KineAyuda
                        </span>{" "}
                        conectamos pacientes con kinesiólogos certificados, para que puedas reservar tu atención
                        de forma rápida, segura y personalizada desde cualquier lugar.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/reserva-cita"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white font-semibold shadow-lg hover:shadow-xl hover:translate-y-0.5 transition-all text-sm"
                        >
                            Reservar cita ahora
                        </Link>
                        <Link
                            to="/kinesiologo"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-indigo-300 text-indigo-800 font-semibold text-sm hover:bg-indigo-50 transition-colors"
                        >
                            Soy Kinesiólogo
                        </Link>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 italic">
                        Profesionales validados, agenda en línea, recordatorios automáticos y reseñas con análisis inteligente.
                    </p>
                </div>

                {/* Columna derecha: Carrusel */}
                <div className="relative flex justify-center items-center">
                    <HeroInicioCarrusel />
                </div>
            </section>


            {/* ======================================================
               NUESTROS SERVICIOS
            ======================================================= */}
            <section className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-8 text-slate-900">
                    Nuestros servicios
                </h2>

                <div className="max-w-6xl mx-auto px-4">
                    <ServiciosCarrusel />

                    {/* Ver más especialidades */}
                    <div className="mt-8 flex justify-center">
                        <Link
                            to={rutas.especialidades}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-200 bg-white/70 text-indigo-700 text-sm font-semibold shadow-sm hover:bg-white hover:shadow-md transition-all"
                        >
                            Ver más especialidades
                            <span className="text-lg leading-none">+</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ======================================================
               FUTUROS CONVENIOS
            ======================================================= */}
            <section className="py-16" style={{ background: 'linear-gradient(135deg, #dfe0ff 0%, #cdd9ff 40%, #b7e2ff 100%)' }}>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Próximamente
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                        Convenios en Camino
                    </h2>
                    <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
                        Estamos trabajando para integrar convenios con las principales instituciones de salud,
                        facilitando el acceso a kinesiología para todos.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 grayscale">
                        {/* Placeholder para logos - puedes reemplazar con logos reales */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-2xl font-bold text-slate-700">FONASA</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-700">Isapre Consalud</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-xl font-bold text-green-700">Colmena</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-xl font-bold text-red-700">Cruz Blanca</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-slate-500 italic">
                        * Los convenios están en proceso de gestión y estarán disponibles próximamente.
                    </p>
                </div>
            </section>

            {/* ======================================================
               RESEÑAS (solo si hay datos)
            ======================================================= */}
            {resenas.length > 0 && (
                <section className="py-12 px-4 md:px-12 text-center">
                    <button
                        onClick={() => setMostrarModal(true)}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Ver más reseñas
                    </button>
                </section>
            )}

            {mostrarModal && <Resenas resenas={resenas} onClose={() => setMostrarModal(false)} />}
        </div>
    );
}
