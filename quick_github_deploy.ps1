# Script PowerShell rapide pour déployer Hobbymood vers GitHub
# Version simplifiée

Write-Host "🚀 Déploiement rapide vers GitHub" -ForegroundColor Green

# Vérifications de base
if (-not (Test-Path "app.py")) {
    Write-Host "❌ Exécutez ce script depuis le répertoire racine de Hobbymood" -ForegroundColor Red
    exit 1
}

# Demander les informations
$username = Read-Host "Nom d'utilisateur GitHub"
$repoName = Read-Host "Nom du repository" -DefaultValue "Hobbymood"

# Initialiser Git
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Git initialisé" -ForegroundColor Green
}

# Configurer Git
git config user.name $username
git config user.email "$username@users.noreply.github.com"

# Ajouter et commiter
git add .
git commit -m "Initial commit: Hobbymood quiz application"

# Créer le remote et pousser
$remoteUrl = "https://github.com/$username/$repoName.git"
git remote add origin $remoteUrl

# Essayer main, puis master
try {
    git push -u origin main
} catch {
    git branch -M master
    git push -u origin master
}

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🔗 Repository: https://github.com/$username/$repoName" -ForegroundColor Yellow 