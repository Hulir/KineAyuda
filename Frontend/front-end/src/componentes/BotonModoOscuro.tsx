import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function BotonModoOscuro() {
    const [modoOscuro, setModoOscuro] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        if (modoOscuro) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("tema", "oscuro");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("tema", "claro");
        }
    }, [modoOscuro]);

    useEffect(() => {
        const temaGuardado = localStorage.getItem("tema");
        if (temaGuardado === "oscuro") {
            setModoOscuro(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <button
            onClick={() => setModoOscuro(!modoOscuro)}
            className="fixed bottom-28 right-6 bg-white dark:bg-slate-800 
                       text-gray-700 dark:text-gray-100 p-3 rounded-full 
                       shadow-lg transition hover:scale-110 z-[60]"
            aria-label="Cambiar modo de color"
        >
            {modoOscuro ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
