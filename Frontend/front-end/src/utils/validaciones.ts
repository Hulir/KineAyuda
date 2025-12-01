// src/utils/validaciones.ts

/**
 * Validación de RUT chileno usando algoritmo módulo 11
 * @param rut - RUT en formato "12.345.678-9" o "12345678-9" o "123456789"
 * @returns objeto con validez y mensaje de error
 */
export const validarRUT = (rut: string): { valido: boolean; mensaje?: string } => {
    if (!rut || rut.trim() === "") {
        return { valido: false, mensaje: "El RUT es obligatorio" };
    }

    // Limpiar RUT: eliminar puntos, guiones y espacios
    const rutLimpio = rut.replace(/[.-\s]/g, "").toUpperCase();

    // Validar formato básico (7-8 dígitos + dígito verificador)
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
        return { valido: false, mensaje: "El RUT debe tener entre 7 y 8 dígitos más el dígito verificador" };
    }

    // Separar número y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const digitoVerificadorIngresado = rutLimpio.slice(-1);

    // Validar que el cuerpo sean solo números
    if (!/^\d+$/.test(cuerpo)) {
        return { valido: false, mensaje: "El RUT debe contener solo números" };
    }

    // Calcular dígito verificador esperado (algoritmo módulo 11)
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const digitoCalculado = 11 - resto;

    let digitoVerificadorEsperado: string;
    if (digitoCalculado === 11) {
        digitoVerificadorEsperado = "0";
    } else if (digitoCalculado === 10) {
        digitoVerificadorEsperado = "K";
    } else {
        digitoVerificadorEsperado = digitoCalculado.toString();
    }

    // Comparar
    if (digitoVerificadorIngresado !== digitoVerificadorEsperado) {
        return { valido: false, mensaje: "El RUT ingresado no es válido" };
    }

    return { valido: true };
};

/**
 * Formatea un RUT a formato chileno estándar (12.345.678-9)
 * IMPORTANTE: Bloquea la K en el cuerpo del RUT, solo se permite en el dígito verificador
 * Límite: 8 dígitos + 1 verificador = 9 caracteres máximo
 * @param rut - RUT sin formato
 * @returns RUT formateado solo con caracteres válidos
 */
export const formatearRUT = (rut: string): string => {
    // Eliminar puntos, guiones y espacios
    let rutLimpio = rut.replace(/[.\-\s]/g, "");

    // Si está vacío, retornar
    if (rutLimpio.length === 0) return "";

    // Separar lo que el usuario ha escrito hasta ahora
    // Si tiene menos de 2 caracteres, solo permitir números
    if (rutLimpio.length === 1) {
        // Solo el primer carácter, debe ser número
        return rutLimpio.replace(/[^0-9]/g, "");
    }

    // Extraer el cuerpo (todos los caracteres excepto el último)
    // y el posible dígito verificador (último carácter)
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1);

    // BLOQUEAR K en el cuerpo: solo permitir números
    cuerpo = cuerpo.replace(/[^0-9]/g, "");

    // En el dígito verificador: permitir solo números y K
    dv = dv.replace(/[^0-9kK]/g, "").toUpperCase();

    // Limitar el cuerpo a máximo 8 dígitos
    if (cuerpo.length > 8) {
        cuerpo = cuerpo.slice(0, 8);
    }

    // Si no hay cuerpo después de limpiar, retornar vacío
    if (cuerpo.length === 0) return "";

    // Si no hay dígito verificador, retornar solo el cuerpo sin formato
    if (dv.length === 0) {
        // Formatear con puntos si tiene más de 3 dígitos
        if (cuerpo.length <= 3) return cuerpo;
        const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return cuerpoFormateado;
    }

    // Formatear cuerpo con puntos
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Retornar con formato completo
    return `${cuerpoFormateado}-${dv}`;
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param texto - Texto a capitalizar
 * @returns Texto con primera letra en mayúscula
 */
export const capitalizarNombre = (texto: string): string => {
    return texto
        .split(" ")
        .map(palabra => {
            if (palabra.length === 0) return palabra;
            return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        })
        .join(" ");
};

/**
 * Validación de email
 * @param email - Email a validar
 * @returns objeto con validez y mensaje de error
 */
