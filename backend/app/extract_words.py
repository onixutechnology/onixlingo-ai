import json
import os

with open('bad_files.txt', 'r', encoding='utf-8') as f:
    files = [line.strip() for line in f if line.strip()]

unique_words = {'en': set(), 'fr': set()}

for file_path in files:
    target_lang = 'fr' if '\\fr\\' in file_path or '/fr/' in file_path.replace('\\', '/') else 'en'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if 'stages' in data and data['stages']:
            for stage in data['stages']:
                if stage.get('type') == 'pairing_drill':
                    for pair in stage.get('pairs', []):
                        es_word = pair.get('es')
                        if es_word and target_lang in pair and pair[target_lang] == es_word:
                            unique_words[target_lang].add(es_word)
    except Exception:
        pass

en_words = list(unique_words['en'])
fr_words = list(unique_words['fr'])
print(f"Unique English words to translate: {len(en_words)}")
print(f"Unique French words to translate: {len(fr_words)}")

with open('words_to_translate.json', 'w', encoding='utf-8') as f:
    json.dump({'en': en_words, 'fr': fr_words}, f, ensure_ascii=False, indent=2)
