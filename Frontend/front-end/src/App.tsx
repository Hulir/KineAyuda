// Ubicación: src/App.tsx

import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HeaderPrincipal from "./componentes/HeaderPrincipal";
import Footer from "./componentes/Footer";
import ChatSoporte from "./componentes/ChatSoporte";
import ScrollToTop from "./componentes/ScrollToTop";
import { rutas } from "./rutas/Routes";
import TestConexion from "./TestConexion";
import RutaKinesiologoVerificado from "./rutas/RutaKinesiologoVerificado"; // Ruta con verificación de estado

// --- Páginas (Lazy Loading) ---
const Inicio = lazy(() => import("./paginas/publicas/Inicio"));
const Contacto = lazy(() => import("./paginas/publicas/Contacto"));
const Nosotros = lazy(() => import("./paginas/publicas/Nosotros"));
const Especialidades = lazy(() => import("./paginas/publicas/Especialidades"));
const EspecialidadDetalle = lazy(() => import("./paginas/publicas/EspecialidadDetalle"));
const PaginaNoEncontrada = lazy(() => import("./paginas/error/PaginaNoEncontrada"));
const ReservaCitas = lazy(() => import("./paginas/pacientes/ReservaCitas"));
const PagoCitaExitoso = lazy(() => import("./paginas/pacientes/PagoCitaExitoso"));
const ConsultarCita = lazy(() => import("./paginas/pacientes/ConsultarCita"));

// Kinesiólogos
const Kinesiologo = lazy(() => import("./paginas/kinesiologos/Kinesiologo"));
const LoginFormKine = lazy(() => import("./paginas/kinesiologos/LoginFormKine"));
const RegistroKine = lazy(() => import("./paginas/kinesiologos/registro/RegistroKine"));
const VerificacionPendiente = lazy(() => import("./paginas/kinesiologos/VerificacionPendiente"));
const AprobacionPendiente = lazy(() => import("./paginas/kinesiologos/AprobacionPendiente"));
const SuscripcionVencida = lazy(() => import("./paginas/kinesiologos/SuscripcionVencida"));
const BienvenidaVerificado = lazy(() => import("./paginas/kinesiologos/BienvenidaVerificado"));
const SuscripcionPago = lazy(() => import("./paginas/kinesiologos/SuscripcionPago"));
const PagoExitoso = lazy(() => import("./paginas/kinesiologos/PagoExitoso"));
const DashboardLayout = lazy(() => import("./paginas/kinesiologos/dashboard/DashboardLayout"));

// Vistas internas del panel del kinesiólogo
const DashboardInicio = lazy(() => import("./paginas/kinesiologos/dashboard/DashboardInicio"));
const Perfil = lazy(() => import("./paginas/kinesiologos/dashboard/Perfil"));
const Agenda = lazy(() => import("./paginas/kinesiologos/dashboard/Agenda"));
const Citas = lazy(() => import("./paginas/kinesiologos/dashboard/Citas"));
const Resenas = lazy(() => import("./paginas/kinesiologos/dashboard/Resenas"));
const Suscripcion = lazy(() => import("./paginas/kinesiologos/dashboard/Suscripcion"));

// Admin
const AdminLogin = lazy(() => import("./paginas/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./paginas/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./paginas/admin/AdminDashboard"));
const AdminVerificaciones = lazy(() => import("./paginas/admin/AdminVerificaciones"));
const AdminRutaProtegida = lazy(() => import("./paginas/admin/AdminRutaProtegida"));

