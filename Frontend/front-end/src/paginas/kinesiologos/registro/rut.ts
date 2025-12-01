// src/paginas/kinesiologos/registro/rut.ts

// Valida un RUT tipo "12345678-9" o con puntos, devuelve true/false
export function validarRut(rut: string): boolean {
    if (!rut) return false;

    let limpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (limpio.length < 8) return false;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resto = suma % 11;
    const calculo = 11 - resto;

    let dvEsperado: string;
    if (calculo === 11) dvEsperado = "0";
    else if (calculo === 10) dvEsperado = "K";
    else dvEsperado = String(calculo);

    return dv === dvEsperado;
}

// Formatea a "12.345.678-9" sólo para mostrar en el input
export function formatearRut(rut: string): string {
    let limpio = rut.replace(/[^\dkK]/g, "").toUpperCase();
    if (limpio.length <= 1) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let cuerpoConPuntos = "";
    let i = cuerpo.length;

    while (i > 3) {
        cuerpoConPuntos =
            "." + cuerpo.slice(i - 3, i) + cuerpoConPuntos;
        i -= 3;
    }
    cuerpoConPuntos = cuerpo.slice(0, i) + cuerpoConPuntos;
    return `${cuerpoConPuntos}-${dv}`;
}
