# 🎮 Hobbymood OBS Controller

Application web pour contrôler dynamiquement les overlays OBS lors d'émissions en direct avec 3 jeux distincts.

## 🚀 Fonctionnalités

- **Overlay principal** : Affichage dynamique d'assets (questions, réponses, logos, présentations)
- **Page des scores** : Gestion en temps réel des scores pour 6 équipes
- **Interface admin** : Contrôle centralisé de tous les overlays
- **Communication temps réel** : WebSocket pour une réactivité instantanée
- **Design transparent** : Pages optimisées pour OBS (1920x1080)

## 📋 Prérequis

- Python 3.13+
- Navigateur web moderne
- OBS Studio (pour l'intégration)

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd Hobbymood
```

2. **Installer les dépendances**
```bash
cd backend
pip install -r requirements.txt
```

3. **Préparer les assets**
- Créer la structure de dossiers dans `assets/`
- Ajouter vos images PNG selon la convention de nommage
- Voir `assets/README.md` pour plus de détails

## 🚀 Démarrage

1. **Lancer le serveur**
```bash
cd backend
python main.py
```

2. **Accéder à l'application**
- Interface admin : http://localhost:8000/admin
- Overlay principal : http://localhost:8000/overlay
- Page scores : http://localhost:8000/scores

## 📺 Configuration OBS

### Overlay Principal
1. Ajouter une source "Navigateur"
2. URL : `http://localhost:8000/overlay`
3. Largeur : 1920, Hauteur : 1080
4. Activer "Actualiser le navigateur quand la scène devient active"

### Page Scores
1. Ajouter une source "Navigateur"
2. URL : `http://localhost:8000/scores`
3. Largeur : 1920, Hauteur : 1080
4. Activer "Actualiser le navigateur quand la scène devient active"

## 🎮 Utilisation

### Interface Admin
- **Section Jeux** : Contrôler les assets de chaque jeu
- **Section Scores** : Gérer les points des équipes
- **Section Overlay** : Actions rapides et liens OBS

### Raccourcis clavier
- `1`, `2`, `3` : Changer de section
- `Echap` : Effacer tout l'overlay
- `Ctrl+R` : Recharger l'interface

### Workflow typique
1. Ouvrir l'interface admin
2. Afficher le logo du jeu
3. Cliquer sur une question pour l'afficher
4. La réponse s'affiche automatiquement après 5 secondes
5. Gérer les scores en temps réel
6. Effacer l'overlay quand nécessaire

## 🏗️ Architecture

```
Hobbymood/
├── backend/
│   ├── main.py              # Serveur FastAPI
│   ├── websocket_manager.py # Gestion WebSocket
│   └── requirements.txt     # Dépendances Python
├── frontend/
│   ├── overlay.html         # Page overlay OBS
│   ├── admin.html          # Interface admin
│   ├── scores.html         # Page scores OBS
│   ├── css/                # Styles CSS
│   └── js/                 # JavaScript
└── assets/                 # Images et assets
```

## 🔧 Configuration

### Ajouter un nouveau jeu
1. Modifier `GAMES_CONFIG` dans `backend/main.py`
2. Créer le dossier correspondant dans `assets/`
3. Ajouter les images selon la convention

### Personnaliser les styles
- Modifier les fichiers CSS dans `frontend/css/`
- Les overlays sont optimisés pour 1920x1080

## 🐛 Dépannage

### Problèmes courants
- **WebSocket déconnecté** : Vérifier que le serveur est lancé
- **Images non affichées** : Vérifier les chemins dans `assets/`
- **Overlay non visible** : Vérifier la configuration OBS

### Logs
- Les logs du serveur s'affichent dans la console
- Ouvrir la console du navigateur pour les logs frontend

## 📝 Notes techniques

- **WebSocket** : Communication temps réel entre admin et overlays
- **FastAPI** : Serveur backend moderne et performant
- **Vanilla JS** : Pas de framework frontend pour la simplicité
- **Responsive** : Interface admin adaptée mobile/desktop

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Développé pour Hobbymood** 🎮 