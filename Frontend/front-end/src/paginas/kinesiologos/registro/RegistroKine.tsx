// src/paginas/kinesiologos/registro/RegistroKine.tsx
import React from "react";
import { useRegistroKine } from "./useRegistroKine";
import PasoCuenta from "./PasoCuenta";
import PasoProfesional from "./PasoProfesional";

const RegistroKine: React.FC = () => {
    const {
        pasoActual,

        datosCuenta,
        actualizarCuenta,

        datosProfesionales,
        actualizarProfesionales,

        documentos,
        actualizarDocumento,

        irSiguientePaso,
        irPasoAnterior,

        enviarRegistro,

        cargando,
        progresoCarga,
        error,
        exito,
    } = useRegistroKine();

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">

            {/* Barra de pasos */}
            <div className="flex justify-center mb-10">
                <div className="flex items-center gap-4">

                    {/* Paso 1 */}
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                        ${pasoActual === 1
                                ? "bg-purple-600 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                    >
                        1
                    </div>

                    <div className="w-12 h-1 bg-gray-300"></div>

                    {/* Paso 2 */}
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                        ${pasoActual === 2
                                ? "bg-purple-600 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                    >
                        2
                    </div>
                </div>
            </div>

            {/* Tarjeta */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

                {/* Error */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Éxito */}
                {exito && (
                    <div className="mb-6 p-3 rounded-xl bg-green-100 text-green-700 text-sm">
                        {exito}
                    </div>
                )}

                {/* PASO 1 */}
                {pasoActual === 1 && (
                    <PasoCuenta
                        datos={datosCuenta}
                        onChange={actualizarCuenta}
                        onContinuar={irSiguientePaso}
                    />
                )}

                {/* PASO 2 */}
                {pasoActual === 2 && (
                    <PasoProfesional
                        datosProfesionales={datosProfesionales}
                        documentos={documentos}
                        onChangeProfesional={actualizarProfesionales}
                        onChangeDocumento={actualizarDocumento}
                        onVolver={irPasoAnterior}
                        onFinalizar={enviarRegistro}
                        cargando={cargando}
                        progresoCarga={progresoCarga}
                    />
                )}

            </div>
        </div>
    );
};

export default RegistroKine;
