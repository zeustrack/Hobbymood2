/**
 * Version PythonAnywhere de OverlayController
 * Utilise du polling au lieu des WebSockets
 */

class OverlayController {
    constructor() {
        this.currentAsset = null;
        this.pollingInterval = null;
        this.lastUpdate = 0;
        this.teamNames = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"];
        this.currentScores = {
            team1: 0, team2: 0, team3: 0,
            team4: 0, team5: 0, team6: 0
        };
    }

    async init() {
        console.log('🚀 Initialisation OverlayController PythonAnywhere...');
        this.setupEventListeners();
        this.startPolling();
        console.log('✅ OverlayController initialisé');
    }

    startPolling() {
        // Polling toutes les 1 seconde pour vérifier les mises à jour
        this.pollingInterval = setInterval(() => {
            this.checkForUpdates();
        }, 1000);
    }

    async checkForUpdates() {
        try {
            // Vérifier les mises à jour de l'overlay
            const overlayResponse = await fetch('/api/overlay/state');
            if (overlayResponse.ok) {
                const overlayData = await overlayResponse.json();
                if (overlayData.last_update > this.lastUpdate) {
                    this.lastUpdate = overlayData.last_update;
                    this.handleOverlayUpdate(overlayData);
                }
            }

            // Vérifier les mises à jour des scores
            const scoresResponse = await fetch('/api/scores');
            if (scoresResponse.ok) {
                const scoresData = await scoresResponse.json();
                this.updateScores(scoresData);
            }
        } catch (error) {
            console.error('Erreur polling overlay:', error);
        }
    }

    handleOverlayUpdate(overlayData) {
        if (overlayData.current_asset) {
            this.displayAsset(overlayData.current_asset);
        } else if (!overlayData.visible) {
            this.clearOverlay();
        }
    }

    displayAsset(assetData) {
        const { asset_path, asset_type } = assetData;
        
        if (!asset_path) return;

        console.log('Affichage asset:', asset_path, asset_type);

        // Créer l'élément image
        const img = document.createElement('img');
        img.src = asset_path;
        img.alt = asset_type;
        img.className = `overlay-asset ${asset_type}-asset`;

        // Ajouter des classes spécifiques selon le type
        if (asset_type === 'question') {
            img.classList.add('question-animation');
        } else if (asset_type === 'answer') {
            img.classList.add('answer-animation');
        }

        // Effacer l'overlay avant d'afficher le nouvel asset
        this.clearOverlay();

        // Ajouter l'image à l'overlay
        const overlay = document.getElementById('overlay-container');
        if (overlay) {
            overlay.appendChild(img);
        }

        this.currentAsset = assetData;
    }

    clearOverlay() {
        const overlay = document.getElementById('overlay-container');
        if (overlay) {
            overlay.innerHTML = '';
        }
        this.currentAsset = null;
    }

    updateScores(data) {
        const { teams } = data;
        
        if (!teams) {
            console.error('Données de scores manquantes');
            return;
        }

        // Mettre à jour chaque score d'équipe
        Object.keys(teams).forEach(teamKey => {
            const newScore = teams[teamKey];
            const oldScore = this.currentScores[teamKey];
            
            if (newScore !== oldScore) {
                this.updateTeamScore(teamKey, newScore);
                this.currentScores[teamKey] = newScore;
            }
        });
    }

    updateTeamScore(teamKey, newScore) {
        const scoreElement = document.querySelector(`[data-team="${teamKey}"]`);
        if (scoreElement) {
            scoreElement.textContent = newScore;
            
            // Animation de mise à jour
            scoreElement.classList.add('score-updated');
            setTimeout(() => {
                scoreElement.classList.remove('score-updated');
            }, 500);
        }
    }

    setupEventListeners() {
        // Gestion des raccourcis clavier
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleKeyboardShortcuts(event) {
        // Raccourci pour effacer tout (Echap)
        if (event.key === 'Escape') {
            this.clearOverlay();
        }

        // Raccourci pour recharger (Ctrl+R)
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            window.location.reload();
        }
    }

    handleResize() {
        // Ajuster la taille des assets si nécessaire
        const assets = document.querySelectorAll('.overlay-asset');
        assets.forEach(asset => {
            // Logique de redimensionnement si nécessaire
        });
    }
}

// Initialisation
const overlayController = new OverlayController();
document.addEventListener('DOMContentLoaded', () => {
    overlayController.init();
}); 