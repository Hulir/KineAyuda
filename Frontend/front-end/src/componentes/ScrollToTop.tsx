// src/componentes/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente global que hace scroll to top cuando cambia la ruta
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll instantáneo al inicio
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // Para Safari
    }, [pathname]);

    return null;
}
