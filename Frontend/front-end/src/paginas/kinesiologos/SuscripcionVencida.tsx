import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertTriangle, Calendar } from "lucide-react";

const SuscripcionVencida: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Tarjeta principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    {/* Icono de advertencia */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-red-100 rounded-full p-6">
                                <AlertTriangle className="w-16 h-16 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                        Suscripción Vencida
                    </h1>

                    <p className="text-center text-gray-600 text-lg mb-8">
                        Tu suscripción ha expirado. Renuévala para continuar usando el panel
                    </p>

                    {/* Información */}
                    <div className="space-y-6 mb-8">
                        {/* Alerta de vencimiento */}
                        <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Acceso suspendido
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Tu suscripción mensual ha vencido. Para volver a acceder a tu
                                    panel, agenda y gestionar tus pacientes, necesitas renovar tu
                                    suscripción.
                                </p>
                            </div>
                        </div>

                        {/* Beneficios */}
                        <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Renueva y continúa
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Con tu suscripción activa podrás:
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                        Gestionar tu agenda y horarios
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                        Recibir y atender pacientes
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                        Acceder a todas las funcionalidades del panel
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Nota */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700 text-center">
                            El pago es mensual y se procesa de forma segura a través de Webpay.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/kinesiologo/suscripcion-pago")}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Renovar Suscripción
                        </button>
                        <button
                            onClick={() => {
                                window.scrollTo(0, 0);
                                navigate("/");
                            }}
                            className="px-8 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-300"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuscripcionVencida;
