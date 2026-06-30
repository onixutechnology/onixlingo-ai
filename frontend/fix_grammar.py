import os

fixes = {
    "con Sistema.": "con el simulador.",
    "con Sistema evaluadora.": "con el simulador interactivo.",
    "Inglés para Sistema y Transformación Digital": "Inglés para Sistemas y Transformación Digital",
    "módulo de Sistema y Transformación Digital": "módulo de Sistemas y Transformación Digital",
    "evaluación de Sistema.": "evaluación automatizada.",
    "ANALÍTICA BASADA EN Sistema": "ANALÍTICA BASADA EN SISTEMAS",
    "evaluación de Sistema": "evaluación automatizada",
    "con Sistema": "con el sistema"
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
