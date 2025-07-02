#!/usr/bin/env python3
"""
WSGI entry point for Hobbymood application on PythonAnywhere
"""

import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the FastAPI app
from main_pythonanywhere import app

# For WSGI compatibility
application = app 