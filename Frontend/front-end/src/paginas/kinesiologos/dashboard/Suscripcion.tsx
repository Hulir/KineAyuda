// src/paginas/kinesiologos/dashboard/Suscripcion.tsx
import { useEffect, useState } from "react";
import {
  obtenerEstadoSuscripcion,
  iniciarSuscripcionWebpay,
  type EstadoSuscripcion,
} from "../../../services/suscripcionService";

const MONTO_SUSCRIPCION = 15000; // CLP

export default function Suscripcion() {
  const [estado, setEstado] = useState<EstadoSuscripcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarEstado() {
      try {
        const data = await obtenerEstadoSuscripcion();
        setEstado(data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "No se pudo cargar el estado de suscripción.");
      } finally {
        setLoading(false);
      }
    }
    cargarEstado();
  }, []);

  const manejarPago = async () => {
    setError(null);
    setProcesandoPago(true);
    try {
      const resp = await iniciarSuscripcionWebpay(MONTO_SUSCRIPCION);
      // resp: { url, token, ... }
      const form = document.createElement("form");
      form.method = "POST";
      form.action = resp.url;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = resp.token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setError(err?.response?.data?.error || "No se pudo iniciar el pago.");
      setProcesandoPago(false);
    }
  };

  const formatoFecha = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return <p className="text-gray-600">Cargando estado de suscripción...</p>;
  }

  const activa = estado?.activa;
  const vence = formatoFecha(estado?.vence);

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-3">Suscripción</h1>
      <p className="text-sm text-gray-600 mb-4">
        Tu suscripción habilita la agenda y cobro de tus citas.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Estado</span>
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              activa ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {activa ? "Activa" : "Pendiente"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Vence</span>
          <span className="text-sm font-medium text-slate-800">{vence}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Monto</span>
          <span className="text-lg font-bold text-indigo-700">
            ${MONTO_SUSCRIPCION.toLocaleString("es-CL")}
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={manejarPago}
          disabled={procesandoPago}
          className="px-5 py-3 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 disabled:opacity-60"
        >
          {procesandoPago
            ? "Redirigiendo a Webpay..."
            : activa
            ? "Renovar suscripción"
            : "Pagar suscripción"}
        </button>
      </div>
    </div>
  );
}
