# backend/app/api/v1/endpoints/chess.py
import chess
import random
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_active_user
from app.services.chess_catalog import get_lesson_data
from app.services.gemini_service import GeminiService
router = APIRouter()

class ChessMoveRequest(BaseModel):
    fen: str
    move_uci: Optional[str] = None
    difficulty: str = "manager" # principiante, manager, ceo

class ChessMoveResponse(BaseModel):
    fen: str
    move_uci: Optional[str] = None
    is_valid: bool = True
    game_over: bool = False
    result: Optional[str] = None

# --- HEURÍSTICAS DE EVALUACIÓN ---
PIECE_VALUES = {
    chess.PAWN: 10,
    chess.KNIGHT: 30,
    chess.BISHOP: 30,
    chess.ROOK: 50,
    chess.QUEEN: 90,
    chess.KING: 900
}

def evaluate_board(board: chess.Board):
    score = 0
    for sq in chess.SQUARES:
        piece = board.piece_at(sq)
        if piece:
            val = PIECE_VALUES.get(piece.piece_type, 0)
            score += val if piece.color == chess.WHITE else -val
    return score

def minimax(board, depth, alpha, beta, maximizing_player):
    if depth == 0 or board.is_game_over():
        return evaluate_board(board)

    if maximizing_player:
        max_eval = -float('inf')
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha: break
        return max_eval
    else:
        min_eval = float('inf')
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, True)
            board.pop()
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha: break
        return min_eval

def get_engine_move(board: chess.Board, difficulty: str):
    legal_moves = list(board.legal_moves)
    if not legal_moves: return None

    if difficulty == "principiante":
        # 80% al azar, 20% capturas
        if random.random() > 0.8:
            captures = [m for m in legal_moves if board.is_capture(m)]
            if captures: return random.choice(captures)
        return random.choice(legal_moves)

    elif difficulty == "manager":
        # Heurística de nivel medio (Capturas > Jaques > Al azar)
        for move in legal_moves:
            if board.is_capture(move): return move
        for move in legal_moves:
            board.push(move)
            if board.is_check():
                board.pop()
                return move
            board.pop()
        return random.choice(legal_moves)

    elif difficulty == "ceo":
        # Minimax con profundidad 3
        best_move = None
        best_value = float('inf') if board.turn == chess.BLACK else -float('inf')
        
        for move in legal_moves:
            board.push(move)
            board_value = minimax(board, 2, -float('inf'), float('inf'), board.turn == chess.WHITE)
            board.pop()
            
            if board.turn == chess.BLACK: # El motor suele ser negras en tu frontend
                if board_value < best_value:
                    best_value = board_value
                    best_move = move
            else:
                if board_value > best_value:
                    best_value = board_value
                    best_move = move
        return best_move or random.choice(legal_moves)

    return random.choice(legal_moves)

@router.post("/validate", response_model=ChessMoveResponse)
def validate_move(request: ChessMoveRequest, current_user = Depends(get_current_active_user)):
    try:
        board = chess.Board(request.fen)
        move = chess.Move.from_uci(request.move_uci)
        if move in board.legal_moves:
            board.push(move)
            return ChessMoveResponse(fen=board.fen(), move_uci=move.uci(), game_over=board.is_game_over(), result=board.result() if board.is_game_over() else None)
        return ChessMoveResponse(fen=request.fen, is_valid=False)
    except Exception as e: raise HTTPException(status_code=400, detail=str(e))

from app.services.progress_service import grant_eloquence_points
from app.database import get_db
from sqlalchemy.orm import Session

