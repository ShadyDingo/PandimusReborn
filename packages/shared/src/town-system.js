// Town system for managing towns and town services
export class TownSystem {
    constructor() {
        this.towns = new Map(); // Stores town data by town ID
    }

    // Register a town
    registerTown(townData) {
        this.towns.set(townData.id, {
            id: townData.id,
            name: townData.name,
            x: townData.x,
            y: townData.y,
            level: townData.level || 1,
            services: townData.services || this.getDefaultServices(),
            shops: townData.shops || [],
            npcs: townData.npcs || []
        });
    }

    // Get default services for a town
    getDefaultServices() {
        return {
            healing: true,
            repair: true,
            storage: true,
            fastTravel: true
        };
    }

    // Get town by ID
    getTown(townId) {
        return this.towns.get(townId);
    }

    // Get town at coordinates
    getTownAt(x, y) {
        for (const town of this.towns.values()) {
            if (town.x === x && town.y === y) {
                return town;
            }
        }
        return null;
    }

    // Get all discovered towns
    getDiscoveredTowns(discoveredTownIds) {
        return Array.from(this.towns.values())
            .filter(town => discoveredTownIds.includes(town.id))
            .map(town => ({
                id: town.id,
                name: town.name,
                x: town.x,
                y: town.y,
                level: town.level
            }));
    }

    // Check if player can use a service
    canUseService(townId, serviceName) {
        const town = this.getTown(townId);
        if (!town) return false;
        
        return town.services[serviceName] === true;
    }

    // Heal player (restore HP to max)
    healPlayer(player) {
        if (!player) return false;
        player.hp = player.maxHp;
        return true;
    }

    // Repair equipment
    repairEquipment(equipment) {
        if (!equipment) return false;
        
        let repaired = false;
        Object.values(equipment).forEach(item => {
            if (item && item.durability < item.maxDurability) {
                item.durability = item.maxDurability;
                repaired = true;
            }
        });
        
        return repaired;
    }

    // Fast travel to a discovered town
    canFastTravel(townId, discoveredTowns) {
        return discoveredTowns.includes(townId);
    }

    // Get town services list
    getTownServices(townId) {
        const town = this.getTown(townId);
        if (!town) return [];
        
        const services = [];
        if (town.services.healing) services.push('healing');
        if (town.services.repair) services.push('repair');
        if (town.services.storage) services.push('storage');
        if (town.services.fastTravel) services.push('fastTravel');
        
        return services;
    }

    // Get shops in town
    getTownShops(townId) {
        const town = this.getTown(townId);
        return town ? town.shops : [];
    }

    // Get NPCs in town
    getTownNPCs(townId) {
        const town = this.getTown(townId);
        return town ? town.npcs : [];
    }

    // Refine a resource (convert raw to refined)
    refineResource(townId, resourceId, quantity, gameState) {
        // Check if player is in town
        const town = this.getTown(townId);
        if (!town) {
            return { success: false, message: 'Town not found.' };
        }

        // Import GameData to access refinement recipes
        // Note: This will be handled by the caller passing GameData
        return { success: false, message: 'Refinement system not fully implemented yet.' };
    }
}

export default TownSystem;

