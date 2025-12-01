import { motion } from "framer-motion";

const servicios = [
  {
    titulo: "Rehabilitación Física",
    descripcion: "Tratamientos personalizados para lesiones musculares y articulares.",
  },
  {
    titulo: "Terapia Respiratoria",
    descripcion: "Mejora tu capacidad pulmonar y bienestar general.",
  },
  {
    titulo: "Kinesiología Deportiva",
    descripcion: "Prevención y recuperación de lesiones en deportistas.",
  },
  {
    titulo: "Atención Domiciliaria",
    descripcion: "Recibe tu tratamiento en la comodidad de tu hogar.",
  },
];

export default function ServiciosCarrusel() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-16">
      {servicios.map((servicio, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="p-6 rounded-2xl shadow-md bg-gradient-to-br from-indigo-100 via-white to-cyan-100 border border-indigo-200/40 hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          <h3 className="text-xl font-bold text-indigo-800 mb-3">{servicio.titulo}</h3>
          <p className="text-gray-700 leading-relaxed">{servicio.descripcion}</p>
        </motion.div>
      ))}
    </div>
  );
}
