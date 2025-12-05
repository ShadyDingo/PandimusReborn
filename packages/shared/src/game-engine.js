// Core game engine for Text-Idle RPG
import { GameData } from './game-data.js';
import { MapSystem } from './map-system.js';
import { FogOfWar } from './fog-of-war.js';
import { TownSystem } from './town-system.js';
import { MapGenerator } from './map-generator.js';

export class GameEngine {
    constructor() {
        this.mapSystem = new MapSystem();
        this.fogOfWar = new FogOfWar();
        this.townSystem = new TownSystem();
        this.mapGenerator = new MapGenerator();
        
        this.gameState = {
            player: null,
            mapPosition: { x: 500, y: 500 }, // Starting position (starting town)
            lastTown: "starting_town", // Respawn location
            discoveredTowns: ["starting_town"],
            exploredSquares: new Set(), // Fog of war - explored grid coordinates
            activeQuests: [],
            completedQuests: [],
            combatDomains: {
                swordsmanship: { level: 0, abilities: [], passives: [] },
                closeCombat: { level: 0, abilities: [], passives: [] },
                maceFighting: { level: 0, abilities: [], passives: [] },
                fireDominance: { level: 0, abilities: [], passives: [] },
                frostDominance: { level: 0, abilities: [], passives: [] },
                holyWisdom: { level: 0, abilities: [], passives: [] },
                darkKnowledge: { level: 0, abilities: [], passives: [] }
            },
            playerIcon: "default", // Selected character icon
            // Legacy fields (kept for backward compatibility during migration)
            currentRegion: null,
            currentZone: null,
            currentNode: null,
            queue: [],
            maxQueueSlots: 1,
            skills: {},
            inventory: [],
            equipment: {},
            currency: { gold: 100 },
            achievements: {},
            diaries: {},
            quests: {},
            buffs: [],
            debuffs: [],
            fatigue: 0,
            lastUpdate: Date.now(),
            // Travel points system
            dailyTravelPoints: 10,
            maxDailyTravelPoints: 10,
            lastTravelReset: Date.now()
        };
        
        this.isRunning = false;
        this.updateInterval = null;
        this.mapGenerated = false;
    }

    // Initialize new character
    createCharacter(name, spec = 'warrior') {
        // Generate map if not already generated
        if (!this.mapGenerated) {
            this.generateMap();
        }
        
        this.gameState.player = {
            name: name,
            level: 1,
            experience: 0,
            attributes: {
                STR: 10,
                DEX: 10,
                CON: 10,
                INT: 10,
                LCK: 10
            },
            spec: spec,
            specPoints: 0,
            hp: 100,
            maxHp: 100,
            ap: 20, // Attack Power
            sp: 20, // Spell Power
            armor: 0,
            hit: 0.75,
            dodge: 0.10,
            crit: 0.05,
            haste: 0
        };

        // Initialize skills
        Object.keys(GameData.skills).forEach(skill => {
            this.gameState.skills[skill] = {
                level: 1,
                experience: 0,
                mastery: {} // Node-specific mastery
            };
        });

        // Initialize map position at starting town
        this.gameState.mapPosition = { x: 500, y: 500 };
        this.gameState.lastTown = "starting_town";
        this.gameState.discoveredTowns = ["starting_town"];
        
        // Fog of war removed - map is always fully visible

        this.calculateDerivedStats();
        return this.gameState.player;
    }

    // Generate the map (async to prevent UI freezing)
    async generateMap(progressCallback = null) {
        // Check if map is already generated
        if (this.mapGenerated) {
            return { towns: Array.from(this.townSystem.towns.values()), biomeMap: null };
        }
        
        // Use the async version to prevent UI freezing
        const result = await this.mapGenerator.generateMapAsync(this.mapSystem, 500, 500, progressCallback);
        
        // Register all towns
        result.towns.forEach(town => {
            this.townSystem.registerTown(town);
        });
        
        // Save map data to server if available
        if (result.mapData && typeof fetch !== 'undefined') {
            this.saveMapToServer(result.mapData).catch(err => {
                console.warn('Failed to save map to server:', err);
            });
        }
        
        this.mapGenerated = true;
        return result;
    }

