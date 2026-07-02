// ============================================================
// TROPHIES_1000.ts — 1000 Trofeos Ejecutivos OnixLingo
// ============================================================

export interface TrophyItem {
  id: string;
  name: string;
  category: 'simulators' | 'discipline' | 'english' | 'french' | 'chinese' | 'vocabulary' | 'chess' | 'executive' | 'eloquence' | 'legendary';
  description: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Obsidian';
}

// ── CATEGORY 1: SIMULADORES DE EXÁMENES (t_001–t_120) ── 120 trofeos
const SIMULADORES: TrophyItem[] = [
  { id:'t_001', name:'Pionero TOEIC', category:'simulators', description:'Completa tu primera sección de TOEIC Listening.', points:150, tier:'Bronze' },
  { id:'t_002', name:'Analista TOEIC Reading', category:'simulators', description:'Finaliza una sesión de TOEIC Reading en tiempo intermedio.', points:200, tier:'Silver' },
  { id:'t_003', name:'Score de Élite TOEIC', category:'simulators', description:'Obtén la puntuación máxima 990 en el simulador TOEIC completo.', points:500, tier:'Platinum' },
  { id:'t_004', name:'Contrarreloj TOEIC', category:'simulators', description:'Completa el TOEIC completo en Modo Avanzado (5 minutos).', points:350, tier:'Obsidian' },
  { id:'t_005', name:'TOEIC Listening Perfecto', category:'simulators', description:'Logra un 100% de aciertos en la sección de Listening del TOEIC.', points:300, tier:'Gold' },
  { id:'t_006', name:'TOEIC Reading Perfecto', category:'simulators', description:'Logra un 100% de aciertos en la sección de Reading del TOEIC.', points:300, tier:'Gold' },
  { id:'t_007', name:'TOEIC Doble Perfecto', category:'simulators', description:'Obtén 100% en Listening y Reading del TOEIC en la misma sesión.', points:600, tier:'Obsidian' },
  { id:'t_008', name:'Maratón TOEIC', category:'simulators', description:'Completa 5 sesiones completas del simulador TOEIC.', points:250, tier:'Silver' },
  { id:'t_009', name:'TOEIC Centurión', category:'simulators', description:'Acumula 100 sesiones de práctica TOEIC en total.', points:800, tier:'Obsidian' },
  { id:'t_010', name:'Analista de Partes TOEIC', category:'simulators', description:'Completa todas las partes individuales del TOEIC al menos una vez.', points:200, tier:'Silver' },
  { id:'t_011', name:'Estratega TOEFL', category:'simulators', description:'Completa el simulador TOEFL iBT por primera vez.', points:150, tier:'Bronze' },
  { id:'t_012', name:'Score Centenario TOEFL', category:'simulators', description:'Logra más de 100 puntos en el simulador TOEFL completo.', points:400, tier:'Gold' },
  { id:'t_013', name:'Score Élite TOEFL', category:'simulators', description:'Logra más de 110 puntos en el simulador TOEFL.', points:500, tier:'Platinum' },
  { id:'t_014', name:'TOEFL Rápido', category:'simulators', description:'Completa el TOEFL en Modo Intermedio (10 minutos).', points:300, tier:'Obsidian' },
  { id:'t_015', name:'TOEFL Speaking Maestro', category:'simulators', description:'Completa la sección Speaking del TOEFL con puntuación máxima.', points:350, tier:'Gold' },
  { id:'t_016', name:'TOEFL Writing Ejecutivo', category:'simulators', description:'Completa la sección Writing del TOEFL con puntuación máxima.', points:350, tier:'Gold' },
  { id:'t_017', name:'TOEFL Listening Élite', category:'simulators', description:'Logra puntuación perfecta en Listening del TOEFL.', points:350, tier:'Gold' },
  { id:'t_018', name:'TOEFL Reading Analítico', category:'simulators', description:'Logra puntuación perfecta en Reading del TOEFL.', points:350, tier:'Gold' },
  { id:'t_019', name:'Maratón TOEFL', category:'simulators', description:'Completa 5 sesiones completas del simulador TOEFL.', points:250, tier:'Silver' },
  { id:'t_020', name:'TOEFL Centurión', category:'simulators', description:'Acumula 50 sesiones de práctica TOEFL en total.', points:600, tier:'Obsidian' },
  { id:'t_021', name:'Académico IELTS', category:'simulators', description:'Finaliza el simulador de examen IELTS Academic.', points:200, tier:'Silver' },
  { id:'t_022', name:'Banda 7 IELTS', category:'simulators', description:'Consigue Band Score 7.0 o superior en el examen IELTS.', points:350, tier:'Gold' },
  { id:'t_023', name:'Banda de Honor IELTS', category:'simulators', description:'Consigue Band Score 8.5 o superior en el examen IELTS.', points:500, tier:'Platinum' },
  { id:'t_024', name:'IELTS Banda 9 Legendario', category:'simulators', description:'Logra la puntuación perfecta Band 9 en el simulador IELTS.', points:800, tier:'Obsidian' },
  { id:'t_025', name:'Maestría en Epigenética', category:'simulators', description:'Responde correctamente todas las preguntas de la lectura científica.', points:250, tier:'Gold' },
  { id:'t_026', name:'Granja Solar', category:'simulators', description:'Responde perfectamente la sección de audición de la granja solar.', points:250, tier:'Gold' },
  { id:'t_027', name:'Banda Dorada IELTS', category:'simulators', description:'Alcanza el equivalente C1/C2 en el simulador IELTS.', points:450, tier:'Obsidian' },
  { id:'t_028', name:'IELTS Writing Académico', category:'simulators', description:'Completa la tarea de escritura académica IELTS con Band 7+.', points:300, tier:'Gold' },
  { id:'t_029', name:'IELTS Speaking Fluido', category:'simulators', description:'Completa el Speaking IELTS con Band 7+.', points:300, tier:'Gold' },
  { id:'t_030', name:'Maratón IELTS', category:'simulators', description:'Completa 5 sesiones completas del simulador IELTS.', points:250, tier:'Silver' },
  { id:'t_031', name:'Iniciado DELF A1', category:'simulators', description:'Completa tu primer simulacro del examen DELF A1 en francés.', points:100, tier:'Bronze' },
  { id:'t_032', name:'DELF A2 Aprobado', category:'simulators', description:'Logra una puntuación aprobatoria en el simulacro DELF A2.', points:150, tier:'Bronze' },
  { id:'t_033', name:'DELF B1 Profesional', category:'simulators', description:'Supera el simulacro DELF B1 con calificación de mérito.', points:250, tier:'Silver' },
  { id:'t_034', name:'DELF B2 Ejecutivo', category:'simulators', description:'Logra puntuación de distinción en el simulacro DELF B2.', points:400, tier:'Gold' },
  { id:'t_035', name:'DALF C1 Élite', category:'simulators', description:'Completa el simulacro DALF C1 con puntuación alta.', points:500, tier:'Platinum' },
  { id:'t_036', name:'DALF C2 Maestro', category:'simulators', description:'Logra la puntuación máxima en el simulacro DALF C2.', points:700, tier:'Obsidian' },
  { id:'t_037', name:'HSK 1 Iniciado', category:'simulators', description:'Completa tu primer simulacro del examen HSK 1.', points:100, tier:'Bronze' },
  { id:'t_038', name:'HSK 2 Básico', category:'simulators', description:'Aprueba el simulacro del examen HSK 2.', points:150, tier:'Bronze' },
  { id:'t_039', name:'HSK 3 Intermedio', category:'simulators', description:'Supera el simulacro del examen HSK 3 con distinción.', points:250, tier:'Silver' },
  { id:'t_040', name:'HSK 4 Avanzado', category:'simulators', description:'Logra calificación alta en el simulacro HSK 4.', points:350, tier:'Gold' },
  { id:'t_041', name:'HSK 5 Profesional', category:'simulators', description:'Completa el simulacro HSK 5 con puntuación de élite.', points:500, tier:'Platinum' },
  { id:'t_042', name:'HSK 6 Maestro', category:'simulators', description:'Logra la puntuación máxima en el simulacro HSK 6.', points:700, tier:'Obsidian' },
  { id:'t_043', name:'Políglota de Simuladores', category:'simulators', description:'Completa un simulacro de TOEIC, TOEFL e IELTS en la misma semana.', points:600, tier:'Obsidian' },
  { id:'t_044', name:'Maestro de Simuladores', category:'simulators', description:'Logra puntuación perfecta en al menos un simulacro de cada examen.', points:800, tier:'Obsidian' },
  { id:'t_045', name:'Velocista de Exámenes', category:'simulators', description:'Completa 3 simulacros diferentes en menos de 24 horas.', points:400, tier:'Gold' },
  { id:'t_046', name:'Analítico TOEIC 495', category:'simulators', description:'Logra 495 puntos en la sección de Listening del TOEIC.', points:450, tier:'Platinum' },
  { id:'t_047', name:'Escritor TOEIC 495', category:'simulators', description:'Logra 495 puntos en la sección de Reading del TOEIC.', points:450, tier:'Platinum' },
  { id:'t_048', name:'Examinador Profesional', category:'simulators', description:'Completa 20 sesiones de cualquier simulacro de examen.', points:300, tier:'Gold' },
  { id:'t_049', name:'Estrategia de Tiempo', category:'simulators', description:'Completa un simulacro TOEFL o IELTS sin agotar el tiempo.', points:250, tier:'Silver' },
  { id:'t_050', name:'Sin Errores Críticos', category:'simulators', description:'Completa una sección de simulacro sin errores en preguntas clave.', points:200, tier:'Silver' },
  { id:'t_051', name:'Orador TOEFL IBT', category:'simulators', description:'Completa todas las tareas de Speaking del TOEFL iBT.', points:300, tier:'Gold' },
  { id:'t_052', name:'Escritor Integrado TOEFL', category:'simulators', description:'Completa la tarea de escritura integrada del TOEFL.', points:300, tier:'Gold' },
  { id:'t_053', name:'Comprensión IELTS General', category:'simulators', description:'Completa el módulo IELTS General Training por primera vez.', points:200, tier:'Silver' },
  { id:'t_054', name:'Velocista IELTS', category:'simulators', description:'Completa el IELTS completo en menos de 45 minutos simulados.', points:350, tier:'Obsidian' },
  { id:'t_055', name:'Análisis de Gráficos IELTS', category:'simulators', description:'Completa la tarea de descripción de gráficos del IELTS Writing.', points:250, tier:'Gold' },
  { id:'t_056', name:'Oyente Experto TOEFL', category:'simulators', description:'Completa 10 pasajes de Listening del TOEFL sin errores.', points:350, tier:'Gold' },
  { id:'t_057', name:'Lector Rápido TOEIC', category:'simulators', description:'Completa la sección de Reading del TOEIC con 10 minutos de sobra.', points:300, tier:'Gold' },
  { id:'t_058', name:'Maratón de Exámenes', category:'simulators', description:'Completa 3 simulacros completos diferentes en una semana.', points:500, tier:'Platinum' },
  { id:'t_059', name:'Consistencia de Práctica', category:'simulators', description:'Practica simulacros durante 7 días consecutivos.', points:300, tier:'Gold' },
  { id:'t_060', name:'Dominio Total', category:'simulators', description:'Obtén puntuación A en todas las secciones de un simulacro completo.', points:600, tier:'Obsidian' },
  { id:'t_061', name:'TOEIC Business Part 3', category:'simulators', description:'Completa perfectamente la Parte 3 de Conversaciones del TOEIC.', points:200, tier:'Silver' },
  { id:'t_062', name:'TOEIC Business Part 4', category:'simulators', description:'Completa perfectamente la Parte 4 de Monólogos del TOEIC.', points:200, tier:'Silver' },
  { id:'t_063', name:'TOEIC Part 5 Gramático', category:'simulators', description:'Completa perfectamente la Parte 5 de Gramática del TOEIC.', points:200, tier:'Silver' },
  { id:'t_064', name:'TOEIC Part 6 Textos', category:'simulators', description:'Completa perfectamente la Parte 6 de Textos Incompletos del TOEIC.', points:200, tier:'Silver' },
  { id:'t_065', name:'TOEIC Part 7 Lectura', category:'simulators', description:'Completa perfectamente la Parte 7 de Comprensión Lectora del TOEIC.', points:200, tier:'Silver' },
  { id:'t_066', name:'Vocabulario de Examen', category:'simulators', description:'Aprende 500 palabras clave de vocabulario de exámenes internacionales.', points:300, tier:'Gold' },
  { id:'t_067', name:'Gramática de Examen', category:'simulators', description:'Domina los 50 puntos gramaticales más frecuentes en exámenes internacionales.', points:350, tier:'Gold' },
  { id:'t_068', name:'Patrón de Preguntas', category:'simulators', description:'Identifica correctamente el patrón de 20 tipos de preguntas de examen.', points:250, tier:'Silver' },
  { id:'t_069', name:'TOEFL Integrated Task', category:'simulators', description:'Logra puntuación de 5/5 en la tarea integrada del TOEFL.', points:400, tier:'Gold' },
  { id:'t_070', name:'TOEFL Independent Task', category:'simulators', description:'Logra puntuación de 5/5 en la tarea independiente del TOEFL.', points:400, tier:'Gold' },
  { id:'t_071', name:'IELTS Task 1 Experto', category:'simulators', description:'Logra Band 8 en la Tarea 1 del Writing IELTS.', points:400, tier:'Gold' },
  { id:'t_072', name:'IELTS Task 2 Orador', category:'simulators', description:'Logra Band 8 en la Tarea 2 del Writing IELTS.', points:400, tier:'Gold' },
  { id:'t_073', name:'DELF Production Oral', category:'simulators', description:'Completa perfectamente la sección oral del DELF B2.', points:300, tier:'Gold' },
  { id:'t_074', name:'DELF Compréhension', category:'simulators', description:'Logra puntuación perfecta en comprensión del DELF B1.', points:250, tier:'Silver' },
  { id:'t_075', name:'HSK Escritura Hanzi', category:'simulators', description:'Completa la sección de escritura de caracteres del HSK 4.', points:300, tier:'Gold' },
  { id:'t_076', name:'Repaso Estratégico', category:'simulators', description:'Completa un simulacro repasando solo preguntas incorrectas previas.', points:250, tier:'Silver' },
  { id:'t_077', name:'Simulacro Nocturno', category:'simulators', description:'Completa un simulacro completo entre las 10pm y las 2am.', points:200, tier:'Silver' },
  { id:'t_078', name:'Simulacro Matutino', category:'simulators', description:'Completa un simulacro completo antes de las 8am.', points:200, tier:'Silver' },
  { id:'t_079', name:'Puntuación Perfecta Triple', category:'simulators', description:'Logra 100% en tres simulacros diferentes de examen.', points:700, tier:'Obsidian' },
  { id:'t_080', name:'Semana de Exámenes', category:'simulators', description:'Completa al menos un simulacro cada día durante 7 días seguidos.', points:400, tier:'Gold' },
  { id:'t_081', name:'Primer Simulacro Oral', category:'simulators', description:'Completa tu primera sesión de práctica oral con el simulador.', points:150, tier:'Bronze' },
  { id:'t_082', name:'Práctica Oral Avanzada', category:'simulators', description:'Completa 10 sesiones de práctica oral con el simulador interactivo.', points:300, tier:'Gold' },
  { id:'t_083', name:'Velocidad de Respuesta', category:'simulators', description:'Responde 30 preguntas de simulacro en menos de 10 minutos.', points:250, tier:'Silver' },
  { id:'t_084', name:'Sin Dudar', category:'simulators', description:'Completa una sección completa de simulacro sin pausar.', points:200, tier:'Silver' },
  { id:'t_085', name:'Planificador de Examen', category:'simulators', description:'Usa el modo de estudio planificado durante 5 sesiones.', points:150, tier:'Bronze' },
  { id:'t_086', name:'Análisis Post-Examen', category:'simulators', description:'Revisa el análisis detallado de errores tras un simulacro.', points:100, tier:'Bronze' },
  { id:'t_087', name:'Mejora Constante', category:'simulators', description:'Aumenta tu puntuación en 50 puntos TOEIC en sesiones consecutivas.', points:300, tier:'Gold' },
  { id:'t_088', name:'Dominio TOEIC 800', category:'simulators', description:'Logra 800+ puntos en el simulador TOEIC.', points:350, tier:'Gold' },
  { id:'t_089', name:'Dominio TOEIC 900', category:'simulators', description:'Logra 900+ puntos en el simulador TOEIC.', points:450, tier:'Platinum' },
  { id:'t_090', name:'Dominio TOEFL 90', category:'simulators', description:'Logra 90+ puntos en el simulador TOEFL iBT.', points:350, tier:'Gold' },
  { id:'t_091', name:'Dominio TOEFL 105', category:'simulators', description:'Logra 105+ puntos en el simulador TOEFL iBT.', points:450, tier:'Platinum' },
  { id:'t_092', name:'IELTS Banda 6', category:'simulators', description:'Consigue Band Score 6.0 en el simulador IELTS.', points:250, tier:'Silver' },
  { id:'t_093', name:'IELTS Banda 7.5', category:'simulators', description:'Consigue Band Score 7.5 en el simulador IELTS.', points:400, tier:'Gold' },
  { id:'t_094', name:'Oyente C1', category:'simulators', description:'Logra nivel C1 de comprensión auditiva en cualquier simulacro.', points:350, tier:'Gold' },
  { id:'t_095', name:'Lector C2', category:'simulators', description:'Logra nivel C2 de comprensión lectora en cualquier simulacro.', points:500, tier:'Platinum' },
  { id:'t_096', name:'Escritor C1', category:'simulators', description:'Logra nivel C1 en la sección de escritura de cualquier simulacro.', points:350, tier:'Gold' },
  { id:'t_097', name:'Orador C2', category:'simulators', description:'Logra nivel C2 en la sección oral de cualquier simulacro.', points:500, tier:'Platinum' },
  { id:'t_098', name:'Examinador Internacional', category:'simulators', description:'Completa simulacros de 4 exámenes internacionales diferentes.', points:600, tier:'Obsidian' },
  { id:'t_099', name:'Verificador de Nivel', category:'simulators', description:'Usa el diagnóstico de nivel al inicio de tu cuenta.', points:50, tier:'Bronze' },
  { id:'t_100', name:'Simulacro Perfecto', category:'simulators', description:'Logra 100% de precisión en cualquier simulacro completo.', points:700, tier:'Obsidian' },
  { id:'t_101', name:'TOEIC B2 Alcanzado', category:'simulators', description:'Logra equivalente B2 en el simulador TOEIC (750-900 pts).', points:300, tier:'Gold' },
  { id:'t_102', name:'TOEIC C1 Alcanzado', category:'simulators', description:'Logra equivalente C1 en el simulador TOEIC (900-990 pts).', points:400, tier:'Platinum' },
  { id:'t_103', name:'TOEFL B2 Alcanzado', category:'simulators', description:'Logra equivalente B2 en el simulador TOEFL (72-94 pts).', points:300, tier:'Gold' },
  { id:'t_104', name:'TOEFL C1 Alcanzado', category:'simulators', description:'Logra equivalente C1 en el simulador TOEFL (95-120 pts).', points:400, tier:'Platinum' },
  { id:'t_105', name:'IELTS B2 Alcanzado', category:'simulators', description:'Logra equivalente B2 en el simulador IELTS (Band 5.5-6.5).', points:300, tier:'Gold' },
  { id:'t_106', name:'IELTS C1 Alcanzado', category:'simulators', description:'Logra equivalente C1 en el simulador IELTS (Band 7.0-8.0).', points:400, tier:'Platinum' },
  { id:'t_107', name:'Practica Diaria de Examen', category:'simulators', description:'Practica simulacros durante 30 días seguidos.', points:500, tier:'Platinum' },
  { id:'t_108', name:'200 Sesiones de Práctica', category:'simulators', description:'Acumula 200 sesiones de práctica de simulacros en total.', points:600, tier:'Obsidian' },
  { id:'t_109', name:'Selección de Área Débil', category:'simulators', description:'Practica 5 veces una sección donde hayas fallado antes.', points:200, tier:'Silver' },
  { id:'t_110', name:'Primer Simulacro DELF', category:'simulators', description:'Completa tu primer simulacro de examen DELF en francés.', points:100, tier:'Bronze' },
  { id:'t_111', name:'Primer Simulacro HSK', category:'simulators', description:'Completa tu primer simulacro de examen HSK en chino.', points:100, tier:'Bronze' },
  { id:'t_112', name:'Triple Idioma Simulacros', category:'simulators', description:'Completa simulacros en inglés, francés y chino en la misma semana.', points:700, tier:'Obsidian' },
  { id:'t_113', name:'Experto en Tiempo', category:'simulators', description:'Completa 3 simulacros sin que el tiempo expire.', points:250, tier:'Silver' },
  { id:'t_114', name:'Estrategia de Eliminación', category:'simulators', description:'Usa la estrategia de eliminación en 10 preguntas difíciles correctamente.', points:200, tier:'Silver' },
  { id:'t_115', name:'Ronda Perfecta', category:'simulators', description:'Completa una ronda de práctica (30 preguntas) sin errores.', points:250, tier:'Silver' },
  { id:'t_116', name:'Simulacro de Presión', category:'simulators', description:'Completa un simulacro en el modo de alta presión disponible.', points:300, tier:'Gold' },
  { id:'t_117', name:'Revisión Exhaustiva', category:'simulators', description:'Revisa cada respuesta de un simulacro en detalle.', points:150, tier:'Bronze' },
  { id:'t_118', name:'30 Simulacros Completados', category:'simulators', description:'Completa 30 simulacros de cualquier tipo en total.', points:400, tier:'Gold' },
  { id:'t_119', name:'100 Simulacros Completados', category:'simulators', description:'Completa 100 simulacros de cualquier tipo en total.', points:600, tier:'Obsidian' },
  { id:'t_120', name:'Leyenda de Simulacros', category:'simulators', description:'Completa 500 simulacros en total — logro de por vida.', points:1000, tier:'Obsidian' },
];

