// src/paginas/kinesiologos/registro/FortalezaContrasena.tsx
import React from "react";
import { validarContrasena } from "./Validaciones";


interface Props {
    password: string;
}

const FortalezaContrasena: React.FC<Props> = ({ password }) => {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneSimbolo = /[^\w\s]/.test(password);
    const largoOk = password.length >= 8;

    const requisitosCumplidos = [
        largoOk,
        tieneMayuscula,
        tieneNumero,
        tieneSimbolo,
    ].filter(Boolean).length;

    let texto = "Muy débil";
    let color = "bg-red-400";
    if (requisitosCumplidos >= 4 && validarContrasena(password)) {
        texto = "Segura";
        color = "bg-green-500";
    } else if (requisitosCumplidos >= 3) {
        texto = "Intermedia";
        color = "bg-yellow-400";
    }

    return (
        <div className="mt-2 space-y-2">
            {/* Barra */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color} transition-all`}
                        style={{ width: `${(requisitosCumplidos / 4) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                    {password ? texto : ""}
                </span>
            </div>

            {/* Requisitos en fila, no en columna */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
                <span className={largoOk ? "text-green-600" : ""}>
                    • Mínimo 8 caracteres
                </span>
                <span className={tieneMayuscula ? "text-green-600" : ""}>
                    • Una mayúscula
                </span>
                <span className={tieneNumero ? "text-green-600" : ""}>
                    • Un número
                </span>
                <span className={tieneSimbolo ? "text-green-600" : ""}>
                    • Un símbolo (@#$%...)
                </span>
            </div>
        </div>
    );
};

export default FortalezaContrasena;
