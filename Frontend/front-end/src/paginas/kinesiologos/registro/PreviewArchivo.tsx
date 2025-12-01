// src/paginas/kinesiologos/registro/PreviewArchivo.tsx
import React from "react";
import { FileText, X } from "lucide-react";
import { formatearTamañoArchivo } from "../../../utils/validaciones";

interface Props {
    file: File;
    onRemove?: () => void;
    showSize?: boolean;
}

const PreviewArchivo: React.FC<Props> = ({ file, onRemove, showSize = true }) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Generar preview solo para imágenes
        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    return (
        <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3 group hover:border-purple-300 transition-colors">
            {/* Preview thumbnail */}
            <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {isImage && previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                ) : isPDF ? (
                    <FileText className="w-8 h-8 text-red-500" />
                ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                )}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                </p>
                {showSize && (
                    <p className="text-xs text-gray-500">
                        {formatearTamañoArchivo(file.size)}
                    </p>
                )}
            </div>

            {/* Remove button */}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all"
                    title="Eliminar archivo"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default PreviewArchivo;
