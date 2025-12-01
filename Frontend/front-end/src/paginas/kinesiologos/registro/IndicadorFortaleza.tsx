// src/paginas/kinesiologos/registro/IndicadorFortaleza.tsx
import React from "react";
import { validarPassword } from "../../../utils/validaciones";

interface Props {
    password: string;
}

const IndicadorFortaleza: React.FC<Props> = ({ password }) => {
    if (!password) return null;

    const resultado = validarPassword(password);
    const { fortaleza, requisitos } = resultado;

    const getColorClasses = () => {
        if (fortaleza === "fuerte") {
            return {
                bar: "bg-green-500",
                text: "text-green-700",
                label: "Fuerte",
            };
        }
        if (fortaleza === "media") {
            return {
                bar: "bg-yellow-500",
                text: "text-yellow-700",
                label: "Media",
            };
        }
        return {
            bar: "bg-red-500",
            text: "text-red-700",
            label: "Débil",
        };
    };

    const colors = getColorClasses();
    const cumplidos = Object.values(requisitos).filter(Boolean).length;
    const porcentaje = (cumplidos / 5) * 100;

    return (
        <div className="mt-2 space-y-2">
            {/* Barra de progreso */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bar} transition-all duration-300`}
                        style={{ width: `${porcentaje}%` }}
                    ></div>
                </div>
                <span className={`text-xs font-medium ${colors.text}`}>
                    {colors.label}
                </span>
            </div>

            {/* Requisitos */}
            <div className="text-xs text-gray-600 space-y-0.5">
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${requisitos.longitudMinima ? "bg-green-500" : "bg-gray-300"
                            }`}
                    ></div>
                    <span>Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${requisitos.tieneMayuscula ? "bg-green-500" : "bg-gray-300"
                            }`}
                    ></div>
                    <span>Una letra mayúscula</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${requisitos.tieneMinuscula ? "bg-green-500" : "bg-gray-300"
                            }`}
                    ></div>
                    <span>Una letra minúscula</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${requisitos.tieneNumero ? "bg-green-500" : "bg-gray-300"
                            }`}
                    ></div>
                    <span>Un número</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${requisitos.tieneCaracterEspecial ? "bg-green-500" : "bg-gray-300"
                            }`}
                    ></div>
                    <span>Un carácter especial (!@#$%...)</span>
                </div>
            </div>
        </div>
    );
};

export default IndicadorFortaleza;
