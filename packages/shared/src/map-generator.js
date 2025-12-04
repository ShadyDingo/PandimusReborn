// Procedural map generator for 1000x1000 grid with continent generation
import { MapSystem } from './map-system.js';
import { GameData } from './game-data.js';

const MAP_VERSION = '1.0';

export class MapGenerator {
    constructor(seed = null) {
        this.seed = seed || Date.now();
        this.rng = this.seededRandom(this.seed);
        this.biomes = [
            'plains', 'forest', 'desert', 'mountain', 'swamp', 
            'coast', 'volcanic', 'tundra', 'jungle', 'canyon',
            'ocean', 'river', 'lake'
        ];
        
        // Biome compatibility matrix (which biomes can be adjacent)
        this.biomeCompatibility = {
            'plains': ['forest', 'coast', 'swamp', 'desert', 'river'],
            'forest': ['plains', 'mountain', 'swamp', 'jungle', 'river'],
            'desert': ['plains', 'canyon', 'coast', 'mountain'],
            'mountain': ['forest', 'tundra', 'volcanic', 'canyon', 'plains'],
            'swamp': ['plains', 'forest', 'coast', 'river', 'lake'],
            'coast': ['plains', 'forest', 'desert', 'swamp', 'ocean'],
            'volcanic': ['mountain', 'canyon', 'desert'],
            'tundra': ['mountain', 'coast', 'plains'],
            'jungle': ['forest', 'swamp', 'coast'],
            'canyon': ['desert', 'mountain', 'volcanic'],
            'ocean': ['coast'],
            'river': ['plains', 'forest', 'swamp', 'mountain', 'lake', 'coast', 'ocean'],
            'lake': ['plains', 'forest', 'swamp', 'mountain', 'river', 'coast']
        };
    }

    // Seeded random number generator for deterministic generation
    seededRandom(seed) {
        let value = seed;
        return () => {
            value = (value * 9301 + 49297) % 233280;
            return value / 233280;
        };
    }

    // Generate the entire 1000x1000 map
    generateMap(mapSystem, startingTownX = 500, startingTownY = 500) {
        console.log('Generating 1000x1000 continent-shaped map...');
        
        // Generate elevation map
        const elevationMap = this.generateElevationMap();
        
        // Generate continent shape (land vs ocean)
        const continentMap = this.generateContinentShape(elevationMap, startingTownX, startingTownY);
        
        // Generate water features (rivers, lakes)
        const waterFeatures = this.generateWaterFeatures(elevationMap, continentMap, startingTownX, startingTownY);
        
        // Generate biomes with geographic logic
        const biomeMap = this.generateBiomes(elevationMap, continentMap, waterFeatures, startingTownX, startingTownY);
        
        // Generate ferry points for ocean traversal
        const ferryPoints = this.generateFerryPoints(continentMap, startingTownX, startingTownY);
        
        // Place towns
        const towns = this.generateTowns(startingTownX, startingTownY, continentMap);
        
        // Generate zones with difficulty scaling
        for (let x = 0; x < 1000; x++) {
            for (let y = 0; y < 1000; y++) {
                const biome = biomeMap[x][y];
                const levelRequirement = mapSystem.calculateZoneDifficulty(x, y, startingTownX, startingTownY);
                
                // Check if this is a town square
                const town = towns.find(t => t.x === x && t.y === y);
                
                // Check if this is a ferry point
                const isFerryPoint = ferryPoints.some(fp => fp.x === x && fp.y === y);
                
                // Check water features
                const hasRiver = waterFeatures.rivers.some(r => r.x === x && r.y === y);
                const hasLake = waterFeatures.lakes.some(l => l.x === x && l.y === y);
                
                const squareData = {
                    biome,
                    zone: this.getZoneName(biome, levelRequirement),
                    levelRequirement,
                    isTown: !!town,
                    townId: town ? town.id : null,
                    isFerryPoint: isFerryPoint,
                    elevation: elevationMap[x][y],
                    hasRiver: hasRiver,
                    hasLake: hasLake,
                    entities: {
                        enemies: [],
                        npcs: [],
                        players: [],
                        items: []
                    },
                    lastEnemyRespawn: Date.now(),
                    lastResourceRespawn: Date.now()
                };
                
                // Spawn enemies and resources (skip towns and oceans)
                if (!town && biome !== 'ocean') {
                    this.spawnEnemies(mapSystem, x, y, squareData, startingTownX, startingTownY, towns);
                    this.spawnResources(mapSystem, x, y, squareData, startingTownX, startingTownY, towns);
                }
                
                mapSystem.setSquare(x, y, squareData);
            }
        }
        
        console.log(`Map generated with ${towns.length} towns, ${waterFeatures.rivers.length} river segments, ${waterFeatures.lakes.length} lake squares, ${ferryPoints.length} ferry points`);
        
        // Prepare map data for server storage
        const mapData = {
            version: MAP_VERSION,
            seed: this.seed,
            generatedAt: new Date().toISOString(),
            towns: towns,
            rivers: waterFeatures.rivers,
            lakes: waterFeatures.lakes,
            oceans: waterFeatures.oceans,
            ferryPoints: ferryPoints,
            elevation: elevationMap,
            biomeMap: biomeMap
        };
        
        return { towns, biomeMap, mapData };
    }

