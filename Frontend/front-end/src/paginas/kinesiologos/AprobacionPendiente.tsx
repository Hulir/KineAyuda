import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Mail, AlertCircle } from "lucide-react";

const AprobacionPendiente: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Tarjeta principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    {/* Icono de espera */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-yellow-100 rounded-full p-6">
                                <Clock className="w-16 h-16 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                        Cuenta Pendiente de Aprobación
                    </h1>

                    <p className="text-center text-gray-600 text-lg mb-8">
                        Tu cuenta de kinesiólogo está en proceso de verificación
                    </p>

                    {/* Información del proceso */}
                    <div className="space-y-6 mb-8">
                        {/* Estado actual */}
                        <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Aún no puedes acceder
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Tu cuenta está siendo revisada por nuestro equipo. Este proceso
                                    puede tomar entre 24 y 48 horas hábiles.
                                </p>
                            </div>
                        </div>

                        {/* Notificación */}
                        <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Te notificaremos por correo
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Recibirás un email cuando tu cuenta sea aprobada. Revisa también
                                    tu carpeta de spam.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nota importante */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700 text-center">
                            <span className="font-semibold">Importante:</span> Si tus documentos
                            requieren correcciones, nos pondremos en contacto contigo.
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
                            className="px-8 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-300"
                        >
                            Contactar Soporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AprobacionPendiente;
