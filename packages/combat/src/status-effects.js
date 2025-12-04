// Status effect system for combat
export class StatusEffect {
    constructor(type, data) {
        this.type = type;
        this.duration = data.duration || 1;
        this.maxDuration = data.duration || 1;
        this.damage = data.damage || 0; // For DoT effects
        this.value = data.value || 0; // For buff/debuff values
        this.source = data.source || null; // What caused this effect
    }

    // Apply effect at start of turn
    applyStart(target) {
        switch (this.type) {
            case 'poison':
            case 'burn':
            case 'bleed':
                // DoT effects
                target.hp = Math.max(0, target.hp - this.damage);
                return { message: `${target.name} takes ${this.damage} ${this.type} damage` };
            
            case 'heal':
                // HoT effects
                const healAmount = Math.min(this.damage, target.maxHp - target.hp);
                target.hp = Math.min(target.maxHp, target.hp + healAmount);
                return { message: `${target.name} heals for ${healAmount} HP` };
            
            case 'stun':
            case 'freeze':
                // Stun effects prevent action
                return { message: `${target.name} is ${this.type === 'freeze' ? 'frozen' : 'stunned'} and cannot act` };
            
            default:
                return null;
        }
    }

    // Apply effect at end of turn
    applyEnd(target) {
        // Most effects are applied at start, but some might need end-of-turn logic
        return null;
    }

    // Reduce duration
    tick() {
        this.duration--;
        return this.duration <= 0;
    }

    // Check if effect should prevent action
    preventsAction() {
        return this.type === 'stun' || this.type === 'freeze';
    }

    // Get effect description
    getDescription() {
        switch (this.type) {
            case 'poison':
                return `Poison: ${this.damage} damage per turn for ${this.duration} turns`;
            case 'burn':
                return `Burn: ${this.damage} fire damage per turn for ${this.duration} turns`;
            case 'bleed':
                return `Bleed: ${this.damage} damage per turn for ${this.duration} turns`;
            case 'heal':
                return `Regeneration: ${this.damage} HP per turn for ${this.duration} turns`;
            case 'stun':
                return `Stunned: Cannot act for ${this.duration} turn(s)`;
            case 'freeze':
                return `Frozen: Cannot act for ${this.duration} turn(s)`;
            case 'slow':
                return `Slowed: ${(this.value * 100).toFixed(0)}% reduced speed for ${this.duration} turns`;
            case 'armorReduction':
                return `Armor Reduced: ${(this.value * 100).toFixed(0)}% less armor for ${this.duration} turns`;
            case 'curse':
                return `Cursed: ${(this.value * 100).toFixed(0)}% less damage for ${this.duration} turns`;
            default:
                return `${this.type} for ${this.duration} turn(s)`;
        }
    }
}

// Status effect manager
export class StatusEffectManager {
    constructor() {
        this.effects = [];
    }

    // Add a status effect
    addEffect(effect) {
        // Check if effect already exists
        const existing = this.effects.find(e => e.type === effect.type);
        if (existing) {
            // Refresh duration if new effect has longer duration
            if (effect.duration > existing.duration) {
                existing.duration = effect.duration;
                existing.maxDuration = effect.duration;
            }
            // Update damage if higher
            if (effect.damage > existing.damage) {
                existing.damage = effect.damage;
            }
            return false; // Effect already exists
        }
        
        this.effects.push(effect);
        return true; // New effect added
    }

    // Remove a status effect
    removeEffect(type) {
        this.effects = this.effects.filter(e => e.type !== type);
    }

    // Apply all effects at start of turn
    applyStart(target) {
        const messages = [];
        this.effects.forEach(effect => {
            const result = effect.applyStart(target);
            if (result && result.message) {
                messages.push(result.message);
            }
        });
        return messages;
    }

    // Apply all effects at end of turn
    applyEnd(target) {
        const messages = [];
        this.effects.forEach(effect => {
            const result = effect.applyEnd(target);
            if (result && result.message) {
                messages.push(result.message);
            }
        });
        return messages;
    }

    // Tick all effects (reduce duration)
    tick() {
        const expired = [];
        this.effects.forEach(effect => {
            if (effect.tick()) {
                expired.push(effect.type);
            }
        });
        
        // Remove expired effects
        expired.forEach(type => this.removeEffect(type));
        
        return expired;
    }

    // Check if target is prevented from acting
    isPrevented() {
        return this.effects.some(effect => effect.preventsAction());
    }

    // Get all active effects
    getEffects() {
        return [...this.effects];
    }

    // Get effect by type
    getEffect(type) {
        return this.effects.find(e => e.type === type);
    }

    // Clear all effects
    clear() {
        this.effects = [];
    }

    // Get buff/debuff modifiers
    getModifiers() {
        const modifiers = {
            damage: 1.0,
            armor: 1.0,
            speed: 1.0,
            damageReduction: 0,
            damageAbsorption: 0
        };

        this.effects.forEach(effect => {
            switch (effect.type) {
                case 'slow':
                    modifiers.speed *= (1 - effect.value);
                    break;
                case 'armorReduction':
                    modifiers.armor *= (1 - effect.value);
                    break;
                case 'curse':
                    modifiers.damage *= (1 - effect.value);
                    break;
            }
        });

        return modifiers;
    }
}

export default StatusEffectManager;

