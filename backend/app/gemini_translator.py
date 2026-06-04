import json
import time
import os
import google.generativeai as genai

# Configurar API de Gemini
genai.configure(api_key="AIzaSyBvn20t2e1UhRJBhG3u5dEJdpE0VyIL_8o")
model = genai.GenerativeModel('gemini-pro')

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

cache = { 'en': {}, 'fr': {} }
processed_files = 0
print(f"Iniciando traducción con Gemini AI de archivos restantes...")

for file_path in files:
    target_lang = 'fr' if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/') else 'en'
    lang_name = "French" if target_lang == 'fr' else "English"
    
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
            # Pedir a Gemini que traduzca la lista
            prompt = f"Translate the following list of Spanish words/phrases into {lang_name}. Return ONLY a raw JSON array of strings in the exact same order, without any markdown formatting, nothing else. Example: [\"word1\", \"word2\"]\n\nWords: {json.dumps(words_to_translate, ensure_ascii=False)}"
            
            response = model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
            text = text.strip()
            
            try:
                translations = json.loads(text)
                if len(translations) == len(words_to_translate):
                    for i, translation in enumerate(translations):
                        es_word = words_to_translate[i]
                        cache[target_lang][es_word] = translation
                        pair_refs[i][target_lang] = translation
                    modified = True
                else:
                    print(f"Error: Longitud no coincide en {file_path}")
            except Exception as e:
                print(f"Error parseando JSON de Gemini: {e}\nTexto: {text}")
            
            time.sleep(0.5) # pausa
            
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            processed_files += 1
            print(f"[{processed_files}] Archivo corregido: {file_path}", flush=True)
            
    except Exception as e:
        print(f"Error procesando {file_path}: {e}", flush=True)

print(f"Proceso Gemini finalizado. {processed_files} archivos modificados.", flush=True)
