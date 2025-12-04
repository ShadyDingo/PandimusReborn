// Shop system for buying and selling items
export class ShopSystem {
    constructor() {
        this.shops = new Map(); // Store shop definitions by shop ID
    }

    // Register a shop
    registerShop(shopData) {
        this.shops.set(shopData.id, {
            id: shopData.id,
            name: shopData.name,
            townId: shopData.townId,
            type: shopData.type || 'general', // general, weapon, armor, potion, etc.
            items: shopData.items || [],
            buyMultiplier: shopData.buyMultiplier || 1.2, // Price multiplier when buying from player
            sellMultiplier: shopData.sellMultiplier || 0.6 // Price multiplier when selling to player
        });
    }

    // Get shop by ID
    getShop(shopId) {
        return this.shops.get(shopId);
    }

    // Get shops in a town
    getTownShops(townId) {
        return Array.from(this.shops.values())
            .filter(shop => shop.townId === townId);
    }

    // Get items available in a shop
    getShopItems(shopId) {
        const shop = this.getShop(shopId);
        return shop ? shop.items : [];
    }

    // Buy item from shop
    buyItem(shopId, itemId, playerCurrency) {
        const shop = this.getShop(shopId);
        if (!shop) {
            return { success: false, message: 'Shop not found' };
        }

        const item = shop.items.find(i => i.id === itemId);
        if (!item) {
            return { success: false, message: 'Item not found in shop' };
        }

        const price = Math.floor(item.basePrice * shop.buyMultiplier);
        
        if (playerCurrency.gold < price) {
            return { success: false, message: 'Not enough gold' };
        }

        playerCurrency.gold -= price;
        
        return {
            success: true,
            item: { ...item },
            price,
            remainingGold: playerCurrency.gold
        };
    }

    // Sell item to shop
    sellItem(shopId, item, playerCurrency) {
        const shop = this.getShop(shopId);
        if (!shop) {
            return { success: false, message: 'Shop not found' };
        }

        // Calculate item value
        const baseValue = this.calculateItemValue(item);
        const sellPrice = Math.floor(baseValue * shop.sellMultiplier);

        playerCurrency.gold += sellPrice;

        return {
            success: true,
            price: sellPrice,
            newGold: playerCurrency.gold
        };
    }

    // Calculate item base value
    calculateItemValue(item) {
        let value = 10; // Base value

        // Add value based on rarity
        const rarityMultiplier = {
            'common': 1,
            'uncommon': 2,
            'rare': 5,
            'epic': 15,
            'legendary': 50,
            'mythic': 200
        };
        value *= (rarityMultiplier[item.rarity] || 1);

        // Add value based on stats
        if (item.stats) {
            Object.values(item.stats).forEach(statValue => {
                value += statValue * 5;
            });
        }

        // Add value based on tier
        value *= (item.tier || 1);

        return Math.floor(value);
    }

    // Initialize default shops for starting town
    initializeDefaultShops() {
        // General shop
        this.registerShop({
            id: 'starting_town_general',
            name: 'General Store',
            townId: 'starting_town',
            type: 'general',
            items: [
                { id: 'health_potion_minor', name: 'Minor Health Potion', basePrice: 25, type: 'consumable' },
                { id: 'mana_potion_minor', name: 'Minor Mana Potion', basePrice: 25, type: 'consumable' },
                { id: 'bread', name: 'Bread', basePrice: 5, type: 'food' },
                { id: 'rope', name: 'Rope', basePrice: 10, type: 'tool' }
            ]
        });

        // Weapon shop
        this.registerShop({
            id: 'starting_town_weapons',
            name: 'Weapon Smith',
            townId: 'starting_town',
            type: 'weapon',
            items: [
                { id: 'iron_sword', name: 'Iron Sword', basePrice: 100, type: 'weapon', slot: 'mainhand' },
                { id: 'iron_dagger', name: 'Iron Dagger', basePrice: 80, type: 'weapon', slot: 'mainhand' },
                { id: 'iron_mace', name: 'Iron Mace', basePrice: 100, type: 'weapon', slot: 'mainhand' },
                { id: 'wooden_staff', name: 'Wooden Staff', basePrice: 90, type: 'weapon', slot: 'mainhand' }
            ]
        });

        // Armor shop
        this.registerShop({
            id: 'starting_town_armor',
            name: 'Armor Smith',
            townId: 'starting_town',
            type: 'armor',
            items: [
                { id: 'leather_helmet', name: 'Leather Helmet', basePrice: 50, type: 'armor', slot: 'head' },
                { id: 'leather_chest', name: 'Leather Chest', basePrice: 100, type: 'armor', slot: 'chest' },
                { id: 'leather_legs', name: 'Leather Legs', basePrice: 80, type: 'armor', slot: 'legs' },
                { id: 'leather_boots', name: 'Leather Boots', basePrice: 60, type: 'armor', slot: 'boots' }
            ]
        });
    }
}

export default ShopSystem;