// ── CATEGORY 2: DISCIPLINA & RACHAS (t_121–t_250) ── 130 trofeos
const DISCIPLINA: TrophyItem[] = [
  { id:'t_121', name:'Primer Paso', category:'discipline', description:'Completa tu primera lección en OnixLingo.', points:50, tier:'Bronze' },
  { id:'t_122', name:'Constancia Bronce', category:'discipline', description:'Mantén una racha de 3 días consecutivos de aprendizaje.', points:100, tier:'Bronze' },
  { id:'t_123', name:'Constancia Plata', category:'discipline', description:'Mantén una racha de 7 días consecutivos.', points:200, tier:'Silver' },
  { id:'t_124', name:'Constancia Oro', category:'discipline', description:'Mantén una racha de 14 días consecutivos.', points:300, tier:'Gold' },
  { id:'t_125', name:'Racha de Hierro', category:'discipline', description:'Mantén una racha de 21 días consecutivos.', points:400, tier:'Gold' },
  { id:'t_126', name:'Racha de Titanio', category:'discipline', description:'Mantén una racha de 30 días consecutivos.', points:600, tier:'Platinum' },
  { id:'t_127', name:'Racha del Ejecutivo', category:'discipline', description:'Mantén una racha de 60 días consecutivos.', points:900, tier:'Obsidian' },
  { id:'t_128', name:'Racha Centenaria', category:'discipline', description:'Mantén una racha de 100 días consecutivos.', points:1200, tier:'Obsidian' },
  { id:'t_129', name:'Racha Legendaria', category:'discipline', description:'Mantén una racha de 180 días consecutivos.', points:1500, tier:'Obsidian' },
  { id:'t_130', name:'Racha Anual', category:'discipline', description:'Mantén una racha de 365 días consecutivos — logro supremo.', points:2000, tier:'Obsidian' },
  { id:'t_131', name:'XP Inicial', category:'discipline', description:'Consigue tus primeros 100 puntos de XP.', points:50, tier:'Bronze' },
  { id:'t_132', name:'Acumulador de XP', category:'discipline', description:'Consigue 500 puntos de XP.', points:75, tier:'Bronze' },
  { id:'t_133', name:'XP de Élite', category:'discipline', description:'Acumula 1,000 puntos de XP en total.', points:100, tier:'Bronze' },
  { id:'t_134', name:'XP Profesional', category:'discipline', description:'Acumula 2,500 puntos de XP en total.', points:150, tier:'Silver' },
  { id:'t_135', name:'XP Senior', category:'discipline', description:'Acumula 5,000 puntos de XP en total.', points:200, tier:'Silver' },
  { id:'t_136', name:'XP Director', category:'discipline', description:'Acumula 10,000 puntos de XP en total.', points:300, tier:'Gold' },
  { id:'t_137', name:'XP Ejecutivo', category:'discipline', description:'Acumula 25,000 puntos de XP en total.', points:450, tier:'Gold' },
  { id:'t_138', name:'XP Titanium', category:'discipline', description:'Acumula 50,000 puntos de XP en total.', points:600, tier:'Platinum' },
  { id:'t_139', name:'XP Diamante', category:'discipline', description:'Acumula 100,000 puntos de XP en total.', points:800, tier:'Obsidian' },
  { id:'t_140', name:'XP Legendario', category:'discipline', description:'Acumula 500,000 puntos de XP — logro de leyenda.', points:1500, tier:'Obsidian' },
  { id:'t_141', name:'5 Lecciones', category:'discipline', description:'Completa 5 lecciones en total.', points:75, tier:'Bronze' },
  { id:'t_142', name:'10 Lecciones', category:'discipline', description:'Completa 10 lecciones en total.', points:100, tier:'Bronze' },
  { id:'t_143', name:'25 Lecciones', category:'discipline', description:'Completa 25 lecciones en total.', points:150, tier:'Silver' },
  { id:'t_144', name:'50 Lecciones', category:'discipline', description:'Completa 50 lecciones en total.', points:200, tier:'Silver' },
  { id:'t_145', name:'100 Lecciones', category:'discipline', description:'Completa 100 lecciones en total.', points:300, tier:'Gold' },
  { id:'t_146', name:'200 Lecciones', category:'discipline', description:'Completa 200 lecciones en total.', points:450, tier:'Gold' },
  { id:'t_147', name:'300 Lecciones', category:'discipline', description:'Completa 300 lecciones en total.', points:600, tier:'Platinum' },
  { id:'t_148', name:'500 Lecciones', category:'discipline', description:'Completa 500 lecciones en total.', points:800, tier:'Obsidian' },
  { id:'t_149', name:'750 Lecciones', category:'discipline', description:'Completa 750 lecciones — disciplina de élite.', points:1000, tier:'Obsidian' },
  { id:'t_150', name:'1000 Lecciones', category:'discipline', description:'Completa 1,000 lecciones — logro supremo.', points:1500, tier:'Obsidian' },
  { id:'t_151', name:'Lección Madrugadora', category:'discipline', description:'Completa una lección antes de las 7am.', points:100, tier:'Bronze' },
  { id:'t_152', name:'Lección Nocturna', category:'discipline', description:'Completa una lección después de las 11pm.', points:100, tier:'Bronze' },
  { id:'t_153', name:'Fin de Semana Productivo', category:'discipline', description:'Completa 5 lecciones en un solo fin de semana.', points:150, tier:'Silver' },
  { id:'t_154', name:'Día Intensivo', category:'discipline', description:'Completa 10 lecciones en un solo día.', points:200, tier:'Silver' },
  { id:'t_155', name:'Día Maratón', category:'discipline', description:'Completa 20 lecciones en un solo día.', points:350, tier:'Gold' },
  { id:'t_156', name:'Semana Perfecta', category:'discipline', description:'Completa al menos una lección cada día durante una semana.', points:250, tier:'Silver' },
  { id:'t_157', name:'Mes Perfecto', category:'discipline', description:'Completa al menos una lección cada día durante un mes.', points:500, tier:'Platinum' },
  { id:'t_158', name:'Velocidad de Aprendizaje', category:'discipline', description:'Completa 3 lecciones en menos de 30 minutos.', points:200, tier:'Silver' },
  { id:'t_159', name:'Perfeccionista', category:'discipline', description:'Obtén 3 estrellas en 10 lecciones consecutivas.', points:300, tier:'Gold' },
  { id:'t_160', name:'Maestro de Estrellas', category:'discipline', description:'Obtén 3 estrellas en 50 lecciones.', points:500, tier:'Platinum' },
  { id:'t_161', name:'Primer Login', category:'discipline', description:'Inicia sesión por primera vez en OnixLingo.', points:25, tier:'Bronze' },
  { id:'t_162', name:'7 Días de Login', category:'discipline', description:'Inicia sesión 7 días en total.', points:75, tier:'Bronze' },
  { id:'t_163', name:'30 Días de Login', category:'discipline', description:'Inicia sesión 30 días en total.', points:150, tier:'Silver' },
  { id:'t_164', name:'100 Días de Login', category:'discipline', description:'Inicia sesión 100 días en total.', points:300, tier:'Gold' },
  { id:'t_165', name:'365 Días de Login', category:'discipline', description:'Inicia sesión 365 días en total — fidelidad anual.', points:600, tier:'Obsidian' },
  { id:'t_166', name:'Primera Semana Completa', category:'discipline', description:'Usa OnixLingo activamente durante tu primera semana.', points:100, tier:'Bronze' },
  { id:'t_167', name:'Primer Mes Completo', category:'discipline', description:'Usa OnixLingo activamente durante tu primer mes.', points:200, tier:'Silver' },
  { id:'t_168', name:'Tres Meses Activo', category:'discipline', description:'Mantén actividad en OnixLingo durante 3 meses seguidos.', points:350, tier:'Gold' },
  { id:'t_169', name:'Seis Meses Activo', category:'discipline', description:'Mantén actividad en OnixLingo durante 6 meses seguidos.', points:600, tier:'Platinum' },
  { id:'t_170', name:'Un Año Activo', category:'discipline', description:'Mantén actividad en OnixLingo durante 12 meses seguidos.', points:1000, tier:'Obsidian' },
  { id:'t_171', name:'XP Semanal 500', category:'discipline', description:'Gana 500 XP en una sola semana.', points:150, tier:'Silver' },
  { id:'t_172', name:'XP Semanal 2000', category:'discipline', description:'Gana 2,000 XP en una sola semana.', points:300, tier:'Gold' },
  { id:'t_173', name:'XP Semanal 5000', category:'discipline', description:'Gana 5,000 XP en una sola semana.', points:500, tier:'Platinum' },
  { id:'t_174', name:'XP Diario 100', category:'discipline', description:'Gana 100 XP en un solo día.', points:75, tier:'Bronze' },
  { id:'t_175', name:'XP Diario 500', category:'discipline', description:'Gana 500 XP en un solo día.', points:200, tier:'Silver' },
  { id:'t_176', name:'XP Diario 1000', category:'discipline', description:'Gana 1,000 XP en un solo día.', points:350, tier:'Gold' },
  { id:'t_177', name:'Racha de Estrellas', category:'discipline', description:'Obtén 3 estrellas en 7 lecciones consecutivas.', points:250, tier:'Silver' },
  { id:'t_178', name:'Consistencia Perfecta', category:'discipline', description:'Obtén al menos 2 estrellas en 30 lecciones consecutivas.', points:400, tier:'Gold' },
  { id:'t_179', name:'Precisión del 80%', category:'discipline', description:'Mantén un promedio de precisión del 80% durante una semana.', points:200, tier:'Silver' },
  { id:'t_180', name:'Precisión del 90%', category:'discipline', description:'Mantén un promedio de precisión del 90% durante una semana.', points:300, tier:'Gold' },
  { id:'t_181', name:'Precisión del 95%', category:'discipline', description:'Mantén un promedio de precisión del 95% durante una semana.', points:400, tier:'Platinum' },
  { id:'t_182', name:'Sin Errores Semana', category:'discipline', description:'Completa una semana entera sin fallar ninguna lección.', points:500, tier:'Platinum' },
  { id:'t_183', name:'Recuperación Veloz', category:'discipline', description:'Completa una lección perfectamente después de haberla fallado antes.', points:150, tier:'Silver' },
  { id:'t_184', name:'Doble Sesión', category:'discipline', description:'Completa dos sesiones de estudio en el mismo día.', points:125, tier:'Silver' },
  { id:'t_185', name:'Triple Sesión', category:'discipline', description:'Completa tres sesiones de estudio en el mismo día.', points:200, tier:'Silver' },
  { id:'t_186', name:'Sesión Madrugadora Habitual', category:'discipline', description:'Estudia antes de las 7am durante 5 días seguidos.', points:300, tier:'Gold' },
  { id:'t_187', name:'Estudiante Nocturno Habitual', category:'discipline', description:'Estudia después de las 10pm durante 5 días seguidos.', points:300, tier:'Gold' },
  { id:'t_188', name:'Hora de Estudio Diaria', category:'discipline', description:'Estudia al menos 1 hora continua en una sesión.', points:150, tier:'Silver' },
  { id:'t_189', name:'Dos Horas de Estudio', category:'discipline', description:'Estudia al menos 2 horas continuas en una sesión.', points:250, tier:'Silver' },
  { id:'t_190', name:'Maratón de Estudio', category:'discipline', description:'Estudia más de 4 horas en un solo día.', points:400, tier:'Gold' },
  { id:'t_191', name:'100 Horas de Estudio', category:'discipline', description:'Acumula 100 horas de estudio en total en OnixLingo.', points:500, tier:'Platinum' },
  { id:'t_192', name:'500 Horas de Estudio', category:'discipline', description:'Acumula 500 horas de estudio total — dedicación máxima.', points:1000, tier:'Obsidian' },
  { id:'t_193', name:'Lunes de Productividad', category:'discipline', description:'Completa 3+ lecciones todos los lunes durante un mes.', points:200, tier:'Silver' },
  { id:'t_194', name:'Weekend Warrior', category:'discipline', description:'Completa más lecciones en fin de semana que entre semana 4 veces.', points:250, tier:'Silver' },
  { id:'t_195', name:'Equilibrio Perfecto', category:'discipline', description:'Estudia al menos una lección todos los días de la semana durante 4 semanas.', points:350, tier:'Gold' },
  { id:'t_196', name:'Primer Módulo Completo', category:'discipline', description:'Completa tu primer módulo completo de cualquier currículo.', points:100, tier:'Bronze' },
  { id:'t_197', name:'5 Módulos Completados', category:'discipline', description:'Completa 5 módulos de cualquier currículo.', points:200, tier:'Silver' },
  { id:'t_198', name:'10 Módulos Completados', category:'discipline', description:'Completa 10 módulos de cualquier currículo.', points:300, tier:'Gold' },
  { id:'t_199', name:'25 Módulos Completados', category:'discipline', description:'Completa 25 módulos de cualquier currículo.', points:450, tier:'Gold' },
  { id:'t_200', name:'50 Módulos Completados', category:'discipline', description:'Completa 50 módulos de cualquier currículo — maestría.', points:700, tier:'Obsidian' },
  { id:'t_201', name:'Motivación Temprana', category:'discipline', description:'Completa 3 lecciones en tu primer día de registro.', points:100, tier:'Bronze' },
  { id:'t_202', name:'Arranque Potente', category:'discipline', description:'Completa 10 lecciones durante tu primera semana de registro.', points:150, tier:'Silver' },
  { id:'t_203', name:'Primer Mes Explosivo', category:'discipline', description:'Completa 40 lecciones durante tu primer mes de registro.', points:250, tier:'Gold' },
  { id:'t_204', name:'Racha de 45 Días', category:'discipline', description:'Mantén una racha de 45 días consecutivos de aprendizaje.', points:700, tier:'Platinum' },
  { id:'t_205', name:'Racha de 90 Días', category:'discipline', description:'Mantén una racha de 90 días consecutivos de aprendizaje.', points:1000, tier:'Obsidian' },
  { id:'t_206', name:'Racha de 150 Días', category:'discipline', description:'Mantén una racha de 150 días consecutivos de aprendizaje.', points:1300, tier:'Obsidian' },
  { id:'t_207', name:'Racha de 270 Días', category:'discipline', description:'Mantén una racha de 270 días (9 meses) consecutivos.', points:1700, tier:'Obsidian' },
  { id:'t_208', name:'Objetivo Semanal Cumplido', category:'discipline', description:'Cumple tu objetivo semanal de lecciones 4 veces seguidas.', points:200, tier:'Silver' },
  { id:'t_209', name:'Objetivo Mensual Cumplido', category:'discipline', description:'Cumple tu objetivo mensual de lecciones 3 veces seguidas.', points:350, tier:'Gold' },
  { id:'t_210', name:'Estudio Balanceado', category:'discipline', description:'Practica vocabulario, gramática y speaking en la misma semana.', points:200, tier:'Silver' },
  { id:'t_211', name:'Repaso Activo', category:'discipline', description:'Completa 10 repasos de lecciones anteriores.', points:150, tier:'Silver' },
  { id:'t_212', name:'Repaso Profundo', category:'discipline', description:'Completa 50 repasos de lecciones anteriores.', points:300, tier:'Gold' },
  { id:'t_213', name:'Nivel A1 Completado', category:'discipline', description:'Completa todos los contenidos del nivel A1.', points:150, tier:'Bronze' },
  { id:'t_214', name:'Nivel A2 Completado', category:'discipline', description:'Completa todos los contenidos del nivel A2.', points:200, tier:'Silver' },
  { id:'t_215', name:'Nivel B1 Completado', category:'discipline', description:'Completa todos los contenidos del nivel B1.', points:300, tier:'Silver' },
  { id:'t_216', name:'Nivel B2 Completado', category:'discipline', description:'Completa todos los contenidos del nivel B2.', points:400, tier:'Gold' },
  { id:'t_217', name:'Nivel C1 Completado', category:'discipline', description:'Completa todos los contenidos del nivel C1.', points:600, tier:'Platinum' },
  { id:'t_218', name:'Nivel C2 Completado', category:'discipline', description:'Completa todos los contenidos del nivel C2 — dominio total.', points:900, tier:'Obsidian' },
  { id:'t_219', name:'Lección Sin Fallos', category:'discipline', description:'Completa una lección con 0 errores.', points:100, tier:'Bronze' },
  { id:'t_220', name:'5 Lecciones Sin Fallos', category:'discipline', description:'Completa 5 lecciones consecutivas con 0 errores.', points:200, tier:'Silver' },
  { id:'t_221', name:'10 Lecciones Sin Fallos', category:'discipline', description:'Completa 10 lecciones consecutivas con 0 errores.', points:350, tier:'Gold' },
  { id:'t_222', name:'20 Lecciones Sin Fallos', category:'discipline', description:'Completa 20 lecciones consecutivas con 0 errores.', points:500, tier:'Platinum' },
  { id:'t_223', name:'Velocidad Máxima', category:'discipline', description:'Completa una lección en menos de la mitad del tiempo asignado.', points:150, tier:'Silver' },
  { id:'t_224', name:'Lección a Tiempo', category:'discipline', description:'Completa 10 lecciones dentro del tiempo límite.', points:150, tier:'Silver' },
  { id:'t_225', name:'Eficiencia Total', category:'discipline', description:'Logra 95%+ de precisión y tiempo óptimo en 5 lecciones seguidas.', points:350, tier:'Gold' },
  { id:'t_226', name:'Primer Boleto VIP', category:'discipline', description:'Obtén tu primer boleto VIP completando una lección ejecutiva.', points:100, tier:'Bronze' },
  { id:'t_227', name:'10 Boletos VIP', category:'discipline', description:'Acumula 10 boletos VIP en tu cuenta.', points:150, tier:'Silver' },
  { id:'t_228', name:'50 Boletos VIP', category:'discipline', description:'Acumula 50 boletos VIP en tu cuenta.', points:300, tier:'Gold' },
  { id:'t_229', name:'Campeón de Boletos', category:'discipline', description:'Acumula 100 boletos VIP en tu cuenta.', points:500, tier:'Platinum' },
  { id:'t_230', name:'Rey de Boletos', category:'discipline', description:'Acumula 500 boletos VIP en tu cuenta.', points:800, tier:'Obsidian' },
  { id:'t_231', name:'XP 15,000', category:'discipline', description:'Acumula 15,000 puntos de XP en total.', points:350, tier:'Gold' },
  { id:'t_232', name:'XP 30,000', category:'discipline', description:'Acumula 30,000 puntos de XP en total.', points:500, tier:'Platinum' },
  { id:'t_233', name:'XP 75,000', category:'discipline', description:'Acumula 75,000 puntos de XP en total.', points:700, tier:'Obsidian' },
  { id:'t_234', name:'XP 200,000', category:'discipline', description:'Acumula 200,000 puntos de XP en total.', points:1000, tier:'Obsidian' },
  { id:'t_235', name:'Racha de 5 Días', category:'discipline', description:'Mantén una racha de 5 días consecutivos.', points:125, tier:'Bronze' },
  { id:'t_236', name:'Racha de 10 Días', category:'discipline', description:'Mantén una racha de 10 días consecutivos.', points:175, tier:'Silver' },
  { id:'t_237', name:'Racha de 50 Días', category:'discipline', description:'Mantén una racha de 50 días consecutivos.', points:750, tier:'Platinum' },
  { id:'t_238', name:'Racha de 75 Días', category:'discipline', description:'Mantén una racha de 75 días consecutivos.', points:900, tier:'Obsidian' },
  { id:'t_239', name:'Racha de 120 Días', category:'discipline', description:'Mantén una racha de 120 días consecutivos.', points:1100, tier:'Obsidian' },
  { id:'t_240', name:'Racha de 200 Días', category:'discipline', description:'Mantén una racha de 200 días consecutivos.', points:1400, tier:'Obsidian' },
  { id:'t_241', name:'Racha de 250 Días', category:'discipline', description:'Mantén una racha de 250 días consecutivos.', points:1600, tier:'Obsidian' },
  { id:'t_242', name:'Racha de 300 Días', category:'discipline', description:'Mantén una racha de 300 días consecutivos.', points:1800, tier:'Obsidian' },
  { id:'t_243', name:'150 Lecciones', category:'discipline', description:'Completa 150 lecciones en total.', points:375, tier:'Gold' },
  { id:'t_244', name:'400 Lecciones', category:'discipline', description:'Completa 400 lecciones en total.', points:700, tier:'Platinum' },
  { id:'t_245', name:'600 Lecciones', category:'discipline', description:'Completa 600 lecciones en total.', points:900, tier:'Obsidian' },
  { id:'t_246', name:'XP 7,500', category:'discipline', description:'Acumula 7,500 puntos de XP en total.', points:250, tier:'Silver' },
  { id:'t_247', name:'XP 20,000', category:'discipline', description:'Acumula 20,000 puntos de XP en total.', points:400, tier:'Gold' },
  { id:'t_248', name:'Primer Curso Completo', category:'discipline', description:'Completa tu primer curso completo de cualquier idioma.', points:350, tier:'Gold' },
  { id:'t_249', name:'Tres Cursos Completos', category:'discipline', description:'Completa tres cursos completos de cualquier idioma.', points:600, tier:'Platinum' },
  { id:'t_250', name:'Todos los Cursos', category:'discipline', description:'Completa todos los cursos disponibles en la plataforma.', points:1200, tier:'Obsidian' },
];

