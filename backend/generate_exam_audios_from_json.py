import os
import json
import random
import re
from google.cloud import texttospeech
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Inicializar cliente de Google TTS
client = texttospeech.TextToSpeechClient()

# Definir pool de voces variadas para simular el TOEIC real
VOICES = [
    {"language_code": "en-US", "name": "en-US-Journey-F"},
    {"language_code": "en-US", "name": "en-US-Journey-D"},
    {"language_code": "en-GB", "name": "en-GB-Neural2-A"},
    {"language_code": "en-AU", "name": "en-AU-Neural2-B"},
    {"language_code": "en-US", "name": "en-US-Neural2-J"}
]

def synthesize_audio(text, output_filepath, voice_index=None):
    if not text.strip():
        print(f"Skipping empty text for {output_filepath}")
        return

    # Turn (A) into A., (B) into B., etc. so TTS reads it naturally
    text = re.sub(r'\(A\)', 'A.', text)
    text = re.sub(r'\(B\)', 'B.', text)
    text = re.sub(r'\(C\)', 'C.', text)
    text = re.sub(r'\(D\)', 'D.', text)
    
    # Replace M: and W: with Man: and Woman:
    text = re.sub(r'\bM:\s*', 'Man: ', text)
    text = re.sub(r'\bW:\s*', 'Woman: ', text)

    synthesis_input = texttospeech.SynthesisInput(text=text)

    # Elegir voz
    if voice_index is not None:
        voice_cfg = VOICES[voice_index % len(VOICES)]
    else:
        voice_cfg = random.choice(VOICES)

    voice = texttospeech.VoiceSelectionParams(
        language_code=voice_cfg["language_code"],
        name=voice_cfg["name"]
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=0.9 # Slightly slower for clear exams
    )

    print(f"Generando audio con voz {voice_cfg['name']} para: {output_filepath}")
    
    try:
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        with open(output_filepath, "wb") as out:
            out.write(response.audio_content)
    except Exception as e:
        print(f"Error generando {output_filepath}: {e}")

def process_exam(json_filepath):
    print(f"Procesando archivo: {json_filepath}")
    with open(json_filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    exam_id = data.get('id', 'unknown_exam')
    
    # Directorio destino en el frontend
    base_out_dir = os.path.abspath(os.path.join(
        os.path.dirname(__file__), 
        "..", "frontend", "public", "media", "exams", exam_id, "audios"
    ))
    os.makedirs(base_out_dir, exist_ok=True)
    
    voice_idx = 0
    
    for stage in data.get('stages', []):
        stage_type = stage.get('type', '')
        if stage_type != 'listening':
            continue
            
        stage_id = stage.get('id', '')
        output_filepath = os.path.join(base_out_dir, f"{stage_id}.mp3")
        
        text_to_speak = ""
        
        # Lógica de extracción según la parte
        if stage_id.startswith('part1_'):
            # Part 1: Leer solo opciones
            for q in stage.get('questions', []):
                text_to_speak += " ".join(q.get('options', []))
                
        elif stage_id.startswith('part2_'):
            # Part 2: Leer la pregunta y luego las opciones
            for q in stage.get('questions', []):
                # Quitar el prefijo "Listen to the audio: "
                q_text = q.get('question', '').replace('Listen to the audio: ', '').strip(' "')
                options_text = " ".join(q.get('options', []))
                text_to_speak += f"{q_text} {options_text}"
                
        elif stage_id.startswith('part3_') or stage_id.startswith('part4_'):
            # Part 3/4: Extraer de AUDIO TRANSCRIPT
            instructions = stage.get('instructions', '')
            if 'AUDIO TRANSCRIPT:' in instructions:
                # Extraer todo desde AUDIO TRANSCRIPT: hasta \n\nYou will hear...
                parts = instructions.split('AUDIO TRANSCRIPT:')
                if len(parts) > 1:
                    transcript_raw = parts[1]
                    # Cortar donde empiezan las instrucciones generales
                    transcript_raw = transcript_raw.split('You will hear')[0].strip()
                    # Quitar guiones o secuencias extrañas
                    text_to_speak = transcript_raw
            else:
                print(f"Advertencia: No se encontró AUDIO TRANSCRIPT en {stage_id}")
        
        if text_to_speak:
            synthesize_audio(text_to_speak, output_filepath, voice_index=voice_idx)
            voice_idx += 1
        else:
            print(f"Skipping {stage_id}: no text to speak extracted.")

if __name__ == "__main__":
    exam_file = "app/data/lessons/en/toeic_listening_v1.json"
    process_exam(exam_file)
    print("¡Generación masiva completada exitosamente!")