    // Generate elevation map (0-100 scale)
    generateElevationMap() {
        const elevationMap = [];
        const noiseScale1 = 0.02;
        const noiseScale2 = 0.05;
        const noiseScale3 = 0.1;
        
        for (let x = 0; x < 1000; x++) {
            elevationMap[x] = [];
            for (let y = 0; y < 1000; y++) {
                // Multi-octave noise for realistic elevation
                const noise1 = this.simplexNoise(x * noiseScale1, y * noiseScale1);
                const noise2 = this.simplexNoise(x * noiseScale2, y * noiseScale2) * 0.5;
                const noise3 = this.simplexNoise(x * noiseScale3, y * noiseScale3) * 0.25;
                
                // Distance from center affects elevation (higher in center, lower at edges)
                const distanceFromCenter = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 500, 2));
                const normalizedDistance = distanceFromCenter / 707; // Max distance
                const centerBias = (1 - normalizedDistance) * 20; // 0-20 elevation boost in center
                
                const elevation = (noise1 + noise2 + noise3) * 50 + centerBias;
                elevationMap[x][y] = Math.max(0, Math.min(100, Math.round(elevation)));
            }
        }
        
        return elevationMap;
    }

    // Generate continent shape (true = land, false = ocean)
    generateContinentShape(elevationMap, startingTownX, startingTownY) {
        const continentMap = [];
        const continentNoiseScale = 0.015;
        
        for (let x = 0; x < 1000; x++) {
            continentMap[x] = [];
            for (let y = 0; y < 1000; y++) {
                // Distance from center creates continent shape
                const distanceFromCenter = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 500, 2));
                const normalizedDistance = distanceFromCenter / 707;
                
                // Noise for irregular edges
                const noise = this.simplexNoise(x * continentNoiseScale, y * continentNoiseScale);
                
                // Create continent with irregular edges
                // Main continent: radius ~400, with noise variation
                const continentRadius = 0.6 + (noise - 0.5) * 0.2; // 0.5 to 0.7
                const isMainContinent = normalizedDistance < continentRadius;
                
                // Islands: smaller landmasses scattered around
                const islandNoise = this.simplexNoise(x * 0.03, y * 0.03);
                const islandThreshold = 0.85;
                const isIsland = normalizedDistance > 0.7 && normalizedDistance < 0.95 && islandNoise > islandThreshold;
                
                // Ensure starting town is always on land
                if (x === startingTownX && y === startingTownY) {
                    continentMap[x][y] = true;
                } else {
                    continentMap[x][y] = isMainContinent || isIsland;
                }
            }
        }
        
        return continentMap;
    }

    // Generate water features (rivers, lakes, oceans)
    generateWaterFeatures(elevationMap, continentMap, startingTownX, startingTownY) {
        const rivers = [];
        const lakes = [];
        const oceans = [];
        
        // Mark oceans (non-land areas)
        for (let x = 0; x < 1000; x++) {
            for (let y = 0; y < 1000; y++) {
                if (!continentMap[x][y]) {
                    oceans.push({ x, y });
                }
            }
        }
        
        // Generate rivers (flow from high elevation to low)
        const riverCount = 8 + Math.floor(this.rng() * 5); // 8-12 rivers
        for (let i = 0; i < riverCount; i++) {
            // Find high elevation point on land for river source
            let sourceX, sourceY;
            let attempts = 0;
            do {
                sourceX = Math.floor(this.rng() * 1000);
                sourceY = Math.floor(this.rng() * 1000);
                attempts++;
            } while (attempts < 100 && (!continentMap[sourceX][sourceY] || elevationMap[sourceX][sourceY] < 50));
            
            if (attempts < 100) {
                // Flow river downhill to ocean or lake
                const riverPath = this.generateRiverPath(sourceX, sourceY, elevationMap, continentMap, oceans);
                rivers.push(...riverPath);
            }
        }
        
        // Generate lakes (in depressions on land)
        const lakeCount = 5 + Math.floor(this.rng() * 4); // 5-8 lakes
        for (let i = 0; i < lakeCount; i++) {
            let lakeX, lakeY;
            let attempts = 0;
            do {
                lakeX = Math.floor(this.rng() * 1000);
                lakeY = Math.floor(this.rng() * 1000);
                attempts++;
            } while (attempts < 100 && (!continentMap[lakeX][lakeY] || elevationMap[lakeX][lakeY] > 40));
            
            if (attempts < 100) {
                // Create lake (irregular shape, 3-8 squares)
                const lakeSize = 3 + Math.floor(this.rng() * 6);
                const lakeSquares = this.generateLakeShape(lakeX, lakeY, lakeSize, continentMap);
                lakes.push(...lakeSquares);
            }
        }
        
        return { rivers, lakes, oceans };
    }

    // Generate river path from source to ocean
    generateRiverPath(startX, startY, elevationMap, continentMap, oceans) {
        const path = [];
        let currentX = startX;
        let currentY = startY;
        const visited = new Set();
        const maxLength = 500;
        
        for (let i = 0; i < maxLength; i++) {
            const key = `${currentX},${currentY}`;
            if (visited.has(key)) break;
            visited.add(key);
            
            // Check if we've reached ocean
            if (oceans.some(o => o.x === currentX && o.y === currentY)) {
                path.push({ x: currentX, y: currentY });
                break;
            }
            
            // Only add to path if on land
            if (continentMap[currentX] && continentMap[currentX][currentY]) {
                path.push({ x: currentX, y: currentY });
            }
            
            // Find lowest neighbor (flow downhill)
            const neighbors = [
                { x: currentX, y: currentY - 1 },
                { x: currentX, y: currentY + 1 },
                { x: currentX - 1, y: currentY },
                { x: currentX + 1, y: currentY }
            ];
            
            let lowestNeighbor = null;
            let lowestElevation = elevationMap[currentX][currentY];
            
            for (const neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < 1000 && neighbor.y >= 0 && neighbor.y < 1000) {
                    const elev = elevationMap[neighbor.x][neighbor.y];
                    if (elev < lowestElevation) {
                        lowestElevation = elev;
                        lowestNeighbor = neighbor;
                    }
                }
            }
            
            if (lowestNeighbor) {
                currentX = lowestNeighbor.x;
                currentY = lowestNeighbor.y;
            } else {
                // No downhill path, river ends
                break;
            }
        }
        
        return path;
    }

    // Generate lake shape (irregular)
    generateLakeShape(centerX, centerY, size, continentMap) {
        const lakeSquares = [];
        const visited = new Set();
        const queue = [{ x: centerX, y: centerY }];
        
        while (queue.length > 0 && lakeSquares.length < size) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (continentMap[current.x] && continentMap[current.x][current.y]) {
                lakeSquares.push({ x: current.x, y: current.y });
                
                // Add neighbors with some randomness
                const neighbors = [
                    { x: current.x, y: current.y - 1 },
                    { x: current.x, y: current.y + 1 },
                    { x: current.x - 1, y: current.y },
                    { x: current.x + 1, y: current.y }
                ];
                
                for (const neighbor of neighbors) {
                    if (neighbor.x >= 0 && neighbor.x < 1000 && neighbor.y >= 0 && neighbor.y < 1000) {
                        if (this.rng() > 0.3 && !visited.has(`${neighbor.x},${neighbor.y}`)) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }
        
        return lakeSquares;
    }

    // Generate ferry points for ocean traversal
    generateFerryPoints(continentMap, startingTownX, startingTownY) {
        const ferryPoints = [];
        
        // Find major landmasses (islands)
        const landmasses = this.findLandmasses(continentMap);
        
        // Connect main continent to islands with ferry points
        for (const landmass of landmasses) {
            if (landmass.isMainContinent) continue;
            
            // Find closest point on main continent
            let closestMainContinentPoint = null;
            let minDistance = Infinity;
            
            for (let x = 0; x < 1000; x++) {
                for (let y = 0; y < 1000; y++) {
                    if (continentMap[x][y] && this.isOnMainContinent(x, y, startingTownX, startingTownY)) {
                        const dist = Math.sqrt(Math.pow(landmass.centerX - x, 2) + Math.pow(landmass.centerY - y, 2));
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestMainContinentPoint = { x, y };
                        }
                    }
                }
            }
            
            // Add ferry points on both sides
            if (closestMainContinentPoint && minDistance < 200) {
                ferryPoints.push(closestMainContinentPoint);
                ferryPoints.push({ x: landmass.centerX, y: landmass.centerY });
            }
        }
        
        return ferryPoints;
    }

    // Find separate landmasses
    findLandmasses(continentMap) {
        const visited = new Set();
        const landmasses = [];
        
        for (let x = 0; x < 1000; x++) {
            for (let y = 0; y < 1000; y++) {
                if (continentMap[x][y] && !visited.has(`${x},${y}`)) {
                    const landmass = this.floodFillLandmass(x, y, continentMap, visited);
                    landmass.isMainContinent = this.isOnMainContinent(landmass.centerX, landmass.centerY, 500, 500);
                    landmasses.push(landmass);
                }
            }
        }
        
        return landmasses;
    }

    // Flood fill to find connected landmass
    floodFillLandmass(startX, startY, continentMap, visited) {
        const squares = [];
        const queue = [{ x: startX, y: startY }];
        let sumX = 0, sumY = 0;
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (continentMap[current.x] && continentMap[current.x][current.y]) {
                squares.push(current);
                sumX += current.x;
                sumY += current.y;
                
                const neighbors = [
                    { x: current.x, y: current.y - 1 },
                    { x: current.x, y: current.y + 1 },
                    { x: current.x - 1, y: current.y },
                    { x: current.x + 1, y: current.y }
                ];
                
                for (const neighbor of neighbors) {
                    if (neighbor.x >= 0 && neighbor.x < 1000 && neighbor.y >= 0 && neighbor.y < 1000) {
                        if (continentMap[neighbor.x][neighbor.y] && !visited.has(`${neighbor.x},${neighbor.y}`)) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }
        
        return {
            squares,
            centerX: Math.round(sumX / squares.length),
            centerY: Math.round(sumY / squares.length),
            size: squares.length
        };
    }

    // Check if point is on main continent (near starting town)
    isOnMainContinent(x, y, startingTownX, startingTownY) {
        const distance = Math.sqrt(Math.pow(x - startingTownX, 2) + Math.pow(y - startingTownY, 2));
        return distance < 400;
    }

    // Generate biomes with geographic logic
    generateBiomes(elevationMap, continentMap, waterFeatures, startingTownX, startingTownY) {
        const biomeMap = [];
        const noiseScale = 0.05;
        
        for (let x = 0; x < 1000; x++) {
            biomeMap[x] = [];
            for (let y = 0; y < 1000; y++) {
                // Check if ocean
                if (!continentMap[x][y]) {
                    biomeMap[x][y] = 'ocean';
                    continue;
                }
                
                // Check if river
                if (waterFeatures.rivers.some(r => r.x === x && r.y === y)) {
                    biomeMap[x][y] = 'river';
                    continue;
                }
                
                // Check if lake
                if (waterFeatures.lakes.some(l => l.x === x && l.y === y)) {
                    biomeMap[x][y] = 'lake';
                    continue;
                }
                
                // Get neighboring biomes for compatibility check
                const neighbors = this.getNeighborBiomes(x, y, biomeMap);
                const elevation = elevationMap[x][y];
                const noise = this.simplexNoise(x * noiseScale, y * noiseScale);
                const distanceFromCenter = Math.sqrt(Math.pow(x - startingTownX, 2) + Math.pow(y - startingTownY, 2));
                const normalizedDistance = distanceFromCenter / 707;
                
                // Select biome with geographic logic
                const biome = this.selectBiomeWithLogic(noise, x, y, elevation, normalizedDistance, neighbors);
                biomeMap[x][y] = biome;
            }
        }
        
        // Second pass: add mountain pockets (volcanic, canyon)
        this.addMountainPockets(biomeMap, elevationMap);
        
        return biomeMap;
    }

    // Get neighbor biomes for compatibility checking
    getNeighborBiomes(x, y, biomeMap) {
        const neighbors = [];
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dx, dy] of offsets) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < 1000 && ny >= 0 && ny < 1000 && biomeMap[nx]) {
                if (biomeMap[nx][ny]) {
                    neighbors.push(biomeMap[nx][ny]);
                }
            }
        }
        
        return neighbors;
    }

    // Select biome with geographic logic
    selectBiomeWithLogic(noise, x, y, elevation, normalizedDistance, neighbors) {
        // Edge biomes (coast)
        if (normalizedDistance > 0.9 || this.hasOceanNeighbor(x, y)) {
            return 'coast';
        }
        
        // High elevation = mountains
        if (elevation > 70) {
            // Check compatibility with neighbors
            const compatibleBiomes = ['mountain', 'volcanic', 'canyon', 'tundra'];
            return this.selectCompatibleBiome(compatibleBiomes, neighbors, noise);
        }
        
        // Medium-high elevation
        if (elevation > 50) {
            const compatibleBiomes = ['mountain', 'forest', 'tundra', 'plains'];
            return this.selectCompatibleBiome(compatibleBiomes, neighbors, noise);
        }
        
        // Center area (plains/forest)
        if (normalizedDistance < 0.2) {
            return noise < 0.5 ? 'plains' : 'forest';
        }
        
        // Mid-range (varied)
        if (normalizedDistance < 0.4) {
            if (elevation < 30) {
                // Low elevation = swamp
                return 'swamp';
            }
            const compatibleBiomes = ['plains', 'forest', 'desert', 'swamp'];
            return this.selectCompatibleBiome(compatibleBiomes, neighbors, noise);
        }
        
        // Outer areas (dangerous)
        if (normalizedDistance < 0.6) {
            const compatibleBiomes = ['mountain', 'tundra', 'jungle', 'desert', 'canyon'];
            return this.selectCompatibleBiome(compatibleBiomes, neighbors, noise);
        }
        
        // Extreme outer areas
        if (elevation > 60) {
            return 'mountain';
        }
        if (noise < 0.3) {
            return 'volcanic';
        }
        if (noise < 0.5) {
            return 'canyon';
        }
        if (noise < 0.7) {
            return 'tundra';
        }
        return 'mountain';
    }

    // Check if has ocean neighbor
    hasOceanNeighbor(x, y) {
        // This is a simplified check - in full implementation, would check actual neighbors
        const distanceFromEdge = Math.min(x, 1000 - x, y, 1000 - y);
        return distanceFromEdge < 10;
    }

    // Select compatible biome based on neighbors
    selectCompatibleBiome(candidateBiomes, neighbors, noise) {
        // Score each candidate based on compatibility with neighbors
        const scores = candidateBiomes.map(biome => {
            let score = 1;
            for (const neighbor of neighbors) {
                if (this.areBiomesCompatible(biome, neighbor)) {
                    score += 2;
                } else {
                    score -= 1;
                }
            }
            return { biome, score };
        });
        
        // Sort by score and pick from top candidates
        scores.sort((a, b) => b.score - a.score);
        const topCandidates = scores.filter(s => s.score >= scores[0].score - 1);
        const selected = topCandidates[Math.floor(noise * topCandidates.length)];
        
        return selected ? selected.biome : candidateBiomes[0];
    }

    // Check if two biomes are compatible (can be adjacent)
    areBiomesCompatible(biome1, biome2) {
        if (biome1 === biome2) return true;
        const compat1 = this.biomeCompatibility[biome1] || [];
        return compat1.includes(biome2);
    }

    // Add mountain pockets (volcanic and canyon within mountain regions)
    addMountainPockets(biomeMap, elevationMap) {
        for (let x = 0; x < 1000; x++) {
            for (let y = 0; y < 1000; y++) {
                if (biomeMap[x][y] === 'mountain') {
                    const elevation = elevationMap[x][y];
                    const noise = this.simplexNoise(x * 0.1, y * 0.1);
                    
                    // Volcanic pockets (5-10% of mountain area)
                    if (elevation > 80 && noise < 0.08) {
                        biomeMap[x][y] = 'volcanic';
                    }
                    // Canyon pockets (3-5% of mountain area)
                    else if (elevation > 70 && elevation < 85 && noise > 0.92 && noise < 0.97) {
                        biomeMap[x][y] = 'canyon';
                    }
                }
                
                // Tundra with mountain sub-biomes
                if (biomeMap[x][y] === 'tundra' && elevationMap[x][y] > 75) {
                    const noise = this.simplexNoise(x * 0.08, y * 0.08);
                    if (noise < 0.15) {
                        biomeMap[x][y] = 'mountain';
                    }
                }
            }
        }
    }

    // Simplified noise function
    simplexNoise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n));
    }

    // Get zone name based on biome and level
    getZoneName(biome, level) {
        const biomeNames = {
            'plains': 'Plains',
            'forest': 'Forest',
            'desert': 'Desert',
            'mountain': 'Mountains',
            'swamp': 'Swamp',
            'coast': 'Coast',
            'volcanic': 'Volcanic Wastes',
            'tundra': 'Tundra',
            'jungle': 'Jungle',
            'canyon': 'Canyon',
            'ocean': 'Ocean',
            'river': 'River',
            'lake': 'Lake'
        };
        
        const baseName = biomeNames[biome] || 'Unknown';
        
        if (level >= 80) {
            return `${baseName} (Level ${level}+)`;
        } else if (level >= 50) {
            return `${baseName} (Level ${level}+)`;
        } else if (level >= 20) {
            return `${baseName} (Level ${level}+)`;
        }
        
        return baseName;
    }

    // Generate towns across the map (only on land)
    generateTowns(startingTownX, startingTownY, continentMap) {
        const towns = [];
        
        // Starting town
        towns.push({
            id: 'starting_town',
            name: 'Newhaven',
            x: startingTownX,
            y: startingTownY,
            level: 1
        });
        
        // Generate additional towns (only on land)
        const townCount = 15;
        const minDistance = 100;
        
        for (let i = 1; i < townCount; i++) {
            let attempts = 0;
            let townX, townY;
            
            do {
                townX = Math.floor(this.rng() * 1000);
                townY = Math.floor(this.rng() * 1000);
                attempts++;
            } while (
                attempts < 200 && 
                (!continentMap[townX] || !continentMap[townX][townY] ||
                 towns.some(t => 
                     Math.sqrt(Math.pow(townX - t.x, 2) + Math.pow(townY - t.y, 2)) < minDistance
                 ))
            );
            
            if (attempts < 200) {
                const level = Math.floor(
                    Math.sqrt(Math.pow(townX - startingTownX, 2) + Math.pow(townY - startingTownY, 2)) / 50
                ) + 1;
                
                towns.push({
                    id: `town_${i}`,
                    name: this.generateTownName(),
                    x: townX,
                    y: townY,
                    level: Math.max(1, Math.min(100, level))
                });
            }
        }
        
        return towns;
    }

    // Generate random town name
    generateTownName() {
        const prefixes = ['North', 'South', 'East', 'West', 'Old', 'New', 'Great', 'Little'];
        const suffixes = ['port', 'haven', 'burg', 'ville', 'ford', 'bridge', 'keep', 'hall'];
        
        const prefix = prefixes[Math.floor(this.rng() * prefixes.length)];
        const suffix = suffixes[Math.floor(this.rng() * suffixes.length)];
        
        return `${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`;
    }

    // Spawn enemies in a square based on biome and location
    spawnEnemies(mapSystem, x, y, squareData, startingTownX, startingTownY, towns) {
        const biomeData = GameData.map.biomes[squareData.biome];
        if (!biomeData || !biomeData.enemy) return;
        
        const enemyId = biomeData.enemy;
        const enemyData = GameData.enemies[enemyId];
        if (!enemyData) return;
        
        const distanceFromStart = mapSystem.getDistance(x, y, startingTownX, startingTownY);
        const distanceFactor = Math.min(distanceFromStart / 1000, 1);
        const difficultyFactor = squareData.levelRequirement / 100;
        
        const baseChance = biomeData.spawnChance || 0.5;
        const spawnChance = baseChance * (1 - distanceFactor * 0.4) * (1 - difficultyFactor * 0.3);
        
        const maxEnemies = 25;
        let enemyCount = 0;
        
        for (let i = 0; i < maxEnemies; i++) {
            if (this.rng() < spawnChance) {
                enemyCount++;
            }
        }
        
        for (let i = 0; i < enemyCount; i++) {
            const enemy = {
                id: `${enemyId}_${x}_${y}_${i}_${Date.now()}`,
                enemyId: enemyId,
                name: enemyData.name,
                level: enemyData.level,
                hp: enemyData.hp || enemyData.maxHp,
                maxHp: enemyData.maxHp || enemyData.hp,
                ap: enemyData.ap,
                armor: enemyData.armor || 0,
                gold: enemyData.gold || [10, 20],
                exp: enemyData.exp || 10,
                spawnedAt: Date.now()
            };
            
            squareData.entities.enemies.push(enemy);
        }
    }

    // Spawn resources in a square based on biome and location
    spawnResources(mapSystem, x, y, squareData, startingTownX, startingTownY, towns) {
        const biomeData = GameData.map.biomes[squareData.biome];
        if (!biomeData || !biomeData.resource) return;
        
        const resourceId = biomeData.resource;
        const resourceData = GameData.resources[resourceId];
        if (!resourceData) return;
        
        const distanceFromStart = mapSystem.getDistance(x, y, startingTownX, startingTownY);
        const distanceFactor = Math.min(distanceFromStart / 1000, 1);
        const difficultyFactor = squareData.levelRequirement / 100;
        
        const baseChance = (biomeData.spawnChance || 0.5) * 0.7;
        const spawnChance = baseChance * (1 - distanceFactor * 0.5) * (1 - difficultyFactor * 0.4);
        
        const maxResources = 25;
        let resourceCount = 0;
        
        for (let i = 0; i < maxResources; i++) {
            if (this.rng() < spawnChance) {
                resourceCount++;
            }
        }
        
        for (let i = 0; i < resourceCount; i++) {
            const resource = {
                id: `${resourceId}_${x}_${y}_${i}_${Date.now()}`,
                resourceId: resourceId,
                name: resourceData.name,
                type: resourceData.type,
                rarity: resourceData.rarity,
                baseValue: resourceData.baseValue,
                quantity: 1,
                spawnedAt: Date.now()
            };
            
            squareData.entities.items.push(resource);
        }
    }

    // Check and respawn enemies/resources for a square
    checkRespawn(mapSystem, x, y, squareData, startingTownX, startingTownY, towns) {
        const now = Date.now();
        
        const enemyRespawnTime = this.calculateRespawnTime(x, y, squareData, startingTownX, startingTownY, towns, 'enemy');
        if (now - (squareData.lastEnemyRespawn || Date.now()) >= enemyRespawnTime) {
            const currentEnemyCount = squareData.entities.enemies.length;
            if (currentEnemyCount < 25) {
                const respawnCount = Math.min(1 + Math.floor(this.rng() * 3), 25 - currentEnemyCount);
                for (let i = 0; i < respawnCount; i++) {
                    const biomeData = GameData.map.biomes[squareData.biome];
                    if (biomeData && biomeData.enemy) {
                        const enemyId = biomeData.enemy;
                        const enemyData = GameData.enemies[enemyId];
                        if (enemyData) {
                            const enemy = {
                                id: `${enemyId}_${x}_${y}_${currentEnemyCount + i}_${Date.now()}`,
                                enemyId: enemyId,
                                name: enemyData.name,
                                level: enemyData.level,
                                hp: enemyData.hp || enemyData.maxHp,
                                maxHp: enemyData.maxHp || enemyData.hp,
                                ap: enemyData.ap,
                                armor: enemyData.armor || 0,
                                gold: enemyData.gold || [10, 20],
                                exp: enemyData.exp || 10,
                                spawnedAt: now
                            };
                            squareData.entities.enemies.push(enemy);
                        }
                    }
                }
                squareData.lastEnemyRespawn = now;
                mapSystem.setSquare(x, y, squareData);
            }
        }
        
        const resourceRespawnTime = this.calculateRespawnTime(x, y, squareData, startingTownX, startingTownY, towns, 'resource');
        if (now - (squareData.lastResourceRespawn || Date.now()) >= resourceRespawnTime) {
            const currentResourceCount = squareData.entities.items.filter(item => item.type && ['ore', 'wood', 'plant', 'crystal', 'stone'].includes(item.type)).length;
            if (currentResourceCount < 25) {
                const respawnCount = Math.min(1 + Math.floor(this.rng() * 2), 25 - currentResourceCount);
                for (let i = 0; i < respawnCount; i++) {
                    const biomeData = GameData.map.biomes[squareData.biome];
                    if (biomeData && biomeData.resource) {
                        const resourceId = biomeData.resource;
                        const resourceData = GameData.resources[resourceId];
                        if (resourceData) {
                            const resource = {
                                id: `${resourceId}_${x}_${y}_${currentResourceCount + i}_${Date.now()}`,
                                resourceId: resourceId,
                                name: resourceData.name,
                                type: resourceData.type,
                                rarity: resourceData.rarity,
                                baseValue: resourceData.baseValue,
                                quantity: 1,
                                spawnedAt: now
                            };
                            squareData.entities.items.push(resource);
                        }
                    }
                }
                squareData.lastResourceRespawn = now;
                mapSystem.setSquare(x, y, squareData);
            }
        }
    }

    // Calculate respawn time based on zone difficulty and distance from towns
    calculateRespawnTime(x, y, squareData, startingTownX, startingTownY, towns, type) {
        const baseTime = type === 'enemy' ? 5 * 60 * 1000 : 10 * 60 * 1000;
        
        const zoneDifficulty = squareData.levelRequirement / 100;
        const difficultyMultiplier = 1 + (zoneDifficulty * 0.1);
        
        let nearestTownDistance = Infinity;
        towns.forEach(town => {
            const dist = Math.sqrt(Math.pow(x - town.x, 2) + Math.pow(y - town.y, 2));
            if (dist < nearestTownDistance) {
                nearestTownDistance = dist;
            }
        });
        const distanceMultiplier = 1 + (nearestTownDistance / 1000) * 0.05;
        
        return baseTime * difficultyMultiplier * distanceMultiplier;
    }
}

export default MapGenerator;
