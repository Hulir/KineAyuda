// Ubicación: src/paginas/admin/AdminLayout.tsx
import React, { Suspense } from "react"; // Importar React
import { NavLink, Outlet, Link } from "react-router-dom";
import { FaTachometerAlt, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import logoKine from "@/assets/img/logo.png";

// Helper para los links de la barra lateral
const AdminNavLink = ({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      end // 'end' es importante para que 'Dashboard' no quede activo en otras rutas
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive
          ? "bg-indigo-700 text-white" // Fondo azul-indigo para activo
          : "text-gray-300 hover:bg-slate-700 hover:text-white" // Fondo gris oscuro para hover
        } transition-colors`
      }
    >
      {icon}
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

export default function AdminLayout() {

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
  };

  return (
    // Este layout tiene su propio fondo
    <div className="flex h-screen bg-slate-100">
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 px-2 pb-4 mb-4 border-b border-slate-700"
        >
          <img src={logoKine} alt="KineAyuda" className="w-10 h-10" />
          <span className="text-xl font-bold text-white">
            <span className="text-cyan-300">Kine</span>
            <span className="text-purple-100">Admin</span>
          </span>
        </Link>

        {/* Navegación Principal */}
        <nav className="flex-1 flex flex-col gap-2">
          <AdminNavLink to="/admin/dashboard" icon={<FaTachometerAlt />}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink to="/admin/verificaciones" icon={<FaUserCheck />}>
            Verificaciones
          </AdminNavLink>
        </nav>

        {/* Footer de la Sidebar */}
        <div>
          <Link
            to="/admin" // Lo enviamos al login de admin
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <FaSignOutAlt />
            <span className="font-medium">Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-slate-800">Administración KineAyuda</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<div className="text-center p-10">Cargando página...</div>}>
            <Outlet /> {/* Aquí se renderizan AdminDashboard, AdminVerificaciones, etc. */}
          </Suspense>
        </div>
      </main>
    </div>
  );
}