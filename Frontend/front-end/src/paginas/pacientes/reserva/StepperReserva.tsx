// src/paginas/pacientes/reserva/StepperReserva.tsx
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { STEPS, type StepId } from "./types";

interface Props {
    step: StepId;
    onBack?: () => void;
}

export const StepperReserva: React.FC<Props> = ({ step, onBack }) => {
    return (
        <>
            <div className="flex items-center mb-6">
                {onBack && step > 1 && step <= 4 && (
                    <button
                        onClick={onBack}
                        className="mr-4 p-2 rounded-full border border-slate-300 hover:bg-slate-100"
                    >
                        <FaChevronLeft />
                    </button>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                        Reserva tu Cita
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base">
                        Completa los pasos para agendar tu atención kinesiológica
                        presencial.
                    </p>
                </div>
            </div>

            <div className="flex justify-between mb-8">
                {STEPS.map((s) => {
                    const Icon = s.icon;
                    const active = s.id === step;
                    const done = s.id < step;
                    return (
                        <div key={s.id} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${done
                                    ? "bg-green-500 border-green-500 text-white"
                                    : active
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "border-slate-300 text-slate-400"
                                    }`}
                            >
                                <Icon />
                            </div>
                            <span className="mt-2 text-xs md:text-sm text-center text-slate-600">
                                {s.nombre}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
