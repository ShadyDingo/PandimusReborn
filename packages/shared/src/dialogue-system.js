// Dialogue system for branching conversations
export class DialogueSystem {
    constructor() {
        this.dialogues = new Map();
    }

    // Register a dialogue tree
    registerDialogue(npcId, dialogueTree) {
        this.dialogues.set(npcId, dialogueTree);
    }

    // Get dialogue node
    getDialogueNode(npcId, nodeId = 'start') {
        const dialogueTree = this.dialogues.get(npcId);
        if (!dialogueTree) return null;

        return dialogueTree[nodeId] || dialogueTree['start'] || null;
    }

    // Process dialogue choice
    processChoice(npcId, currentNodeId, choiceIndex) {
        const node = this.getDialogueNode(npcId, currentNodeId);
        if (!node || !node.choices) return null;

        const choice = node.choices[choiceIndex];
        if (!choice) return null;

        return {
            nextNode: choice.nextNode || 'end',
            action: choice.action || null,
            quest: choice.quest || null
        };
    }

    // Create simple dialogue tree
    createSimpleDialogue(greeting, responses = []) {
        return {
            start: {
                text: greeting,
                choices: responses.map((response, index) => ({
                    text: response.text,
                    nextNode: response.nextNode || 'end',
                    action: response.action || null,
                    quest: response.quest || null
                }))
            },
            end: {
                text: 'Goodbye!',
                choices: []
            }
        };
    }
}

export default DialogueSystem;

