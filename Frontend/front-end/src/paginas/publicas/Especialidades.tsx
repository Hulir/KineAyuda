// src/paginas/publicas/Especialidades.tsx
import { Link } from "react-router-dom";
import { rutas } from "../../rutas/Routes";
import { ESPECIALIDADES } from "./especialidadesDatos";

export default function Especialidades() {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
            <header className="mb-10 text-center md:text-left md:ml-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-2">
                    Especialidades kinésicas
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                    Conoce nuestras especialidades
                </h1>
                <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                    Cada especialidad está diseñada para acompañarte en distintas etapas
                    de tu proceso de rehabilitación y bienestar. Elige la que mejor se
                    adapta a tus necesidades y agenda una evaluación.
                </p>
            </header>

            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ESPECIALIDADES.map((esp) => (
                    <article
                        key={esp.id}
                        className="flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/80 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="px-5 pt-5 pb-3">
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">
                                {esp.nombre}
                            </h2>
                            <p className="text-sm text-slate-600">{esp.descripcionCorta}</p>
                        </div>

                        <div className="mt-auto px-5 pb-4 pt-1">
                            <Link
                                to={`${rutas.especialidades}/${esp.id}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Ver detalles
                                <span>→</span>
                            </Link>
                        </div>
                    </article>
                ))}
            </section>

            <div className="mt-10 text-center">
                <Link
                    to={rutas.reserva}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all"
                >
                    Agendar evaluación kinésica
                </Link>
            </div>
        </div>
    );
}