// ── CATEGORY 3: INGLÉS CORPORATIVO (t_251–t_400) ── 150 trofeos
const INGLES: TrophyItem[] = [
  { id:'t_251', name:'Primer Paso en Inglés', category:'english', description:'Completa tu primera lección de Inglés Corporativo.', points:50, tier:'Bronze' },
  { id:'t_252', name:'A1 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel A1 en Inglés.', points:75, tier:'Bronze' },
  { id:'t_253', name:'A1 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel A1 en Inglés.', points:150, tier:'Bronze' },
  { id:'t_254', name:'A2 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel A2 en Inglés.', points:100, tier:'Bronze' },
  { id:'t_255', name:'A2 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel A2 en Inglés.', points:200, tier:'Silver' },
  { id:'t_256', name:'B1 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel B1 en Inglés.', points:150, tier:'Silver' },
  { id:'t_257', name:'B1 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel B1 en Inglés.', points:300, tier:'Silver' },
  { id:'t_258', name:'B2 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel B2 en Inglés.', points:200, tier:'Silver' },
  { id:'t_259', name:'B2 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel B2 en Inglés.', points:400, tier:'Gold' },
  { id:'t_260', name:'C1 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel C1 en Inglés.', points:300, tier:'Gold' },
  { id:'t_261', name:'C1 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel C1 en Inglés.', points:600, tier:'Platinum' },
  { id:'t_262', name:'C2 Inglés Iniciado', category:'english', description:'Completa 3 lecciones de nivel C2 en Inglés.', points:400, tier:'Platinum' },
  { id:'t_263', name:'C2 Inglés Dominado', category:'english', description:'Completa todas las lecciones del nivel C2 — maestría en inglés corporativo.', points:900, tier:'Obsidian' },
  { id:'t_264', name:'Inglés de Negocios A', category:'english', description:'Completa el módulo de Inglés de Negocios básico.', points:150, tier:'Silver' },
  { id:'t_265', name:'Inglés de Negocios B', category:'english', description:'Completa el módulo de Inglés de Negocios intermedio.', points:250, tier:'Gold' },
  { id:'t_266', name:'Inglés de Negocios C', category:'english', description:'Completa el módulo de Inglés de Negocios avanzado.', points:400, tier:'Platinum' },
  { id:'t_267', name:'Comunicación Ejecutiva', category:'english', description:'Completa el módulo de Comunicación Ejecutiva en inglés.', points:300, tier:'Gold' },
  { id:'t_268', name:'Negociaciones en Inglés', category:'english', description:'Completa el módulo de Negociaciones Empresariales en inglés.', points:350, tier:'Gold' },
  { id:'t_269', name:'Presentaciones Corporativas', category:'english', description:'Completa el módulo de Presentaciones Corporativas en inglés.', points:300, tier:'Gold' },
  { id:'t_270', name:'Emails Ejecutivos', category:'english', description:'Completa el módulo de Redacción de Emails Ejecutivos.', points:200, tier:'Silver' },
  { id:'t_271', name:'Inglés Telefónico', category:'english', description:'Completa el módulo de Inglés para Llamadas de Negocios.', points:200, tier:'Silver' },
  { id:'t_272', name:'Conferencias en Inglés', category:'english', description:'Completa el módulo de Inglés para Conferencias Internacionales.', points:300, tier:'Gold' },
  { id:'t_273', name:'Reuniones de Directivos', category:'english', description:'Completa el módulo de Inglés para Juntas Directivas.', points:350, tier:'Gold' },
  { id:'t_274', name:'Reportes Financieros', category:'english', description:'Completa el módulo de Inglés para Reportes Financieros.', points:300, tier:'Gold' },
  { id:'t_275', name:'Liderazgo en Inglés', category:'english', description:'Completa el módulo de Habilidades de Liderazgo en inglés.', points:350, tier:'Gold' },
  { id:'t_276', name:'Marketing en Inglés', category:'english', description:'Completa el módulo de Marketing y Branding en inglés.', points:250, tier:'Silver' },
  { id:'t_277', name:'RRHH en Inglés', category:'english', description:'Completa el módulo de Recursos Humanos en inglés.', points:250, tier:'Silver' },
  { id:'t_278', name:'Legal en Inglés', category:'english', description:'Completa el módulo de Inglés Legal y Contractual.', points:350, tier:'Gold' },
  { id:'t_279', name:'Tecnología en Inglés', category:'english', description:'Completa el módulo de Inglés Técnico y Tecnológico.', points:300, tier:'Gold' },
  { id:'t_280', name:'Salud en Inglés', category:'english', description:'Completa el módulo de Inglés para el Sector Salud.', points:300, tier:'Gold' },
  { id:'t_281', name:'10 Lecciones de Inglés', category:'english', description:'Completa 10 lecciones de Inglés Corporativo.', points:100, tier:'Bronze' },
  { id:'t_282', name:'25 Lecciones de Inglés', category:'english', description:'Completa 25 lecciones de Inglés Corporativo.', points:200, tier:'Silver' },
  { id:'t_283', name:'50 Lecciones de Inglés', category:'english', description:'Completa 50 lecciones de Inglés Corporativo.', points:300, tier:'Gold' },
  { id:'t_284', name:'100 Lecciones de Inglés', category:'english', description:'Completa 100 lecciones de Inglés Corporativo.', points:500, tier:'Platinum' },
  { id:'t_285', name:'200 Lecciones de Inglés', category:'english', description:'Completa 200 lecciones de Inglés Corporativo.', points:700, tier:'Obsidian' },
  { id:'t_286', name:'Inglés Perfecto 5 Seguidas', category:'english', description:'Obtén 100% en 5 lecciones consecutivas de inglés.', points:250, tier:'Silver' },
  { id:'t_287', name:'Inglés Perfecto 10 Seguidas', category:'english', description:'Obtén 100% en 10 lecciones consecutivas de inglés.', points:400, tier:'Gold' },
  { id:'t_288', name:'Gramática Inglesa Élite', category:'english', description:'Completa el módulo de Gramática Avanzada con 95%+ de precisión.', points:350, tier:'Gold' },
  { id:'t_289', name:'Phrasal Verbs Ejecutivos', category:'english', description:'Domina 50 phrasal verbs empresariales clave.', points:250, tier:'Silver' },
  { id:'t_290', name:'Idioms Corporativos', category:'english', description:'Aprende 30 idioms corporativos usados en C-Level.', points:250, tier:'Silver' },
  { id:'t_291', name:'Collocations de Negocios', category:'english', description:'Domina 40 collocations esenciales para el entorno empresarial.', points:250, tier:'Silver' },
  { id:'t_292', name:'Speaking B1 en Inglés', category:'english', description:'Alcanza fluidez de nivel B1 en el módulo de Speaking.', points:200, tier:'Silver' },
  { id:'t_293', name:'Speaking B2 en Inglés', category:'english', description:'Alcanza fluidez de nivel B2 en el módulo de Speaking.', points:350, tier:'Gold' },
  { id:'t_294', name:'Speaking C1 en Inglés', category:'english', description:'Alcanza fluidez de nivel C1 en el módulo de Speaking.', points:500, tier:'Platinum' },
  { id:'t_295', name:'Listening B1 en Inglés', category:'english', description:'Completa el módulo de Listening B1 con 85%+ de aciertos.', points:200, tier:'Silver' },
  { id:'t_296', name:'Listening B2 en Inglés', category:'english', description:'Completa el módulo de Listening B2 con 85%+ de aciertos.', points:350, tier:'Gold' },
  { id:'t_297', name:'Listening C1 en Inglés', category:'english', description:'Completa el módulo de Listening C1 con 85%+ de aciertos.', points:500, tier:'Platinum' },
  { id:'t_298', name:'Writing Ejecutivo A', category:'english', description:'Completa el módulo de Escritura Ejecutiva nivel básico.', points:200, tier:'Silver' },
  { id:'t_299', name:'Writing Ejecutivo B', category:'english', description:'Completa el módulo de Escritura Ejecutiva nivel avanzado.', points:350, tier:'Gold' },
  { id:'t_300', name:'Pronunciación Élite', category:'english', description:'Logra 90%+ de precisión en el módulo de Pronunciación Ejecutiva.', points:400, tier:'Gold' },
  { id:'t_301', name:'Acento Neutralizado', category:'english', description:'Completa el módulo de reducción de acento con puntuación alta.', points:350, tier:'Gold' },
  { id:'t_302', name:'Entonación Profesional', category:'english', description:'Logra 95% en el módulo de Entonación y Prosodia.', points:400, tier:'Gold' },
  { id:'t_303', name:'Velocidad de Habla', category:'english', description:'Alcanza 130 WPM en el módulo de velocidad de habla ejecutiva.', points:300, tier:'Gold' },
  { id:'t_304', name:'Vocabulario A1 Inglés', category:'english', description:'Aprende las 500 palabras esenciales A1 en inglés.', points:100, tier:'Bronze' },
  { id:'t_305', name:'Vocabulario A2 Inglés', category:'english', description:'Aprende las 1,000 palabras esenciales A2 en inglés.', points:150, tier:'Silver' },
  { id:'t_306', name:'Vocabulario B1 Inglés', category:'english', description:'Aprende las 2,000 palabras esenciales B1 en inglés.', points:200, tier:'Silver' },
  { id:'t_307', name:'Vocabulario B2 Inglés', category:'english', description:'Aprende las 3,000 palabras esenciales B2 en inglés.', points:300, tier:'Gold' },
  { id:'t_308', name:'Vocabulario C1 Inglés', category:'english', description:'Aprende las 5,000 palabras esenciales C1 en inglés.', points:450, tier:'Platinum' },
  { id:'t_309', name:'Vocabulario C2 Inglés', category:'english', description:'Aprende las 8,000 palabras esenciales C2 en inglés.', points:700, tier:'Obsidian' },
  { id:'t_310', name:'Terminología Financiera EN', category:'english', description:'Domina 100 términos financieros clave en inglés.', points:250, tier:'Silver' },
  { id:'t_311', name:'Terminología Legal EN', category:'english', description:'Domina 100 términos legales clave en inglés.', points:250, tier:'Silver' },
  { id:'t_312', name:'Terminología Tech EN', category:'english', description:'Domina 100 términos tecnológicos en inglés corporativo.', points:250, tier:'Silver' },
  { id:'t_313', name:'Terminología HR EN', category:'english', description:'Domina 100 términos de RRHH en inglés corporativo.', points:250, tier:'Silver' },
  { id:'t_314', name:'Inglés para Líderes', category:'english', description:'Completa los 5 módulos del Programa de Liderazgo Ejecutivo en inglés.', points:600, tier:'Platinum' },
  { id:'t_315', name:'Pitch Perfecto', category:'english', description:'Completa el módulo de Pitch y Presentación a Inversores en inglés.', points:350, tier:'Gold' },
  { id:'t_316', name:'Entrevista de Trabajo EN', category:'english', description:'Completa el módulo de Inglés para Entrevistas de Trabajo.', points:250, tier:'Silver' },
  { id:'t_317', name:'Networking Ejecutivo', category:'english', description:'Completa el módulo de Networking Profesional en inglés.', points:250, tier:'Silver' },
  { id:'t_318', name:'Debate Corporativo EN', category:'english', description:'Completa el módulo de Debates y Argumentación Ejecutiva en inglés.', points:350, tier:'Gold' },
  { id:'t_319', name:'Crisis Communication EN', category:'english', description:'Completa el módulo de Comunicación en Crisis en inglés.', points:400, tier:'Gold' },
  { id:'t_320', name:'Media Relations EN', category:'english', description:'Completa el módulo de Relaciones con Medios en inglés.', points:350, tier:'Gold' },
  { id:'t_321', name:'Storytelling Ejecutivo', category:'english', description:'Completa el módulo de Storytelling Corporativo en inglés.', points:300, tier:'Gold' },
  { id:'t_322', name:'Persuasión Ejecutiva EN', category:'english', description:'Completa el módulo de Técnicas de Persuasión Ejecutiva.', points:350, tier:'Gold' },
  { id:'t_323', name:'Lección A-1 Perfecta', category:'english', description:'Completa la lección A-1 con puntuación perfecta.', points:100, tier:'Bronze' },
  { id:'t_324', name:'Lección A-10 Perfecta', category:'english', description:'Completa la lección A-10 con puntuación perfecta.', points:125, tier:'Silver' },
  { id:'t_325', name:'Lección A-25 Perfecta', category:'english', description:'Completa la lección A-25 con puntuación perfecta.', points:150, tier:'Silver' },
  { id:'t_326', name:'Lección A-50 Perfecta', category:'english', description:'Completa la lección A-50 con puntuación perfecta.', points:200, tier:'Silver' },
  { id:'t_327', name:'Lección A-75 Perfecta', category:'english', description:'Completa la lección A-75 con puntuación perfecta.', points:250, tier:'Gold' },
  { id:'t_328', name:'Lección A-100 Perfecta', category:'english', description:'Completa la lección A-100 con puntuación perfecta.', points:300, tier:'Gold' },
  { id:'t_329', name:'Dominio 10 Sectores EN', category:'english', description:'Completa lecciones de al menos 10 sectores industriales distintos en inglés.', points:500, tier:'Platinum' },
  { id:'t_330', name:'Inglés Internacional', category:'english', description:'Estudia inglés durante 3 meses continuos en OnixLingo.', points:400, tier:'Gold' },
  { id:'t_331', name:'Lección EN Sin Ayuda', category:'english', description:'Completa 5 lecciones de inglés sin usar la función de ayuda.', points:200, tier:'Silver' },
  { id:'t_332', name:'Precisión 100% EN 3 veces', category:'english', description:'Logra 100% de precisión en 3 lecciones de inglés distintas.', points:250, tier:'Silver' },
  { id:'t_333', name:'Precisión 100% EN 10 veces', category:'english', description:'Logra 100% de precisión en 10 lecciones de inglés distintas.', points:400, tier:'Gold' },
  { id:'t_334', name:'Rapidez Lingüística EN', category:'english', description:'Completa 5 lecciones de inglés en el modo de velocidad.', points:250, tier:'Silver' },
  { id:'t_335', name:'Inglés para CEOs', category:'english', description:'Completa el módulo exclusivo de Inglés para CEOs y Presidentes Ejecutivos.', points:600, tier:'Platinum' },
  { id:'t_336', name:'Corporativo English', category:'english', description:'Completa el módulo de Inglés para Sala de Juntas.', points:450, tier:'Gold' },
  { id:'t_337', name:'Cross-Cultural EN', category:'english', description:'Completa el módulo de Comunicación Intercultural en inglés.', points:350, tier:'Gold' },
  { id:'t_338', name:'Supply Chain EN', category:'english', description:'Completa el módulo de Inglés para Supply Chain y Logística.', points:300, tier:'Gold' },
  { id:'t_339', name:'Fintech EN', category:'english', description:'Completa el módulo de Inglés para Fintech y Banca Digital.', points:350, tier:'Gold' },
  { id:'t_340', name:'Startup Language EN', category:'english', description:'Completa el módulo de Inglés para Startups y Emprendimiento.', points:300, tier:'Gold' },
  { id:'t_341', name:'Due Diligence EN', category:'english', description:'Completa el módulo de Inglés para Due Diligence y M&A.', points:400, tier:'Platinum' },
  { id:'t_342', name:'Compliance EN', category:'english', description:'Completa el módulo de Inglés para Compliance y Regulación.', points:350, tier:'Gold' },
  { id:'t_343', name:'ESG Reporting EN', category:'english', description:'Completa el módulo de Inglés para Reportes ESG.', points:350, tier:'Gold' },
  { id:'t_344', name:'Corporate Governance EN', category:'english', description:'Completa el módulo de Inglés para Gobierno Corporativo.', points:400, tier:'Platinum' },
  { id:'t_345', name:'Data Analytics EN', category:'english', description:'Completa el módulo de Inglés para Análisis de Datos.', points:300, tier:'Gold' },
  { id:'t_346', name:'Tech Business EN', category:'english', description:'Completa el módulo de Inglés para Sistemas y Transformación Digital.', points:350, tier:'Gold' },
  { id:'t_347', name:'Global Sales EN', category:'english', description:'Completa el módulo de Inglés para Ventas Globales.', points:300, tier:'Gold' },
  { id:'t_348', name:'Consultoría EN', category:'english', description:'Completa el módulo de Inglés para Consultoría de Negocios.', points:350, tier:'Gold' },
  { id:'t_349', name:'Manufactura EN', category:'english', description:'Completa el módulo de Inglés para Manufactura e Industria.', points:300, tier:'Gold' },
  { id:'t_350', name:'Energía EN', category:'english', description:'Completa el módulo de Inglés para el Sector Energético.', points:300, tier:'Gold' },
  { id:'t_351', name:'Real Estate EN', category:'english', description:'Completa el módulo de Inglés para Bienes Raíces Comerciales.', points:300, tier:'Gold' },
  { id:'t_352', name:'Hospitalidad EN', category:'english', description:'Completa el módulo de Inglés para Hotelería y Hospitalidad.', points:250, tier:'Silver' },
  { id:'t_353', name:'Educación EN', category:'english', description:'Completa el módulo de Inglés para el Sector Educativo.', points:250, tier:'Silver' },
  { id:'t_354', name:'Inglés Académico', category:'english', description:'Completa el módulo de Inglés Académico y de Investigación.', points:350, tier:'Gold' },
  { id:'t_355', name:'Diplomacia EN', category:'english', description:'Completa el módulo de Inglés para Relaciones Diplomáticas.', points:400, tier:'Platinum' },
  { id:'t_356', name:'Logística Internacional EN', category:'english', description:'Completa el módulo de Inglés para Comercio Internacional.', points:350, tier:'Gold' },
  { id:'t_357', name:'Seguros EN', category:'english', description:'Completa el módulo de Inglés para el Sector Asegurador.', points:300, tier:'Gold' },
  { id:'t_358', name:'Auditoría EN', category:'english', description:'Completa el módulo de Inglés para Auditoría y Control.', points:350, tier:'Gold' },
  { id:'t_359', name:'Farmacéutica EN', category:'english', description:'Completa el módulo de Inglés para la Industria Farmacéutica.', points:350, tier:'Gold' },
  { id:'t_360', name:'Turismo EN', category:'english', description:'Completa el módulo de Inglés para Turismo de Negocios.', points:250, tier:'Silver' },
  { id:'t_361', name:'Construcción EN', category:'english', description:'Completa el módulo de Inglés para la Industria de Construcción.', points:300, tier:'Gold' },
  { id:'t_362', name:'Agro-negocios EN', category:'english', description:'Completa el módulo de Inglés para Agronegocios.', points:300, tier:'Gold' },
  { id:'t_363', name:'Telecomunicaciones EN', category:'english', description:'Completa el módulo de Inglés para Telecomunicaciones.', points:300, tier:'Gold' },
  { id:'t_364', name:'Medios de Comunicación EN', category:'english', description:'Completa el módulo de Inglés para Medios y Comunicación Corporativa.', points:300, tier:'Gold' },
  { id:'t_365', name:'Deportes Corporativos EN', category:'english', description:'Completa el módulo de Inglés para el Sector Deportivo y de Entretenimiento.', points:250, tier:'Silver' },
  { id:'t_366', name:'Retail EN', category:'english', description:'Completa el módulo de Inglés para Retail y E-commerce.', points:280, tier:'Silver' },
  { id:'t_367', name:'Recursos Naturales EN', category:'english', description:'Completa el módulo de Inglés para Minería y Recursos Naturales.', points:300, tier:'Gold' },
  { id:'t_368', name:'Aeroespacial EN', category:'english', description:'Completa el módulo de Inglés para la Industria Aeroespacial.', points:350, tier:'Gold' },
  { id:'t_369', name:'Defensa EN', category:'english', description:'Completa el módulo de Inglés para el Sector de Defensa.', points:350, tier:'Gold' },
  { id:'t_370', name:'Gobierno EN', category:'english', description:'Completa el módulo de Inglés para el Sector Gobierno.', points:300, tier:'Gold' },
  { id:'t_371', name:'ONG EN', category:'english', description:'Completa el módulo de Inglés para Organizaciones Sin Fines de Lucro.', points:250, tier:'Silver' },
  { id:'t_372', name:'Inversiones EN', category:'english', description:'Completa el módulo de Inglés para Investment Banking.', points:400, tier:'Gold' },
  { id:'t_373', name:'Private Equity EN', category:'english', description:'Completa el módulo de Inglés para Private Equity y VC.', points:450, tier:'Platinum' },
  { id:'t_374', name:'Impuestos EN', category:'english', description:'Completa el módulo de Inglés para Tributación Internacional.', points:350, tier:'Gold' },
  { id:'t_375', name:'Propiedad Intelectual EN', category:'english', description:'Completa el módulo de Inglés para IP y Patentes.', points:350, tier:'Gold' },
  { id:'t_376', name:'Blockchain EN', category:'english', description:'Completa el módulo de Inglés para Blockchain y Criptomonedas.', points:350, tier:'Gold' },
  { id:'t_377', name:'Ciberseguridad EN', category:'english', description:'Completa el módulo de Inglés para Ciberseguridad Empresarial.', points:350, tier:'Gold' },
  { id:'t_378', name:'Cloud Computing EN', category:'english', description:'Completa el módulo de Inglés para Cloud y SaaS.', points:300, tier:'Gold' },
  { id:'t_379', name:'Machine Learning EN', category:'english', description:'Completa el módulo de Inglés para Machine Learning.', points:350, tier:'Gold' },
  { id:'t_380', name:'IoT EN', category:'english', description:'Completa el módulo de Inglés para Internet de las Cosas.', points:300, tier:'Gold' },
  { id:'t_381', name:'Frase del Día 30', category:'english', description:'Aprende la Frase Ejecutiva del Día durante 30 días consecutivos.', points:200, tier:'Silver' },
  { id:'t_382', name:'Frase del Día 100', category:'english', description:'Aprende la Frase Ejecutiva del Día durante 100 días en total.', points:400, tier:'Gold' },
  { id:'t_383', name:'Modo Inmersión EN', category:'english', description:'Completa 10 lecciones consecutivas solo en inglés sin traducción.', points:300, tier:'Gold' },
  { id:'t_384', name:'Debate Ganado EN', category:'english', description:'Gana un debate simulado en inglés con el simulador interactivo.', points:350, tier:'Gold' },
  { id:'t_385', name:'Presentación 10/10', category:'english', description:'Logra puntuación perfecta en el simulador de presentaciones ejecutivas.', points:450, tier:'Platinum' },
  { id:'t_386', name:'Negociación Exitosa EN', category:'english', description:'Cierra un trato simulado con éxito en el módulo de negociaciones.', points:400, tier:'Gold' },
  { id:'t_387', name:'Discurso Ejecutivo EN', category:'english', description:'Completa el módulo de Discurso Ejecutivo con puntuación máxima.', points:400, tier:'Gold' },
  { id:'t_388', name:'Reporte Anual EN', category:'english', description:'Completa el módulo de Redacción de Reportes Anuales en inglés.', points:350, tier:'Gold' },
  { id:'t_389', name:'Memo Ejecutivo EN', category:'english', description:'Completa el módulo de Redacción de Memos Ejecutivos.', points:250, tier:'Silver' },
  { id:'t_390', name:'Propuesta de Negocio EN', category:'english', description:'Completa el módulo de Redacción de Propuestas Comerciales.', points:350, tier:'Gold' },
  { id:'t_391', name:'Acuerdo Comercial EN', category:'english', description:'Completa el módulo de Redacción de Acuerdos Comerciales en inglés.', points:400, tier:'Gold' },
  { id:'t_392', name:'Inglés para Headhunters', category:'english', description:'Completa el módulo de Inglés para Reclutamiento Ejecutivo.', points:300, tier:'Gold' },
  { id:'t_393', name:'Coaching en Inglés', category:'english', description:'Completa el módulo de Inglés para Coaching Empresarial.', points:300, tier:'Gold' },
  { id:'t_394', name:'Mentoría EN', category:'english', description:'Completa el módulo de Inglés para Programas de Mentoría.', points:300, tier:'Gold' },
  { id:'t_395', name:'Change Management EN', category:'english', description:'Completa el módulo de Inglés para Gestión del Cambio.', points:350, tier:'Gold' },
  { id:'t_396', name:'Agile EN', category:'english', description:'Completa el módulo de Inglés para Metodologías Ágiles.', points:300, tier:'Gold' },
  { id:'t_397', name:'Design Thinking EN', category:'english', description:'Completa el módulo de Inglés para Design Thinking.', points:300, tier:'Gold' },
  { id:'t_398', name:'Six Sigma EN', category:'english', description:'Completa el módulo de Inglés para Six Sigma y Lean.', points:350, tier:'Gold' },
  { id:'t_399', name:'Diversidad e Inclusión EN', category:'english', description:'Completa el módulo de Inglés para D&I Corporativo.', points:300, tier:'Gold' },
  { id:'t_400', name:'Maestro de Inglés Ejecutivo', category:'english', description:'Completa el 80% de todos los módulos de inglés corporativo disponibles.', points:1000, tier:'Obsidian' },
];

