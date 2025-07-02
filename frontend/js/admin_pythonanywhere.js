/**
 * Version PythonAnywhere de AdminController
 * Utilise du polling au lieu des WebSockets
 */

class AdminController {
    constructor() {
        this.gamesData = {};
        this.currentScores = {
            team1: 0, team2: 0, team3: 0,
            team4: 0, team5: 0, team6: 0
        };
        this.activeButtons = { logo: null, presentation: null };
        this.pollingInterval = null;
        this.lastOverlayUpdate = 0;
        this.lastScoresUpdate = 0;
    }

    async init() {
        console.log('🚀 Initialisation AdminController PythonAnywhere...');
        await this.loadGamesData();
        this.setupEventListeners();
        this.startPolling();
        this.loadInitialScores();
        console.log('✅ AdminController initialisé');
    }

    startPolling() {
        // Polling toutes les 2 secondes pour vérifier les mises à jour
        this.pollingInterval = setInterval(() => {
            this.checkForUpdates();
        }, 2000);
    }

    async checkForUpdates() {
        try {
            // Vérifier les mises à jour de l'overlay
            const overlayResponse = await fetch('/api/overlay/state');
            if (overlayResponse.ok) {
                const overlayData = await overlayResponse.json();
                if (overlayData.last_update > this.lastOverlayUpdate) {
                    this.lastOverlayUpdate = overlayData.last_update;
                    // Mettre à jour l'interface si nécessaire
                }
            }

            // Vérifier les mises à jour des scores
            const scoresResponse = await fetch('/api/scores');
            if (scoresResponse.ok) {
                const scoresData = await scoresResponse.json();
                if (scoresData.last_update > this.lastScoresUpdate) {
                    this.lastScoresUpdate = scoresData.last_update;
                    this.updateScoreFieldsFromServer(scoresData.teams);
                }
            }
        } catch (error) {
            console.error('Erreur polling:', error);
        }
    }

    async sendAction(actionData) {
        try {
            const response = await fetch('/api/admin/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(actionData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Action envoyée:', actionData.type, result);
            return result;
        } catch (error) {
            console.error('Erreur envoi action:', error);
        }
    }

    async loadGamesData() {
        try {
            const response = await fetch('/api/games');
            if (response.ok) {
                this.gamesData = await response.json();
                this.generateGameSections();
            }
        } catch (error) {
            console.error('Erreur chargement jeux:', error);
        }
    }

    generateGameSections() {
        const gamesContainer = document.getElementById('games-container');
        if (!gamesContainer) return;

        gamesContainer.innerHTML = '';

        Object.keys(this.gamesData).forEach(gameKey => {
            const game = this.gamesData[gameKey];
            const gameSection = this.createGameSection(gameKey, game);
            gamesContainer.appendChild(gameSection);
        });
    }

    createGameSection(gameKey, game) {
        const section = document.createElement('div');
        section.className = 'game-section';
        section.innerHTML = `
            <h3>${game.name}</h3>
            <div class="game-controls">
                <button class="control-btn" data-action="show_logo" data-game="${gameKey}">
                    🏷️ Logo
                </button>
                <button class="control-btn" data-action="show_presentation" data-game="${gameKey}">
                    📺 Présentation
                </button>
            </div>
            <div class="questions-container" data-game="${gameKey}">
                ${this.generateQuestionButtons(gameKey, game.assets.questions || [])}
            </div>
        `;
        return section;
    }

    generateQuestionButtons(gameKey, questions) {
        if (!questions || questions.length === 0) {
            return '<p>Aucune question disponible</p>';
        }

        return questions.map(q => `
            <div class="question-group" data-game="${gameKey}" data-question="${q.number}">
                <span class="question-number">Q${q.number}</span>
                <button class="question-btn" onclick="adminController.showQuestion('${gameKey}', ${JSON.stringify(q).replace(/"/g, '&quot;')})">
                    Question
                </button>
                <button class="answer-btn" onclick="adminController.showAnswer('${gameKey}', ${JSON.stringify(q).replace(/"/g, '&quot;')})">
                    Réponse
                </button>
            </div>
        `).join('');
    }

