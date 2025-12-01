// src/paginas/publicas/EspecialidadDetalle.tsx
import { useParams, Link } from "react-router-dom";
import { rutas } from "../../rutas/Routes";
import { getEspecialidadPorId } from "./especialidadesDatos";

export default function EspecialidadDetalle() {
    const { id } = useParams<{ id: string }>();
    const especialidad = id ? getEspecialidadPorId(id) : undefined;

    if (!especialidad) {
        return (
            <div className="max-w-4xl mx-auto px-4 pt-16 pb-16 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Especialidad no encontrada
                </h1>
                <p className="text-sm text-slate-600 mb-6">
                    La especialidad que buscas no existe o ha cambiado de nombre.
                </p>
                <Link
                    to={rutas.especialidades}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                >
                    Volver a especialidades
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-16">
            {/* Cabecera */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-2">
                    Especialidades kinésicas
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                    {especialidad.nombre}
                </h1>
                <p className="text-sm md:text-base text-slate-600 max-w-3xl">
                    {especialidad.descripcionLarga}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        to={rutas.reserva}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all"
                    >
                        Agenda tu hora de evaluación
                    </Link>
                    <Link
                        to={rutas.especialidades}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/80 text-indigo-700 text-xs font-semibold border border-indigo-100 hover:bg-white"
                    >
                        ← Ver todas las especialidades
                    </Link>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid md:grid-cols-2 gap-10">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        Procedimientos y técnicas frecuentes
                    </h2>
                    <ul className="space-y-2 text-sm text-slate-700">
                        {especialidad.procedimientos.map((proc) => (
                            <li key={proc} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                <span>{proc}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        Beneficios para tu salud
                    </h2>
                    <ul className="space-y-2 text-sm text-slate-700">
                        {especialidad.beneficios.map((ben) => (
                            <li key={ben} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>{ben}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