// ── CATEGORY 4: FRANCÉS CORPORATIVO (t_401–t_520) ── 120 trofeos
const FRANCES: TrophyItem[] = [
  { id:'t_401', name:'Bonjour Exécutif', category:'french', description:'Completa tu primera lección de Francés Corporativo.', points:50, tier:'Bronze' },
  { id:'t_402', name:'A1 Français Initié', category:'french', description:'Completa 3 lecciones de nivel A1 en Francés.', points:75, tier:'Bronze' },
  { id:'t_403', name:'A1 Français Maîtrisé', category:'french', description:'Completa todas las lecciones del nivel A1 en Francés.', points:150, tier:'Bronze' },
  { id:'t_404', name:'A2 Français Initié', category:'french', description:'Completa 3 lecciones de nivel A2 en Francés.', points:100, tier:'Bronze' },
  { id:'t_405', name:'A2 Français Maîtrisé', category:'french', description:'Completa todas las lecciones del nivel A2 en Francés.', points:200, tier:'Silver' },
  { id:'t_406', name:'B1 Français Initié', category:'french', description:'Completa 3 lecciones de nivel B1 en Francés.', points:150, tier:'Silver' },
  { id:'t_407', name:'B1 Français Maîtrisé', category:'french', description:'Completa todas las lecciones del nivel B1 en Francés.', points:300, tier:'Silver' },
  { id:'t_408', name:'B2 Français Initié', category:'french', description:'Completa 3 lecciones de nivel B2 en Francés.', points:200, tier:'Silver' },
  { id:'t_409', name:'B2 Français Maîtrisé', category:'french', description:'Completa todas las lecciones del nivel B2 en Francés.', points:400, tier:'Gold' },
  { id:'t_410', name:'C1 Français Initié', category:'french', description:'Completa 3 lecciones de nivel C1 en Francés.', points:300, tier:'Gold' },
  { id:'t_411', name:'C1 Français Maîtrisé', category:'french', description:'Completa todas las lecciones del nivel C1 en Francés.', points:600, tier:'Platinum' },
  { id:'t_412', name:'C2 Français Légendaire', category:'french', description:'Completa todas las lecciones del nivel C2 en Francés.', points:900, tier:'Obsidian' },
  { id:'t_413', name:'Initiation Seine', category:'french', description:'Completa tu primera lección de Francés Corporativo A1.', points:100, tier:'Bronze' },
  { id:'t_414', name:'Symphonie Administrative', category:'french', description:'Domina los términos de administración gerencial en Francés.', points:200, tier:'Silver' },
  { id:'t_415', name:'Relations Publiques Paris', category:'french', description:'Completa el módulo A2 de Francés sin fallar ninguna pregunta.', points:250, tier:'Gold' },
  { id:'t_416', name:'Discours Managérial', category:'french', description:'Alcanza con éxito el nivel B2 de Francés Corporativo.', points:300, tier:'Gold' },
  { id:'t_417', name:'C-Level Français', category:'french', description:'Completa el examen final de Francés con Estatus Pro.', points:500, tier:'Platinum' },
  { id:'t_418', name:'Négociations Françaises', category:'french', description:'Completa el módulo de Negociaciones en Francés.', points:300, tier:'Gold' },
  { id:'t_419', name:'Présentations Exécutives', category:'french', description:'Completa el módulo de Presentaciones Ejecutivas en Francés.', points:300, tier:'Gold' },
  { id:'t_420', name:'Emails Professionnels', category:'french', description:'Completa el módulo de Redacción de Emails Profesionales en Francés.', points:200, tier:'Silver' },
  { id:'t_421', name:'Réunions d\'Affaires', category:'french', description:'Completa el módulo de Conducción de Reuniones en Francés.', points:250, tier:'Silver' },
  { id:'t_422', name:'Conférences Internationales FR', category:'french', description:'Completa el módulo de Inglés para Conferencias Internacionales en Francés.', points:300, tier:'Gold' },
  { id:'t_423', name:'Finance Française', category:'french', description:'Completa el módulo de Terminología Financiera en Francés.', points:300, tier:'Gold' },
  { id:'t_424', name:'Droit des Affaires FR', category:'french', description:'Completa el módulo de Derecho de los Negocios en Francés.', points:350, tier:'Gold' },
  { id:'t_425', name:'Marketing Français', category:'french', description:'Completa el módulo de Marketing y Publicidad en Francés.', points:250, tier:'Silver' },
  { id:'t_426', name:'Ressources Humaines FR', category:'french', description:'Completa el módulo de RRHH en Francés.', points:250, tier:'Silver' },
  { id:'t_427', name:'Technologie FR', category:'french', description:'Completa el módulo de Tecnología e Innovación en Francés.', points:300, tier:'Gold' },
  { id:'t_428', name:'Santé et Pharma FR', category:'french', description:'Completa el módulo de Salud y Farmacéutica en Francés.', points:300, tier:'Gold' },
  { id:'t_429', name:'Diplomatie Française', category:'french', description:'Completa el módulo de Diplomacia en Francés.', points:400, tier:'Platinum' },
  { id:'t_430', name:'10 Lecciones FR', category:'french', description:'Completa 10 lecciones de Francés Corporativo.', points:100, tier:'Bronze' },
  { id:'t_431', name:'25 Lecciones FR', category:'french', description:'Completa 25 lecciones de Francés Corporativo.', points:200, tier:'Silver' },
  { id:'t_432', name:'50 Lecciones FR', category:'french', description:'Completa 50 lecciones de Francés Corporativo.', points:300, tier:'Gold' },
  { id:'t_433', name:'100 Lecciones FR', category:'french', description:'Completa 100 lecciones de Francés Corporativo.', points:500, tier:'Platinum' },
  { id:'t_434', name:'Précision FR 5 suivis', category:'french', description:'Obtén 100% en 5 lecciones consecutivas de Francés.', points:250, tier:'Silver' },
  { id:'t_435', name:'Précision FR 10 suivis', category:'french', description:'Obtén 100% en 10 lecciones consecutivas de Francés.', points:400, tier:'Gold' },
  { id:'t_436', name:'Vocabulaire A1 FR', category:'french', description:'Aprende las 500 palabras esenciales A1 en Francés.', points:100, tier:'Bronze' },
  { id:'t_437', name:'Vocabulaire B1 FR', category:'french', description:'Aprende las 2,000 palabras esenciales B1 en Francés.', points:200, tier:'Silver' },
  { id:'t_438', name:'Vocabulaire C1 FR', category:'french', description:'Aprende las 5,000 palabras esenciales C1 en Francés.', points:450, tier:'Platinum' },
  { id:'t_439', name:'Grammaire Française', category:'french', description:'Completa el módulo de Gramática Avanzada del Francés.', points:350, tier:'Gold' },
  { id:'t_440', name:'Prononciation FR', category:'french', description:'Logra 90%+ en el módulo de Pronunciación en Francés.', points:350, tier:'Gold' },
  { id:'t_441', name:'Expression Orale FR', category:'french', description:'Completa el módulo de Expresión Oral Ejecutiva en Francés.', points:300, tier:'Gold' },
  { id:'t_442', name:'Compréhension Orale FR', category:'french', description:'Logra 90%+ en el módulo de Comprensión Oral en Francés.', points:300, tier:'Gold' },
  { id:'t_443', name:'Rédaction Professionnelle', category:'french', description:'Completa el módulo de Redacción Profesional en Francés.', points:300, tier:'Gold' },
  { id:'t_444', name:'Rapport Annuel FR', category:'french', description:'Redacta un reporte anual simulado en Francés.', points:350, tier:'Gold' },
  { id:'t_445', name:'Leadership Français', category:'french', description:'Completa el módulo de Liderazgo Ejecutivo en Francés.', points:400, tier:'Gold' },
  { id:'t_446', name:'Présentation Parfaite FR', category:'french', description:'Logra puntuación perfecta en el simulador de presentaciones en Francés.', points:450, tier:'Platinum' },
  { id:'t_447', name:'Débat Exécutif FR', category:'french', description:'Gana un debate simulado en Francés con el sistema.', points:350, tier:'Gold' },
  { id:'t_448', name:'Proposition Commerciale FR', category:'french', description:'Redacta una propuesta comercial perfecta en Francés.', points:350, tier:'Gold' },
  { id:'t_449', name:'Accord Commercial FR', category:'french', description:'Completa el módulo de Acuerdos Comerciales en Francés.', points:400, tier:'Gold' },
  { id:'t_450', name:'Gestion de Crise FR', category:'french', description:'Completa el módulo de Gestión de Crisis en Francés.', points:400, tier:'Gold' },
  { id:'t_451', name:'Startup FR', category:'french', description:'Completa el módulo de Francés para Startups.', points:300, tier:'Gold' },
  { id:'t_452', name:'Finance Avancée FR', category:'french', description:'Completa el módulo de Finanzas Avanzadas en Francés.', points:400, tier:'Platinum' },
  { id:'t_453', name:'Conformité FR', category:'french', description:'Completa el módulo de Compliance en Francés.', points:350, tier:'Gold' },
  { id:'t_454', name:'Gouvernance FR', category:'french', description:'Completa el módulo de Gobierno Corporativo en Francés.', points:400, tier:'Platinum' },
  { id:'t_455', name:'ESG Français', category:'french', description:'Completa el módulo de Reportes ESG en Francés.', points:350, tier:'Gold' },
  { id:'t_456', name:'Fusions-Acquisitions FR', category:'french', description:'Completa el módulo de M&A en Francés.', points:450, tier:'Platinum' },
  { id:'t_457', name:'Banque d\'Investissement FR', category:'french', description:'Completa el módulo de Banca de Inversión en Francés.', points:450, tier:'Platinum' },
  { id:'t_458', name:'Stratégie d\'Entreprise FR', category:'french', description:'Completa el módulo de Estrategia Empresarial en Francés.', points:400, tier:'Gold' },
  { id:'t_459', name:'Innovation FR', category:'french', description:'Completa el módulo de Innovación Corporativa en Francés.', points:350, tier:'Gold' },
  { id:'t_460', name:'Développement Durable FR', category:'french', description:'Completa el módulo de Desarrollo Sostenible en Francés.', points:350, tier:'Gold' },
  { id:'t_461', name:'Relations Internationales FR', category:'french', description:'Completa el módulo de Relaciones Internacionales en Francés.', points:400, tier:'Gold' },
  { id:'t_462', name:'Commerce International FR', category:'french', description:'Completa el módulo de Comercio Internacional en Francés.', points:400, tier:'Gold' },
  { id:'t_463', name:'Supply Chain FR', category:'french', description:'Completa el módulo de Supply Chain en Francés.', points:350, tier:'Gold' },
  { id:'t_464', name:'Luxe et Prestige FR', category:'french', description:'Completa el módulo de Gestión de Marcas de Lujo en Francés.', points:450, tier:'Platinum' },
  { id:'t_465', name:'Mode et Design FR', category:'french', description:'Completa el módulo de Francés para Moda y Diseño.', points:300, tier:'Gold' },
  { id:'t_466', name:'Gastronomie d\'Affaires', category:'french', description:'Completa el módulo de Francés para Negocios en la Mesa.', points:250, tier:'Silver' },
  { id:'t_467', name:'Art et Culture FR', category:'french', description:'Completa el módulo de Francés para Arte y Cultura Corporativa.', points:300, tier:'Gold' },
  { id:'t_468', name:'Tourisme d\'Affaires FR', category:'french', description:'Completa el módulo de Francés para Turismo de Negocios.', points:250, tier:'Silver' },
  { id:'t_469', name:'Franchise FR', category:'french', description:'Completa el módulo de Francés para Franquicias.', points:300, tier:'Gold' },
  { id:'t_470', name:'E-Commerce FR', category:'french', description:'Completa el módulo de Francés para E-Commerce.', points:300, tier:'Gold' },
  { id:'t_471', name:'Immobilier Commercial FR', category:'french', description:'Completa el módulo de Francés para Bienes Raíces Comerciales.', points:300, tier:'Gold' },
  { id:'t_472', name:'Assurance FR', category:'french', description:'Completa el módulo de Francés para el Sector Asegurador.', points:300, tier:'Gold' },
  { id:'t_473', name:'Audit FR', category:'french', description:'Completa el módulo de Francés para Auditoría.', points:350, tier:'Gold' },
  { id:'t_474', name:'Fiscalité FR', category:'french', description:'Completa el módulo de Francés para Tributación.', points:350, tier:'Gold' },
  { id:'t_475', name:'Franchise Internationale FR', category:'french', description:'Completa el módulo de Franquicias Internacionales en Francés.', points:400, tier:'Gold' },
  { id:'t_476', name:'Agroalimentaire FR', category:'french', description:'Completa el módulo de Francés para Agronegocios.', points:300, tier:'Gold' },
  { id:'t_477', name:'Énergie FR', category:'french', description:'Completa el módulo de Francés para el Sector Energético.', points:300, tier:'Gold' },
  { id:'t_478', name:'Santé Publique FR', category:'french', description:'Completa el módulo de Francés para Salud Pública.', points:300, tier:'Gold' },
  { id:'t_479', name:'Éducation FR', category:'french', description:'Completa el módulo de Francés para el Sector Educativo.', points:250, tier:'Silver' },
  { id:'t_480', name:'Administration Publique FR', category:'french', description:'Completa el módulo de Francés para Administración Pública.', points:350, tier:'Gold' },
  { id:'t_481', name:'ONG et Humanitaire FR', category:'french', description:'Completa el módulo de Francés para ONGs y Humanitario.', points:300, tier:'Gold' },
  { id:'t_482', name:'Médias et Communication FR', category:'french', description:'Completa el módulo de Francés para Medios.', points:300, tier:'Gold' },
  { id:'t_483', name:'Droit International FR', category:'french', description:'Completa el módulo de Derecho Internacional en Francés.', points:400, tier:'Platinum' },
  { id:'t_484', name:'Propriété Intellectuelle FR', category:'french', description:'Completa el módulo de Propiedad Intelectual en Francés.', points:350, tier:'Gold' },
  { id:'t_485', name:'Brevets et Marques FR', category:'french', description:'Completa el módulo de Patentes y Marcas en Francés.', points:350, tier:'Gold' },
  { id:'t_486', name:'Blockchain FR', category:'french', description:'Completa el módulo de Blockchain en Francés.', points:350, tier:'Gold' },
  { id:'t_487', name:'Systèmes Cognitifs et Transformation FR', category:'french', description:'Completa el módulo de Sistemas y Transformación Digital en Francés.', points:400, tier:'Gold' },
  { id:'t_488', name:'Cybersécurité FR', category:'french', description:'Completa el módulo de Ciberseguridad en Francés.', points:350, tier:'Gold' },
  { id:'t_489', name:'Cloud Computing FR', category:'french', description:'Completa el módulo de Cloud Computing en Francés.', points:300, tier:'Gold' },
  { id:'t_490', name:'Data Science FR', category:'french', description:'Completa el módulo de Data Science en Francés.', points:350, tier:'Gold' },
  { id:'t_491', name:'Immersion Totale FR', category:'french', description:'Completa 10 lecciones consecutivas en Francés sin ayuda de traducción.', points:400, tier:'Gold' },
  { id:'t_492', name:'Accent Parisien', category:'french', description:'Logra 90%+ en el módulo de Fonética del Francés Parisino.', points:450, tier:'Platinum' },
  { id:'t_493', name:'Liaison Française', category:'french', description:'Domina el módulo de Liaison y Encadenamiento en Francés.', points:350, tier:'Gold' },
  { id:'t_494', name:'Élision Maîtrisée', category:'french', description:'Domina el módulo de Elision en el Francés oral.', points:300, tier:'Gold' },
  { id:'t_495', name:'Subjonctif Maîtrisé', category:'french', description:'Completa el módulo del Subjuntivo en Francés con 95%+.', points:400, tier:'Gold' },
  { id:'t_496', name:'Conditionnel Exécutif', category:'french', description:'Domina el uso del Condicional en Francés de negocios.', points:350, tier:'Gold' },
  { id:'t_497', name:'Vocabulaire des Affaires 500', category:'french', description:'Domina 500 palabras del vocabulario de negocios en Francés.', points:300, tier:'Gold' },
  { id:'t_498', name:'Vocabulaire des Affaires 1000', category:'french', description:'Domina 1,000 palabras del vocabulario de negocios en Francés.', points:500, tier:'Platinum' },
  { id:'t_499', name:'FR Parfait 3 fois', category:'french', description:'Logra 100% en 3 lecciones de Francés diferentes.', points:250, tier:'Silver' },
  { id:'t_500', name:'FR Parfait 10 fois', category:'french', description:'Logra 100% en 10 lecciones de Francés diferentes.', points:450, tier:'Platinum' },
  { id:'t_501', name:'Français des Médias', category:'french', description:'Comprende 5 fragmentos de noticias en Francés sin errores.', points:300, tier:'Gold' },
  { id:'t_502', name:'Lecture Rapide FR', category:'french', description:'Lee y comprende un texto de negocios en Francés en tiempo récord.', points:300, tier:'Gold' },
  { id:'t_503', name:'Dictée Exécutive', category:'french', description:'Completa la dictée ejecutiva en Francés con 95%+ de precisión.', points:400, tier:'Gold' },
  { id:'t_504', name:'Rapport de Gestion FR', category:'french', description:'Redacta un informe de gestión en Francés.', points:400, tier:'Platinum' },
  { id:'t_505', name:'Compte Rendu FR', category:'french', description:'Redacta un compte rendu de reunión en Francés.', points:300, tier:'Gold' },
  { id:'t_506', name:'Note de Service FR', category:'french', description:'Redacta una note de service en Francés.', points:250, tier:'Silver' },
  { id:'t_507', name:'Exposé Oral FR', category:'french', description:'Completa un exposé oral en Francés con el simulador interactivo.', points:350, tier:'Gold' },
  { id:'t_508', name:'Interview d\'Embauche FR', category:'french', description:'Supera el módulo de entrevistas de trabajo en Francés.', points:300, tier:'Gold' },
  { id:'t_509', name:'Réseautage Professionnel FR', category:'french', description:'Completa el módulo de Networking Profesional en Francés.', points:250, tier:'Silver' },
  { id:'t_510', name:'FR 3 mois consécutifs', category:'french', description:'Estudia Francés durante 3 meses continuos en OnixLingo.', points:400, tier:'Gold' },
  { id:'t_511', name:'FR 6 mois consécutifs', category:'french', description:'Estudia Francés durante 6 meses continuos en OnixLingo.', points:700, tier:'Obsidian' },
  { id:'t_512', name:'DELF B2 Préparé', category:'french', description:'Completa el curso de preparación para el DELF B2.', points:500, tier:'Platinum' },
  { id:'t_513', name:'DALF C1 Préparé', category:'french', description:'Completa el curso de preparación para el DALF C1.', points:600, tier:'Platinum' },
  { id:'t_514', name:'Vitesse de Lecture FR', category:'french', description:'Lee 200 palabras por minuto en Francés con 90%+ de comprensión.', points:350, tier:'Gold' },
  { id:'t_515', name:'Vitesse de Parole FR', category:'french', description:'Habla a 120 WPM en Francés con fluidez medida.', points:400, tier:'Gold' },
  { id:'t_516', name:'Français par Semaine 5', category:'french', description:'Estudia Francés al menos 5 días a la semana durante un mes.', points:300, tier:'Gold' },
  { id:'t_517', name:'Maître du Français', category:'french', description:'Completa el 70% de todos los módulos de Francés Corporativo.', points:800, tier:'Obsidian' },
  { id:'t_518', name:'Expert Bilingue FR', category:'french', description:'Combina 100+ lecciones de inglés y francés en la misma plataforma.', points:600, tier:'Platinum' },
  { id:'t_519', name:'Francophone Exécutif', category:'french', description:'Logra nivel B2+ medido en todos los módulos de Francés Corporativo.', points:700, tier:'Obsidian' },
  { id:'t_520', name:'Leyenda del Francés', category:'french', description:'Completa el 100% de todos los módulos de Francés Corporativo disponibles.', points:1000, tier:'Obsidian' },
];

