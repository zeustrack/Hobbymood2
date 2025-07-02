class OverlayController {
    constructor() {
        this.websocket = null;
        this.activeAssets = {
            logo: null,
            presentation: null,
            question: null,
            answer: null
        };
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.showStatusIndicator();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/overlay`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket connecté');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
        };
        
        this.websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Erreur parsing message:', error);
            }
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket déconnecté');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.scheduleReconnect();
        };
        
        this.websocket.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
            this.isConnected = false;
            this.updateConnectionStatus(false);
        };
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
            
            setTimeout(() => {
                console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                this.connectWebSocket();
            }, delay);
        }
    }

    handleMessage(message) {
        console.log('Message reçu:', message);
        
        if (!message || typeof message !== 'object') {
            console.error('Message invalide reçu:', message);
            return;
        }
        
        const { type, data } = message;
        
        switch (type) {
            case 'overlay_state':
                this.handleOverlayState(data);
                break;
            case 'show_asset':
                // Le message show_asset contient directement asset_path et asset_type
                this.showAsset(message);
                break;
            case 'clear_overlay':
                // Le message clear_overlay contient directement clear_type
                this.clearOverlay(message);
                break;
            default:
                console.log('Message non reconnu:', message);
        }
    }

    handleOverlayState(state) {
        if (state.visible && state.asset_path) {
            this.showAsset(state);
        } else {
            this.clearOverlay();
        }
    }

    showAsset(data) {
        // Extraire les données du message
        let asset_path, asset_type;
        
        // Le message peut être soit directement data, soit contenu dans data.data
        if (data.asset_path && data.asset_type) {
            // Format direct (envoyé par l'admin)
            asset_path = data.asset_path;
            asset_type = data.asset_type;
        } else if (data.data && data.data.asset_path && data.data.asset_type) {
            // Format avec data (legacy)
            asset_path = data.data.asset_path;
            asset_type = data.data.asset_type;
        } else {
            console.error('Format de message invalide:', data);
            return;
        }

        console.log(`Affichage asset: ${asset_type} - ${asset_path}`);

        // Gestion spéciale pour les questions et réponses
        if (asset_type === 'question') {
            // Effacer immédiatement la question précédente et la réponse
            this.clearAssetType('question');
            this.clearAssetType('answer');
            
            // Attendre un court délai avant d'afficher la nouvelle question
            setTimeout(() => {
                this.createAndDisplayAsset(asset_path, asset_type);
            }, 100);
            return;
        } else if (asset_type === 'answer') {
            // Supprimer seulement la réponse précédente sans animation
            this.clearAssetTypeImmediate('answer');
            
            // Afficher la réponse et attendre la fin de l'animation avant de supprimer la question
            const img = this.createAndDisplayAssetImmediate(asset_path, asset_type);

            if (img) {
                img.addEventListener('animationend', () => {
                    this.clearAssetTypeImmediate('question');
                });
            } else {
                // Sécurité : si pas d'image, fallback après 400ms
                setTimeout(() => {
                    this.clearAssetTypeImmediate('question');
                }, 400);
            }
            return;
        } else if (asset_type === 'logo' || asset_type === 'presentation') {
            // Les logos et présentations peuvent coexister avec les questions
            // Effacer seulement le même type d'asset
            this.clearAssetType(asset_type);
            
            // Attendre un court délai avant d'afficher le nouvel asset
            setTimeout(() => {
                this.createAndDisplayAsset(asset_path, asset_type);
            }, 100);
            return;
        }

        // Pour les autres types d'assets, afficher directement
        this.createAndDisplayAsset(asset_path, asset_type);
    }

    createAndDisplayAsset(asset_path, asset_type) {
        // Créer le nouvel asset
        const assetDisplay = document.getElementById('asset-display');
        const img = document.createElement('img');
        
        img.src = asset_path;
        img.alt = `${asset_type} asset`;
        img.className = `asset-image asset-${asset_type} fade-in`;
        img.dataset.assetType = asset_type;
        
        img.onload = () => {
            console.log(`Asset chargé: ${asset_path} (${asset_type})`);
        };
        
        img.onerror = () => {
            console.error(`Erreur chargement asset: ${asset_path}`);
            this.clearAssetType(asset_type);
        };
        
        assetDisplay.appendChild(img);
        this.activeAssets[asset_type] = img;

        // Forcer l'animation fade-in
        img.classList.remove('fade-in');
        requestAnimationFrame(() => {
            img.classList.add('fade-in');
        });

        // Log pour vérifier le nombre de questions dans le DOM
        if (asset_type === 'question') {
            const allQuestions = assetDisplay.querySelectorAll('.asset-question');
            console.log('Questions dans le DOM :', allQuestions.length);
        }
    }

    createAndDisplayAssetImmediate(asset_path, asset_type) {
        // Créer le nouvel asset sans animation
        const assetDisplay = document.getElementById('asset-display');
        const img = document.createElement('img');
        
        img.src = asset_path;
        img.alt = `${asset_type} asset`;
        if (asset_type === 'answer') {
            img.className = `asset-image asset-${asset_type} reveal`;
        } else {
            img.className = `asset-image asset-${asset_type} fade-in`;
        }
        img.dataset.assetType = asset_type;
        
        console.log(`Affichage immédiat: ${asset_type} - ${asset_path}`);
        
        img.onload = () => {
            console.log(`Asset chargé: ${asset_path} (${asset_type})`);
        };
        
        img.onerror = () => {
            console.error(`Erreur chargement asset: ${asset_path}`);
            this.clearAssetTypeImmediate(asset_type);
        };
        
        assetDisplay.appendChild(img);
        this.activeAssets[asset_type] = img;
        return img;
    }

    clearOverlay(data = {}) {
        // Extraire le type de clear du message
        let clear_type = 'all';
        
        console.log('clearOverlay reçoit:', data);
        if (data.data) {
            console.log('Contenu de data.data:', data.data);
        }
        
        // Le message peut être soit directement data, soit contenu dans data.data
        if (data.clear_type) {
            // Format direct (envoyé par l'admin)
            clear_type = data.clear_type;
            console.log('clear_type trouvé directement:', clear_type);
        } else if (data.data && data.data.clear_type) {
            // Format avec data (legacy)
            clear_type = data.data.clear_type;
            console.log('clear_type trouvé dans data.data:', clear_type);
        } else if (data.data && data.data.asset_type) {
            // Format legacy du websocket_manager
            clear_type = data.data.asset_type;
            console.log('asset_type trouvé dans data.data:', clear_type);
        } else {
            console.log('Aucun clear_type trouvé, utilisation de "all"');
        }
        
        console.log(`Effacement overlay: ${clear_type}`);
        
        if (clear_type === 'all') {
            // Effacer tous les assets
            Object.keys(this.activeAssets).forEach(assetType => {
                this.clearAssetType(assetType);
            });
        } else {
            // Effacer seulement le type spécifié
            this.clearAssetType(clear_type);
        }
        
        // Pas besoin d'envoyer de confirmation
        // this.sendMessage({
        //     type: 'overlay_cleared',
        //     data: { clear_type }
        // });
    }

    clearAssetType(assetType) {
        const asset = this.activeAssets[assetType];
        const assetDisplay = document.getElementById('asset-display');
        // Supprimer tous les éléments du DOM pour ce type
        if (assetDisplay) {
            const allAssets = assetDisplay.querySelectorAll(`.asset-${assetType}`);
            allAssets.forEach(el => {
                el.classList.add('fade-out-quick');
                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 150);
            });
            // Log pour vérifier le nombre d'éléments restants
            setTimeout(() => {
                const count = assetDisplay.querySelectorAll(`.asset-${assetType}`).length;
                console.log(`Éléments .asset-${assetType} restants dans le DOM :`, count);
            }, 200);
        }
        this.activeAssets[assetType] = null;
    }

    clearAssetTypeImmediate(assetType) {
        const asset = this.activeAssets[assetType];
        if (asset) {
            console.log(`Suppression immédiate asset: ${assetType}`);
            this.activeAssets[assetType] = null;
            if (assetType === 'question') {
                asset.classList.add('fade-out-quick');
                setTimeout(() => {
                    if (asset.parentNode) asset.parentNode.removeChild(asset);
                }, 150);
                return;
            }
            if (asset && asset.parentNode) {
                asset.parentNode.removeChild(asset);
                console.log(`Asset ${assetType} supprimé immédiatement du DOM`);
            }
        }
        
        // Nettoyer aussi tous les éléments du DOM avec le même assetType
        const assetDisplay = document.getElementById('asset-display');
        if (assetDisplay) {
            const existingAssets = assetDisplay.querySelectorAll(`[data-asset-type="${assetType}"]`);
            existingAssets.forEach(existingAsset => {
                if (existingAsset !== asset) { // Éviter de supprimer l'asset déjà géré
                    console.log(`Suppression immédiate asset ${assetType} orphelin du DOM`);
                    if (existingAsset && existingAsset.parentNode) {
                        existingAsset.parentNode.removeChild(existingAsset);
                    }
                }
            });
        }
    }

    clearCurrentAsset() {
        // Méthode legacy - maintenant on utilise clearAssetType
        if (this.currentAsset) {
            this.currentAsset.classList.remove('fade-in');
            this.currentAsset.classList.add('fade-out');
            
            setTimeout(() => {
                if (this.currentAsset && this.currentAsset.parentNode) {
                    this.currentAsset.parentNode.removeChild(this.currentAsset);
                }
                this.currentAsset = null;
            }, 300);
        }
    }

    sendMessage(message) {
        if (this.websocket && this.isConnected) {
            this.websocket.send(JSON.stringify(message));
        }
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
                console.error('Erreur chargement image:', event.target.src);
            }
        }, true);

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('Page visible - vérification connexion');
                if (!this.isConnected) {
                    this.connectWebSocket();
                }
            }
        });

        // Gestion des raccourcis clavier (pour debug)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'r') {
                event.preventDefault();
                console.log('Rechargement forcé de la page');
                window.location.reload();
            }
        });
    }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new OverlayController();
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    console.log('Fermeture de la page overlay');
}); 