// src/paginas/kinesiologos/dashboard/DashboardLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
    LogOut,
    Calendar,
    User,
    Star,
    ClipboardList,
    Settings,
    Menu,
    X,
} from "lucide-react";
import logoKine from "@/assets/img/logo.png";
import { rutas } from "../../../rutas/Routes";

export default function DashboardLayout() {
    const [colorFondo, setColorFondo] = useState(
        localStorage.getItem("colorFondo") || "#f9fafb"
    );
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [mostrarModalLogout, setMostrarModalLogout] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        localStorage.setItem("colorFondo", colorFondo);
    }, [colorFondo]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } finally {
            localStorage.clear();
            navigate("/loginKine");
        }
    };

    const enlaces = [
        { nombre: "Inicio", ruta: "/panel-kine", icono: <ClipboardList size={18} /> },
        { nombre: "Mi Perfil", ruta: "/panel-kine/perfil", icono: <User size={18} /> },
        { nombre: "Agenda", ruta: "/panel-kine/agenda", icono: <Calendar size={18} /> },
        { nombre: "Citas", ruta: "/panel-kine/citas", icono: <ClipboardList size={18} /> },
        { nombre: "Reseñas", ruta: "/panel-kine/resenas", icono: <Star size={18} /> },
        {
            nombre: "Suscripción",
            ruta: "/panel-kine/suscripcion",
            icono: <Settings size={18} />,
        },
    ];

    return (
        <div
            className="flex min-h-screen transition-colors duration-300"
            style={{ backgroundColor: colorFondo }}
        >
            {/* Sidebar - STICKY */}
            <aside
                className={`${menuAbierto ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white z-50 transform transition-transform duration-300 h-screen overflow-y-auto`}
            >
                {/* Logo */}
                <button
                    onClick={() => navigate(rutas.inicio)}
                    className="flex flex-col items-center justify-center p-6 border-b border-indigo-700 w-full focus:outline-none"
                >
                    <img
                        src={logoKine}
                        alt="KineAyuda"
                        className="h-36 w-36 object-contain drop-shadow-md"
                    />
                    <h1 className="mt-2 text-lg font-bold">KineAyuda</h1>
                    <p className="text-xs text-indigo-200">Panel del kinesiologo</p>
                </button>

                {/* Links */}
                <nav className="flex flex-col gap-1 p-4">
                    {enlaces.map((item) => (
                        <NavLink
                            key={item.ruta}
                            to={item.ruta}
                            end={item.ruta === "/panel-kine"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-indigo-700 text-white font-semibold"
                                    : "hover:bg-indigo-800/50 text-indigo-100"
                                }`
                            }
                            onClick={() => setMenuAbierto(false)}
                        >
                            {item.icono}
                            <span>{item.nombre}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Botón Logout */}
                <div className="p-4 mt-auto border-t border-indigo-700">
                    <button
                        onClick={() => setMostrarModalLogout(true)}
                        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-medium"
                    >
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Contenido principal - Con ml-64 para compensar sidebar sticky */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Header superior - STICKY */}
                <header className="flex items-center justify-between bg-white shadow px-4 md:px-8 py-4 sticky top-0 z-40 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        {/* Botón menú móvil */}
                        <button
                            className="md:hidden p-2 rounded-md border border-gray-200"
                            onClick={() => setMenuAbierto((prev) => !prev)}
                        >
                            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                            Panel del Kinesiólogo
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600 hidden sm:block">
                            Fondo:
                        </label>
                        <input
                            type="color"
                            value={colorFondo}
                            onChange={(e) => setColorFondo(e.target.value)}
                            className="w-8 h-8 border rounded cursor-pointer"
                        />
                    </div>
                </header>

                {/* Vista dinámica según la ruta */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Modal Confirmación Logout */}
            {mostrarModalLogout && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            ¿Cerrar sesión?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setMostrarModalLogout(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setMostrarModalLogout(false);
                                    handleLogout();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
