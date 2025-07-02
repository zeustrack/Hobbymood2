from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import os
from pathlib import Path
from Hobbymood2.backend.websocket_manager import websocket_manager

app = FastAPI(title="Hobbymood OBS Controller", version="1.0.0")

# Configuration des dossiers
BASE_DIR = Path(__file__).parent.parent
ASSETS_DIR = BASE_DIR / "assets"
FRONTEND_DIR = BASE_DIR / "frontend"

# Monter les fichiers statiques
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
app.mount("/frontend", StaticFiles(directory=str(FRONTEND_DIR)), name="frontend")

# Configuration des jeux
GAMES_CONFIG = {
    "jeu1": {
        "name": "Mon entreprise en or",
        "questions_count": 8,
        "assets": {
            "logo": "/assets/jeu1/logo.png",
            "presentation": "/assets/jeu1/presentation.png"
        }
    },
    "jeu2": {
        "name": "Les défis du père fou de la RSE",
        "questions_count": 9,
        "assets": {
            "logo": "/assets/jeu2/logo.png",
            "presentation": "/assets/jeu2/presentation.png"
        }
    },
    "jeu3": {
        "name": "Qui veut gagner des millions d'impacts",
        "questions_count": 10,
        "assets": {
            "logo": "/assets/jeu3/logo.png",
            "presentation": "/assets/jeu3/presentation.png"
        }
    }
}

@app.get("/")
async def root():
    """Page d'accueil avec liens vers les différentes pages"""
    return FileResponse(str(FRONTEND_DIR / "admin.html"))

@app.get("/overlay")
async def overlay():
    """Page overlay principale pour OBS"""
    return FileResponse(str(FRONTEND_DIR / "overlay.html"))

@app.get("/admin")
async def admin():
    """Interface d'administration"""
    return FileResponse(str(FRONTEND_DIR / "admin.html"))

@app.get("/scores")
async def scores():
    """Page des scores pour OBS"""
    return FileResponse(str(FRONTEND_DIR / "scores.html"))

@app.websocket("/ws/overlay")
async def websocket_overlay(websocket: WebSocket):
    """WebSocket pour la page overlay"""
    await websocket_manager.connect(websocket, "overlay")
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            print(f"Overlay message: {message}")
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, "overlay")

@app.websocket("/ws/scores")
async def websocket_scores(websocket: WebSocket):
    """WebSocket pour la page scores"""
    await websocket_manager.connect(websocket, "scores")
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            print(f"Scores message: {message}")
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, "scores")

@app.websocket("/ws/admin")
async def websocket_admin(websocket: WebSocket):
    """WebSocket pour l'interface admin"""
    await websocket_manager.connect(websocket, "admin")
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await handle_admin_message(message)
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, "admin")

async def handle_admin_message(message: dict):
    """Gère les messages reçus de l'interface admin"""
    message_type = message.get("type")
    
    if message_type == "show_asset":
        # Transmettre directement le message à l'overlay
        print(f"Admin envoie show_asset: {message}")
        await websocket_manager.broadcast_to_overlay(message)
        
    elif message_type == "clear_overlay":
        # Transmettre directement le message à l'overlay
        print(f"Admin envoie clear_overlay: {message}")
        await websocket_manager.broadcast_to_overlay(message)
        
    elif message_type == "update_scores":
        team = message.get("team")
        score = message.get("score")
        if team and score is not None:
            await websocket_manager.update_scores(str(team), int(score))
        
    elif message_type == "show_scores":
        visible = message.get("visible", True)
        await websocket_manager.show_scores(visible)
        
    elif message_type == "reset_scores":
        # Remettre tous les scores à zéro
        await websocket_manager.reset_scores()

@app.get("/api/games")
async def get_games():
    """Retourne la configuration des jeux"""
    return GAMES_CONFIG

@app.get("/api/assets/{game}")
async def get_game_assets(game: str):
    """Retourne les assets disponibles pour un jeu"""
    if game not in GAMES_CONFIG:
        raise HTTPException(status_code=404, detail="Jeu non trouvé")
    
    game_config = GAMES_CONFIG[game]
    assets = {
        "logo": f"/assets/{game}/logo.png",
        "presentation": f"/assets/{game}/presentation.png",
        "questions": []
    }
    
    # Ajouter les questions
    questions_dir = ASSETS_DIR / game / "questions"
    if questions_dir.exists():
        for i in range(1, game_config["questions_count"] + 1):
            question_file = questions_dir / f"Q{i}.png"
            answer_file = questions_dir / f"Q{i}_reponses.png"
            
            if question_file.exists():
                assets["questions"].append({
                    "number": i,
                    "question": f"/assets/{game}/questions/Q{i}.png",
                    "answer": f"/assets/{game}/questions/Q{i}_reponses.png" if answer_file.exists() else None
                })
    
    return assets

@app.get("/api/scores")
async def get_scores():
    """Retourne l'état actuel des scores"""
    return websocket_manager.current_scores_state

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 