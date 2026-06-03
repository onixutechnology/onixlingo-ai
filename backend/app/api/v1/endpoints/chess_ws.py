# backend/app/api/v1/endpoints/chess_ws.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Dict, List, Tuple, Any
import json
import logging

# Asumiendo las dependencias de tu proyecto. Ajustar las rutas si es necesario.
from app.database import get_db
from app.db.models import ChessMatch, ChessMove, User
from app.config import settings
from jose import jwt, JWTError

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Simulación de Autenticación para WebSockets ---
async def get_ws_user(token: str, db: Session) -> Dict[str, Any]:
    """
    Extrae y valida la identidad del usuario desde el token JWT.
    Soporta fallback para pruebas locales de desarrollo.
    """
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    # --- FALLBACK DE DESARROLLO PARA LOCALHOST ---
    is_jwt = token.count(".") == 2 and token.startswith("ey")
    if not is_jwt:
        user = None
        if token.isdigit():
            user = db.query(User).filter(User.id == int(token)).first()
        else:
            user = db.query(User).filter(User.username == token).first()
        
        if user:
            return {"id": user.id, "username": user.username}
            
        if token in ["mock-jwt-token", "user-1234"]:
            first_user = db.query(User).filter(User.role != "bot").first()
            if first_user:
                return {"id": first_user.id, "username": first_user.username}
            return {"id": 1, "username": "Alex_Titanium"}
            
        raise ValueError("Token de prueba inválido o usuario no encontrado")

    # --- FLUJO ESTÁNDAR JWT ---
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_sub = payload.get("sub")
        if token_sub is None:
            raise ValueError("Token inválido")
            
        token_sub_str = str(token_sub)
        user = None
        if token_sub_str.isdigit():
            user = db.query(User).filter(User.id == int(token_sub_str)).first()
        else:
            user = db.query(User).filter(User.username == token_sub_str).first()
            if not user:
                user = db.query(User).filter(User.email == token_sub_str).first()
                
        if not user:
            raise ValueError("Usuario no encontrado")
            
        return {"id": user.id, "username": user.username}
    except JWTError:
        raise ValueError("Token expirado o inválido")


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
        user = await get_ws_user(token, db)
    except ValueError as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=str(e))
        return

    # 2. Registrar conexión en el manager
    await manager.connect(websocket, match_id, str(user["id"]))
    
    try:
        # 3. Bucle infinito de eventos
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            
            # ── Evento de Movimiento de Pieza ──
            if event_type == "move":
                try:
                    # 1. Guardar el movimiento en historial
                    new_move = ChessMove(
                        match_id=match_id,
                        user_id=user["id"],
                        move_san=data.get("move_san"),
                        move_uci=data.get("move_uci"),
                        fen_after=data.get("fen")
                    )
                    db.add(new_move)
                    
                    # 2. Actualizar relojes y estado maestro del match
                    match_obj = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                    if match_obj:
                        match_obj.current_fen = data.get("fen")
                        if data.get("time_white_ms") is not None: match_obj.white_time_ms = data.get("time_white_ms")
                        if data.get("time_black_ms") is not None: match_obj.black_time_ms = data.get("time_black_ms")
                    db.commit()
                except Exception as e:
                    db.rollback()
                    logger.error(f"Error de base de datos al guardar movimiento: {str(e)}")

                # B. Broadcast al oponente
                await manager.broadcast(match_id, data, exclude_user_id=str(user["id"]))
                
                # C. Si el oponente es un bot, hacer que mueva automáticamente
                match_obj = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                if match_obj and match_obj.status == "active":
                    white_player = db.query(User).filter(User.id == match_obj.white_player_id).first()
                    black_player = db.query(User).filter(User.id == match_obj.black_player_id).first()
                    
                    bot_player = None
                    if white_player and white_player.role == "bot":
                        bot_player = white_player
                    elif black_player and black_player.role == "bot":
                        bot_player = black_player

                    if bot_player:
                        import asyncio
                        import chess
                        from app.api.v1.endpoints.chess import get_engine_move
                        
                        # Esperar 1.2 segundos para simular pensamiento humano
                        await asyncio.sleep(1.2)
                        
                        board = chess.Board(match_obj.current_fen)
                        if not board.is_game_over():
                            difficulty = "manager"
                            if bot_player.chess_elo < 1100:
                                difficulty = "principiante"
                            elif bot_player.chess_elo >= 1600:
                                difficulty = "ceo"
                                
                            bot_move = get_engine_move(board, difficulty)
                            if bot_move:
                                move_san = board.san(bot_move)
                                move_uci = bot_move.uci()
                                board.push(bot_move)
                                new_fen = board.fen()
                                
                                # Guardar movimiento del bot
                                try:
                                    new_bot_move = ChessMove(
                                        match_id=match_id,
                                        user_id=bot_player.id,
                                        move_san=move_san,
                                        move_uci=move_uci,
                                        fen_after=new_fen
                                    )
                                    db.add(new_bot_move)
                                    match_obj.current_fen = new_fen
                                    db.commit()
                                except Exception as db_err:
                                    db.rollback()
                                    logger.error(f"Error guardando movimiento del bot: {db_err}")
                                    
                                # Broadcast del movimiento al jugador humano
                                bot_payload = {
                                    "type": "move",
                                    "fen": new_fen,
                                    "move_san": move_san,
                                    "move_uci": move_uci,
                                    "time_white_ms": match_obj.white_time_ms,
                                    "time_black_ms": match_obj.black_time_ms
                                }
                                await manager.broadcast(match_id, bot_payload)
                                
                                # Verificar fin de juego tras movimiento de bot
                                if board.is_game_over():
                                    try:
                                        match_obj.status = "completed"
                                        res_str = board.result()
                                        if res_str in ["1-0", "0-1"]:
                                            match_obj.winner_id = bot_player.id
                                            human = db.query(User).filter(User.id == user["id"]).first()
                                            if human:
                                                if human.chess_elo is None: human.chess_elo = 1200
                                                human.chess_elo = max(100, human.chess_elo - 15)
                                                db.add(human)
                                        db.commit()
                                    except Exception as db_err2:
                                        db.rollback()
                                        logger.error(f"Error al terminar juego con bot: {db_err2}")
                                        
                                    await manager.broadcast(match_id, {
                                        "type": "game_over",
                                        "result": "win" if board.result() in ["1-0", "0-1"] else "draw"
                                    })

                
            # ── Eventos de Fin de Juego (Rendición o Tablas) ──
            elif event_type in ["draw_offer", "resign", "game_over"]:
                if event_type == "resign":
                    match_obj = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                    if match_obj and match_obj.status == "active": 
                        match_obj.status = "completed"
                        if match_obj.white_player_id == user["id"]:
                            winner_id = match_obj.black_player_id
                            loser_id = match_obj.white_player_id
                        else:
                            winner_id = match_obj.white_player_id
                            loser_id = match_obj.black_player_id
                        match_obj.winner_id = winner_id

                        # Adjust ELOs
                        winner = db.query(User).filter(User.id == winner_id).first()
                        loser = db.query(User).filter(User.id == loser_id).first()
                        if winner:
                            if winner.chess_elo is None: winner.chess_elo = 1200
                            winner.chess_elo += 15
                            db.add(winner)
                        if loser:
                            if loser.chess_elo is None: loser.chess_elo = 1200
                            loser.chess_elo = max(100, loser.chess_elo - 15)
                            db.add(loser)
                    db.commit()
                elif event_type == "game_over":
                    match_obj = db.query(ChessMatch).filter(ChessMatch.id == match_id).first()
                    if match_obj and match_obj.status == "active":
                        match_obj.status = "completed"
                        result = data.get("result") # "win" or "draw"
                        if result == "win":
                            # The sender won
                            match_obj.winner_id = user["id"]
                            if match_obj.white_player_id == user["id"]:
                                winner_id = match_obj.white_player_id
                                loser_id = match_obj.black_player_id
                            else:
                                winner_id = match_obj.black_player_id
                                loser_id = match_obj.white_player_id

                            winner = db.query(User).filter(User.id == winner_id).first()
                            loser = db.query(User).filter(User.id == loser_id).first()
                            if winner:
                                if winner.chess_elo is None: winner.chess_elo = 1200
                                winner.chess_elo += 15
                                db.add(winner)
                            if loser:
                                if loser.chess_elo is None: loser.chess_elo = 1200
                                loser.chess_elo = max(100, loser.chess_elo - 15)
                                db.add(loser)
                        else:
                            match_obj.status = "draw"
                        db.commit()
                
                await manager.broadcast(match_id, data, exclude_user_id=str(user["id"]))

    except WebSocketDisconnect:
        # Limpiar conexión y avisar al oponente
        manager.disconnect(websocket, match_id, str(user["id"]))
        await manager.broadcast(
            match_id, 
            {"type": "player_disconnected", "user_id": str(user["id"])}, 
            exclude_user_id=str(user["id"])
        )