@router.post("/engine-move", response_model=ChessMoveResponse)
def engine_move(
    request: ChessMoveRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    try:
        board = chess.Board(request.fen)
        if board.is_game_over():
            return ChessMoveResponse(fen=board.fen(), game_over=True, result=board.result())
            
        move = get_engine_move(board, request.difficulty)
        if move:
            board.push(move)
            game_over = board.is_game_over()
            result = board.result() if game_over else None
            
            # 🔥 SI EL USUARIO GANÓ (Result 1-0), OTORGAR PUNTOS SEGÚN DIFICULTAD
            if game_over and result == "1-0":
                points = 10 if request.difficulty == "principiante" else 30 if request.difficulty == "manager" else 100
                grant_eloquence_points(db, current_user.id, points)

            return ChessMoveResponse(fen=board.fen(), move_uci=move.uci(), game_over=game_over, result=result)
        
        return ChessMoveResponse(fen=board.fen(), game_over=True, result=board.result())
    except Exception as e: raise HTTPException(status_code=400, detail=str(e))


from app.db.models import MatchmakingQueue, ChessMatch, User, ChessProgress
from app.schemas.chess import MatchmakingQueueCreate, MatchmakingQueueResponse, MatchmakingStatusResponse
from sqlalchemy import func
import uuid
from datetime import datetime, timezone

@router.get("/progress")
def get_chess_progress(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    try:
        progress_records = db.query(ChessProgress).filter(
            ChessProgress.user_id == current_user.id,
            ChessProgress.status == "completed"
        ).all()
        completed_lessons = [p.lesson_id for p in progress_records]
        return {"completed_lessons": completed_lessons}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.schemas.chess import MatchmakingQueueCreate, MatchmakingQueueResponse, MatchmakingStatusResponse
from sqlalchemy import func
import uuid
from datetime import datetime, timezone

@router.post("/matchmaking/join", response_model=MatchmakingQueueResponse)
def join_matchmaking(
    payload: MatchmakingQueueCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    try:
        # 1. Verificar si el usuario ya está en la cola
        existing = db.query(MatchmakingQueue).filter(MatchmakingQueue.user_id == current_user.id).first()
        if existing:
            existing.time_control = payload.time_control
            existing.elo_rating = payload.elo_rating
            existing.elo_range = payload.elo_range
            existing.queued_at = func.now()
            db.commit()
            db.refresh(existing)
            existing.status = "queued"
            return existing

        # 2. Buscar oponente compatible en la cola
        diff = func.abs(MatchmakingQueue.elo_rating - payload.elo_rating)
        opponent_queue = db.query(MatchmakingQueue).filter(
            MatchmakingQueue.user_id != current_user.id,
            MatchmakingQueue.time_control == payload.time_control,
            (diff <= payload.elo_range) | (diff <= MatchmakingQueue.elo_range)
        ).order_by(MatchmakingQueue.queued_at.asc()).first()

        if opponent_queue:
            # Emparejamiento exitoso. Crear ChessMatch en BD
            match_id = str(uuid.uuid4())
            
            if random.choice([True, False]):
                white_id = current_user.id
                black_id = opponent_queue.user_id
            else:
                white_id = opponent_queue.user_id
                black_id = current_user.id

            match_obj = ChessMatch(
                id=match_id,
                white_player_id=white_id,
                black_player_id=black_id,
                current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                status="active",
                white_time_ms=600000,
                black_time_ms=600000
            )
            db.add(match_obj)
            db.delete(opponent_queue)
            db.commit()

            return MatchmakingQueueResponse(
                id=9999,
                user_id=current_user.id,
                time_control=payload.time_control,
                elo_rating=payload.elo_rating,
                elo_range=payload.elo_range,
                queued_at=datetime.now(timezone.utc),
                status="matched"
            )

        # No hay oponente, insertar en cola
        new_queue = MatchmakingQueue(
            user_id=current_user.id,
            time_control=payload.time_control,
            elo_rating=payload.elo_rating,
            elo_range=payload.elo_range
        )
        db.add(new_queue)
        db.commit()
        db.refresh(new_queue)
        
        new_queue.status = "queued"
        return new_queue
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/matchmaking/leave")
def leave_matchmaking(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    try:
        queued = db.query(MatchmakingQueue).filter(MatchmakingQueue.user_id == current_user.id).first()
        if queued:
            db.delete(queued)
            db.commit()
        return {"msg": "Left matchmaking queue"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/matchmaking/status", response_model=MatchmakingStatusResponse)
def matchmaking_status(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    try:
        # 1. Si está en la cola, verificar tiempo transcurrido
        queued = db.query(MatchmakingQueue).filter(MatchmakingQueue.user_id == current_user.id).first()
        if queued:
            # Calcular segundos en cola
            queued_at_val = queued.queued_at
            if queued_at_val.tzinfo is None:
                queued_at_val = queued_at_val.replace(tzinfo=timezone.utc)
            else:
                queued_at_val = queued_at_val.astimezone(timezone.utc)
            elapsed_sec = (datetime.now(timezone.utc) - queued_at_val).total_seconds()
            
            if elapsed_sec > 12:
                # Emparejar con OnixAI Bot
                bot_username = "Bot-Manager"
                bot = db.query(User).filter(User.username == bot_username).first()
                if not bot:
                    bot = User(
                        username=bot_username,
                        hashed_password="bot_placeholder_password",
                        role="bot",
                        chess_elo=1400,
                        chess_tactical_elo=1200,
                        is_active=True
                    )
                    db.add(bot)
                    db.flush()

                match_id = str(uuid.uuid4())
                match_obj = ChessMatch(
                    id=match_id,
                    white_player_id=current_user.id,
                    black_player_id=bot.id,
                    current_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    status="active"
                )
                db.add(match_obj)
                db.delete(queued)
                db.commit()

                return MatchmakingStatusResponse(
                    status="matched",
                    match_id=match_id,
                    your_color="white",
                    opponent_username=bot.username,
                    opponent_elo=bot.chess_elo
                )
            
            return MatchmakingStatusResponse(status="queued")

        # 2. Si no está en cola, verificar si fue emparejado recientemente
        match_obj = db.query(ChessMatch).filter(
            ((ChessMatch.white_player_id == current_user.id) | (ChessMatch.black_player_id == current_user.id)),
            ChessMatch.status == "active"
        ).order_by(ChessMatch.created_at.desc()).first()

        if match_obj:
            if match_obj.white_player_id == current_user.id:
                opponent_id = match_obj.black_player_id
                your_color = "white"
            else:
                opponent_id = match_obj.white_player_id
                your_color = "black"

            opponent = db.query(User).filter(User.id == opponent_id).first()
            opponent_username = opponent.username if opponent else "Oponente"
            opponent_elo = opponent.chess_elo if opponent else 1200

            return MatchmakingStatusResponse(
                status="matched",
                match_id=match_obj.id,
                your_color=your_color,
                opponent_username=opponent_username,
                opponent_elo=opponent_elo
            )

        return MatchmakingStatusResponse(status="idle")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/lessons/{lesson_id}")
async def get_chess_lesson(
    lesson_id: str,
    current_user = Depends(get_current_active_user)
):
    """
    Retorna la data de una lección de ajedrez (FEN, solución) y genera la instrucción/explicación dinámicamente con IA.
    """
    try:
        # 1. Obtener la data estática segura (FEN y solución UCI)
        data = get_lesson_data(lesson_id)
        fen = data.get("fen", "start")
        solution = data.get("solution", "")
        theme = data.get("theme", lesson_id)
        
        # 2. Generar el componente instruccional con IA
        gemini = GeminiService()
        ai_content = await gemini.generate_chess_lesson_content(theme)
        
        # 3. Ensamblar la respuesta
        return {
            "id": lesson_id,
            "title": ai_content.get("title", f"Lección {lesson_id}"),
            "instruction": ai_content.get("instruction", "Analiza la posición y encuentra el mejor movimiento."),
            "explanation": ai_content.get("explanation", "Excelente jugada táctica."),
            "fen": fen,
            "solution": solution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
