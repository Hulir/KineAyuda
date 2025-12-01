import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// 🔹 Importamos iconos para las tarjetas de valores
import {
    FaCheckCircle,
    FaLaptopMedical,
    FaUsers,
} from "react-icons/fa";
import { rutas } from "@/rutas/Routes"; // Asegúrate que esta ruta sea correcta

export default function Nosotros() {
    return (
        // Contenedor principal de la página
        // El padding superior (pt-16) es para compensar el header fijo
        <div className="max-w-6xl mx-auto py-16 px-4">

            {/* 1. Título */}
            <header className="text-center mb-16">
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                    Conócenos
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">
                    Sobre{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                        KineAyuda
                    </span>
                </h1>
            </header>

            {/* 2. Párrafo Introductorio (Estilo Vitae) */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mx-auto text-center mb-16"
            >
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Nuestra convicción: La salud kinésica debe ser accesible
                    para todos.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    KineAyuda nace de la necesidad de simplificar y democratizar
                    el acceso a la kinesiología de calidad en Chile. Creemos
                    en el poder de la tecnología para conectar a pacientes con
                    los profesionales certificados que necesitan, de forma
                    rápida, segura y desde cualquier lugar.
                </p>
            </motion.section>

            {/* 3. Misión y Visión (Estilo Vitae) */}
            <section className="grid md:grid-cols-2 gap-10 mb-20">
                {/* Misión */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/60"
                >
                    <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                        Misión
                    </h3>
                    <p className="text-slate-700">
                        Facilitar el acceso a servicios de kinesiología
                        certificados en todo Chile, conectando pacientes con una
                        red de profesionales validados a través de una
                        plataforma digital intuitiva, segura y centrada en el
                        bienestar integral del usuario.
                    </p>
                </motion.div>

                {/* Visión */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/60"
                >
                    <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                        Visión
                    </h3>
                    <p className="text-slate-700">
                        Ser la plataforma líder y de mayor confianza en salud
                        kinésica digital en Chile, reconocida por nuestra
                        calidad profesional, innovación tecnológica y por ser
                        un pilar fundamental en la rehabilitación y bienestar
                        de miles de personas.
                    </p>
                </motion.div>
            </section>

            {/* 4. Lo que nos define (Estilo Santiago Medical) */}
            <section className="mb-20">
                <header className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Lo que nos define
                    </h2>
                </header>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Card 1: Confianza y Seguridad */}
                    <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60">
                        <FaCheckCircle className="text-5xl text-indigo-600 mb-4" />
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            Confianza y Seguridad
                        </h4>
                        <p className="text-sm text-slate-600">
                            Verificamos a cada kinesiólogo de nuestra
                            plataforma para garantizar atenciones de calidad y
                            con profesionales certificados.
                        </p>
                    </div>

                    {/* Card 2: Tecnología y Acceso */}
                    <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60">
                        <FaLaptopMedical className="text-5xl text-purple-600 mb-4" />
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            Tecnología y Acceso
                        </h4>
                        <p className="text-sm text-slate-600">
                            Usamos la tecnología para simplificar tu vida.
                            Agenda, gestiona y recibe recordatorios de tus
                            citas en un solo lugar.
                        </p>
                    </div>

                    {/* Card 3: Calidad Profesional */}
                    <div className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60">
                        <FaUsers className="text-5xl text-cyan-600 mb-4" />
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            Calidad Profesional
                        </h4>
                        <p className="text-sm text-slate-600">
                            Fomentamos una comunidad de kinesiólogos de alto
                            nivel, con diversas especialidades para cubrir
                            todas tus necesidades.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. Nuestra Comunidad (Adaptación de "Nuestro Staff") */}
            <section className="text-center bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-white/60">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                    Nuestra Comunidad
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                    Nuestra plataforma se construye con kinesiólogos
                    apasionados por su trabajo y pacientes que buscan mejorar
                    su calidad de vida.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to={rutas.reserva}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all"
                    >
                        Buscar un Kinesiólogo
                    </Link>
                    <Link
                        to={rutas.kinesiologo}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all border border-indigo-100"
                    >
                        Soy Kinesiólogo, quiero unirme
                    </Link>
                </div>
            </section>
        </div>
    );
}