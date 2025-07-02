# Script PowerShell pour déployer Hobbymood vers GitHub
# Auteur: Assistant IA
# Date: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Déploiement de Hobbymood vers GitHub" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Configuration
$REPO_NAME = "Hobbymood"
$GITHUB_USERNAME = Read-Host "Entrez votre nom d'utilisateur GitHub"
$GITHUB_TOKEN = Read-Host "Entrez votre token GitHub (ou appuyez sur Entrée pour utiliser SSH)" -AsSecureString

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Veuillez installer Git d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier si on est dans le bon répertoire
if (-not (Test-Path "app.py")) {
    Write-Host "❌ Veuillez exécuter ce script depuis le répertoire racine de Hobbymood" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Répertoire de travail: $(Get-Location)" -ForegroundColor Cyan

# Initialiser Git si ce n'est pas déjà fait
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# Configurer Git (si pas déjà configuré)
Write-Host "⚙️ Configuration Git..." -ForegroundColor Yellow
$userName = Read-Host "Entrez votre nom (pour Git)" -DefaultValue "Hobbymood Developer"
$userEmail = Read-Host "Entrez votre email (pour Git)" -DefaultValue "dev@hobbymood.com"

git config user.name $userName
git config user.email $userEmail
Write-Host "✅ Git configuré avec: $userName <$userEmail>" -ForegroundColor Green

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers au staging..." -ForegroundColor Yellow
git add .

# Vérifier le statut
Write-Host "📊 Statut du repository:" -ForegroundColor Cyan
git status

# Premier commit
Write-Host "💾 Création du premier commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Hobbymood - Application de quiz interactif

- Application Flask avec interface admin et overlay
- Système de scores en temps réel
- Support pour 3 jeux avec questions et réponses
- Interface responsive et moderne
- Déploiement Railway et PythonAnywhere
- WebSocket pour communication temps réel"

git commit -m $commitMessage
Write-Host "✅ Premier commit créé" -ForegroundColor Green

# Créer le repository sur GitHub
Write-Host "🌐 Création du repository sur GitHub..." -ForegroundColor Yellow

# Convertir le token sécurisé en texte
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($GITHUB_TOKEN)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

if ($plainToken) {
    # Utiliser l'API GitHub avec token
    $headers = @{
        "Authorization" = "token $plainToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $body = @{
        name = $REPO_NAME
        description = "Application de quiz interactif Hobbymood avec interface admin et overlay"
        private = $false
        auto_init = $false
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ Repository GitHub créé: $($response.html_url)" -ForegroundColor Green
        $remoteUrl = $response.clone_url
    } catch {
        Write-Host "❌ Erreur lors de la création du repository: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Veuillez créer le repository manuellement sur GitHub.com" -ForegroundColor Yellow
        $remoteUrl = Read-Host "Entrez l'URL du repository GitHub (ex: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git)"
    }
} else {
    # Utiliser SSH
    Write-Host "🔑 Utilisation de SSH pour GitHub..." -ForegroundColor Yellow
    $remoteUrl = "git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
}

# Ajouter le remote
Write-Host "🔗 Ajout du remote GitHub..." -ForegroundColor Yellow
git remote add origin $remoteUrl
Write-Host "✅ Remote ajouté: $remoteUrl" -ForegroundColor Green

# Pousser vers GitHub
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ Code poussé vers la branche main" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Tentative avec la branche master..." -ForegroundColor Yellow
    try {
        git branch -M master
        git push -u origin master
        Write-Host "✅ Code poussé vers la branche master" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors du push: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Vérifiez vos permissions GitHub et votre connexion" -ForegroundColor Yellow
    }
}

# Créer un fichier README pour GitHub
Write-Host "📝 Création du README GitHub..." -ForegroundColor Yellow
$readmeContent = @"
# 🎮 Hobbymood - Application de Quiz Interactif

Une application web moderne pour créer et gérer des quiz interactifs avec interface admin et overlay en temps réel.

## ✨ Fonctionnalités

- **Interface Admin** : Création et gestion des quiz
- **Overlay en Temps Réel** : Affichage des questions et scores
- **Système de Scores** : Suivi des performances en direct
- **3 Jeux Prêts** : Quiz pré-configurés inclus
- **Interface Responsive** : Compatible desktop et mobile
- **WebSocket** : Communication temps réel

## 🚀 Déploiement

### Railway
\`\`\`bash
# Cloner le repository
git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
cd $REPO_NAME

# Déployer sur Railway
railway login
railway init
railway up
\`\`\`

### PythonAnywhere
\`\`\`bash
# Suivre les instructions dans README_DEPLOYMENT.md
\`\`\`

## 🛠️ Installation Locale

\`\`\`bash
# Cloner le repository
git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
cd $REPO_NAME

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'application
python app.py
\`\`\`

## 📁 Structure du Projet

\`\`\`
Hobbymood/
├── app.py                 # Application principale Flask
├── backend/              # Backend FastAPI
├── frontend/             # Interface utilisateur
├── assets/               # Ressources des jeux
│   ├── jeu1/            # Premier quiz
│   ├── jeu2/            # Deuxième quiz
│   └── jeu3/            # Troisième quiz
└── hobbymood_pythonanywhere/  # Version PythonAnywhere
\`\`\`

## 🌐 URLs

- **Admin** : \`http://localhost:5000/admin\`
- **Overlay** : \`http://localhost:5000/overlay\`
- **Scores** : \`http://localhost:5000/scores\`

## 📝 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ pour les quiz interactifs**
"@

$readmeContent | Out-File -FilePath "README_GITHUB.md" -Encoding UTF8
Write-Host "✅ README GitHub créé: README_GITHUB.md" -ForegroundColor Green

# Ajouter et commiter le README
git add README_GITHUB.md
git commit -m "docs: Ajout du README GitHub"
git push

Write-Host ""
Write-Host "🎉 Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "📋 Résumé:" -ForegroundColor Cyan
Write-Host "   • Repository Git initialisé" -ForegroundColor White
Write-Host "   • Code poussé vers GitHub" -ForegroundColor White
Write-Host "   • README GitHub créé" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Votre repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Vérifiez votre repository sur GitHub.com" -ForegroundColor White
Write-Host "   2. Configurez les GitHub Pages si nécessaire" -ForegroundColor White
Write-Host "   3. Ajoutez des collaborateurs si besoin" -ForegroundColor White
Write-Host "   4. Configurez les GitHub Actions pour le CI/CD" -ForegroundColor White
Write-Host ""
Write-Host "✨ Bon développement !" -ForegroundColor Green 