import json
import asyncio
from typing import Dict, Set, Optional
from fastapi import WebSocket
from enum import Enum

class AssetType(Enum):
    QUESTION = "question"
    ANSWER = "answer"
    LOGO = "logo"
    PRESENTATION = "presentation"
    SCORES = "scores"

class WebSocketManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.overlay_connections: Set[WebSocket] = set()
        self.scores_connections: Set[WebSocket] = set()
        self.admin_connections: Set[WebSocket] = set()
        
        # État actuel de l'overlay
        self.current_overlay_state = {
            "game": None,
            "asset_type": None,
            "asset_path": None,
            "visible": False
        }
        
        # État actuel des scores
        self.current_scores_state = {
            "visible": False,
            "teams": {
                "team1": 0,
                "team2": 0,
                "team3": 0,
                "team4": 0,
                "team5": 0,
                "team6": 0
            }
        }

    async def connect(self, websocket: WebSocket, client_type: str):
        await websocket.accept()
        self.active_connections.add(websocket)
        
        if client_type == "overlay":
            self.overlay_connections.add(websocket)
            # Envoyer l'état actuel au nouveau client
            await websocket.send_text(json.dumps({
                "type": "overlay_state",
                "data": self.current_overlay_state
            }))
        elif client_type == "scores":
            self.scores_connections.add(websocket)
            await websocket.send_text(json.dumps({
                "type": "scores_state",
                "data": self.current_scores_state
            }))
        elif client_type == "admin":
            self.admin_connections.add(websocket)

    def disconnect(self, websocket: WebSocket, client_type: str):
        self.active_connections.discard(websocket)
        if client_type == "overlay":
            self.overlay_connections.discard(websocket)
        elif client_type == "scores":
            self.scores_connections.discard(websocket)
        elif client_type == "admin":
            self.admin_connections.discard(websocket)

    async def broadcast_to_overlay(self, message: dict):
        """Envoie un message à tous les clients overlay"""
        if self.overlay_connections:
            print(f"WebSocketManager transmet à overlay: {message}")
            await asyncio.gather(
                *[connection.send_text(json.dumps(message)) for connection in self.overlay_connections]
            )

    async def broadcast_to_scores(self, message: dict):
        """Envoie un message à tous les clients scores"""
        if self.scores_connections:
            await asyncio.gather(
                *[connection.send_text(json.dumps(message)) for connection in self.scores_connections]
            )

    async def broadcast_to_admin(self, message: dict):
        """Envoie un message à tous les clients admin"""
        if self.admin_connections:
            await asyncio.gather(
                *[connection.send_text(json.dumps(message)) for connection in self.admin_connections]
            )

    # Ces méthodes ne sont plus utilisées car on transmet directement les messages
    # async def show_asset(self, game: str, asset_type: str, asset_path: str):
    #     """Affiche un asset sur l'overlay"""
    #     self.current_overlay_state = {
    #         "game": game,
    #         "asset_type": asset_type,
    #         "asset_path": asset_path,
    #         "visible": True
    #     }
    #     
    #     await self.broadcast_to_overlay({
    #         "type": "show_asset",
    #         "data": self.current_overlay_state
    #     })

    # async def clear_overlay(self, clear_type: str = "all"):
    #     """Efface l'overlay ou certains éléments"""
    #     if clear_type == "all":
    #         self.current_overlay_state = {
    #             "game": None,
    #             "asset_type": None,
    #             "asset_path": None,
    #             "visible": False
    #         }
    #     else:
    #         # Effacer seulement certains types d'assets
    #         if self.current_overlay_state["asset_type"] == clear_type:
    #             self.current_overlay_state = {
    #                 "game": None,
    #                 "asset_type": None,
    #                 "asset_path": None,
    #                 "visible": False
    #             }
    #     
    #     await self.broadcast_to_overlay({
    #         "type": "clear_overlay",
    #         "data": self.current_overlay_state
    #     })

    async def update_scores(self, team: str, score: int):
        """Met à jour les scores d'une équipe"""
        if team in self.current_scores_state["teams"]:
            self.current_scores_state["teams"][team] = score
            
        await self.broadcast_to_scores({
            "type": "update_scores",
            "data": self.current_scores_state
        })

    async def show_scores(self, visible: bool = True):
        """Affiche ou cache la page des scores"""
        self.current_scores_state["visible"] = visible
        
        await self.broadcast_to_scores({
            "type": "show_scores",
            "data": self.current_scores_state
        })

    async def reset_scores(self):
        """Remet tous les scores à zéro"""
        # Remettre tous les scores à zéro
        for team in self.current_scores_state["teams"]:
            self.current_scores_state["teams"][team] = 0
        
        # Envoyer la mise à jour à tous les clients scores
        await self.broadcast_to_scores({
            "type": "update_scores",
            "data": self.current_scores_state
        })
        
        # Envoyer aussi un message de type reset_scores pour forcer la mise à jour
        await self.broadcast_to_scores({
            "type": "reset_scores",
            "data": self.current_scores_state
        })
        
        print("Tous les scores ont été remis à zéro")

# Instance globale du gestionnaire WebSocket
websocket_manager = WebSocketManager() 