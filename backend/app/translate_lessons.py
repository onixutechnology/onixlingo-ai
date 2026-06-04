import json
import time
from deep_translator import GoogleTranslator

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

cache = { 'en': {}, 'fr': {} }
translator_en = GoogleTranslator(source='es', target='en')
translator_fr = GoogleTranslator(source='es', target='fr')

processed_files = 0
print(f"Iniciando traducción en lote de {len(files)} archivos...")

for file_path in files:
    target_lang = 'fr' if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/') else 'en'
    translator = translator_fr if target_lang == 'fr' else translator_en
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        modified = False
        words_to_translate = []
        pair_refs = []
        
        if 'stages' in data and data['stages']:
            for stage in data['stages']:
                if stage.get('type') == 'pairing_drill':
                    for pair in stage.get('pairs', []):
                        es_word = pair.get('es')
                        if es_word and target_lang in pair and pair[target_lang] == es_word:
                            if es_word in cache[target_lang]:
                                pair[target_lang] = cache[target_lang][es_word]
                                modified = True
                            else:
                                words_to_translate.append(es_word)
                                pair_refs.append(pair)
                                
        if words_to_translate:
            translations = translator.translate_batch(words_to_translate)
            for i, translation in enumerate(translations):
                es_word = words_to_translate[i]
                cache[target_lang][es_word] = translation
                pair_refs[i][target_lang] = translation
            modified = True
            time.sleep(1.5)
            
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            processed_files += 1
            print(f"[{processed_files}] Archivo corregido: {file_path}", flush=True)
            
    except Exception as e:
        print(f"Error procesando {file_path}: {e}", flush=True)

print(f"Proceso finalizado. {processed_files} archivos modificados.", flush=True)