// ===============================================================
// 🧱 COMPONENTE LAYOUT MANAGER
// ===============================================================
const LayoutManager = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPanelKine = location.pathname.startsWith("/panel-kine");

  // 👇 LÍNEA AÑADIDA
  // Comprueba si la ruta actual es la de reserva
  const isReservaRoute = location.pathname.startsWith(rutas.reserva);

  // 👇 LÍNEA MODIFICADA
  // Añadimos 'isReservaRoute' para quitar el padding superior en esa página
  const mainPadding = (isAdminRoute || isPanelKine || isReservaRoute)
    ? ""
    : "pt-24 md:pt-28";

  return (
    <div className="min-h-screen flex flex-col bg-kineayuda-light text-gray-900 dark:text-gray-100 transition-colors duration-500">

      {/* 👇 LÍNEA MODIFICADA
          Añadimos '!isReservaRoute' para que el Header no se muestre
      */}
      {!isAdminRoute && !isPanelKine && !isReservaRoute && <HeaderPrincipal />}

      <main className={`flex-1 overflow-y-auto ${mainPadding}`}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          }
        >
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route index element={<Inicio />} />
            <Route path={rutas.inicio} element={<Inicio />} />
            <Route path={rutas.contacto} element={<Contacto />} />
            <Route path={rutas.nosotros} element={<Nosotros />} />
            <Route path={rutas.especialidades} element={<Especialidades />} />
            <Route path={rutas.especialidadDetalle} element={<EspecialidadDetalle />} />
            <Route path="/kinesiologo" element={<Kinesiologo />} />
            <Route path="/kinesiologo/login" element={<LoginFormKine />} />
            <Route path="/kinesiologo/registro" element={<RegistroKine />} />
            <Route path="/kinesiologo/verificacion-pendiente" element={<VerificacionPendiente />} />
            <Route path="/kinesiologo/aprobacion-pendiente" element={<AprobacionPendiente />} />
            <Route path="/kinesiologo/bienvenida-verificado" element={<BienvenidaVerificado />} />
            <Route path="/kinesiologo/suscripcion-vencida" element={<SuscripcionVencida />} />
            <Route path="/kinesiologo/suscripcion-pago" element={<SuscripcionPago />} />
            <Route path={rutas.pagoExitoso} element={<PagoExitoso />} />
            <Route path="/pago-cita-exitoso" element={<PagoCitaExitoso />} />
            <Route path={rutas.reserva} element={<ReservaCitas />} />
            <Route path="/reserva-cita" element={<ReservaCitas />} />
            <Route path={rutas.consultarCita} element={<ConsultarCita />} />
            <Route path={rutas.loginKine} element={<LoginFormKine />} />
            <Route path="/test" element={<TestConexion />} />

            {/* --- PANEL DEL KINESIÓLOGO (Protegido y verificado) --- */}
            <Route
              path="/panel-kine"
              element={
                <RutaKinesiologoVerificado>
                  <DashboardLayout />
                </RutaKinesiologoVerificado>
              }
            >
              <Route index element={<DashboardInicio />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="citas" element={<Citas />} />
              <Route path="resenas" element={<Resenas />} />
              <Route path="suscripcion" element={<Suscripcion />} />
            </Route>

            {/* --- ADMIN --- */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<AdminRutaProtegida />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="verificaciones" element={<AdminVerificaciones />} />
              </Route>
            </Route>

            {/* --- 404 --- */}
            <Route path="*" element={<PaginaNoEncontrada />} />
          </Routes>
        </Suspense>
      </main>

      {/* 👇 LÍNEA MODIFICADA
          Añadimos '!isReservaRoute' para que el Footer no se muestre
      */}
      {!isAdminRoute && !isPanelKine && !isReservaRoute && <Footer />}
    </div>
  );
};

// ===============================================================
// 🚀 COMPONENTE APP PRINCIPAL
// ===============================================================
export default function App() {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const tema = localStorage.getItem("tema");
    if (tema === "oscuro") {
      setModoOscuro(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "oscuro");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "claro");
    }
  }, [modoOscuro]);

  return (
    <Router>
      <ScrollToTop />
      <LayoutManager />

      {/* Elementos globales flotantes */}
      <ChatSoporte />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#1f2937", color: "#fff", borderRadius: "8px" },
        }}
      />
    </Router>
  );
}