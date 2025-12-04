// Player icon customization system
export const PlayerIcons = {
    icons: [
        { id: 'default', name: 'Default', emoji: '🧙', description: 'Standard adventurer' },
        { id: 'warrior', name: 'Warrior', emoji: '⚔️', description: 'Mighty warrior' },
        { id: 'rogue', name: 'Rogue', emoji: '🗡️', description: 'Sneaky rogue' },
        { id: 'mage', name: 'Mage', emoji: '🔮', description: 'Powerful mage' },
        { id: 'archer', name: 'Archer', emoji: '🏹', description: 'Skilled archer' },
        { id: 'paladin', name: 'Paladin', emoji: '🛡️', description: 'Holy paladin' },
        { id: 'necromancer', name: 'Necromancer', emoji: '💀', description: 'Dark necromancer' },
        { id: 'druid', name: 'Druid', emoji: '🌿', description: 'Nature druid' },
        { id: 'monk', name: 'Monk', emoji: '🥋', description: 'Martial monk' },
        { id: 'bard', name: 'Bard', emoji: '🎵', description: 'Musical bard' },
        { id: 'knight', name: 'Knight', emoji: '🛡️', description: 'Noble knight' },
        { id: 'assassin', name: 'Assassin', emoji: '🗡️', description: 'Deadly assassin' },
        { id: 'wizard', name: 'Wizard', emoji: '✨', description: 'Arcane wizard' },
        { id: 'ranger', name: 'Ranger', emoji: '🌲', description: 'Forest ranger' },
        { id: 'cleric', name: 'Cleric', emoji: '⛪', description: 'Divine cleric' }
    ],

    // Get icon by ID
    getIcon(iconId) {
        return this.icons.find(icon => icon.id === iconId) || this.icons[0];
    },

    // Get all icons
    getAllIcons() {
        return this.icons;
    },

    // Validate icon ID
    isValidIcon(iconId) {
        return this.icons.some(icon => icon.id === iconId);
    }
};

export default PlayerIcons;

