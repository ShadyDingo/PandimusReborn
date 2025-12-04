// Combat UI component
export class CombatUI {
    constructor(combatEngine, gameEngine) {
        this.combatEngine = combatEngine;
        this.gameEngine = gameEngine;
        this.uiElement = null;
    }

    // Create combat window HTML
    createCombatWindow() {
        return `
            <div id="combat-window" class="combat-window" style="display: none;">
                <div class="combat-header">
                    <h2>Combat</h2>
                    <button class="close-combat" onclick="combatUI.closeCombat()">×</button>
                </div>
                
                <div class="combat-content">
                    <div class="combat-enemy">
                        <div class="enemy-info">
                            <h3 id="enemy-name">Enemy</h3>
                            <div class="health-bar">
                                <div class="health-fill" id="enemy-health-fill"></div>
                                <span class="health-text" id="enemy-health-text">100/100</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="combat-player">
                        <div class="player-info">
                            <h3 id="player-name">Player</h3>
                            <div class="health-bar">
                                <div class="health-fill" id="player-health-fill"></div>
                                <span class="health-text" id="player-health-text">100/100</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="combat-actions">
                        <div class="action-buttons">
                            <button class="action-btn attack-btn" onclick="combatUI.playerAction('attack')">Attack</button>
                            <button class="action-btn defend-btn" onclick="combatUI.playerAction('defend')">Defend</button>
                            <button class="action-btn ability-btn" onclick="combatUI.showAbilities()">Abilities</button>
                            <button class="action-btn item-btn" onclick="combatUI.showItems()">Items</button>
                        </div>
                        
                        <div id="ability-list" class="ability-list" style="display: none;"></div>
                        <div id="item-list" class="item-list" style="display: none;"></div>
                    </div>
                    
                    <div class="combat-log">
                        <h4>Combat Log</h4>
                        <div id="combat-log-content" class="log-content"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show combat window
    showCombat() {
        const combatWindow = document.getElementById('combat-window');
        if (!combatWindow) {
            // Create combat window if it doesn't exist
            const container = document.querySelector('.game-container') || document.body;
            const combatHTML = this.createCombatWindow();
            container.insertAdjacentHTML('beforeend', combatHTML);
        }
        
        document.getElementById('combat-window').style.display = 'block';
        this.updateCombatDisplay();
    }

    // Close combat window
    closeCombat() {
        const combatWindow = document.getElementById('combat-window');
        if (combatWindow) {
            combatWindow.style.display = 'none';
        }
    }

    // Update combat display
    updateCombatDisplay() {
        const combatState = this.combatEngine.getCombatState();
        if (!combatState) return;

        const player = combatState.player;
        const enemy = combatState.enemy;

        // Update player info
        const playerNameEl = document.getElementById('player-name');
        const playerHealthText = document.getElementById('player-health-text');
        const playerHealthFill = document.getElementById('player-health-fill');
        
        if (playerNameEl) playerNameEl.textContent = player.name;
        if (playerHealthText) {
            playerHealthText.textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
        }
        if (playerHealthFill) {
            const healthPercent = (player.hp / player.maxHp) * 100;
            playerHealthFill.style.width = `${healthPercent}%`;
            playerHealthFill.style.backgroundColor = healthPercent > 50 ? '#4CAF50' : healthPercent > 25 ? '#FF9800' : '#F44336';
        }

        // Update enemy info
        const enemyNameEl = document.getElementById('enemy-name');
        const enemyHealthText = document.getElementById('enemy-health-text');
        const enemyHealthFill = document.getElementById('enemy-health-fill');
        
        if (enemyNameEl) enemyNameEl.textContent = enemy.name;
        if (enemyHealthText) {
            enemyHealthText.textContent = `${Math.ceil(enemy.hp)}/${enemy.maxHp}`;
        }
        if (enemyHealthFill) {
            const healthPercent = (enemy.hp / enemy.maxHp) * 100;
            enemyHealthFill.style.width = `${healthPercent}%`;
            enemyHealthFill.style.backgroundColor = healthPercent > 50 ? '#4CAF50' : healthPercent > 25 ? '#FF9800' : '#F44336';
        }

        // Update combat log
        this.updateCombatLog();

        // Update ability buttons
        this.updateAbilityButtons();
    }

    // Update combat log
    updateCombatLog() {
        const combatState = this.combatEngine.getCombatState();
        if (!combatState) return;

        const logContent = document.getElementById('combat-log-content');
        if (!logContent) return;

        const recentLogs = combatState.log.slice(-10); // Show last 10 messages
        logContent.innerHTML = recentLogs.map(log => 
            `<div class="log-entry">Turn ${log.turn}: ${log.message}</div>`
        ).join('');
        
        logContent.scrollTop = logContent.scrollHeight;
    }

    // Update ability buttons
    updateAbilityButtons() {
        const combatState = this.combatEngine.getCombatState();
        if (!combatState) return;

        const player = combatState.player;
        const abilityList = document.getElementById('ability-list');
        if (!abilityList) return;

        // Get all unlocked abilities from combat domains
        const allAbilities = [];
        Object.entries(player.combatDomains).forEach(([domain, domainData]) => {
            const level = domainData.level || 0;
            const abilities = this.getUnlockedAbilities(domain, level);
            abilities.forEach(ability => {
                const cooldownKey = `${domain}_${ability.name}`;
                const cooldown = player.abilityCooldowns[cooldownKey] || 0;
                allAbilities.push({ ...ability, domain, cooldown });
            });
        });

        if (allAbilities.length === 0) {
            abilityList.innerHTML = '<p>No abilities unlocked yet. Level up your combat domains!</p>';
            return;
        }

        abilityList.innerHTML = allAbilities.map(ability => {
            const disabled = ability.cooldown > 0 || combatState.turn !== 'player';
            return `
                <button 
                    class="ability-btn ${disabled ? 'disabled' : ''}" 
                    onclick="combatUI.playerAction('ability', '${ability.name}')"
                    ${disabled ? 'disabled' : ''}
                >
                    ${ability.name}
                    ${ability.cooldown > 0 ? ` (CD: ${ability.cooldown})` : ''}
                </button>
            `;
        }).join('');
    }

    // Get unlocked abilities (helper method)
    getUnlockedAbilities(domain, level) {
        // This will use the combat-domains module
        // For now, return empty array - will be implemented with proper import
        return [];
    }

    // Player action
    playerAction(action, abilityName = null, itemId = null) {
        if (!this.combatEngine.isInCombat()) {
            return;
        }

        const result = this.combatEngine.playerAction(action, abilityName, itemId);
        
        if (result.victory) {
            this.handleVictory(result);
            return;
        }
        
        if (result.defeat) {
            this.handleDefeat(result);
            return;
        }

        this.updateCombatDisplay();

        // Enemy turn after a short delay
        setTimeout(() => {
            this.combatEngine.enemyTurn();
            this.updateCombatDisplay();
            
            // Check for defeat after enemy turn
            const combatState = this.combatEngine.getCombatState();
            if (!combatState) {
                this.handleDefeat({ defeat: true });
            }
        }, 1000);
    }

    // Handle victory
    handleVictory(result) {
        this.updateCombatDisplay();
        
        setTimeout(() => {
            alert(`Victory! You gained ${result.gold} gold and ${result.exp} experience!`);
            
            // Update game engine with rewards
            if (this.gameEngine) {
                const gameState = this.gameEngine.getGameState();
                gameState.currency.gold += result.gold;
                if (gameState.player) {
                    gameState.player.experience += result.exp;
                    // Check for level up
                    // TODO: Implement level up logic
                }
            }
            
            this.closeCombat();
        }, 500);
    }

    // Handle defeat
    handleDefeat(result) {
        this.updateCombatDisplay();
        
        setTimeout(() => {
            alert('Defeat! You have been returned to the last town you visited.');
            
            // Respawn at last town
            if (this.gameEngine) {
                const gameState = this.gameEngine.getGameState();
                const lastTown = this.gameEngine.townSystem.getTown(gameState.lastTown);
                if (lastTown) {
                    gameState.mapPosition = { x: lastTown.x, y: lastTown.y };
                    // Heal player
                    if (gameState.player) {
                        gameState.player.hp = gameState.player.maxHp;
                    }
                }
            }
            
            this.closeCombat();
        }, 500);
    }

    // Show abilities
    showAbilities() {
        const abilityList = document.getElementById('ability-list');
        const itemList = document.getElementById('item-list');
        
        if (abilityList) abilityList.style.display = abilityList.style.display === 'none' ? 'block' : 'none';
        if (itemList) itemList.style.display = 'none';
    }

    // Show items
    showItems() {
        const abilityList = document.getElementById('ability-list');
        const itemList = document.getElementById('item-list');
        
        if (itemList) itemList.style.display = itemList.style.display === 'none' ? 'block' : 'none';
        if (abilityList) abilityList.style.display = 'none';
    }
}

export default CombatUI;

