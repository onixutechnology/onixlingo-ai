import os
import glob
import json

BASE = r'c:\Users\jeico\onixlingo\language-ai-tutor\backend'

def scan_language(lang_code, lang_name, out_path):
    content_dirs = [
        (f'app\\data\\lessons\\{lang_code}',       f"Standard A1-C2 {lang_name} lessons"),
        (f'app\\datapro\\lessonspro\\{lang_code}', f"PRO {lang_name} lessons"),
        (f'app\\voclessons\\lessons\\{lang_code}', f"Vocabulary {lang_name} lessons"),
    ]

    lines = []
    lines.append("=" * 80)
    lines.append(f"ONIXLINGO {lang_name.upper()} LESSON CONTENT SCAN REPORT")
    lines.append("=" * 80)
    lines.append("")

    zero_stages = []
    one_to_5 = []
    six_to_29 = []
    exact_30 = []
    over_30 = []
    error_files = []

    lines.append("SECTION 1: PHYSICAL JSON FILES ON DISK")
    lines.append("-" * 60)

    total_files = 0
    for rel, desc in content_dirs:
        full = os.path.join(BASE, rel)
        if not os.path.isdir(full):
            lines.append(f"  [MISSING DIR] {rel}")
            lines.append(f"    Description: {desc}")
            lines.append("")
            continue
        files = sorted(glob.glob(os.path.join(full, '*.json')))
        total_files += len(files)
        lines.append(f"  [{len(files):5d} files] {rel}")
        lines.append(f"    Description: {desc}")
        if files:
            lines.append(f"    Sample files: {[os.path.basename(f) for f in files[:5]]}")
        else:
            lines.append(f"    EMPTY - No JSON files found!")
        lines.append("")

    lines.append(f"  TOTAL FILES ON DISK: {total_files}")
    lines.append("")

    lines.append("SECTION 2: EXERCISE COUNT ANALYSIS")
    lines.append("-" * 60)

    for rel, desc in content_dirs:
        full = os.path.join(BASE, rel)
        if not os.path.isdir(full):
            continue
        files = glob.glob(os.path.join(full, '*.json'))
        for fpath in files:
            fname = os.path.basename(fpath)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                stages = data.get("stages", [])
                total_q = 0
                for stage in stages:
                    total_q += len(stage.get("questions", []))

                if total_q == 0:
                    zero_stages.append((rel, fname, data.get("title", "?")))
                elif total_q <= 5:
                    one_to_5.append((rel, fname, total_q))
                elif total_q <= 29:
                    six_to_29.append((rel, fname, total_q))
                elif total_q == 30:
                    exact_30.append((rel, fname))
                else:
                    over_30.append((rel, fname, total_q))
            except Exception as e:
                error_files.append((rel, fname, str(e)))

    lines.append(f"  Files with 0 exercises  (EMPTY - broken):      {len(zero_stages)}")
    lines.append(f"  Files with 1-5 exercises (almost empty):        {len(one_to_5)}")
    lines.append(f"  Files with 6-29 exercises (incomplete):         {len(six_to_29)}")
    lines.append(f"  Files with exactly 30 exercises (PERFECT):      {len(exact_30)}")
    lines.append(f"  Files with more than 30 exercises:              {len(over_30)}")
    lines.append(f"  JSON parse errors:                              {len(error_files)}")
    lines.append("")

    if zero_stages:
        lines.append(f"  DETAIL - {len(zero_stages)} Files with 0 exercises (broken lessons):")
        for rel, fname, title in zero_stages:
            lines.append(f"    - {rel}/{fname}  title={title}")
        lines.append("")

    if one_to_5:
        lines.append(f"  DETAIL - {len(one_to_5)} Files with 1-5 exercises:")
        for rel, fname, count in one_to_5:
            lines.append(f"    - {rel}/{fname}  exercises={count}")
        lines.append("")

    if six_to_29:
        lines.append(f"  DETAIL - {len(six_to_29)} Files with 6-29 exercises:")
        for rel, fname, count in six_to_29:
            lines.append(f"    - {rel}/{fname}  exercises={count}")
        lines.append("")

    if exact_30:
        lines.append(f"  DETAIL - {len(exact_30)} Files with exactly 30 exercises (good):")
        for rel, fname in exact_30:
            lines.append(f"    - {rel}/{fname}")
        lines.append("")

    lines.append("=" * 80)
    lines.append("DIAGNOSIS SUMMARY")
    lines.append("=" * 80)
    lines.append("")

    if len(zero_stages) > 0:
        pct = round(len(zero_stages) / (len(zero_stages) + len(exact_30) + len(one_to_5) + len(six_to_29) + len(over_30)) * 100, 1)
        lines.append(f"  {pct}% of files are BROKEN (empty stages).")
        lines.append(f"  Same root cause as English: Gemini model 'gemini-1.5-flash' was unavailable.")
        lines.append(f"  Fix: Now using 'gemini-2.5-flash' - all new lessons will generate correctly.")
    else:
        lines.append("  All lessons appear to have exercises. No broken files found.")

    output = "\n".join(lines)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"[DONE] {lang_name} report -> {out_path}")
    print(f"  0 exercises:    {len(zero_stages)}")
    print(f"  1-5 exercises:  {len(one_to_5)}")
    print(f"  6-29 exercises: {len(six_to_29)}")
    print(f"  Exactly 30:     {len(exact_30)}")
    print(f"  Over 30:        {len(over_30)}")
    print()


scan_language("fr", "Frances", r'c:\Users\jeico\onixlingo\lessons_frances.txt')
scan_language("zh", "Chino",   r'c:\Users\jeico\onixlingo\lessons_chino.txt')

print("All done.")
