# Script pour installer Git et déployer Hobbymood
Write-Host "🚀 Installation Git et déploiement Hobbymood" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Vérifier si Git est installé
$gitInstalled = $false
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:USERPROFILE\AppData\Local\Programs\Git\bin\git.exe"
)

foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        Write-Host "✅ Git trouvé à: $path" -ForegroundColor Green
        $gitInstalled = $true
        $env:PATH += ";$(Split-Path $path)"
        break
    }
}

if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Options d'installation:" -ForegroundColor Yellow
    Write-Host "1. Télécharger Git depuis: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Ou utiliser GitHub Desktop (recommandé pour débutants)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 GitHub Desktop: https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host ""
    
    $choice = Read-Host "Voulez-vous installer Git maintenant? (o/n)"
    if ($choice -eq "o" -or $choice -eq "O") {
        Write-Host "🌐 Ouverture du téléchargement Git..." -ForegroundColor Yellow
        Start-Process "https://git-scm.com/download/win"
        Write-Host "📋 Instructions:" -ForegroundColor Cyan
        Write-Host "1. Téléchargez et installez Git" -ForegroundColor White
        Write-Host "2. Redémarrez PowerShell" -ForegroundColor White
        Write-Host "3. Relancez ce script" -ForegroundColor White
        exit
    }
}

# Si Git est installé, procéder au déploiement
if ($gitInstalled) {
    Write-Host ""
    Write-Host "🎯 Déploiement vers GitHub..." -ForegroundColor Green
    
    # Demander les informations
    $username = Read-Host "Entrez votre nom d'utilisateur GitHub"
    $email = Read-Host "Entrez votre email"
    
    Write-Host ""
    Write-Host "📋 Commandes à exécuter:" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "1. Initialiser Git:" -ForegroundColor Cyan
    Write-Host "git init" -ForegroundColor White
    
    Write-Host ""
    Write-Host "2. Configurer Git:" -ForegroundColor Cyan
    Write-Host "git config user.name `"$username`"" -ForegroundColor White
    Write-Host "git config user.email `"$email`"" -ForegroundColor White
    
    Write-Host ""
    Write-Host "3. Ajouter les fichiers:" -ForegroundColor Cyan
    Write-Host "git add ." -ForegroundColor White
    Write-Host "git commit -m `"Initial commit: Hobbymood quiz application`"" -ForegroundColor White
    
    Write-Host ""
    Write-Host "4. Créer le repository sur GitHub.com:" -ForegroundColor Cyan
    Write-Host "   - Allez sur https://github.com" -ForegroundColor White
    Write-Host "   - Cliquez sur 'New repository'" -ForegroundColor White
    Write-Host "   - Nom: Hobbymood" -ForegroundColor White
    Write-Host "   - Description: Application de quiz interactif" -ForegroundColor White
    Write-Host "   - NE PAS initialiser avec README" -ForegroundColor White
    
    Write-Host ""
    Write-Host "5. Connecter et pousser:" -ForegroundColor Cyan
    Write-Host "git remote add origin https://github.com/$username/Hobbymood.git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎯 Après GitHub, allez sur Railway:" -ForegroundColor Green
    Write-Host "   - https://railway.app" -ForegroundColor White
    Write-Host "   - Connectez-vous avec GitHub" -ForegroundColor White
    Write-Host "   - New Project > Deploy from GitHub repo" -ForegroundColor White
    Write-Host "   - Sélectionnez Hobbymood" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Script terminé!" -ForegroundColor Green 