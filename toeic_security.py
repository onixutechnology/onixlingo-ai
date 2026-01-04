import math
from datetime import datetime
from enum import Enum

class ViolationType(Enum):
    LOOK_AWAY = "look_away"      # Mirar fuera de la pantalla
    FACE_MISSING = "face_lost"   # No hay cara detectada
    MULTIPLE_FACES = "intruder"  # Alguien más en cámara
    TAB_SWITCH = "tab_switch"    # Cambiar de pestaña

class ToeicSecurityEngine:
    """
    Motor de Proctoring de Nivel Militar para TOEIC.
    Analiza vectores de telemetría facial y anula exámenes fraudulentos.
    """
    def __init__(self, strictness_level="HIGH"):
        # Umbrales de rotación de cabeza (en grados)
        self.MAX_YAW = 20.0   # Girar cabeza izq/der
        self.MAX_PITCH = 15.0 # Mover cabeza arriba/abajo
        self.violation_log = []
        self.integrity_score = 100.0  # Empiezas con 100% de credibilidad
        self.is_exam_voided = False

    def process_telemetry_frame(self, head_pose, face_count):
        """
        Recibe datos cada 500ms del frontend.
        head_pose: dict {yaw, pitch, roll}
        face_count: int
        """
        violation = None
        
        # 1. Análisis de Presencia
        if face_count == 0:
            violation = ViolationType.FACE_MISSING
        elif face_count > 1:
            violation = ViolationType.MULTIPLE_FACES
            self.integrity_score -= 20 # Penalización grave
            
        # 2. Análisis de Postura (Si hay una sola cara)
        elif head_pose:
            # Calcular desviación absoluta
            yaw_deviation = abs(head_pose.get('yaw', 0))
            pitch_deviation = abs(head_pose.get('pitch', 0))

            if yaw_deviation > self.MAX_YAW or pitch_deviation > self.MAX_PITCH:
                violation = ViolationType.LOOK_AWAY
                self.integrity_score -= 2 # Penalización leve pero acumulativa

        # 3. Registro y Acción
        if violation:
            self._log_violation(violation)
            return {
                "status": "ALERT",
                "ui_action": "TURN_RED", # Comanda al frontend ponerse rojo
                "warning_msg": "Retorno visual detectado. Mantenga la vista al frente."
            }
        
        return {"status": "OK", "ui_action": "NONE"}

    def _log_violation(self, v_type):
        self.violation_log.append({
            "type": v_type.value,
            "timestamp": datetime.now().isoformat(),
            "remaining_integrity": self.integrity_score
        })
        
        # Si la integridad baja del 60%, el examen se anula automáticamente
        if self.integrity_score < 60:
            self.is_exam_voided = True

    def get_security_report(self):
        return {
            "valid_exam": not self.is_exam_voided,
            "integrity_score": round(self.integrity_score, 2),
            "total_violations": len(self.violation_log),
            "breakdown": self.violation_log
        }