// Idle RPG Integration Script for Pandimus Reborn
// Add this script to your existing game to integrate the Text-Idle RPG system

(function() {
    'use strict';

    // Check if integration is already loaded
    if (window.idleRPGLoaded) {
        console.log('Idle RPG Integration already loaded');
        return;
    }

    console.log('Loading Idle RPG Integration...');

    // Game Data Structure
    const IdleRPGData = {
        attributes: {
            STR: { name: "Strength", description: "Increases Attack Power and Parry chance" },
            DEX: { name: "Dexterity", description: "Increases Attack Power, Crit chance, and Dodge" },
            CON: { name: "Constitution", description: "Increases Health Points" },
            INT: { name: "Intelligence", description: "Increases Spell Power, Health, and Crit chance" },
            LCK: { name: "Luck", description: "Increases Rare Find chance and Proc Rate" }
        },

        skills: {
            foraging: { name: "Foraging", level: 1, exp: 0, mastery: {} },
            mining: { name: "Mining", level: 1, exp: 0, mastery: {} },
            fishing: { name: "Fishing", level: 1, exp: 0, mastery: {} },
            woodcutting: { name: "Woodcutting", level: 1, exp: 0, mastery: {} },
            cooking: { name: "Cooking", level: 1, exp: 0, mastery: {} },
            smithing: { name: "Smithing", level: 1, exp: 0, mastery: {} },
            fletching: { name: "Fletching", level: 1, exp: 0, mastery: {} },
            alchemy: { name: "Alchemy", level: 1, exp: 0, mastery: {} },
            carpentry: { name: "Carpentry", level: 1, exp: 0, mastery: {} },
            melee: { name: "Melee Combat", level: 1, exp: 0, mastery: {} },
            archery: { name: "Archery", level: 1, exp: 0, mastery: {} },
            sorcery: { name: "Sorcery", level: 1, exp: 0, mastery: {} }
        },

        regions: {
            greencoast: {
                name: "Greencoast",
                tier: "T1-T2",
                zones: {
                    driftwood_shore: {
                        name: "Driftwood Shore",
                        nodes: {
                            fishing_driftwood: {
                                skill: "fishing",
                                tier: 1,
                                time: 15,
                                loot: { "fish": 80, "pearl": 5 }
                            }
                        }
                    },
                    greencoast_forest: {
                        name: "Greencoast Forest",
                        nodes: {
                            forage_forest: {
                                skill: "foraging",
                                tier: 1,
                                time: 12,
                                loot: { "herbs": 70, "berries": 30 }
                            }
                        }
                    },
                    rusty_mine: {
                        name: "Rusty Mine",
                        nodes: {
                            mine_rusty: {
                                skill: "mining",
                                tier: 1,
                                time: 18,
                                loot: { "copper": 60, "tin": 25, "iron": 15 }
                            }
                        }
                    }
                }
            }
        }
    };

    // Game Engine
    class IdleRPGEngine {
        constructor() {
            this.gameState = {
                player: null,
                queue: [],
                maxQueueSlots: 1,
                inventory: [],
                currency: { gold: 100 },
                currentActivity: null,
                lastUpdate: Date.now()
            };
            this.isRunning = false;
            this.updateInterval = null;
        }

        createCharacter(name, spec = 'warrior') {
            this.gameState.player = {
                name: name,
                level: 1,
                attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, LCK: 10 },
                spec: spec,
                hp: 100,
                maxHp: 100,
                ap: 20,
                sp: 20,
                armor: 0,
                hit: 0.75,
                dodge: 0.10,
                crit: 0.05
            };

            // Initialize skills
            this.gameState.skills = JSON.parse(JSON.stringify(IdleRPGData.skills));
            this.calculateStats();
            return this.gameState.player;
        }

        calculateStats() {
            const player = this.gameState.player;
            const attrs = player.attributes;

            player.ap = 20 + (attrs.STR * 2) + (attrs.DEX * 2);
            player.sp = 20 + (attrs.INT * 2);
            player.maxHp = 100 + (attrs.CON * 6) + (attrs.INT * 1);
            player.hp = Math.min(player.hp, player.maxHp);
            player.hit = Math.min(0.95, 0.75 + (attrs.DEX * 0.001));
            player.dodge = Math.min(0.20, attrs.DEX * 0.001);
            player.crit = Math.min(0.25, (attrs.DEX * 0.001) + (attrs.INT * 0.001));
        }

        startActivity(nodeId, regionId, zoneId) {
            if (this.gameState.queue.length >= this.gameState.maxQueueSlots) {
                return false;
            }

            const region = IdleRPGData.regions[regionId];
            const zone = region?.zones[zoneId];
            const node = zone?.nodes[nodeId];
            
            if (!node) return false;

            const activity = {
                id: nodeId,
                regionId: regionId,
                zoneId: zoneId,
                node: node,
                startTime: Date.now(),
                duration: node.time * 1000,
                completed: false
            };

            this.gameState.queue.push(activity);
            this.gameState.currentActivity = activity;
            return true;
        }

        processQueue() {
            const now = Date.now();
            
            this.gameState.queue.forEach(activity => {
                if (!activity.completed && (now - activity.startTime) >= activity.duration) {
                    this.completeActivity(activity);
                }
            });

            this.gameState.queue = this.gameState.queue.filter(activity => !activity.completed);
        }

        completeActivity(activity) {
            const node = activity.node;
            const skill = node.skill;
            
            // Gain skill experience
            if (this.gameState.skills[skill]) {
                this.gameState.skills[skill].exp += node.tier * 10;
                this.checkSkillLevelUp(skill);
            }

            // Add items to inventory
            Object.entries(node.loot).forEach(([item, chance]) => {
                if (Math.random() * 100 < chance) {
                    this.gameState.inventory.push({
                        id: `${item}_${Date.now()}`,
                        name: item,
                        rarity: 'common',
                        stats: {}
                    });
                }
            });

            // Add gold
            this.gameState.currency.gold += Math.floor(Math.random() * 20) + 10;

            activity.completed = true;
            this.updateUI();
        }

        checkSkillLevelUp(skillName) {
            const skill = this.gameState.skills[skillName];
            const requiredExp = 20 * skill.level * skill.level + 80 * skill.level;
            
            if (skill.exp >= requiredExp) {
                skill.level++;
                skill.exp = 0;
                console.log(`${skillName} leveled up to ${skill.level}!`);
            }
        }

        startGameLoop() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.updateInterval = setInterval(() => {
                this.processQueue();
                this.gameState.lastUpdate = Date.now();
            }, 1000);
        }

        stopGameLoop() {
            if (!this.isRunning) return;
            
            this.isRunning = false;
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }

        updateUI() {
            if (window.idleUI && window.idleUI.updateUI) {
                window.idleUI.updateUI();
            }
        }
    }

    // UI Components
    class IdleRPGUI {
        constructor(engine) {
            this.engine = engine;
            this.currentScreen = 'character';
        }

        createMainInterface() {
            return `
                <div class="idle-rpg-container">
                    <div class="idle-rpg-header">
                        <h1>Text-Idle RPG</h1>
                        <div class="player-info">
                            <span id="idle-player-name">No Character</span>
                            <span id="idle-player-gold">Gold: 100</span>
                        </div>
                    </div>
                    
                    <div class="idle-rpg-nav">
                        <button class="nav-btn active" onclick="idleUI.showScreen('character')">Character</button>
                        <button class="nav-btn" onclick="idleUI.showScreen('skills')">Skills</button>
                        <button class="nav-btn" onclick="idleUI.showScreen('regions')">Regions</button>
                        <button class="nav-btn" onclick="idleUI.showScreen('inventory')">Inventory</button>
                        <button class="nav-btn" onclick="idleUI.showScreen('queue')">Queue</button>
                    </div>
                    
                    <div class="idle-rpg-content">
                        <div id="idle-character-screen" class="screen active">
                            ${this.createCharacterScreen()}
                        </div>
                        <div id="idle-skills-screen" class="screen">
                            ${this.createSkillsScreen()}
                        </div>
                        <div id="idle-regions-screen" class="screen">
                            ${this.createRegionsScreen()}
                        </div>
                        <div id="idle-inventory-screen" class="screen">
                            ${this.createInventoryScreen()}
                        </div>
                        <div id="idle-queue-screen" class="screen">
                            ${this.createQueueScreen()}
                        </div>
                    </div>
                </div>
            `;
        }

        createCharacterScreen() {
            const player = this.engine.gameState.player;
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
                    <h2>${player.name} - Level ${player.level}</h2>
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
                    </div>
                    
                    <div class="attributes-section">
                        <h3>Attributes</h3>
                        <div class="attributes-grid">
                            ${Object.entries(player.attributes).map(([attr, value]) => `
                                <div class="attribute-item">
                                    <label>${attr}:</label>
                                    <span>${value}</span>
                                    <button onclick="idleUI.modifyAttribute('${attr}', 1)">+</button>
                                    <button onclick="idleUI.modifyAttribute('${attr}', -1)">-</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        createSkillsScreen() {
            const skills = this.engine.gameState.skills;
            return `
                <div class="skills-display">
                    <h2>Skills</h2>
                    <div class="skills-grid">
                        ${Object.entries(skills).map(([skillName, skill]) => `
                            <div class="skill-item">
                                <h3>${skill.name}</h3>
                                <span class="skill-level">Level ${skill.level}</span>
                                <div class="skill-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${(skill.exp / (20 * skill.level * skill.level + 80 * skill.level)) * 100}%"></div>
                                    </div>
                                    <span class="progress-text">${skill.exp} XP</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        createRegionsScreen() {
            const regions = IdleRPGData.regions;
            return `
                <div class="regions-display">
                    <h2>Regions</h2>
                    <div class="regions-grid">
                        ${Object.entries(regions).map(([regionId, region]) => `
                            <div class="region-item">
                                <h3>${region.name} (${region.tier})</h3>
                                <div class="zones-list">
                                    ${Object.entries(region.zones).map(([zoneId, zone]) => `
                                        <div class="zone-item">
                                            <h4>${zone.name}</h4>
                                            <div class="zone-nodes">
                                                ${Object.entries(zone.nodes).map(([nodeId, node]) => `
                                                    <div class="node-item" onclick="idleUI.startActivity('${nodeId}', '${regionId}', '${zoneId}')">
                                                        <span class="node-skill">${node.skill}</span>
                                                        <span class="node-time">${node.time}s</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        createInventoryScreen() {
            const inventory = this.engine.gameState.inventory;
            return `
                <div class="inventory-display">
                    <h2>Inventory</h2>
                    <div class="items-grid">
                        ${inventory.map(item => `
                            <div class="inventory-item">
                                <div class="item-name">${item.name}</div>
                                <div class="item-rarity">${item.rarity}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        createQueueScreen() {
            const queue = this.engine.gameState.queue;
            return `
                <div class="queue-display">
                    <h2>Activity Queue</h2>
                    <div class="queue-list">
                        ${queue.map((activity, index) => {
                            const progress = ((Date.now() - activity.startTime) / activity.duration) * 100;
                            const timeLeft = Math.max(0, activity.duration - (Date.now() - activity.startTime));
                            
                            return `
                                <div class="queue-item">
                                    <h4>${activity.node.skill} - ${activity.id}</h4>
                                    <div class="activity-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${Math.min(100, progress)}%"></div>
                                        </div>
                                        <span class="time-left">${Math.ceil(timeLeft / 1000)}s remaining</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            const targetScreen = document.getElementById(`idle-${screenId}-screen`);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const navBtn = document.querySelector(`[onclick*="${screenId}"]`);
            if (navBtn) {
                navBtn.classList.add('active');
            }
            
            this.currentScreen = screenId;
        }

        createCharacter() {
            const name = document.getElementById('character-name').value || 'Adventurer';
            const spec = document.getElementById('character-spec').value;
            
            this.engine.createCharacter(name, spec);
            this.updateUI();
        }

        modifyAttribute(attr, change) {
            const player = this.engine.gameState.player;
            if (player && player.attributes[attr] !== undefined) {
                player.attributes[attr] = Math.max(1, player.attributes[attr] + change);
                this.engine.calculateStats();
                this.updateUI();
            }
        }

        startActivity(nodeId, regionId, zoneId) {
            if (this.engine.startActivity(nodeId, regionId, zoneId)) {
                this.updateUI();
            } else {
                alert('Queue is full!');
            }
        }

        updateUI() {
            const gameState = this.engine.gameState;
            
            if (gameState.player) {
                const nameEl = document.getElementById('idle-player-name');
                const goldEl = document.getElementById('idle-player-gold');
                
                if (nameEl) nameEl.textContent = gameState.player.name;
                if (goldEl) goldEl.textContent = `Gold: ${gameState.currency.gold}`;
            }
            
            this.refreshCurrentScreen();
        }

        refreshCurrentScreen() {
            const screenId = this.currentScreen;
            const screenElement = document.getElementById(`idle-${screenId}-screen`);
            
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
                }
            }
        }
    }

    // Integration
    function initializeIdleRPG() {
        const engine = new IdleRPGEngine();
        const ui = new IdleRPGUI(engine);
        
        // Add to global scope
        window.idleEngine = engine;
        window.idleUI = ui;
        
        // Create interface
        const existingNav = document.querySelector('.nav');
        if (existingNav) {
            const idleRPGTab = document.createElement('button');
            idleRPGTab.textContent = 'Idle RPG';
            idleRPGTab.className = 'nav-btn';
            idleRPGTab.onclick = () => showIdleRPGInterface();
            existingNav.appendChild(idleRPGTab);
        }

        const existingScreens = document.querySelector('.content');
        if (existingScreens) {
            const idleRPGScreen = document.createElement('div');
            idleRPGScreen.id = 'idle-rpg-screen';
            idleRPGScreen.className = 'screen';
            idleRPGScreen.style.display = 'none';
            idleRPGScreen.innerHTML = ui.createMainInterface();
            existingScreens.appendChild(idleRPGScreen);
        }

        // Add styles
        addIdleRPGStyles();
        
        // Start engine
        engine.startGameLoop();
        
        console.log('Idle RPG Integration initialized successfully');
    }

    function showIdleRPGInterface() {
        document.querySelectorAll('[id$="-screen"]').forEach(screen => {
            screen.style.display = 'none';
        });
        
        const idleRPGScreen = document.getElementById('idle-rpg-screen');
        if (idleRPGScreen) {
            idleRPGScreen.style.display = 'block';
        }
        
        document.querySelectorAll('.nav button').forEach(btn => {
            btn.style.background = '#4c51bf';
        });
        
        const idleRPGTab = document.querySelector('.nav button:last-child');
        if (idleRPGTab) {
            idleRPGTab.style.background = '#434190';
        }
    }

    function addIdleRPGStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .idle-rpg-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .idle-rpg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; }
            .idle-rpg-nav { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
            .nav-btn { padding: 10px 20px; background: #4c51bf; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background 0.2s; }
            .nav-btn:hover { background: #434190; }
            .nav-btn.active { background: #2d3748; }
            .idle-rpg-content { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .screen { display: none; }
            .screen.active { display: block; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .stat-item { display: flex; justify-content: space-between; padding: 10px; background: #f7fafc; border-radius: 5px; }
            .attributes-grid { display: grid; gap: 10px; }
            .attribute-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f7fafc; border-radius: 5px; }
            .attribute-item button { padding: 5px 10px; background: #4c51bf; color: white; border: none; border-radius: 3px; cursor: pointer; }
            .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .skill-item { padding: 20px; background: #f7fafc; border-radius: 10px; border-left: 4px solid #4c51bf; }
            .skill-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .skill-level { background: #4c51bf; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem; }
            .progress-bar { width: 100%; height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, #48bb78, #38a169); transition: width 0.3s ease; }
            .regions-grid { display: grid; gap: 20px; }
            .region-item { padding: 20px; background: #f7fafc; border-radius: 10px; }
            .zone-item { padding: 15px; background: white; border-radius: 8px; margin-bottom: 10px; cursor: pointer; }
            .zone-nodes { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
            .node-item { padding: 8px 12px; background: #4c51bf; color: white; border-radius: 5px; cursor: pointer; font-size: 0.9rem; }
            .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
            .inventory-item { padding: 15px; background: #f7fafc; border-radius: 8px; }
            .queue-item { padding: 20px; background: #f7fafc; border-radius: 10px; border-left: 4px solid #4c51bf; margin-bottom: 15px; }
            .activity-progress { margin: 15px 0; }
            .time-left { font-size: 0.9rem; color: #4a5568; margin-top: 5px; }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIdleRPG);
    } else {
        initializeIdleRPG();
    }

    // Mark as loaded
    window.idleRPGLoaded = true;

})();

