class AdminController {
    constructor() {
        this.websocket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.gamesData = {};
        this.currentScores = {
            team1: 0,
            team2: 0,
            team3: 0,
            team4: 0,
            team5: 0,
            team6: 0
        };
        
        // État des boutons logo et présentation
        this.activeButtons = {
            logo: null,
            presentation: null
        };
        
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.loadGamesData();
        this.loadInitialScores();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/admin`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket admin connecté');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
        };
        
        this.websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Erreur parsing message admin:', error);
            }
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket admin déconnecté');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.scheduleReconnect();
        };
        
        this.websocket.onerror = (error) => {
            console.error('Erreur WebSocket admin:', error);
            this.isConnected = false;
            this.updateConnectionStatus(false);
        };
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
            
            setTimeout(() => {
                console.log(`Tentative de reconnexion admin ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                this.connectWebSocket();
            }, delay);
        }
    }

    handleMessage(message) {
        const { type, data } = message;
        
        switch (type) {
            case 'asset_displayed':
                console.log('Asset affiché:', data);
                break;
            case 'overlay_cleared':
                console.log('Overlay effacé:', data);
                break;
            default:
                console.log('Message admin non reconnu:', message);
        }
    }

    sendMessage(message) {
        if (this.websocket && this.isConnected) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket non connecté, message non envoyé:', message);
        }
    }

    sendMessageWithDelay(message, delay = 100) {
        setTimeout(() => {
            this.sendMessage(message);
        }, delay);
    }

    updateConnectionStatus(connected) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (connected) {
            statusIndicator.className = 'status-connected';
            statusText.textContent = 'Connecté';
        } else {
            statusIndicator.className = 'status-disconnected';
            statusText.textContent = 'Déconnecté';
        }
    }

    async loadGamesData() {
        try {
            const response = await fetch('/api/games');
            this.gamesData = await response.json();
            
            // Charger les assets pour chaque jeu
            for (const gameKey in this.gamesData) {
                await this.loadGameAssets(gameKey);
            }
        } catch (error) {
            console.error('Erreur chargement données jeux:', error);
        }
    }

    async loadGameAssets(gameKey) {
        try {
            const response = await fetch(`/api/assets/${gameKey}`);
            const assets = await response.json();
            
            // Générer les boutons de questions
            this.generateQuestionButtons(gameKey, assets.questions);
            
            // Stocker les assets pour utilisation ultérieure
            this.gamesData[gameKey].assets = assets;
        } catch (error) {
            console.error(`Erreur chargement assets pour ${gameKey}:`, error);
        }
    }

    generateQuestionButtons(gameKey, questions) {
        const questionsContainer = document.getElementById(`${gameKey}-questions`);
        if (!questionsContainer) return;

        questionsContainer.innerHTML = '';
        
        questions.forEach(question => {
            // Conteneur pour la question et sa réponse
            const questionGroup = document.createElement('div');
            questionGroup.className = 'question-group';
            questionGroup.dataset.game = gameKey;
            questionGroup.dataset.question = question.number;
            
            // Bouton de question
            const questionBtn = document.createElement('button');
            questionBtn.className = 'question-btn';
            questionBtn.textContent = `Q${question.number}`;
            questionBtn.dataset.game = gameKey;
            questionBtn.dataset.question = question.number;
            questionBtn.dataset.questionPath = question.question;
            questionBtn.dataset.answerPath = question.answer;
            
            questionBtn.addEventListener('click', () => {
                this.showQuestion(gameKey, question);
            });
            
            questionGroup.appendChild(questionBtn);
            
            // Bouton de réponse (si disponible)
            if (question.answer) {
                const answerBtn = document.createElement('button');
                answerBtn.className = 'answer-btn';
                answerBtn.textContent = `R${question.number}`;
                answerBtn.dataset.game = gameKey;
                answerBtn.dataset.question = question.number;
                answerBtn.dataset.answerPath = question.answer;
                
                answerBtn.addEventListener('click', () => {
                    this.showAnswer(gameKey, question);
                });
                
                questionGroup.appendChild(answerBtn);
            }
            
            questionsContainer.appendChild(questionGroup);
        });
    }

    showQuestion(gameKey, question) {
        // Réinitialiser tous les boutons de questions actifs
        document.querySelectorAll('.question-btn.active, .answer-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activer le bouton de la question actuelle
        const questionBtn = document.querySelector(`[data-game="${gameKey}"][data-question="${question.number}"] .question-btn`);
        if (questionBtn) {
            questionBtn.classList.add('active');
        }
        
        this.sendMessage({
            type: 'show_asset',
            game: gameKey,
            asset_type: 'question',
            asset_path: question.question
        });
    }

    showAnswer(gameKey, question) {
        // Activer le bouton de réponse
        const answerBtn = document.querySelector(`[data-game="${gameKey}"][data-question="${question.number}"] .answer-btn`);
        if (answerBtn) {
            answerBtn.classList.add('active');
        }
        
        this.sendMessage({
            type: 'show_asset',
            game: gameKey,
            asset_type: 'answer',
            asset_path: question.answer
        });
    }

    updateQuestionButtonState(gameKey, questionNumber, type, active) {
        const questionGroup = document.querySelector(`[data-game="${gameKey}"][data-question="${questionNumber}"]`);
        if (!questionGroup) return;
        
        if (type === 'question') {
            const questionBtn = questionGroup.querySelector('.question-btn');
            if (questionBtn) {
                if (active) {
                    questionBtn.classList.add('active');
                } else {
                    questionBtn.classList.remove('active');
                }
            }
        } else if (type === 'answer') {
            const answerBtn = questionGroup.querySelector('.answer-btn');
            if (answerBtn) {
                if (active) {
                    answerBtn.classList.add('active');
                } else {
                    answerBtn.classList.remove('active');
                }
            }
        }
    }

    loadInitialScores() {
        fetch('/api/scores')
            .then(response => response.json())
            .then(data => {
                this.currentScores = data.teams;
                this.updateScoreFields();
            })
            .catch(error => {
                console.error('Erreur chargement scores initiaux:', error);
            });
    }

    updateScoreFields() {
        Object.keys(this.currentScores).forEach(teamKey => {
            const scoreField = document.querySelector(`[data-team="${teamKey}"] .score-field`);
            if (scoreField) {
                scoreField.value = this.currentScores[teamKey];
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

        // Bouton "Effacer tout" (maintenant dans la section jeux)
        document.getElementById('clear-all').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tous les éléments de l\'overlay ?')) {
                this.sendMessage({
                    type: 'clear_overlay',
                    clear_type: 'all'
                });
                
                // Réinitialiser tous les boutons actifs
                this.resetAllActiveButtons();
            }
        });

        // Bouton "Effacer Question/Réponse"
        document.getElementById('clear-question-answer').addEventListener('click', () => {
            this.clearQuestionAndAnswer();
        });

        // Contrôles des scores
        this.setupScoreControls();

        // Contrôles overlay
        this.setupOverlayControls();

        // Gestion des raccourcis clavier
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
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
            case 'clear_question':
                this.clearQuestion();
                break;
            case 'clear_answer':
                this.clearAnswer();
                break;
        }
    }

    toggleLogo(game, button) {
        const logoPath = this.gamesData[game]?.assets?.logo;
        if (!logoPath) return;

        console.log('toggleLogo appelé:', { game, buttonActive: button.classList.contains('active') });

        // Si le bouton est déjà actif, le désactiver
        if (button.classList.contains('active')) {
            console.log('Désactivation du logo');
            button.classList.remove('active');
            this.activeButtons.logo = null;
            
            // Envoyer message pour effacer seulement le logo
            const clearMessage = {
                type: 'clear_overlay',
                clear_type: 'logo'
            };
            console.log('Envoi message clear:', clearMessage);
            this.sendMessage(clearMessage);
        } else {
            console.log('Activation du logo');
            // Désactiver l'ancien bouton logo s'il existe
            if (this.activeButtons.logo && this.activeButtons.logo !== button) {
                this.activeButtons.logo.classList.remove('active');
            }
            
            // Activer le nouveau bouton
            button.classList.add('active');
            this.activeButtons.logo = button;
            
            // Afficher le logo
            const showMessage = {
                type: 'show_asset',
                game: game,
                asset_type: 'logo',
                asset_path: logoPath
            };
            console.log('Envoi message show:', showMessage);
            this.sendMessage(showMessage);
        }
    }

    togglePresentation(game, button) {
        const presentationPath = this.gamesData[game]?.assets?.presentation;
        if (!presentationPath) return;

        console.log('togglePresentation appelé:', { game, buttonActive: button.classList.contains('active') });

        // Si le bouton est déjà actif, le désactiver
        if (button.classList.contains('active')) {
            console.log('Désactivation de la présentation');
            button.classList.remove('active');
            this.activeButtons.presentation = null;
            
            // Envoyer message pour effacer seulement la présentation
            const clearMessage = {
                type: 'clear_overlay',
                clear_type: 'presentation'
            };
            console.log('Envoi message clear:', clearMessage);
            this.sendMessage(clearMessage);
        } else {
            console.log('Activation de la présentation');
            // Désactiver l'ancien bouton présentation s'il existe
            if (this.activeButtons.presentation && this.activeButtons.presentation !== button) {
                this.activeButtons.presentation.classList.remove('active');
            }
            
            // Activer le nouveau bouton
            button.classList.add('active');
            this.activeButtons.presentation = button;
            
            // Afficher la présentation
            const showMessage = {
                type: 'show_asset',
                game: game,
                asset_type: 'presentation',
                asset_path: presentationPath
            };
            console.log('Envoi message show:', showMessage);
            this.sendMessage(showMessage);
        }
    }

    setupScoreControls() {
        // Bouton de reset des points
        document.getElementById('reset-points').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir remettre tous les scores à zéro ?')) {
                this.resetAllScores();
            }
        });

        // Contrôles des scores d'équipe
        document.querySelectorAll('.score-field').forEach(field => {
            // Gestionnaire pour sélectionner tout le texte au clic
            field.addEventListener('click', (event) => {
                event.target.select();
            });
            
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
        });

        document.querySelectorAll('.score-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const teamCard = event.target.closest('[data-team]');
                const teamKey = teamCard.dataset.team;
                const scoreField = teamCard.querySelector('.score-field');
                const currentScore = parseInt(scoreField.value) || 0;
                const action = event.target.dataset.action;

                let newScore = currentScore;
                if (action === 'increment') {
                    newScore = currentScore + 1;
                } else if (action === 'decrement') {
                    newScore = Math.max(0, currentScore - 1);
                }

                scoreField.value = newScore;
                this.updateTeamScore(teamKey, newScore);
            });
        });
    }

    updateTeamScore(teamKey, score) {
        this.currentScores[teamKey] = score;
        
        this.sendMessage({
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
        this.sendMessage({
            type: 'reset_scores'
        });
        
        console.log('Tous les scores ont été remis à zéro');
    }

    setupOverlayControls() {
        document.getElementById('clear-question').addEventListener('click', () => {
            this.clearQuestion();
        });
        
        document.getElementById('clear-answer').addEventListener('click', () => {
            this.clearAnswer();
        });
    }

    clearQuestion() {
        console.log('Effacement de la question active');
        this.sendMessage({
            type: 'clear_overlay',
            clear_type: 'question'
        });
        
        // Réinitialiser les boutons de questions actifs
        document.querySelectorAll('.question-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    clearAnswer() {
        console.log('Effacement de la réponse active');
        this.sendMessage({
            type: 'clear_overlay',
            clear_type: 'answer'
        });
        
        // Réinitialiser les boutons de réponses actifs
        document.querySelectorAll('.answer-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    clearQuestionAndAnswer() {
        console.log('Effacement de la question et de la réponse actives');
        this.sendMessage({
            type: 'clear_overlay',
            clear_type: 'question'
        });
        
        // Attendre un court délai puis effacer la réponse
        setTimeout(() => {
            this.sendMessage({
                type: 'clear_overlay',
                clear_type: 'answer'
            });
        }, 50);
        
        // Réinitialiser tous les boutons de questions et réponses actifs
        document.querySelectorAll('.question-btn.active, .answer-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
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
            this.sendMessage({
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

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new AdminController();
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    console.log('Fermeture de l\'interface admin');
}); 