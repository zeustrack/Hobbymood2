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

// Taille native de l'image de base (à adapter selon la vraie taille de base.png)
const BASE_IMAGE_WIDTH = 1920; // largeur réelle de base.png
const BASE_IMAGE_HEIGHT = 1080; // hauteur réelle de base.png

class ScoresController {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.currentScores = {
            team1: 0,
            team2: 0,
            team3: 0,
            team4: 0,
            team5: 0,
            team6: 0
        };
        

        
        this.teamNames = [
            "Team 1",
            "Team 2",
            "Team 3",
            "Team 4",
            "Team 5",
            "Team 6"
        ];
        
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.showStatusIndicator();
        this.loadInitialScores();
        this.updateScorePositions(); // Initialiser les positions
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/scores`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket scores connecté');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
        };
        
        this.websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Erreur parsing message scores:', error);
            }
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket scores déconnecté');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.scheduleReconnect();
        };
        
        this.websocket.onerror = (error) => {
            console.error('Erreur WebSocket scores:', error);
            this.isConnected = false;
            this.updateConnectionStatus(false);
        };
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
            
            setTimeout(() => {
                console.log(`Tentative de reconnexion scores ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                this.connectWebSocket();
            }, delay);
        }
    }

    handleMessage(message) {
        const { type, data } = message;
        
        switch (type) {
            case 'scores_state':
                this.handleScoresState(data);
                break;
            case 'update_scores':
                this.updateScores(data);
                break;
            case 'reset_scores':
                this.handleResetScores(data);
                break;
            case 'show_scores':
                this.showScores(data);
                break;
            default:
                console.log('Message scores non reconnu:', message);
        }
    }

    handleScoresState(state) {
        if (state.visible) {
            this.updateScores(state);
            this.showScores({ visible: true });
        } else {
            this.showScores({ visible: false });
        }
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

    handleResetScores(data) {
        console.log('Reset des scores reçu:', data);
        
        const { teams } = data;
        if (!teams) {
            console.error('Données de reset manquantes');
            return;
        }

        // Remettre tous les scores à zéro
        Object.keys(teams).forEach(teamKey => {
            this.currentScores[teamKey] = 0;
            this.updateTeamScore(teamKey, 0);
        });
        
        console.log('Tous les scores ont été remis à zéro sur la page scores');
    }

    updateTeamScore(teamKey, score) {
        // Met à jour la valeur dans l'overlay
        const overlay = document.getElementById('scores-overlay');
        const teamElement = overlay.querySelector(`[data-team="${teamKey}"]`);
        if (!teamElement) {
            // L'élément n'existe pas encore, on le crée
            this.showScores({ visible: true });
            return;
        }
        
        // Animation de mise à jour
        teamElement.classList.remove('updated');
        void teamElement.offsetWidth; // Force reflow
        teamElement.textContent = score;
        teamElement.classList.add('updated');
        setTimeout(() => {
            teamElement.classList.remove('updated');
        }, 500);
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
                if (!pos) {
                    console.warn(`Position manquante pour ${teamName}`);
                    return;
                }
                const score = this.currentScores[teamKey] !== undefined ? this.currentScores[teamKey] : 0;
                const teamDiv = document.createElement('div');
                teamDiv.className = 'team-score';
                teamDiv.setAttribute('data-team', teamKey);
                teamDiv.style.position = 'absolute';
                teamDiv.style.left = pos.x + 'px';
                teamDiv.style.top = pos.y + 'px';
                teamDiv.textContent = score;
                overlay.appendChild(teamDiv);
                
                // Debug: vérifier que les positions sont bien appliquées
                console.log(`Score ${teamName} (${teamKey}) affiché à la position:`, pos, `avec le score:`, score);
            });
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }

    loadInitialScores() {
        // Charger les scores initiaux depuis l'API
        fetch('/api/scores')
            .then(response => response.json())
            .then(data => {
                if (data.teams) {
                    this.currentScores = { ...this.currentScores, ...data.teams };
                }
                // Afficher les scores immédiatement
                this.showScores({ visible: true });
            })
            .catch(error => {
                console.error('Erreur chargement scores initiaux:', error);
                // Afficher quand même les scores à 0
                this.showScores({ visible: true });
            });
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        const statusIndicator = document.getElementById('status-indicator');
        
        if (connected) {
            statusElement.textContent = 'Connecté';
            statusElement.classList.add('connected');
            statusIndicator.classList.add('status-visible');
            
            // Masquer l'indicateur après 3 secondes
            setTimeout(() => {
                statusIndicator.classList.remove('status-visible');
            }, 3000);
        } else {
            statusElement.textContent = 'Déconnecté';
            statusElement.classList.remove('connected');
            statusIndicator.classList.add('status-visible');
        }
    }

    showStatusIndicator() {
        // Afficher temporairement l'indicateur au démarrage
        const statusIndicator = document.getElementById('status-indicator');
        statusIndicator.classList.add('status-visible');
        
        setTimeout(() => {
            if (this.isConnected) {
                statusIndicator.classList.remove('status-visible');
            }
        }, 3000);
    }

    setupEventListeners() {
        // Gestion des erreurs de chargement d'images
        window.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                console.error('Erreur chargement image scores:', event.target.src);
            }
        }, true);

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('Page scores visible - vérification connexion');
                if (!this.isConnected) {
                    this.connectWebSocket();
                }
            }
        });

        // Gestion des raccourcis clavier (pour debug)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'r') {
                event.preventDefault();
                console.log('Rechargement forcé de la page scores');
                window.location.reload();
            }
            if (event.key === 'Escape') {
                this.hideScores();
            }
        });

        // Gestion du clic sur les scores (pour debug)
        document.addEventListener('click', (event) => {
            if (event.target.closest('.team-score')) {
                const teamElement = event.target.closest('.team-score');
                const teamKey = teamElement.dataset.team;
                const currentScore = this.currentScores[teamKey];
                console.log(`Score actuel ${teamKey}: ${currentScore}`);
            }
        });
        
        // Les positions sont maintenant fixes en 1920x1080
        // Pas besoin d'event listeners de redimensionnement
    }
    


    hideScores() {
        const overlay = document.getElementById('scores-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // === MÉTHODE : Positions fixes en 1920x1080 ===
    updateScorePositions() {
        // Les positions sont maintenant fixes en 1920x1080
        // Pas besoin de recalculer car l'overlay fait exactement 1920x1080
        // et les scores sont positionnés avec les coordonnées exactes
    }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.scoresController = new ScoresController();
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    console.log('Fermeture de la page scores');
}); 