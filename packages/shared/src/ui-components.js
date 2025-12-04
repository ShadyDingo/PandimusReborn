// UI Components for Text-Idle RPG integration
export class IdleRPGUI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentScreen = 'character';
    }

    // Create the main idle RPG interface
    createMainInterface() {
        return `
            <div class="idle-rpg-container">
                <div class="idle-rpg-header">
                    <h1>Text-Idle RPG</h1>
                    <div class="player-info">
                        <span id="player-name">No Character</span>
                        <span id="player-level">Level 1</span>
                        <span id="player-gold">Gold: 100</span>
                    </div>
                </div>
                
                <div class="idle-rpg-nav">
                    <button class="nav-btn active" onclick="idleUI.showScreen('character')">Character</button>
                    <button class="nav-btn" onclick="idleUI.showScreen('skills')">Skills</button>
                    <button class="nav-btn" onclick="idleUI.showScreen('regions')">Regions</button>
                    <button class="nav-btn" onclick="idleUI.showScreen('inventory')">Inventory</button>
                    <button class="nav-btn" onclick="idleUI.showScreen('queue')">Queue</button>
                    <button class="nav-btn" onclick="idleUI.showScreen('diaries')">Diaries</button>
                </div>
                
                <div class="idle-rpg-content">
                    <div id="character-screen" class="screen active">
                        ${this.createCharacterScreen()}
                    </div>
                    <div id="skills-screen" class="screen">
                        ${this.createSkillsScreen()}
                    </div>
                    <div id="regions-screen" class="screen">
                        ${this.createRegionsScreen()}
                    </div>
                    <div id="inventory-screen" class="screen">
                        ${this.createInventoryScreen()}
                    </div>
                    <div id="queue-screen" class="screen">
                        ${this.createQueueScreen()}
                    </div>
                    <div id="diaries-screen" class="screen">
                        ${this.createDiariesScreen()}
                    </div>
                </div>
            </div>
        `;
    }

    // Character screen with new attribute system
    createCharacterScreen() {
        const player = this.gameEngine.getGameState().player;
        if (!player) {
            return `
                <div class="character-creation">
                    <h2>Create Character</h2>
                    <div class="character-form">
                        <input type="text" id="character-name" placeholder="Character Name" value="Adventurer">
                        <select id="character-spec">
                            <option value="warrior">Warrior</option>
                            <option value="rogue">Rogue</option>
                            <option value="mage">Mage</option>
                        </select>
                        <button onclick="idleUI.createCharacter()">Create Character</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="character-display">
                <div class="character-stats">
                    <h3>${player.name} - Level ${player.level}</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <label>Health:</label>
                            <span>${player.hp}/${player.maxHp}</span>
                        </div>
                        <div class="stat-item">
                            <label>Attack Power:</label>
                            <span>${player.ap}</span>
                        </div>
                        <div class="stat-item">
                            <label>Spell Power:</label>
                            <span>${player.sp}</span>
                        </div>
                        <div class="stat-item">
                            <label>Armor:</label>
                            <span>${player.armor}</span>
                        </div>
                    </div>
                </div>
                
                <div class="attributes-section">
                    <h3>Attributes</h3>
                    <div class="attributes-grid">
                        <div class="attribute-item">
                            <label>STR (Strength):</label>
                            <span>${player.attributes.STR}</span>
                            <button onclick="idleUI.modifyAttribute('STR', 1)">+</button>
                            <button onclick="idleUI.modifyAttribute('STR', -1)">-</button>
                        </div>
                        <div class="attribute-item">
                            <label>DEX (Dexterity):</label>
                            <span>${player.attributes.DEX}</span>
                            <button onclick="idleUI.modifyAttribute('DEX', 1)">+</button>
                            <button onclick="idleUI.modifyAttribute('DEX', -1)">-</button>
                        </div>
                        <div class="attribute-item">
                            <label>CON (Constitution):</label>
                            <span>${player.attributes.CON}</span>
                            <button onclick="idleUI.modifyAttribute('CON', 1)">+</button>
                            <button onclick="idleUI.modifyAttribute('CON', -1)">-</button>
                        </div>
                        <div class="attribute-item">
                            <label>INT (Intelligence):</label>
                            <span>${player.attributes.INT}</span>
                            <button onclick="idleUI.modifyAttribute('INT', 1)">+</button>
                            <button onclick="idleUI.modifyAttribute('INT', -1)">-</button>
                        </div>
                        <div class="attribute-item">
                            <label>LCK (Luck):</label>
                            <span>${player.attributes.LCK}</span>
                            <button onclick="idleUI.modifyAttribute('LCK', 1)">+</button>
                            <button onclick="idleUI.modifyAttribute('LCK', -1)">-</button>
                        </div>
                    </div>
                </div>
                
                <div class="combat-stats">
                    <h3>Combat Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <label>Hit Chance:</label>
                            <span>${(player.hit * 100).toFixed(1)}%</span>
                        </div>
                        <div class="stat-item">
                            <label>Dodge:</label>
                            <span>${(player.dodge * 100).toFixed(1)}%</span>
                        </div>
                        <div class="stat-item">
                            <label>Crit Chance:</label>
                            <span>${(player.crit * 100).toFixed(1)}%</span>
                        </div>
                        <div class="stat-item">
                            <label>Parry:</label>
                            <span>${(player.parry * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Skills screen showing all 12 skills
    createSkillsScreen() {
        const skills = this.gameEngine.getGameState().skills;
        const skillData = this.gameEngine.GameData?.skills || {};

        return `
            <div class="skills-display">
                <h2>Skills</h2>
                <div class="skills-grid">
                    ${Object.entries(skills).map(([skillName, skill]) => {
                        const data = skillData[skillName] || { name: skillName, description: '' };
                        const expToNext = this.gameEngine.GameData?.formulas?.xpToNext(skill.level) || 100;
                        const progress = (skill.experience / expToNext) * 100;
                        
                        return `
                            <div class="skill-item">
                                <div class="skill-header">
                                    <h3>${data.name}</h3>
                                    <span class="skill-level">Level ${skill.level}</span>
                                </div>
                                <div class="skill-description">${data.description}</div>
                                <div class="skill-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${progress}%"></div>
                                    </div>
                                    <span class="progress-text">${skill.experience}/${expToNext} XP</span>
                                </div>
                                <div class="skill-mastery">
                                    <h4>Mastery:</h4>
                                    <div class="mastery-list">
                                        ${Object.entries(skill.mastery).map(([node, mastery]) => 
                                            `<span class="mastery-item">${node}: ${mastery}%</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Regions screen with zones and nodes
    createRegionsScreen() {
        const regions = this.gameEngine.GameData?.regions || {};
        const currentRegion = this.gameEngine.getGameState().currentRegion;

        return `
            <div class="regions-display">
                <h2>Regions</h2>
                <div class="regions-grid">
                    ${Object.entries(regions).map(([regionId, region]) => {
                        const isCurrentRegion = currentRegion === regionId;
                        return `
                            <div class="region-item ${isCurrentRegion ? 'current' : ''}">
                                <div class="region-header">
                                    <h3>${region.name}</h3>
                                    <span class="region-tier">${region.tier}</span>
                                </div>
                                <div class="region-description">${region.description}</div>
                                <div class="zones-list">
                                    ${Object.entries(region.zones).map(([zoneId, zone]) => `
                                        <div class="zone-item" onclick="idleUI.showZoneNodes('${regionId}', '${zoneId}')">
                                            <h4>${zone.name}</h4>
                                            <p>${zone.description}</p>
                                            <div class="zone-nodes">
                                                ${Object.entries(zone.nodes).map(([nodeId, node]) => `
                                                    <div class="node-item" onclick="idleUI.startActivity('${nodeId}', '${regionId}', '${zoneId}')">
                                                        <span class="node-skill">${node.skill}</span>
                                                        <span class="node-tier">T${node.tier}</span>
                                                        <span class="node-time">${node.base_time}s</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Inventory screen with equipment slots
    createInventoryScreen() {
        const inventory = this.gameEngine.getGameState().inventory;
        const equipment = this.gameEngine.getGameState().equipment;
        const slots = ['mainhand', 'offhand', 'head', 'chest', 'legs', 'boots', 'trinket'];

        return `
            <div class="inventory-display">
                <h2>Inventory</h2>
                <div class="inventory-layout">
                    <div class="equipment-slots">
                        <h3>Equipment</h3>
                        <div class="equipment-grid">
                            ${slots.map(slot => `
                                <div class="equipment-slot" data-slot="${slot}">
                                    <div class="slot-label">${slot}</div>
                                    <div class="slot-content">
                                        ${equipment[slot] ? `
                                            <div class="equipped-item">
                                                <div class="item-name">${equipment[slot].name}</div>
                                                <div class="item-stats">
                                                    ${Object.entries(equipment[slot].stats || {}).map(([stat, value]) => 
                                                        `<span class="stat">${stat}: +${value}</span>`
                                                    ).join('')}
                                                </div>
                                                <button onclick="idleUI.unequipItem('${slot}')">Unequip</button>
                                            </div>
                                        ` : '<div class="empty-slot">Empty</div>'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="inventory-items">
                        <h3>Items</h3>
                        <div class="items-grid">
                            ${inventory.map(item => `
                                <div class="inventory-item" onclick="idleUI.showItemDetails('${item.id}')">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-rarity">${item.rarity}</div>
                                    <div class="item-stats">
                                        ${Object.entries(item.stats || {}).map(([stat, value]) => 
                                            `<span class="stat">${stat}: +${value}</span>`
                                        ).join('')}
                                    </div>
                                    <div class="item-actions">
                                        <button onclick="idleUI.equipItem('${item.id}')">Equip</button>
                                        <button onclick="idleUI.sellItem('${item.id}')">Sell</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Queue screen showing current activities
    createQueueScreen() {
        const queue = this.gameEngine.getGameState().queue;
        const maxSlots = this.gameEngine.getGameState().maxQueueSlots;

        return `
            <div class="queue-display">
                <h2>Activity Queue</h2>
                <div class="queue-info">
                    <span>Queue Slots: ${queue.length}/${maxSlots}</span>
                    <button onclick="idleUI.expandQueue()" ${queue.length >= maxSlots ? 'disabled' : ''}>
                        Expand Queue (+1 slot)
                    </button>
                </div>
                <div class="queue-list">
                    ${queue.map((activity, index) => {
                        const progress = ((Date.now() - activity.startTime) / activity.duration) * 100;
                        const timeLeft = Math.max(0, activity.duration - (Date.now() - activity.startTime));
                        
                        return `
                            <div class="queue-item">
                                <div class="activity-info">
                                    <h4>${activity.node.skill} - ${activity.nodeId}</h4>
                                    <span class="activity-location">${activity.regionId} > ${activity.zoneId}</span>
                                </div>
                                <div class="activity-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${Math.min(100, progress)}%"></div>
                                    </div>
                                    <span class="time-left">${Math.ceil(timeLeft / 1000)}s remaining</span>
                                </div>
                                <button onclick="idleUI.cancelActivity(${index})">Cancel</button>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${queue.length === 0 ? '<p class="empty-queue">No activities in queue. Start an activity from the Regions screen!</p>' : ''}
            </div>
        `;
    }

    // Diaries screen with bronze/silver/gold tiers
    createDiariesScreen() {
        const diaries = this.gameEngine.getGameState().diaries;

        return `
            <div class="diaries-display">
                <h2>Diaries</h2>
                <div class="diaries-grid">
                    <div class="diary-tier">
                        <h3>Bronze Diaries</h3>
                        <div class="diary-list">
                            <div class="diary-item">
                                <h4>Greencoast Bronze</h4>
                                <div class="diary-tasks">
                                    <div class="task">Catch 10 fish</div>
                                    <div class="task">Cook 5 meals</div>
                                    <div class="task">Defeat Bandit Chief (1)</div>
                                    <div class="task">Discover Hidden Shrine</div>
                                </div>
                                <div class="diary-reward">Reward: Queue +1</div>
                                <button onclick="idleUI.claimDiary('greencoast_bronze')">Claim</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="diary-tier">
                        <h3>Silver Diaries</h3>
                        <div class="diary-list">
                            <div class="diary-item locked">
                                <h4>Greencoast Silver</h4>
                                <div class="diary-tasks">
                                    <div class="task">Mine 60 ore</div>
                                    <div class="task">Craft 1 Iron Tool</div>
                                    <div class="task">Beat Tide Watcher (2)</div>
                                    <div class="task">Foraging Mastery 20 at Forest</div>
                                </div>
                                <div class="diary-reward">Reward: Sea Charm</div>
                                <button disabled>Locked</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="diary-tier">
                        <h3>Gold Diaries</h3>
                        <div class="diary-list">
                            <div class="diary-item locked">
                                <h4>Greencoast Gold</h4>
                                <div class="diary-tasks">
                                    <div class="task">Fishing 40</div>
                                    <div class="task">Smithing 30</div>
                                    <div class="task">Win Tide Watcher (5)</div>
                                </div>
                                <div class="diary-reward">Reward: Greencoast Waygate</div>
                                <button disabled>Locked</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show a specific screen
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const navBtn = document.querySelector(`[onclick*="${screenId}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }
        
        this.currentScreen = screenId;
    }

    // Update the UI with current game state
    updateUI() {
        const gameState = this.gameEngine.getGameState();
        
        // Update player info
        if (gameState.player) {
            const nameEl = document.getElementById('player-name');
            const levelEl = document.getElementById('player-level');
            const goldEl = document.getElementById('player-gold');
            
            if (nameEl) nameEl.textContent = gameState.player.name;
            if (levelEl) levelEl.textContent = `Level ${gameState.player.level}`;
            if (goldEl) goldEl.textContent = `Gold: ${gameState.currency.gold}`;
        }
        
        // Refresh current screen
        this.refreshCurrentScreen();
    }

    // Refresh the current screen content
    refreshCurrentScreen() {
        const screenId = this.currentScreen;
        const screenElement = document.getElementById(`${screenId}-screen`);
        
        if (screenElement) {
            switch (screenId) {
                case 'character':
                    screenElement.innerHTML = this.createCharacterScreen();
                    break;
                case 'skills':
                    screenElement.innerHTML = this.createSkillsScreen();
                    break;
                case 'regions':
                    screenElement.innerHTML = this.createRegionsScreen();
                    break;
                case 'inventory':
                    screenElement.innerHTML = this.createInventoryScreen();
                    break;
                case 'queue':
                    screenElement.innerHTML = this.createQueueScreen();
                    break;
                case 'diaries':
                    screenElement.innerHTML = this.createDiariesScreen();
                    break;
            }
        }
    }
}

export default IdleRPGUI;