export const validarEmail = (email: string): { valido: boolean; mensaje?: string } => {
    if (!email || email.trim() === "") {
        return { valido: false, mensaje: "El email es obligatorio" };
    }

    // Regex estándar para email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        return { valido: false, mensaje: "El formato del email no es válido" };
    }

    // Validaciones adicionales
    if (email.length > 254) {
        return { valido: false, mensaje: "El email es demasiado largo" };
    }

    const [localPart, domain] = email.split("@");

    if (localPart.length > 64) {
        return { valido: false, mensaje: "La parte local del email es demasiado larga" };
    }

    if (domain.length > 253) {
        return { valido: false, mensaje: "El dominio del email es demasiado largo" };
    }

    return { valido: true };
};

/**
 * Validación de fortaleza de contraseña
 * @param password - Contraseña a validar
 * @returns objeto con validez, nivel de fortaleza y mensaje
 */
export const validarPassword = (password: string): {
    valido: boolean;
    fortaleza: "debil" | "media" | "fuerte" | null;
    mensaje?: string;
    requisitos: {
        longitudMinima: boolean;
        tieneMayuscula: boolean;
        tieneMinuscula: boolean;
        tieneNumero: boolean;
        tieneCaracterEspecial: boolean;
    };
} => {
    const requisitos = {
        longitudMinima: password.length >= 8,
        tieneMayuscula: /[A-Z]/.test(password),
        tieneMinuscula: /[a-z]/.test(password),
        tieneNumero: /[0-9]/.test(password),
        tieneCaracterEspecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const cumplidos = Object.values(requisitos).filter(Boolean).length;

    // Determinar fortaleza
    let fortaleza: "debil" | "media" | "fuerte" | null = null;
    if (cumplidos >= 4) {
        fortaleza = "fuerte";
    } else if (cumplidos >= 3) {
        fortaleza = "media";
    } else if (cumplidos >= 1) {
        fortaleza = "debil";
    }

    // Validar mínimo aceptable
    if (!requisitos.longitudMinima) {
        return {
            valido: false,
            fortaleza,
            requisitos,
            mensaje: "La contraseña debe tener al menos 8 caracteres",
        };
    }

    if (cumplidos < 3) {
        return {
            valido: false,
            fortaleza,
            requisitos,
            mensaje: "La contraseña es muy débil. Debe cumplir al menos 3 requisitos",
        };
    }

    return {
        valido: true,
        fortaleza,
        requisitos,
    };
};

/**
 * Validación de archivos
 * @param file - Archivo a validar
 * @param opciones - Opciones de validación
 * @returns objeto con validez y mensaje de error
 */
export const validarArchivo = (
    file: File | null,
    opciones: {
        maxSizeMB?: number;
        allowedTypes?: string[];
        nombreCampo?: string;
    } = {}
): { valido: boolean; mensaje?: string } => {
    const { maxSizeMB = 10, allowedTypes = [], nombreCampo = "El archivo" } = opciones;

    if (!file) {
        return { valido: false, mensaje: `${nombreCampo} es obligatorio` };
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valido: false,
            mensaje: `${nombreCampo} no debe superar ${maxSizeMB}MB (tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        };
    }

    // Validar tipo de archivo si se especifica
    if (allowedTypes.length > 0) {
        const estipoPermitido = allowedTypes.some((type) => {
            if (type.endsWith("/*")) {
                // Validar por categoría (ej: "image/*")
                const categoria = type.split("/")[0];
                return file.type.startsWith(`${categoria}/`);
            }
            return file.type === type;
        });

        if (!estipoPermitido) {
            const tiposFormateados = allowedTypes
                .map((t) => {
                    if (t === "image/jpeg") return "JPEG";
                    if (t === "image/png") return "PNG";
                    if (t === "image/webp") return "WEBP";
                    if (t === "application/pdf") return "PDF";
                    if (t === "image/*") return "imágenes";
                    return t;
                })
                .join(", ");

            return {
                valido: false,
                mensaje: `${nombreCampo} debe ser de tipo: ${tiposFormateados}`,
            };
        }
    }

    return { valido: true };
};

/**
 * Formatea bytes a tamaño legible
 * @param bytes - Tamaño en bytes
 * @returns String formateado (ej: "2.5 MB")
 */
export const formatearTamañoArchivo = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
