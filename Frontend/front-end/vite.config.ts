import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Cargar variables del archivo .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    // Configuración del servidor de desarrollo
    server: {
      port: 5173, // puerto por defecto de Vite
      open: true, // abre el navegador al ejecutar npm run dev
      cors: true, // habilita CORS globalmente
      proxy: {
        // Redirige automáticamente llamadas a /api → backend Django
        "/api": {
          target: env.VITE_API_URL || "http://127.0.0.1:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
