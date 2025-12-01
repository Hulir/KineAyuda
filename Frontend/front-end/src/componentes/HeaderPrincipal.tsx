// src/componentes/HeaderPrincipal.tsx
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { rutas } from "../rutas/Routes";
import logoKine from "/src/assets/img/logo.png";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaCalendarPlus, FaSearch } from "react-icons/fa";
import ModalConsultarCita from "./ModalConsultarCita";

type NavLinkItem = {
    to: string;
    label: string;
    isDropdown?: boolean;
};

const navLinks: NavLinkItem[] = [
    { to: rutas.inicio, label: "Inicio" },
    {
        to: rutas.especialidades,
        label: "Especialidades",
        isDropdown: true,
    },
    { to: rutas.kinesiologo, label: "¿Eres Kinesiólogo?" },
    { to: rutas.contacto, label: "Contacto" },
    { to: rutas.nosotros, label: "Nosotros" },
];

const especialidadesMenu = [
    { id: "kinesiologia-deportiva", nombre: "Kinesiología deportiva" },
    { id: "kinesiologia-neurologica", nombre: "Kinesiología neurológica" },
    { id: "kinesiologia-traumatologica", nombre: "Kinesiología traumatológica" },
    { id: "kinesiologia-respiratoria", nombre: "Kinesiología respiratoria" },
    { id: "kinesiologia-oncologica", nombre: "Kinesiología oncológica" },
    { id: "piso-pelvico", nombre: "Kinesiología de piso pélvico" },
    { id: "neonatologia", nombre: "Kinesiología en neonatología" },
    { id: "dermatofuncional", nombre: "Kinesiología dermatofuncional" },
    { id: "kinesiologia-cardiorrespiratoria", nombre: "Kinesiología cardiorrespiratoria" },
    { id: "kinesiologia-geriatrica", nombre: "Kinesiología geriátrica" },
    { id: "quiropraxia", nombre: "Quiropraxia" },
];

