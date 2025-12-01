import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaSearch, FaRobot } from "react-icons/fa";
import api from "../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalConsultarCita({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(e.target.value);
    setError("");
  };

  const buscarCita = async () => {
    if (!rut.trim()) {
      setError("Por favor, ingresa tu RUT");
      return;
    }
    if (!isHuman) {
      setError("Por favor, confirma que eres humano");
      return;
    }
    setBuscando(true);
    setError("");
    try {
      const response = await api.get(`/public/paciente/${rut}/citas/`);
      if (response.data.citas && response.data.citas.length > 0) {
        const primeraCita = response.data.citas[0];
        onClose();
        navigate(`/consultar-cita/${primeraCita.id}`);
      } else {
        setError("No se encontraron citas asociadas a este RUT");
      }
    } catch (err: any) {
      console.error("Error buscando citas:", err);
      if (err.response?.status === 404) {
        setError("No se encontraron citas con este RUT");
      } else {
        setError("Error al buscar. Por favor, intenta nuevamente.");
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !buscando) {
      e.preventDefault();
      buscarCita();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Consulta tu Cita</h2>
          <p className="text-slate-600 text-sm">Ingresa tu RUT para ver tus citas agendadas</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tu RUT</label>
            <input
              type="text"
              autoComplete="off"
              autoFocus
              value={rut}
              onChange={handleRutChange}
              onKeyDown={handleKeyDown}
              placeholder="12.345.678-9"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
              disabled={buscando}
              maxLength={12}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              id="captcha"
              checked={isHuman}
              onChange={(e) => setIsHuman(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              disabled={buscando}
            />
            <label htmlFor="captcha" className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <FaRobot className="text-slate-500" />
              <span>No soy un robot</span>
            </label>
          </div>

          <button
            onClick={buscarCita}
            disabled={buscando}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {buscando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Buscando...
              </>
            ) : (
              <>
                <FaSearch />
                Buscar Mi Cita
              </>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Ingresa tu RUT en el formato 12.345.678-9. Si tienes varias citas, te mostraremos la
            más reciente.
          </p>
        </div>
      </div>
    </div>
  );
}
