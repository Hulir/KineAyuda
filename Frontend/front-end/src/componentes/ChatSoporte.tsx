// src/componentes/ChatSoporte.tsx
import { FaWhatsapp } from "react-icons/fa";

export default function ChatSoporte() {
    const whatsappNumber = "+56912345678"; // Reemplazar con el número real de KineAyuda
    const whatsappMessage = "Hola, necesito ayuda con KineAyuda";

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
            title="Contactar por WhatsApp"
        >
            <FaWhatsapp className="w-8 h-8" />
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ¿Necesitas ayuda?
            </span>
        </button>
    );
}