export default function HeaderPrincipal() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modalConsultaAbierto, setModalConsultaAbierto] = useState(false);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownAbierto(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const irInicio = () => {
        navigate(rutas.inicio);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate(rutas.loginKine);
    };

    const linkBase =
        "relative px-1 pb-1 text-sm font-semibold tracking-wide transition-colors";

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 shadow-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
                {/* Logo + nombre (click = ir a inicio) */}
                <button
                    onClick={irInicio}
                    className="flex items-center gap-2 md:gap-3 group focus:outline-none"
                >
                    <img
                        src={logoKine}
                        alt="KineAyuda"
                        className="w-10 h-10 md:w-14 md:h-14 transform group-hover:scale-105 transition-transform"
                    />
                    <span className="inline-block text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight group-hover:scale-[1.02] transition-transform">
                        <span className="text-cyan-300">Kine</span>
                        <span className="text-purple-100">Ayuda</span>
                    </span>
                </button>

                {/* NAV DESKTOP */}
                <nav className="hidden md:flex items-center gap-8 h-full">
                    <ul className="flex items-center gap-8 text-white h-full">
                        {navLinks.map((link) =>
                            link.isDropdown ? (
                                <li key={link.to} className="relative group">
                                    <button
                                        type="button"
                                        className={`${linkBase} text-white/90 hover:text-cyan-200 flex items-center gap-1`}
                                        onClick={() => navigate(link.to)}
                                    >
                                        {link.label}
                                    </button>
                                    <div className="absolute left-0 mt-3 w-64 bg-white text-slate-900 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-1 group-hover:translate-y-0 transition-all">
                                        <ul className="py-3">
                                            {especialidadesMenu.map((esp) => (
                                                <li key={esp.id}>
                                                    <NavLink
                                                        to={`${rutas.especialidades}/${esp.id}`}
                                                        className="block px-4 py-2 text-sm hover:bg-slate-50"
                                                    >
                                                        {esp.nombre}
                                                    </NavLink>
                                                </li>
                                            ))}
                                            <li className="mt-2 border-t border-slate-100 pt-2">
                                                <NavLink
                                                    to={rutas.especialidades}
                                                    className="block px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Ver todas las especialidades
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            ) : (
                                <li key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        className={`${linkBase} text-white/90 hover:text-cyan-200`}
                                    >
                                        {() => (
                                            <>
                                                {link.label}
                                                <span className={`absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-300 to-purple-300 transition-all w-0 group-hover:w-full`} />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            )
                        )}
                    </ul>

                    <div className="flex items-center gap-4 ml-4">
                        {/* Botón Reservar Cita con Dropdown (NO navega directo) */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold shadow-md hover:shadow-lg transition-all text-sm"
                            >
                                <span className="text-lg">📅</span> Reservar cita
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownAbierto && (
                                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                navigate(rutas.reserva);
                                                setDropdownAbierto(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <FaCalendarPlus className="text-indigo-600" />
                                            <div>
                                                <div className="font-semibold text-slate-800">Nueva Cita</div>
                                                <div className="text-xs text-slate-500">Agenda una nueva sesión</div>
                                            </div>
                                        </button>

                                        <div className="border-t border-slate-100 my-1"></div>

                                        <button
                                            onClick={() => {
                                                setModalConsultaAbierto(true);
                                                setDropdownAbierto(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <FaSearch className="text-purple-600" />
                                            <div>
                                                <div className="font-semibold text-slate-800">Consultar Mi Cita</div>
                                                <div className="text-xs text-slate-500">Ver citas agendadas</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {token && (
                            <button
                                onClick={cerrarSesion}
                                className="text-xs font-medium text-white/80 hover:text-white"
                            >
                                Cerrar sesión
                            </button>
                        )}
                    </div>
                </nav>

                {/* BOTÓN MENÚ MÓVIL */}
                <button
                    className="md:hidden text-2xl text-white"
                    onClick={() => setMenuAbierto(true)}
                    aria-label="Abrir menú"
                >
                    <HiMenuAlt3 />
                </button>
            </div>

            {/* MENU LATERAL MÓVIL MEJORADO */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${menuAbierto ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMenuAbierto(false)}
                />

                <div
                    className={`absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-indigo-700 via-purple-700 to-indigo-600 text-white shadow-2xl transform transition-transform duration-300 ease-out ${menuAbierto ? "translate-x-0" : "-translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                        <button
                            onClick={() => {
                                irInicio();
                                setMenuAbierto(false);
                            }}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={logoKine}
                                alt="KineAyuda"
                                className="w-10 h-10"
                            />
                            <span className="text-lg font-extrabold tracking-tight">
                                <span className="text-cyan-300">Kine</span>
                                <span className="text-purple-100">Ayuda</span>
                            </span>
                        </button>
                        <button
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => setMenuAbierto(false)}
                            aria-label="Cerrar menú"
                        >
                            <HiX className="text-2xl" />
                        </button>
                    </div>

                    <nav className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuAbierto(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                        ? "bg-white/15 text-cyan-300 shadow-inner"
                                        : "text-white/90 hover:bg-white/10 hover:translate-x-1"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                            <button
                                onClick={() => {
                                    navigate(rutas.reserva);
                                    setMenuAbierto(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                <span className="text-xl">📅</span> Nueva Cita
                            </button>

                            <button
                                onClick={() => {
                                    setModalConsultaAbierto(true);
                                    setMenuAbierto(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 active:scale-95 transition-all"
                            >
                                <FaSearch /> Consultar Mi Cita
                            </button>
                        </div>

                        {token && (
                            <button
                                onClick={() => {
                                    cerrarSesion();
                                    setMenuAbierto(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-200 hover:text-red-100 hover:bg-red-500/10 rounded-xl transition-colors mt-2"
                            >
                                Cerrar sesión
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Modal Consultar Cita */}
            <ModalConsultarCita
                isOpen={modalConsultaAbierto}
                onClose={() => setModalConsultaAbierto(false)}
            />
        </header>
    );
}
