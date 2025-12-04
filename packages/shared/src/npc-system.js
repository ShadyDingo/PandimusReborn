// NPC system for managing NPCs and their interactions
export class NPCSystem {
    constructor() {
        this.npcs = new Map(); // Store NPC definitions by ID
        this.spawnedNPCs = new Map(); // Store spawned NPCs by location "x,y"
    }

    // Register an NPC definition
    registerNPC(npcData) {
        this.npcs.set(npcData.id, {
            id: npcData.id,
            name: npcData.name,
            type: npcData.type || 'quest_giver', // quest_giver, merchant, trainer, etc.
            dialogue: npcData.dialogue || {},
            quests: npcData.quests || [],
            spawnRules: npcData.spawnRules || { type: 'town' }, // town, world, both
            icon: npcData.icon || 'npc_default'
        });
    }

    // Spawn NPC at location
    spawnNPC(npcId, x, y) {
        const npcDef = this.npcs.get(npcId);
        if (!npcDef) return false;

        const key = `${x},${y}`;
        if (!this.spawnedNPCs.has(key)) {
            this.spawnedNPCs.set(key, []);
        }

        const spawnedNPC = {
            id: npcId,
            name: npcDef.name,
            type: npcDef.type,
            x,
            y,
            dialogue: npcDef.dialogue,
            quests: npcDef.quests,
            icon: npcDef.icon
        };

        this.spawnedNPCs.get(key).push(spawnedNPC);
        return spawnedNPC;
    }

    // Get NPCs at location
    getNPCsAt(x, y) {
        const key = `${x},${y}`;
        return this.spawnedNPCs.get(key) || [];
    }

    // Remove NPC from location
    removeNPC(npcId, x, y) {
        const key = `${x},${y}`;
        const npcs = this.spawnedNPCs.get(key);
        if (!npcs) return false;

        this.spawnedNPCs.set(key, npcs.filter(npc => npc.id !== npcId));
        return true;
    }

    // Spawn random NPCs in world
    spawnRandomNPCs(mapSystem, count = 20) {
        const worldNPCs = Array.from(this.npcs.values())
            .filter(npc => npc.spawnRules.type === 'world' || npc.spawnRules.type === 'both');

        for (let i = 0; i < count && worldNPCs.length > 0; i++) {
            const npcDef = worldNPCs[Math.floor(Math.random() * worldNPCs.length)];
            const x = Math.floor(Math.random() * 1000);
            const y = Math.floor(Math.random() * 1000);
            
            // Don't spawn in towns
            if (!mapSystem.isTown(x, y)) {
                this.spawnNPC(npcDef.id, x, y);
            }
        }
    }

    // Spawn NPCs in towns
    spawnTownNPCs(townSystem) {
        const townNPCs = Array.from(this.npcs.values())
            .filter(npc => npc.spawnRules.type === 'town' || npc.spawnRules.type === 'both');

        townSystem.towns.forEach(town => {
            townNPCs.forEach(npcDef => {
                if (Math.random() < 0.7) { // 70% chance to spawn in each town
                    this.spawnNPC(npcDef.id, town.x, town.y);
                }
            });
        });
    }

    // Get NPC dialogue
    getDialogue(npcId, dialogueKey = 'greeting') {
        const npcDef = this.npcs.get(npcId);
        if (!npcDef || !npcDef.dialogue) return null;

        return npcDef.dialogue[dialogueKey] || npcDef.dialogue['greeting'] || 'Hello, traveler!';
    }

    // Get available quests from NPC
    getAvailableQuests(npcId, completedQuests = []) {
        const npcDef = this.npcs.get(npcId);
        if (!npcDef) return [];

        return npcDef.quests.filter(quest => {
            // Don't show completed quests
            if (completedQuests.includes(quest.id)) return false;
            // Check prerequisites
            if (quest.prerequisite && !completedQuests.includes(quest.prerequisite)) return false;
            return true;
        });
    }
}

export default NPCSystem;