// ── CATEGORY 5: CHINO CORPORATIVO (t_521–t_640) ── 120 trofeos
const CHINO: TrophyItem[] = [
  { id:'t_521', name:'你好 Ejecutivo', category:'chinese', description:'Completa tu primera lección de Chino Corporativo.', points:50, tier:'Bronze' },
  { id:'t_522', name:'HSK 1 Corporativo', category:'chinese', description:'Completa 3 lecciones del nivel HSK 1 corporativo.', points:75, tier:'Bronze' },
  { id:'t_523', name:'HSK 1 Dominado', category:'chinese', description:'Completa todas las lecciones del nivel HSK 1 corporativo.', points:150, tier:'Bronze' },
  { id:'t_524', name:'HSK 2 Corporativo', category:'chinese', description:'Completa 3 lecciones del nivel HSK 2 corporativo.', points:100, tier:'Bronze' },
  { id:'t_525', name:'HSK 2 Dominado', category:'chinese', description:'Completa todas las lecciones del nivel HSK 2 corporativo.', points:200, tier:'Silver' },
  { id:'t_526', name:'HSK 3 Corporativo', category:'chinese', description:'Completa 3 lecciones del nivel HSK 3 corporativo.', points:150, tier:'Silver' },
  { id:'t_527', name:'HSK 3 Dominado', category:'chinese', description:'Completa todas las lecciones del nivel HSK 3 corporativo.', points:300, tier:'Silver' },
  { id:'t_528', name:'HSK 4 Corporativo', category:'chinese', description:'Completa 3 lecciones del nivel HSK 4 corporativo.', points:200, tier:'Silver' },
  { id:'t_529', name:'HSK 4 Dominado', category:'chinese', description:'Completa todas las lecciones del nivel HSK 4 corporativo.', points:400, tier:'Gold' },
  { id:'t_530', name:'HSK 5 Corporativo', category:'chinese', description:'Completa 3 lecciones del nivel HSK 5 corporativo.', points:300, tier:'Gold' },
  { id:'t_531', name:'HSK 5 Dominado', category:'chinese', description:'Completa todas las lecciones del nivel HSK 5 corporativo.', points:600, tier:'Platinum' },
  { id:'t_532', name:'HSK 6 Leyenda', category:'chinese', description:'Completa todas las lecciones del nivel HSK 6 — maestría en chino.', points:900, tier:'Obsidian' },
  { id:'t_533', name:'Protocolo de Beijing', category:'chinese', description:'Completa el módulo de Protocolo Empresarial Chino.', points:200, tier:'Silver' },
  { id:'t_534', name:'Red de Guanxi', category:'chinese', description:'Domina las lecciones de Negociaciones Comerciales en Chino.', points:300, tier:'Gold' },
  { id:'t_535', name:'Etiqueta Empresarial China', category:'chinese', description:'Completa el módulo de etiqueta empresarial china con 3 estrellas.', points:250, tier:'Gold' },
  { id:'t_536', name:'Negociador del Dragón', category:'chinese', description:'Logra completar el nivel B2 de Chino Corporativo.', points:350, tier:'Obsidian' },
  { id:'t_537', name:'CEO Imperial', category:'chinese', description:'Domina todo el currículo ejecutivo de Chino Corporativo C1.', points:500, tier:'Platinum' },
  { id:'t_538', name:'Hanzi Básicos', category:'chinese', description:'Aprende los 150 caracteres Hanzi básicos para negocios.', points:150, tier:'Bronze' },
  { id:'t_539', name:'Hanzi Intermedios', category:'chinese', description:'Aprende 500 caracteres Hanzi para contextos empresariales.', points:300, tier:'Gold' },
  { id:'t_540', name:'Hanzi Avanzados', category:'chinese', description:'Domina 1,000 caracteres Hanzi de uso ejecutivo.', points:500, tier:'Platinum' },
  { id:'t_541', name:'Hanzi Maestro', category:'chinese', description:'Domina 2,000 caracteres Hanzi — nivel periódico chino.', points:700, tier:'Obsidian' },
  { id:'t_542', name:'Pinyin Perfecto', category:'chinese', description:'Logra 95%+ en el módulo de Pinyin y pronunciación.', points:200, tier:'Silver' },
  { id:'t_543', name:'Tonos Dominados', category:'chinese', description:'Domina los 4 tonos del mandarín con 90%+ de precisión.', points:300, tier:'Gold' },
  { id:'t_544', name:'Tono Neutral', category:'chinese', description:'Completa el módulo del tono neutro y su uso empresarial.', points:200, tier:'Silver' },
  { id:'t_545', name:'Chino Mandarín Estándar', category:'chinese', description:'Alcanza nivel Pǔtōnghuà estándar en el módulo de speaking.', points:400, tier:'Gold' },
  { id:'t_546', name:'Negociación China A', category:'chinese', description:'Completa el módulo básico de Negociaciones en Chino.', points:250, tier:'Silver' },
  { id:'t_547', name:'Negociación China B', category:'chinese', description:'Completa el módulo avanzado de Negociaciones en Chino.', points:400, tier:'Gold' },
  { id:'t_548', name:'Reuniones en Chino', category:'chinese', description:'Completa el módulo de Conducción de Reuniones en Chino.', points:250, tier:'Silver' },
  { id:'t_549', name:'Presentación en Chino', category:'chinese', description:'Completa el módulo de Presentaciones Ejecutivas en Chino.', points:300, tier:'Gold' },
  { id:'t_550', name:'Email Chino Corporativo', category:'chinese', description:'Completa el módulo de Redacción de Emails en Chino.', points:200, tier:'Silver' },
  { id:'t_551', name:'Contrato en Chino', category:'chinese', description:'Completa el módulo de Contratos y Acuerdos en Chino.', points:350, tier:'Gold' },
  { id:'t_552', name:'Finanzas en Chino', category:'chinese', description:'Completa el módulo de Terminología Financiera en Chino.', points:300, tier:'Gold' },
  { id:'t_553', name:'Marketing en Chino', category:'chinese', description:'Completa el módulo de Marketing y Branding en Chino.', points:250, tier:'Silver' },
  { id:'t_554', name:'Tech en Chino', category:'chinese', description:'Completa el módulo de Tecnología e Innovación en Chino.', points:300, tier:'Gold' },
  { id:'t_555', name:'Legal en Chino', category:'chinese', description:'Completa el módulo de Derecho Empresarial en Chino.', points:350, tier:'Gold' },
  { id:'t_556', name:'RRHH en Chino', category:'chinese', description:'Completa el módulo de Recursos Humanos en Chino.', points:250, tier:'Silver' },
  { id:'t_557', name:'Comercio Internacional ZH', category:'chinese', description:'Completa el módulo de Comercio Internacional en Chino.', points:350, tier:'Gold' },
  { id:'t_558', name:'Inversiones en China', category:'chinese', description:'Completa el módulo de Inversión y Mercados Chinos.', points:400, tier:'Gold' },
  { id:'t_559', name:'E-Commerce China', category:'chinese', description:'Completa el módulo de E-Commerce en China (Taobao, JD, Tmall).', points:350, tier:'Gold' },
  { id:'t_560', name:'Startup China', category:'chinese', description:'Completa el módulo de Emprendimiento en el Ecosistema Chino.', points:350, tier:'Gold' },
  { id:'t_561', name:'10 Lecciones ZH', category:'chinese', description:'Completa 10 lecciones de Chino Corporativo.', points:100, tier:'Bronze' },
  { id:'t_562', name:'25 Lecciones ZH', category:'chinese', description:'Completa 25 lecciones de Chino Corporativo.', points:200, tier:'Silver' },
  { id:'t_563', name:'50 Lecciones ZH', category:'chinese', description:'Completa 50 lecciones de Chino Corporativo.', points:300, tier:'Gold' },
  { id:'t_564', name:'100 Lecciones ZH', category:'chinese', description:'Completa 100 lecciones de Chino Corporativo.', points:500, tier:'Platinum' },
  { id:'t_565', name:'Precisión ZH 5 seguidas', category:'chinese', description:'Obtén 100% en 5 lecciones consecutivas de Chino.', points:250, tier:'Silver' },
  { id:'t_566', name:'Precisión ZH 10 seguidas', category:'chinese', description:'Obtén 100% en 10 lecciones consecutivas de Chino.', points:400, tier:'Gold' },
  { id:'t_567', name:'Dictado en Chino', category:'chinese', description:'Completa un dictado en caracteres chinos con 90%+ de precisión.', points:350, tier:'Gold' },
  { id:'t_568', name:'Lectura ZH Avanzada', category:'chinese', description:'Lee un texto empresarial en chino sin apoyo de Pinyin.', points:400, tier:'Gold' },
  { id:'t_569', name:'Escritura ZH Avanzada', category:'chinese', description:'Escribe un memo en caracteres chinos sin errores.', points:450, tier:'Platinum' },
  { id:'t_570', name:'Escucha ZH Perfecta', category:'chinese', description:'Comprende un audio de noticias económicas chinas sin subtítulos.', points:400, tier:'Gold' },
  { id:'t_571', name:'BCG en Chino', category:'chinese', description:'Completa el módulo de Gestión Estratégica en Chino.', points:400, tier:'Gold' },
  { id:'t_572', name:'Recursos ZH B1', category:'chinese', description:'Aprende los 1,000 vocabularios más usados en negocios chinos (B1).', points:300, tier:'Gold' },
  { id:'t_573', name:'Recursos ZH B2', category:'chinese', description:'Aprende los 2,000 vocabularios más usados en negocios chinos (B2).', points:450, tier:'Platinum' },
  { id:'t_574', name:'Chino 3 meses', category:'chinese', description:'Estudia Chino durante 3 meses continuos en OnixLingo.', points:400, tier:'Gold' },
  { id:'t_575', name:'Chino 6 meses', category:'chinese', description:'Estudia Chino durante 6 meses continuos en OnixLingo.', points:700, tier:'Obsidian' },
  { id:'t_576', name:'Protocolo de Shanghai', category:'chinese', description:'Completa el módulo de Protocolo Empresarial de Shanghai.', points:300, tier:'Gold' },
  { id:'t_577', name:'Belt and Road EN/ZH', category:'chinese', description:'Completa el módulo de la Ruta de la Seda en Chino.', points:400, tier:'Gold' },
  { id:'t_578', name:'BRICS en Chino', category:'chinese', description:'Completa el módulo de Geopolítica BRICS en Chino.', points:400, tier:'Gold' },
  { id:'t_579', name:'Mercado ASEAN ZH', category:'chinese', description:'Completa el módulo de Mercados ASEAN en Chino.', points:350, tier:'Gold' },
  { id:'t_580', name:'Chino para Exportadores', category:'chinese', description:'Completa el módulo de Chino para Empresas Exportadoras.', points:350, tier:'Gold' },
  { id:'t_581', name:'Chino para Importadores', category:'chinese', description:'Completa el módulo de Chino para Empresas Importadoras.', points:350, tier:'Gold' },
  { id:'t_582', name:'WeChat Business', category:'chinese', description:'Completa el módulo de Comunicación Empresarial por WeChat.', points:250, tier:'Silver' },
  { id:'t_583', name:'Alibaba Ecosystem', category:'chinese', description:'Completa el módulo de Ecosistema Alibaba para Negocios.', points:300, tier:'Gold' },
  { id:'t_584', name:'Baidu SEO ZH', category:'chinese', description:'Completa el módulo de Marketing Digital en China (Baidu SEO).', points:300, tier:'Gold' },
  { id:'t_585', name:'Industria Automotriz ZH', category:'chinese', description:'Completa el módulo de Chino para la Industria Automotriz.', points:300, tier:'Gold' },
  { id:'t_586', name:'Energía Renovable ZH', category:'chinese', description:'Completa el módulo de Chino para Energías Renovables.', points:300, tier:'Gold' },
  { id:'t_587', name:'Sector Salud ZH', category:'chinese', description:'Completa el módulo de Chino para el Sector Salud.', points:300, tier:'Gold' },
  { id:'t_588', name:'Real Estate ZH', category:'chinese', description:'Completa el módulo de Chino para Bienes Raíces.', points:300, tier:'Gold' },
  { id:'t_589', name:'Educación ZH', category:'chinese', description:'Completa el módulo de Chino para el Sector Educativo.', points:250, tier:'Silver' },
  { id:'t_590', name:'Manufactura ZH', category:'chinese', description:'Completa el módulo de Chino para Manufactura.', points:300, tier:'Gold' },
  { id:'t_591', name:'Logística ZH', category:'chinese', description:'Completa el módulo de Chino para Logística y Distribución.', points:300, tier:'Gold' },
  { id:'t_592', name:'Gobierno ZH', category:'chinese', description:'Completa el módulo de Chino para Relaciones con el Gobierno.', points:350, tier:'Gold' },
  { id:'t_593', name:'Banca ZH', category:'chinese', description:'Completa el módulo de Chino para el Sector Bancario.', points:350, tier:'Gold' },
  { id:'t_594', name:'Seguros ZH', category:'chinese', description:'Completa el módulo de Chino para el Sector Asegurador.', points:300, tier:'Gold' },
  { id:'t_595', name:'Private Banking ZH', category:'chinese', description:'Completa el módulo de Banca Privada en Chino.', points:400, tier:'Platinum' },
  { id:'t_596', name:'Bolsa de Shanghái', category:'chinese', description:'Completa el módulo de Mercados de Capitales Chinos.', points:400, tier:'Platinum' },
  { id:'t_597', name:'Yuan y Mercados ZH', category:'chinese', description:'Completa el módulo de Economía y Finanzas del Yuan.', points:400, tier:'Gold' },
  { id:'t_598', name:'Inmersión Total ZH', category:'chinese', description:'Completa 10 lecciones consecutivas en Chino sin ayuda de traducción.', points:500, tier:'Platinum' },
  { id:'t_599', name:'Conversación ZH Fluida', category:'chinese', description:'Completa una conversación de 5 minutos en chino mandarín con el sistema.', points:500, tier:'Platinum' },
  { id:'t_600', name:'Maestro del Chino Ejecutivo', category:'chinese', description:'Completa el 80% de todos los módulos de Chino Corporativo.', points:1000, tier:'Obsidian' },
  { id:'t_601', name:'Comprensión ZH Nivel 4', category:'chinese', description:'Logra 90%+ en comprensión lectora de nivel HSK 4 corporativo.', points:350, tier:'Gold' },
  { id:'t_602', name:'Expresión ZH Nivel 4', category:'chinese', description:'Logra 90%+ en expresión escrita de nivel HSK 4 corporativo.', points:350, tier:'Gold' },
  { id:'t_603', name:'Oral ZH Nivel 4', category:'chinese', description:'Logra 90%+ en expresión oral de nivel HSK 4 corporativo.', points:350, tier:'Gold' },
  { id:'t_604', name:'ZH Perfecto 3 veces', category:'chinese', description:'Logra 100% en 3 lecciones de Chino diferentes.', points:250, tier:'Silver' },
  { id:'t_605', name:'ZH Perfecto 10 veces', category:'chinese', description:'Logra 100% en 10 lecciones de Chino diferentes.', points:450, tier:'Platinum' },
  { id:'t_606', name:'Cantonés Básico', category:'chinese', description:'Completa el módulo introductorio de Cantonés para negocios.', points:200, tier:'Silver' },
  { id:'t_607', name:'Caracteres Tradicionales', category:'chinese', description:'Completa el módulo de caracteres tradicionales (Taiwán/HK).', points:300, tier:'Gold' },
  { id:'t_608', name:'Chino Simplificado Oficial', category:'chinese', description:'Dominal sistema simplificado de caracteres con 95%+.', points:400, tier:'Gold' },
  { id:'t_609', name:'Chengyu Empresarial', category:'chinese', description:'Aprende 20 chengyu (proverbios) usados en negocios chinos.', points:350, tier:'Gold' },
  { id:'t_610', name:'Cultura Confuciana Biz', category:'chinese', description:'Completa el módulo de Valores Confucianos en el Mundo Empresarial.', points:300, tier:'Gold' },
  { id:'t_611', name:'Mianzi y Renqing', category:'chinese', description:'Completa el módulo sobre Mianzi (cara) y Renqing en negocios.', points:300, tier:'Gold' },
  { id:'t_612', name:'Guanxi Building', category:'chinese', description:'Completa el módulo de construcción de relaciones Guanxi.', points:350, tier:'Gold' },
  { id:'t_613', name:'Banquete de Negocios ZH', category:'chinese', description:'Completa el módulo de Protocolo de Banquetes Corporativos Chinos.', points:250, tier:'Silver' },
  { id:'t_614', name:'Regalos Corporativos ZH', category:'chinese', description:'Completa el módulo de Etiqueta de Regalos en Negocios Chinos.', points:200, tier:'Silver' },
  { id:'t_615', name:'Feria de Canton', category:'chinese', description:'Completa el módulo de Participación en Ferias Comerciales Chinas.', points:300, tier:'Gold' },
  { id:'t_616', name:'Zona Libre Shanghai', category:'chinese', description:'Completa el módulo de Negocios en Zonas Económicas Libres de China.', points:350, tier:'Gold' },
  { id:'t_617', name:'Contrato Bicultural', category:'chinese', description:'Completa el módulo de Contratos Bilaterales China-Occidente.', points:400, tier:'Gold' },
  { id:'t_618', name:'Arbitraje Internacional ZH', category:'chinese', description:'Completa el módulo de Arbitraje Comercial Internacional en Chino.', points:400, tier:'Platinum' },
  { id:'t_619', name:'IP China', category:'chinese', description:'Completa el módulo de Propiedad Intelectual en China.', points:400, tier:'Gold' },
  { id:'t_620', name:'Due Diligence China', category:'chinese', description:'Completa el módulo de Due Diligence para Mercados Chinos.', points:450, tier:'Platinum' },
  { id:'t_621', name:'Reporte Anual ZH', category:'chinese', description:'Comprende y analiza un reporte anual corporativo chino.', points:400, tier:'Gold' },
  { id:'t_622', name:'Noticias Económicas ZH', category:'chinese', description:'Comprende 10 noticias económicas chinas sin diccionario.', points:350, tier:'Gold' },
  { id:'t_623', name:'Chino por Semana 5', category:'chinese', description:'Estudia Chino al menos 5 días a la semana durante un mes.', points:300, tier:'Gold' },
  { id:'t_624', name:'Maratón ZH', category:'chinese', description:'Estudia Chino más de 5 horas en un solo día.', points:350, tier:'Gold' },
  { id:'t_625', name:'Racha ZH 21 días', category:'chinese', description:'Mantén una racha de estudio de Chino durante 21 días seguidos.', points:300, tier:'Gold' },
  { id:'t_626', name:'Racha ZH 60 días', category:'chinese', description:'Mantén una racha de estudio de Chino durante 60 días seguidos.', points:600, tier:'Obsidian' },
  { id:'t_627', name:'Revisión Intensiva ZH', category:'chinese', description:'Completa 3 repasos del mismo nivel de Chino en la misma semana.', points:200, tier:'Silver' },
  { id:'t_628', name:'Comparación ZH-EN', category:'chinese', description:'Completa el módulo de diferencias estructurales Chino vs. Inglés.', points:300, tier:'Gold' },
  { id:'t_629', name:'Traducción ZH-EN', category:'chinese', description:'Completa el módulo de Traducción Corporativa Chino-Inglés.', points:400, tier:'Gold' },
  { id:'t_630', name:'Interpretación ZH', category:'chinese', description:'Completa el módulo de Interpretación Simultánea en Chino.', points:500, tier:'Platinum' },
  { id:'t_631', name:'Chino para M&A', category:'chinese', description:'Completa el módulo de M&A en el Mercado Chino.', points:450, tier:'Platinum' },
  { id:'t_632', name:'Chino para Venture Capital', category:'chinese', description:'Completa el módulo de VC e Inversión en Startups Chinas.', points:450, tier:'Platinum' },
  { id:'t_633', name:'Política Económica ZH', category:'chinese', description:'Comprende el módulo de Política Económica del Gobierno Chino.', points:400, tier:'Gold' },
  { id:'t_634', name:'ZH Perfecto 25 veces', category:'chinese', description:'Logra 100% en 25 lecciones de Chino diferentes.', points:700, tier:'Obsidian' },
  { id:'t_635', name:'Habla ZH sin Acento', category:'chinese', description:'Logra 95%+ en el módulo de reducción de acento en Mandarín.', points:500, tier:'Platinum' },
  { id:'t_636', name:'ZH Velocidad C1', category:'chinese', description:'Completa una lección de nivel C1 en Chino con tiempo óptimo.', points:450, tier:'Platinum' },
  { id:'t_637', name:'ZH Simultáneo', category:'chinese', description:'Logra 80%+ en la sesión de interpretación simultánea Chino-Inglés.', points:600, tier:'Platinum' },
  { id:'t_638', name:'Puente Cultural ZH', category:'chinese', description:'Completa los 5 módulos de Inteligencia Cultural China.', points:500, tier:'Platinum' },
  { id:'t_639', name:'Embajador del Chino', category:'chinese', description:'Completa el 90% de todos los módulos de Chino Corporativo.', points:900, tier:'Obsidian' },
  { id:'t_640', name:'Leyenda del Chino', category:'chinese', description:'Completa el 100% de todos los módulos de Chino Corporativo.', points:1000, tier:'Obsidian' },
];

