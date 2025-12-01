// src/utils/firebaseErrors.ts

/**
 * Mapea códigos de error de Firebase a mensajes amigables en español
 * @param errorCode - Código de error de Firebase
 * @returns Mensaje de error amigable
 */
export const mapearErrorFirebase = (errorCode: string): string => {
    const errores: Record<string, string> = {
        // Errores de autenticación
        "auth/email-already-in-use": "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
        "auth/invalid-email": "El formato del correo electrónico no es válido.",
        "auth/operation-not-allowed": "Operación no permitida. Contacta al administrador.",
        "auth/weak-password": "La contraseña es muy débil. Debe tener al menos 6 caracteres.",
        "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
        "auth/user-not-found": "No existe una cuenta con este correo electrónico.",
        "auth/wrong-password": "Contraseña incorrecta.",

        // Errores de sesión
        "auth/requires-recent-login": "Por seguridad, necesitas iniciar sesión nuevamente.",
        "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",
        "auth/network-request-failed": "Error de conexión. Verifica tu internet.",

        // Errores de token
        "auth/invalid-user-token": "Tu sesión ha expirado. Inicia sesión nuevamente.",
        "auth/user-token-expired": "Tu sesión ha expirado. Inicia sesión nuevamente.",
        "auth/null-user": "No hay usuario autenticado.",

        // Errores de provider
        "auth/account-exists-with-different-credential": "Ya existe una cuenta con este email usando otro método.",
        "auth/credential-already-in-use": "Esta credencial ya está en uso.",
        "auth/provider-already-linked": "Este proveedor ya está vinculado a la cuenta.",

        // Errores de verificación
        "auth/invalid-verification-code": "Código de verificación inválido.",
        "auth/invalid-verification-id": "ID de verificación inválido.",

        // Otros
        "auth/popup-blocked": "El navegador bloqueó la ventana emergente.",
        "auth/popup-closed-by-user": "Cerraste la ventana de autenticación.",
        "auth/unauthorized-domain": "Este dominio no está autorizado para autenticación.",
    };

    return errores[errorCode] || "Ocurrió un error inesperado. Intenta nuevamente.";
};

/**
 * Determina si un error es de Firebase
 * @param error - Error a verificar
 * @returns true si es error de Firebase
 */
export const esErrorFirebase = (error: any): boolean => {
    return error?.code?.startsWith("auth/") || false;
};
