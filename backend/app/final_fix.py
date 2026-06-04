import json

fixes = {
    "Control de pasaportes": "Passport control",
    "Catarata": "Waterfall",
    "Boleto": "Ticket",
    "Puente": "Bridge",
    "Marketing de guerrilla": "Guerrilla marketing",
    "Manta": "Blanket",
    "Cruce": "Intersection",
    "Postal": "Postcard",
    "Museo": "Museum"
}

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

for file_path in files:
    if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/'): continue
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        mod = False
        if 'stages' in data and data['stages']:
            for stage in data['stages']:
                if stage.get('type') == 'pairing_drill':
                    for pair in stage.get('pairs', []):
                        es_w = pair.get('es')
                        if es_w in fixes and pair.get('en') == es_w:
                            pair['en'] = fixes[es_w]
                            mod = True
        if mod:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
print("Correcciones finales aplicadas.")
