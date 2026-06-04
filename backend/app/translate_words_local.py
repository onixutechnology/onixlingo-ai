import json
import time
from deep_translator import GoogleTranslator

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

with open('words_to_translate.json', 'r', encoding='utf-8') as f:
    unique_words_data = json.load(f)

en_words = unique_words_data.get('en', [])
print(f"Traduciendo {len(en_words)} palabras a Inglés en chunks...")

cache = {'en': {}}
translator = GoogleTranslator(source='es', target='en')

chunk_size = 50
for i in range(0, len(en_words), chunk_size):
    chunk = en_words[i:i+chunk_size]
    try:
        translations = translator.translate_batch(chunk)
        for j, word in enumerate(chunk):
            cache['en'][word] = translations[j]
        print(f"Traducidas {i+len(chunk)}/{len(en_words)} palabras...")
        time.sleep(2)
    except Exception as e:
        print(f"Error en chunk {i}: {e}")
        # fallback a 1x1
        for word in chunk:
            try:
                cache['en'][word] = GoogleTranslator(source='es', target='en').translate(word)
                time.sleep(0.5)
            except:
                pass

processed = 0
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
                        if es_w and pair.get('en') == es_w and es_w in cache['en']:
                            pair['en'] = cache['en'][es_w]
                            mod = True
        if mod:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            processed += 1
    except Exception:
        pass

print(f"Listo. {processed} archivos guardados.")
