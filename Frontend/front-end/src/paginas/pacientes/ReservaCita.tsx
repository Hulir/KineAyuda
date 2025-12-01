// src/paginas/pacientes/ReservaCita.tsx
import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import HeaderPrincipal from "../../componentes/HeaderPrincipal";
import Footer from "../../componentes/Footer";
import PasoInicio from "./reserva/PasoInicio";
import PasoEspecialidad from "./reserva/PasoEspecialidad";
import PasoKinesiologo from "./reserva/PasoKinesiologo";
import PasoCalendario from "./reserva/PasoCalendario";
import PasoPago from "./reserva/PasoPago";
import PasoConfirmacion from "./reserva/PasoConfirmacion";
import type {
  Especialidad,
  Kinesiologo,
  AgendaSlot,
  PacienteData,
} from "./reserva/types";
import { PASOS } from "./reserva/types";

const ReservaCita: React.FC = () => {
  // Estado del flujo
  const [modoBusqueda, setModoBusqueda] = useState<'none' | 'profesional' | 'especialidad'>('none');
  const [pasoActual, setPasoActual] = useState<number>(PASOS.INICIO);

  // Datos seleccionados
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<Especialidad | null>(null);
  const [kinesiologoSeleccionado, setKinesiologoSeleccionado] = useState<Kinesiologo | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState<AgendaSlot | null>(null);
  const [pacienteData, setPacienteData] = useState<PacienteData | null>(null);

  // ========== MANEJADORES DE NAVEGACIÓN ==========

  const handleElegirModo = (modo: 'profesional' | 'especialidad') => {
    setModoBusqueda(modo);

    if (modo === 'profesional') {
      setPasoActual(PASOS.KINESIOLOGO);
    } else {
      setPasoActual(PASOS.ESPECIALIDAD);
    }
  };

  const handleVolverInicio = () => {
    setModoBusqueda('none');
    setPasoActual(PASOS.INICIO);
    setEspecialidadSeleccionada(null);
    setKinesiologoSeleccionado(null);
    setSlotSeleccionado(null);
  };

  const handleVolver = () => {
    if (pasoActual === PASOS.ESPECIALIDAD) {
      handleVolverInicio();
    } else if (pasoActual === PASOS.KINESIOLOGO) {
      if (modoBusqueda === 'especialidad') {
        setPasoActual(PASOS.ESPECIALIDAD);
        setKinesiologoSeleccionado(null);
      } else {
        handleVolverInicio();
      }
    } else if (pasoActual === PASOS.CALENDARIO) {
      setPasoActual(PASOS.KINESIOLOGO);
      setSlotSeleccionado(null);
    } else if (pasoActual === PASOS.PAGO) {
      setPasoActual(PASOS.CALENDARIO);
    }
  };

  // ========== MANEJADORES DE SELECCIÓN ==========

  const handleSelectEspecialidad = (especialidad: Especialidad) => {
    setEspecialidadSeleccionada(especialidad);
    setPasoActual(PASOS.KINESIOLOGO);
  };

  const handleSelectKinesiologo = (kine: Kinesiologo) => {
    setKinesiologoSeleccionado(kine);
    setPasoActual(PASOS.CALENDARIO);
  };

  // ========== INDICADOR DE PASOS ==========

  const obtenerNombrePaso = (paso: number): string => {
    switch (paso) {
      case PASOS.INICIO: return 'Inicio';
      case PASOS.ESPECIALIDAD: return 'Especialidad';
      case PASOS.KINESIOLOGO: return 'Profesional';
      case PASOS.CALENDARIO: return 'Fecha y Hora';
      case PASOS.PAGO: return 'Pago';
      case PASOS.CONFIRMACION: return 'Confirmación';
      default: return '';
    }
  };

  const pasosVisibles = () => {
    if (pasoActual === PASOS.INICIO) return [];

    const pasos = [];
    if (modoBusqueda === 'especialidad') {
      pasos.push(PASOS.ESPECIALIDAD);
    }
    pasos.push(PASOS.KINESIOLOGO, PASOS.CALENDARIO, PASOS.PAGO);

    return pasos;
  };

  // ========== RENDERIZADO ==========

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <HeaderPrincipal />

      {/* Contenido Principal */}
      <main className="flex-1 pt-20">
        {/* Botón Volver y Progreso */}
        {pasoActual > PASOS.INICIO && (
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Botón volver */}
              <button
                onClick={handleVolver}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors mb-4"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>

              {/* Indicador de progreso */}
              {pasosVisibles().length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {pasosVisibles().map((paso, index) => {
                    const estaCompletado = pasoActual > paso;
                    const esActual = pasoActual === paso;

                    return (
                      <React.Fragment key={paso}>
                        {/* Círculo del paso */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`
                              w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all
                              ${esActual
                                ? 'bg-indigo-600 border-indigo-600 text-white scale-110'
                                : estaCompletado
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'bg-white border-slate-300 text-slate-400'
                              }
                            `}
                          >
                            {index + 1}
                          </div>
                          <span
                            className={`
                              text-xs mt-1 font-medium
                              ${esActual ? 'text-indigo-600' : estaCompletado ? 'text-purple-600' : 'text-slate-400'}
                            `}
                          >
                            {obtenerNombrePaso(paso)}
                          </span>
                        </div>

                        {/* Línea conectora */}
                        {index < pasosVisibles().length - 1 && (
                          <div
                            className={`
                              h-0.5 w-16 mt-[-20px] transition-all
                              ${pasoActual > paso ? 'bg-purple-600' : 'bg-slate-300'}
                            `}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido del Paso Actual */}
        <div className="py-8">
          {pasoActual === PASOS.INICIO && (
            <PasoInicio onElegirModo={() => handleElegirModo('profesional')} />
          )}

          {pasoActual === PASOS.ESPECIALIDAD && (
            <PasoEspecialidad onSelectEspecialidad={handleSelectEspecialidad} />
          )}

          {pasoActual === PASOS.KINESIOLOGO && (
            <PasoKinesiologo
              especialidadFiltro={especialidadSeleccionada?.nombre}
              onSelectKinesiologo={handleSelectKinesiologo}
            />
          )}

          {pasoActual === PASOS.CALENDARIO && kinesiologoSeleccionado && (
            <PasoCalendario
              kinesiologo={kinesiologoSeleccionado}
              onSelectSlot={(slot) => {
                setSlotSeleccionado(slot);
                // For now, collect patient data before payment
                // In a real flow you might have a separate step for this
                // For now we provide sample data
                const sampleData: PacienteData = {
                  nombre: '',
                  apellido: '',
                  rut: '',
                  email: '',
                  telefono: '+56',
                  fecha_nacimiento: ''
                };
                setPacienteData(sampleData);
                setPasoActual(PASOS.PAGO);
              }}
            />
          )}

          {pasoActual === PASOS.PAGO && kinesiologoSeleccionado && slotSeleccionado && pacienteData && (
            <PasoPago
              kinesiologo={kinesiologoSeleccionado}
              slot={slotSeleccionado}
              pacienteData={pacienteData}
              onBack={() => setPasoActual(PASOS.CALENDARIO)}
            />
          )}

          {pasoActual === PASOS.CONFIRMACION && kinesiologoSeleccionado && slotSeleccionado && (
            <PasoConfirmacion
              kinesiologo={kinesiologoSeleccionado}
              slot={slotSeleccionado}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ReservaCita;
