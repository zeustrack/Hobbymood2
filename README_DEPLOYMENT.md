# 🚀 Guide de Déploiement Hobbymood sur PythonAnywhere

## 📋 Prérequis
- Un compte PythonAnywhere gratuit
- Votre application Hobbymood prête

## 🔧 Étapes de Déploiement

### 1. Création du compte PythonAnywhere
1. Allez sur [www.pythonanywhere.com](https://www.pythonanywhere.com)
2. Cliquez sur "Create a Beginner account" (gratuit)
3. Remplissez le formulaire d'inscription
4. Confirmez votre email

### 2. Upload des fichiers
1. Dans votre dashboard PythonAnywhere, allez dans "Files"
2. Créez un nouveau dossier : `hobbymood`
3. Uploadez tous vos fichiers dans ce dossier

### 3. Configuration de l'environnement
1. Allez dans "Consoles" → "Bash"
2. Naviguez vers votre dossier : `cd hobbymood`
3. Installez les dépendances : `pip install -r requirements.txt`

### 4. Configuration de l'application web
1. Allez dans "Web" → "Add a new web app"
2. Choisissez "Manual configuration"
3. Python version : 3.9 ou plus récent
4. Source code : `/home/votreusername/hobbymood`
5. Working directory : `/home/votreusername/hobbymood`
6. WSGI configuration file : modifiez le fichier

### 5. Configuration WSGI
Remplacez le contenu du fichier WSGI par :
```python
import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the FastAPI app
from main import app

# For WSGI compatibility
application = app
```

### 6. Variables d'environnement
Dans "Web" → "Environment variables", ajoutez :
- `PYTHONPATH` = `/home/votreusername/hobbymood/backend`

### 7. Redémarrage
1. Cliquez sur "Reload" dans la section Web
2. Vérifiez les logs pour les erreurs

## 🌐 URLs de votre application
- **Admin** : `https://votreusername.pythonanywhere.com/admin`
- **Overlay** : `https://votreusername.pythonanywhere.com/overlay`
- **Scores** : `https://votreusername.pythonanywhere.com/scores`

## ⚠️ Limitations du compte gratuit
- Pas de WebSocket (utilisation de polling)
- Pas de HTTPS personnalisé
- Limitation de bande passante
- Redémarrage automatique après inactivité

## 🔧 Dépannage
- Vérifiez les logs dans "Web" → "Log files"
- Assurez-vous que tous les fichiers sont uploadés
- Vérifiez les permissions des fichiers
- Redémarrez l'application après chaque modification 