// src/paginas/kinesiologos/registro/useRegistroKine.ts
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../../../firebaseConfig";
import { validarRUT, validarEmail, validarPassword, validarArchivo } from "../../../utils/validaciones";
import { mapearErrorFirebase, esErrorFirebase } from "../../../utils/firebaseErrors";

export interface DatosCuentaKine {
    nombre: string;
    apellido: string;
    email: string;
    rut: string;
    password: string;
    confirmarPassword: string;
    aceptaTerminos: boolean;
}

export interface DatosProfesionalesKine {
    nroTitulo: string;
    especialidadId: string;
}

export interface DocumentosKine {
    idFrente: File | null;
    idReverso: File | null;
    titulo: File | null;
    certificados: File[];
}

type Paso = 1 | 2;

const auth = getAuth(app);

// Configuración de tipos de archivos permitidos
const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
const TIPOS_DOCUMENTO = [...TIPOS_IMAGEN, "application/pdf"];

// ----------------------
// Hook principal
// ----------------------

export function useRegistroKine() {
    const navigate = useNavigate();
    const [pasoActual, setPasoActual] = useState<Paso>(1);

    const [datosCuenta, setDatosCuenta] = useState<DatosCuentaKine>({
        nombre: "",
        apellido: "",
        email: "",
        rut: "",
        password: "",
        confirmarPassword: "",
        aceptaTerminos: false,
    });

    const [datosProfesionales, setDatosProfesionales] =
        useState<DatosProfesionalesKine>({
            nroTitulo: "",
            especialidadId: "",
        });

    const [documentos, setDocumentos] = useState<DocumentosKine>({
        idFrente: null,
        idReverso: null,
        titulo: null,
        certificados: [],
    });

    const [cargando, setCargando] = useState(false);
    const [progresoCarga, setProgresoCarga] = useState(0);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

    // ----------------------
    // Persistencia en sessionStorage
    // ----------------------

    // Guardar estado en sessionStorage cuando cambia
    useEffect(() => {
        const datosParaGuardar = {
            datosCuenta: {
                ...datosCuenta,
                password: "", // No guardar password por seguridad
                confirmarPassword: "",
            },
            datosProfesionales,
            pasoActual,
        };
        sessionStorage.setItem("registro_kine_draft", JSON.stringify(datosParaGuardar));
    }, [datosCuenta, datosProfesionales, pasoActual]);

    // Recuperar estado al montar componente
    useEffect(() => {
        const draft = sessionStorage.getItem("registro_kine_draft");
        if (draft) {
            try {
                const datos = JSON.parse(draft);
                if (datos.datosCuenta) {
                    setDatosCuenta((prev) => ({ ...prev, ...datos.datosCuenta }));
                }
                if (datos.datosProfesionales) {
                    setDatosProfesionales(datos.datosProfesionales);
                }
                if (datos.pasoActual) {
                    setPasoActual(datos.pasoActual);
                }
            } catch (e) {
                console.error("Error al recuperar draft:", e);
            }
        }
    }, []);

    // ----------------------
    // Validaciones
    // ----------------------

    const validarPaso1 = (): { valido: boolean; mensaje: string } => {
        // Nombre
        if (!datosCuenta.nombre.trim()) {
            return { valido: false, mensaje: "El nombre es obligatorio" };
        }
        if (datosCuenta.nombre.length < 2) {
            return { valido: false, mensaje: "El nombre debe tener al menos 2 caracteres" };
        }

        // Apellido
        if (!datosCuenta.apellido.trim()) {
            return { valido: false, mensaje: "El apellido es obligatorio" };
        }
        if (datosCuenta.apellido.length < 2) {
            return { valido: false, mensaje: "El apellido debe tener al menos 2 caracteres" };
        }

        // Email
        const validacionEmail = validarEmail(datosCuenta.email);
        if (!validacionEmail.valido) {
            return { valido: false, mensaje: validacionEmail.mensaje || "Email inválido" };
        }

        // RUT
        const validacionRUT = validarRUT(datosCuenta.rut);
        if (!validacionRUT.valido) {
            return { valido: false, mensaje: validacionRUT.mensaje || "RUT inválido" };
        }

        // Password
        const validacionPassword = validarPassword(datosCuenta.password);
        if (!validacionPassword.valido) {
            return { valido: false, mensaje: validacionPassword.mensaje || "Contraseña inválida" };
        }

        // Confirmar password
        if (datosCuenta.password !== datosCuenta.confirmarPassword) {
            return { valido: false, mensaje: "Las contraseñas no coinciden" };
        }

        // Términos
        if (!datosCuenta.aceptaTerminos) {
            return { valido: false, mensaje: "Debes aceptar los términos y condiciones" };
        }

        return { valido: true, mensaje: "" };
    };

    const validarPaso2 = (): { valido: boolean; mensaje: string } => {
        // Número de título
        if (!datosProfesionales.nroTitulo.trim()) {
            return { valido: false, mensaje: "El número de título es obligatorio" };
        }

        // Especialidad
        if (!datosProfesionales.especialidadId.trim()) {
            return { valido: false, mensaje: "La especialidad es obligatoria" };
        }

        // Documento ID Frente
        const validacionIdFrente = validarArchivo(documentos.idFrente, {
            maxSizeMB: 5,
            allowedTypes: TIPOS_IMAGEN,
            nombreCampo: "La foto del carnet (frente)",
        });
        if (!validacionIdFrente.valido) {
            return { valido: false, mensaje: validacionIdFrente.mensaje || "" };
        }

        // Documento ID Reverso
        const validacionIdReverso = validarArchivo(documentos.idReverso, {
            maxSizeMB: 5,
            allowedTypes: TIPOS_IMAGEN,
            nombreCampo: "La foto del carnet (reverso)",
        });
        if (!validacionIdReverso.valido) {
            return { valido: false, mensaje: validacionIdReverso.mensaje || "" };
        }

        // Título profesional
        const validacionTitulo = validarArchivo(documentos.titulo, {
            maxSizeMB: 10,
            allowedTypes: TIPOS_DOCUMENTO,
            nombreCampo: "El título profesional",
        });
        if (!validacionTitulo.valido) {
            return { valido: false, mensaje: validacionTitulo.mensaje || "" };
        }

        // Certificados (validar cada uno si existen)
        if (documentos.certificados.length > 0) {
            for (let i = 0; i < documentos.certificados.length; i++) {
                const cert = documentos.certificados[i];
                const validacionCert = validarArchivo(cert, {
                    maxSizeMB: 10,
                    allowedTypes: TIPOS_DOCUMENTO,
                    nombreCampo: `El certificado ${i + 1}`,
                });
                if (!validacionCert.valido) {
                    return { valido: false, mensaje: validacionCert.mensaje || "" };
                }
            }

            // Límite de certificados
            if (documentos.certificados.length > 5) {
                return { valido: false, mensaje: "Máximo 5 certificados permitidos" };
            }
        }

        return { valido: true, mensaje: "" };
    };

    // ----------------------
    // Navegación de pasos con validación
    // ----------------------

    const irSiguientePaso = async () => {
        const validacion = validarPaso1();
        if (!validacion.valido) {
            setError(validacion.mensaje);
            return;
        }

        setError("");

        // IMPORTANTE: Crear usuario en Firebase AL PASAR al paso 2
        // Esto asegura que el token esté fresco cuando se envíe al backend
        setCargando(true);
        try {
            // Crear usuario en Firebase
            const cred = await createUserWithEmailAndPassword(
                auth,
                datosCuenta.email,
                datosCuenta.password
            );

            console.log("✅ Usuario creado en Firebase:", cred.user.uid);

            // Avanzar al paso 2
            setPasoActual(2);
        } catch (err: any) {
            console.error("Error al crear usuario en Firebase:", err);
            if (esErrorFirebase(err)) {
                setError(mapearErrorFirebase(err.code));
            } else {
                setError("Error al crear la cuenta. Intenta nuevamente.");
            }
        } finally {
            setCargando(false);
        }
    };

    const irPasoAnterior = () => {
        setError("");
        setPasoActual(1);
    };

    // ----------------------
    // Actualizadores de estado
    // ----------------------

    const actualizarCuenta = (
        campo: keyof DatosCuentaKine,
        valor: string | boolean
    ) => {
        setDatosCuenta((prev) => ({
            ...prev,
            [campo]: valor,
        }));

        // Limpiar error al modificar
        if (error) setError("");
    };

    const actualizarProfesionales = (
        campo: keyof DatosProfesionalesKine,
        valor: string
    ) => {
        setDatosProfesionales((prev) => ({
            ...prev,
            [campo]: valor,
        }));

        // Limpiar error al modificar
        if (error) setError("");
    };

    const actualizarDocumento = (
        campo: keyof DocumentosKine,
        valor: File | File[] | null
    ) => {
        setDocumentos((prev) => {
            if (campo === "certificados") {
                return { ...prev, certificados: (valor as File[]) || [] };
            }
            return { ...prev, [campo]: valor as File | null };
        });

        // Limpiar error al modificar
        if (error) setError("");
    };

    // ----------------------
    // Envío al backend
    // ----------------------

    const enviarRegistro = async () => {
        setError("");
        setExito("");
        setProgresoCarga(0);

        // Validar paso 2 antes de enviar
        const validacion = validarPaso2();
        if (!validacion.valido) {
            setError(validacion.mensaje);
            return;
        }

        setCargando(true);

        try {
            // 1) Obtener usuario de Firebase (ya fue creado en el paso 1)
            const user = auth.currentUser;

            // DIAGNÓSTICO: Verificar configuración de Firebase
            console.log("🔥 Firebase Config:", app.options);
            console.log("🔥 Project ID esperado:", "kineayuda-a5a15");

            if (!user) {
                setError("Error: no se encontró el usuario. Por favor vuelve al paso anterior.");
                return;
            }

            console.log("📧 Usuario Firebase encontrado:", user.email);

            // 2) Obtener token FRESCO de Firebase
            setProgresoCarga(30);
            const token = await user.getIdToken(true);
            console.log("🔑 Token obtenido, longitud:", token.length);

            // 3) Construir FormData
            setProgresoCarga(40);
            const form = new FormData();

            form.append("nombre", datosCuenta.nombre);
            form.append("apellido", datosCuenta.apellido);
            form.append("email", datosCuenta.email);
            form.append("uid", user.uid); // Enviar UID explícitamente como fallback

            // Enviar RUT sin formato al backend (solo números y dígito verificador)
            const rutSinFormato = datosCuenta.rut.replace(/[.-\s]/g, "");
            form.append("rut", rutSinFormato);

            form.append("nro_titulo", datosProfesionales.nroTitulo);
            form.append("especialidad", datosProfesionales.especialidadId);

            if (documentos.idFrente) form.append("doc_id_frente", documentos.idFrente);
            if (documentos.idReverso) form.append("doc_id_reverso", documentos.idReverso);
            if (documentos.titulo) form.append("doc_titulo", documentos.titulo);

            documentos.certificados.forEach((f) => form.append("doc_certificado", f));

            // 4) Enviar al backend CON token de Firebase
            // Usar axios directamente con el token en el header
            setProgresoCarga(50);
            const { default: axios } = await import("axios");

            await axios.post("http://127.0.0.1:8000/api/kinesiologos/registro/", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
                timeout: 30000, // 30 segundos para subida de archivos
                onUploadProgress: (progressEvent: any) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            50 + (progressEvent.loaded * 40) / progressEvent.total
                        );
                        setProgresoCarga(percentCompleted);
                    }
                },
            });

            // No guardamos el token en localStorage para evitar que el header muestre "Cerrar sesión"
            // El usuario debe esperar aprobación antes de poder iniciar sesión realmente.
            // localStorage.setItem("token", token);

            // 5) Éxito
            setProgresoCarga(100);
            setExito("¡Tu registro fue enviado exitosamente! Serás redirigido...");

            // Limpiar sessionStorage
            sessionStorage.removeItem("registro_kine_draft");

            // Redirigir a página de verificación pendiente después de 2 segundos
            setTimeout(() => {
                navigate("/kinesiologo/verificacion-pendiente");
            }, 2000);

        } catch (err: any) {
            console.error("Error en registro:", err);
            console.error("Error response:", err?.response);
            console.error("Error response data:", err?.response?.data);
            console.error("Error response status:", err?.response?.status);

            // Manejo específico de errores
            if (esErrorFirebase(err)) {
                // Error de Firebase
                setError(mapearErrorFirebase(err.code));
            } else if (err?.response) {
                // Error del backend
                const status = err.response.status;
                const data = err.response.data;

                console.log("Status del error:", status);
                console.log("Data del error:", data);

                if (status === 400) {
                    // Error de validación
                    const mensaje =
                        data?.detail ||
                        data?.error ||
                        data?.mensaje ||
                        data?.rut?.[0] ||
                        data?.email?.[0] ||
                        "Datos inválidos. Verifica la información ingresada.";
                    setError(mensaje);
                } else if (status === 401) {
                    // No autorizado
                    setError("Error de autenticación. Por favor intenta nuevamente.");
                } else if (status === 409) {
                    setError("Ya existe un registro con este email o RUT.");
                } else if (status >= 500) {
                    setError("Error del servidor. Por favor intenta más tarde.");
                } else {
                    // Error desconocido con más detalle
                    const errorMsg = data?.detail || data?.error || data?.message || "Ocurrió un error inesperado. Intenta nuevamente.";
                    setError(errorMsg);
                    console.error("Error no manejado - Status:", status, "Data completa:", JSON.stringify(data));
                }
            } else if (err?.message?.includes("network")) {
                setError("Error de conexión. Verifica tu internet e intenta nuevamente.");
            } else {
                setError("Ocurrió un error al registrar tu cuenta. Intenta nuevamente.");
            }
        } finally {
            setCargando(false);
            setProgresoCarga(0);
        }
    };

    return {
        pasoActual,
        irSiguientePaso,
        irPasoAnterior,

        datosCuenta,
        actualizarCuenta,

        datosProfesionales,
        actualizarProfesionales,

        documentos,
        actualizarDocumento,

        enviarRegistro,
        cargando,
        progresoCarga,
        error,
        exito,

        // Exponer validaciones para uso en componentes
        validarPaso1,
        validarPaso2,
    };
}
