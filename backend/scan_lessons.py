import os
import glob
import json
from pathlib import Path

BASE = r'c:\Users\jeico\onixlingo\language-ai-tutor\backend'

# ==========================================
# 1. SCAN ALL CONTENT DIRECTORIES
# ==========================================
content_dirs = [
    (r'app\data\lessons\en',       "Standard A1-C2 English lessons"),
    (r'app\data\lessons\fr',       "Standard French lessons"),
    (r'app\data\lessons\zh',       "Standard Chinese lessons"),
    (r'app\datapro\lessonspro\en', "PRO English lessons"),
    (r'app\datapro\lessonspro\fr', "PRO French lessons"),
    (r'app\datapro\lessonspro\zh', "PRO Chinese lessons"),
    (r'app\voclessons\lessons\en', "Vocabulary English lessons"),
    (r'app\voclessons\lessons\fr', "Vocabulary French lessons"),
    (r'app\voclessons\lessons\zh', "Vocabulary Chinese lessons"),
]

lines = []
lines.append("=" * 80)
lines.append("ONIXLINGO LESSON CONTENT SCAN REPORT")
lines.append("=" * 80)
lines.append("")

total_expected_standard = 1200
total_expected_pro = 3000
total_expected_voc = 620

lines.append("SECTION 1: PHYSICAL JSON FILES ON DISK")
lines.append("-" * 60)

for rel, desc in content_dirs:
    full = os.path.join(BASE, rel)
    if not os.path.isdir(full):
        lines.append(f"  [MISSING DIR] {rel}")
        lines.append(f"    Description: {desc}")
        continue
    files = sorted(glob.glob(os.path.join(full, '*.json')))
    lines.append(f"  [{len(files):4d} files] {rel}")
    lines.append(f"    Description: {desc}")

    # Show first 5 and last 5 files
    if files:
        lines.append(f"    First files: {[os.path.basename(f) for f in files[:5]]}")
    else:
        lines.append(f"    EMPTY - No JSON files found!")
    lines.append("")

# ==========================================
# 2. ANALYZE EXISTING LESSON FILES
# ==========================================
lines.append("")
lines.append("SECTION 2: EXERCISE COUNT ANALYSIS (Existing Files)")
lines.append("-" * 60)

zero_stages = []
one_to_5 = []
six_to_29 = []
exact_30 = []
over_30 = []
error_files = []

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
                zero_stages.append((rel, fname, data.get("title","?"), data.get("tags",[])))
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

lines.append(f"  Files with 0 exercises (empty stages / error):  {len(zero_stages)}")
lines.append(f"  Files with 1-5 exercises:                        {len(one_to_5)}")
lines.append(f"  Files with 6-29 exercises (incomplete):          {len(six_to_29)}")
lines.append(f"  Files with exactly 30 exercises (PERFECT):       {len(exact_30)}")
lines.append(f"  Files with more than 30 exercises:               {len(over_30)}")
lines.append(f"  Files with JSON errors:                          {len(error_files)}")

if zero_stages:
    lines.append("")
    lines.append("  DETAIL - Files with 0 exercises (empty/error lessons):")
    for rel, fname, title, tags in zero_stages:
        lines.append(f"    - {rel}/{fname}  title={title}  tags={tags}")

if one_to_5:
    lines.append("")
    lines.append("  DETAIL - Files with 1-5 exercises:")
    for rel, fname, count in one_to_5:
        lines.append(f"    - {rel}/{fname}  exercises={count}")

if six_to_29:
    lines.append("")
    lines.append("  DETAIL - Files with 6-29 exercises (incomplete):")
    for rel, fname, count in six_to_29:
        lines.append(f"    - {rel}/{fname}  exercises={count}")

if exact_30:
    lines.append("")
    lines.append("  DETAIL - Files with exactly 30 exercises (good):")
    for rel, fname in exact_30:
        lines.append(f"    - {rel}/{fname}")

if over_30:
    lines.append("")
    lines.append("  DETAIL - Files with more than 30 exercises:")
    for rel, fname, count in over_30:
        lines.append(f"    - {rel}/{fname}  exercises={count}")

# ==========================================
# 3. CATALOG vs DISK COMPARISON
# ==========================================
lines.append("")
lines.append("SECTION 3: CATALOG vs DISK (Standard Lessons)")
lines.append("-" * 60)

# Try to load the catalog
try:
    import sys
    sys.path.insert(0, BASE)
    from app.services.curriculum_factory import CATALOG
    catalog_ids = list(CATALOG.keys())
    lines.append(f"  Total lesson IDs in CATALOG (in-memory): {len(catalog_ids)}")
    
    en_dir = os.path.join(BASE, r'app\data\lessons\en')
    disk_files = {os.path.splitext(f)[0].lower() for f in os.listdir(en_dir) if f.endswith('.json')}
    
    missing = [lid for lid in catalog_ids if lid.lower() not in disk_files]
    present = [lid for lid in catalog_ids if lid.lower() in disk_files]
    
    lines.append(f"  Lessons on disk that match catalog:      {len(present)}")
    lines.append(f"  Lessons in catalog but MISSING from disk: {len(missing)}")
    
    if missing[:20]:
        lines.append(f"  First 20 missing lesson IDs:")
        for mid in missing[:20]:
            lines.append(f"    - {mid}")
    if len(missing) > 20:
        lines.append(f"    ...and {len(missing)-20} more")
