# 🚀 Guide de Déploiement Hobbymood - GitHub + Railway

## 📋 Prérequis

### 1. Installer Git
- Téléchargez Git : https://git-scm.com/download/win
- Installez avec les options par défaut
- Redémarrez PowerShell après installation

### 2. Compte GitHub
- Créez un compte sur https://github.com
- Notez votre nom d'utilisateur

### 3. Compte Railway
- Créez un compte sur https://railway.app
- Connectez-vous avec votre compte GitHub

## 🔧 Étape 1 : Déploiement GitHub

### Option A : Avec le script PowerShell (recommandé)

1. **Activer l'exécution de scripts** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

2. **Exécuter le script** :
```powershell
.\deploy_to_github.ps1
```

### Option B : Manuellement

1. **Initialiser Git** :
```powershell
git init
```

2. **Configurer Git** :
```powershell
git config user.name "VotreNomGitHub"
git config user.email "votre.email@example.com"
```

3. **Ajouter les fichiers** :
```powershell
git add .
git commit -m "Initial commit: Hobbymood quiz application"
```

4. **Créer le repository sur GitHub** :
   - Allez sur https://github.com
   - Cliquez sur "New repository"
   - Nom : `Hobbymood`
   - Description : `Application de quiz interactif avec interface admin et overlay`
   - Public ou Privé selon votre choix
   - **NE PAS** initialiser avec README, .gitignore, ou license

5. **Connecter et pousser** :
```powershell
git remote add origin https://github.com/VotreNomGitHub/Hobbymood.git
git branch -M main
git push -u origin main
```

## 🚂 Étape 2 : Déploiement Railway

### 1. Préparer le projet pour Railway

Vérifiez que ces fichiers existent dans votre projet :

- ✅ `requirements.txt` (déjà présent)
- ✅ `Procfile` (déjà présent)
- ✅ `runtime.txt` (déjà présent)
- ✅ `railway.json` (déjà présent)

### 2. Connecter Railway à GitHub

1. **Allez sur Railway** : https://railway.app
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur "New Project"**
4. **Choisissez "Deploy from GitHub repo"**
5. **Sélectionnez votre repository** `Hobbymood`
6. **Cliquez sur "Deploy Now"**

### 3. Configuration Railway

Railway va automatiquement :
- ✅ Détecter que c'est une application Python
- ✅ Installer les dépendances depuis `requirements.txt`
- ✅ Démarrer l'application avec la commande dans `Procfile`

### 4. Variables d'environnement (optionnel)

Si nécessaire, ajoutez des variables d'environnement dans Railway :
- Allez dans l'onglet "Variables"
- Ajoutez si besoin :
  - `FLASK_ENV=production`
  - `PORT=5000`

### 5. Domaine personnalisé (optionnel)

1. Dans Railway, allez dans l'onglet "Settings"
2. Cliquez sur "Generate Domain"
3. Ou ajoutez votre propre domaine

## 🌐 URLs de votre application

Après le déploiement, vous aurez accès à :

- **Admin** : `https://votre-app.railway.app/admin`
- **Overlay** : `https://votre-app.railway.app/overlay`
- **Scores** : `https://votre-app.railway.app/scores`

## 🔄 Mises à jour

Pour mettre à jour votre application :

1. **Modifiez votre code localement**
2. **Poussez vers GitHub** :
```powershell
git add .
git commit -m "Description des changements"
git push
```
3. **Railway se met à jour automatiquement** !

## 🛠️ Dépannage

### Problème : Git non reconnu
- Vérifiez que Git est installé
- Redémarrez PowerShell
- Vérifiez le PATH système

### Problème : Erreur de push
- Vérifiez vos identifiants GitHub
- Utilisez un token personnel si nécessaire

### Problème : Railway ne démarre pas
- Vérifiez les logs dans Railway
- Vérifiez que `requirements.txt` est correct
- Vérifiez que `Procfile` est correct

### Problème : Application ne répond pas
- Vérifiez que le port est correct dans `Procfile`
- Vérifiez les variables d'environnement

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Railway
2. Consultez la documentation Railway
3. Vérifiez que tous les fichiers sont présents

---

**🎉 Félicitations ! Votre application Hobbymood sera bientôt en ligne !** 