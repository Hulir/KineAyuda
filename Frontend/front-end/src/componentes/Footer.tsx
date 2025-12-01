import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-indigo-100 via-white to-cyan-100 text-gray-800 py-8 md:py-10 border-t border-white/40 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

        {/* 🔹 Nombre y lema (Izquierda en Desktop) */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 mb-1">
            KineAyuda
          </h3>
          <p className="text-sm text-gray-600 max-w-xs">
            Conectando bienestar y tecnología en salud kinésica.
          </p>
        </div>

        {/* 🔹 Redes sociales (Centro/Derecha) */}
        <div className="flex gap-6 text-2xl md:text-3xl">
          <a
            href="https://www.facebook.com/KineAyuda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-transform transform hover:scale-110"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/KineAyuda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-500 transition-transform transform hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@KineAyuda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-transform transform hover:scale-110"
          >
            <FaTiktok />
          </a>
        </div>

        {/* 🔹 Derechos reservados (Abajo en móvil, Derecha en Desktop) */}
        <div className="text-center md:text-right">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">KineAyuda</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
