import os
import json
import sys

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

lessons_dir = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\backend\\app\\data\\lessons"

all_files = []
for root, dirs, files in os.walk(lessons_dir):
    for f in files:
        if f.endswith(".json"):
            all_files.append(os.path.join(root, f))

# Separate French, Chinese and English files
fr_files = [path for path in all_files if "\\fr\\" in path or "/fr/" in path]
zh_files = [path for path in all_files if "\\zh\\" in path or "/zh/" in path]
en_files = [path for path in all_files if path not in fr_files and path not in zh_files]

print(f"Total files found: {len(all_files)}")
print(f"French files: {len(fr_files)}")
print(f"Chinese files: {len(zh_files)}")
print(f"English files: {len(en_files)}")

def audit_files(files_list, lang_name):
    print(f"\n==========================================")
    print(f"AUDITING {lang_name.upper()} ({len(files_list)} files)")
    print(f"==========================================")
    
    choice_questions = {}
    order_sentences = {}
    listening_texts = {}
    fill_questions = {}
    
    for path in files_list:
        with open(path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error reading {path}: {e}")
                continue
                
            stages = data.get("stages", [])
            for stage in stages:
                stg_type = stage.get("type")
                questions = stage.get("questions", [])
                for q in questions:
                    q_type = q.get("type")
                    if q_type == "quiz_choice":
                        text = q.get("question")
                        choice_questions[text] = choice_questions.get(text, 0) + 1
                    elif q_type == "order_sentence":
                        # Audit by the correct sentence structure itself
                        text = " ".join(q.get("correct_order", []))
                        order_sentences[text] = order_sentences.get(text, 0) + 1
                    elif q_type == "listening_match":
                        text = q.get("tts_text")
                        listening_texts[text] = listening_texts.get(text, 0) + 1
                    elif q_type == "fill_input":
                        text = q.get("question")
                        fill_questions[text] = fill_questions.get(text, 0) + 1
                        
    # Check for any duplicate
    duplicates_found = 0
    
    for category, name in [
        (choice_questions, "Choice Questions"),
        (order_sentences, "Order Sentences"),
        (listening_texts, "Listening Texts"),
        (fill_questions, "Fill Questions")
    ]:
        dups = {q: count for q, count in category.items() if count > 1}
        if dups:
            print(f"\n--- DUPLICATE {name.upper()} ({len(dups)} found) ---")
            sorted_dups = sorted(dups.items(), key=lambda x: x[1], reverse=True)
            for q, count in sorted_dups[:10]:
                print(f"Count {count}: {q}")
            duplicates_found += len(dups)
        else:
            print(f"\nNo duplicate {name} found.")
            
    print(f"\n[Result] Total unique questions in {lang_name}:")
    print(f"  - Choice: {len(choice_questions)}")
    print(f"  - Order: {len(order_sentences)}")
    print(f"  - Listening: {len(listening_texts)}")
    print(f"  - Fill: {len(fill_questions)}")
    print(f"Total exercises in {lang_name}: {len(choice_questions) + len(order_sentences) + len(listening_texts) + len(fill_questions)}")
    print(f"Total duplicate configurations: {duplicates_found}")
    return duplicates_found

# Audit French first
fr_duplicates = audit_files(fr_files, "French")

# Audit Chinese second
zh_duplicates = audit_files(zh_files, "Chinese")

# Audit English third
en_duplicates = audit_files(en_files, "English")

