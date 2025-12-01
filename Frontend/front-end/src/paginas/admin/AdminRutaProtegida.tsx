// Ubicación: src/paginas/admin/AdminRutaProtegida.tsx

import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRutaProtegida() {
    const adminToken = localStorage.getItem('admin_token');

    if (!adminToken) {
        // Si no hay token, redirige a /admin (login)
        return <Navigate to="/admin" replace />;
    }

    // Si hay token, muestra el AdminLayout (que contiene el Outlet)
    return <Outlet />;
}