    showQuestion(gameKey, question) {
        this.sendAction({
            type: 'show_asset',
            data: {
                game: gameKey,
                asset_type: 'question',
                asset_path: question.question
            }
        });
    }

    showAnswer(gameKey, question) {
        this.sendAction({
            type: 'show_asset',
            data: {
                game: gameKey,
                asset_type: 'answer',
                asset_path: question.answer
            }
        });
    }

    async loadInitialScores() {
        try {
            const response = await fetch('/api/scores');
            if (response.ok) {
                const data = await response.json();
                this.currentScores = data.teams;
                this.updateScoreFields();
            }
        } catch (error) {
            console.error('Erreur chargement scores initiaux:', error);
        }
    }

    updateScoreFields() {
        Object.keys(this.currentScores).forEach(teamKey => {
            const scoreField = document.querySelector(`[data-team="${teamKey}"] .score-field`);
            if (scoreField) {
                scoreField.value = this.currentScores[teamKey];
            }
        });
    }

    updateScoreFieldsFromServer(serverScores) {
        Object.keys(serverScores).forEach(teamKey => {
            const scoreField = document.querySelector(`[data-team="${teamKey}"] .score-field`);
            if (scoreField && serverScores[teamKey] !== this.currentScores[teamKey]) {
                this.currentScores[teamKey] = serverScores[teamKey];
                scoreField.value = serverScores[teamKey];
            }
        });
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchSection(btn.dataset.section);
            });
        });

        // Boutons de contrôle des jeux
        document.querySelectorAll('.control-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleGameControl(btn);
            });
        });

        // Bouton "Effacer tout"
        const clearAllBtn = document.getElementById('clear-all');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir effacer tous les éléments de l\'overlay ?')) {
                    this.sendAction({
                        type: 'clear_overlay',
                        clear_type: 'all'
                    });
                    this.resetAllActiveButtons();
                }
            });
        }

        // Bouton "Effacer Question/Réponse"
        const clearQABtn = document.getElementById('clear-question-answer');
        if (clearQABtn) {
            clearQABtn.addEventListener('click', () => {
                this.clearQuestionAndAnswer();
            });
        }

        // Contrôles des scores
        this.setupScoreControls();

        // Gestion des raccourcis clavier
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
    }

    setupScoreControls() {
        // Bouton de reset des points
        const resetBtn = document.getElementById('reset-points');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir remettre tous les scores à zéro ?')) {
                    this.resetAllScores();
                }
            });
        }

        // Contrôles des scores d'équipe
        document.querySelectorAll('.score-field').forEach(field => {
            // Gestionnaire pour la saisie directe (input)
            field.addEventListener('input', (event) => {
                const teamKey = event.target.closest('[data-team]').dataset.team;
                const newScore = parseInt(event.target.value) || 0;
                this.updateTeamScore(teamKey, newScore);
            });
            
            // Gestionnaire pour la validation (change)
            field.addEventListener('change', (event) => {
                const teamKey = event.target.closest('[data-team]').dataset.team;
                const newScore = parseInt(event.target.value) || 0;
                this.updateTeamScore(teamKey, newScore);
            });

            // Sélection automatique au clic
            field.addEventListener('click', (event) => {
                event.target.select();
            });
        });

        // Boutons + et -
        document.querySelectorAll('.score-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const action = btn.dataset.action;
                const teamKey = btn.closest('[data-team]').dataset.team;
                const scoreField = btn.closest('.score-input').querySelector('.score-field');
                let currentScore = parseInt(scoreField.value) || 0;

                if (action === 'increment') {
                    currentScore++;
                } else if (action === 'decrement') {
                    currentScore = Math.max(0, currentScore - 1);
                }

                scoreField.value = currentScore;
                this.updateTeamScore(teamKey, currentScore);
            });
        });
    }

    updateTeamScore(teamKey, score) {
        this.currentScores[teamKey] = score;
        
        this.sendAction({
            type: 'update_scores',
            team: teamKey,
            score: score
        });
    }

    resetAllScores() {
        console.log('Reset de tous les scores');
        
        // Remettre tous les scores à zéro
        for (const teamKey in this.currentScores) {
            this.currentScores[teamKey] = 0;
        }
        
        // Mettre à jour tous les champs de saisie
        document.querySelectorAll('.score-field').forEach(field => {
            field.value = 0;
        });
        
        // Envoyer le message de reset au serveur
        this.sendAction({
            type: 'reset_scores'
        });
    }

    resetAllActiveButtons() {
        // Réinitialiser tous les boutons logo et présentation
        Object.values(this.activeButtons).forEach(button => {
            if (button) {
                button.classList.remove('active');
            }
        });
        this.activeButtons = { logo: null, presentation: null };
        
        // Réinitialiser tous les boutons de questions
        document.querySelectorAll('.question-btn.active, .answer-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    switchSection(sectionName) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Mettre à jour le contenu
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
    }

    handleGameControl(button) {
        const action = button.dataset.action;
        const game = button.dataset.game;

        switch (action) {
            case 'show_logo':
                this.toggleLogo(game, button);
                break;
            case 'show_presentation':
                this.togglePresentation(game, button);
                break;
        }
    }

    toggleLogo(game, button) {
        const logoPath = this.gamesData[game]?.assets?.logo;
        if (!logoPath) return;

        if (button.classList.contains('active')) {
            button.classList.remove('active');
            this.activeButtons.logo = null;
            
            this.sendAction({
                type: 'clear_overlay',
                clear_type: 'logo'
            });
        } else {
            if (this.activeButtons.logo && this.activeButtons.logo !== button) {
                this.activeButtons.logo.classList.remove('active');
            }
            
            button.classList.add('active');
            this.activeButtons.logo = button;
            
            this.sendAction({
                type: 'show_asset',
                data: {
                    game: game,
                    asset_type: 'logo',
                    asset_path: logoPath
                }
            });
        }
    }

    togglePresentation(game, button) {
        const presentationPath = this.gamesData[game]?.assets?.presentation;
        if (!presentationPath) return;

        if (button.classList.contains('active')) {
            button.classList.remove('active');
            this.activeButtons.presentation = null;
            
            this.sendAction({
                type: 'clear_overlay',
                clear_type: 'presentation'
            });
        } else {
            if (this.activeButtons.presentation && this.activeButtons.presentation !== button) {
                this.activeButtons.presentation.classList.remove('active');
            }
            
            button.classList.add('active');
            this.activeButtons.presentation = button;
            
            this.sendAction({
                type: 'show_asset',
                data: {
                    game: game,
                    asset_type: 'presentation',
                    asset_path: presentationPath
                }
            });
        }
    }

    clearQuestionAndAnswer() {
        this.sendAction({
            type: 'clear_overlay',
            clear_type: 'question'
        });
        
        setTimeout(() => {
            this.sendAction({
                type: 'clear_overlay',
                clear_type: 'answer'
            });
        }, 100);
    }

    handleKeyboardShortcuts(event) {
        // Ne pas traiter les raccourcis si on est dans un champ de saisie
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Raccourcis pour les jeux (1, 2, 3 pour changer de section)
        if (event.key >= '1' && event.key <= '3') {
            const sections = ['games', 'scores', 'overlay'];
            const sectionIndex = parseInt(event.key) - 1;
            if (sections[sectionIndex]) {
                this.switchSection(sections[sectionIndex]);
            }
        }

        // Raccourci pour effacer tout (Echap)
        if (event.key === 'Escape') {
            this.sendAction({
                type: 'clear_overlay',
                clear_type: 'all'
            });
        }

        // Raccourci pour recharger (Ctrl+R)
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            window.location.reload();
        }
    }
}

// Initialisation
const adminController = new AdminController();
document.addEventListener('DOMContentLoaded', () => {
    adminController.init();
}); 