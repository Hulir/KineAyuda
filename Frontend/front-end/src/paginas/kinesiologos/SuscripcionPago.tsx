// src/paginas/kinesiologos/SuscripcionPago.tsx
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";
import api from "@/services/api";

export default function SuscripcionPago() {
  const handleSuscripcion = async (plan: "mensual" | "anual") => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (!user) {
        alert("Debes iniciar sesión para suscribirte.");
        return;
      }

      const idToken = await user.getIdToken();

      // Montos de ejemplo (ajusta a lo que definas en el backend)
      const monto = plan === "mensual" ? 15000 : 915000;

      // 1️⃣ Llamar al backend para iniciar la suscripción Webpay
      const { data } = await api.post(
        "/pagos/webpay/iniciar/",
        { monto },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      console.log("Respuesta iniciar suscripción:", data);

      const url = data.url;
      const tokenWs = data.token;

      if (!url || !tokenWs) {
        alert("No se pudo iniciar la transacción con Webpay.");
        return;
      }

      // 2️⃣ Crear y enviar un formulario POST hacia Webpay con token_ws
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = tokenWs;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("Error al iniciar suscripción:", error);

      if (error?.response?.status === 403) {
        // EsKinesiologoVerificado probablemente bloquea aquí
        const msg =
          error.response.data?.detail ||
          "Tu cuenta aún no está verificada. Sube tus documentos y espera la revisión.";
        alert(msg);
      } else {
        const msg =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Ocurrió un problema al iniciar la suscripción.";
        alert(msg);
      }
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold mb-4"
      >
        ¡Ya estás registrado!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg mb-6"
      >
        Solo un paso más: activa tu suscripción mensual
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl text-base text-slate-700 mb-12"
      >
        Accede a todas las herramientas de KineAyuda: visibilidad profesional,
        gestión de citas, videollamadas y soporte exclusivo.
      </motion.p>

      {/* Plan Mensual Único */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.03 }}
        className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center max-w-md w-full border-2 border-indigo-300"
      >
        <FaCalendarAlt size={60} className="mb-6 text-blue-300" />
        <h3 className="text-3xl font-bold mb-3">Plan Mensual</h3>
        <div className="mb-6">
          <p className="text-4xl font-extrabold text-slate-900">$15.000 <span className="text-lg font-normal text-slate-600">CLP</span></p>
          <p className="text-sm text-slate-600 mt-1">Renovación automática cada mes</p>
        </div>

        <div className="w-full bg-white/5 rounded-lg p-6 mb-6">
          <p className="text-sm text-slate-600 mb-3 font-semibold">Incluye:</p>
          <ul className="text-left space-y-3">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
              <span className="text-sm">Perfil profesional visible para pacientes</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
              <span className="text-sm">Gestión completa de agenda y citas</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
              <span className="text-sm">Panel de control con estadísticas</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
              <span className="text-sm">Soporte prioritario por email</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={18} />
              <span className="text-sm">Acceso ilimitado a todas las funcionalidades</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => handleSuscripcion("mensual")}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Activar Suscripción
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Pago seguro procesado por Webpay
        </p>
      </motion.div>
    </div>
  );
}
