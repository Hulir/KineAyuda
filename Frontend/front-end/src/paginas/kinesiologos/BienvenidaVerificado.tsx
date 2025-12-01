import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, CreditCard, CheckCircle } from "lucide-react";

const BienvenidaVerificado: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Tarjeta principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    {/* Icono de celebración */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-green-100 rounded-full p-6">
                                <PartyPopper className="w-16 h-16 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                        ¡Felicidades! 🎉
                    </h1>

                    <p className="text-center text-gray-600 text-lg mb-8">
                        Tu cuenta ha sido <span className="font-semibold text-green-600">verificada exitosamente</span>
                    </p>

                    {/* Información */}
                    <div className="space-y-6 mb-8">
                        {/* Verificación exitosa */}
                        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Documentos aprobados
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Hemos revisado y aprobado tus documentos profesionales.
                                    Ahora eres parte oficial de KineAyuda y puedes comenzar a
                                    atender pacientes.
                                </p>
                            </div>
                        </div>

                        {/* Siguiente paso: Activar suscripción */}
                        <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <div className="flex-shrink-0 mt-1">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Último paso: Activa tu suscripción
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Para acceder a tu panel y comenzar a trabajar, necesitas
                                    activar tu suscripción mensual. Con ella podrás:
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
                                        Acceder a todas las herramientas del panel
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                        Recibir notificaciones de nuevas citas
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            onClick={() => navigate("/kinesiologo/suscripcion-pago")}
                            className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Activar Suscripción Ahora
                        </button>
                        <button
                            onClick={() => {
                                window.scrollTo(0, 0);
                                navigate("/");
                            }}
                            className="px-8 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-300"
                        >
                            Hacerlo más tarde
                        </button>
                    </div>

                    {/* Información adicional */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Puedes activar tu suscripción en cualquier momento desde tu perfil
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BienvenidaVerificado;
