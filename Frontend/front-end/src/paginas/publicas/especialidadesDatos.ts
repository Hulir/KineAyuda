// src/paginas/publicas/especialidadesDatos.ts

export type Especialidad = {
    id: string;               // slug que usamos en rutas y en el front
    nombre: string;
    descripcionCorta: string;
    descripcionLarga: string;
    procedimientos: string[];
    beneficios: string[];
};

export const ESPECIALIDADES: Especialidad[] = [
    {
        id: "kinesiologia-deportiva",
        nombre: "Kinesiología Deportiva",
        descripcionCorta: "Prevención y recuperación de lesiones asociadas al deporte.",
        descripcionLarga:
            "La kinesiología deportiva se centra en la evaluación, prevención y recuperación de lesiones musculoesqueléticas en personas físicamente activas y deportistas. Busca optimizar el rendimiento y reducir el riesgo de recaídas.",
        procedimientos: [
            "Evaluación funcional y biomecánica",
            "Plan de ejercicios terapéuticos",
            "Readaptación al gesto deportivo",
            "Vendajes funcionales",
        ],
        beneficios: [
            "Retorno seguro y progresivo al deporte",
            "Disminución del dolor y la inflamación",
            "Prevención de nuevas lesiones",
            "Mejora del rendimiento físico",
        ],
    },
    {
        id: "kinesiologia-neurologica",
        nombre: "Kinesiología Neurológica",
        descripcionCorta: "Rehabilitación en lesiones del sistema nervioso central o periférico.",
        descripcionLarga:
            "La kinesiología neurológica aborda trastornos del movimiento asociados a enfermedades y lesiones neurológicas, como ACV, traumatismos encefalocraneanos, Parkinson, lesiones medulares, entre otros.",
        procedimientos: [
            "Entrenamiento de la marcha y equilibrio",
            "Ejercicios de control postural",
            "Estimulación sensoriomotora",
            "Entrenamiento de actividades de la vida diaria",
        ],
        beneficios: [
            "Mejora del equilibrio y la marcha",
            "Aumento de la independencia funcional",
            "Reducción del riesgo de caídas",
            "Mejor calidad de vida para pacientes y cuidadores",
        ],
    },
    {
        id: "kinesiologia-traumatologica",
        nombre: "Kinesiología Traumatológica",
        descripcionCorta: "Recuperación tras fracturas, cirugías y lesiones musculoesqueléticas.",
        descripcionLarga:
            "Enfocada en la rehabilitación de lesiones óseas, articulares, musculares y tendíneas, así como cirugías ortopédicas. Busca recuperar movilidad, fuerza y funcionalidad.",
        procedimientos: [
            "Movilizaciones articulares y tisulares",
            "Fortalecimiento muscular progresivo",
            "Entrenamiento propioceptivo",
            "Educación en ergonomía y autocuidado",
        ],
        beneficios: [
            "Recuperación más rápida después de una cirugía o lesión",
            "Disminución del dolor y la rigidez",
            "Mejor función articular y muscular",
            "Prevención de secuelas a largo plazo",
        ],
    },
    {
        id: "kinesiologia-respiratoria",
        nombre: "Kinesiología Respiratoria",
        descripcionCorta: "Manejo de patologías respiratorias agudas y crónicas.",
        descripcionLarga:
            "Orientada al tratamiento de enfermedades respiratorias como asma, EPOC, bronquitis crónica, fibrosis quística y secuelas respiratorias post-COVID, entre otras.",
        procedimientos: [
            "Técnicas de higiene bronquial",
            "Ejercicios de expansión torácica",
            "Entrenamiento de músculos respiratorios",
            "Educación en manejo de síntomas",
        ],
        beneficios: [
            "Mejor ventilación pulmonar",
            "Reducción de disnea y fatiga",
            "Menor número de exacerbaciones",
            "Mayor tolerancia al ejercicio",
        ],
    },
    {
        id: "kinesiologia-oncologica",
        nombre: "Kinesiología Oncológica",
        descripcionCorta: "Apoyo en las diferentes etapas del tratamiento oncológico.",
        descripcionLarga:
            "Acompaña a personas con cáncer durante y después de los tratamientos médicos, abordando dolor, fatiga, linfedema, limitaciones funcionales y condicionamiento físico.",
        procedimientos: [
            "Ejercicio terapéutico adaptado",
            "Manejo de linfedema",
            "Reeducación postural",
            "Educación y acompañamiento psico–funcional",
        ],
        beneficios: [
            "Mejor tolerancia a los tratamientos",
            "Disminución de fatiga y dolor",
            "Mayor autonomía e independencia",
            "Mejora del bienestar general",
        ],
    },
    {
        id: "piso-pelvico",
        nombre: "Kinesiología de Piso Pélvico",
        descripcionCorta: "Tratamiento de disfunciones urinarias, fecales y sexuales.",
        descripcionLarga:
            "Aborda alteraciones musculares del piso pélvico en mujeres y hombres, como incontinencia, prolapsos, dolor pélvico crónico y disfunciones sexuales.",
        procedimientos: [
            "Ejercicios de fortalecimiento y relajación del piso pélvico",
            "Biofeedback y electroestimulación (según equipo disponible)",
            "Educación en hábitos miccionales y defecatorios",
            "Trabajo postural y respiratorio asociado",
        ],
        beneficios: [
            "Disminución de episodios de incontinencia",
            "Mejor control y conciencia corporal",
            "Reducción del dolor pélvico",
            "Mejora en la calidad de vida íntima",
        ],
    },
    {
        id: "neonatologia",
        nombre: "Kinesiología en Neonatología y Pediatría",
        descripcionCorta: "Apoyo al desarrollo motor y respiratorio en bebés y niños.",
        descripcionLarga:
            "Se enfoca en el desarrollo psicomotor y la función respiratoria de recién nacidos y niños, especialmente en contextos de prematurez o patologías respiratorias.",
        procedimientos: [
            "Estimulación temprana",
            "Kinesioterapia respiratoria pediátrica",
            "Orientación a padres y cuidadores",
            "Seguimiento del desarrollo motor",
        ],
        beneficios: [
            "Mejor desarrollo psicomotor",
            "Reducción de complicaciones respiratorias",
            "Mayor información y seguridad para la familia",
            "Intervenciones oportunas ante alteraciones del desarrollo",
        ],
    },
    {
        id: "dermatofuncional",
        nombre: "Kinesiología Dermatofuncional",
        descripcionCorta: "Tratamiento de alteraciones estéticas y cicatriciales.",
        descripcionLarga:
            "Área que interviene en procesos de cicatrización, edemas, fibrosis y trastornos estéticos asociados a la piel y tejido subcutáneo.",
        procedimientos: [
            "Drenaje linfático manual",
            "Tratamiento de cicatrices y fibrosis",
            "Masoterapia y técnicas manuales específicas",
            "Ejercicio terapéutico complementario",
        ],
        beneficios: [
            "Mejor aspecto y funcionalidad de la piel",
            "Disminución de edema y fibrosis",
            "Mayor confort y autoestima",
            "Prevención de complicaciones futuras",
        ],
    },
    {
        id: "kinesiologia-cardiorrespiratoria",
        nombre: "Kinesiología Cardiorrespiratoria",
        descripcionCorta: "Rehabilitación en patologías cardiacas y respiratorias complejas.",
        descripcionLarga:
            "Interviene en pacientes con insuficiencia cardiaca, post–cirugía cardiaca, coronariopatías y patología respiratoria avanzada, con énfasis en el ejercicio seguro.",
        procedimientos: [
            "Entrenamiento aeróbico monitorizado",
            "Fortalecimiento muscular periférico",
            "Educación en factores de riesgo cardiovascular",
            "Manejo de la disnea y la fatiga",
        ],
        beneficios: [
            "Mejor tolerancia al esfuerzo",
            "Reducción de síntomas cardiovasculares y respiratorios",
            "Mayor independencia para las actividades cotidianas",
            "Mejor pronóstico funcional",
        ],
    },
    {
        id: "kinesiologia-geriatrica",
        nombre: "Kinesiología Geriátrica",
        descripcionCorta: "Enfoque en personas mayores y fragilidad.",
        descripcionLarga:
            "Atiende a personas mayores con foco en la prevención de caídas, mantenimiento de la autonomía y manejo de condiciones crónicas asociadas al envejecimiento.",
        procedimientos: [
            "Entrenamiento de fuerza y equilibrio",
            "Plan de ejercicio funcional",
            "Educación sobre prevención de caídas",
            "Entrenamiento de la marcha",
        ],
        beneficios: [
            "Mayor independencia y seguridad",
            "Disminución del riesgo de caídas",
            "Mejor estado físico general",
            "Mejora de la calidad de vida",
        ],
    },
    {
        id: "quiropraxia",
        nombre: "Quiropraxia / Terapia Manual",
        descripcionCorta: "Manejo manual de columna y articulaciones.",
        descripcionLarga:
            "Utiliza técnicas manuales específicas para el manejo del dolor y la disfunción articular y muscular, especialmente a nivel de columna vertebral.",
        procedimientos: [
            "Técnicas de terapia manual",
            "Movilizaciones y manipulaciones articulares (según formación)",
            "Estiramientos y liberación miofascial",
            "Ejercicios de estabilización y control motor",
        ],
        beneficios: [
            "Alivio del dolor musculoesquelético",
            "Mejora de la movilidad articular",
            "Mayor sensación de bienestar físico",
            "Complemento a la terapia kinesiológica integral",
        ],
    },
    {
        id: "otra",
        nombre: "Otra Especialidad",
        descripcionCorta: "Otras áreas específicas de la kinesiología.",
        descripcionLarga:
            "Corresponde a otras subespecialidades o enfoques específicos que puedan no estar listados, pero que el profesional desarrolla en su práctica clínica.",
        procedimientos: [
            "Evaluación personalizada según el motivo de consulta",
            "Intervenciones específicas según el área",
            "Educación y acompañamiento individual",
        ],
        beneficios: [
            "Abordaje adaptado a necesidades particulares",
            "Mayor flexibilidad terapéutica",
            "Posibilidad de integrar distintas áreas de la kinesiología",
        ],
    },
];

// Helper para buscar por id (usado en EspecialidadDetalle, etc.)
export function getEspecialidadPorId(id: string) {
    return ESPECIALIDADES.find((e) => e.id === id);
}
