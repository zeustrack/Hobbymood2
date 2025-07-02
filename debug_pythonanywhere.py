#!/usr/bin/env python3
"""
Script de diagnostic pour PythonAnywhere
Teste les imports et la configuration
"""

import sys
import os

print("=== DIAGNOSTIC PYTHONANYWHERE ===")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path}")

print("\n=== TEST DES IMPORTS ===")

try:
    print("Test 1: Import de FastAPI...")
    import fastapi
    print("✅ FastAPI importé avec succès")
except ImportError as e:
    print(f"❌ Erreur import FastAPI: {e}")

try:
    print("Test 2: Import de uvicorn...")
    import uvicorn
    print("✅ uvicorn importé avec succès")
except ImportError as e:
    print(f"❌ Erreur import uvicorn: {e}")

try:
    print("Test 3: Import du module backend...")
    import backend
    print("✅ Module backend importé avec succès")
except ImportError as e:
    print(f"❌ Erreur import backend: {e}")

try:
    print("Test 4: Import de backend.main_pythonanywhere...")
    from backend import main_pythonanywhere
    print("✅ backend.main_pythonanywhere importé avec succès")
except ImportError as e:
    print(f"❌ Erreur import backend.main_pythonanywhere: {e}")

try:
    print("Test 5: Import de l'app depuis backend.main_pythonanywhere...")
    from backend.main_pythonanywhere import app
    print("✅ App importée avec succès")
    print(f"Type de l'app: {type(app)}")
except ImportError as e:
    print(f"❌ Erreur import app: {e}")

print("\n=== STRUCTURE DES FICHIERS ===")
current_dir = os.getcwd()
print(f"Contenu du répertoire courant ({current_dir}):")
try:
    for item in os.listdir(current_dir):
        if os.path.isdir(os.path.join(current_dir, item)):
            print(f"📁 {item}/")
        else:
            print(f"📄 {item}")
except Exception as e:
    print(f"❌ Erreur lecture répertoire: {e}")

backend_dir = os.path.join(current_dir, "backend")
if os.path.exists(backend_dir):
    print(f"\nContenu du répertoire backend ({backend_dir}):")
    try:
        for item in os.listdir(backend_dir):
            if os.path.isdir(os.path.join(backend_dir, item)):
                print(f"📁 {item}/")
            else:
                print(f"📄 {item}")
    except Exception as e:
        print(f"❌ Erreur lecture répertoire backend: {e}")
else:
    print("❌ Répertoire backend n'existe pas")

print("\n=== TEST WSGI ===")
try:
    # Simuler le WSGI
    sys.path.insert(0, current_dir)
    backend_path = os.path.join(current_dir, 'backend')
    sys.path.insert(0, backend_path)
    
    print("Test WSGI: Import de l'app...")
    from backend.main_pythonanywhere import app
    application = app
    print("✅ WSGI configuré avec succès")
    print(f"Application: {application}")
except Exception as e:
    print(f"❌ Erreur WSGI: {e}")
    import traceback
    traceback.print_exc()

print("\n=== FIN DU DIAGNOSTIC ===") 