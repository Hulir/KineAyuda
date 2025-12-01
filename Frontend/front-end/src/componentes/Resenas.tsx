import { FaStar } from "react-icons/fa";

export default function Resenas({ reseñas, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-cyan-100 p-8 rounded-2xl shadow-2xl max-w-3xl w-full mx-6">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Opiniones de nuestros pacientes
        </h2>
        <div className="grid gap-6 max-h-[60vh] overflow-y-auto">
          {reseñas.map((r: any, i: number) => (
            <div key={i} className="bg-white/80 p-4 rounded-xl shadow-sm border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 text-yellow-400">
                {[...Array(r.estrellas)].map((_, j) => (
                  <FaStar key={j} />
                ))}
              </div>
              <p className="text-gray-800 italic">{r.comentario}</p>
              <p className="text-sm text-gray-600 mt-2">— {r.nombre}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
