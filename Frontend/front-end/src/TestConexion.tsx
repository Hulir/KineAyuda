import { useEffect, useState } from "react";
import api from "@/services/api";
import { CheckCircle, XCircle } from "lucide-react";

export default function TestConexion() {
  const [estado, setEstado] = useState<"ok" | "error" | "cargando">("cargando");

  useEffect(() => {
    const probarConexion = async () => {
      try {
        const res = await api.get("/test/");
        if (res.status === 200) {
          setEstado("ok");
        } else {
          setEstado("error");
        }
      } catch (error) {
        console.error("❌ Error al conectar:", error);
        setEstado("error");
      }
    };

    probarConexion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f19] text-white">
      <h1 className="text-3xl font-bold mb-6">Test de conexión</h1>

      {estado === "cargando" && (
        <p className="text-gray-400 animate-pulse">Conectando...</p>
      )}

      {estado === "ok" && (
        <div className="flex items-center space-x-2 text-green-400 text-xl">
          <CheckCircle className="w-6 h-6" />
          <p>Conexión exitosa con el backend Django 🎉</p>
        </div>
      )}

      {estado === "error" && (
        <div className="flex items-center space-x-2 text-red-400 text-xl">
          <XCircle className="w-6 h-6" />
          <p>Error al conectar con el backend</p>
        </div>
      )}
    </div>
  );
}
