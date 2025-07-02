#!/usr/bin/env python3
"""
Script de vérification pour Railway
Vérifie que tous les fichiers nécessaires sont présents et corrects
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Vérifie qu'un fichier existe"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - MANQUANT")
        return False

def check_file_content(filepath, required_content, description):
    """Vérifie le contenu d'un fichier"""
    if not os.path.exists(filepath):
        print(f"❌ {description}: {filepath} - MANQUANT")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            if required_content in content:
                print(f"✅ {description}: {filepath}")
                return True
            else:
                print(f"⚠️  {description}: {filepath} - Contenu incorrect")
                return False
    except Exception as e:
        print(f"❌ {description}: {filepath} - Erreur de lecture: {e}")
        return False

def main():
    print("🔍 Vérification de la préparation Railway...")
    print("=" * 50)
    
    checks_passed = 0
    total_checks = 0
    
    # Vérifier les fichiers essentiels
    essential_files = [
        ("backend/main.py", "Application FastAPI principale"),
        ("backend/websocket_manager.py", "Gestionnaire WebSocket"),
        ("backend/requirements.txt", "Dépendances backend"),
        ("requirements.txt", "Dépendances principales"),
        ("Procfile", "Configuration Railway"),
        ("runtime.txt", "Version Python"),
        ("railway.json", "Configuration Railway avancée"),
        (".gitignore", "Fichiers à ignorer"),
    ]
    
    for filepath, description in essential_files:
        total_checks += 1
        if check_file_exists(filepath, description):
            checks_passed += 1
    
    print("\n📋 Vérification du contenu des fichiers clés:")
    print("-" * 40)
    
    # Vérifier le contenu des fichiers importants
    content_checks = [
        ("requirements.txt", "fastapi", "Dépendances FastAPI"),
        ("Procfile", "uvicorn", "Commande de démarrage"),
        ("backend/main.py", "FastAPI", "Application FastAPI"),
        ("backend/websocket_manager.py", "WebSocketManager", "Gestionnaire WebSocket"),
    ]
    
    for filepath, required_content, description in content_checks:
        total_checks += 1
        if check_file_content(filepath, required_content, description):
            checks_passed += 1
    
    print("\n📁 Vérification des dossiers essentiels:")
    print("-" * 40)
    
    # Vérifier les dossiers
    essential_dirs = [
        ("frontend", "Interface utilisateur"),
        ("assets", "Assets des jeux"),
        ("backend", "Code backend"),
    ]
    
    for dirpath, description in essential_dirs:
        total_checks += 1
        if os.path.isdir(dirpath):
            print(f"✅ {description}: {dirpath}")
            checks_passed += 1
        else:
            print(f"❌ {description}: {dirpath} - MANQUANT")
    
    print("\n🎯 Résumé:")
    print("=" * 50)
    print(f"✅ Tests réussis: {checks_passed}/{total_checks}")
    
    if checks_passed == total_checks:
        print("🎉 Tous les tests sont passés ! Ton projet est prêt pour Railway.")
        print("\n📝 Prochaines étapes:")
        print("1. Créer un dépôt GitHub")
        print("2. Pousser le code: git add . && git commit -m 'Ready for Railway' && git push")
        print("3. Aller sur https://railway.app/")
        print("4. Créer un nouveau projet et connecter ton repo GitHub")
        print("5. Railway déploiera automatiquement ton application !")
    else:
        print("⚠️  Certains tests ont échoué. Vérifie les fichiers manquants ou incorrects.")
        print("💡 Utilise les fichiers de configuration que j'ai créés.")
    
    print("\n🔗 URLs de test après déploiement:")
    print("- Admin: https://ton-app.railway.app/admin")
    print("- Overlay: https://ton-app.railway.app/overlay")
    print("- Scores: https://ton-app.railway.app/scores")
    print("- API: https://ton-app.railway.app/api/games")

if __name__ == "__main__":
    main() 