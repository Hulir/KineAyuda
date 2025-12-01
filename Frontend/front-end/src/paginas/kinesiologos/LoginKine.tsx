// src/paginas/kinesiologos/LoginKine.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaEnvelope,
  FaInfoCircle,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/img/logo.png";

export default function BarraLateral() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const menuItems = [
    { path: "/", label: "Inicio", icon: <FaHome /> },
    { path: "/reservar", label: "Reservar Cita", icon: <FaCalendarAlt /> },
    { path: "/kinesiologo", label: "Kinesiólogo", icon: <FaUserMd /> },
    { path: "/contacto", label: "Contacto", icon: <FaEnvelope /> },
    { path: "/nosotros", label: "Nosotros", icon: <FaInfoCircle /> },
  ];

  const smoothScrollTop = () => {
    const candidates: (Element | null)[] = [
      document.getElementById("main-scroll"),
      document.querySelector("[data-scroll-container]"),
    ];
    const target =
      (candidates.find(Boolean) as HTMLElement | null) ||
      (document.scrollingElement as HTMLElement) ||
      document.documentElement;

    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = (path: string) => {
    setOpen(false);
    if (path === "/") smoothScrollTop();
  };

  return (
    <>
      {/* 🔹 Encabezado móvil */}
      <div className="md:hidden bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-600 text-white flex justify-between items-center p-4 fixed w-full z-50 shadow-md">
        <Link
          to="/"
          onClick={() => handleClick("/")}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <img src={logo} alt="KineAyuda" className="w-12 h-12" />
          <h1 className="text-2xl font-extrabold">KineAyuda</h1>
        </Link>

        <button onClick={() => setOpen(!open)}>
          <FaBars size={26} />
        </button>
      </div>

      {/* 🔹 Sidebar fija (modo escritorio) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 via-purple-700 to-indigo-600 text-white transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 z-40 flex flex-col`}
      >
        {/* 🌀 Logo animado con movimiento al pasar el mouse */}
        <Link
          to="/"
          onClick={() => handleClick("/")}
          className="hidden md:flex flex-col items-center mt-6 cursor-pointer group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            animate={
              hovered
                ? {
                    rotate: [0, 8, -8, 0],
                    y: [0, -6, 0, 6, 0],
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: hovered ? Infinity : 0,
            }}
            className="flex flex-col items-center -space-y-1"
          >
            <motion.img
              src={logo}
              alt="KineAyuda Logo"
              className="w-28 h-28 mb-1 drop-shadow-lg transition-transform duration-300"
            />
            <motion.h1
              animate={
                hovered
                  ? {
                      scale: [1, 1.1, 1],
                      textShadow: [
                        "0 0 5px rgba(255,255,255,0.6)",
                        "0 0 15px rgba(255,255,255,0.8)",
                        "0 0 5px rgba(255,255,255,0.6)",
                      ],
                    }
                  : { scale: 1, textShadow: "none" }
              }
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: hovered ? Infinity : 0,
              }}
              className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300"
            >
              KineAyuda
            </motion.h1>
          </motion.div>
        </Link>

        {/* 🔹 Menú lateral */}
        <nav className="flex flex-col gap-3 px-4 mt-6 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleClick(item.path)}
              className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
