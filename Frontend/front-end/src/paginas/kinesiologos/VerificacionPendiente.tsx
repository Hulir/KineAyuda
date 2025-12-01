// src/paginas/kinesiologos/VerificacionPendiente.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, FileCheck, Mail } from "lucide-react";

const VerificacionPendiente: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Limpiar cualquier dato de registro guardado
        sessionStorage.removeItem("registro_kine_draft");
        // Scroll al inicio al cargar la página
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Tarjeta principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    {/* Icono de éxito */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-green-100 rounded-full p-6">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                        ¡Registro Exitoso!
                    </h1>

                    <p className="text-center text-gray-600 text-lg mb-8">
                        Tu solicitud ha sido recibida y está en proceso de verificación
                    </p>

                    {/* Proceso de verificación */}
                    <div className="space-y-6 mb-8">
                        {/* Estado actual */}
                        <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    En revisión
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Nuestro equipo está verificando tu información y documentos.
                                    Este proceso puede tomar entre 24 y 48 horas.
                                </p>
                            </div>
                        </div>

                        {/* Siguiente paso */}
                        <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Te notificaremos por email
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Recibirás un correo electrónico cuando tu cuenta sea verificada.
                                    Revisa tu bandeja de entrada y spam.
                                </p>
                            </div>
                        </div>

                        {/* Info adicional */}
                        <div className="flex items-start gap-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <FileCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Próximos pasos
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Una vez verificada tu cuenta, podrás:
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                                        Adquirir tu suscripción mensual
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                                        Configurar tu agenda y horarios
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                                        Comenzar a recibir pacientes
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Nota importante */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700 text-center">
                            <span className="font-semibold">Importante:</span> Si tus documentos
                            no cumplen con los requisitos, te contactaremos para solicitar
                            correcciones.
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                window.scrollTo(0, 0);
                                navigate("/");
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Ir al Inicio
                        </button>

                        <button
                            onClick={() => navigate("/contacto")}
                            className="px-8 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-all duration-200"
                        >
                            ¿Tienes dudas?
                        </button>
                    </div>
                </div>

                {/* Info de contacto */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Necesitas ayuda?{" "}
                        <a
                            href="mailto:soporte@kineayuda.cl"
                            className="text-purple-600 hover:text-purple-700 font-medium underline"
                        >
                            Contáctanos
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificacionPendiente;
