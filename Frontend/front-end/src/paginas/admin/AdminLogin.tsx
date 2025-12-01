// Ubicación: src/paginas/admin/AdminLogin.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoKine from "@/assets/img/logo.png"; // Usamos el alias @

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Si ya tiene token, lo redirige directo al dashboard
    useEffect(() => {
        if (localStorage.getItem('admin_token')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // --- TODO: Lógica de autenticación de Admin ---
        // Simulación de login exitoso:
        if (email === 'admin@kineayuda.cl' && password === 'admin123') {
            localStorage.setItem('admin_token', 'true'); // Token de admin simulado
            navigate('/admin/dashboard'); // Redirige al dashboard
        } else {
            setError('Credenciales de administrador incorrectas.');
        }
    };

    return (
        // Esta página SÍ usa el fondo claro de index.css
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 flex flex-col items-center"
            >
                <img src={logoKine} alt="KineAyuda" className="w-20 h-20 mb-4" />
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Acceso Administrador
                </h1>
                <p className="text-slate-600">Gestión de KineAyuda</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleLogin}
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/60 w-full max-w-sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1" // Usa estilo global de index.css
                            placeholder="admin@kineayuda.cl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg mt-6"
                >
                    Ingresar
                </button>
            </motion.form>
        </div>
    );
}