import math
from typing import Dict, Any

class GamificationService:
    @staticmethod
    def calculate_level(xp: int) -> int:
        """Calcula el nivel actual basado en el XP."""
        return math.floor(xp / 500) + 1

    @staticmethod
    def calculate_next_level_xp(xp: int) -> int:
        """Calcula el XP necesario para el SIGUIENTE nivel."""
        level = GamificationService.calculate_level(xp)
        return level * 500

    @staticmethod
    def calculate_current_base_xp(xp: int) -> int:
        """Calcula el XP base del nivel ACTUAL."""
        level = GamificationService.calculate_level(xp)
        return (level - 1) * 500

    @staticmethod
    def calculate_progress_percent(xp: int) -> int:
        """Calcula el porcentaje de progreso hacia el siguiente nivel (0-100)."""
        next_xp = GamificationService.calculate_next_level_xp(xp)
        current_base = GamificationService.calculate_current_base_xp(xp)
        if next_xp == current_base:
            return 100
        return round(((xp - current_base) / (next_xp - current_base)) * 100)

    @staticmethod
    def get_tier_name(level: int) -> str:
        """Retorna el nombre del tier basado en el nivel."""
        if level >= 20:
            return 'Titanium Elite'
        elif level >= 15:
            return 'Diamond Executive'
        elif level >= 10:
            return 'Platinum Director'
        elif level >= 7:
            return 'Gold Manager'
        elif level >= 4:
            return 'Silver Associate'
        else:
            return 'Bronze Learner'

    @staticmethod
    def get_gamification_stats(user_xp: int) -> Dict[str, Any]:
        """Agrega todas las métricas de gamificación en un diccionario."""
        # Se asume un mínimo de 0 XP para evitar errores lógicos
        xp = max(0, user_xp or 0)
        
        level = GamificationService.calculate_level(xp)
        next_level_xp = GamificationService.calculate_next_level_xp(xp)
        current_base_xp = GamificationService.calculate_current_base_xp(xp)
        progress_percent = GamificationService.calculate_progress_percent(xp)
        tier = GamificationService.get_tier_name(level)
        remaining_xp_for_next_level = next_level_xp - xp

        return {
            "xp": xp,
            "level": level,
            "tier": tier,
            "progress_percent": progress_percent,
            "next_level_xp": next_level_xp,
            "current_base_xp": current_base_xp,
            "remaining_xp": remaining_xp_for_next_level
        }
