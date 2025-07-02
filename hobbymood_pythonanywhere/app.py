#!/usr/bin/env python3
"""
Point d'entrée simple pour PythonAnywhere
"""

import sys
import os

# Ajouter le dossier backend au path Python
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Importer l'application Flask
from main_pythonanywhere import app

# Pour la compatibilité WSGI
application = app 