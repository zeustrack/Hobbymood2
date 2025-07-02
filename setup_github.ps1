# Script simple pour configurer GitHub
# Copiez et collez ces commandes une par une dans PowerShell

Write-Host "🚀 Configuration GitHub pour Hobbymood" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Demander les informations
$username = Read-Host "Entrez votre nom d'utilisateur GitHub"
$email = Read-Host "Entrez votre email"

Write-Host ""
Write-Host "📋 Commandes à exécuter :" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

Write-Host ""
Write-Host "1. Initialiser Git :" -ForegroundColor Cyan
Write-Host "git init" -ForegroundColor White

Write-Host ""
Write-Host "2. Configurer Git :" -ForegroundColor Cyan
Write-Host "git config user.name `"$username`"" -ForegroundColor White
Write-Host "git config user.email `"$email`"" -ForegroundColor White

Write-Host ""
Write-Host "3. Ajouter les fichiers :" -ForegroundColor Cyan
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m `"Initial commit: Hobbymood quiz application`"" -ForegroundColor White

Write-Host ""
Write-Host "4. Créer le repository sur GitHub.com :" -ForegroundColor Cyan
Write-Host "   - Allez sur https://github.com" -ForegroundColor White
Write-Host "   - Cliquez sur 'New repository'" -ForegroundColor White
Write-Host "   - Nom: Hobbymood" -ForegroundColor White
Write-Host "   - Description: Application de quiz interactif" -ForegroundColor White
Write-Host "   - NE PAS initialiser avec README" -ForegroundColor White

Write-Host ""
Write-Host "5. Connecter et pousser :" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/$username/Hobbymood.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Après GitHub, allez sur Railway :" -ForegroundColor Green
Write-Host "   - https://railway.app" -ForegroundColor White
Write-Host "   - Connectez-vous avec GitHub" -ForegroundColor White
Write-Host "   - New Project > Deploy from GitHub repo" -ForegroundColor White
Write-Host "   - Sélectionnez Hobbymood" -ForegroundColor White

Write-Host ""
Write-Host "✅ Votre application sera en ligne !" -ForegroundColor Green 