// ── CATEGORY 6: VOCABULARIO & GLOSARIO (t_641–t_750) ── 110 trofeos
const VOCABULARIO: TrophyItem[] = [
  { id:'t_641', name:'Primer Vocablo', category:'vocabulary', description:'Aprende tu primera palabra en el glosario interactivo.', points:25, tier:'Bronze' },
  { id:'t_642', name:'Glosario Iniciado', category:'vocabulary', description:'Completa tu primera lección del vocabulario interactivo.', points:50, tier:'Bronze' },
  { id:'t_643', name:'50 Palabras', category:'vocabulary', description:'Aprende 50 palabras en el glosario corporativo.', points:75, tier:'Bronze' },
  { id:'t_644', name:'100 Palabras', category:'vocabulary', description:'Aprende 100 palabras en el glosario corporativo.', points:100, tier:'Bronze' },
  { id:'t_645', name:'250 Palabras', category:'vocabulary', description:'Aprende 250 palabras en el glosario corporativo.', points:150, tier:'Silver' },
  { id:'t_646', name:'500 Palabras', category:'vocabulary', description:'Aprende 500 palabras en el glosario corporativo.', points:200, tier:'Silver' },
  { id:'t_647', name:'1000 Palabras', category:'vocabulary', description:'Aprende 1,000 palabras en el glosario corporativo.', points:300, tier:'Gold' },
  { id:'t_648', name:'2500 Palabras', category:'vocabulary', description:'Aprende 2,500 palabras en el glosario corporativo.', points:450, tier:'Gold' },
  { id:'t_649', name:'5000 Palabras', category:'vocabulary', description:'Aprende 5,000 palabras en el glosario corporativo.', points:600, tier:'Platinum' },
  { id:'t_650', name:'10000 Palabras', category:'vocabulary', description:'Aprende 10,000 palabras — glosario de élite.', points:900, tier:'Obsidian' },
  { id:'t_651', name:'Vocabulario Empresarial', category:'vocabulary', description:'Completa la categoría Business & Career del glosario.', points:200, tier:'Silver' },
  { id:'t_652', name:'Vocabulario Tecnológico', category:'vocabulary', description:'Completa la categoría Technology & Dev del glosario.', points:250, tier:'Gold' },
  { id:'t_653', name:'Viajero Global', category:'vocabulary', description:'Domina todos los términos de la categoría Global Travel.', points:200, tier:'Silver' },
  { id:'t_654', name:'Vocabulario Financiero', category:'vocabulary', description:'Completa la categoría Financial & Banking del glosario.', points:250, tier:'Gold' },
  { id:'t_655', name:'Vocabulario Legal', category:'vocabulary', description:'Completa la categoría Legal & Compliance del glosario.', points:250, tier:'Gold' },
  { id:'t_656', name:'Vocabulario de Marketing', category:'vocabulary', description:'Completa la categoría Marketing & Branding del glosario.', points:200, tier:'Silver' },
  { id:'t_657', name:'Vocabulario de Salud', category:'vocabulary', description:'Completa la categoría Healthcare & Pharma del glosario.', points:200, tier:'Silver' },
  { id:'t_658', name:'Vocabulario de RRHH', category:'vocabulary', description:'Completa la categoría Human Resources del glosario.', points:200, tier:'Silver' },
  { id:'t_659', name:'Vocabulario de Energía', category:'vocabulary', description:'Completa la categoría Energy & Sustainability del glosario.', points:200, tier:'Silver' },
  { id:'t_660', name:'Vocabulario de Logística', category:'vocabulary', description:'Completa la categoría Logistics & Supply Chain del glosario.', points:200, tier:'Silver' },
  { id:'t_661', name:'Vocabulario de Ventas', category:'vocabulary', description:'Completa la categoría Sales & Business Development del glosario.', points:200, tier:'Silver' },
  { id:'t_662', name:'Vocabulario de Consultoría', category:'vocabulary', description:'Completa la categoría Consulting & Strategy del glosario.', points:250, tier:'Gold' },
  { id:'t_663', name:'Vocabulario de Real Estate', category:'vocabulary', description:'Completa la categoría Real Estate & Construction del glosario.', points:200, tier:'Silver' },
  { id:'t_664', name:'Vocabulario Diplomático', category:'vocabulary', description:'Completa la categoría Diplomacy & International Relations del glosario.', points:250, tier:'Gold' },
  { id:'t_665', name:'Vocabulario Académico', category:'vocabulary', description:'Completa la categoría Academic & Research del glosario.', points:200, tier:'Silver' },
  { id:'t_666', name:'100 Vocablos Sin Fallos', category:'vocabulary', description:'Repasa 100 palabras del glosario sin cometer ningún error.', points:200, tier:'Silver' },
  { id:'t_667', name:'Flashcard 7 Días', category:'vocabulary', description:'Practica flashcards del glosario 7 días consecutivos.', points:150, tier:'Silver' },
  { id:'t_668', name:'Flashcard 30 Días', category:'vocabulary', description:'Practica flashcards del glosario 30 días consecutivos.', points:300, tier:'Gold' },
  { id:'t_669', name:'Flashcard 100 Días', category:'vocabulary', description:'Practica flashcards del glosario 100 días en total.', points:500, tier:'Platinum' },
  { id:'t_670', name:'Glosario de Titanio', category:'vocabulary', description:'Logra un 100% de precisión en un lote del glosario técnico.', points:150, tier:'Silver' },
  { id:'t_671', name:'Racha de Vocabulario 5', category:'vocabulary', description:'Aprende vocabulario nuevo 5 días seguidos.', points:100, tier:'Bronze' },
  { id:'t_672', name:'Racha de Vocabulario 14', category:'vocabulary', description:'Aprende vocabulario nuevo 14 días seguidos.', points:200, tier:'Silver' },
  { id:'t_673', name:'Racha de Vocabulario 30', category:'vocabulary', description:'Aprende vocabulario nuevo 30 días seguidos.', points:350, tier:'Gold' },
  { id:'t_674', name:'Glosario Centenario', category:'vocabulary', description:'Memoriza 100 palabras corporativas en el glosario pro.', points:300, tier:'Gold' },
  { id:'t_675', name:'Velocista de Vocabulario', category:'vocabulary', description:'Completa una sesión de 50 flashcards en menos de 5 minutos.', points:200, tier:'Silver' },
  { id:'t_676', name:'Vocabulario Perfecto x5', category:'vocabulary', description:'Logra 100% en 5 sesiones consecutivas de vocabulario.', points:250, tier:'Silver' },
  { id:'t_677', name:'Vocabulario Perfecto x20', category:'vocabulary', description:'Logra 100% en 20 sesiones de vocabulario.', points:400, tier:'Gold' },
  { id:'t_678', name:'Collocations Maestro', category:'vocabulary', description:'Aprende 200 collocations corporativas esenciales.', points:350, tier:'Gold' },
  { id:'t_679', name:'Phrasal Verbs Maestro', category:'vocabulary', description:'Aprende 100 phrasal verbs de uso ejecutivo.', points:300, tier:'Gold' },
  { id:'t_680', name:'Idioms C-Level', category:'vocabulary', description:'Aprende 50 idioms usados en el nivel Alta Dirección.', points:300, tier:'Gold' },
  { id:'t_681', name:'Sinónimos Ejecutivos', category:'vocabulary', description:'Aprende 100 sinónimos formales para comunicaciones ejecutivas.', points:250, tier:'Silver' },
  { id:'t_682', name:'Antónimos Formales', category:'vocabulary', description:'Aprende 50 pares de antónimos en contextos corporativos.', points:200, tier:'Silver' },
  { id:'t_683', name:'Prefijos y Sufijos Pro', category:'vocabulary', description:'Domina 30 prefijos y sufijos comunes en inglés corporativo.', points:200, tier:'Silver' },
  { id:'t_684', name:'Vocabulario por Sector', category:'vocabulary', description:'Completa el vocabulario especializado de 5 sectores diferentes.', points:400, tier:'Gold' },
  { id:'t_685', name:'Vocabulario Multilingual', category:'vocabulary', description:'Aprende el mismo conjunto de vocabulario en inglés, francés y chino.', points:500, tier:'Platinum' },
  { id:'t_686', name:'Terminología ISO', category:'vocabulary', description:'Aprende 50 términos de estándares ISO y calidad corporativa.', points:300, tier:'Gold' },
  { id:'t_687', name:'Siglas Corporativas', category:'vocabulary', description:'Aprende 100 siglas esenciales del mundo corporativo global.', points:250, tier:'Silver' },
  { id:'t_688', name:'Vocabulario de Crisis', category:'vocabulary', description:'Aprende 50 términos de gestión de crisis corporativa.', points:250, tier:'Silver' },
  { id:'t_689', name:'Vocabulario ESG', category:'vocabulary', description:'Aprende 50 términos ESG y sostenibilidad corporativa.', points:250, tier:'Silver' },
  { id:'t_690', name:'Vocabulario Digital', category:'vocabulary', description:'Aprende 100 términos de transformación digital y tecnología.', points:250, tier:'Silver' },
  { id:'t_691', name:'Vocabulario M&A', category:'vocabulary', description:'Aprende 50 términos de fusiones y adquisiciones.', points:300, tier:'Gold' },
  { id:'t_692', name:'Vocabulario VC', category:'vocabulary', description:'Aprende 50 términos de capital de riesgo y venture capital.', points:300, tier:'Gold' },
  { id:'t_693', name:'Vocabulario Bursátil', category:'vocabulary', description:'Aprende 75 términos del mercado de valores y finanzas.', points:300, tier:'Gold' },
  { id:'t_694', name:'Vocabulario Bancario', category:'vocabulary', description:'Aprende 75 términos del sector bancario y financiero.', points:300, tier:'Gold' },
  { id:'t_695', name:'Vocabulario de Auditoría', category:'vocabulary', description:'Aprende 50 términos de auditoría y control interno.', points:250, tier:'Silver' },
  { id:'t_696', name:'Vocabulario Impositivo', category:'vocabulary', description:'Aprende 50 términos de tributación internacional.', points:250, tier:'Silver' },
  { id:'t_697', name:'Vocabulario de Seguros', category:'vocabulary', description:'Aprende 50 términos del sector asegurador.', points:250, tier:'Silver' },
  { id:'t_698', name:'Vocabulario de Construcción', category:'vocabulary', description:'Aprende 50 términos de la industria de la construcción.', points:200, tier:'Silver' },
  { id:'t_699', name:'Vocabulario Minero', category:'vocabulary', description:'Aprende 50 términos de la industria minera y recursos naturales.', points:200, tier:'Silver' },
  { id:'t_700', name:'Vocabulario Aeroespacial', category:'vocabulary', description:'Aprende 50 términos de la industria aeroespacial.', points:250, tier:'Silver' },
  { id:'t_701', name:'Revisión SRS 7 días', category:'vocabulary', description:'Completa revisiones de Repetición Espaciada (SRS) 7 días seguidos.', points:150, tier:'Silver' },
  { id:'t_702', name:'Revisión SRS 30 días', category:'vocabulary', description:'Completa revisiones SRS 30 días seguidos.', points:300, tier:'Gold' },
  { id:'t_703', name:'100 Palabras Retenidas', category:'vocabulary', description:'Demuestra retención de 100 palabras en revisión posterior.', points:200, tier:'Silver' },
  { id:'t_704', name:'500 Palabras Retenidas', category:'vocabulary', description:'Demuestra retención de 500 palabras en revisión posterior.', points:400, tier:'Gold' },
  { id:'t_705', name:'1000 Palabras Retenidas', category:'vocabulary', description:'Demuestra retención de 1,000 palabras en revisión posterior.', points:600, tier:'Platinum' },
  { id:'t_706', name:'Sinónimos en Contexto', category:'vocabulary', description:'Usa 10 sinónimos formales correctamente en ejercicios de escritura.', points:200, tier:'Silver' },
  { id:'t_707', name:'Collocations en Uso', category:'vocabulary', description:'Usa 20 collocations correctamente en ejercicios de redacción.', points:250, tier:'Silver' },
  { id:'t_708', name:'Phrasal Verbs en Uso', category:'vocabulary', description:'Usa 15 phrasal verbs correctamente en ejercicios.', points:250, tier:'Silver' },
  { id:'t_709', name:'Vocabulario Temático x5', category:'vocabulary', description:'Completa vocabulario temático de 5 categorías distintas.', points:300, tier:'Gold' },
  { id:'t_710', name:'Vocabulario Temático x10', category:'vocabulary', description:'Completa vocabulario temático de 10 categorías distintas.', points:500, tier:'Platinum' },
  { id:'t_711', name:'Categoría Perfecta', category:'vocabulary', description:'Completa una categoría entera del glosario con 100% de precisión.', points:350, tier:'Gold' },
  { id:'t_712', name:'Tres Categorías Perfectas', category:'vocabulary', description:'Completa 3 categorías del glosario con 100% de precisión.', points:600, tier:'Platinum' },
  { id:'t_713', name:'Lote de 25 Perfecto', category:'vocabulary', description:'Completa un lote de 25 flashcards con 100% de precisión.', points:150, tier:'Silver' },
  { id:'t_714', name:'Lote de 50 Perfecto', category:'vocabulary', description:'Completa un lote de 50 flashcards con 100% de precisión.', points:250, tier:'Gold' },
  { id:'t_715', name:'Lote de 100 Perfecto', category:'vocabulary', description:'Completa un lote de 100 flashcards con 100% de precisión.', points:400, tier:'Gold' },
  { id:'t_716', name:'Madrugador de Vocabulario', category:'vocabulary', description:'Practica vocabulario antes de las 7am durante 7 días.', points:200, tier:'Silver' },
  { id:'t_717', name:'500 Sesiones de Vocabulario', category:'vocabulary', description:'Acumula 500 sesiones de práctica de vocabulario en total.', points:700, tier:'Obsidian' },
  { id:'t_718', name:'Vocabulario en Contexto', category:'vocabulary', description:'Completa 50 ejercicios de uso de vocabulario en contexto real.', points:350, tier:'Gold' },
  { id:'t_719', name:'Construcción de Oraciones', category:'vocabulary', description:'Construye 100 oraciones usando vocabulario corporativo.', points:300, tier:'Gold' },
  { id:'t_720', name:'Mapa Mental de Vocabulario', category:'vocabulary', description:'Completa 10 mapas mentales de vocabulario temático.', points:250, tier:'Silver' },
  { id:'t_721', name:'Glosario FR Completado', category:'vocabulary', description:'Completa el glosario completo de Francés Corporativo.', points:500, tier:'Platinum' },
  { id:'t_722', name:'Glosario ZH Completado', category:'vocabulary', description:'Completa el glosario completo de Chino Corporativo.', points:500, tier:'Platinum' },
  { id:'t_723', name:'Glosario EN Completado', category:'vocabulary', description:'Completa el glosario completo de Inglés Corporativo.', points:500, tier:'Platinum' },
  { id:'t_724', name:'Glosario Triple Completado', category:'vocabulary', description:'Completa el glosario en inglés, francés y chino.', points:1200, tier:'Obsidian' },
  { id:'t_725', name:'50 Repaso Perfecto Seguidos', category:'vocabulary', description:'Logra 100% en 50 repasos de vocabulario consecutivos.', points:600, tier:'Platinum' },
  { id:'t_726', name:'Vocabulario por Nivel A', category:'vocabulary', description:'Completa el vocabulario de los niveles A1 y A2 en los tres idiomas.', points:350, tier:'Gold' },
  { id:'t_727', name:'Vocabulario por Nivel B', category:'vocabulary', description:'Completa el vocabulario de los niveles B1 y B2 en los tres idiomas.', points:500, tier:'Platinum' },
  { id:'t_728', name:'Vocabulario por Nivel C', category:'vocabulary', description:'Completa el vocabulario de los niveles C1 y C2 en los tres idiomas.', points:700, tier:'Obsidian' },
  { id:'t_729', name:'Velocidad 100 en 3 min', category:'vocabulary', description:'Completa un lote de 100 flashcards en menos de 3 minutos.', points:450, tier:'Platinum' },
  { id:'t_730', name:'Vocabulario sin Pistas', category:'vocabulary', description:'Completa 20 ejercicios de vocabulario sin usar ninguna pista.', points:300, tier:'Gold' },
  { id:'t_731', name:'Maestro del Vocabulario', category:'vocabulary', description:'Aprende más de 3,000 palabras en los tres idiomas combinados.', points:800, tier:'Obsidian' },
  { id:'t_732', name:'Vocabulario de Examen', category:'vocabulary', description:'Aprende 500 palabras clave de exámenes TOEIC, TOEFL e IELTS.', points:400, tier:'Gold' },
  { id:'t_733', name:'Palabras Falsas Amigas', category:'vocabulary', description:'Domina 50 "false friends" entre inglés y español.', points:200, tier:'Silver' },
  { id:'t_734', name:'Cognados Estratégicos', category:'vocabulary', description:'Aprende 100 cognados útiles para negocios internacionales.', points:200, tier:'Silver' },
  { id:'t_735', name:'Prefijos Científicos', category:'vocabulary', description:'Domina 30 prefijos griegos y latinos de uso corporativo.', points:200, tier:'Silver' },
  { id:'t_736', name:'Abreviaciones Ejecutivas', category:'vocabulary', description:'Aprende 50 abreviaciones usadas en comunicaciones ejecutivas.', points:150, tier:'Silver' },
  { id:'t_737', name:'Jerga de C-Level', category:'vocabulary', description:'Domina 50 términos de jerga exclusivos del nivel Alta Dirección.', points:350, tier:'Gold' },
  { id:'t_738', name:'Vocabulario de Innovación', category:'vocabulary', description:'Aprende 50 términos de innovación y design thinking.', points:250, tier:'Silver' },
  { id:'t_739', name:'Vocabulario Ágil', category:'vocabulary', description:'Aprende 50 términos de metodologías ágiles y Scrum.', points:250, tier:'Silver' },
  { id:'t_740', name:'Vocabulario de Datos', category:'vocabulary', description:'Aprende 75 términos de Data Science y Analytics.', points:300, tier:'Gold' },
  { id:'t_741', name:'Vocabulario de Ciberseguridad', category:'vocabulary', description:'Aprende 50 términos de ciberseguridad corporativa.', points:300, tier:'Gold' },
  { id:'t_742', name:'Vocabulario de Sostenibilidad', category:'vocabulary', description:'Aprende 50 términos de sostenibilidad y economía circular.', points:250, tier:'Silver' },
  { id:'t_743', name:'Vocabulario de Liderazgo', category:'vocabulary', description:'Aprende 50 términos de liderazgo y management moderno.', points:250, tier:'Silver' },
  { id:'t_744', name:'10 Categorías de Glosario', category:'vocabulary', description:'Completa 10 categorías diferentes del glosario corporativo.', points:400, tier:'Gold' },
  { id:'t_745', name:'20 Categorías de Glosario', category:'vocabulary', description:'Completa 20 categorías diferentes del glosario corporativo.', points:700, tier:'Obsidian' },
  { id:'t_746', name:'Sesión Diaria de Vocabulario', category:'vocabulary', description:'Practica vocabulario al menos 15 minutos cada día durante un mes.', points:350, tier:'Gold' },
  { id:'t_747', name:'Vocabulario en Semana', category:'vocabulary', description:'Aprende 100 palabras nuevas en una sola semana.', points:300, tier:'Gold' },
  { id:'t_748', name:'Vocabulario Temático Perfecto', category:'vocabulary', description:'Logra 100% en 10 categorías temáticas del glosario.', points:800, tier:'Obsidian' },
  { id:'t_749', name:'Vocabulario Maestro Total', category:'vocabulary', description:'Completa el 80% del glosario corporativo en todos los idiomas.', points:1000, tier:'Obsidian' },
  { id:'t_750', name:'Leyenda del Glosario', category:'vocabulary', description:'Completa el 100% del glosario corporativo — logro supremo.', points:1500, tier:'Obsidian' },
];

// ── CATEGORY 7: AJEDREZ COGNITIVO (t_751–t_850) ── 100 trofeos
const AJEDREZ: TrophyItem[] = [
  { id:'t_751', name:'Primera Partida', category:'chess', description:'Juega tu primera partida de ajedrez en OnixLingo.', points:50, tier:'Bronze' },
  { id:'t_752', name:'Primer Jaque', category:'chess', description:'Da jaque al rey rival por primera vez.', points:75, tier:'Bronze' },
  { id:'t_753', name:'Primera Victoria', category:'chess', description:'Gana tu primera partida de ajedrez contral sistema Onix.', points:150, tier:'Bronze' },
  { id:'t_754', name:'5 Victorias', category:'chess', description:'Gana 5 partidas de ajedrez.', points:200, tier:'Silver' },
  { id:'t_755', name:'10 Victorias', category:'chess', description:'Gana 10 partidas de ajedrez.', points:300, tier:'Gold' },
  { id:'t_756', name:'25 Victorias', category:'chess', description:'Gana 25 partidas de ajedrez.', points:450, tier:'Gold' },
  { id:'t_757', name:'50 Victorias', category:'chess', description:'Gana 50 partidas de ajedrez.', points:600, tier:'Platinum' },
  { id:'t_758', name:'100 Victorias', category:'chess', description:'Gana 100 partidas de ajedrez — maestría en el tablero.', points:900, tier:'Obsidian' },
  { id:'t_759', name:'Maestro Manager', category:'chess', description:'Vence al sistema en dificultad Manager.', points:250, tier:'Gold' },
  { id:'t_760', name:'Maestro Director', category:'chess', description:'Vence al sistema en dificultad Director.', points:350, tier:'Gold' },
  { id:'t_761', name:'Gran Maestro CEO', category:'chess', description:'Derrota al sistema en la máxima dificultad CEO.', points:500, tier:'Platinum' },
  { id:'t_762', name:'Ajedrez Inmortal', category:'chess', description:'Completa una partida sin que el sistema capture tu Reina.', points:350, tier:'Obsidian' },
  { id:'t_763', name:'Gambito de Apertura', category:'chess', description:'Juega una partida con más de 20 movimientos registrados.', points:200, tier:'Silver' },
  { id:'t_764', name:'Defensa Siciliana', category:'chess', description:'Completa el módulo de la Defensa Siciliana correctamente.', points:200, tier:'Silver' },
  { id:'t_765', name:'Apertura Española', category:'chess', description:'Completa el módulo de la Apertura Española (Ruy López).', points:200, tier:'Silver' },
  { id:'t_766', name:'Defensa India de Rey', category:'chess', description:'Domina el módulo de la Defensa India de Rey.', points:250, tier:'Gold' },
  { id:'t_767', name:'Gambito de Dama', category:'chess', description:'Completa el módulo del Gambito de Dama.', points:250, tier:'Gold' },
  { id:'t_768', name:'Apertura Italiana', category:'chess', description:'Completa el módulo de la Apertura Italiana.', points:200, tier:'Silver' },
  { id:'t_769', name:'Defensa Francesa', category:'chess', description:'Completa el módulo de la Defensa Francesa.', points:200, tier:'Silver' },
  { id:'t_770', name:'Ataque London', category:'chess', description:'Completa el módulo del Sistema London.', points:200, tier:'Silver' },
  { id:'t_771', name:'Defensa Caro-Kann', category:'chess', description:'Completa el módulo de la Defensa Caro-Kann.', points:250, tier:'Gold' },
  { id:'t_772', name:'Apertura del Rey 1.e4', category:'chess', description:'Completa el módulo de Aperturas de Peón de Rey.', points:150, tier:'Silver' },
  { id:'t_773', name:'Apertura de Dama 1.d4', category:'chess', description:'Completa el módulo de Aperturas de Peón de Dama.', points:150, tier:'Silver' },
  { id:'t_774', name:'Tácticas Nivel 1', category:'chess', description:'Completa 20 ejercicios de tácticas básicas (horquillas, clavadas).', points:150, tier:'Bronze' },
  { id:'t_775', name:'Tácticas Nivel 2', category:'chess', description:'Completa 20 ejercicios de tácticas intermedias.', points:250, tier:'Silver' },
  { id:'t_776', name:'Tácticas Nivel 3', category:'chess', description:'Completa 20 ejercicios de tácticas avanzadas.', points:350, tier:'Gold' },
  { id:'t_777', name:'Tácticas CEO', category:'chess', description:'Completa 20 ejercicios de tácticas de nivel Maestro.', points:500, tier:'Platinum' },
  { id:'t_778', name:'Mata en 1', category:'chess', description:'Resuelve 10 ejercicios de jaque mate en 1 movimiento.', points:100, tier:'Bronze' },
  { id:'t_779', name:'Mata en 2', category:'chess', description:'Resuelve 10 ejercicios de jaque mate en 2 movimientos.', points:150, tier:'Silver' },
  { id:'t_780', name:'Mata en 3', category:'chess', description:'Resuelve 10 ejercicios de jaque mate en 3 movimientos.', points:200, tier:'Silver' },
  { id:'t_781', name:'Complicación Táctica', category:'chess', description:'Resuelve 5 ejercicios de tácticas de más de 5 movimientos.', points:300, tier:'Gold' },
  { id:'t_782', name:'ELO 1000', category:'chess', description:'Alcanza ELO 1000 en el módulo de ajedrez.', points:150, tier:'Bronze' },
  { id:'t_783', name:'ELO 1200', category:'chess', description:'Alcanza ELO 1200 en el módulo de ajedrez.', points:250, tier:'Silver' },
  { id:'t_784', name:'ELO 1400', category:'chess', description:'Alcanza ELO 1400 en el módulo de ajedrez.', points:350, tier:'Gold' },
  { id:'t_785', name:'ELO 1600', category:'chess', description:'Alcanza ELO 1600 en el módulo de ajedrez.', points:500, tier:'Platinum' },
  { id:'t_786', name:'ELO 1800', category:'chess', description:'Alcanza ELO 1800 en el módulo de ajedrez — nivel avanzado.', points:700, tier:'Obsidian' },
  { id:'t_787', name:'ELO 2000', category:'chess', description:'Alcanza ELO 2000 en el módulo de ajedrez — nivel experto.', points:900, tier:'Obsidian' },
  { id:'t_788', name:'ELO 2200', category:'chess', description:'Alcanza ELO 2200 en el módulo de ajedrez — nivel maestro.', points:1200, tier:'Obsidian' },
  { id:'t_789', name:'Ataque de Minorías', category:'chess', description:'Aprende y usa el ataque de minorías en una partida real.', points:200, tier:'Silver' },
  { id:'t_790', name:'Finales de Torre', category:'chess', description:'Completa el módulo de Finales de Torre.', points:250, tier:'Gold' },
  { id:'t_791', name:'Finales de Peones', category:'chess', description:'Completa el módulo de Finales de Peones.', points:250, tier:'Gold' },
  { id:'t_792', name:'Finales de Alfil', category:'chess', description:'Completa el módulo de Finales de Alfil.', points:250, tier:'Gold' },
  { id:'t_793', name:'Finales de Caballo', category:'chess', description:'Completa el módulo de Finales de Caballo.', points:250, tier:'Gold' },
  { id:'t_794', name:'Finales de Dama', category:'chess', description:'Completa el módulo de Finales de Dama.', points:300, tier:'Gold' },
  { id:'t_795', name:'Zugzwang Maestro', category:'chess', description:'Crea una posición de Zugzwang en una partida contral sistema.', points:350, tier:'Obsidian' },
  { id:'t_796', name:'Enroque Largo', category:'chess', description:'Usa el enroque largo estratégicamente en 5 partidas.', points:150, tier:'Silver' },
  { id:'t_797', name:'Bloqueo de Peones', category:'chess', description:'Usa correctamente el bloqueo de peones en 5 partidas.', points:200, tier:'Silver' },
  { id:'t_798', name:'Peón Pasado', category:'chess', description:'Gana una partida usando un peón pasado como decisivo.', points:200, tier:'Silver' },
  { id:'t_799', name:'Sacrificio de Pieza', category:'chess', description:'Usa un sacrificio de pieza correctamente en una partida.', points:300, tier:'Gold' },
  { id:'t_800', name:'Ataque al Enroque', category:'chess', description:'Derrota al sistema con un ataque directo al enroque del rey.', points:300, tier:'Gold' },
  { id:'t_801', name:'Control del Centro', category:'chess', description:'Gana 5 partidas controlando el centro del tablero.', points:200, tier:'Silver' },
  { id:'t_802', name:'Ventaja Posicional', category:'chess', description:'Convierte una ventaja posicional en victoria en 3 partidas.', points:250, tier:'Gold' },
  { id:'t_803', name:'Partida Perfecta', category:'chess', description:'Logra una evaluación de "Partida Perfecta" por el motor de análisis.', points:600, tier:'Obsidian' },
  { id:'t_804', name:'Sin Errores en Partida', category:'chess', description:'Completa una partida contral sistema sin cometer errores críticos.', points:400, tier:'Gold' },
  { id:'t_805', name:'10 Lecciones de Ajedrez', category:'chess', description:'Completa 10 lecciones del módulo cognitivo de ajedrez.', points:150, tier:'Silver' },
  { id:'t_806', name:'25 Lecciones de Ajedrez', category:'chess', description:'Completa 25 lecciones del módulo cognitivo de ajedrez.', points:300, tier:'Gold' },
  { id:'t_807', name:'50 Lecciones de Ajedrez', category:'chess', description:'Completa 50 lecciones del módulo cognitivo de ajedrez.', points:500, tier:'Platinum' },
  { id:'t_808', name:'Análisis Post-Partida', category:'chess', description:'Analiza 10 partidas propias con el motor de análisis.', points:200, tier:'Silver' },
  { id:'t_809', name:'Apertura Dominada x3', category:'chess', description:'Domina 3 aperturas diferentes con resultado positivo.', points:300, tier:'Gold' },
  { id:'t_810', name:'Apertura Dominada x7', category:'chess', description:'Domina 7 aperturas diferentes con resultado positivo.', points:500, tier:'Platinum' },
  { id:'t_811', name:'Racha de 5 Victorias', category:'chess', description:'Gana 5 partidas consecutivas sin perder.', points:300, tier:'Gold' },
  { id:'t_812', name:'Racha de 10 Victorias', category:'chess', description:'Gana 10 partidas consecutivas sin perder.', points:600, tier:'Platinum' },
  { id:'t_813', name:'Racha de 20 Victorias', category:'chess', description:'Gana 20 partidas consecutivas — racha magistral.', points:900, tier:'Obsidian' },
  { id:'t_814', name:'Victoria en 15 Movimientos', category:'chess', description:'Vence al sistema en menos de 15 movimientos.', points:350, tier:'Gold' },
  { id:'t_815', name:'Victoria en 10 Movimientos', category:'chess', description:'Vence al sistema en menos de 10 movimientos — miniatura.', points:500, tier:'Platinum' },
  { id:'t_816', name:'Ajedrez Blitz', category:'chess', description:'Completa 5 partidas de ajedrez Blitz (5 minutos).', points:200, tier:'Silver' },
  { id:'t_817', name:'Ajedrez Bala', category:'chess', description:'Completa 5 partidas de ajedrez Bala (1 minuto).', points:300, tier:'Gold' },
  { id:'t_818', name:'Estudio de Grandes Partidas', category:'chess', description:'Estudia 5 partidas históricas de grandes maestros.', points:250, tier:'Silver' },
  { id:'t_819', name:'Fischer Estudiado', category:'chess', description:'Analiza una partida histórica de Bobby Fischer.', points:200, tier:'Silver' },
  { id:'t_820', name:'Kasparov Estudiado', category:'chess', description:'Analiza una partida histórica de Garry Kasparov.', points:200, tier:'Silver' },
  { id:'t_821', name:'Carlsen Estudiado', category:'chess', description:'Analiza una partida histórica de Magnus Carlsen.', points:200, tier:'Silver' },
  { id:'t_822', name:'Mente C-Level', category:'chess', description:'Completa la suite cognitiva: vocabulario + victoria CEO.', points:600, tier:'Platinum' },
  { id:'t_823', name:'Ajedrez y Negocios', category:'chess', description:'Completa el módulo de Estrategia Empresarial aplicada al Ajedrez.', points:350, tier:'Gold' },
  { id:'t_824', name:'100 Puzzles Resueltos', category:'chess', description:'Resuelve 100 puzzles tácticos en el módulo de ajedrez.', points:400, tier:'Gold' },
  { id:'t_825', name:'500 Puzzles Resueltos', category:'chess', description:'Resuelve 500 puzzles tácticos — élite táctica.', points:700, tier:'Obsidian' },
  { id:'t_826', name:'Puzzle Perfecto x10', category:'chess', description:'Logra 100% en 10 sesiones de puzzles tácticos consecutivas.', points:350, tier:'Gold' },
  { id:'t_827', name:'Puzzle Rating 1500', category:'chess', description:'Alcanza un rating de puzzles de 1500.', points:300, tier:'Gold' },
  { id:'t_828', name:'Puzzle Rating 2000', category:'chess', description:'Alcanza un rating de puzzles de 2000.', points:600, tier:'Platinum' },
  { id:'t_829', name:'Juego de Piezas Menor', category:'chess', description:'Gana una partida con solo piezas menores (caballos y alfiles).', points:300, tier:'Gold' },
  { id:'t_830', name:'Torre Activa', category:'chess', description:'Demuestra el uso de torre activa en 5 finales de juego.', points:250, tier:'Silver' },
  { id:'t_831', name:'Sacrificio de Calidad', category:'chess', description:'Usa el sacrificio de calidad correctamente en una partida.', points:350, tier:'Gold' },
  { id:'t_832', name:'Bishop Pair', category:'chess', description:'Gana una partida aprovechando la pareja de alfiles.', points:250, tier:'Silver' },
  { id:'t_833', name:'Outpost Maestro', category:'chess', description:'Establece un outpost con caballo en 5 partidas.', points:250, tier:'Silver' },
  { id:'t_834', name:'Doblar Torres', category:'chess', description:'Dobla torres en la columna abierta en 5 partidas.', points:200, tier:'Silver' },
  { id:'t_835', name:'Columna Abierta', category:'chess', description:'Domina una columna abierta en 5 partidas.', points:200, tier:'Silver' },
  { id:'t_836', name:'Diagonal Fatal', category:'chess', description:'Usa una diagonal dominante para ganar 3 partidas.', points:250, tier:'Silver' },
  { id:'t_837', name:'Séptima Fila', category:'chess', description:'Gana una partida con torres en séptima fila.', points:300, tier:'Gold' },
  { id:'t_838', name:'Rey Activo en Final', category:'chess', description:'Activa el rey correctamente en 5 finales de juego.', points:250, tier:'Silver' },
  { id:'t_839', name:'Estructura de Peones', category:'chess', description:'Completa el módulo de Estructuras de Peones Avanzadas.', points:300, tier:'Gold' },
  { id:'t_840', name:'Pensamiento Profundo', category:'chess', description:'Calcula correctamente variantes de 5+ movimientos en 10 ocasiones.', points:350, tier:'Gold' },
  { id:'t_841', name:'Profilaxis Magistral', category:'chess', description:'Usa la profilaxis correctamente en 5 partidas.', points:300, tier:'Gold' },
  { id:'t_842', name:'Plan Estratégico', category:'chess', description:'Ejecuta un plan estratégico de largo plazo en 5 partidas.', points:350, tier:'Gold' },
  { id:'t_843', name:'Desequilibrio Posicional', category:'chess', description:'Crea y explota un desequilibrio posicional en 3 partidas.', points:300, tier:'Gold' },
  { id:'t_844', name:'Ventaja de Espacio', category:'chess', description:'Gana 5 partidas con clara ventaja de espacio.', points:250, tier:'Silver' },
  { id:'t_845', name:'Debilidades del Rival', category:'chess', description:'Explota correctamente 3 debilidades del rival en 5 partidas.', points:300, tier:'Gold' },
  { id:'t_846', name:'Restricción de Piezas', category:'chess', description:'Restringe las piezas rivales eficazmente en 5 partidas.', points:250, tier:'Silver' },
  { id:'t_847', name:'Victoria desde Posición Perdida', category:'chess', description:'Remonta desde una posición perdida para ganar en 3 ocasiones.', points:500, tier:'Platinum' },
  { id:'t_848', name:'Juego Posicional de Élite', category:'chess', description:'Completa los 10 módulos avanzados de juego posicional.', points:600, tier:'Platinum' },
  { id:'t_849', name:'Campeón del Tablero', category:'chess', description:'Completa el 80% del currículo completo de ajedrez.', points:800, tier:'Obsidian' },
  { id:'t_850', name:'Leyenda del Ajedrez', category:'chess', description:'Completa el 100% del currículo de ajedrez — maestro ejecutivo.', points:1000, tier:'Obsidian' },
];

