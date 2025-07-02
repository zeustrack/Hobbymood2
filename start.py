#!/usr/bin/env python3
"""
Script de démarrage pour Hobbymood OBS Controller
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Vérifier la version de Python"""
    if sys.version_info < (3, 13):
        print("❌ Erreur: Python 3.13+ requis")
        print(f"Version actuelle: {sys.version}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} détecté")
    return True

def check_dependencies():
    """Vérifier si les dépendances sont installées"""
    try:
        import fastapi
        import uvicorn
        print("✅ Dépendances installées")
        return True
    except ImportError:
        print("❌ Dépendances manquantes")
        return False

def install_dependencies():
    """Installer les dépendances"""
    print("📦 Installation des dépendances...")
    requirements_file = Path("backend/requirements.txt")
    
    if not requirements_file.exists():
        print("❌ Fichier requirements.txt non trouvé")
        return False
    
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(requirements_file)], check=True)
        print("✅ Dépendances installées avec succès")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erreur lors de l'installation des dépendances")
        return False

def create_assets_structure():
    """Créer la structure des dossiers d'assets"""
    assets_dirs = [
        "assets/jeu1/questions",
        "assets/jeu2/questions", 
        "assets/jeu3/questions",
        "assets/scores"
    ]
    
    for dir_path in assets_dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
    
    print("✅ Structure des dossiers d'assets créée")

def start_server():
    """Démarrer le serveur"""
    print("🚀 Démarrage du serveur Hobbymood...")
    print("📍 Interface admin: http://localhost:8000/admin")
    print("📺 Overlay principal: http://localhost:8000/overlay")
    print("📊 Page scores: http://localhost:8000/scores")
    print("⏹️  Arrêter avec Ctrl+C")
    print("-" * 50)
    
    try:
        # Changer vers le dossier backend
        os.chdir("backend")
        
        # Importer et lancer le serveur
        from main import app
        import uvicorn
        
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
        
    except KeyboardInterrupt:
        print("\n👋 Arrêt du serveur")
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")

def main():
    """Fonction principale"""
    print("🎮 Hobbymood OBS Controller")
    print("=" * 40)
    
    # Vérifier la version de Python
    if not check_python_version():
        sys.exit(1)
    
    # Vérifier les dépendances
    if not check_dependencies():
        print("📦 Installation automatique des dépendances...")
        if not install_dependencies():
            print("❌ Impossible d'installer les dépendances")
            print("💡 Essayez: pip install -r backend/requirements.txt")
            sys.exit(1)
    
    # Créer la structure des assets
    create_assets_structure()
    
    # Démarrer le serveur
    start_server()

if __name__ == "__main__":
    main() 