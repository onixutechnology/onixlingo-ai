import json
import glob

path = r'c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\voclessons\lessons\**\*.json'
files = glob.glob(path, recursive=True)

bad_files_list = []

for f in files:
    try:
        with open(f, encoding='utf-8') as file:
            data = json.load(file)
            if 'stages' in data and data['stages']:
                for stage in data['stages']:
                    pairs = stage.get('pairs', [])
                    is_bad = False
                    for pair in pairs:
                        es_word = pair.get('es')
                        if es_word:
                            if 'en' in pair and pair['en'] == es_word:
                                is_bad = True
                            if 'fr' in pair and pair['fr'] == es_word:
                                is_bad = True
                            if 'zh' in pair and pair['zh'] == es_word:
                                is_bad = True
                    if is_bad:
                        bad_files_list.append(f)
                        break
    except Exception as e:
        pass

with open('bad_files.txt', 'w', encoding='utf-8') as out:
    for bf in bad_files_list:
        out.write(bf + "\n")
print(f"Found {len(bad_files_list)} bad files.")
