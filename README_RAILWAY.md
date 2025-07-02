# 🚀 Déploiement Hobbymood sur Railway

## 📋 Prérequis
- Compte Railway (gratuit) : https://railway.app/
- Compte GitHub (pour le dépôt)

## 🔧 Configuration du projet

### Structure des fichiers
```
Hobbymood/
├── backend/
│   ├── main.py              # Application FastAPI principale
│   ├── websocket_manager.py # Gestionnaire WebSocket
│   └── requirements.txt     # Dépendances Python
├── frontend/                # Interface utilisateur
├── assets/                  # Assets des jeux
├── requirements.txt         # Dépendances principales
├── Procfile                # Configuration Railway
├── runtime.txt             # Version Python
├── railway.json            # Configuration Railway avancée
└── .gitignore             # Fichiers à ignorer
```

## 🚀 Déploiement étape par étape

### 1. Préparer le dépôt GitHub
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit pour Railway"
git branch -M main
git remote add origin https://github.com/<ton-user>/<ton-repo>.git
git push -u origin main
```

### 2. Déployer sur Railway
1. Aller sur https://railway.app/
2. Cliquer sur **"New Project"**
3. Sélectionner **"Deploy from GitHub repo"**
4. Autoriser Railway à accéder à GitHub
5. Sélectionner ton dépôt Hobbymood
6. Railway va automatiquement détecter Python et utiliser le Procfile

### 3. Configuration automatique
Railway va automatiquement :
- Détecter Python
- Installer les dépendances depuis `requirements.txt`
- Lancer l'application avec la commande du Procfile
- Assigner une URL publique

### 4. Variables d'environnement (optionnel)
Si besoin, dans l'onglet **Variables** du projet Railway :
- `PORT` : Automatiquement défini par Railway
- Autres variables selon tes besoins

## 🌐 URLs de l'application

Une fois déployé, ton application sera accessible sur :
- **Interface admin** : `https://ton-app.railway.app/admin`
- **Overlay OBS** : `https://ton-app.railway.app/overlay`
- **Scores** : `https://ton-app.railway.app/scores`

## 🔄 Déploiement continu

À chaque push sur la branche `main` de GitHub, Railway redéploiera automatiquement l'application.

## 📊 Monitoring

Dans le dashboard Railway :
- **Logs** : Voir les logs en temps réel
- **Metrics** : Utilisation des ressources
- **Deployments** : Historique des déploiements

## 🛠️ Dépannage

### Problèmes courants
1. **Erreur de port** : Railway définit automatiquement `$PORT`
2. **Dépendances manquantes** : Vérifier `requirements.txt`
3. **Fichiers manquants** : Vérifier `.gitignore`

### Logs utiles
```bash
# Dans Railway Dashboard > Logs
# Chercher les erreurs de démarrage
```

## ✅ Vérification du déploiement

1. **Test de l'API** : `https://ton-app.railway.app/api/games`
2. **Test WebSocket** : Ouvrir l'overlay et vérifier la connexion
3. **Test admin** : Interface d'administration fonctionnelle

## 🎯 Fonctionnalités déployées

- ✅ FastAPI avec WebSocket
- ✅ Interface admin complète
- ✅ Overlay OBS dynamique
- ✅ Gestion des scores en temps réel
- ✅ Assets des 3 jeux
- ✅ Communication bidirectionnelle

---

**🎉 Ton application Hobbymood est maintenant prête pour Railway !** 