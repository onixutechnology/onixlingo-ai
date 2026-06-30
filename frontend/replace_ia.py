import os
import re

replacements = {
    "inteligencia artificial adaptativa": "sistemas de evaluación adaptativa",
    "Inteligencia artificial adaptativa": "Sistemas de evaluación adaptativa",
    "núcleo de inteligencia artificial": "núcleo de procesamiento cognitivo",
    "Núcleo de inteligencia artificial": "Núcleo de procesamiento cognitivo",
    "Simulador de Entrevistas IA": "Simulador Interactivo de Entrevistas",
    "Tutoría conversacional por Inteligencia Artificial": "Tutoría conversacional interactiva",
    "Tutoría conversacional por IA": "Tutoría conversacional interactiva",
    "motor de inteligencia artificial": "motor de análisis algorítmico",
    "Motor de inteligencia artificial": "Motor de análisis algorítmico",
    "Tutoría conversacional ilimitada por IA": "Práctica conversacional dinámica ilimitada",
    "conversación libre con Inteligencia Artificial (Speech Tutor)": "simulación conversacional libre (Speech Tutor)",
    "conversación libre con Inteligencia Artificial": "simulación conversacional libre",
    "conversación libre con IA": "simulación conversacional libre",
    "prácticas de IA": "prácticas dinámicas",
    "Conversación IA": "Simulador Conversacional",
    "¡Hola! Soy tu tutor IA": "¡Hola! Soy tu asistente de evaluación",
    "Evaluación de IA Profesional": "Evaluación Cognitiva Profesional",
    "Enviar a Revisión IA": "Enviar a Revisión del Sistema",
    "Evaluador IA": "Evaluador Analítico",
    "Feedback de la IA": "Feedback de la Plataforma",
    "Feedback IA": "Feedback del Sistema",
    "IA Asesor": "Asesor Analítico",
    "NEURAL ADVISOR IA": "SISTEMA NEURAL ADVISOR",
    "Neural Advisor IA": "Sistema Neural Advisor",
    "Integración de IA": "Integración de análisis automatizado",
    "IA Onix": "Motor Onix",
    "a la IA": "al sistema",
    "la IA evaluadora": "el simulador interactivo",
    "la IA": "el sistema",
    "con la IA": "con el sistema",
    "contra la IA": "contra el sistema",
    "Inteligencia Artificial": "Sistema Analítico Avanzado",
    "IA generativa": "aprendizaje profundo",
    "Estrategia IA": "Estrategia de Algoritmos",
    "Analítica Predictiva IA": "Analítica Predictiva Algorítmica",
    "Motor de Inteligencia Artificial": "Motor de Procesamiento Computacional",
    "Inteligencia artificial": "Sistemas cognitivos",
    "inteligencia artificial": "tecnología cognitiva",
    "Disrupción Tecnológica e IA": "Disrupción Tecnológica y Sistemas Automatizados",
    "Disruption Tech & IA": "Disruption Tech & Automatisation",
    "IA et Transformation": "Systèmes Cognitifs et Transformation"
}

# The replacements dictionary needs to be ordered by length descending so that longer phrases are replaced first.
sorted_replacements = dict(sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True))

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Replace all multi-word phrases safely
        for old, new in sorted_replacements.items():
            new_content = new_content.replace(old, new)
            
        # 2. Replace standalone "IA" safely using word boundaries (so it doesn't break ENVIAR)
        # Match 'IA' only if it's a separate word.
        new_content = re.sub(r'\bIA\b', 'Sistema', new_content)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Failed {filepath}: {e}")

frontend_dir = r"C:\Users\jeico\onixlingo\language-ai-tutor\frontend"
for root, _, files in os.walk(frontend_dir):
    if "node_modules" in root or ".next" in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            process_file(os.path.join(root, file))
