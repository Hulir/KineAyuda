import { motion } from "framer-motion";

interface Props {
    texto: string;
}

export default function TituloSeccion({ texto }: Props) {
    return (
        <div className="relative flex items-center justify-center h-48 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-blue-400/40 rounded-b-[25px]">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg"
            >
                <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block"
                >
                    {texto}
                </motion.span>
            </motion.h1>
        </div>
    );
}
