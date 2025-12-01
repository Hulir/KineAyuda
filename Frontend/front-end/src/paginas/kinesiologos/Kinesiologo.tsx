import { motion } from "framer-motion";
import { FaMoneyBillWave, FaHome, FaCalendarCheck, FaUserMd } from "react-icons/fa";
import { Link } from "react-router-dom";
import { rutas } from "@/rutas/Routes";

export default function Kinesiologo() {
    return (
        <div className="min-h-screen text-slate-800 flex flex-col items-center px-6 pt-24 md:pt-16 pb-16">

            {/* ENCABEZADO CON ESTILO GLOBAL */}
            <div className="kine-titulo-contenedor max-w-4xl">
                {/* Tag superior */}
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="kine-tag-superior"
                >
                    Únete a la red profesional
                    <span className="kine-tag-linea" />
                </motion.p>

                {/* TÍTULO PRINCIPAL */}
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="kine-titulo-principal"
                >
                    <span className="kine-titulo-texto">¿Eres </span>
                    <span className="kine-titulo-degradado">Kinesiólogo?</span>
                </motion.h1>

                {/* DESCRIPCIÓN */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="kine-texto-descripcion"
                >
                    Únete a <span className="kine-texto-descripcion-destacado">KineAyuda</span> y forma parte de la red que conecta a profesionales de la salud con pacientes que buscan atención kinésica de calidad.
                    Ofrece tus servicios, administra tus citas y genera ingresos desde cualquier lugar 🌍.
                </motion.p>
            </div>

            {/* BOTÓN DE LOGIN VISIBLE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mb-12 flex flex-col items-center gap-3"
            >
                <p className="text-sm text-slate-700 font-medium">
                    ¿Ya tienes una cuenta?
                </p>
                <Link
                    to={rutas.loginKine}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <FaUserMd className="w-5 h-5" />
                    Ingresa a tu Panel
                </Link>
            </motion.div>

            {/* BENEFICIOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
                {[
                    {
                        icon: <FaMoneyBillWave size={36} />,
                        titulo: "Aumenta tus ingresos",
                        desc: "Llega a nuevos pacientes y trabaja más horas desde donde estés.",
                    },
                    {
                        icon: <FaHome size={36} />,
                        titulo: "Atiende desde casa",
                        desc: "En tu consulta privada o a domicilio según tus tiempos y disponibilidad.",
                    },
                    {
                        icon: <FaCalendarCheck size={36} />,
                        titulo: "Gestión de citas",
                        desc: "Administra fácilmente tus horarios y reservas en un solo lugar.",
                    },
                    {
                        icon: <FaUserMd size={36} />,
                        titulo: "Presencia profesional",
                        desc: "Crea tu perfil, muestra tus especialidades y gana visibilidad.",
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                        className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center hover:scale-105 transition transform border border-indigo-100"
                    >
                        <div className="mb-4 flex justify-center text-indigo-600">
                            {item.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-800">{item.titulo}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                    </motion.div>
                ))}</div>

            {/* CTA FINAL */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-16 flex flex-col items-center"
            >
                <p className="text-base sm:text-lg mb-6 font-semibold text-slate-800 text-center">
                    Sé parte de la nueva generación de kinesiólogosdigitales 💪.
                </p>
                <Link
                    to={rutas.registroKine}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
                >
                    Quiero Unirme
                </Link>
            </motion.div>
        </div>
    );
}
