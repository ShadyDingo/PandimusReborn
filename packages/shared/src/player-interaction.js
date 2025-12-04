// Player interaction system for multiplayer
export class PlayerInteraction {
    constructor() {
        this.players = new Map(); // Store other players' data by username
        this.playerPresence = new Map(); // Store player positions by username
    }

    // Update player presence
    updatePlayerPresence(username, position, icon, playerData) {
        this.playerPresence.set(username, {
            username,
            x: position.x,
            y: position.y,
            icon: icon || 'default',
            level: playerData?.level || 1,
            lastSeen: Date.now()
        });
    }

    // Remove player presence
    removePlayerPresence(username) {
        this.playerPresence.delete(username);
    }

    // Get players at location
    getPlayersAt(x, y) {
        return Array.from(this.playerPresence.values())
            .filter(player => player.x === x && player.y === y);
    }

    // Get player data for inspection
    getPlayerData(username) {
        return this.players.get(username);
    }

    // Store player data for inspection
    storePlayerData(username, playerData) {
        this.players.set(username, {
            username,
            level: playerData.level || 1,
            attributes: playerData.attributes || {},
            equipment: playerData.equipment || {},
            stats: {
                ap: playerData.ap || 0,
                sp: playerData.sp || 0,
                armor: playerData.armor || 0,
                hp: playerData.hp || 0,
                maxHp: playerData.maxHp || 0
            },
            combatDomains: playerData.combatDomains || {}
        });
    }

    // Get nearby players (within radius)
    getNearbyPlayers(x, y, radius = 5) {
        return Array.from(this.playerPresence.values())
            .filter(player => {
                const distance = Math.sqrt(
                    Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2)
                );
                return distance <= radius;
            });
    }

    // Clean up old player presence (players not seen in a while)
    cleanupOldPresence(maxAge = 60000) { // 1 minute default
        const now = Date.now();
        const toRemove = [];

        this.playerPresence.forEach((player, username) => {
            if (now - player.lastSeen > maxAge) {
                toRemove.push(username);
            }
        });

        toRemove.forEach(username => this.removePlayerPresence(username));
        return toRemove.length;
    }
}

export default PlayerInteraction;

