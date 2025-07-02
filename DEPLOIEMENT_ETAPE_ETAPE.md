# 🚀 Déploiement Hobbymood - Guide Visuel Étape par Étape

## 📋 Étape 1 : Installer GitHub Desktop

### 1.1 Télécharger GitHub Desktop
- **Ouvrez votre navigateur**
- **Allez sur** : https://desktop.github.com/
- **Cliquez sur "Download for Windows"**
- **Attendez le téléchargement**

### 1.2 Installer GitHub Desktop
- **Double-cliquez** sur le fichier téléchargé
- **Suivez l'assistant d'installation**
- **Cliquez sur "Install"**
- **Attendez la fin de l'installation**

### 1.3 Première connexion
- **Ouvrez GitHub Desktop**
- **Cliquez sur "Sign in to GitHub.com"**
- **Entrez vos identifiants GitHub**
- **Si vous n'avez pas de compte, créez-en un**

## 📋 Étape 2 : Créer le Repository

### 2.1 Nouveau repository
- **Dans GitHub Desktop, cliquez sur "File"**
- **Sélectionnez "New Repository"**

### 2.2 Configuration du repository
Remplissez les champs :
- **Name** : `Hobbymood`
- **Description** : `Application de quiz interactif avec interface admin et overlay`
- **Local path** : `C:\Users\Administrateur\Hobbymood`
- **COCHEZ** "Initialize this repository with a README"
- **Git ignore** : Sélectionnez `Python`
- **License** : Sélectionnez `MIT License`

### 2.3 Créer le repository
- **Cliquez sur "Create Repository"**

## 📋 Étape 3 : Publier sur GitHub

### 3.1 Publier le repository
- **Cliquez sur "Publish repository"**

### 3.2 Configuration de publication
- **Repository name** : `Hobbymood`
- **Description** : `Application de quiz interactif avec interface admin et overlay`
- **DÉCOCHEZ** "Keep this code private" (pour un repository public)
- **Cliquez sur "Publish Repository"**

## 📋 Étape 4 : Ajouter tous les fichiers

### 4.1 Vérifier les fichiers
- **Dans GitHub Desktop**, vous verrez tous vos fichiers
- **Vérifiez que tous les fichiers sont présents**

### 4.2 Premier commit
- **Dans le champ "Summary"**, tapez : `Initial commit: Hobbymood quiz application`
- **Cliquez sur "Commit to main"**

### 4.3 Pousser vers GitHub
- **Cliquez sur "Push origin"**
- **Attendez la fin du push**

## 🚂 Étape 5 : Déployer sur Railway

### 5.1 Aller sur Railway
- **Ouvrez votre navigateur**
- **Allez sur** : https://railway.app
- **Cliquez sur "Login with GitHub"**

### 5.2 Créer un nouveau projet
- **Cliquez sur "New Project"**
- **Sélectionnez "Deploy from GitHub repo"**

### 5.3 Sélectionner le repository
- **Cherchez votre repository** `Hobbymood`
- **Cliquez dessus pour le sélectionner**
- **Cliquez sur "Deploy Now"**

### 5.4 Attendre le déploiement
- **Railway va automatiquement** :
  - ✅ Installer les dépendances Python
  - ✅ Configurer l'application
  - ✅ Démarrer le serveur
  - ✅ Générer une URL publique

## 🌐 Étape 6 : Accéder à votre application

### 6.1 URLs de votre application
Une fois le déploiement terminé, vous aurez accès à :
- **Admin** : `https://votre-app.railway.app/admin`
- **Overlay** : `https://votre-app.railway.app/overlay`
- **Scores** : `https://votre-app.railway.app/scores`

### 6.2 Tester votre application
- **Ouvrez l'URL Admin** dans votre navigateur
- **Vérifiez que tout fonctionne**
- **Testez l'overlay et les scores**

## 🔄 Mises à jour futures

### Pour mettre à jour votre application :
1. **Modifiez votre code** dans votre éditeur
2. **Dans GitHub Desktop** :
   - Vous verrez les changements en rouge
   - Ajoutez un message de commit
   - Cliquez sur "Commit to main"
   - Cliquez sur "Push origin"
3. **Railway se met à jour automatiquement** !

## 🛠️ Dépannage

### Problème : Repository non trouvé
- Vérifiez que vous êtes connecté à GitHub
- Vérifiez que le repository a été créé

### Problème : Push échoue
- Vérifiez votre connexion internet
- Vérifiez vos permissions GitHub

### Problème : Railway ne démarre pas
- Vérifiez les logs dans Railway
- Vérifiez que tous les fichiers sont présents

## ✅ Checklist de fin

- [ ] GitHub Desktop installé
- [ ] Repository créé localement
- [ ] Repository publié sur GitHub
- [ ] Tous les fichiers ajoutés
- [ ] Premier commit effectué
- [ ] Code poussé vers GitHub
- [ ] Projet créé sur Railway
- [ ] Repository connecté à Railway
- [ ] Déploiement terminé
- [ ] Application accessible en ligne

---

**🎉 Félicitations ! Votre application Hobbymood est maintenant en ligne !** 