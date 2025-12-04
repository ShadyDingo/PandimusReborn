// Integration layer between existing Pandimus game and new Idle RPG system
import { GameEngine } from './game-engine.js';
import { IdleRPGUI } from './ui-components.js';
import { GameData } from './game-data.js';

export class IdleRPGIntegration {
    constructor() {
        this.gameEngine = new GameEngine();
        this.ui = new IdleRPGUI(this.gameEngine);
        this.isIntegrated = false;
        this.originalGameData = null;
    }

    // Initialize the idle RPG system
    initialize() {
        console.log('Initializing Idle RPG Integration...');
        
        // Store reference to original game data
        this.originalGameData = window.gameData;
        
        // Create the idle RPG interface
        this.createIdleRPGInterface();
        
        // Start the game engine
        this.gameEngine.startGameLoop();
        
        // Set up auto-save
        this.setupAutoSave();
        
        this.isIntegrated = true;
        console.log('Idle RPG Integration initialized successfully');
    }

    // Create the idle RPG interface and inject it into the existing game
    createIdleRPGInterface() {
        // Create a new tab in the existing navigation
        const existingNav = document.querySelector('.nav');
        if (existingNav) {
            const idleRPGTab = document.createElement('button');
            idleRPGTab.textContent = 'Idle RPG';
            idleRPGTab.className = 'nav-btn';
            idleRPGTab.onclick = () => this.showIdleRPGInterface();
            existingNav.appendChild(idleRPGTab);
        }

        // Create the idle RPG screen
        const existingScreens = document.querySelector('.content');
        if (existingScreens) {
            const idleRPGScreen = document.createElement('div');
            idleRPGScreen.id = 'idle-rpg-screen';
            idleRPGScreen.className = 'screen';
            idleRPGScreen.style.display = 'none';
            idleRPGScreen.innerHTML = this.ui.createMainInterface();
            existingScreens.appendChild(idleRPGScreen);
        }

        // Add CSS styles for the idle RPG interface
        this.addIdleRPGStyles();
    }