// ── CATEGORY 8: EXECUTIVE PRO (t_851–t_930) ── 80 trofeos
const EXECUTIVE: TrophyItem[] = [
  { id:'t_851', name:'Acceso al Pro', category:'executive', description:'Accede por primera vez al currículo Executive Pro.', points:100, tier:'Bronze' },
  { id:'t_852', name:'Primera Lección Pro', category:'executive', description:'Completa tu primera lección del currículo Executive Pro.', points:150, tier:'Bronze' },
  { id:'t_853', name:'5 Lecciones Pro', category:'executive', description:'Completa 5 lecciones del currículo Executive Pro.', points:200, tier:'Silver' },
  { id:'t_854', name:'10 Lecciones Pro', category:'executive', description:'Completa 10 lecciones del currículo Executive Pro.', points:300, tier:'Gold' },
  { id:'t_855', name:'25 Lecciones Pro', category:'executive', description:'Completa 25 lecciones del currículo Executive Pro.', points:450, tier:'Gold' },
  { id:'t_856', name:'50 Lecciones Pro', category:'executive', description:'Completa 50 lecciones del currículo Executive Pro.', points:600, tier:'Platinum' },
  { id:'t_857', name:'100 Lecciones Pro', category:'executive', description:'Completa 100 lecciones del currículo Executive Pro.', points:900, tier:'Obsidian' },
  { id:'t_858', name:'B1 Pro Completado', category:'executive', description:'Completa todos los módulos B1 del currículo Executive Pro.', points:350, tier:'Gold' },
  { id:'t_859', name:'B2 Pro Completado', category:'executive', description:'Completa todos los módulos B2 del currículo Executive Pro.', points:500, tier:'Platinum' },
  { id:'t_860', name:'C1 Pro Completado', category:'executive', description:'Completa todos los módulos C1 del currículo Executive Pro.', points:700, tier:'Obsidian' },
  { id:'t_861', name:'C2 Pro Completado', category:'executive', description:'Completa todos los módulos C2 del currículo Executive Pro — cumbre.', points:1000, tier:'Obsidian' },
  { id:'t_862', name:'Corporativo Simulator', category:'executive', description:'Completa tu primera sesión en el Corporativo Simulator.', points:200, tier:'Silver' },
  { id:'t_863', name:'Corporativo Master', category:'executive', description:'Logra puntuación perfecta en el Corporativo Simulator.', points:500, tier:'Platinum' },
  { id:'t_864', name:'B2B Simulator', category:'executive', description:'Completa tu primera sesión del simulador B2B Negotiations.', points:200, tier:'Silver' },
  { id:'t_865', name:'B2B Deal Maker', category:'executive', description:'Cierra 5 negociaciones exitosas en el simulador B2B.', points:400, tier:'Gold' },
  { id:'t_866', name:'B2B Elite Negotiator', category:'executive', description:'Logra puntuación perfecta en el simulador B2B avanzado.', points:600, tier:'Platinum' },
  { id:'t_867', name:'Speech Analytics Debut', category:'executive', description:'Completa tu primera sesión de Speech Analytics.', points:150, tier:'Bronze' },
  { id:'t_868', name:'Speech Score 80+', category:'executive', description:'Logra puntuación de 80+ en Speech Analytics.', points:300, tier:'Gold' },
  { id:'t_869', name:'Speech Score 90+', category:'executive', description:'Logra puntuación de 90+ en Speech Analytics.', points:500, tier:'Platinum' },
  { id:'t_870', name:'Speech Score Perfecto', category:'executive', description:'Logra puntuación perfecta en Speech Analytics.', points:700, tier:'Obsidian' },
  { id:'t_871', name:'Reading Studio Debut', category:'executive', description:'Completa tu primera sesión en el Reading Studio Pro.', points:150, tier:'Bronze' },
  { id:'t_872', name:'Reading Studio Maestro', category:'executive', description:'Logra puntuación de 95%+ en el Reading Studio Pro.', points:450, tier:'Gold' },
  { id:'t_873', name:'Executive Command Center', category:'executive', description:'Visita el Executive Command Center por primera vez.', points:100, tier:'Bronze' },
  { id:'t_874', name:'Analytics Profundo', category:'executive', description:'Revisa tus analytics completos en el Command Center 10 veces.', points:200, tier:'Silver' },
  { id:'t_875', name:'Speech Calibration Done', category:'executive', description:'Completa tu primera sesión de Speech Calibration.', points:150, tier:'Bronze' },
  { id:'t_876', name:'Calibración Perfecta', category:'executive', description:'Logra calibración de habla perfecta en las 8 dimensiones.', points:500, tier:'Platinum' },
  { id:'t_877', name:'Folio Pro Completado', category:'executive', description:'Completa el folio completo de un módulo Pro con máxima puntuación.', points:400, tier:'Gold' },
  { id:'t_878', name:'5 Folios Pro', category:'executive', description:'Completa 5 folios completos de módulos Pro.', points:600, tier:'Platinum' },
  { id:'t_879', name:'Pro B1-01 Perfecto', category:'executive', description:'Completa la lección Pro B1-01 con puntuación perfecta.', points:200, tier:'Silver' },
  { id:'t_880', name:'Pro B1-25 Perfecto', category:'executive', description:'Completa la lección Pro B1-25 con puntuación perfecta.', points:250, tier:'Gold' },
  { id:'t_881', name:'Pro B1-50 Perfecto', category:'executive', description:'Completa la lección Pro B1-50 con puntuación perfecta.', points:300, tier:'Gold' },
  { id:'t_882', name:'Pro B2-01 Perfecto', category:'executive', description:'Completa la lección Pro B2-01 con puntuación perfecta.', points:300, tier:'Gold' },
  { id:'t_883', name:'Pro C1-01 Perfecto', category:'executive', description:'Completa la lección Pro C1-01 con puntuación perfecta.', points:400, tier:'Platinum' },
  { id:'t_884', name:'Pro FR Iniciado', category:'executive', description:'Completa tu primera lección del currículo Pro en Francés.', points:150, tier:'Bronze' },
  { id:'t_885', name:'Pro FR Avanzado', category:'executive', description:'Completa 25 lecciones del currículo Pro en Francés.', points:400, tier:'Gold' },
  { id:'t_886', name:'Presentación CEO', category:'executive', description:'Completa el módulo de Presentaciones nivel CEO.', points:500, tier:'Platinum' },
  { id:'t_887', name:'Negociación Titánica', category:'executive', description:'Gana una negociación simulada de nivel CEO con 95%+ de puntuación.', points:600, tier:'Platinum' },
  { id:'t_888', name:'Discurso de Apertura', category:'executive', description:'Completa el módulo de Discurso de Apertura de Conferencia.', points:400, tier:'Gold' },
  { id:'t_889', name:'Discurso de Clausura', category:'executive', description:'Completa el módulo de Discurso de Clausura Ejecutivo.', points:400, tier:'Gold' },
  { id:'t_890', name:'Entrevista Prensa', category:'executive', description:'Completa el módulo de Manejo de Entrevistas de Prensa.', points:400, tier:'Gold' },
  { id:'t_891', name:'Crisis Corporativa', category:'executive', description:'Completa el simulador de Crisis Corporativa con éxito.', points:500, tier:'Platinum' },
  { id:'t_892', name:'Due Diligence Pro', category:'executive', description:'Completa el módulo de Due Diligence Ejecutivo.', points:500, tier:'Platinum' },
  { id:'t_893', name:'Fusión y Adquisición Pro', category:'executive', description:'Completa el módulo de M&A a nivel ejecutivo.', points:600, tier:'Platinum' },
  { id:'t_894', name:'Reporte a Junta', category:'executive', description:'Completa el módulo de Presentación de Reportes a Junta Directiva.', points:500, tier:'Platinum' },
  { id:'t_895', name:'IPO Communication', category:'executive', description:'Completa el módulo de Comunicación para IPO.', points:600, tier:'Platinum' },
  { id:'t_896', name:'Investor Relations', category:'executive', description:'Completa el módulo de Relaciones con Inversores en inglés.', points:500, tier:'Platinum' },
  { id:'t_897', name:'Board Presentation Perfecto', category:'executive', description:'Logra puntuación perfecta en la presentación a directivos simulada.', points:700, tier:'Obsidian' },
  { id:'t_898', name:'CEO Speech Delivered', category:'executive', description:'Entrega un discurso CEO completo con evaluación automatizada.', points:600, tier:'Platinum' },
  { id:'t_899', name:'Executive Presence Score', category:'executive', description:'Logra puntuación de 90+ en el módulo de Presencia Ejecutiva.', points:600, tier:'Platinum' },
  { id:'t_900', name:'Executive Gravitas', category:'executive', description:'Logra puntuación perfecta en el módulo de Gravitas Ejecutiva.', points:800, tier:'Obsidian' },
  { id:'t_901', name:'Influencia Ejecutiva', category:'executive', description:'Completa el módulo de Influencia y Poder Organizacional.', points:500, tier:'Platinum' },
  { id:'t_902', name:'Delegación Eficaz', category:'executive', description:'Completa el módulo de Técnicas de Delegación Ejecutiva.', points:400, tier:'Gold' },
  { id:'t_903', name:'Coaching Ejecutivo', category:'executive', description:'Completa el módulo de Coaching para Líderes.', points:400, tier:'Gold' },
  { id:'t_904', name:'Mentoría Inversa', category:'executive', description:'Completa el módulo de Mentoría Inversa Corporativa.', points:400, tier:'Gold' },
  { id:'t_905', name:'Change Agent', category:'executive', description:'Completa el módulo de Liderazgo en Transformación Organizacional.', points:500, tier:'Platinum' },
  { id:'t_906', name:'Culture Building', category:'executive', description:'Completa el módulo de Construcción de Cultura Corporativa.', points:450, tier:'Gold' },
  { id:'t_907', name:'Executive Storytelling', category:'executive', description:'Completa el módulo de Storytelling para Líderes.', points:400, tier:'Gold' },
  { id:'t_908', name:'Executive Presence Lab', category:'executive', description:'Completa los 5 talleres del Executive Presence Lab.', points:700, tier:'Obsidian' },
  { id:'t_909', name:'Corporativo Ready', category:'executive', description:'Completa el programa completo de preparación para sala de juntas.', points:800, tier:'Obsidian' },
  { id:'t_910', name:'Alta Dirección Communication', category:'executive', description:'Completa todos los módulos de comunicación Alta Dirección.', points:900, tier:'Obsidian' },
  { id:'t_911', name:'Pro 10 seguidas perfectas', category:'executive', description:'Completa 10 lecciones Pro consecutivas con 100% de precisión.', points:500, tier:'Platinum' },
  { id:'t_912', name:'Velocidad Pro', category:'executive', description:'Completa una lección Pro en tiempo récord.', points:300, tier:'Gold' },
  { id:'t_913', name:'Pro sin ayuda', category:'executive', description:'Completa 5 lecciones Pro sin usar la función de ayuda.', points:350, tier:'Gold' },
  { id:'t_914', name:'Pro Repaso 10', category:'executive', description:'Completa 10 repasos de lecciones Pro anteriores.', points:250, tier:'Silver' },
  { id:'t_915', name:'Speech 10 sesiones', category:'executive', description:'Completa 10 sesiones de Speech Analytics.', points:400, tier:'Gold' },
  { id:'t_916', name:'B2B 10 sesiones', category:'executive', description:'Completa 10 sesiones del simulador B2B.', points:400, tier:'Gold' },
  { id:'t_917', name:'Corporativo 10 sesiones', category:'executive', description:'Completa 10 sesiones del Corporativo Simulator.', points:400, tier:'Gold' },
  { id:'t_918', name:'Executive Suite Completo', category:'executive', description:'Completa todos los módulos de Executive Suite disponibles.', points:1200, tier:'Obsidian' },
  { id:'t_919', name:'Pro Mes Activo', category:'executive', description:'Estudia en el currículo Pro durante 30 días consecutivos.', points:500, tier:'Platinum' },
  { id:'t_920', name:'Pro Racha 60 días', category:'executive', description:'Mantén actividad en el currículo Pro durante 60 días seguidos.', points:800, tier:'Obsidian' },
  { id:'t_921', name:'Executive Analytics Badge', category:'executive', description:'Obtén el badge de Analytics avanzados en el Command Center.', points:350, tier:'Gold' },
  { id:'t_922', name:'Primer Proyecto Pro', category:'executive', description:'Completa tu primer proyecto ejecutivo en la plataforma.', points:300, tier:'Gold' },
  { id:'t_923', name:'5 Proyectos Pro', category:'executive', description:'Completa 5 proyectos ejecutivos en la plataforma.', points:600, tier:'Platinum' },
  { id:'t_924', name:'Pro French Mastered', category:'executive', description:'Completa el currículo Pro completo en versión francesa.', points:800, tier:'Obsidian' },
  { id:'t_925', name:'Pro Perfección Total', category:'executive', description:'Logra 95%+ de promedio en todo el currículo Executive Pro.', points:1000, tier:'Obsidian' },
  { id:'t_926', name:'Simulador Triple', category:'executive', description:'Completa los 3 simuladores (Corporativo, B2B, Speech) en la misma semana.', points:600, tier:'Platinum' },
  { id:'t_927', name:'Simulador Perfecto Triple', category:'executive', description:'Logra puntuación perfecta en los 3 simuladores.', points:1000, tier:'Obsidian' },
  { id:'t_928', name:'Executive 200 días', category:'executive', description:'Usa el módulo Executive Pro durante 200 días en total.', points:700, tier:'Obsidian' },
  { id:'t_929', name:'Elite Executive Badge', category:'executive', description:'Obtén el badge de Élite Executive completando todos los programas clave.', points:900, tier:'Obsidian' },
  { id:'t_930', name:'Leyenda Ejecutiva', category:'executive', description:'Completa el 100% del currículo Executive Pro — cúspide de la excelencia.', points:1500, tier:'Obsidian' },
];

// ── CATEGORY 9: ELOCUENCIA & RANKING (t_931–t_980) ── 50 trofeos
const ELOCUENCIA: TrophyItem[] = [
  { id:'t_931', name:'Primer Punto de Elocuencia', category:'eloquence', description:'Gana tu primer punto de elocuencia en OnixLingo.', points:50, tier:'Bronze' },
  { id:'t_932', name:'Elocuencia 100', category:'eloquence', description:'Acumula 100 puntos de elocuencia.', points:75, tier:'Bronze' },
  { id:'t_933', name:'Elocuencia 500', category:'eloquence', description:'Acumula 500 puntos de elocuencia.', points:100, tier:'Bronze' },
  { id:'t_934', name:'Elocuencia 1000', category:'eloquence', description:'Acumula 1,000 puntos de elocuencia.', points:150, tier:'Silver' },
  { id:'t_935', name:'Elocuencia 2500', category:'eloquence', description:'Acumula 2,500 puntos de elocuencia.', points:200, tier:'Silver' },
  { id:'t_936', name:'Elocuencia 5000', category:'eloquence', description:'Acumula 5,000 puntos de elocuencia.', points:300, tier:'Gold' },
  { id:'t_937', name:'Elocuencia 10000', category:'eloquence', description:'Acumula 10,000 puntos de elocuencia.', points:500, tier:'Platinum' },
  { id:'t_938', name:'Elocuencia 25000', category:'eloquence', description:'Acumula 25,000 puntos de elocuencia.', points:700, tier:'Obsidian' },
  { id:'t_939', name:'Elocuencia 50000', category:'eloquence', description:'Acumula 50,000 puntos de elocuencia — élite global.', points:1000, tier:'Obsidian' },
  { id:'t_940', name:'Elocuencia 100000', category:'eloquence', description:'Acumula 100,000 puntos de elocuencia — leyenda.', points:1500, tier:'Obsidian' },
  { id:'t_941', name:'Top 100 Global', category:'eloquence', description:'Alcanza el Top 100 del Ranking Global de Elocuencia.', points:300, tier:'Gold' },
  { id:'t_942', name:'Top 50 Global', category:'eloquence', description:'Alcanza el Top 50 del Ranking Global de Elocuencia.', points:500, tier:'Platinum' },
  { id:'t_943', name:'Top 25 Global', category:'eloquence', description:'Alcanza el Top 25 del Ranking Global de Elocuencia.', points:700, tier:'Obsidian' },
  { id:'t_944', name:'Top 10 Global', category:'eloquence', description:'Alcanza el Top 10 del Ranking Global de Elocuencia.', points:900, tier:'Obsidian' },
  { id:'t_945', name:'Top 5 Global', category:'eloquence', description:'Alcanza el Top 5 del Ranking Global de Elocuencia.', points:1100, tier:'Obsidian' },
  { id:'t_946', name:'Leyenda del Ranking', category:'eloquence', description:'Alcanza el puesto #1 del Ranking Global de Elocuencia.', points:1500, tier:'Obsidian' },
  { id:'t_947', name:'Top 10 México', category:'eloquence', description:'Alcanza el Top 10 del ranking en México.', points:350, tier:'Gold' },
  { id:'t_948', name:'Top 10 España', category:'eloquence', description:'Alcanza el Top 10 del ranking en España.', points:350, tier:'Gold' },
  { id:'t_949', name:'Top 10 USA', category:'eloquence', description:'Alcanza el Top 10 del ranking en USA.', points:350, tier:'Gold' },
  { id:'t_950', name:'Top 3 País', category:'eloquence', description:'Alcanza el Top 3 del ranking en cualquier país.', points:600, tier:'Platinum' },
  { id:'t_951', name:'Líder de País', category:'eloquence', description:'Alcanza el puesto #1 del ranking en cualquier país.', points:800, tier:'Obsidian' },
  { id:'t_952', name:'ELO Ejecutivo 1000', category:'eloquence', description:'Alcanza 1,000 puntos de ELO ejecutivo.', points:150, tier:'Bronze' },
  { id:'t_953', name:'ELO Ejecutivo 1500', category:'eloquence', description:'Alcanza 1,500 puntos de ELO ejecutivo.', points:300, tier:'Gold' },
  { id:'t_954', name:'ELO Ejecutivo 2000', category:'eloquence', description:'Alcanza 2,000 puntos de ELO ejecutivo.', points:500, tier:'Platinum' },
  { id:'t_955', name:'ELO Ejecutivo 2500', category:'eloquence', description:'Alcanza 2,500 puntos de ELO ejecutivo — élite.', points:800, tier:'Obsidian' },
  { id:'t_956', name:'Constancia en Ranking', category:'eloquence', description:'Mantente en el Top 50 durante 30 días consecutivos.', points:500, tier:'Platinum' },
  { id:'t_957', name:'Ascenso Meteórico', category:'eloquence', description:'Sube 50 posiciones en el ranking en una sola semana.', points:350, tier:'Gold' },
  { id:'t_958', name:'Defensa del Ranking', category:'eloquence', description:'Mantén tu posición en el ranking durante 7 días.', points:200, tier:'Silver' },
  { id:'t_959', name:'Puesto Mejorado', category:'eloquence', description:'Mejora tu posición en el ranking 5 veces seguidas.', points:300, tier:'Gold' },
  { id:'t_960', name:'Líder de Semana', category:'eloquence', description:'Sé el usuario con más puntos de elocuencia ganados en una semana.', points:600, tier:'Platinum' },
  { id:'t_961', name:'Podio Global', category:'eloquence', description:'Entra al podio (Top 3) del ranking global aunque sea una vez.', points:1000, tier:'Obsidian' },
  { id:'t_962', name:'Elocuencia Diaria 50', category:'eloquence', description:'Gana al menos 50 puntos de elocuencia en un solo día.', points:100, tier:'Bronze' },
  { id:'t_963', name:'Elocuencia Diaria 200', category:'eloquence', description:'Gana al menos 200 puntos de elocuencia en un solo día.', points:200, tier:'Silver' },
  { id:'t_964', name:'Elocuencia Diaria 500', category:'eloquence', description:'Gana al menos 500 puntos de elocuencia en un solo día.', points:350, tier:'Gold' },
  { id:'t_965', name:'Elocuencia Semanal 1000', category:'eloquence', description:'Gana al menos 1,000 puntos de elocuencia en una semana.', points:300, tier:'Gold' },
  { id:'t_966', name:'Elocuencia Semanal 5000', category:'eloquence', description:'Gana al menos 5,000 puntos de elocuencia en una semana.', points:600, tier:'Platinum' },
  { id:'t_967', name:'Doble Elocuencia', category:'eloquence', description:'Duplica tus puntos de elocuencia en menos de 7 días.', points:400, tier:'Gold' },
  { id:'t_968', name:'5x Multiplier', category:'eloquence', description:'Activa un multiplicador de elocuencia x5 en una sesión.', points:350, tier:'Gold' },
  { id:'t_969', name:'Racha de Elocuencia', category:'eloquence', description:'Gana puntos de elocuencia 14 días consecutivos.', points:300, tier:'Gold' },
  { id:'t_970', name:'Elocuencia Pro Boost', category:'eloquence', description:'Obtén el bono de elocuencia de miembro Titanium 10 veces.', points:400, tier:'Gold' },
  { id:'t_971', name:'Ranking Histórico', category:'eloquence', description:'Alcanza tu mejor posición histórica en el ranking.', points:350, tier:'Gold' },
  { id:'t_972', name:'Top Performer Mes', category:'eloquence', description:'Sé el usuario con mayor ganancia de elocuencia en un mes.', points:800, tier:'Obsidian' },
  { id:'t_973', name:'Reconocimiento Global', category:'eloquence', description:'Aparece en el Top 25 del ranking global por primera vez.', points:700, tier:'Obsidian' },
  { id:'t_974', name:'Cinco Países Top', category:'eloquence', description:'Sé reconocido en el Top 10 de 5 países diferentes.', points:900, tier:'Obsidian' },
  { id:'t_975', name:'ELO Maestro Ejecutivo', category:'eloquence', description:'Alcanza el máximo ELO ejecutivo disponible en la plataforma.', points:1500, tier:'Obsidian' },
  { id:'t_976', name:'Elocuencia Platino', category:'eloquence', description:'Acumula suficiente elocuencia para el rango Platino.', points:600, tier:'Platinum' },
  { id:'t_977', name:'Elocuencia Diamante', category:'eloquence', description:'Acumula suficiente elocuencia para el rango Diamante.', points:900, tier:'Obsidian' },
  { id:'t_978', name:'Elocuencia Obsidiana', category:'eloquence', description:'Alcanza el rango de Elocuencia Obsidiana — cúspide absoluta.', points:1200, tier:'Obsidian' },
  { id:'t_979', name:'Orgullo de País', category:'eloquence', description:'Lidera el ranking de tu país durante 7 días seguidos.', points:1000, tier:'Obsidian' },
  { id:'t_980', name:'Embajador Global', category:'eloquence', description:'Mantente en el Top 10 global durante 14 días consecutivos.', points:1500, tier:'Obsidian' },
];

