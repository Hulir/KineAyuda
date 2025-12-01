// src/paginas/kinesiologos/dashboard/Citas.tsx
import { useEffect, useState } from "react";
import {
    obtenerCitasKine,
    actualizarEstadoCita,
    reagendarCita,
    actualizarNotaCita,
} from "../../../services/citasService";
import type { Cita, EstadoCita } from "../../../services/citasService";

import { format } from "date-fns";
import { es as esES } from "date-fns/locale";

type FiltroRango = "todas" | "hoy" | "semana" | "mes";

export default function Citas() {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);

    const [estadoFiltro, setEstadoFiltro] = useState<EstadoCita | "todas">(
        "todas"
    );
    const [rangoFiltro, setRangoFiltro] = useState<FiltroRango>("semana");
    const [busqueda, setBusqueda] = useState("");

    const [modalCita, setModalCita] = useState<Cita | null>(null);
    const [nuevoInicio, setNuevoInicio] = useState<string>("");
    const [modalNota, setModalNota] = useState<Cita | null>(null);
    const [notaTexto, setNotaTexto] = useState<string>("");

    const cargarCitas = async () => {
        setLoading(true);
        try {
            const data = await obtenerCitasKine();
            setCitas(data || []);
        } catch (e) {
            console.error("Error al cargar citas:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCitas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🔍 Filtro por texto + estado + (opcional) rango
    const citasFiltradas = citas.filter((c) => {
        // filtro por texto
        if (busqueda.trim()) {
            const texto = `${c.paciente.nombre} ${c.paciente.apellido} ${c.paciente.email}`.toLowerCase();
            if (!texto.includes(busqueda.toLowerCase())) return false;
        }

        // filtro por estado
        if (estadoFiltro !== "todas" && c.estado !== estadoFiltro) return false;

        // filtro por rango (muy simple de momento: sólo hoy/semana/mes comparando por fecha actual)
        if (rangoFiltro !== "todas") {
            const hoy = new Date();
            const fecha = new Date(c.fecha_hora);

            if (rangoFiltro === "hoy") {
                const mismaFecha =
                    fecha.getFullYear() === hoy.getFullYear() &&
                    fecha.getMonth() === hoy.getMonth() &&
                    fecha.getDate() === hoy.getDate();
                if (!mismaFecha) return false;
            }

            if (rangoFiltro === "semana") {
                const diffDias = Math.abs(
                    Math.floor(
                        (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                    )
                );
                if (diffDias > 7) return false;
            }

            if (rangoFiltro === "mes") {
                const mismoMes =
                    fecha.getFullYear() === hoy.getFullYear() &&
                    fecha.getMonth() === hoy.getMonth();
                if (!mismoMes) return false;
            }
        }

        return true;
    });

    const manejarCambioEstado = async (cita: Cita, nuevoEstado: EstadoCita) => {
        try {
            const actualizada = await actualizarEstadoCita(cita.id, nuevoEstado);
            setCitas((prev) =>
                prev.map((c) => (c.id === cita.id ? (actualizada as Cita) : c))
            );
        } catch (e) {
            console.error("Error al actualizar estado:", e);
            alert("No se pudo actualizar el estado de la cita.");
        }
    };

    const abrirModalReagendar = (cita: Cita) => {
        setModalCita(cita);
        // asumimos ISO string, recortamos a yyyy-MM-ddTHH:mm
        setNuevoInicio(cita.fecha_hora.slice(0, 16));
    };

    const guardarReagendo = async () => {
        if (!modalCita || !nuevoInicio) return;
        try {
            const actualizada = await reagendarCita(
                modalCita.id,
                new Date(nuevoInicio).toISOString()
            );
            setCitas((prev) =>
                prev.map((c) => (c.id === modalCita.id ? (actualizada as Cita) : c))
            );
            setModalCita(null);
        } catch (e) {
            console.error("Error al reagendar cita:", e);
            alert("No se pudo reagendar la cita.");
        }
    };

    const formatearFecha = (iso: string) =>
        format(new Date(iso), "dd MMM yyyy", { locale: esES });
    const formatearHora = (iso: string) =>
        format(new Date(iso), "HH:mm", { locale: esES });

    const abrirModalNota = (cita: Cita) => {
        setModalNota(cita);
        setNotaTexto(cita.nota || "");
    };

    const guardarNota = async () => {
        if (!modalNota) return;
        try {
            const actualizada = await actualizarNotaCita(modalNota.id, notaTexto);
            setCitas((prev) =>
                prev.map((c) => (c.id === modalNota.id ? (actualizada as Cita) : c))
            );
            setModalNota(null);
        } catch (e) {
            console.error("Error al guardar nota:", e);
            alert("No se pudo guardar la nota.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Mis Citas</h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Revisa, marca como completadas o reagenda tus citas.
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-4 w-full">
                {/* Estado */}
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 mb-1">
                        Estado
                    </span>
                    <div className="flex bg-white border rounded-lg overflow-hidden">
                        {["todas", "pendiente", "completada", "cancelada"].map(
                            (estado) => (
                                <button
                                    key={estado}
                                    onClick={() =>
                                        setEstadoFiltro(estado as EstadoCita | "todas")
                                    }
                                    className={`px-3 py-1 text-xs md:text-sm ${estadoFiltro === estado
                                        ? "bg-indigo-500 text-white"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {estado === "todas"
                                        ? "Todas"
                                        : estado.charAt(0).toUpperCase() + estado.slice(1)}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Rango */}
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 mb-1">
                        Rango
                    </span>
                    <div className="flex bg-white border rounded-lg overflow-hidden">
                        {["todas", "hoy", "semana", "mes"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRangoFiltro(r as FiltroRango)}
                                className={`px-3 py-1 text-xs md:text-sm ${rangoFiltro === r
                                    ? "bg-indigo-500 text-white"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {r === "todas" ? "Todas" : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buscador */}
                <div className="flex-1 min-w-[200px]">
                    <span className="text-xs font-semibold text-gray-500 mb-1 block">
                        Buscar paciente
                    </span>
                    <input
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Nombre, apellido o correo."
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex">
                    <button
                        onClick={cargarCitas}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-lg text-sm w-full md:w-auto"
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Tabla / listado */}
            {loading ? (
                <div className="py-10 text-center text-gray-500">Cargando citas...</div>
            ) : citasFiltradas.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                    No hay citas para los filtros seleccionados.
                </div>
            ) : (
                <div className="-mx-2 md:mx-0 overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left px-3 py-2 whitespace-nowrap">Fecha</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Hora</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Paciente</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Estado</th>
                                <th className="text-left px-3 py-2 whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citasFiltradas.map((cita) => (
                                <tr key={cita.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {formatearFecha(cita.fecha_hora)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {formatearHora(cita.fecha_hora)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {(() => {
                                            const p = cita.paciente_detalle || cita.paciente;
                                            return (
                                                <>
                                                    <div className="font-medium">
                                                        {p?.nombre} {p?.apellido}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{p?.email}</div>
                                                    {p?.rut && (
                                                        <div className="text-xs text-gray-500">RUT: {p.rut}</div>
                                                    )}
                                                    {p?.telefono && (
                                                        <div className="text-xs text-gray-500">Tel: {p.telefono}</div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-3 py-2 capitalize whitespace-nowrap">{cita.estado}</td>
                                    <td className="px-3 py-2 flex flex-wrap gap-2">
                                        {cita.estado === "completada" ? (
                                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                                                ✓ Completada
                                            </span>
                                        ) : (
                                            <>
                                                {cita.estado === "pendiente" && new Date(cita.fecha_hora) <= new Date() && (
                                                    <button
                                                        onClick={() =>
                                                            manejarCambioEstado(cita, "completada")
                                                        }
                                                        className="px-2 py-1 text-xs rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
                                                    >
                                                        Marcar completada
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => abrirModalNota(cita)}
                                                    className="px-2 py-1 text-xs rounded bg-slate-500 text-white hover:bg-slate-600 transition"
                                                >
                                                    Nota
                                                </button>
                                                {cita.estado !== "cancelada" && (
                                                    <button
                                                        onClick={() => abrirModalReagendar(cita)}
                                                        className="px-2 py-1 text-xs rounded bg-indigo-500 text-white hover:bg-indigo-600 transition whitespace-nowrap"
                                                    >
                                                        Reagendar
                                                    </button>
                                                )}
                                                {cita.estado !== "cancelada" && (
                                                    <button
                                                        onClick={() =>
                                                            manejarCambioEstado(cita, "cancelada")
                                                        }
                                                        className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Reagendar */}
            {modalCita && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold mb-3">Reagendar cita</h2>
                        <p className="text-sm text-gray-600 mb-3">
                            {modalCita.paciente.nombre} {modalCita.paciente.apellido}
                        </p>
                        <label className="block text-sm mb-1">Nueva fecha y hora</label>
                        <input
                            type="datetime-local"
                            value={nuevoInicio}
                            onChange={(e) => setNuevoInicio(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalCita(null)}
                                className="px-3 py-2 text-sm border rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarReagendo}
                                className="px-3 py-2 text-sm rounded-lg bg-indigo-500 text-white"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nota */}
            {modalNota && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold mb-3">Nota de la cita</h2>
                        <p className="text-sm text-gray-600 mb-3">
                            {modalNota.paciente.nombre} {modalNota.paciente.apellido}
                        </p>
                        <textarea
                            value={notaTexto}
                            onChange={(e) => setNotaTexto(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mb-4 text-sm min-h-[120px]"
                            placeholder="Diagnóstico, seguimiento, indicaciones, etc."
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalNota(null)}
                                className="px-3 py-2 text-sm border rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarNota}
                                className="px-3 py-2 text-sm rounded-lg bg-indigo-500 text-white"
                            >
                                Guardar nota
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
