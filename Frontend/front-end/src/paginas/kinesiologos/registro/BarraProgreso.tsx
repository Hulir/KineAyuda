// src/paginas/kinesiologos/registro/BarraProgreso.tsx
import React from "react";

interface Props {
    pasoActual: number;
    totalPasos: number;
}

const BarraProgreso: React.FC<Props> = ({
    pasoActual,
    totalPasos,
}) => {
    const porcentaje = (pasoActual / totalPasos) * 100;

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-xl">
                <div className="flex justify-between mb-2 text-xs text-gray-500">
                    <span>Paso {pasoActual}</span>
                    <span>{totalPasos} pasos</span>
                </div>
                <div className="h-2 rounded-full bg-purple-100 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                        style={{ width: `${porcentaje}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BarraProgreso;
