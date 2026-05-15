# backend/app/api/v1/endpoints/chess.py
import chess
import random
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_active_user

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
