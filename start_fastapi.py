#!/usr/bin/env python3
"""
Script de démarrage pour le serveur FastAPI Hobbymood
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    # Changer vers le répertoire backend
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    print("🚀 Démarrage du serveur FastAPI Hobbymood...")
    print(f"📁 Répertoire: {backend_dir}")
    print("🌐 Interface admin: http://localhost:8000/admin")
    print("📺 Overlay: http://localhost:8000/overlay")
    print("📊 Scores: http://localhost:8000/scores")
    print("⏹️  Arrêter avec Ctrl+C")
    print("-" * 50)
    
    try:
        # Lancer le serveur
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Arrêt du serveur")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        input("Appuyez sur Entrée pour continuer...")

if __name__ == "__main__":
    main() 