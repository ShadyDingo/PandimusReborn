// Asset Loader for Text-Idle RPG
// This script helps load and manage all game assets

class AssetLoader {
    constructor() {
        this.assets = {
            monsters: {},
            items: {},
            ui: {},
            backgrounds: {},
            icons: {}
        };
        this.loadedAssets = new Set();
        this.loadingPromises = new Map();
    }

    // Load a single asset
    async loadAsset(category, name, path) {
        const key = `${category}_${name}`;
        
        if (this.loadedAssets.has(key)) {
            return this.assets[category][name];
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets[category][name] = img;
                this.loadedAssets.add(key);
                this.loadingPromises.delete(key);
                resolve(img);
            };
            img.onerror = () => {
                this.loadingPromises.delete(key);
                reject(new Error(`Failed to load asset: ${path}`));
            };
            img.src = path;
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    // Load multiple assets
    async loadAssets(assetList) {
        const promises = assetList.map(({ category, name, path }) => 
            this.loadAsset(category, name, path)
        );
        
        try {
            await Promise.all(promises);
            console.log(`Loaded ${assetList.length} assets successfully`);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    }

    // Get a loaded asset
    getAsset(category, name) {
        return this.assets[category][name];
    }

    // Check if asset is loaded
    isAssetLoaded(category, name) {
        const key = `${category}_${name}`;
        return this.loadedAssets.has(key);
    }

    // Load all core game assets
    async loadCoreAssets() {
        const coreAssets = [
            // Monsters - Greencoast
            { category: 'monsters', name: 'tide_crab', path: 'assets/monsters/greencoast/tide_crab_64.png' },
            { category: 'monsters', name: 'grey_wolf', path: 'assets/monsters/greencoast/grey_wolf_64.png' },
            { category: 'monsters', name: 'bandit_cutpurse', path: 'assets/monsters/greencoast/bandit_cutpurse_64.png' },
            { category: 'monsters', name: 'tide_watcher', path: 'assets/monsters/greencoast/tide_watcher_128.png' },
            
            // Monsters - Emberridge
            { category: 'monsters', name: 'salamander', path: 'assets/monsters/emberridge/salamander_64.png' },
            { category: 'monsters', name: 'fire_golem', path: 'assets/monsters/emberridge/fire_golem_64.png' },
            { category: 'monsters', name: 'ember_golem', path: 'assets/monsters/emberridge/ember_golem_128.png' },
            
            // Items - Weapons
            { category: 'items', name: 'bronze_dagger', path: 'assets/items/weapons/bronze_dagger_64.png' },
            { category: 'items', name: 'iron_sword', path: 'assets/items/weapons/iron_sword_64.png' },
            { category: 'items', name: 'steel_greatsword', path: 'assets/items/weapons/steel_greatsword_64.png' },
            { category: 'items', name: 'mithril_blade', path: 'assets/items/weapons/mithril_blade_64.png' },
            { category: 'items', name: 'adamant_waraxe', path: 'assets/items/weapons/adamant_waraxe_64.png' },
            
            // Items - Armor
            { category: 'items', name: 'leather_cap', path: 'assets/items/armor/leather_cap_64.png' },
            { category: 'items', name: 'iron_helm', path: 'assets/items/armor/iron_helm_64.png' },
            { category: 'items', name: 'steel_helm', path: 'assets/items/armor/steel_helm_64.png' },
            { category: 'items', name: 'mithril_helm', path: 'assets/items/armor/mithril_helm_64.png' },
            
            // Items - Consumables
            { category: 'items', name: 'minor_heal_potion', path: 'assets/items/consumables/minor_heal_potion_64.png' },
            { category: 'items', name: 'minor_mana_potion', path: 'assets/items/consumables/minor_mana_potion_64.png' },
            { category: 'items', name: 'antidote', path: 'assets/items/consumables/antidote_64.png' },
            { category: 'items', name: 'focus_tonic', path: 'assets/items/consumables/focus_tonic_64.png' },
            
            // Items - Materials
            { category: 'items', name: 'copper_ore', path: 'assets/items/materials/copper_ore_64.png' },
            { category: 'items', name: 'tin_ore', path: 'assets/items/materials/tin_ore_64.png' },
            { category: 'items', name: 'iron_ore', path: 'assets/items/materials/iron_ore_64.png' },
            { category: 'items', name: 'coal', path: 'assets/items/materials/coal_64.png' },
            
            // UI Elements
            { category: 'ui', name: 'button_primary', path: 'assets/ui/buttons/button_primary_200x50.png' },
            { category: 'ui', name: 'button_secondary', path: 'assets/ui/buttons/button_secondary_200x50.png' },
            { category: 'ui', name: 'panel_main', path: 'assets/ui/panels/panel_main_400x300.png' },
            { category: 'ui', name: 'progress_bar_health', path: 'assets/ui/progress_bars/progress_bar_health_200x20.png' },
            { category: 'ui', name: 'progress_bar_mana', path: 'assets/ui/progress_bars/progress_bar_mana_200x20.png' },
            { category: 'ui', name: 'progress_bar_exp', path: 'assets/ui/progress_bars/progress_bar_exp_200x20.png' },
            
            // Icons
            { category: 'icons', name: 'foraging', path: 'assets/ui/icons/foraging_32x32.png' },
            { category: 'icons', name: 'mining', path: 'assets/ui/icons/mining_32x32.png' },
            { category: 'icons', name: 'fishing', path: 'assets/ui/icons/fishing_32x32.png' },
            { category: 'icons', name: 'woodcutting', path: 'assets/ui/icons/woodcutting_32x32.png' },
            { category: 'icons', name: 'cooking', path: 'assets/ui/icons/cooking_32x32.png' },
            { category: 'icons', name: 'smithing', path: 'assets/ui/icons/smithing_32x32.png' },
            { category: 'icons', name: 'fletching', path: 'assets/ui/icons/fletching_32x32.png' },
            { category: 'icons', name: 'alchemy', path: 'assets/ui/icons/alchemy_32x32.png' },
            { category: 'icons', name: 'carpentry', path: 'assets/ui/icons/carpentry_32x32.png' },
            { category: 'icons', name: 'melee', path: 'assets/ui/icons/melee_32x32.png' },
            { category: 'icons', name: 'archery', path: 'assets/ui/icons/archery_32x32.png' },
            { category: 'icons', name: 'sorcery', path: 'assets/ui/icons/sorcery_32x32.png' },
            
            // Backgrounds
            { category: 'backgrounds', name: 'greencoast', path: 'assets/ui/backgrounds/greencoast_bg_1920x1080.png' },
            { category: 'backgrounds', name: 'emberridge', path: 'assets/ui/backgrounds/emberridge_bg_1920x1080.png' },
            { category: 'backgrounds', name: 'shadow_mire', path: 'assets/ui/backgrounds/shadow_mire_bg_1920x1080.png' },
            { category: 'backgrounds', name: 'crystal_peaks', path: 'assets/ui/backgrounds/crystal_peaks_bg_1920x1080.png' },
            { category: 'backgrounds', name: 'ashen_depths', path: 'assets/ui/backgrounds/ashen_depths_bg_1920x1080.png' }
        ];

        await this.loadAssets(coreAssets);
    }

    // Load region-specific assets
    async loadRegionAssets(regionId) {
        const regionAssets = {
            greencoast: [
                { category: 'monsters', name: 'tide_crab', path: 'assets/monsters/greencoast/tide_crab_64.png' },
                { category: 'monsters', name: 'grey_wolf', path: 'assets/monsters/greencoast/grey_wolf_64.png' },
                { category: 'monsters', name: 'bandit_cutpurse', path: 'assets/monsters/greencoast/bandit_cutpurse_64.png' },
                { category: 'monsters', name: 'tide_watcher', path: 'assets/monsters/greencoast/tide_watcher_128.png' },
                { category: 'backgrounds', name: 'greencoast', path: 'assets/ui/backgrounds/greencoast_bg_1920x1080.png' }
            ],
            emberridge: [
                { category: 'monsters', name: 'salamander', path: 'assets/monsters/emberridge/salamander_64.png' },
                { category: 'monsters', name: 'fire_golem', path: 'assets/monsters/emberridge/fire_golem_64.png' },
                { category: 'monsters', name: 'ember_golem', path: 'assets/monsters/emberridge/ember_golem_128.png' },
                { category: 'backgrounds', name: 'emberridge', path: 'assets/ui/backgrounds/emberridge_bg_1920x1080.png' }
            ],
            shadow_mire: [
                { category: 'monsters', name: 'mire_serpent', path: 'assets/monsters/shadow_mire/mire_serpent_64.png' },
                { category: 'monsters', name: 'swamp_horror', path: 'assets/monsters/shadow_mire/swamp_horror_64.png' },
                { category: 'backgrounds', name: 'shadow_mire', path: 'assets/ui/backgrounds/shadow_mire_bg_1920x1080.png' }
            ],
            crystal_peaks: [
                { category: 'monsters', name: 'ice_elemental', path: 'assets/monsters/crystal_peaks/ice_elemental_64.png' },
                { category: 'monsters', name: 'crystal_guardian', path: 'assets/monsters/crystal_peaks/crystal_guardian_64.png' },
                { category: 'monsters', name: 'crystal_wyrm', path: 'assets/monsters/crystal_peaks/crystal_wyrm_128.png' },
                { category: 'backgrounds', name: 'crystal_peaks', path: 'assets/ui/backgrounds/crystal_peaks_bg_1920x1080.png' }
            ],
            ashen_depths: [
                { category: 'monsters', name: 'magma_fiend', path: 'assets/monsters/ashen_depths/magma_fiend_64.png' },
                { category: 'monsters', name: 'infernal_shade', path: 'assets/monsters/ashen_depths/infernal_shade_64.png' },
                { category: 'monsters', name: 'ashen_colossus', path: 'assets/monsters/ashen_depths/ashen_colossus_128.png' },
                { category: 'backgrounds', name: 'ashen_depths', path: 'assets/ui/backgrounds/ashen_depths_bg_1920x1080.png' }
            ]
        };

        const assets = regionAssets[regionId] || [];
        await this.loadAssets(assets);
    }

    // Create asset URL with fallback
    createAssetUrl(category, name, size = '64') {
        const basePath = 'assets';
        const categoryPath = category === 'monsters' ? 'monsters' : 
                           category === 'items' ? 'items' : 
                           category === 'ui' ? 'ui' : 
                           category === 'backgrounds' ? 'ui/backgrounds' : 
                           category === 'icons' ? 'ui/icons' : 'ui';
        
        return `${basePath}/${categoryPath}/${name}_${size}.png`;
    }

    // Preload assets for better performance
    async preloadAssets() {
        console.log('Preloading core assets...');
        await this.loadCoreAssets();
        console.log('Core assets preloaded successfully');
    }

    // Get asset with fallback
    getAssetWithFallback(category, name, fallbackName = 'default') {
        const asset = this.getAsset(category, name);
        if (asset) return asset;
        
        const fallback = this.getAsset(category, fallbackName);
        if (fallback) return fallback;
        
        // Return a placeholder if no asset is found
        return this.createPlaceholder(category, name);
    }

    // Create a placeholder image
    createPlaceholder(category, name) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set size based on category
        const size = category === 'monsters' ? 64 : 
                    category === 'items' ? 64 : 
                    category === 'icons' ? 32 : 
                    category === 'backgrounds' ? 1920 : 64;
        
        canvas.width = size;
        canvas.height = size;
        
        // Draw placeholder
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, size/2, size/2);
        
        return canvas;
    }

    // Get loading progress
    getLoadingProgress() {
        const total = Object.keys(this.assets).reduce((sum, category) => 
            sum + Object.keys(this.assets[category]).length, 0);
        const loaded = this.loadedAssets.size;
        
        return {
            loaded,
            total,
            percentage: total > 0 ? (loaded / total) * 100 : 0
        };
    }
}

// Global asset loader instance
window.assetLoader = new AssetLoader();

// Auto-preload assets when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.assetLoader.preloadAssets();
});

export default AssetLoader;




