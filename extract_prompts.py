import json
import re

json_path = r'backend/app/data/lessons/en/toeic_mock_v1.json'
output_path = r'C:\Users\jeico\.gemini\antigravity-ide\brain\8c8a18d7-a1ff-4f34-8834-6268adb0789a\Guion_Completo_TOEIC_Listening.txt'

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except Exception as e:
    print(f"Error reading JSON: {e}")
    exit(1)

generated_files = [
    "part1_q1.mp3", "part1_q2.mp3", "part1_q3.mp3",
    "part2_q7.mp3", "part2_q8.mp3",
    "part3_conv_1.mp3", "part3_conv_2.mp3",
    "part4_talk_1.mp3", "part4_talk_2.mp3"
]

already_generated = []
to_generate = []

for stage in data.get('stages', []):
    s_id = stage.get('id', '')
    if not s_id.startswith('part1') and not s_id.startswith('part2') and not s_id.startswith('part3') and not s_id.startswith('part4'):
        continue

    title = stage.get('title', '')
    questions = stage.get('questions', [])
    
    if s_id.startswith('part1'):
        q_num = s_id.split('_q')[-1]
        file_name = f"part1_q{q_num}"
        block = f"----------------------------------------\n## Archivo: {file_name}\n## {title}\n\n"
        block += f"Look at the picture marked number {q_num} in your test book.\n<break time='1.5s' />\n"
        
        opts = questions[0].get('options', [])
        for i, opt in enumerate(opts):
            block += opt + "\n"
            if i < len(opts) - 1:
                block += "<break time='1.5s' />\n"
        block += "\n"
        
        if f"{file_name}.mp3" in generated_files:
            already_generated.append(block)
        else:
            to_generate.append(block)
            
    elif s_id.startswith('part2'):
        for q in questions:
            q_id = q.get('id', '')
            q_num = q_id.replace('q', '')
            file_name = f"part2_q{q_num}"
            q_text = q.get('question', '').replace('Listen to the audio: ', '').replace('"', '')
            
            block = f"----------------------------------------\n## Archivo: {file_name}\n## Part 2: Question-Response (Question {q_num})\n\n"
            block += f"Number {q_num}. {q_text}\n<break time='1.5s' />\n"
            opts = q.get('options', [])
            for i, opt in enumerate(opts):
                block += opt + "\n"
                if i < len(opts) - 1:
                    block += "<break time='1.0s' />\n"
            block += "\n"
            
            if f"{file_name}.mp3" in generated_files:
                already_generated.append(block)
            else:
                to_generate.append(block)
                
    elif s_id.startswith('part3') or s_id.startswith('part4'):
        file_name = f"{s_id}"
        instructions = stage.get('instructions', '')
        
        transcript = ""
        if "AUDIO TRANSCRIPT:" in instructions:
            parts = instructions.split("AUDIO TRANSCRIPT:")
            if len(parts) > 1:
                t_raw = parts[1].split("\n\nYou will hear")[0].strip()
                lines = t_raw.split('\n')
                for line in lines:
                    line = line.strip()
                    if line.startswith('M:') or line.startswith('W:') or line.startswith('M1:') or line.startswith('F1:'):
                        clean_line = line.split(':', 1)[1].strip()
                        transcript += clean_line + "\n<break time='1.0s' />\n"
                    else:
                        transcript += line + "\n"
        
        if not transcript:
            transcript = "[No se encontró el texto del diálogo en 'instructions']"
            
        block = f"----------------------------------------\n## Archivo: {file_name}\n## {title}\n\n"
        block += f"Questions {questions[0]['id'].replace('q','')} through {questions[-1]['id'].replace('q','')} refer to the following {'conversation' if 'part3' in s_id else 'talk'}.\n<break time='1.5s' />\n"
        block += transcript.strip() + "\n"
        
        if block.endswith("<break time='1.0s' />\n"):
            block = block[:-22] + "\n"
            
        block += "\n"
        
        if file_name in generated_files:
            already_generated.append(block)
        else:
            to_generate.append(block)

final_text = "# GUION COMPLETO - TOEIC LISTENING (100 PREGUNTAS)\n"
final_text += "Copia y pega cada bloque en ElevenLabs.\n\n"

final_text += "=" * 50 + "\n"
final_text += "🔴 SECCIÓN 1: AUDIOS PENDIENTES POR GENERAR (91 Archivos)\n"
final_text += "=" * 50 + "\n\n"
final_text += "".join(to_generate)

final_text += "\n\n" + "=" * 50 + "\n"
final_text += "🟢 SECCIÓN 2: AUDIOS YA GENERADOS (9 Archivos - Omítelos)\n"
final_text += "=" * 50 + "\n\n"
final_text += "".join(already_generated)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(final_text)

print(f"Successfully generated {output_path}")
