import os
import glob
import json

BASE = r'c:\Users\jeico\onixlingo\language-ai-tutor\backend'

def scan_dirs(label, dirs_with_desc, out_path):
    lines = []
    lines.append("=" * 80)
    lines.append(f"ONIXLINGO SCAN: {label.upper()}")
    lines.append("=" * 80)
    lines.append("")

    zero_stages = []
    one_to_5 = []
    six_to_29 = []
    exact_30 = []
    over_30 = []
    missing_dirs = []
    error_files = []
    total_files = 0

    lines.append("SECTION 1: DIRECTORIES ON DISK")
    lines.append("-" * 60)

    for rel, desc in dirs_with_desc:
        full = os.path.join(BASE, rel)
        if not os.path.isdir(full):
            missing_dirs.append(rel)
            lines.append(f"  [DIR NOT FOUND] {rel}")
            lines.append(f"    -> {desc}")
            lines.append("")
            continue
        files = sorted(glob.glob(os.path.join(full, '*.json')))
        total_files += len(files)
        lines.append(f"  [{len(files):5d} files] {rel}")
        lines.append(f"    -> {desc}")
        if files:
            lines.append(f"    Sample: {[os.path.basename(f) for f in files[:5]]}")
        else:
            lines.append(f"    DIRECTORY IS EMPTY - No JSON lesson files!")
        lines.append("")

        for fpath in files:
            fname = os.path.basename(fpath)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                stages = data.get("stages", [])
                total_q = sum(len(s.get("questions", [])) for s in stages)
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

    lines.append(f"  TOTAL FILES SCANNED: {total_files}")
    lines.append(f"  MISSING DIRECTORIES: {len(missing_dirs)}")
    if missing_dirs:
        for md in missing_dirs:
            lines.append(f"    - {md}")
    lines.append("")

    lines.append("SECTION 2: EXERCISE COUNT RESULTS")
    lines.append("-" * 60)
    lines.append(f"  Files with 0 exercises  (BROKEN - empty stages): {len(zero_stages)}")
    lines.append(f"  Files with 1-5 exercises:                         {len(one_to_5)}")
    lines.append(f"  Files with 6-29 exercises (incomplete):           {len(six_to_29)}")
    lines.append(f"  Files with exactly 30 (PERFECT):                  {len(exact_30)}")
    lines.append(f"  Files with more than 30:                          {len(over_30)}")
    lines.append(f"  JSON errors:                                       {len(error_files)}")
    lines.append("")

    if zero_stages:
        lines.append(f"  BROKEN LESSONS ({len(zero_stages)} files with empty stages):")
        for rel, fname, title in zero_stages:
            lines.append(f"    - {rel}/{fname}  [{title}]")
        lines.append("")

    if one_to_5:
        lines.append(f"  LOW EXERCISE LESSONS ({len(one_to_5)} files, 1-5 exercises):")
        for rel, fname, count in one_to_5:
            lines.append(f"    - {rel}/{fname}  exercises={count}")
        lines.append("")

    if six_to_29:
        lines.append(f"  INCOMPLETE LESSONS ({len(six_to_29)} files, 6-29 exercises):")
        for rel, fname, count in six_to_29:
            lines.append(f"    - {rel}/{fname}  exercises={count}")
        lines.append("")

    total = len(zero_stages) + len(one_to_5) + len(six_to_29) + len(exact_30) + len(over_30)
    lines.append("=" * 80)
    lines.append("DIAGNOSIS")
    lines.append("=" * 80)
    if total > 0:
        pct_broken = round((len(zero_stages) / total) * 100, 1)
        pct_ok = round((len(exact_30) / total) * 100, 1)
        lines.append(f"  Total files analyzed:  {total}")
        lines.append(f"  OK (30 exercises):     {len(exact_30)} ({pct_ok}%)")
        lines.append(f"  BROKEN (0 exercises):  {len(zero_stages)} ({pct_broken}%)")
        lines.append("")
        if len(zero_stages) > 0:
            lines.append("  ROOT CAUSE: Gemini generation failed (model 'gemini-1.5-flash' not found).")
            lines.append("  FIX APPLIED: Backend now uses 'gemini-2.5-flash'.")
            lines.append("  ACTION NEEDED: Run batch pre-generation OR let system lazy-generate on access.")
        else:
            lines.append("  STATUS: All lessons are complete. No action needed.")
    else:
        lines.append("  No files were found in any directory.")
        lines.append("  This entire section needs content generation from scratch.")

    output = "\n".join(lines)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output)

    # ASCII-only console output
    print(f"[DONE] {label}")
    print(f"  Report: {out_path}")
    print(f"  Total files:     {total_files}")
    print(f"  BROKEN (0 exer): {len(zero_stages)}")
    print(f"  OK (30 exer):    {len(exact_30)}")
    print(f"  Missing dirs:    {len(missing_dirs)}")
    print()


# -----------------------------------------------
# EXECUTIVE / PRO PLAN (datapro/lessonspro)
# -----------------------------------------------
scan_dirs(
    label="EXECUTIVE PLAN (Pro Lessons - datapro/lessonspro)",
    dirs_with_desc=[
        (r'app\datapro\lessonspro\en', "Executive English Pro lessons"),
        (r'app\datapro\lessonspro\fr', "Executive French Pro lessons"),
        (r'app\datapro\lessonspro\zh', "Executive Chinese Pro lessons"),
    ],
    out_path=r'c:\Users\jeico\onixlingo\lessons_executive.txt'
)

# -----------------------------------------------
# VOCABULARY (voclessons)
# -----------------------------------------------
scan_dirs(
    label="VOCABULARY LESSONS (voclessons)",
    dirs_with_desc=[
        (r'app\voclessons\lessons\en', "Vocabulary English lessons"),
        (r'app\voclessons\lessons\fr', "Vocabulary French lessons"),
        (r'app\voclessons\lessons\zh', "Vocabulary Chinese lessons"),
    ],
    out_path=r'c:\Users\jeico\onixlingo\lessons_vocabulary.txt'
)

# -----------------------------------------------
# STANDARD (data/lessons) all languages
# -----------------------------------------------
scan_dirs(
    label="STANDARD LESSONS (A1-C2 - data/lessons) ALL LANGUAGES",
    dirs_with_desc=[
        (r'app\data\lessons\en', "Standard English lessons"),
        (r'app\data\lessons\fr', "Standard French lessons"),
        (r'app\data\lessons\zh', "Standard Chinese lessons"),
    ],
    out_path=r'c:\Users\jeico\onixlingo\lessons_standard.txt'
)

print("All reports generated.")