except Exception as e:
    lines.append(f"  Could not load CATALOG: {e}")

# ==========================================
# 4. CODE SCAN: WHERE IS GEMINI GENERATION TRIGGERED
# ==========================================
lines.append("")
lines.append("SECTION 4: CODE LOCATIONS WHERE GEMINI/AI GENERATION IS TRIGGERED")
lines.append("-" * 60)

py_files = glob.glob(os.path.join(BASE, '**', '*.py'), recursive=True)
generation_keywords = [
    ('generate_dynamic_lesson', "Calls AI to generate a full lesson dynamically"),
    ('generate_content_async', "Direct Gemini async call"),
    ('generate_content(', "Direct Gemini sync call"),
    ('genai.configure', "Configures Gemini API key"),
    ('GenerativeModel', "Creates a Gemini model instance"),
    ('curriculum_factory', "Imports/uses the curriculum factory module"),
]

for keyword, description in generation_keywords:
    hits = []
    for py_file in py_files:
        try:
            with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    if keyword in line:
                        rel_path = os.path.relpath(py_file, BASE)
                        hits.append(f"    {rel_path}:{i}  ->  {line.strip()[:80]}")
        except:
            pass
    if hits:
        lines.append(f"  [{keyword}] - {description}")
        for h in hits:
            lines.append(h)
        lines.append("")

# ==========================================
# 5. CODE SCAN: WHERE IS THE ERROR FALLBACK
# ==========================================
lines.append("")
lines.append("SECTION 5: CODE LOCATIONS WHERE EMPTY/ERROR LESSON IS RETURNED AS FALLBACK")
lines.append("-" * 60)

fallback_keywords = [
    '"stages": []',
    "'stages': []",
    '"stages":[]}',
    'Generation Error',
    '"tags": ["Error"]',
]

for keyword in fallback_keywords:
    hits = []
    for py_file in py_files:
        try:
            with open(py_file, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    if keyword in line:
                        rel_path = os.path.relpath(py_file, BASE)
                        hits.append(f"    {rel_path}:{i}  ->  {line.strip()[:100]}")
        except:
            pass
    if hits:
        lines.append(f"  Fallback pattern: '{keyword}'")
        for h in hits:
            lines.append(h)
        lines.append("")

# Also check JSON files for the error pattern
lines.append("  JSON files on disk containing 'Generation Error':")
all_jsons = glob.glob(os.path.join(BASE, '**', '*.json'), recursive=True)
for jpath in all_jsons:
    try:
        with open(jpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        if 'Generation Error' in content:
            lines.append(f"    {os.path.relpath(jpath, BASE)}")
    except:
        pass

# ==========================================
# 6. SUMMARY AND RECOMMENDATIONS
# ==========================================
lines.append("")
lines.append("=" * 80)
lines.append("SECTION 6: DIAGNOSIS SUMMARY & RECOMMENDATIONS")
lines.append("=" * 80)
lines.append("""
ROOT CAUSE IDENTIFIED:
  OnixLingo uses a "lazy generation" architecture where lesson JSON files are
  generated ON DEMAND via Gemini AI when a user first accesses a lesson.
  The generated file is then cached to disk to avoid re-generating.

  The system was configured to use "gemini-1.5-flash" (or "gemini-pro"),
  which is NOT available in the configured GEMINI_API_KEY. This caused every
  single AI generation call to fail with a 404 model not found error.

  When generation fails, the system returns a fallback object:
    { "id": "...", "title": "Generation Error - ...", "stages": [] }
  
  If this fallback was also cached to disk (it was for a1-1.json),
  the corrupted file would be served permanently, resulting in a blank lesson.

AFFECTED AREAS:
  1. Standard lessons (A1-C2):  All ~1200 lessons in app/data/lessons/
  2. Pro lessons:                All ~3000 lessons in app/datapro/lessonspro/
  3. Vocabulary lessons:         All ~620 lessons in app/voclessons/lessons/
  4. Multi-language variants:    en/fr/zh for each above

CURRENT STATUS:
  - Gemini model updated to "gemini-2.5-flash" (tested and confirmed working)
  - a1-1.json: Replaced with static test file (working)
  - All other lessons: Will generate correctly with new model on first access

OPTIONS TO FIX ALL LESSONS:
  OPTION A (Recommended): Activate Gemini with corrected model.
    Lessons generate automatically on demand. Already fixed for new model.
    
  OPTION B: Pre-generate all lessons in batch.
    Run a script that iterates all 1200+ catalog IDs and generates each
    lesson file using the corrected Gemini 2.5-flash model. Slow but ensures
    all lessons are ready before users access them.
    
  OPTION C: Use static lesson files.
    Create hand-crafted JSON for each lesson. Very slow, 1200+ files needed.
""")

output = "\n".join(lines)

# Save to file (skip print to avoid Windows cp1252 encoding issues)
out_path = r'c:\Users\jeico\onixlingo\lessons.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(output)

# Print a simple ASCII-only summary to console
print(f"[DONE] Report saved to: {out_path}")
print(f"[SUMMARY]")
print(f"  Files 0 exercises:    {len(zero_stages)}")
print(f"  Files 1-5 exercises:  {len(one_to_5)}")
print(f"  Files 6-29 exercises: {len(six_to_29)}")
print(f"  Files exactly 30:     {len(exact_30)}")
print(f"  Files over 30:        {len(over_30)}")
print(f"  JSON errors:          {len(error_files)}")

