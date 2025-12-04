// Fog of war system - tracks explored squares per player
export class FogOfWar {
    constructor() {
        this.exploredSquares = new Set(); // Stores explored coordinates as "x,y" strings
    }

    // Mark a square as explored
    exploreSquare(x, y) {
        const key = `${x},${y}`;
        this.exploredSquares.add(key);
    }

    // Mark multiple squares as explored (for initial town area)
    exploreSquares(squares) {
        squares.forEach(({ x, y }) => {
            this.exploreSquare(x, y);
        });
    }

    // Check if a square is explored
    isExplored(x, y) {
        const key = `${x},${y}`;
        return this.exploredSquares.has(key);
    }

    // Get all explored squares
    getExploredSquares() {
        return Array.from(this.exploredSquares).map(key => {
            const [x, y] = key.split(',').map(Number);
            return { x, y };
        });
    }

    // Get explored squares as Set (for serialization)
    getExploredSet() {
        return new Set(this.exploredSquares);
    }

    // Load explored squares from Set
    loadExploredSquares(exploredSet) {
        if (exploredSet && exploredSet instanceof Set) {
            this.exploredSquares = new Set(exploredSet);
        } else if (Array.isArray(exploredSet)) {
            this.exploredSquares = new Set(exploredSet);
        }
    }

    // Explore area around a point (for initial town exploration)
    exploreArea(centerX, centerY, radius = 3) {
        for (let x = centerX - radius; x <= centerX + radius; x++) {
            for (let y = centerY - radius; y <= centerY + radius; y++) {
                if (x >= 0 && x < 1000 && y >= 0 && y < 1000) {
                    this.exploreSquare(x, y);
                }
            }
        }
    }

    // Get exploration percentage (for statistics)
    getExplorationPercentage() {
        const totalSquares = 1000 * 1000;
        const explored = this.exploredSquares.size;
        return (explored / totalSquares) * 100;
    }

    // Serialize for saving
    serialize() {
        return Array.from(this.exploredSquares);
    }

    // Deserialize from save data
    deserialize(data) {
        if (Array.isArray(data)) {
            this.exploredSquares = new Set(data);
        } else if (data instanceof Set) {
            this.exploredSquares = new Set(data);
        }
    }
}

export default FogOfWar;

