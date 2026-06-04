import os
import json

base_dirs = [
    r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons",
    r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\datapro\lessonspro"
]

bad_files = []
unique_words_en = set()
unique_words_fr = set()
unique_words_zh = set()

for d in base_dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.json'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    is_bad = False
                    if 'stages' in data and data['stages']:
                        for stage in data['stages']:
                            if stage.get('type') == 'pairing_drill':
                                pairs = stage.get('pairs', [])
                                for pair in pairs:
                                    es_w = pair.get('es')
                                    en_w = pair.get('en')
                                    fr_w = pair.get('fr')
                                    zh_w = pair.get('zh')
                                    
                                    if es_w:
                                        # check english
                                        if en_w == es_w:
                                            is_bad = True
                                            unique_words_en.add(es_w)
                                        # check french 
                                        if fr_w == es_w:
                                            is_bad = True
                                            unique_words_fr.add(es_w)
                                        # check zh
                                        if zh_w == es_w:
                                            is_bad = True
                                            unique_words_zh.add(es_w)
                                            
                    if is_bad:
                        bad_files.append(filepath)
                except Exception as e:
                    print(f"Error {filepath}: {e}")

print(f"Found {len(bad_files)} core lessons with potential translation errors.")
print(f"Unique words needing EN translation: {len(unique_words_en)}")
print(f"Unique words needing FR translation: {len(unique_words_fr)}")
print(f"Unique words needing ZH translation: {len(unique_words_zh)}")

with open('core_bad_files.txt', 'w', encoding='utf-8') as f:
    for bf in bad_files:
        f.write(bf + '\n')
        
words_data = {
    'en': list(unique_words_en),
    'fr': list(unique_words_fr),
    'zh': list(unique_words_zh)
}
with open('core_words_to_translate.json', 'w', encoding='utf-8') as f:
    json.dump(words_data, f, ensure_ascii=False, indent=2)
