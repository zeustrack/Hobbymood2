# 🚂 Configuration Railway pour Hobbymood

## 📋 Fichiers de configuration présents

✅ **Procfile** - Configuration du processus
```bash
web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

✅ **railway.json** - Configuration Railway
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn backend.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

✅ **requirements.txt** - Dépendances Python
✅ **runtime.txt** - Version Python 3.11.0

## 🚀 Étapes de déploiement Railway

### 1. Créer un compte Railway
- Allez sur https://railway.app
- Connectez-vous avec votre compte GitHub

### 2. Créer un nouveau projet
1. Cliquez sur "New Project"
2. Choisissez "Deploy from GitHub repo"
3. Sélectionnez votre repository `Hobbymood`
4. Cliquez sur "Deploy Now"

### 3. Configuration automatique
Railway va automatiquement :
- ✅ Détecter que c'est une application Python
- ✅ Installer les dépendances depuis `requirements.txt`
- ✅ Démarrer l'application avec la commande dans `Procfile`
- ✅ Générer une URL publique

### 4. Variables d'environnement (optionnel)
Si nécessaire, dans l'onglet "Variables" :
```
FLASK_ENV=production
PORT=5000
```

### 5. Domaine personnalisé
1. Onglet "Settings"
2. "Generate Domain" ou ajoutez votre domaine

## 🌐 URLs de votre application

Après déploiement :
- **Admin** : `https://votre-app.railway.app/admin`
- **Overlay** : `https://votre-app.railway.app/overlay`
- **Scores** : `https://votre-app.railway.app/scores`

## 🔄 Mises à jour automatiques

Quand vous poussez du code vers GitHub :
1. Railway détecte automatiquement les changements
2. Redéploie automatiquement l'application
3. Pas d'action manuelle nécessaire !

## 🛠️ Dépannage Railway

### Problème : Build échoue
- Vérifiez les logs dans Railway
- Vérifiez que `requirements.txt` est correct
- Vérifiez que `Procfile` est correct

### Problème : Application ne démarre pas
- Vérifiez que le port est correct
- Vérifiez les variables d'environnement
- Vérifiez les logs d'erreur

### Problème : WebSocket ne fonctionne pas
- Railway supporte les WebSockets
- Vérifiez que l'URL est en HTTPS

## 📊 Monitoring

Railway fournit :
- ✅ Logs en temps réel
- ✅ Métriques de performance
- ✅ Historique des déploiements
- ✅ Alertes automatiques

---

**🎉 Votre application Hobbymood sera bientôt en ligne sur Railway !** 