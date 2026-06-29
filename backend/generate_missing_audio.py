import os
from google.cloud import texttospeech
from dotenv import load_dotenv

# Cargar variables de entorno (para obtener las credenciales)
load_dotenv()

# Inicializar cliente de Google Text-to-Speech
client = texttospeech.TextToSpeechClient()

def generate_audio(filename, text, language_code="fr-FR", voice_name="fr-FR-Neural2-A"):
    synthesis_input = texttospeech.SynthesisInput(text=text)

    # Configurar la voz
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name=voice_name
    )

    # Configurar el archivo de salida
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Hacer la petición a Google
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # Asegurar que el directorio exista (lo guardaremos en una carpeta 'audios_generados' para no mezclarlos si te equivocas)
    os.makedirs("audios_generados", exist_ok=True)
    
    filepath = os.path.join("audios_generados", filename)
    with open(filepath, "wb") as out:
        out.write(response.audio_content)
        print(f"Generado exitosamente: {filepath}")

# Textos de ejemplo para los archivos faltantes.
# ¡Puedes cambiar estos textos por los reales después!
audios_faltantes = {
    # Faltantes de la Parte 1
    "part1_q5.mp3": "Regardez l'image numéro cinq.",
    "part1_q6.mp3": "Regardez l'image numéro six.",
    
    # Faltantes de la Parte 3 (Conversaciones)
    "part3_conv_6.mp3": "Conversation numéro six. Bonjour, avez-vous le menu ?",
    "part3_conv_7.mp3": "Conversation numéro sept. Le train partira dans cinq minutes.",
    "part3_conv_8.mp3": "Conversation numéro huit. J'aimerais annuler ma réservation.",
    "part3_conv_9.mp3": "Conversation numéro neuf. Où se trouve la salle de conférence ?",
    "part3_conv_10.mp3": "Conversation numéro dix. Votre passeport s'il vous plaît.",
    "part3_conv_11.mp3": "Conversation numéro onze. Quel est le prix de cet article ?",
    "part3_conv_12.mp3": "Conversation numéro douze. Je vous rappellerai plus tard.",
    "part3_conv_13.mp3": "Conversation numéro treize. C'est la fin des conversations.",
    
    # Faltantes de la Parte 4 (Charlas)
    "part4_talk_3.mp3": "Discours numéro trois. Bienvenue à notre réunion annuelle.",
    "part4_talk_4.mp3": "Discours numéro quatre. Voici les nouvelles du jour.",
    "part4_talk_5.mp3": "Discours numéro cinq. Attention passagers, le vol est retardé.",
    "part4_talk_6.mp3": "Discours numéro six. Merci d'avoir appelé notre service client.",
    "part4_talk_7.mp3": "Discours numéro sept. La météo annonce de la pluie aujourd'hui.",
    "part4_talk_8.mp3": "Discours numéro huit. Le magasin fermera dans dix minutes.",
    "part4_talk_9.mp3": "Discours numéro neuf. Visiteurs, veuillez suivre le guide.",
    "part4_talk_10.mp3": "Discours numéro dix. C'est la fin du test. Posez vos stylos."
}

print("Iniciando generación de audios con Google Cloud Text-to-Speech...\n")

for filename, text in audios_faltantes.items():
    generate_audio(filename, text)

print("\n¡Todos los audios faltantes han sido generados!")
