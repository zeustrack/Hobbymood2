/**
 * Version PythonAnywhere de ScoresController
 * Utilise du polling au lieu des WebSockets
 */

// === Ajout : positions des scores ===
const scorePositions = {
  "Team 1": { x: 850, y: 824 },
  "Team 2": { x: 850, y: 920 },
  "Team 3": { x: 850, y: 1014 },
  "Team 4": { x: 1444, y: 821 },
  "Team 5": { x: 1444, y: 919 },
  "Team 6": { x: 1444, y: 1014 }
};

// Debug: vérifier que les positions sont bien chargées
console.log('Positions des scores chargées:', scorePositions);

// Scores JavaScript pour PythonAnywhere (mode polling)
let scores = {};
let pollingInterval = null;

class ScoresController {
    constructor() {
        this.currentScores = {
            team1: 0, team2: 0, team3: 0,
            team4: 0, team5: 0, team6: 0
        };
        this.teamNames = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"];
        this.lastUpdate = 0;
        this.scoresVisible = false;
    }

    async init() {
        console.log('🚀 Initialisation ScoresController PythonAnywhere...');
        this.setupEventListeners();
        await this.loadInitialScores();
        this.startPolling();
        console.log('✅ ScoresController initialisé');
    }

    async loadInitialScores() {
        try {
            const response = await fetch('/api/scores');
            if (response.ok) {
                scores = await response.json();
                this.handleScoresUpdate(scores);
            }
        } catch (error) {
            console.error('Erreur chargement scores initiaux:', error);
        }
    }

    handleScoresUpdate(data) {
        const { teams, visible } = data;
        
        if (!teams) {
            console.error('Données de scores manquantes');
            return;
        }

        // Mettre à jour les scores
        this.currentScores = teams;
        
        // Mettre à jour la visibilité
        if (visible !== undefined) {
            this.scoresVisible = visible;
        }

        // Afficher les scores
        this.showScores({ visible: this.scoresVisible });
    }

    showScores(data) {
        const { visible = true } = data;
        const overlay = document.getElementById('scores-overlay');
        overlay.innerHTML = '';
        
        if (visible) {
            // Afficher chaque score à la bonne position
            this.teamNames.forEach((teamName, idx) => {
                const teamKey = 'team' + (idx + 1); // Correspondance avec currentScores
                const pos = scorePositions[teamName];
                if (!pos) return;
                
                const score = this.currentScores[teamKey] !== undefined ? this.currentScores[teamKey] : 0;
                
                const teamDiv = document.createElement('div');
                teamDiv.className = 'team-score';
                teamDiv.setAttribute('data-team', teamKey);
                teamDiv.style.position = 'absolute';
                teamDiv.style.left = pos.x + 'px';
                teamDiv.style.top = pos.y + 'px';
                teamDiv.textContent = score;
                
                overlay.appendChild(teamDiv);
            });
            
            console.log('Scores affichés:', this.currentScores);
        }
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
        // Raccourci pour recharger (Ctrl+R)
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            window.location.reload();
        }
    }

    handleResize() {
        // Les positions sont maintenant fixes en 1920x1080
        // Pas besoin d'event listeners de redimensionnement
    }

    startPolling() {
        // Polling toutes les 2 secondes pour les mises à jour
        pollingInterval = setInterval(() => {
            this.loadInitialScores();
        }, 2000);
    }

    stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }
}

// Initialisation
const scoresController = new ScoresController();
document.addEventListener('DOMContentLoaded', () => {
    scoresController.init();
});

// Nettoyer à la fermeture
window.addEventListener('beforeunload', function() {
    scoresController.stopPolling();
}); 