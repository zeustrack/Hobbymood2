#!/usr/bin/env python3
"""
Serveur simplifié pour Hobbymood OBS Controller
"""

import asyncio
import json
import os
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import webbrowser
from urllib.parse import urlparse

class HobbymoodHandler(SimpleHTTPRequestHandler):
    """Handler personnalisé pour servir les pages"""
    
    def do_GET(self):
        # Routes personnalisées
        if self.path == '/':
            self.path = '/frontend/admin-simple.html'
        elif self.path == '/admin':
            self.path = '/frontend/admin-simple.html'
        elif self.path == '/overlay':
            self.path = '/frontend/overlay-simple.html'
        elif self.path == '/scores':
            self.path = '/frontend/scores.html'
        
        # Servir les fichiers statiques
        return SimpleHTTPRequestHandler.do_GET(self)
    
    def end_headers(self):
        # Headers CORS pour permettre les requêtes
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)

def create_demo_assets():
    """Créer des assets de démonstration"""
    assets_dir = Path("assets")
    assets_dir.mkdir(exist_ok=True)
    
    # Créer la structure des dossiers
    for jeu in ["jeu1", "jeu2", "jeu3"]:
        (assets_dir / jeu / "questions").mkdir(parents=True, exist_ok=True)
        (assets_dir / jeu).mkdir(exist_ok=True)
    
    (assets_dir / "scores").mkdir(exist_ok=True)
    
    # Créer des fichiers de démonstration
    demo_content = """
    <html>
    <head><title>Asset de démonstration</title></head>
    <body style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px);">
            <h1 style="font-size: 3rem; margin: 0;">🎮</h1>
            <h2 style="margin: 20px 0;">Asset de démonstration</h2>
            <p style="font-size: 1.2rem;">Cet asset sera remplacé par vos images</p>
        </div>
    </body>
    </html>
    """
    
    # Créer des fichiers HTML de démonstration
    for jeu in ["jeu1", "jeu2", "jeu3"]:
        # Logo
        with open(assets_dir / jeu / "logo.html", "w", encoding="utf-8") as f:
            f.write(demo_content.replace("Asset de démonstration", f"Logo {jeu.upper()}"))
        
        # Présentation
        with open(assets_dir / jeu / "presentation.html", "w", encoding="utf-8") as f:
            f.write(demo_content.replace("Asset de démonstration", f"Présentation {jeu.upper()}"))
        
        # Questions
        for i in range(1, 11):
            with open(assets_dir / jeu / "questions" / f"Q{i}.html", "w", encoding="utf-8") as f:
                f.write(demo_content.replace("Asset de démonstration", f"Question {i} - {jeu.upper()}"))
            
            with open(assets_dir / jeu / "questions" / f"Q{i}_reponses.html", "w", encoding="utf-8") as f:
                f.write(demo_content.replace("Asset de démonstration", f"Réponse {i} - {jeu.upper()}"))
    
    # Base des scores
    with open(assets_dir / "scores" / "base.html", "w", encoding="utf-8") as f:
        f.write(demo_content.replace("Asset de démonstration", "Scores"))

def start_server():
    """Démarrer le serveur"""
    port = 8000
    server_address = ('', port)
    
    print("🎮 Hobbymood OBS Controller - Serveur Simplifié")
    print("=" * 50)
    print(f"📍 Interface admin: http://localhost:{port}/admin")
    print(f"📺 Overlay principal: http://localhost:{port}/overlay")
    print(f"📊 Page scores: http://localhost:{port}/scores")
    print("⏹️  Arrêter avec Ctrl+C")
    print("-" * 50)
    
    # Créer les assets de démonstration
    create_demo_assets()
    
    # Démarrer le serveur
    httpd = HTTPServer(server_address, HobbymoodHandler)
    
    # Ouvrir automatiquement l'interface admin
    try:
        webbrowser.open(f'http://localhost:{port}/admin')
    except:
        pass
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Arrêt du serveur")
        httpd.shutdown()

if __name__ == "__main__":
    start_server() 