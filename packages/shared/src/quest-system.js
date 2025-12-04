// Quest system for managing quests
export class QuestSystem {
    constructor() {
        this.questTemplates = new Map();
    }

    // Register quest template
    registerQuestTemplate(template) {
        this.questTemplates.set(template.id, template);
    }

    // Generate quest from template
    generateQuest(templateId, npcId) {
        const template = this.questTemplates.get(templateId);
        if (!template) return null;

        const quest = {
            id: `${templateId}_${Date.now()}`,
            templateId,
            npcId,
            name: template.name,
            description: template.description,
            type: template.type, // kill, collect, fetch
            objectives: this.generateObjectives(template),
            rewards: template.rewards,
            status: 'active', // active, completed, failed
            progress: {}
        };

        // Initialize progress
        quest.objectives.forEach(objective => {
            quest.progress[objective.id] = 0;
        });

        return quest;
    }

    // Generate objectives based on template
    generateObjectives(template) {
        const objectives = [];

        switch (template.type) {
            case 'kill':
                const killCount = template.count || Math.floor(Math.random() * 10) + 5;
                objectives.push({
                    id: 'kill_enemy',
                    type: 'kill',
                    target: template.target,
                    required: killCount,
                    current: 0
                });
                break;

            case 'collect':
                const collectCount = template.count || Math.floor(Math.random() * 5) + 3;
                objectives.push({
                    id: 'collect_item',
                    type: 'collect',
                    target: template.target,
                    required: collectCount,
                    current: 0
                });
                break;

            case 'fetch':
                objectives.push({
                    id: 'fetch_item',
                    type: 'fetch',
                    target: template.target,
                    required: 1,
                    current: 0
                });
                break;
        }

        return objectives;
    }

    // Update quest progress
    updateQuestProgress(quest, objectiveId, amount = 1) {
        if (!quest || quest.status !== 'active') return false;

        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return false;

        objective.current = Math.min(objective.required, objective.current + amount);
        quest.progress[objectiveId] = objective.current;

        // Check if quest is complete
        const allComplete = quest.objectives.every(obj => obj.current >= obj.required);
        if (allComplete) {
            quest.status = 'completed';
        }

        return true;
    }

    // Complete quest
    completeQuest(quest, playerState) {
        if (quest.status !== 'completed') {
            return { success: false, message: 'Quest objectives not yet completed' };
        }

        // Give rewards
        if (quest.rewards) {
            if (quest.rewards.gold) {
                playerState.currency.gold += quest.rewards.gold;
            }
            if (quest.rewards.exp) {
                if (playerState.player) {
                    playerState.player.experience += quest.rewards.exp;
                }
            }
            if (quest.rewards.items) {
                quest.rewards.items.forEach(item => {
                    playerState.inventory.push(item);
                });
            }
        }

        quest.status = 'completed';
        return {
            success: true,
            rewards: quest.rewards,
            message: `Quest completed! You received: ${JSON.stringify(quest.rewards)}`
        };
    }

    // Get quest templates by type
    getQuestTemplatesByType(type) {
        return Array.from(this.questTemplates.values())
            .filter(template => template.type === type);
    }

    // Initialize default quest templates
    initializeDefaultQuests() {
        // Kill quests
        this.registerQuestTemplate({
            id: 'kill_bandits',
            name: 'Bandit Menace',
            description: 'Eliminate the bandits terrorizing the area',
            type: 'kill',
            target: 'bandit_cutpurse',
            count: 10,
            rewards: {
                gold: 100,
                exp: 50
            }
        });

        this.registerQuestTemplate({
            id: 'kill_wolves',
            name: 'Wolf Pack',
            description: 'Hunt down the dangerous wolf pack',
            type: 'kill',
            target: 'grey_wolf',
            count: 8,
            rewards: {
                gold: 80,
                exp: 40
            }
        });

        // Collect quests
        this.registerQuestTemplate({
            id: 'collect_herbs',
            name: 'Herb Gathering',
            description: 'Collect medicinal herbs for the apothecary',
            type: 'collect',
            target: 'herb',
            count: 15,
            rewards: {
                gold: 60,
                exp: 30,
                items: [{ id: 'health_potion', name: 'Health Potion', type: 'consumable' }]
            }
        });

        // Fetch quests
        this.registerQuestTemplate({
            id: 'fetch_relic',
            name: 'Ancient Relic',
            description: 'Retrieve the ancient relic from the ruins',
            type: 'fetch',
            target: 'ancient_relic',
            rewards: {
                gold: 200,
                exp: 100,
                items: [{ id: 'relic_charm', name: 'Relic Charm', type: 'trinket', rarity: 'rare' }]
            }
        });
    }
}

export default QuestSystem;

