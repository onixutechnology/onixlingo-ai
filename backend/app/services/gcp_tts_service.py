import base64
import logging
import httpx
from app.core.settings import settings

logger = logging.getLogger("OnixLingo.GcpTtsService")

class GcpTtsService:
    def __init__(self):
        self.api_key = settings.GOOGLE_CLOUD_API_KEY
        self.endpoint = "https://texttospeech.googleapis.com/v1/text:synthesize"

    async def synthesize_speech(self, text: str, lang: str = "en") -> bytes:
        """
        Sintetiza texto a voz ultra-realista de Google Cloud en formato MP3 (bytes).
        Soporta inglés (en), francés (fr) y chino (zh).
        """
        if not self.api_key or self.api_key == "AIzaSy...":
            logger.warning("⚠️ GOOGLE_CLOUD_API_KEY no configurada. No se generará audio de alta fidelidad.")
            return b""

        # Configuración de voz por idioma
        lang = lang.lower()
        if lang == "fr":
            language_code = "fr-FR"
            voice_name = "fr-FR-Neural2-B"  # Voz Neural2 premium masculina en francés
        elif lang == "zh":
            language_code = "zh-CN"
            voice_name = "zh-CN-Neural2-B"  # Voz Neural2 premium masculina en chino mandarín
        else:
            language_code = "en-US"
            voice_name = "en-US-Neural2-J"  # Voz Neural2 premium masculina en inglés americano

        payload = {
            "input": {
                "text": text
            },
            "voice": {
                "languageCode": language_code,
                "name": voice_name
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "speakingRate": 1.0,
                "pitch": 0.0
            }
        }

        url = f"{self.endpoint}?key={self.api_key}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload)
                
                if response.status_code != 200:
                    logger.error(f"❌ Error en la API de Text-to-Speech de Google Cloud: {response.status_code} - {response.text}")
                    return b""
                
                data = response.json()
                audio_content = data.get("audioContent", "")
                
                if not audio_content:
                    logger.error("❌ La respuesta de Google Cloud no contiene 'audioContent'.")
                    return b""
                
                # Decodificar el contenido de audio base64 a bytes binarios
                audio_bytes = base64.b64decode(audio_content)
                logger.info(f"✨ Audio sintetizado con éxito ({len(audio_bytes)} bytes) para idioma: {lang}")
                return audio_bytes

        except Exception as e:
            logger.error(f"🔥 Error crítico al sintetizar voz con Google Cloud TTS: {e}")
            return b""
