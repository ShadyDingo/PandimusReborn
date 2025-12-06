// Grid-based map system for 500x500 world
export class MapSystem {
    constructor() {
        this.MAP_SIZE = 1000;
        this.grid = new Map(); // Stores grid square data: key = "x,y", value = square data
    }

    // Get square data at coordinates
    getSquare(x, y) {
        if (!this.isValidCoordinate(x, y)) {
            return null;
        }
        
        const key = `${x},${y}`;
        if (!this.grid.has(key)) {
            // Return default square data if not generated yet
            return {
                x,
                y,
                biome: 'unknown',
                zone: null,
                levelRequirement: 1,
                entities: {
                    enemies: [],
                    npcs: [],
                    players: [],
                    items: []
                },
                isTown: false,
                townId: null
            };
        }
        
        return this.grid.get(key);
    }

    // Set square data at coordinates
    setSquare(x, y, data) {
        if (!this.isValidCoordinate(x, y)) {
            return false;
        }
        
        const key = `${x},${y}`;
        this.grid.set(key, {
            x,
            y,
            ...data
        });
        return true;
    }

    // Check if coordinates are valid (0-999)
    isValidCoordinate(x, y) {
        return x >= 0 && x < this.MAP_SIZE && y >= 0 && y < this.MAP_SIZE;
    }

    // Calculate distance between two points
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Get zone difficulty based on distance from starting town
    calculateZoneDifficulty(x, y, startingTownX = 250, startingTownY = 250) {
        const distance = this.getDistance(x, y, startingTownX, startingTownY);
        // Base difficulty increases with distance
        // Every 50 units of distance = +1 level requirement
        const baseLevel = Math.floor(distance / 50) + 1;
        return Math.max(1, Math.min(100, baseLevel)); // Cap at level 100
    }

    // Validate movement direction
    canMove(x, y, direction) {
        let newX = x;
        let newY = y;

        switch (direction.toLowerCase()) {
            case 'up':
            case 'w':
                newY = y - 1;
                break;
            case 'down':
            case 's':
                newY = y + 1;
                break;
            case 'left':
            case 'a':
                newX = x - 1;
                break;
            case 'right':
            case 'd':
                newX = x + 1;
                break;
            default:
                return { valid: false, x, y };
        }

        if (!this.isValidCoordinate(newX, newY)) {
            return { valid: false, x, y };
        }

        // Check if destination is traversable
        if (!this.isTraversable(newX, newY)) {
            return { valid: false, x, y };
        }

        return { valid: true, x: newX, y: newY };
    }

    // Check if a square is traversable (oceans block movement unless ferry point)
    isTraversable(x, y) {
        const square = this.getSquare(x, y);
        if (!square) return false;
        
        // Oceans are not traversable unless it's a ferry point
        if (square.biome === 'ocean') {
            return square.isFerryPoint === true;
        }
        
        // All other biomes are traversable
        return true;
    }

    // Add entity to a square
    addEntity(x, y, entityType, entity) {
        const square = this.getSquare(x, y);
        if (!square) return false;

        if (!square.entities) {
            square.entities = {
                enemies: [],
                npcs: [],
                players: [],
                items: []
            };
        }

        if (square.entities[entityType]) {
            square.entities[entityType].push(entity);
        }

        this.setSquare(x, y, square);
        return true;
    }

    // Remove entity from a square
    removeEntity(x, y, entityType, entityId) {
        const square = this.getSquare(x, y);
        if (!square || !square.entities || !square.entities[entityType]) {
            return false;
        }

        square.entities[entityType] = square.entities[entityType].filter(
            e => e.id !== entityId
        );

        this.setSquare(x, y, square);
        return true;
    }

    // Get all entities at a square
    getEntities(x, y) {
        const square = this.getSquare(x, y);
        if (!square || !square.entities) {
            return {
                enemies: [],
                npcs: [],
                players: [],
                items: []
            };
        }
        return square.entities;
    }

    // Check if square is a town
    isTown(x, y) {
        const square = this.getSquare(x, y);
        return square ? square.isTown : false;
    }

    // Get town ID at coordinates
    getTownId(x, y) {
        const square = this.getSquare(x, y);
        return square ? square.townId : null;
    }

    // Get level requirement for a square
    getLevelRequirement(x, y) {
        const square = this.getSquare(x, y);
        return square ? square.levelRequirement : 1;
    }

    // Get biome at coordinates
    getBiome(x, y) {
        const square = this.getSquare(x, y);
        return square ? square.biome : 'unknown';
    }

    // Get zone name at coordinates
    getZone(x, y) {
        const square = this.getSquare(x, y);
        return square ? square.zone : null;
    }
}

export default MapSystem;

