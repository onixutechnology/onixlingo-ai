import json
import urllib.request
import urllib.error

API_KEY = "AIzaSyBvn20t2e1UhRJBhG3u5dEJdpE0VyIL_8o"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

# Leer lista de archivos
with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

# Leer palabras únicas
with open('words_to_translate.json', 'r', encoding='utf-8') as f:
    unique_words_data = json.load(f)

en_words = unique_words_data.get('en', [])

print(f"Traduciendo {len(en_words)} palabras a Inglés vía Gemini REST API...")

prompt = f"Translate the following list of Spanish words to English. Return ONLY a raw JSON array of strings in the exact same order. No markdown, no backticks, just the array.\n\nWords: {json.dumps(en_words, ensure_ascii=False)}"

payload = json.dumps({
    "contents": [{"parts": [{"text": prompt}]}]
}).encode('utf-8')

req = urllib.request.Request(URL, data=payload, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read())
        text = res['candidates'][0]['content']['parts'][0]['text'].strip()
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        text = text.strip()
        
        translations = json.loads(text)
        
        if len(translations) == len(en_words):
            cache = {'en': {}}
            for i, es_w in enumerate(en_words):
                cache['en'][es_w] = translations[i]
            print("¡Traducción exitosa! Aplicando a los archivos...")
            
            # Aplicar a los archivos
            processed = 0
            for file_path in files:
                target_lang = 'en'
                if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/'): continue
                
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
            print(f"Listo. {processed} archivos corregidos y guardados.")
        else:
            print("Error: la longitud de la traducción no coincide.")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
