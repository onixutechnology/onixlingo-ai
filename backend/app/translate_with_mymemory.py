import json
import time
import urllib.request
import urllib.parse

def translate_word(text, source_lang='es', target_lang='en'):
    # Usar API gratuita de MyMemory
    url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(text)}&langpair={source_lang}|{target_lang}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            res = json.loads(response.read())
            return res['responseData']['translatedText']
    except Exception as e:
        print(f"Error traduciendo '{text}': {e}")
        return text

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

# Leer palabras únicas
with open('words_to_translate.json', 'r', encoding='utf-8') as f:
    unique_words_data = json.load(f)

cache = {'en': {}, 'fr': {}}

en_words = unique_words_data.get('en', [])
print(f"Traduciendo {len(en_words)} palabras únicas a Inglés...")
for i, word in enumerate(en_words):
    translation = translate_word(word, 'es', 'en')
    cache['en'][word] = translation
    if (i+1) % 50 == 0:
        print(f"Traducidas {i+1}/{len(en_words)} palabras...", flush=True)
    time.sleep(0.3)

# Aplicar caché a los archivos
processed_files = 0
for file_path in files:
    target_lang = 'fr' if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/') else 'en'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        modified = False
        if 'stages' in data and data['stages']:
            for stage in data['stages']:
                if stage.get('type') == 'pairing_drill':
                    for pair in stage.get('pairs', []):
                        es_word = pair.get('es')
                        if es_word and target_lang in pair and pair[target_lang] == es_word:
                            if es_word in cache[target_lang]:
                                pair[target_lang] = cache[target_lang][es_word]
                                modified = True
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            processed_files += 1
            print(f"Archivo corregido: {file_path}", flush=True)
    except Exception as e:
        print(f"Error procesando {file_path}: {e}")

print(f"Proceso finalizado. {processed_files} archivos guardados con las traducciones.")
