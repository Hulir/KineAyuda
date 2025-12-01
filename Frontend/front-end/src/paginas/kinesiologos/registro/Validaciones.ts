// ===============================================================
// UTILIDADES DE VALIDACIÓN Y FORMATEO PARA REGISTRO DE KINESIÓLOGOS
// ===============================================================

// ===============================================================
// NOMBRE Y APELLIDO
// ===============================================================

// 👉 Normalizar entrada de nombre: solo letras, sin números, sin símbolos.
//    Toma solo la primera palabra y capitaliza.
export function normalizarNombreEntrada(valor: string): string {
    if (!valor) return "";

    // Solo letras y espacios
    let limpio = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

    // Tomar solo la primera palabra
    const primera = limpio.trim().split(/\s+/)[0] || "";

    if (!primera) return "";

    return primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase();
}

// 👉 Normalizar entrada de apellido (doble apellido permitido)
export function normalizarApellidoEntrada(valor: string): string {
    if (!valor) return "";

    // Solo letras y espacios
    let limpio = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").trim();

    // El backend permite un solo apellido, así que solo tomamos el primero
    const primera = limpio.split(/\s+/)[0] || "";

    if (!primera) return "";

    return primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase();
}

// 👉 Validación simple de nombre/apellido
export function validarNombre(valor: string): boolean {
    if (!valor) return false;
    const limpio = valor.trim();
    if (limpio.length < 2) return false;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(limpio);
}

// ===============================================================
// RUT: formateo dinámico + validación real DV
// ===============================================================

// 👉 Formatear RUT mientras se escribe (para interfaz)
export function formatearRutEntrada(valor: string): string {
    if (!valor) return "";

    // Solo dígitos y K
    let limpio = valor.replace(/[^\dkK]/g, "").toUpperCase();

    // Máximo permitido: 8 números + DV = 9 chars
    if (limpio.length > 9) limpio = limpio.slice(0, 9);

    if (limpio.length <= 1) return limpio; // todavía demasiado corto

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    // Insertar puntos
    let cuerpoFmt = "";
    let cont = 0;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        cuerpoFmt = cuerpo[i] + cuerpoFmt;
        cont++;
        if (cont === 3 && i !== 0) {
            cuerpoFmt = "." + cuerpoFmt;
            cont = 0;
        }
    }

    return `${cuerpoFmt}-${dv}`;
}

// 👉 Obtener RUT "limpio" (sin puntos) para enviarlo al backend Django
export function obtenerRutLimpio(rutFormateado: string): string {
    return rutFormateado.replace(/[.\-]/g, "").toUpperCase();
}

// 👉 Validación real de RUT (cálculo dígito verificador)
export function validarRUT(rutFormateado: string): boolean {
    const limpio = rutFormateado.replace(/[.\-]/g, "").toUpperCase();
    if (limpio.length < 8) return false;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado =
        resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

    return dvEsperado === dv;
}

// ===============================================================
// EMAIL
// ===============================================================

export function validarEmail(email: string): boolean {
    const limpio = email.trim().toLowerCase();
    // Evita falsos positivos y permite dominios largos
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(limpio);
}

// ===============================================================
// CONTRASEÑA
// ===============================================================

// 👉 Validación de contraseña fuerte
//    Min 8, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
export function validarContrasena(password: string): boolean {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}:;"'<>,.?/\\|`~]).{8,}$/;
    return regex.test(password);
}
