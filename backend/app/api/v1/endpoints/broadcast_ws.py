import json
import logging
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger("OnixLingo.BroadcastWS")
router = APIRouter()

class BroadcastConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"[BROADCAST] Nuevo cliente conectado. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"[BROADCAST] Cliente desconectado. Total: {len(self.active_connections)}")

    async def broadcast_message(self, message: dict):
        """
        Envía un mensaje JSON a todos los clientes conectados.
        """
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"[BROADCAST] Error enviando a cliente: {e}")
                disconnected.append(connection)
                
        # Limpiar conexiones muertas
        for connection in disconnected:
            self.disconnect(connection)

broadcast_manager = BroadcastConnectionManager()

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await broadcast_manager.connect(websocket)
    try:
        while True:
            # Solo recibimos pings o mensajes ignorables, el flujo real es del servidor al cliente
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        broadcast_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"[BROADCAST] Error inesperado en WebSocket: {e}")
        broadcast_manager.disconnect(websocket)
