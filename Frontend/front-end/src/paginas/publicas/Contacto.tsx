import { motion } from "framer-motion";
// 🔹 Importamos los iconos para la info de contacto
import {
    FaPhone,
    FaEnvelope,
    FaClock,
    FaInstagram,
    FaFacebookF,
    FaWhatsapp, // <-- AÑADIDO
    FaLinkedinIn, // <-- AÑADIDO
} from "react-icons/fa";

export default function Contacto() {
    return (
        // Contenedor principal de la página.
        <div className="max-w-6xl mx-auto py-16 px-4">
            
            {/* 1. Título de la sección */}
            <header className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                    ¿Necesitas ayuda?
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">
                    Si necesitas ayuda...{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                        ¡Hablemos!
                    </span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4">
                    Completa el formulario o contáctanos directamente a través de
                    nuestros canales. En <strong>KineAyuda</strong> queremos
                    acompañarte en tu proceso de bienestar.
                </p>
            </header>

            {/* 2. Contenedor de 2 columnas (Info + Form) */}
            <div className="grid lg:grid-cols-5 gap-12">
                
                {/* ================================= */}
                {/* COLUMNA IZQUIERDA: Info Contacto  */}
                {/* ================================= */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-2 text-slate-700"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Información de Contacto
                    </h2>

                    <div className="space-y-5">
                        {/* Teléfono */}
                        <a
                            href="tel:+56981322367"
                            className="flex items-center gap-4 group"
                        >
                            <FaPhone className="text-2xl text-indigo-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Teléfono
                                </p>
                                <p className="text-sm group-hover:underline">
                                    +569 8132 2367
                                </p>
                            </div>
                        </a>
                        
                        {/* Email */}
                        <a
                            href="mailto:contacto@kineayuda.cl"
                            className="flex items-center gap-4 group"
                        >
                            <FaEnvelope className="text-2xl text-indigo-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Email
                                </p>
                                <p className="text-sm group-hover:underline">
                                    contacto@kineayuda.cl
                                </p>
                            </div>
                        </a>
                        
                        {/* Horario */}
                        <div className="flex items-center gap-4">
                            <FaClock className="text-2xl text-indigo-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Horario
                                </p>
                                <p className="text-sm">
                                    Lunes a Viernes: 9:00-18:00
                                </p>
                                <p className="text-sm">
                                    Sábado: 9:00-14:00
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RRSS */}
                    <div className="mt-8 pt-6 border-t border-slate-300">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Síguenos
                        </h3>
                        <div className="flex items-center gap-6">
                            <a
                                href="#" // Reemplazar con tu link
                                className="text-slate-500 hover:text-indigo-600 transition-colors"
                                aria-label="Facebook de KineAyuda"
                            >
                                <FaFacebookF size={28} />
                            </a>
                            <a
                                href="#" // Reemplazar con tu link
                                className="text-slate-500 hover:text-indigo-600 transition-colors"
                                aria-label="Instagram de KineAyuda"
                            >
                                <FaInstagram size={28} />
                            </a>
                            {/* --- ICONOS AÑADIDOS --- */}
                            <a
                                href="https://wa.me/56981322367" // Reemplaza con tu número
                                className="text-slate-500 hover:text-green-500 transition-colors"
                                aria-label="WhatsApp de KineAyuda"
                            >
                                <FaWhatsapp size={28} />
                            </a>
                            <a
                                href="#" // Reemplazar con tu link
                                className="text-slate-500 hover:text-blue-700 transition-colors"
                                aria-label="LinkedIn de KineAyuda"
                            >
                                <FaLinkedinIn size={28} />
                            </a>
                            {/* --- FIN ICONOS AÑADIDOS --- */}
                        </div>
                    </div>
                </motion.div>

                {/* ================================= */}
                {/* COLUMNA DERECHA: Formulario       */}
                {/* ================================= */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-3 flex flex-col gap-5 bg-white/80 backdrop-blur-md shadow-lg p-8 rounded-2xl border border-white/60"
                >
                    {/* Fila Nombre + Apellido */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        <input
                            type="text"
                            placeholder="Nombre*"
                            required
                            className="w-full"
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            className="w-full"
                        />
                    </div>

                    {/* Fila Email + Teléfono */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        <input
                            type="email"
                            placeholder="Correo electrónico*"
                            required
                            className="w-full"
                        />
                        <input
                            type="tel"
                            placeholder="Número de teléfono"
                            className="w-full"
                        />
                    </div>

                    {/* Mensaje */}
                    <textarea
                        placeholder="Consulta o Mensaje..."
                        rows={5}
                        className="w-full"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold py-3 rounded-md hover:opacity-90 transition"
                    >
                        Enviar
                    </button>

                    <p className="text-xs text-gray-600 text-center">
                        Este sitio está protegido por reCAPTCHA y aplican las{" "}
                        <a
                            href="#"
                            className="text-indigo-500 hover:underline"
                        >
                            Política de privacidad
                        </a>{" "}
                        y los{" "}
                        <a
                            href="#"
                            className="text-indigo-500 hover:underline"
                        >
                            Términos de servicio
                        </a>{" "}
                        de Google.
                    </p>
                </motion.form>
            </div>
        </div>
    );
}