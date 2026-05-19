import { LevelSection } from './curriculum';

export const CURRICULUM_ZH: LevelSection[] = [
  {
    id: 'ZH-A1',
    title: 'Nivel A1: Supervivencia Mandarín',
    description: 'Fundamentos esenciales para navegar y presentarse en China.',
    color: 'orange',
    lessons: [
      { 
        id: 'zh-a1-1', title: '你好 (Nǐ hǎo)', description: 'Saludos y Tonos.', 
        type: 'lecture', locked: false, completed: false, stars: 0, position: 'center', aiPrompt: 'Roleplay: Basic greetings in Mandarin.'
      },
      { 
        id: 'zh-a1-2', title: '数字 (Shùzì)', description: 'Números y Precios.', 
        type: 'grammar', locked: true, completed: false, stars: 0, position: 'left', aiPrompt: 'Practice numbers and bargaining in a Chinese market.'
      },
      { 
        id: 'zh-a1-3', title: '我的名字 (Wǒ de míngzì)', description: 'Presentación Personal.', 
        type: 'chat', locked: true, completed: false, stars: 0, position: 'center', aiPrompt: 'Introduce yourself: name, nationality, and job.'
      },
      { 
        id: 'zh-a1-4', title: '家 (Jiā)', description: 'Familia y Hogar.', 
        type: 'chat', locked: true, completed: false, stars: 0, position: 'right', aiPrompt: 'Discuss family members and where they live.'
      },
      { 
        id: 'zh-a1-5', title: '吃饭 (Chī fàn)', description: 'Comida y Restaurante.', 
        type: 'listening', locked: true, completed: false, stars: 0, position: 'center', aiPrompt: 'Order authentic Chinese dishes.'
      },
      { 
        id: 'zh-a1-6', title: '时间 (Shíjiān)', description: 'Días y Horas.', 
        type: 'grammar', locked: true, completed: false, stars: 0, position: 'left', aiPrompt: 'Schedule a meeting using time expressions.'
      },
      { 
        id: 'zh-a1-7', title: '工作 (Gōngzuò)', description: 'En la Oficina.', 
        type: 'lecture', locked: true, completed: false, stars: 0, position: 'center', aiPrompt: 'Discuss daily tasks at a tech company in Beijing.'
      },
      { 
        id: 'zh-a1-8', title: '买东西 (Mǎi dōngxī)', description: 'Compras y Pagos.', 
        type: 'chat', locked: true, completed: false, stars: 0, position: 'right', aiPrompt: 'Practice using Alipay/WeChat Pay terminology.'
      },
      { 
        id: 'zh-a1-9', title: '去哪里 (Qù nǎlǐ)', description: 'Transporte y Viajes.', 
        type: 'listening', locked: true, completed: false, stars: 0, position: 'center', aiPrompt: 'Navigate the high-speed train system (HSR).'
      },
      { 
        id: 'zh-a1-10', title: '复习 (Fùxí)', description: 'Bilan A1.', 
        type: 'lecture', locked: true, completed: false, stars: 0, position: 'center', aiPrompt: 'Comprehensive review of A1 Mandarin.'
      }
    ]
  },
  {
    id: 'ZH-A2', title: 'Nivel A2: Operaciones Empresariales', description: 'Comunicación fluida en el entorno laboral chino.', color: 'blue',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `zh-a2-${i + 1}`,
      title: [
        'Presentación Trabajo', 'Rutina de Oficina', 'Agendar Citas', 
        '寻求帮助 (Pedir Ayuda)', '汇报过去 (Informar Pasado)', '出差 (Viaje de Negocios)', 
        '接待客户 (Atender Clientes)', '技术问题 (Soporte Técnico)', '工作安排 (Instrucciones)', 'Examen Final A2'
      ][i],
      description: [
        'Presentarse y describir tu puesto o cargo.', 'Describir tus tareas diarias de oficina.', 'Coordinar fechas y agendar reuniones.',
        'Cómo solicitar ayuda y hacer preguntas.', 'Informar sobre tareas completadas en el pasado.', 'Reservas de transporte y viajes corporativos.',
        'Vocabulario para recibir y atender clientes.', 'Reportar fallas técnicas de red y computadoras.', 'Delegación de tareas y confirmación rápida.', 'Evaluación integral y síntesis del nivel A2.'
      ][i],
      type: 'lecture', locked: true, completed: false, stars: 0, position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: `Roleplay for A2 Mandarin: ${['Introduce yourself professionally', 'Describe office routine', 'Coordinate a meeting'][i % 3]}`
    }))
  },
  {
    id: 'ZH-B1', title: 'Nivel B1: Gestión y Guanxi', description: 'Construyendo relaciones y negociando en mandarín.', color: 'emerald',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `zh-b1-${i + 1}`,
      title: [
        '项目计划 (Plan de Proyecto)', '任务分配 (Delegar Tareas)', '主持会议 (Moderar Junta)', 
        '谈判预算 (Negociar Costos)', '解决冲突 (Resolver Conflictos)', '员工评估 (Feedback)', 
        '汇报业绩 (Reportar Resultados)', '团队决策 (Decisión en Equipo)', 'Guanxi y Conexiones', 'Examen Final B1'
      ][i],
      description: [
        'Planificación, metas y plazos de proyectos.', 'Asignación de responsabilidades y fechas límites.', 'Conducir una reunión y moderar opiniones.',
        'Negociar costos, gastos y presupuestos comerciales.', 'Mediar desacuerdos y calmar fricciones de equipo.', 'Brindar retroalimentación anual y elogiar.',
        'Exponer reportes, estadísticas y crecimiento.', 'Toma de decisiones estratégicas colectivas.', 'Entender y cultivar la red Guanxi profesional.', 'Evaluación integral y síntesis del nivel B1.'
      ][i],
      type: 'lecture', locked: true, completed: false, stars: 0, position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: `Roleplay for B1 Mandarin: ${['Negotiate budget costs', 'Resolve a team conflict', 'Present sales results'][i % 3]}`
    }))
  },
  {
    id: 'ZH-B2', title: 'Nivel B2: Liderazgo Estratégico', description: 'Análisis de mercado y liderazgo corporativo.', color: 'purple',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `zh-b2-${i + 1}`, title: `Estrategia Zh Pt. ${i + 1}`, description: 'Liderazgo avanzado.',
      type: 'listening', locked: true, completed: false, stars: 0, position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Lead a corporation in China.'
    }))
  },
  {
    id: 'ZH-C1', title: 'Nivel C1: Maestría Diplomática', description: 'Persuasión y oratoria de alto nivel.', color: 'orange',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `zh-c1-${i + 1}`, title: `Diplomacia Zh Pt. ${i + 1}`, description: 'Maestría autónoma.',
      type: 'chat', locked: true, completed: false, stars: 0, position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'High-level diplomacy in Mandarin.'
    }))
  },
  {
    id: 'ZH-C2', title: 'Nivel C2: Sabiduría Ejecutiva', description: 'Dominio total y visión global.', color: 'blue',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `zh-c2-${i + 1}`, title: `Maestría Zh Pt. ${i + 1}`, description: 'Experto absoluto.',
      type: 'lecture', locked: true, completed: false, stars: 0, position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Absolute mastery of Mandarin.'
    }))
  }
];