// ── CATEGORY 10: LEGENDARIOS & META (t_981–t_1000) ── 20 trofeos
const LEGENDARIOS: TrophyItem[] = [
  { id:'t_981', name:'El Trilingüe', category:'legendary', description:'Completa 50 lecciones en inglés, 50 en francés y 50 en chino.', points:1000, tier:'Obsidian' },
  { id:'t_982', name:'El Académico Ejecutivo', category:'legendary', description:'Logra puntuación A en un simulacro TOEIC, TOEFL e IELTS en la misma semana.', points:1200, tier:'Obsidian' },
  { id:'t_983', name:'El Ajedrecista Lingüista', category:'legendary', description:'Alcanza ELO 1800 en ajedrez y completa 100 lecciones de inglés.', points:1000, tier:'Obsidian' },
  { id:'t_984', name:'El Coloso del Vocabulario', category:'legendary', description:'Aprende 5,000 palabras del glosario y logra 95%+ de retención.', points:1200, tier:'Obsidian' },
  { id:'t_985', name:'El Ejecutivo Imparable', category:'legendary', description:'Mantén una racha de 100 días y completa 200 lecciones.', points:1500, tier:'Obsidian' },
  { id:'t_986', name:'El Maestro de Simulacros', category:'legendary', description:'Logra puntuación perfecta en TOEIC, DELF B2 y HSK 5.', points:1500, tier:'Obsidian' },
  { id:'t_987', name:'El Campeón del Tablero', category:'legendary', description:'Alcanza ELO 2000 en ajedrez y completa el currículo Pro B2.', points:1500, tier:'Obsidian' },
  { id:'t_988', name:'El Orador Perfecto', category:'legendary', description:'Logra 95%+ en Speech Analytics y completa 100 lecciones de speaking.', points:1200, tier:'Obsidian' },
  { id:'t_989', name:'El Negociador Élite', category:'legendary', description:'Cierra 20 negociaciones B2B exitosas y completa el módulo de negociación avanzada.', points:1300, tier:'Obsidian' },
  { id:'t_990', name:'El Estratega Supremo', category:'legendary', description:'Gana 50 partidas de ajedrez, completa 5 módulos estratégicos y logra Top 50 global.', points:1500, tier:'Obsidian' },
  { id:'t_991', name:'El CEO de OnixLingo', category:'legendary', description:'Completa el 60% del currículo en los tres idiomas y el currículo Pro.', points:2000, tier:'Obsidian' },
  { id:'t_992', name:'El Campeón Anual', category:'legendary', description:'Mantén una racha de 365 días y completa 500 lecciones.', points:3000, tier:'Obsidian' },
  { id:'t_993', name:'El Polímata Ejecutivo', category:'legendary', description:'Completa módulos de vocabulario, ajedrez, speaking, simulacros y currículo Pro.', points:2000, tier:'Obsidian' },
  { id:'t_994', name:'El Erudito Global', category:'legendary', description:'Completa el 50% del glosario y 50% del currículo en los tres idiomas.', points:2000, tier:'Obsidian' },
  { id:'t_995', name:'El Invencible', category:'legendary', description:'Logra 50 victorias consecutivas en ajedrez y completa 100 lecciones Pro.', points:2500, tier:'Obsidian' },
  { id:'t_996', name:'El Campeón Olímpico', category:'legendary', description:'Alcanza Top 3 global, ELO 2000 en ajedrez y 100 días de racha.', points:3000, tier:'Obsidian' },
  { id:'t_997', name:'El Lingüista Supremo', category:'legendary', description:'Completa todos los módulos de C1 en inglés, francés y chino.', points:2500, tier:'Obsidian' },
  { id:'t_998', name:'La Mente Brillante', category:'legendary', description:'Acumula 100,000 XP, 500 lecciones y 10,000 puntos de elocuencia.', points:3000, tier:'Obsidian' },
  { id:'t_999', name:'El Inmortal de OnixLingo', category:'legendary', description:'Completa el 75% de todos los 1,000 trofeos disponibles.', points:5000, tier:'Obsidian' },
  { id:'t_1000', name:'Leyenda Absoluta', category:'legendary', description:'Completa el 100% de los 1,000 trofeos de OnixLingo — logro de por vida.', points:10000, tier:'Obsidian' },
];

// ── EXPORTAR LISTA COMPLETA DE 1000 TROFEOS ──
export const TROPHIES_1000: TrophyItem[] = [
  ...SIMULADORES,   // 120
  ...DISCIPLINA,    // 130
  ...INGLES,        // 150
  ...FRANCES,       // 120
  ...CHINO,         // 120
  ...VOCABULARIO,   // 110
  ...AJEDREZ,       // 100
  ...EXECUTIVE,     // 80
  ...ELOCUENCIA,    // 50
  ...LEGENDARIOS,   // 20
  // Total: 1000
];

// ── FUNCIÓN DE EVALUACIÓN DE DESBLOQUEOS REAL ──
export function evaluateUnlocks(
  userStats: any,
  completedLessons: any[],
  leaderboard: any[]
): Set<string> {
  const ids = new Set<string>();
  if (!userStats) return ids;

  const completedLessonIds = new Set(completedLessons.map((l: any) => l.lesson_id || l.id || ''));
  const currentUsername = typeof window !== 'undefined' ? (document.cookie.match(/username=([^;]+)/)?.[1] || '') : '';
  const currentUserRow = leaderboard.find((p: any) => p.username === currentUsername);

  const xp: number = userStats.total_xp || 0;
  const streak: number = userStats.streak_days || (currentUserRow?.streak_days ?? 0);
  const completedCount: number = userStats.completed_modules || userStats.completed_lessons || completedLessonIds.size;
  const eloquence: number = currentUserRow?.eloquence_points ?? 0;
  const rank: number = currentUserRow?.rank ?? 9999;
  const chessElo: number = userStats.chess_elo || 1200;

  // ── Contar lecciones por idioma ──
  let enCount = 0, frCount = 0, zhCount = 0;
  let hasEn = false, hasFr = false, hasZh = false;
  let hasVocab = false;
  let hasProLessons = false;
  let proCount = 0;

  completedLessons.forEach((l: any) => {
    const lid: string = (l.lesson_id || l.id || '').toLowerCase();
    const ltype: string = (l.lesson_type || '').toLowerCase();
    if (ltype === 'pro' || lid.startsWith('pro-')) { hasProLessons = true; proCount++; }
    if (ltype === 'vocab' || lid.includes('vocab') || lid.includes('basics_mod') || lid.includes('voc')) hasVocab = true;
    if (lid.startsWith('fr') || lid.includes('_fr') || lid.includes('fr_')) { hasFr = true; frCount++; }
    else if (lid.startsWith('zh') || lid.includes('_zh') || lid.includes('zh_')) { hasZh = true; zhCount++; }
    else if (lid.startsWith('a-') || lid.startsWith('b-') || lid.startsWith('c-') || !lid.startsWith('pro')) { hasEn = true; enCount++; }
  });

  // Chess wins from localStorage
  const wonFirstChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_first') : null;
  const wonManagerChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_manager') : null;
  const wonCeoChess = typeof window !== 'undefined' ? localStorage.getItem('onix_chess_won_ceo') : null;
  const chessWins: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_chess_total_wins') || '0' : '0');
  const chessPuzzlesSolved: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_chess_puzzles_solved') || '0' : '0');
  const chessPuzzleRating: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_chess_puzzle_rating') || '1000' : '1000');
  const speechScore: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_speech_best_score') || '0' : '0');
  const boardroomSessions: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_boardroom_sessions') || '0' : '0');
  const b2bSessions: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_b2b_sessions') || '0' : '0');
  const b2bWins: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_b2b_wins') || '0' : '0');
  const chessConsecWins: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_chess_consec_wins') || '0' : '0');
  const speechSessions: number = parseInt(typeof window !== 'undefined' ? localStorage.getItem('onix_speech_sessions') || '0' : '0');

  // ─── SIMULADORES ───
  if (completedLessonIds.has('toeic_listening')) ids.add('t_001');
  if (completedLessonIds.has('toeic_reading')) ids.add('t_002');
  if (completedLessonIds.has('toeic_mock')) { ids.add('t_003'); ids.add('t_004'); }
  if (completedLessonIds.has('toefl_mock')) { ids.add('t_011'); ids.add('t_012'); ids.add('t_014'); }
  if (completedLessonIds.has('ielts_mock')) { ids.add('t_021'); ids.add('t_022'); ids.add('t_025'); ids.add('t_026'); ids.add('t_027'); }
  if (completedLessonIds.has('delf_a1')) ids.add('t_031');
  if (completedLessonIds.has('delf_a2')) ids.add('t_032');
  if (completedLessonIds.has('delf_b1')) ids.add('t_033');
  if (completedLessonIds.has('delf_b2')) { ids.add('t_034'); ids.add('t_073'); }
  if (completedLessonIds.has('dalf_c1')) { ids.add('t_035'); ids.add('t_512'); ids.add('t_513'); }
  if (completedLessonIds.has('dalf_c2')) ids.add('t_036');
  if (completedLessonIds.has('hsk_1')) ids.add('t_037');
  if (completedLessonIds.has('hsk_2')) ids.add('t_038');
  if (completedLessonIds.has('hsk_3')) ids.add('t_039');
  if (completedLessonIds.has('hsk_4')) { ids.add('t_040'); ids.add('t_075'); }
  if (completedLessonIds.has('hsk_5')) ids.add('t_041');
  if (completedLessonIds.has('hsk_6')) ids.add('t_042');
  if (completedLessonIds.has('toeic_listening') && completedLessonIds.has('toefl_mock') && completedLessonIds.has('ielts_mock')) ids.add('t_043');
  if (completedLessonIds.has('toeic_mock') && completedLessonIds.has('toefl_mock') && completedLessonIds.has('ielts_mock')) ids.add('t_044');

  // TOEIC scores (via userStats fields if available)
  if (userStats.toeic_score >= 800) ids.add('t_088');
  if (userStats.toeic_score >= 900) ids.add('t_089');
  if (userStats.toefl_score >= 90) ids.add('t_090');
  if (userStats.toefl_score >= 105) ids.add('t_091');
  if (userStats.ielts_score >= 6.0) ids.add('t_092');
  if (userStats.ielts_score >= 7.0) ids.add('t_093');
  if (userStats.ielts_score >= 7.5) ids.add('t_094');
  if (userStats.toeic_score >= 750) ids.add('t_101');
  if (userStats.toeic_score >= 900) ids.add('t_102');
  if (userStats.toefl_score >= 72) ids.add('t_103');
  if (userStats.toefl_score >= 95) ids.add('t_104');
  if (userStats.ielts_score >= 5.5) ids.add('t_105');
  if (userStats.ielts_score >= 7.0) ids.add('t_106');

  // ─── DISCIPLINA ───
  if (completedCount >= 1) ids.add('t_121');
  if (streak >= 3) ids.add('t_122');
  if (streak >= 5) ids.add('t_235');
  if (streak >= 7) ids.add('t_123');
  if (streak >= 10) ids.add('t_236');
  if (streak >= 14) ids.add('t_124');
  if (streak >= 21) ids.add('t_125');
  if (streak >= 30) ids.add('t_126');
  if (streak >= 45) ids.add('t_204');
  if (streak >= 60) ids.add('t_127');
  if (streak >= 75) ids.add('t_238');
  if (streak >= 90) ids.add('t_205');
  if (streak >= 100) ids.add('t_128');
  if (streak >= 120) ids.add('t_239');
  if (streak >= 150) ids.add('t_206');
  if (streak >= 180) ids.add('t_129');
  if (streak >= 200) ids.add('t_240');
  if (streak >= 250) ids.add('t_241');
  if (streak >= 270) ids.add('t_207');
  if (streak >= 300) ids.add('t_242');
  if (streak >= 365) ids.add('t_130');

  if (xp >= 100) ids.add('t_131');
  if (xp >= 500) ids.add('t_132');
  if (xp >= 1000) ids.add('t_133');
  if (xp >= 2500) ids.add('t_134');
  if (xp >= 5000) ids.add('t_135');
  if (xp >= 7500) ids.add('t_246');
  if (xp >= 10000) ids.add('t_136');
  if (xp >= 15000) ids.add('t_231');
  if (xp >= 20000) ids.add('t_247');
  if (xp >= 25000) ids.add('t_137');
  if (xp >= 30000) ids.add('t_232');
  if (xp >= 50000) ids.add('t_138');
  if (xp >= 75000) ids.add('t_233');
  if (xp >= 100000) ids.add('t_139');
  if (xp >= 200000) ids.add('t_234');
  if (xp >= 500000) ids.add('t_140');

  if (completedCount >= 5) ids.add('t_141');
  if (completedCount >= 10) ids.add('t_142');
  if (completedCount >= 25) ids.add('t_143');
  if (completedCount >= 50) ids.add('t_144');
  if (completedCount >= 100) ids.add('t_145');
  if (completedCount >= 150) ids.add('t_243');
  if (completedCount >= 200) ids.add('t_146');
  if (completedCount >= 300) ids.add('t_147');
  if (completedCount >= 400) ids.add('t_244');
  if (completedCount >= 500) ids.add('t_148');
  if (completedCount >= 600) ids.add('t_245');
  if (completedCount >= 750) ids.add('t_149');
  if (completedCount >= 1000) ids.add('t_150');

  // ─── INGLÉS ───
  if (enCount >= 1) ids.add('t_251');
  if (enCount >= 3) ids.add('t_252');
  if (enCount >= 5) ids.add('t_253');
  if (enCount >= 10) ids.add('t_281');
  if (enCount >= 25) ids.add('t_282');
  if (enCount >= 50) ids.add('t_283');
  if (enCount >= 100) ids.add('t_284');
  if (enCount >= 200) ids.add('t_285');
  if (completedLessonIds.has('a-1')) ids.add('t_323');

  // ─── FRANCÉS ───
  if (hasFr) ids.add('t_401');
  if (frCount >= 1) ids.add('t_413');
  if (frCount >= 3) ids.add('t_402');
  if (frCount >= 5) ids.add('t_403');
  if (frCount >= 6) ids.add('t_414');
  if (frCount >= 10) ids.add('t_404');
  if (frCount >= 15) ids.add('t_415');
  if (frCount >= 20) ids.add('t_405');
  if (frCount >= 25) ids.add('t_406');
  if (frCount >= 30) ids.add('t_416');
  if (frCount >= 40) ids.add('t_407');
  if (frCount >= 50) { ids.add('t_408'); ids.add('t_430'); }
  if (frCount >= 60) ids.add('t_409');
  if (frCount >= 80) ids.add('t_410');
  if (frCount >= 100) { ids.add('t_411'); ids.add('t_431'); }
  if (frCount >= 150) ids.add('t_432');
  if (frCount >= 200) { ids.add('t_433'); ids.add('t_412'); }

  // ─── CHINO ───
  if (hasZh) ids.add('t_521');
  if (zhCount >= 1) ids.add('t_533');
  if (zhCount >= 3) ids.add('t_522');
  if (zhCount >= 5) ids.add('t_523');
  if (zhCount >= 10) { ids.add('t_524'); ids.add('t_561'); }
  if (zhCount >= 15) ids.add('t_534');
  if (zhCount >= 20) ids.add('t_525');
  if (zhCount >= 25) { ids.add('t_526'); ids.add('t_562'); }
  if (zhCount >= 30) ids.add('t_535');
  if (zhCount >= 40) ids.add('t_527');
  if (zhCount >= 50) { ids.add('t_528'); ids.add('t_563'); }
  if (zhCount >= 60) { ids.add('t_529'); ids.add('t_536'); }
  if (zhCount >= 80) ids.add('t_530');
  if (zhCount >= 100) { ids.add('t_531'); ids.add('t_564'); }
  if (zhCount >= 150) ids.add('t_537');
  if (zhCount >= 200) ids.add('t_532');

  // Políglota
  if (hasEn && hasFr && hasZh) ids.add('t_685');
  if (hasEn && hasFr && hasZh && completedCount >= 150) ids.add('t_981');

  // ─── VOCABULARIO ───
  if (hasVocab) { ids.add('t_641'); ids.add('t_642'); ids.add('t_670'); ids.add('t_651'); ids.add('t_652'); }
  if (completedLessonIds.has('travel_vocab')) ids.add('t_653');
  if (completedLessonIds.has('finance_vocab')) ids.add('t_654');
  if (completedLessonIds.has('legal_vocab')) ids.add('t_655');
  if (completedLessonIds.has('marketing_vocab')) ids.add('t_656');
  if (completedLessonIds.has('tech_vocab')) ids.add('t_652');
  if (completedLessonIds.has('hr_vocab')) ids.add('t_658');

  // ─── AJEDREZ ───
  if (wonFirstChess) { ids.add('t_751'); ids.add('t_752'); ids.add('t_753'); ids.add('t_763'); }
  if (chessWins >= 5) ids.add('t_754');
  if (chessWins >= 10) ids.add('t_755');
  if (chessWins >= 25) ids.add('t_756');
  if (chessWins >= 50) ids.add('t_757');
  if (chessWins >= 100) ids.add('t_758');
  if (wonManagerChess) ids.add('t_759');
  if (wonCeoChess) { ids.add('t_760'); ids.add('t_761'); ids.add('t_762'); }
  if (wonCeoChess && hasVocab) ids.add('t_822');
  if (chessElo >= 1000) ids.add('t_782');
  if (chessElo >= 1200) ids.add('t_783');
  if (chessElo >= 1400) ids.add('t_784');
  if (chessElo >= 1600) ids.add('t_785');
  if (chessElo >= 1800) ids.add('t_786');
  if (chessElo >= 2000) ids.add('t_787');
  if (chessElo >= 2200) ids.add('t_788');
  if (chessPuzzlesSolved >= 100) ids.add('t_824');
  if (chessPuzzlesSolved >= 500) ids.add('t_825');
  if (chessPuzzleRating >= 1500) ids.add('t_827');
  if (chessPuzzleRating >= 2000) ids.add('t_828');
  if (chessConsecWins >= 5) ids.add('t_811');
  if (chessConsecWins >= 10) ids.add('t_812');
  if (chessConsecWins >= 20) ids.add('t_813');

  // ─── EXECUTIVE PRO ───
  if (hasProLessons) { ids.add('t_851'); ids.add('t_852'); ids.add('t_873'); }
  if (proCount >= 5) ids.add('t_853');
  if (proCount >= 10) ids.add('t_854');
  if (proCount >= 25) ids.add('t_855');
  if (proCount >= 50) ids.add('t_856');
  if (proCount >= 100) ids.add('t_857');
  if (speechSessions >= 1) ids.add('t_867');
  if (speechScore >= 80) ids.add('t_868');
  if (speechScore >= 90) ids.add('t_869');
  if (speechScore >= 99) ids.add('t_870');
  if (speechSessions >= 10) ids.add('t_915');
  if (boardroomSessions >= 1) { ids.add('t_862'); ids.add('t_863'); }
  if (boardroomSessions >= 10) ids.add('t_917');
  if (b2bSessions >= 1) ids.add('t_864');
  if (b2bWins >= 5) ids.add('t_865');
  if (b2bWins >= 1) ids.add('t_875');
  if (b2bSessions >= 10) ids.add('t_916');
  if (completedLessonIds.has('speech_calibrate')) ids.add('t_875');

  // ─── ELOCUENCIA ───
  if (eloquence >= 1) ids.add('t_931');
  if (eloquence >= 100) ids.add('t_932');
  if (eloquence >= 500) ids.add('t_933');
  if (eloquence >= 1000) ids.add('t_934');
  if (eloquence >= 2500) ids.add('t_935');
  if (eloquence >= 5000) ids.add('t_936');
  if (eloquence >= 10000) ids.add('t_937');
  if (eloquence >= 25000) ids.add('t_938');
  if (eloquence >= 50000) ids.add('t_939');
  if (eloquence >= 100000) ids.add('t_940');
  if (rank <= 100) ids.add('t_941');
  if (rank <= 50) ids.add('t_942');
  if (rank <= 25) { ids.add('t_943'); ids.add('t_973'); }
  if (rank <= 10) ids.add('t_944');
  if (rank <= 5) ids.add('t_945');
  if (rank === 1) { ids.add('t_946'); ids.add('t_961'); }

  // ─── LEGENDARIOS ───
  if (enCount >= 50 && frCount >= 50 && zhCount >= 50) ids.add('t_981');
  if (streak >= 100 && completedCount >= 200) ids.add('t_985');
  if (chessElo >= 2000 && proCount >= 50) ids.add('t_987');
  if (speechScore >= 95 && completedCount >= 100) ids.add('t_988');
  if (b2bWins >= 20) ids.add('t_989');
  if (chessWins >= 50 && rank <= 50) ids.add('t_990');
  if (xp >= 100000 && completedCount >= 500 && eloquence >= 10000) ids.add('t_998');

  // Trofeo final: completar 75% de los 1000
  if (ids.size >= 750) ids.add('t_999');
  if (ids.size >= 1000) ids.add('t_1000');

  return ids;
}
