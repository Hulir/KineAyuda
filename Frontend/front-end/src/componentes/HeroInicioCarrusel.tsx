import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import imgProfesionales from "@/assets/carrusel/Profecionales certificados.jpg";
import imgDomicilio from "@/assets/img/domicilio.png";
import imgBox from "@/assets/img/box.png";
import imgTecnologia from "@/assets/carrusel/Tecnologia servicio.jpg";

type Slide = {
  titulo: string;
  descripcion: string;
  imagen: string;
};

const slides: Slide[] = [
  {
    titulo: "Profesionales certificados",
    descripcion: "Kinesiólogos verificados que entregan atención de calidad y confianza.",
    imagen: imgProfesionales,
  },
  {
    titulo: "Kine a Domicilio",
    descripcion: "Atención kinesiológica profesional en la comodidad de tu hogar.",
    imagen: imgDomicilio,
  },
  {
    titulo: "Atención Presencial en Consultas",
    descripcion: "Instalaciones profesionales equipadas para tu tratamiento óptimo.",
    imagen: imgBox,
  },
  {
    titulo: "Tecnología al servicio de tu salud",
    descripcion: "Recordatorios, agenda online y reseñas con análisis inteligente.",
    imagen: imgTecnologia,
  },
];

export default function HeroInicioCarrusel() {
  const [index, setIndex] = useState(0);

  const siguiente = () => setIndex((prev) => (prev + 1) % slides.length);
  const anterior = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(siguiente, 7000);
    return () => clearInterval(timer);
  }, []);

  const actual = slides[index];
  const izquierda = slides[(index - 1 + slides.length) % slides.length];
  const derecha = slides[(index + 1) % slides.length];

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center">
      <SlideCard slide={izquierda} className="hidden md:block scale-75 opacity-40 -translate-x-16 md:-translate-x-24" />
      <SlideCard slide={actual} className="scale-100 opacity-100 z-20" />
      <SlideCard slide={derecha} className="hidden md:block scale-75 opacity-40 translate-x-16 md:translate-x-24" />

      {/* Flechas */}
      <button
        onClick={anterior}
        className="absolute left-2 md:-left-4 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 
               border border-purple-400/40 text-purple-400/70 rounded-full 
               backdrop-blur-sm hover:border-purple-400/80 hover:text-purple-300 
               hover:scale-110 transition-all duration-300"
      >
        <FaChevronLeft size={18} />
      </button>

      <button
        onClick={siguiente}
        className="absolute right-2 md:-right-4 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 
               border border-purple-400/40 text-purple-400/70 rounded-full 
               backdrop-blur-sm hover:border-purple-400/80 hover:text-purple-300 
               hover:scale-110 transition-all duration-300"
      >
        <FaChevronRight size={18} />
      </button>
    </div>
  );
}

type SlideCardProps = {
  slide: Slide;
  className?: string;
};

function SlideCard({ slide, className = "" }: SlideCardProps) {
  return (
    <div
      className={`absolute transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${className}`}
    >
      <div className="relative w-[220px] md:w-[280px] h-[300px] md:h-[380px] rounded-3xl overflow-hidden shadow-xl border border-indigo-100/70">
        {/* Imagen */}
        <div className="h-[70%]">
          <img
            src={slide.imagen}
            alt={slide.titulo}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Fondo inferior con degradado azul/morado más claro */}
        <div className="h-[30%] bg-gradient-to-b from-indigo-100 via-purple-100 to-indigo-200 px-4 py-3 text-center">
          <h3 className="text-base md:text-lg font-bold text-indigo-800 mb-1">
            {slide.titulo}
          </h3>
          <p className="text-xs md:text-sm text-gray-700 leading-snug">
            {slide.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
}
