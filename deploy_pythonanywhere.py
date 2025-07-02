#!/usr/bin/env python3
"""
Script de déploiement pour PythonAnywhere
"""

import os
import shutil
import zipfile
from pathlib import Path

def create_deployment_package():
    """Crée le package de déploiement pour PythonAnywhere"""
    
    # Dossier de destination
    deploy_dir = "hobbymood_pythonanywhere"
    
    # Nettoyer le dossier de déploiement s'il existe
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    
    # Créer le dossier de déploiement
    os.makedirs(deploy_dir)
    
    # Fichiers et dossiers à copier
    files_to_copy = [
        "app.py",  # Point d'entrée principal
        "backend/main_pythonanywhere.py",  # Application Flask
        "backend/requirements.txt",  # Dépendances
        "frontend/js/admin_pythonanywhere.js",  # JS Admin
        "frontend/js/overlay_pythonanywhere.js",  # JS Overlay
        "frontend/js/scores_pythonanywhere.js",  # JS Scores
        "frontend/css/admin.css",  # CSS Admin
        "frontend/css/overlay.css",  # CSS Overlay
        "frontend/css/scores.css",  # CSS Scores
    ]
    
    # Copier les fichiers
    for file_path in files_to_copy:
        if os.path.exists(file_path):
            # Créer le dossier de destination si nécessaire
            dest_path = os.path.join(deploy_dir, file_path)
            dest_dir = os.path.dirname(dest_path)
            os.makedirs(dest_dir, exist_ok=True)
            
            # Copier le fichier
            shutil.copy2(file_path, dest_path)
            print(f"✅ Copié: {file_path}")
        else:
            print(f"❌ Fichier manquant: {file_path}")
    
    # Copier le dossier assets
    if os.path.exists("assets"):
        shutil.copytree("assets", os.path.join(deploy_dir, "assets"))
        print("✅ Copié: assets/")
    else:
        print("❌ Dossier assets manquant")
    
    # Créer le fichier ZIP
    zip_path = f"{deploy_dir}.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(deploy_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, deploy_dir)
                zipf.write(file_path, arcname)
    
    print(f"\n🎉 Package créé: {zip_path}")
    print(f"📁 Contenu du package:")
    
    # Lister le contenu
    for root, dirs, files in os.walk(deploy_dir):
        level = root.replace(deploy_dir, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f"{subindent}{file}")
    
    return zip_path

if __name__ == "__main__":
    print("🚀 Création du package de déploiement PythonAnywhere...")
    zip_file = create_deployment_package()
    print(f"\n📦 Package prêt: {zip_file}")
    print("\n📋 Instructions de déploiement:")
    print("1. Uploadez le ZIP sur PythonAnywhere")
    print("2. Décompressez-le dans votre dossier home")
    print("3. Ouvrez un Bash console et naviguez vers le dossier")
    print("4. Installez les dépendances: pip install --user -r backend/requirements.txt")
    print("5. Configurez la Web App pour pointer vers app.py")
    print("6. Rechargez l'application") 