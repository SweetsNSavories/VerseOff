import asyncio
import json
import logging
from typing import Dict, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VerseOffServer")

app = FastAPI(title="VerseOff Middleware Server")

# Allow offline clients to connect from local origins if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        # Maps user/client ID to their active websocket connection
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast_delta(self, entity_name: str, payload: dict):
        """Broadcast a Dataverse record change to all connected clients."""
        message = {
            "type": "DATAVERSE_DELTA",
            "entity": entity_name,
            "data": payload
        }
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to client: {e}")


manager = ConnectionManager()


@app.get("/")
async def root():
    return {"status": "VerseOff Server is running."}


@app.websocket("/ws/sync")
async def websocket_endpoint(websocket: WebSocket):
    """
    Offline clients connect here to receive real-time push updates.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Wait for messages from the client (e.g. heartbeat, or client pushing local offline changes)
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                # In the future: handle incoming offline data from client here
                logger.info(f"Received from client: {payload}")
                
                # Acknowledge receipt
                await websocket.send_json({"type": "ACK", "status": "received"})
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/webhook/dataverse")
async def dataverse_webhook(request: Request):
    """
    Endpoint for Dataverse Plugins/Service Bus to push changes in real-time.
    Payload expected: typical RemoteExecutionContext JSON from Dataverse.
    """
    payload = await request.json()
    
    # Extract the entity name and the updated attributes (simplified mapping for MVP)
    primary_entity_name = payload.get("PrimaryEntityName", "unknown")
    
    # Broadcast to all connected desktop apps immediately
    await manager.broadcast_delta(primary_entity_name, payload)
    
    return {"status": "Broadcasted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
