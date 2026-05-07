# backend/app/api/v1/endpoints/chess_ws.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Dict, List, Tuple, Any
import json
import logging

# Asumiendo las dependencias de tu proyecto. Ajustar las rutas si es necesario.
from app.database import get_db
# from app.models.chess import ChessMatch, ChessMove # Descomentar cuando la BD esté lista

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Simulación de Autenticación para WebSockets ---
async def get_ws_user(token: str = Query(...)) -> Dict[str, Any]:
    """
    Extrae y valida la identidad del usuario desde el token de la conexión.
    En producción, aquí decodificarías el JWT.
    """
    if not token:
        raise ValueError("Token no proporcionado")
    
    # Para el MVP, asumimos que el token es directamente el ID del usuario
    return {"id": token, "username": f"Player_{token[-4:]}"}


# --- Connection Manager ---
class ChessConnectionManager:
    def __init__(self):
        # Mapea match_id -> lista de (WebSocket, user_id)
        self.active_connections: Dict[str, List[Tuple[WebSocket, str]]] = {}

    async def connect(self, websocket: WebSocket, match_id: str, user_id: str):
        await websocket.accept()
        if match_id not in self.active_connections:
            self.active_connections[match_id] = []
            
        # Remover conexión vieja del mismo usuario si existe (evitar fantasmas)
        self.active_connections[match_id] = [
            conn for conn in self.active_connections[match_id] if conn[1] != user_id
        ]
        self.active_connections[match_id].append((websocket, user_id))
        logger.info(f"Usuario {user_id} conectado a la sala {match_id}")

    def disconnect(self, websocket: WebSocket, match_id: str, user_id: str):
        if match_id in self.active_connections:
            self.active_connections[match_id] = [
                conn for conn in self.active_connections[match_id] if conn[0] != websocket
            ]
            # Limpiar memoria si la sala queda vacía
            if not self.active_connections[match_id]:
                del self.active_connections[match_id]
            logger.info(f"Usuario {user_id} desconectado de la sala {match_id}")

    async def broadcast(self, match_id: str, message: dict, exclude_user_id: str = None):
        """Emite un mensaje a toda la sala, opcionalmente excluyendo al remitente."""
        if match_id in self.active_connections:
            for connection, u_id in self.active_connections[match_id]:
                if u_id != exclude_user_id:
                    try:
                        await connection.send_json(message)
                    except Exception as e:
                        logger.error(f"Error emitiendo a {u_id}: {str(e)}")

manager = ChessConnectionManager()


# --- Endpoint WebSocket ---
@router.websocket("/{match_id}")
async def chess_match_ws(
    websocket: WebSocket,
    match_id: str,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    # 1. Autenticación y validación
    try:
        user = await get_ws_user(token)
    except ValueError as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=str(e))
        return

    # 2. Registrar conexión en el manager
    await manager.connect(websocket, match_id, user["id"])
    
    try:
        # 3. Bucle infinito de eventos
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            
            # ── Evento de Movimiento de Pieza ──
            if event_type == "move":
                """
                Estructura esperada:
                { "type": "move", "move_san": "e4", "move_uci": "e2e4", "fen": "...", "time_white_ms": 300000, "time_black_ms": 295000 }
                """
                
                # A. Bloque preparado para persistencia (Descomentar al integrar DB)
                try:
                    # 1. Guardar el movimiento en historial
                    # new_move = ChessMove(
                    #     match_id=match_id,
                    #     user_id=user["id"],
                    #     move_san=data.get("move_san"),
                    #     move_uci=data.get("move_uci"),
                    #     fen_after=data.get("fen")
                    # )
                    # db.add(new_move)
                    
                    # 2. Actualizar relojes y estado maestro del match
                    # match = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                    # if match:
                    #     match.current_fen = data.get("fen")
                    #     if data.get("time_white_ms") is not None: match.white_time_ms = data.get("time_white_ms")
                    #     if data.get("time_black_ms") is not None: match.black_time_ms = data.get("time_black_ms")
                    # db.commit()
                    pass
                except Exception as e:
                    logger.error(f"Error de base de datos al guardar movimiento: {str(e)}")

                # B. Broadcast al oponente
                await manager.broadcast(match_id, data, exclude_user_id=user["id"])
                
            # ── Eventos de Fin de Juego (Rendición o Tablas) ──
            elif event_type in ["draw_offer", "resign"]:
                # Actualizar estado de la partida a 'completed' en DB
                if event_type == "resign":
                    # match = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                    # if match: match.status = "completed"
                    # db.commit()
                    pass
                
                # Transmitir evento inmediatamente
                await manager.broadcast(match_id, data, exclude_user_id=user["id"])

    except WebSocketDisconnect:
        # Limpiar conexión y avisar al oponente
        manager.disconnect(websocket, match_id, user["id"])
        await manager.broadcast(
            match_id, 
            {"type": "player_disconnected", "user_id": user["id"]}, 
            exclude_user_id=user["id"]
        )
