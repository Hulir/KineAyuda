// src/componentes/FiltrosBusqueda.tsx
import React, { useState } from 'react';
import {
    FaFilter, FaMapMarkerAlt, FaDollarSign, FaStethoscope,
    FaHome, FaBriefcase, FaTimes
} from 'react-icons/fa';
import type { FiltrosKinesiologo, EstadisticasFiltros } from '../services/pacientesPublicService';

import { REGIONES_Y_COMUNAS } from '../utils/regionesYComunas';

interface Props {
    onFiltrosChange: (filtros: FiltrosKinesiologo) => void;
    estadisticas?: EstadisticasFiltros | null;
}

const FiltrosBusqueda: React.FC<Props> = ({ onFiltrosChange, estadisticas }) => {
    const [filtrosVisible, setFiltrosVisible] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosKinesiologo>({
        especialidad: '',
        precioMin: undefined,
        precioMax: undefined,
        domicilio: false,
        consulta: false,
        comuna: '',
        ordenarPor: 'precio'
    });

    const aplicarFiltros = () => {
        onFiltrosChange(filtros);
        setFiltrosVisible(false);
    };

    const limpiarFiltros = () => {
        const filtrosVacíos: FiltrosKinesiologo = {
            especialidad: '',
            precioMin: undefined,
            precioMax: undefined,
            domicilio: false,
            consulta: false,
            comuna: '',
            ordenarPor: 'precio'
        };
        setFiltros(filtrosVacíos);
        onFiltrosChange(filtrosVacíos);
    };

    const contarFiltrosActivos = () => {
        let count = 0;
        if (filtros.especialidad) count++;
        if (filtros.precioMin || filtros.precioMax) count++;
        if (filtros.domicilio || filtros.consulta) count++;
        if (filtros.comuna) count++;
        return count;
    };

    return (
        <div className="mb-6">
            {/* Botón de filtros */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <button
                    onClick={() => setFiltrosVisible(!filtrosVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                >
                    <FaFilter className="w-4 h-4" />
                    <span>Filtros</span>
                    {contarFiltrosActivos() > 0 && (
                        <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {contarFiltrosActivos()}
                        </span>
                    )}
                </button>

                {/* Ordenamiento rápido con más opciones */}
                <select
                    value={filtros.ordenarPor}
                    onChange={(e) => {
                        const newFiltros = { ...filtros, ordenarPor: e.target.value as 'precio' | 'precio_desc' | 'nombre' };
                        setFiltros(newFiltros);
                        onFiltrosChange(newFiltros);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                    <option value="precio">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="nombre">Nombre: A-Z</option>
                </select>
            </div>

            {/* Panel de filtros */}
            {filtrosVisible && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Filtro: Especialidad */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <FaStethoscope className="text-indigo-600" />
                                Especialidad
                            </label>
                            <select
                                value={filtros.especialidad || ''}
                                onChange={(e) => setFiltros({ ...filtros, especialidad: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="">Todas las especialidades</option>
                                {estadisticas?.especialidades.map(esp => (
                                    <option key={esp} value={esp}>{esp}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro: Rango de Precios - SIN PLACEHOLDERS */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <FaDollarSign className="text-green-600" />
                                Rango de Precio
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={filtros.precioMin || ''}
                                        onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value ? Number(e.target.value) : undefined })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="number"
                                        value={filtros.precioMax || ''}
                                        onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value ? Number(e.target.value) : undefined })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-center">
                                    {estadisticas && `Rango disponible: $${estadisticas.precioRango.min?.toLocaleString('es-CL')} - $${estadisticas.precioRango.max?.toLocaleString('es-CL')}`}
                                </p>
                            </div>
                        </div>

                        {/* Filtro: Ubicación (Región y Comuna) */}
                        <div className="md:col-span-2 lg:col-span-1 space-y-3">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <FaMapMarkerAlt className="text-red-600" />
                                    Región
                                </label>
                                <select
                                    value={filtros.region || ''}
                                    onChange={(e) => {
                                        setFiltros({
                                            ...filtros,
                                            region: e.target.value || undefined,
                                            comuna: undefined // Reset comuna when region changes
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                >
                                    <option value="">Todas las regiones</option>
                                    {REGIONES_Y_COMUNAS.map(reg => (
                                        <option key={reg.nombre} value={reg.nombre}>{reg.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                    Comuna
                                </label>
                                <select
                                    value={filtros.comuna || ''}
                                    onChange={(e) => setFiltros({ ...filtros, comuna: e.target.value || undefined })}
                                    disabled={!filtros.region}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="">
                                        {filtros.region ? "Toda la región" : "Selecciona una región primero"}
                                    </option>
                                    {filtros.region && REGIONES_Y_COMUNAS.find(r => r.nombre === filtros.region)?.comunas.map(comuna => (
                                        <option key={comuna} value={comuna}>{comuna}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filtro: Modalidades - SIN ONLINE */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                Modalidad de Atención
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filtros.consulta || false}
                                        onChange={(e) => setFiltros({ ...filtros, consulta: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <FaBriefcase className="text-slate-500 w-4 h-4" />
                                    <span className="text-sm">En consulta/box</span>
                                    {estadisticas && estadisticas.modalidades.consulta > 0 && (
                                        <span className="text-xs text-slate-500">({estadisticas.modalidades.consulta})</span>
                                    )}
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filtros.domicilio || false}
                                        onChange={(e) => setFiltros({ ...filtros, domicilio: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <FaHome className="text-slate-500 w-4 h-4" />
                                    <span className="text-sm">A domicilio</span>
                                    {estadisticas && estadisticas.modalidades.domicilio > 0 && (
                                        <span className="text-xs text-slate-500">({estadisticas.modalidades.domicilio})</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                        <button
                            onClick={limpiarFiltros}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                            <FaTimes className="w-4 h-4" />
                            Limpiar
                        </button>
                        <button
                            onClick={aplicarFiltros}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltrosBusqueda;
