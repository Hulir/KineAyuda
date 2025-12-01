// Ubicación: src/paginas/admin/AdminDashboard.tsx

import { motion } from "framer-motion";
// --- CORRECCIÓN: Los iconos se importan en una sola línea ---
import {
    FaUserCheck,
    FaUserClock,
    FaUsers,
    FaFileInvoiceDollar,
    FaBell
} from "react-icons/fa";

// --- DATOS SIMULADOS (MOCK) ---
// TODO: Estos datos vendrán de tu API (ej. /api/admin/stats)
const stats = {
    pendientes: 3,
    activos: 45,
    pacientes: 120,
    ingresosMes: 449550, // 45 * 9990 (ejemplo)
};

// TODO: Estos datos vendrán de tu API (ej. /api/admin/notificaciones)
const notificaciones = [
    { id: 1, tipo: "verificacion", texto: "Diego López ha enviado sus documentos para verificación.", tiempo: "hace 5 min" },
    { id: 2, tipo: "pago", texto: "Se recibió un pago exitoso de $99.990 (Anual) de María González.", tiempo: "hace 1 hora" },
    { id: 3, tipo: "verificacion", texto: "Camila Fernández ha enviado sus documentos para verificación.", tiempo: "hace 3 horas" },
    { id: 4, tipo: "error", texto: "Falló un intento de pago (Mensual) de un usuario.", tiempo: "hace 4 horas" },
];
// --- FIN DE DATOS SIMULADOS ---


// --- CORRECCIÓN: Añadidos tipos a los props del componente ---
const StatCard = ({ icon, titulo, valor, color }: { icon: React.ReactNode, titulo: string, valor: string | number, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60 flex items-center gap-4"
    >
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-slate-600">{titulo}</p>
            <p className="text-3xl font-bold text-slate-900">{valor}</p>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    return (
        // Este div usa el fondo de tu index.css
        <div>

            {/* Título */}
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900">
                    Panel de Administración
                </h1>
                <p className="text-lg text-slate-600">Bienvenido, Admin.</p>
            </header>

            {/* 1. Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    icon={<FaUserClock className="text-white text-2xl" />}
                    titulo="Kinesiólogos Pendientes"
                    valor={stats.pendientes}
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={<FaUserCheck className="text-white text-2xl" />}
                    titulo="Kinesiólogos Activos"
                    valor={stats.activos}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<FaFileInvoiceDollar className="text-white text-2xl" />}
                    titulo="Ingresos del Mes (CLP)"
                    valor={`$${stats.ingresosMes.toLocaleString('es-CL')}`}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<FaUsers className="text-white text-2xl" />}
                    titulo="Pacientes Registrados"
                    valor={stats.pacientes}
                    color="bg-purple-500"
                />
            </div>

            {/* 2. Notificaciones y Tareas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Columna de Notificaciones */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Actividad Reciente
                    </h2>
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60">
                        <ul className="space-y-4">
                            {notificaciones.map(notif => (
                                <li key={notif.id} className="flex items-start gap-3 pb-4 border-b border-slate-200 last:border-b-0">
                                    <div className="p-3 bg-indigo-100 rounded-full mt-1">
                                        <FaBell className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-800">{notif.texto}</p>
                                        <p className="text-xs text-slate-500">{notif.tiempo}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Gráfico de Crecimiento
                    </h2>
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60 h-80 flex items-center justify-center">
                        <p className="text-slate-500">(Aquí iría un gráfico de nuevos usuarios)</p>
                    </div>
                </section>

            </div>
        </div>
    );
}