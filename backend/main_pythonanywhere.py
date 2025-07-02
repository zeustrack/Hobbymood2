#!/usr/bin/env python3
"""
Version PythonAnywhere de l'application Hobbymood
Utilise Flask au lieu de FastAPI pour compatibilité WSGI
"""

from flask import Flask, request, jsonify, send_from_directory, render_template_string
import os
import json
from pathlib import Path
from typing import Dict, Any, List
import time

# Créer l'application Flask
app = Flask(__name__)

# État global de l'application (remplace les WebSockets)
app_state = {
    "current_overlay": None,
    "scores": {
        "jeu1": {"score": 0, "max_score": 10},
        "jeu2": {"score": 0, "max_score": 10},
        "jeu3": {"score": 0, "max_score": 11}
    },
    "last_update": time.time()
}

# Configuration des jeux
GAMES = {
    "jeu1": {
        "name": "Jeu 1",
        "assets": {
            "logo": "/assets/jeu1/logo.png",
            "presentation": "/assets/jeu1/presentation.png",
            "questions": [f"/assets/jeu1/questions/Q{i}.png" for i in range(1, 11)],
            "answers": [f"/assets/jeu1/questions/Q{i}_reponses.png" for i in range(1, 11)]
        }
    },
    "jeu2": {
        "name": "Jeu 2", 
        "assets": {
            "logo": "/assets/jeu2/logo.png",
            "presentation": "/assets/jeu2/presentation.png",
            "questions": [f"/assets/jeu2/questions/Q{i}.png" for i in range(1, 11)],
            "answers": [f"/assets/jeu2/questions/Q{i}_reponses.png" for i in range(1, 11)]
        }
    },
    "jeu3": {
        "name": "Jeu 3",
        "assets": {
            "logo": "/assets/jeu3/logo.png", 
            "presentation": "/assets/jeu3/presentation.png",
            "questions": [f"/assets/jeu3/questions/Q{i}.png" for i in range(1, 12)],
            "answers": [f"/assets/jeu3/questions/Q{i}_reponses.png" for i in range(1, 12)]
        }
    }
}

# Routes API
@app.route('/api/games')
def get_games():
    """Retourne la liste des jeux disponibles"""
    return jsonify(GAMES)

@app.route('/api/scores')
def get_scores():
    """Retourne les scores actuels"""
    return jsonify(app_state["scores"])

@app.route('/api/assets/<game>')
def get_game_assets(game):
    """Retourne les assets d'un jeu"""
    if game not in GAMES:
        return jsonify({"error": "Jeu non trouvé"}), 404
    return jsonify(GAMES[game]["assets"])

@app.route('/api/overlay/status')
def get_overlay_status():
    """Retourne l'état actuel de l'overlay (pour polling)"""
    return jsonify({
        "current_overlay": app_state["current_overlay"],
        "last_update": app_state["last_update"]
    })

@app.route('/api/admin/show_asset', methods=['POST'])
def show_asset():
    """Affiche un asset sur l'overlay"""
    data = request.get_json()
    game = data.get('game')
    asset_type = data.get('asset_type')
    asset_path = data.get('asset_path')
    
    if not all([game, asset_type, asset_path]):
        return jsonify({"error": "Paramètres manquants"}), 400
    
    app_state["current_overlay"] = {
        "type": "asset_displayed",
        "data": {
            "asset_path": asset_path,
            "asset_type": asset_type
        }
    }
    app_state["last_update"] = time.time()
    
    return jsonify({"success": True, "overlay": app_state["current_overlay"]})

@app.route('/api/admin/clear_overlay', methods=['POST'])
def clear_overlay():
    """Efface l'overlay"""
    data = request.get_json()
    clear_type = data.get('clear_type', 'all')
    
    app_state["current_overlay"] = {
        "type": "overlay_cleared",
        "data": {
            "clear_type": clear_type
        }
    }
    app_state["last_update"] = time.time()
    
    return jsonify({"success": True, "overlay": app_state["current_overlay"]})

@app.route('/api/admin/update_score', methods=['POST'])
def update_score():
    """Met à jour un score"""
    data = request.get_json()
    game = data.get('game')
    score = data.get('score')
    
    if game not in app_state["scores"]:
        return jsonify({"error": "Jeu non trouvé"}), 404
    
    app_state["scores"][game]["score"] = score
    app_state["last_update"] = time.time()
    
    return jsonify({"success": True, "scores": app_state["scores"]})

# Routes pour servir les fichiers statiques
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Sert les fichiers assets"""
    return send_from_directory('assets', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Sert les fichiers CSS"""
    return send_from_directory('frontend/css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Sert les fichiers JavaScript"""
    return send_from_directory('frontend/js', filename)

# Routes principales
@app.route('/')
def index():
    """Page d'accueil"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hobbymood PythonAnywhere</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1>🎮 Hobbymood PythonAnywhere</h1>
        <p>Application de gestion d'overlays pour OBS</p>
        <ul>
            <li><a href="/admin">Interface Admin</a></li>
            <li><a href="/overlay">Overlay</a></li>
            <li><a href="/scores">Scores</a></li>
        </ul>
    </body>
    </html>
    """

@app.route('/admin')
def admin():
    """Interface d'administration"""
    return render_template_string(ADMIN_HTML)

@app.route('/overlay')
def overlay():
    """Page overlay pour OBS"""
    return render_template_string(OVERLAY_HTML)

@app.route('/scores')
def scores():
    """Page des scores"""
    return render_template_string(SCORES_HTML)

# Templates HTML intégrés
ADMIN_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Admin - Hobbymood</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
    <div class="admin-container">
        <h1>🎮 Interface Admin Hobbymood</h1>
        
        <div class="games-section">
            <h2>Jeux disponibles</h2>
            <div id="games-list"></div>
        </div>
        
        <div class="scores-section">
            <h2>Scores</h2>
            <div id="scores-display"></div>
        </div>
        
        <div class="controls-section">
            <h2>Contrôles</h2>
            <button onclick="clearOverlay()">Effacer Overlay</button>
        </div>
    </div>
    
    <script src="/js/admin_pythonanywhere.js"></script>
</body>
</html>
"""

OVERLAY_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Overlay - Hobbymood</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/css/overlay.css">
</head>
<body>
    <div id="overlay-container">
        <div id="asset-display"></div>
    </div>
    
    <script src="/js/overlay_pythonanywhere.js"></script>
</body>
</html>
"""

SCORES_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Scores - Hobbymood</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/css/scores.css">
</head>
<body>
    <div id="scores-container">
        <div id="scores-display"></div>
    </div>
    
    <script src="/js/scores_pythonanywhere.js"></script>
</body>
</html>
"""

# Pour la compatibilité WSGI
application = app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000) 