    // Add CSS styles for the idle RPG interface
    addIdleRPGStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .idle-rpg-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .idle-rpg-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                color: white;
            }

            .idle-rpg-header h1 {
                margin: 0;
                font-size: 2rem;
            }

            .player-info {
                display: flex;
                gap: 20px;
                font-size: 1.1rem;
            }

            .idle-rpg-nav {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .nav-btn {
                padding: 10px 20px;
                background: #4c51bf;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .nav-btn:hover {
                background: #434190;
            }

            .nav-btn.active {
                background: #2d3748;
            }

            .idle-rpg-content {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .screen {
                display: none;
            }

            .screen.active {
                display: block;
            }

            /* Character Screen Styles */
            .character-creation {
                text-align: center;
                padding: 40px;
            }

            .character-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
                max-width: 300px;
                margin: 0 auto;
            }

            .character-form input,
            .character-form select {
                padding: 10px;
                border: 2px solid #e2e8f0;
                border-radius: 5px;
                font-size: 1rem;
            }

            .character-form button {
                padding: 12px;
                background: #48bb78;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
            }

            .character-display {
                display: grid;
                gap: 20px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }

            .stat-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                background: #f7fafc;
                border-radius: 5px;
            }

            .attributes-grid {
                display: grid;
                gap: 10px;
            }

            .attribute-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #f7fafc;
                border-radius: 5px;
            }

            .attribute-item button {
                padding: 5px 10px;
                background: #4c51bf;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }

            /* Skills Screen Styles */
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .skill-item {
                padding: 20px;
                background: #f7fafc;
                border-radius: 10px;
                border-left: 4px solid #4c51bf;
            }

            .skill-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .skill-level {
                background: #4c51bf;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9rem;
            }

            .skill-progress {
                margin: 15px 0;
            }

            .progress-bar {
                width: 100%;
                height: 20px;
                background: #e2e8f0;
                border-radius: 10px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #48bb78, #38a169);
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 0.9rem;
                color: #718096;
                margin-top: 5px;
            }

            .mastery-list {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 10px;
            }

            .mastery-item {
                background: #e2e8f0;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
            }

            /* Regions Screen Styles */
            .regions-grid {
                display: grid;
                gap: 20px;
            }

            .region-item {
                padding: 20px;
                background: #f7fafc;
                border-radius: 10px;
                border: 2px solid transparent;
            }

            .region-item.current {
                border-color: #4c51bf;
                background: #edf2f7;
            }

            .region-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .region-tier {
                background: #48bb78;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9rem;
            }

            .zones-list {
                margin-top: 15px;
            }

            .zone-item {
                padding: 15px;
                background: white;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .zone-item:hover {
                background: #f7fafc;
            }

            .zone-nodes {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }

            .node-item {
                padding: 8px 12px;
                background: #4c51bf;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.2s;
            }

            .node-item:hover {
                background: #434190;
            }

            /* Inventory Screen Styles */
            .inventory-layout {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 20px;
            }

            .equipment-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .equipment-slot {
                padding: 15px;
                background: #f7fafc;
                border-radius: 8px;
                text-align: center;
                min-height: 100px;
            }

            .slot-label {
                font-weight: bold;
                margin-bottom: 10px;
                text-transform: capitalize;
            }

            .equipped-item {
                background: #48bb78;
                color: white;
                padding: 10px;
                border-radius: 5px;
            }

            .empty-slot {
                color: #a0aec0;
                font-style: italic;
            }

            .items-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }

            .inventory-item {
                padding: 15px;
                background: #f7fafc;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .inventory-item:hover {
                background: #edf2f7;
            }

            .item-rarity {
                font-weight: bold;
                margin: 5px 0;
            }

            .item-stats {
                font-size: 0.9rem;
                color: #4a5568;
                margin: 10px 0;
            }

            .item-actions {
                display: flex;
                gap: 5px;
                margin-top: 10px;
            }

            .item-actions button {
                padding: 5px 10px;
                background: #4c51bf;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            /* Queue Screen Styles */
            .queue-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px;
                background: #f7fafc;
                border-radius: 8px;
            }

            .queue-list {
                display: grid;
                gap: 15px;
            }

            .queue-item {
                padding: 20px;
                background: #f7fafc;
                border-radius: 10px;
                border-left: 4px solid #4c51bf;
            }

            .activity-info {
                margin-bottom: 10px;
            }

            .activity-location {
                color: #718096;
                font-size: 0.9rem;
            }

            .activity-progress {
                margin: 15px 0;
            }

            .time-left {
                font-size: 0.9rem;
                color: #4a5568;
                margin-top: 5px;
            }

            .empty-queue {
                text-align: center;
                color: #718096;
                font-style: italic;
                padding: 40px;
            }

            /* Diaries Screen Styles */
            .diaries-grid {
                display: grid;
                gap: 20px;
            }

            .diary-tier {
                padding: 20px;
                background: #f7fafc;
                border-radius: 10px;
            }

            .diary-item {
                padding: 15px;
                background: white;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 4px solid #48bb78;
            }

            .diary-item.locked {
                opacity: 0.6;
                border-left-color: #a0aec0;
            }

            .diary-tasks {
                margin: 10px 0;
            }

            .task {
                padding: 5px 0;
                color: #4a5568;
            }

            .diary-reward {
                font-weight: bold;
                color: #48bb78;
                margin: 10px 0;
            }

            .diary-item button {
                padding: 8px 15px;
                background: #48bb78;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            .diary-item button:disabled {
                background: #a0aec0;
                cursor: not-allowed;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .inventory-layout {
                    grid-template-columns: 1fr;
                }
                
                .equipment-grid {
                    grid-template-columns: 1fr;
                }
                
                .idle-rpg-nav {
                    flex-direction: column;
                }
                
                .nav-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show the idle RPG interface
    showIdleRPGInterface() {
        // Hide all existing screens
        document.querySelectorAll('[id$="-screen"]').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show idle RPG screen
        const idleRPGScreen = document.getElementById('idle-rpg-screen');
        if (idleRPGScreen) {
            idleRPGScreen.style.display = 'block';
        }
        
        // Update navigation
        document.querySelectorAll('.nav button').forEach(btn => {
            btn.style.background = '#4c51bf';
        });
        
        const idleRPGTab = document.querySelector('.nav button:last-child');
        if (idleRPGTab) {
            idleRPGTab.style.background = '#434190';
        }
    }

    // Migrate existing character data to new system
    migrateCharacterData() {
        if (!this.originalGameData || !this.originalGameData.player) {
            return false;
        }

        const oldPlayer = this.originalGameData.player;
        
        // Create new character with migrated data
        const newPlayer = this.gameEngine.createCharacter(oldPlayer.name || 'Adventurer', 'warrior');
        
        // Map old attributes to new system
        newPlayer.attributes.STR = Math.floor(oldPlayer.attributes.Power / 2) || 10;
        newPlayer.attributes.DEX = Math.floor(oldPlayer.attributes.Dexterity / 2) || 10;
        newPlayer.attributes.CON = Math.floor(oldPlayer.attributes.Vitality / 2) || 10;
        newPlayer.attributes.INT = 10; // Default for new system
        newPlayer.attributes.LCK = 10; // Default for new system
        
        // Migrate inventory
        if (this.originalGameData.inventory) {
            this.gameEngine.gameState.inventory = this.originalGameData.inventory.map(item => ({
                ...item,
                rarity: item.rarity || 'common',
                stats: item.stats || {}
            }));
        }
        
        // Migrate currency
        if (this.originalGameData.currency) {
            this.gameEngine.gameState.currency = { ...this.originalGameData.currency };
        }
        
        console.log('Character data migrated successfully');
        return true;
    }

    // Setup auto-save functionality
    setupAutoSave() {
        setInterval(() => {
            this.gameEngine.saveGame();
        }, 30000); // Save every 30 seconds
    }

    // Handle offline progress calculation
    handleOfflineProgress() {
        const lastSave = localStorage.getItem('pandimus_idle_rpg_last_save');
        if (lastSave) {
            const offlineTime = Date.now() - parseInt(lastSave);
            if (offlineTime > 60000) { // More than 1 minute offline
                const progress = this.gameEngine.calculateOfflineProgress(offlineTime);
                this.showOfflineProgress(progress);
            }
        }
        
        // Update last save time
        localStorage.setItem('pandimus_idle_rpg_last_save', Date.now().toString());
    }

    // Show offline progress to player
    showOfflineProgress(progress) {
        const message = `
            Welcome back! You were offline for ${Math.floor(progress.timeProcessed / 60000)} minutes.
            
            Progress made:
            - Activities completed: ${progress.activitiesCompleted}
            - Time processed: ${Math.floor(progress.timeProcessed / 1000)} seconds
            
            Check your inventory and skills for new items and experience!
        `;
        
        alert(message);
    }

    // Get the game engine instance
    getGameEngine() {
        return this.gameEngine;
    }

    // Get the UI instance
    getUI() {
        return this.ui;
    }

    // Check if integration is active
    isActive() {
        return this.isIntegrated;
    }
}

// Global instance for easy access
let idleRPGIntegration = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    idleRPGIntegration = new IdleRPGIntegration();
    
    // Add to global scope for easy access
    window.idleRPGIntegration = idleRPGIntegration;
    window.idleUI = idleRPGIntegration.getUI();
    window.gameEngine = idleRPGIntegration.getGameEngine();
    
    // Handle offline progress on page load
    idleRPGIntegration.handleOfflineProgress();
});

export default IdleRPGIntegration;

