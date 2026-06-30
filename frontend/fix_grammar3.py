import os

fixes = {
    "por Sistema corporativa": "por sistemas corporativos",
    "tutores Sistema": "tutores automatizados",
    "tutor Sistema": "tutor automatizado",
    "el sistema Analítico Avanzado": "el Sistema Analítico Avanzado",
    "por Sistema (Speech Tutor)": "automatizada (Speech Tutor)",
    "con el sistema\",": "con Sistemas Cognitivos\",",
    "impulsada por Sistema Analítico Avanzado": "impulsada por el Sistema Analítico Avanzado",
    "impulsada por Sistema.": "impulsada por Sistemas Cognitivos.",
    "Cómo el sistema está transformando": "Cómo los sistemas cognitivos están transformando",
    "Tutoría conversacional por Sistema": "Tutoría conversacional automatizada",
    "evaluación por Sistema": "evaluación automatizada"
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        for old, new in fixes.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

frontend_dir = r"C:\Users\jeico\onixlingo\language-ai-tutor\frontend"
for root, _, files in os.walk(frontend_dir):
    if "node_modules" in root or ".next" in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            process_file(os.path.join(root, file))
