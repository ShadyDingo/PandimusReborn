// Asset Generator for Text-Idle RPG
// This script creates placeholder assets programmatically

class AssetGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Generate a monster sprite
    generateMonster(name, colors, size = 64) {
        this.canvas.width = size;
        this.canvas.height = size;
        this.ctx.clearRect(0, 0, size, size);

        // Background
        this.ctx.fillStyle = colors.background || '#4a5568';
        this.ctx.fillRect(0, 0, size, size);

        // Body
        this.ctx.fillStyle = colors.body || '#2d3748';
        this.ctx.fillRect(size * 0.2, size * 0.3, size * 0.6, size * 0.4);

        // Head
        this.ctx.fillStyle = colors.head || '#1a202c';
        this.ctx.fillRect(size * 0.3, size * 0.1, size * 0.4, size * 0.3);

        // Eyes
        this.ctx.fillStyle = colors.eyes || '#ff0000';
        this.ctx.fillRect(size * 0.35, size * 0.2, size * 0.1, size * 0.1);
        this.ctx.fillRect(size * 0.55, size * 0.2, size * 0.1, size * 0.1);

        // Add name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, size/2, size - 5);

        return this.canvas.toDataURL();
    }

    // Generate an item sprite
    generateItem(name, colors, size = 64) {
        this.canvas.width = size;
        this.canvas.height = size;
        this.ctx.clearRect(0, 0, size, size);

        // Background
        this.ctx.fillStyle = colors.background || '#4a5568';
        this.ctx.fillRect(0, 0, size, size);

        // Item shape
        this.ctx.fillStyle = colors.item || '#2d3748';
        this.ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);

        // Item details
        this.ctx.fillStyle = colors.details || '#1a202c';
        this.ctx.fillRect(size * 0.3, size * 0.3, size * 0.4, size * 0.4);

        // Add name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, size/2, size - 5);

        return this.canvas.toDataURL();
    }

    // Generate a UI button
    generateButton(text, colors, width = 200, height = 50) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);

        // Button background
        this.ctx.fillStyle = colors.background || '#4c51bf';
        this.ctx.fillRect(0, 0, width, height);

        // Button border
        this.ctx.strokeStyle = colors.border || '#2d3748';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(1, 1, width - 2, height - 2);

        // Button text
        this.ctx.fillStyle = colors.text || '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, width/2, height/2 + 6);

        return this.canvas.toDataURL();
    }

    // Generate a progress bar
    generateProgressBar(colors, width = 200, height = 20) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);

        // Background
        this.ctx.fillStyle = colors.background || '#e2e8f0';
        this.ctx.fillRect(0, 0, width, height);

        // Progress fill
        this.ctx.fillStyle = colors.fill || '#48bb78';
        this.ctx.fillRect(0, 0, width * 0.7, height); // 70% filled

        // Border
        this.ctx.strokeStyle = colors.border || '#2d3748';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, width, height);

        return this.canvas.toDataURL();
    }

    // Generate a skill icon
    generateSkillIcon(skillName, colors, size = 32) {
        this.canvas.width = size;
        this.canvas.height = size;
        this.ctx.clearRect(0, 0, size, size);

        // Background
        this.ctx.fillStyle = colors.background || '#4a5568';
        this.ctx.fillRect(0, 0, size, size);

        // Icon shape
        this.ctx.fillStyle = colors.icon || '#2d3748';
        this.ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);

        // Add skill initial
        this.ctx.fillStyle = colors.text || '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(skillName.charAt(0).toUpperCase(), size/2, size/2 + 4);

        return this.canvas.toDataURL();
    }

    // Generate all placeholder assets
    generateAllPlaceholders() {
        const assets = {};

        // Monsters
        assets.monsters = {
            tide_crab: this.generateMonster('Tide Crab', { background: '#1e40af', body: '#3b82f6', head: '#1d4ed8', eyes: '#fbbf24' }),
            grey_wolf: this.generateMonster('Grey Wolf', { background: '#6b7280', body: '#9ca3af', head: '#4b5563', eyes: '#fbbf24' }),
            bandit_cutpurse: this.generateMonster('Bandit', { background: '#92400e', body: '#d97706', head: '#78350f', eyes: '#dc2626' }),
            tide_watcher: this.generateMonster('Tide Watcher', { background: '#1e3a8a', body: '#2563eb', head: '#1d4ed8', eyes: '#fbbf24' }),
            salamander: this.generateMonster('Salamander', { background: '#dc2626', body: '#ef4444', head: '#b91c1c', eyes: '#fbbf24' }),
            fire_golem: this.generateMonster('Fire Golem', { background: '#991b1b', body: '#dc2626', head: '#7f1d1d', eyes: '#fbbf24' }),
            ember_golem: this.generateMonster('Ember Golem', { background: '#7c2d12', body: '#ea580c', head: '#9a3412', eyes: '#fbbf24' })
        };

        // Items
        assets.items = {
            bronze_dagger: this.generateItem('Bronze Dagger', { background: '#92400e', item: '#d97706', details: '#78350f' }),
            iron_sword: this.generateItem('Iron Sword', { background: '#6b7280', item: '#9ca3af', details: '#4b5563' }),
            steel_greatsword: this.generateItem('Steel Sword', { background: '#374151', item: '#6b7280', details: '#1f2937' }),
            mithril_blade: this.generateItem('Mithril Blade', { background: '#1e40af', item: '#3b82f6', details: '#1d4ed8' }),
            adamant_waraxe: this.generateItem('Adamant Axe', { background: '#1f2937', item: '#374151', details: '#111827' }),
            minor_heal_potion: this.generateItem('Heal Potion', { background: '#dc2626', item: '#ef4444', details: '#b91c1c' }),
            minor_mana_potion: this.generateItem('Mana Potion', { background: '#1e40af', item: '#3b82f6', details: '#1d4ed8' }),
            copper_ore: this.generateItem('Copper Ore', { background: '#92400e', item: '#d97706', details: '#78350f' }),
            iron_ore: this.generateItem('Iron Ore', { background: '#6b7280', item: '#9ca3af', details: '#4b5563' })
        };

        // UI Elements
        assets.ui = {
            button_primary: this.generateButton('Primary', { background: '#4c51bf', border: '#2d3748', text: '#ffffff' }),
            button_secondary: this.generateButton('Secondary', { background: '#6b7280', border: '#2d3748', text: '#ffffff' }),
            button_success: this.generateButton('Success', { background: '#48bb78', border: '#2d3748', text: '#ffffff' }),
            progress_bar_health: this.generateProgressBar({ background: '#e2e8f0', fill: '#ef4444', border: '#2d3748' }),
            progress_bar_mana: this.generateProgressBar({ background: '#e2e8f0', fill: '#3b82f6', border: '#2d3748' }),
            progress_bar_exp: this.generateProgressBar({ background: '#e2e8f0', fill: '#48bb78', border: '#2d3748' })
        };

        // Skill Icons
        assets.icons = {
            foraging: this.generateSkillIcon('Foraging', { background: '#22543d', icon: '#38a169', text: '#ffffff' }),
            mining: this.generateSkillIcon('Mining', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            fishing: this.generateSkillIcon('Fishing', { background: '#1e40af', icon: '#3b82f6', text: '#ffffff' }),
            woodcutting: this.generateSkillIcon('Woodcutting', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            cooking: this.generateSkillIcon('Cooking', { background: '#c53030', icon: '#e53e3e', text: '#ffffff' }),
            smithing: this.generateSkillIcon('Smithing', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            fletching: this.generateSkillIcon('Fletching', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            alchemy: this.generateSkillIcon('Alchemy', { background: '#553c9a', icon: '#805ad5', text: '#ffffff' }),
            carpentry: this.generateSkillIcon('Carpentry', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            melee: this.generateSkillIcon('Melee', { background: '#c53030', icon: '#e53e3e', text: '#ffffff' }),
            archery: this.generateSkillIcon('Archery', { background: '#744210', icon: '#d69e2e', text: '#ffffff' }),
            sorcery: this.generateSkillIcon('Sorcery', { background: '#553c9a', icon: '#805ad5', text: '#ffffff' })
        };

        return assets;
    }

    // Save asset as file
    saveAsset(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }

    // Generate and save all assets
    generateAndSaveAll() {
        const assets = this.generateAllPlaceholders();
        
        // Save monsters
        Object.entries(assets.monsters).forEach(([name, dataUrl]) => {
            this.saveAsset(dataUrl, `${name}_64.png`);
        });

        // Save items
        Object.entries(assets.items).forEach(([name, dataUrl]) => {
            this.saveAsset(dataUrl, `${name}_64.png`);
        });

        // Save UI elements
        Object.entries(assets.ui).forEach(([name, dataUrl]) => {
            this.saveAsset(dataUrl, `${name}.png`);
        });

        // Save icons
        Object.entries(assets.icons).forEach(([name, dataUrl]) => {
            this.saveAsset(dataUrl, `${name}_32x32.png`);
        });

        console.log('All placeholder assets generated and saved!');
    }

    // Create asset preview
    createAssetPreview(assets) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 2px solid #ccc;
            padding: 10px;
            z-index: 1000;
        `;

        Object.entries(assets).forEach(([category, categoryAssets]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `<h3>${category}</h3>`;
            
            Object.entries(categoryAssets).forEach(([name, dataUrl]) => {
                const img = document.createElement('img');
                img.src = dataUrl;
                img.style.cssText = 'width: 64px; height: 64px; margin: 2px; border: 1px solid #ccc;';
                img.title = name;
                categoryDiv.appendChild(img);
            });
            
            container.appendChild(categoryDiv);
        });

        document.body.appendChild(container);
        return container;
    }
}

// Global asset generator instance
window.assetGenerator = new AssetGenerator();

// Add to global scope for easy access
window.generateAssets = () => {
    const assets = window.assetGenerator.generateAllPlaceholders();
    window.assetGenerator.createAssetPreview(assets);
    return assets;
};

window.saveAllAssets = () => {
    window.assetGenerator.generateAndSaveAll();
};

// Auto-generate assets when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Asset Generator loaded. Use generateAssets() to preview or saveAllAssets() to download.');
});

export default AssetGenerator;