    // Save map data to server
    async saveMapToServer(mapData) {
        try {
            const response = await fetch('/api/map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mapData)
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            console.log('Map saved to server successfully');
            return await response.json();
        } catch (error) {
            console.warn('Could not save map to server (server may not be running):', error);
            throw error;
        }
    }

    // Load map data from server
    async loadMapFromServer() {
        try {
            const response = await fetch('/api/map');
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // No map on server yet
                }
                throw new Error(`Server responded with ${response.status}`);
            }
            
            const mapData = await response.json();
            console.log('Map loaded from server');
            return mapData;
        } catch (error) {
            console.warn('Could not load map from server (server may not be running):', error);
            return null;
        }
    }

    // Move player on the map
    movePlayer(direction) {
        // Check and reset daily travel points if needed
        this.checkDailyTravelReset();
        
        const currentPos = this.gameState.mapPosition;
        const moveResult = this.mapSystem.canMove(currentPos.x, currentPos.y, direction);
        
        if (!moveResult.valid) {
            return { success: false, message: 'Cannot move in that direction' };
        }
        
        // Check level requirement
        const levelReq = this.mapSystem.getLevelRequirement(moveResult.x, moveResult.y);
        if (this.gameState.player.level < levelReq) {
            return { 
                success: false, 
                message: `This area requires level ${levelReq}. You are level ${this.gameState.player.level}.` 
            };
        }
        
        // Calculate movement cost
        const movementCost = this.calculateMovementCost(moveResult.x, moveResult.y);
        
        // Ensure travel points are not negative (fix any corruption)
        if (this.gameState.dailyTravelPoints < 0) {
            this.gameState.dailyTravelPoints = 0;
        }
        
        // Check if player has enough travel points
        const roundedTravelPoints = Math.round(this.gameState.dailyTravelPoints);
        const roundedCost = Math.round(movementCost);
        if (roundedTravelPoints < roundedCost) {
            return {
                success: false,
                message: `Not enough travel points! You need ${roundedCost} points but only have ${roundedTravelPoints}. Travel points reset daily.`
            };
        }
        
        // Consume travel points (only if we have enough)
        this.gameState.dailyTravelPoints = Math.round(this.gameState.dailyTravelPoints - movementCost);
        
        // Ensure points never go below 0 (safety check)
        if (this.gameState.dailyTravelPoints < 0) {
            this.gameState.dailyTravelPoints = 0;
        }
        
        // Update position
        this.gameState.mapPosition = { x: moveResult.x, y: moveResult.y };
        
        // Fog of war removed - map is always fully visible
        
        // Check if this is a town
        const town = this.townSystem.getTownAt(moveResult.x, moveResult.y);
        if (town && !this.gameState.discoveredTowns.includes(town.id)) {
            this.gameState.discoveredTowns.push(town.id);
        }
        
        return { 
            success: true, 
            position: this.gameState.mapPosition,
            isTown: !!town,
            town: town,
            travelPointsRemaining: this.gameState.dailyTravelPoints,
            movementCost: movementCost
        };
    }

    // Update explored squares in game state
    updateExploredSquares() {
        this.gameState.exploredSquares = this.fogOfWar.getExploredSet();
    }

    // Get current square data
    getCurrentSquare() {
        const pos = this.gameState.mapPosition;
        return this.mapSystem.getSquare(pos.x, pos.y);
    }

    // Get entities at current location
    getCurrentEntities() {
        const pos = this.gameState.mapPosition;
        return this.mapSystem.getEntities(pos.x, pos.y);
    }

    // Gather resources from current square
    gatherResource(x, y, resourceId, quantity) {
        const square = this.mapSystem.getSquare(x, y);
        if (!square || !square.entities || !square.entities.items) {
            return { success: false, message: 'No resources found at this location.' };
        }
        
        // Find matching resources (by ID or by resourceId)
        const resources = square.entities.items.filter(item => 
            (item.id === resourceId || 
             (item.resourceId && item.resourceId === resourceId) ||
             (item.name && item.name.toLowerCase().replace(/\s+/g, '_') === resourceId)) && 
            (item.type && ['ore', 'wood', 'plant', 'crystal', 'stone'].includes(item.type))
        );
        
        if (resources.length === 0) {
            return { success: false, message: 'Resource not found.' };
        }
        
        if (resources.length < quantity) {
            return { success: false, message: `Only ${resources.length} available, but you requested ${quantity}.` };
        }
        
        // Get resource data for the first one
        const firstResource = resources[0];
        const resourceKey = firstResource.resourceId || firstResource.name.toLowerCase().replace(/\s+/g, '_');
        const resourceData = GameData.resources[resourceKey];
        const resourceName = resourceData ? resourceData.name : firstResource.name;
        
        // Remove resources from square (by matching ID or resourceId)
        let gathered = 0;
        const targetResourceId = firstResource.resourceId || resourceKey;
        
        for (let i = square.entities.items.length - 1; i >= 0 && gathered < quantity; i--) {
            const item = square.entities.items[i];
            const itemMatches = item.id === resourceId || 
                              (item.resourceId && item.resourceId === targetResourceId) ||
                              (item.name && item.name.toLowerCase().replace(/\s+/g, '_') === resourceId);
            
            if (itemMatches && item.type && ['ore', 'wood', 'plant', 'crystal', 'stone'].includes(item.type)) {
                square.entities.items.splice(i, 1);
                gathered++;
            }
        }
        
        // Add to inventory
        for (let i = 0; i < gathered; i++) {
            this.gameState.inventory.push({
                id: `resource_${Date.now()}_${i}`,
                name: resourceName,
                type: 'resource',
                resourceId: targetResourceId,
                rarity: resourceData ? resourceData.rarity : 'common',
                baseValue: resourceData ? resourceData.baseValue : 1,
                quantity: 1
            });
        }
        
        // Update square's last resource respawn time
        square.lastResourceRespawn = Date.now();
        this.mapSystem.setSquare(x, y, square);
        
        return { 
            success: true, 
            resourceName: resourceName,
            quantity: gathered
        };
    }

    // Start combat with an enemy from the map
    startCombatWithEnemy(x, y, enemyId) {
        const square = this.mapSystem.getSquare(x, y);
        if (!square || !square.entities || !square.entities.enemies) {
            return { success: false, message: 'Enemy not found at this location.' };
        }
        
        const enemy = square.entities.enemies.find(e => e.id === enemyId);
        if (!enemy) {
            return { success: false, message: 'Enemy not found.' };
        }
        
        // Store combat context for after-combat handling
        this.currentCombatContext = {
            x: x,
            y: y,
            enemyId: enemyId,
            enemy: enemy
        };
        
        return {
            success: true,
            enemy: enemy,
            player: this.gameState.player
        };
    }

    // Handle combat victory - remove enemy and give rewards
    handleCombatVictory() {
        if (!this.currentCombatContext) return;
        
        const { x, y, enemyId, enemy } = this.currentCombatContext;
        const square = this.mapSystem.getSquare(x, y);
        
        if (square && square.entities && square.entities.enemies) {
            // Remove enemy from square
            square.entities.enemies = square.entities.enemies.filter(e => e.id !== enemyId);
            this.mapSystem.setSquare(x, y, square);
            
            // Give rewards
            const goldReward = enemy.gold ? 
                Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0] + 1)) + enemy.gold[0] :
                10;
            
            this.gameState.currency.gold = (this.gameState.currency.gold || 0) + goldReward;
            
            if (this.gameState.player) {
                this.gameState.player.experience = (this.gameState.player.experience || 0) + (enemy.exp || 10);
            }
            
            this.currentCombatContext = null;
            
            return {
                success: true,
                gold: goldReward,
                exp: enemy.exp || 10
            };
        }
        
        this.currentCombatContext = null;
        return { success: false };
    }

    // Handle combat defeat - respawn enemy, return player to last town
    handleCombatDefeat() {
        if (!this.currentCombatContext) return;
        
        const { x, y, enemy } = this.currentCombatContext;
        
        // Respawn enemy (restore HP)
        const square = this.mapSystem.getSquare(x, y);
        if (square && square.entities && square.entities.enemies) {
            const enemyInSquare = square.entities.enemies.find(e => e.id === this.currentCombatContext.enemyId);
            if (enemyInSquare) {
                enemyInSquare.hp = enemyInSquare.maxHp;
            }
        }
        
        // Return player to last town
        const lastTown = this.townSystem.getTown(this.gameState.lastTown);
        if (lastTown) {
            this.gameState.mapPosition = { x: lastTown.x, y: lastTown.y };
        }
        
        // Restore player HP to max (or partial)
        if (this.gameState.player) {
            this.gameState.player.hp = Math.floor(this.gameState.player.maxHp * 0.5); // 50% HP on defeat
        }
        
        this.currentCombatContext = null;
        
        return { success: true };
    }

    // Calculate max daily travel points based on total skill points
    // Accepts optional skills object (for UI compatibility)
    calculateMaxDailyTravelPoints(skillsOverride = null) {
        // Get total skill points from gameState.skills or provided skills
        let totalSkillPoints = 0;
        const skills = skillsOverride || this.gameState.skills;
        
        if (skills) {
            Object.values(skills).forEach(skill => {
                if (typeof skill === 'number') {
                    totalSkillPoints += skill;
                } else if (skill && typeof skill === 'object' && skill.level) {
                    totalSkillPoints += skill.level;
                }
            });
        }
        
        // Base: 10 points/day, Max (600/600 skills): 50 points/day
        const basePoints = 10;
        const maxPoints = 50;
        const bonusPoints = maxPoints - basePoints; // 40 bonus points
        
        // Linear scaling: basePoints + (totalSkillPoints / 600) * bonusPoints
        const maxDailyPoints = basePoints + (totalSkillPoints / 600) * bonusPoints;
        
        return Math.round(maxDailyPoints); // Round to nearest integer
    }

    // Check and reset daily travel points if needed
    checkDailyTravelReset() {
        const now = Date.now();
        const lastReset = this.gameState.lastTravelReset || now;
        
        // Get midnight of current day
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const todayMidnight = today.getTime();
        
        // Get midnight of last reset day
        const lastResetDate = new Date(lastReset);
        lastResetDate.setHours(0, 0, 0, 0);
        const lastResetMidnight = lastResetDate.getTime();
        
        // If we've crossed into a new day, reset travel points
        if (todayMidnight > lastResetMidnight) {
            const maxPoints = this.calculateMaxDailyTravelPoints();
            this.gameState.maxDailyTravelPoints = Math.round(maxPoints);
            this.gameState.dailyTravelPoints = Math.round(Math.max(0, maxPoints)); // Ensure never negative, round to integer
            this.gameState.lastTravelReset = now;
            return true; // Indicates a reset occurred
        }
        
        // Ensure max points is up to date (skills may have changed)
        const currentMax = this.calculateMaxDailyTravelPoints();
        const roundedCurrentMax = Math.round(currentMax);
        if (this.gameState.maxDailyTravelPoints !== roundedCurrentMax) {
            // If max increased, add the difference to current points
            const difference = roundedCurrentMax - this.gameState.maxDailyTravelPoints;
            this.gameState.maxDailyTravelPoints = roundedCurrentMax;
            // Ensure points never go negative, round to integer
            this.gameState.dailyTravelPoints = Math.round(Math.max(0, Math.min(
                this.gameState.dailyTravelPoints + difference,
                roundedCurrentMax
            )));
        }
        
        // Safety check: ensure points are never negative, round to integer
        if (this.gameState.dailyTravelPoints < 0) {
            this.gameState.dailyTravelPoints = 0;
        } else {
            this.gameState.dailyTravelPoints = Math.round(this.gameState.dailyTravelPoints);
        }
        
        return false;
    }

    // Calculate movement cost for a square
    calculateMovementCost(x, y, startingTownX = 500, startingTownY = 500) {
        const baseCost = 1;
        
        // Distance multiplier: 1 + (distanceFromStart / 1000) * 0.5 (max 1.5x)
        const distance = this.mapSystem.getDistance(x, y, startingTownX, startingTownY);
        const distanceMultiplier = 1 + Math.min((distance / 1000) * 0.5, 0.5);
        
        // Level requirement multiplier: 1 + (levelReq / 100) * 0.3 (max 1.3x)
        const levelReq = this.mapSystem.getLevelRequirement(x, y);
        const levelMultiplier = 1 + Math.min((levelReq / 100) * 0.3, 0.3);
        
        const totalCost = baseCost * distanceMultiplier * levelMultiplier;
        return Math.round(totalCost); // Round to nearest integer
    }

    // Calculate derived stats from attributes
    calculateDerivedStats() {
        const player = this.gameState.player;
        const attrs = player.attributes;

        // Base stats from attributes
        player.ap = 20 + (attrs.STR * 2) + (attrs.DEX * 2);
        player.sp = 20 + (attrs.INT * 2);
        player.maxHp = 100 + (attrs.CON * 6) + (attrs.INT * 1);
        player.hp = Math.min(player.hp, player.maxHp);

        // Combat stats
        player.hit = Math.min(0.95, 0.75 + (attrs.DEX * 0.001));
        player.dodge = Math.min(0.20, attrs.DEX * 0.001);
        player.crit = Math.min(0.25, (attrs.DEX * 0.001) + (attrs.INT * 0.001));
        player.parry = Math.min(0.15, attrs.STR * 0.001);

        // Apply equipment bonuses
        this.applyEquipmentBonuses();
    }

    // Apply equipment stat bonuses
    applyEquipmentBonuses() {
        const player = this.gameState.player;
        const equipment = this.gameState.equipment;

        Object.values(equipment).forEach(item => {
            if (item && item.stats) {
                Object.keys(item.stats).forEach(stat => {
                    if (player[stat] !== undefined) {
                        player[stat] += item.stats[stat];
                    }
                });
            }
        });
    }

    // Start idle activity
    startActivity(nodeId, regionId, zoneId) {
        const region = GameData.regions[regionId];
        if (!region) return false;

        const zone = region.zones[zoneId];
        if (!zone) return false;

        const node = zone.nodes[nodeId];
        if (!node) return false;

        // Check requirements
        if (!this.checkNodeRequirements(node)) return false;

        // Add to queue
        const activity = {
            id: nodeId,
            regionId: regionId,
            zoneId: zoneId,
            node: node,
            startTime: Date.now(),
            duration: this.calculateActivityTime(node),
            completed: false,
            rewards: null
        };

        this.gameState.queue.push(activity);
        this.gameState.currentNode = nodeId;
        this.gameState.currentZone = zoneId;
        this.gameState.currentRegion = regionId;

        return true;
    }

    // Check if player meets node requirements
    checkNodeRequirements(node) {
        const player = this.gameState.player;
        const skillLevel = this.gameState.skills[node.skill]?.level || 1;

        // Check skill level requirement
        if (node.tier > skillLevel) return false;

        // Check equipment requirements
        if (node.requirements && node.requirements !== 'none') {
            // Implement equipment requirement checks
            return true; // Placeholder
        }

        return true;
    }

    // Calculate activity time based on formulas
    calculateActivityTime(node) {
        const baseTime = typeof node.base_time === 'number' ? node.base_time : 30;
        const haste = this.gameState.player.haste;
        const fatigueMod = 1 + (0.15 * this.gameState.fatigue);
        
        return GameData.formulas.actionTime(baseTime, haste, fatigueMod);
    }

    // Process queue activities
    processQueue() {
        const now = Date.now();
        
        this.gameState.queue.forEach(activity => {
            if (!activity.completed && (now - activity.startTime) >= activity.duration) {
                this.completeActivity(activity);
            }
        });

        // Remove completed activities
        this.gameState.queue = this.gameState.queue.filter(activity => !activity.completed);
    }

    // Complete an activity and give rewards
    completeActivity(activity) {
        const node = activity.node;
        const skill = node.skill;
        
        // Calculate rewards
        const rewards = this.calculateRewards(node);
        
        // Apply skill experience
        this.gainSkillExperience(skill, rewards.skillExp);
        
        // Add items to inventory
        if (rewards.items) {
            rewards.items.forEach(item => {
                this.gameState.inventory.push(item);
            });
        }

        // Add currency
        if (rewards.gold) {
            this.gameState.currency.gold += rewards.gold;
        }

        // Update mastery
        this.updateMastery(skill, node.id);

        // Mark as completed
        activity.completed = true;
        activity.rewards = rewards;

        // Reset fatigue on node change
        this.gameState.fatigue = 0;

        return rewards;
    }

    // Calculate rewards for an activity
    calculateRewards(node) {
        const rewards = {
            skillExp: 0,
            items: [],
            gold: 0
        };

        // Base skill experience
        rewards.skillExp = node.tier * 10;

        // Loot table rolls
        if (node.loot_table) {
            const lootTable = node.loot_table;
            
            // Roll for common items
            if (lootTable.common) {
                Object.entries(lootTable.common).forEach(([item, weight]) => {
                    if (Math.random() * 100 < weight) {
                        rewards.items.push(this.createItem(item, 'common'));
                    }
                });
            }

            // Roll for uncommon items
            if (lootTable.uncommon) {
                Object.entries(lootTable.uncommon).forEach(([item, weight]) => {
                    if (Math.random() * 100 < weight) {
                        rewards.items.push(this.createItem(item, 'uncommon'));
                    }
                });
            }

            // Roll for rare items
            if (lootTable.rare) {
                Object.entries(lootTable.rare).forEach(([item, weight]) => {
                    if (Math.random() * 100 < weight) {
                        rewards.items.push(this.createItem(item, 'rare'));
                    }
                });
            }
        }

        // Combat rewards
        if (node.enemies) {
            rewards.gold = Math.floor(Math.random() * 20) + 10;
        }

        return rewards;
    }

    // Create an item with random stats
    createItem(itemName, rarity) {
        return {
            id: `${itemName}_${Date.now()}`,
            name: itemName,
            rarity: rarity,
            tier: 1,
            stats: this.generateItemStats(rarity),
            durability: 100,
            maxDurability: 100
        };
    }

    // Generate random item stats
    generateItemStats(rarity) {
        const stats = {};
        const rarityMultiplier = {
            'common': 1,
            'uncommon': 1.5,
            'rare': 2,
            'epic': 3,
            'legendary': 5
        };

        const multiplier = rarityMultiplier[rarity] || 1;
        
        // Random stat generation
        if (Math.random() < 0.5) {
            stats.ap = Math.floor(Math.random() * 10 * multiplier) + 1;
        }
        if (Math.random() < 0.3) {
            stats.sp = Math.floor(Math.random() * 8 * multiplier) + 1;
        }
        if (Math.random() < 0.4) {
            stats.armor = Math.floor(Math.random() * 15 * multiplier) + 1;
        }

        return stats;
    }

    // Gain skill experience
    gainSkillExperience(skillName, amount) {
        const skill = this.gameState.skills[skillName];
        if (!skill) return;

        skill.experience += amount;
        
        // Check for level up
        const requiredExp = GameData.formulas.xpToNext(skill.level);
        if (skill.experience >= requiredExp) {
            this.levelUpSkill(skillName);
        }
    }

    // Level up a skill
    levelUpSkill(skillName) {
        const skill = this.gameState.skills[skillName];
        skill.level++;
        skill.experience = 0;

        // Check for new unlocks
        const skillData = GameData.skills[skillName];
        if (skillData.unlocks[skill.level]) {
            this.unlockSkillFeatures(skillName, skill.level);
        }

        return skill.level;
    }

    // Unlock new skill features
    unlockSkillFeatures(skillName, level) {
        const unlocks = GameData.skills[skillName].unlocks[level];
        
        if (unlocks.nodes) {
            // Unlock new nodes
            console.log(`Unlocked nodes: ${unlocks.nodes.join(', ')}`);
        }
        
        if (unlocks.recipes) {
            // Unlock new recipes
            console.log(`Unlocked recipes: ${unlocks.recipes.join(', ')}`);
        }
        
        if (unlocks.perk) {
            // Apply perk
            console.log(`Gained perk: ${unlocks.perk}`);
        }
    }

    // Update mastery for a specific node
    updateMastery(skillName, nodeId) {
        const skill = this.gameState.skills[skillName];
        if (!skill.mastery[nodeId]) {
            skill.mastery[nodeId] = 0;
        }
        
        skill.mastery[nodeId] += 1;
        
        // Cap mastery at 100
        if (skill.mastery[nodeId] > 100) {
            skill.mastery[nodeId] = 100;
        }
    }

    // Start the game loop
    startGameLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateInterval = setInterval(() => {
            this.processQueue();
            this.gameState.lastUpdate = Date.now();
        }, 1000); // Update every second
    }

    // Stop the game loop
    stopGameLoop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Get current game state
    getGameState() {
        return { ...this.gameState };
    }

    // Save game state
    saveGame() {
        // Update explored squares before saving
        this.updateExploredSquares();
        
        // Convert Set to Array for JSON serialization
        const gameStateToSave = {
            ...this.gameState,
            exploredSquares: Array.from(this.gameState.exploredSquares)
        };
        
        const saveData = {
            gameState: gameStateToSave,
            timestamp: Date.now()
        };
        
        localStorage.setItem('pandimus_idle_rpg_save', JSON.stringify(saveData));
        return saveData;
    }

    // Load game state
    loadGame() {
        const saveData = localStorage.getItem('pandimus_idle_rpg_save');
        if (!saveData) return false;
        
        try {
            const parsed = JSON.parse(saveData);
            this.gameState = parsed.gameState;
            
            // Restore fog of war
            if (this.gameState.exploredSquares) {
                if (this.gameState.exploredSquares instanceof Set) {
                    this.fogOfWar.loadExploredSquares(this.gameState.exploredSquares);
                } else if (Array.isArray(this.gameState.exploredSquares)) {
                    this.fogOfWar.deserialize(this.gameState.exploredSquares);
                }
            }
            
            // Generate map if not already generated
            if (!this.mapGenerated) {
                this.generateMap();
            }
            
            // Ensure map position exists (migration from old saves)
            if (!this.gameState.mapPosition) {
                this.gameState.mapPosition = { x: 500, y: 500 };
            }
            
            // Ensure discovered towns exists
            if (!this.gameState.discoveredTowns) {
                this.gameState.discoveredTowns = ["starting_town"];
            }
            
            // Ensure last town exists
            if (!this.gameState.lastTown) {
                this.gameState.lastTown = "starting_town";
            }
            
            // Ensure combat domains exist
            if (!this.gameState.combatDomains) {
                this.gameState.combatDomains = {
                    swordsmanship: { level: 0, abilities: [], passives: [] },
                    closeCombat: { level: 0, abilities: [], passives: [] },
                    maceFighting: { level: 0, abilities: [], passives: [] },
                    fireDominance: { level: 0, abilities: [], passives: [] },
                    frostDominance: { level: 0, abilities: [], passives: [] },
                    holyWisdom: { level: 0, abilities: [], passives: [] },
                    darkKnowledge: { level: 0, abilities: [], passives: [] }
                };
            }
            
            // Ensure travel points exist and reset if needed
            if (this.gameState.dailyTravelPoints === undefined) {
                this.gameState.dailyTravelPoints = 10;
            }
            if (this.gameState.maxDailyTravelPoints === undefined) {
                this.gameState.maxDailyTravelPoints = 10;
            }
            if (this.gameState.lastTravelReset === undefined) {
                this.gameState.lastTravelReset = Date.now();
            }
            
            // Safety check: ensure travel points are never negative (fix any corruption)
            if (this.gameState.dailyTravelPoints < 0) {
                this.gameState.dailyTravelPoints = 0;
            }
            if (this.gameState.maxDailyTravelPoints < 0) {
                this.gameState.maxDailyTravelPoints = 10;
            }
            
            // Check and reset daily travel points
            this.checkDailyTravelReset();
            
            this.calculateDerivedStats();
            return true;
        } catch (error) {
            console.error('Failed to load save data:', error);
            return false;
        }
    }

    // Calculate offline progress
    calculateOfflineProgress(offlineTime) {
        const maxOfflineHours = 10;
        const maxOfflineMs = maxOfflineHours * 60 * 60 * 1000;
        const actualOfflineTime = Math.min(offlineTime, maxOfflineMs);
        
        // Process activities that would have completed offline
        const activitiesToProcess = Math.floor(actualOfflineTime / 1000); // Assuming 1 second intervals
        
        for (let i = 0; i < activitiesToProcess; i++) {
            this.processQueue();
        }
        
        return {
            timeProcessed: actualOfflineTime,
            activitiesCompleted: activitiesToProcess
        };
    }

    // Refine resources in a town
    refineResource(townId, resourceId, quantity) {
        // Check if player is in a town
        const pos = this.gameState.mapPosition;
        const town = this.townSystem.getTownAt(pos.x, pos.y);
        
        if (!town || town.id !== townId) {
            return { success: false, message: 'You must be in a town to refine resources.' };
        }

        // Check if resource exists in inventory
        const resources = this.gameState.inventory.filter(item => 
            item.resourceId === resourceId || item.name.toLowerCase().replace(/\s+/g, '_') === resourceId
        );
        
        if (resources.length < quantity) {
            return { success: false, message: `You don't have enough resources. You have ${resources.length}, but need ${quantity}.` };
        }

        // Get refinement recipe - try to find by resourceId first
        let recipe = null;
        
        // Try direct lookup
        if (GameData.refinementRecipes[resourceId]) {
            recipe = GameData.refinementRecipes[resourceId];
        } else {
            // Try to find by raw resource name
            const resourceData = GameData.resources[resourceId];
            if (resourceData && resourceData.refinement) {
                const refinedId = resourceData.refinement;
                recipe = Object.values(GameData.refinementRecipes).find(r => r.refined === refinedId);
            }
            // Try to find by matching raw field
            if (!recipe) {
                recipe = Object.values(GameData.refinementRecipes).find(r => r.raw === resourceId);
            }
        }
        
        if (!recipe) {
            return { success: false, message: 'No refinement recipe found for this resource.' };
        }

        // Remove raw resources from inventory
        let removed = 0;
        for (let i = this.gameState.inventory.length - 1; i >= 0 && removed < quantity; i--) {
            const item = this.gameState.inventory[i];
            const itemKey = item.resourceId || item.name.toLowerCase().replace(/\s+/g, '_');
            if (itemKey === recipe.raw) {
                this.gameState.inventory.splice(i, 1);
                removed++;
            }
        }

        // Add refined resources to inventory
        for (let i = 0; i < removed; i++) {
            this.gameState.inventory.push({
                id: `refined_${Date.now()}_${i}`,
                name: recipe.name,
                type: 'refined',
                resourceId: recipe.refined,
                rarity: 'common',
                baseValue: 1,
                quantity: 1
            });
        }

        return {
            success: true,
            refinedName: recipe.name,
            quantity: removed
        };
    }
}

export default GameEngine;

