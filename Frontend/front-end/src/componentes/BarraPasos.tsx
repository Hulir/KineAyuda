import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface Props {
    pasoActual: number;
}

const PASOS = [
    { numero: 1, titulo: "Profesional" },
    { numero: 2, titulo: "Fecha y Hora" },
    { numero: 3, titulo: "Datos" },
    { numero: 4, titulo: "Pago" },
    { numero: 5, titulo: "Confirmación" }
];

const BarraPasos: React.FC<Props> = ({ pasoActual }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="relative flex items-center justify-between">
                {/* Línea de fondo */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>

                {/* Línea de progreso */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((pasoActual - 1) / (PASOS.length - 1)) * 100}%` }}
                ></div>

                {PASOS.map((paso) => {
                    const esCompletado = pasoActual > paso.numero;
                    const esActual = pasoActual === paso.numero;

                    return (
                        <div key={paso.numero} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white
                                    ${esCompletado
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : esActual
                                            ? 'border-green-500 text-green-600 font-bold scale-110'
                                            : 'border-gray-300 text-gray-400'
                                    }
                                `}
                            >
                                {esCompletado ? <FaCheck className="w-4 h-4" /> : paso.numero}
                            </div>
                            <span
                                className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-300
                                    ${esActual ? 'text-green-600' : 'text-gray-400'}
                                `}
                            >
                                {paso.titulo}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BarraPasos;
