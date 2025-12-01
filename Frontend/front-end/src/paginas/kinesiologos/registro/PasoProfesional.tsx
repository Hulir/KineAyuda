// src/paginas/kinesiologos/registro/PasoProfesional.tsx
import React from "react";
import type {
    DatosProfesionalesKine,
    DocumentosKine,
} from "./useRegistroKine";
import {
    ESPECIALIDADES,
    type Especialidad,
} from "../../publicas/especialidadesDatos";
import PreviewArchivo from "./PreviewArchivo";
import { Upload, AlertCircle } from "lucide-react";
import { validarArchivo } from "../../../utils/validaciones";

interface Props {
    datosProfesionales: DatosProfesionalesKine;
    documentos: DocumentosKine;

    onChangeProfesional: (
        campo: keyof DatosProfesionalesKine,
        valor: string
    ) => void;

    onChangeDocumento: (
        campo: keyof DocumentosKine,
        valor: File | File[] | null
    ) => void;

    onVolver: () => void;
    onFinalizar: () => void;
    cargando: boolean;
    progresoCarga?: number;
}

const PasoProfesional: React.FC<Props> = ({
    datosProfesionales,
    documentos,
    onChangeProfesional,
    onChangeDocumento,
    onVolver,
    onFinalizar,
    cargando,
    progresoCarga = 0,
}) => {
    const [erroresArchivos, setErroresArchivos] = React.useState<Record<string, string>>({});

    // Manejo de archivos con validación
    const handleFileChange =
        (campo: keyof DocumentosKine, multiple = false) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (!files || files.length === 0) {
                    onChangeDocumento(campo, null);
                    setErroresArchivos(prev => ({ ...prev, [campo]: "" }));
                    return;
                }

                // Validar archivo(s)
                if (multiple) {
                    const archivos = Array.from(files);

                    // Validar cada uno
                    for (const archivo of archivos) {
                        const validacion = validarArchivo(archivo, {
                            maxSizeMB: 10,
                            allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
                            nombreCampo: archivo.name,
                        });

                        if (!validacion.valido) {
                            setErroresArchivos(prev => ({ ...prev, [campo]: validacion.mensaje || "" }));
                            return;
                        }
                    }

                    onChangeDocumento(campo, archivos);
                    setErroresArchivos(prev => ({ ...prev, [campo]: "" }));
                } else {
                    const archivo = files[0];
                    const maxSize = campo === "titulo" ? 10 : 5; // Título puede ser más grande
                    const validacion = validarArchivo(archivo, {
                        maxSizeMB: maxSize,
                        allowedTypes: campo.includes("id")
                            ? ["image/jpeg", "image/png", "image/webp"]
                            : ["image/jpeg", "image/png", "image/webp", "application/pdf"],
                        nombreCampo: "El archivo",
                    });

                    if (!validacion.valido) {
                        setErroresArchivos(prev => ({ ...prev, [campo]: validacion.mensaje || "" }));
                        e.target.value = ""; // Limpiar input
                        return;
                    }

                    onChangeDocumento(campo, archivo);
                    setErroresArchivos(prev => ({ ...prev, [campo]: "" }));
                }
            };

    const removeFile = (campo: keyof DocumentosKine) => {
        onChangeDocumento(campo, null);
        setErroresArchivos(prev => ({ ...prev, [campo]: "" }));
    };

    const removeCertificado = (index: number) => {
        const nuevos = documentos.certificados.filter((_, i) => i !== index);
        onChangeDocumento("certificados", nuevos);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onFinalizar();
            }}
            className="space-y-6"
        >
            {/* Encabezado */}
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Datos profesionales y documentos
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Completa tu información profesional y sube los documentos de verificación.
                </p>
            </div>

            {/* Datos profesionales */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800">
                    Datos profesionales
                </h2>

                {/* Número de título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de título
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={datosProfesionales.nroTitulo}
                        onChange={(e) =>
                            onChangeProfesional("nroTitulo", e.target.value)
                        }
                        placeholder="Ej: 12345"
                    />
                </div>

                {/* Especialidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidad
                    </label>
                    <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={datosProfesionales.especialidadId}
                        onChange={(e) =>
                            onChangeProfesional("especialidadId", e.target.value)
                        }
                    >
                        <option value="">Selecciona una especialidad</option>
                        {ESPECIALIDADES.map((esp: Especialidad) => (
                            <option key={esp.id} value={esp.id}>
                                {esp.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documentos */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800">
                    Documentos de verificación
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">
                        <strong>Formatos aceptados:</strong> JPG, PNG, WebP, PDF. <br />
                        <strong>Tamaño máximo:</strong> 5MB para fotos de carnet, 10MB para documentos.
                    </p>
                </div>

                {/* ID Frente */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                        Carnet de identidad – frente *
                    </label>

                    {!documentos.idFrente ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Haz clic para subir</span>
                            <span className="text-xs text-gray-500">o arrastra aquí el archivo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange("idFrente")}
                            />
                        </label>
                    ) : (
                        <PreviewArchivo
                            file={documentos.idFrente}
                            onRemove={() => removeFile("idFrente")}
                        />
                    )}

                    {erroresArchivos.idFrente && (
                        <p className="mt-1 text-xs text-red-500">{erroresArchivos.idFrente}</p>
                    )}
                </div>

                {/* ID Reverso */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                        Carnet de identidad – reverso *
                    </label>

                    {!documentos.idReverso ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Haz clic para subir</span>
                            <span className="text-xs text-gray-500">o arrastra aquí el archivo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange("idReverso")}
                            />
                        </label>
                    ) : (
                        <PreviewArchivo
                            file={documentos.idReverso}
                            onRemove={() => removeFile("idReverso")}
                        />
                    )}

                    {erroresArchivos.idReverso && (
                        <p className="mt-1 text-xs text-red-500">{erroresArchivos.idReverso}</p>
                    )}
                </div>

                {/* Título profesional */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                        Título profesional (PDF o imagen) *
                    </label>

                    {!documentos.titulo ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Haz clic para subir</span>
                            <span className="text-xs text-gray-500">Acepta PDF e imágenes (máx. 10MB)</span>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={handleFileChange("titulo")}
                            />
                        </label>
                    ) : (
                        <PreviewArchivo
                            file={documentos.titulo}
                            onRemove={() => removeFile("titulo")}
                        />
                    )}

                    {erroresArchivos.titulo && (
                        <p className="mt-1 text-xs text-red-500">{erroresArchivos.titulo}</p>
                    )}
                </div>

                {/* Certificados adicionales */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                        Certificados adicionales (opcional, máx. 5)
                    </label>

                    {documentos.certificados.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors mb-3">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-600">Agregar certificados</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={handleFileChange("certificados", true)}
                            />
                        </label>
                    )}

                    {documentos.certificados.length > 0 && (
                        <div className="space-y-2">
                            {documentos.certificados.map((cert, index) => (
                                <PreviewArchivo
                                    key={index}
                                    file={cert}
                                    onRemove={() => removeCertificado(index)}
                                />
                            ))}
                        </div>
                    )}

                    {erroresArchivos.certificados && (
                        <p className="mt-1 text-xs text-red-500">{erroresArchivos.certificados}</p>
                    )}
                </div>
            </div>

            {/* Barra de progreso durante carga */}
            {cargando && progresoCarga > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">
                            Subiendo documentos...
                        </span>
                        <span className="text-sm font-semibold text-purple-700">
                            {progresoCarga}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                            style={{ width: `${progresoCarga}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Footer de acciones */}
            <div className="pt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onVolver}
                    disabled={cargando}
                    className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    ← Volver
                </button>

                <button
                    type="submit"
                    disabled={cargando}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                    {cargando ? "Enviando..." : "Finalizar registro"}
                </button>
            </div>
        </form>
    );
};

export default PasoProfesional;
