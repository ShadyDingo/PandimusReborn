// Turn-based combat engine
import { StatusEffect, StatusEffectManager } from './status-effects.js';
import { CombatDomains, getUnlockedAbilities, getUnlockedPassives } from './combat-domains.js';
import { GameData } from '../../shared/src/game-data.js';

export class CombatEngine {
    constructor() {
        this.combatState = null;
    }

    // Start combat with an enemy
    startCombat(player, enemy, playerCombatDomains = {}) {
        const enemyData = GameData.enemies[enemy.id] || enemy;
        
        this.combatState = {
            player: {
                ...player,
                statusEffects: new StatusEffectManager(),
                combatDomains: playerCombatDomains,
                abilityCooldowns: {}
            },
            enemy: {
                id: enemy.id || enemyData.id,
                name: enemy.name || enemyData.name,
                level: enemy.level || enemyData.level,
                hp: enemy.hp || enemyData.hp,
                maxHp: enemy.hp || enemyData.hp,
                ap: enemy.ap || enemyData.ap,
                armor: enemy.armor || enemyData.armor || 0,
                statusEffects: new StatusEffectManager(),
                gold: enemy.gold || enemyData.gold || [10, 20],
                exp: enemy.exp || enemyData.exp || 10
            },
            turn: 'player',
            turnCount: 0,
            log: []
        };

        // Apply passive effects from combat domains
        this.applyPassiveEffects(this.combatState.player);

        this.addLog(`Combat started! You encounter ${this.combatState.enemy.name}!`);
        return this.combatState;
    }

    // Apply passive effects from combat domains
    applyPassiveEffects(player) {
        Object.entries(player.combatDomains).forEach(([domain, domainData]) => {
            const level = domainData.level || 0;
            const passives = getUnlockedPassives(domain, level);
            
            passives.forEach(passive => {
                if (passive.effect) {
                    Object.entries(passive.effect).forEach(([stat, value]) => {
                        if (stat === 'ap' && player.ap) {
                            player.ap = Math.floor(player.ap * (1 + value));
                        } else if (stat === 'sp' && player.sp) {
                            player.sp = Math.floor(player.sp * (1 + value));
                        } else if (stat === 'armor' && player.armor) {
                            player.armor = Math.floor(player.armor * (1 + value));
                        } else if (stat === 'crit' && player.crit) {
                            player.crit = Math.min(1.0, player.crit + value);
                        } else if (stat === 'dodge' && player.dodge) {
                            player.dodge = Math.min(1.0, player.dodge + value);
                        }
                    });
                }
            });
        });
    }

    // Player action
    playerAction(action, abilityName = null, itemId = null) {
        if (!this.combatState || this.combatState.turn !== 'player') {
            return { success: false, message: 'Not your turn' };
        }

        const player = this.combatState.player;
        const enemy = this.combatState.enemy;

        // Check if player is prevented from acting
        if (player.statusEffects.isPrevented()) {
            this.addLog(`${player.name} is unable to act!`);
            this.endPlayerTurn();
            return { success: false, message: 'You are stunned or frozen' };
        }

        let result = { success: true, messages: [] };

        switch (action) {
            case 'attack':
                result = this.playerAttack();
                break;
            case 'defend':
                result = this.playerDefend();
                break;
            case 'ability':
                result = this.playerUseAbility(abilityName);
                break;
            case 'item':
                result = this.playerUseItem(itemId);
                break;
            default:
                return { success: false, message: 'Invalid action' };
        }

        // Apply status effects at start of enemy turn
        const statusMessages = enemy.statusEffects.applyStart(enemy);
        statusMessages.forEach(msg => this.addLog(msg));

        // Check if enemy is dead
        if (enemy.hp <= 0) {
            return this.victory();
        }

        this.endPlayerTurn();
        return result;
    }

    // Player basic attack
    playerAttack() {
        const player = this.combatState.player;
        const enemy = this.combatState.enemy;

        const hitChance = GameData.formulas.hitChance(player.hit, 0);
        const hitRoll = Math.random();

        if (hitRoll > hitChance) {
            this.addLog(`${player.name}'s attack misses!`);
            return { success: true, messages: ['Attack missed'] };
        }

        // Calculate damage
        let damage = player.ap;
        const critRoll = Math.random();
        let isCrit = false;

        if (critRoll <= player.crit) {
            damage *= 2;
            isCrit = true;
        }

        // Apply armor mitigation
        const mitigation = GameData.formulas.mitigation(enemy.armor, enemy.level);
        damage = GameData.formulas.damage(damage, 1.0, mitigation);

        // Apply modifiers from status effects
        const modifiers = enemy.statusEffects.getModifiers();
        damage = Math.floor(damage * modifiers.damage);

        enemy.hp = Math.max(0, enemy.hp - damage);

        const message = isCrit 
            ? `${player.name} critically hits for ${damage.toFixed(1)} damage!`
            : `${player.name} attacks for ${damage.toFixed(1)} damage!`;
        
        this.addLog(message);

        return { success: true, messages: [message], damage, isCrit };
    }

    // Player defend
    playerDefend() {
        const player = this.combatState.player;
        player.defending = true;
        this.addLog(`${player.name} takes a defensive stance!`);
        return { success: true, messages: ['Defending'] };
    }

    // Player use ability
    playerUseAbility(abilityName) {
        const player = this.combatState.player;
        const enemy = this.combatState.enemy;

        // Find ability in player's combat domains
        let ability = null;
        let domain = null;

        for (const [domainName, domainData] of Object.entries(player.combatDomains)) {
            const level = domainData.level || 0;
            const abilities = getUnlockedAbilities(domainName, level);
            const found = abilities.find(a => a.name === abilityName);
            if (found) {
                ability = found;
                domain = domainName;
                break;
            }
        }

        if (!ability) {
            return { success: false, message: 'Ability not found or not unlocked' };
        }

        // Check cooldown
        const cooldownKey = `${domain}_${abilityName}`;
        if (player.abilityCooldowns[cooldownKey] > 0) {
            return { success: false, message: `Ability on cooldown for ${player.abilityCooldowns[cooldownKey]} turns` };
        }

        // Use ability
        let damage = 0;
        const messages = [];

        if (ability.damageMultiplier) {
            const baseDamage = ability.damageType === 'fire' || ability.damageType === 'frost' || 
                              ability.damageType === 'holy' || ability.damageType === 'dark' 
                              ? player.sp : player.ap;
            
            damage = Math.floor(baseDamage * ability.damageMultiplier);
            
            // Apply crit if applicable
            if (ability.guaranteedCrit || Math.random() <= (player.crit + (ability.critBonus || 0))) {
                damage *= 2;
                messages.push('Critical hit!');
            }

            // Apply armor mitigation
            const mitigation = GameData.formulas.mitigation(enemy.armor, enemy.level);
            damage = GameData.formulas.damage(damage, 1.0, mitigation);

            enemy.hp = Math.max(0, enemy.hp - damage);
            messages.push(`${player.name} uses ${abilityName} for ${damage.toFixed(1)} damage!`);
        }

        // Apply status effects
        if (ability.statusEffect) {
            const effect = new StatusEffect(ability.statusEffect.type, ability.statusEffect);
            enemy.statusEffects.addEffect(effect);
            messages.push(`${enemy.name} is affected by ${ability.statusEffect.type}!`);
        }

        // Apply buffs
        if (ability.buff) {
            const effect = new StatusEffect('buff', {
                ...ability.buff,
                duration: ability.duration || 3
            });
            player.statusEffects.addEffect(effect);
            messages.push(`${player.name} gains ${ability.name} buff!`);
        }

        // Set cooldown
        player.abilityCooldowns[cooldownKey] = ability.cooldown || 0;

        messages.forEach(msg => this.addLog(msg));
        return { success: true, messages, damage };
    }

    // Player use item
    playerUseItem(itemId) {
        // This will be implemented with item system
        return { success: false, message: 'Item system not yet implemented' };
    }

    // End player turn
    endPlayerTurn() {
        // Tick player status effects
        this.combatState.player.statusEffects.tick();
        
        // Reduce cooldowns
        Object.keys(this.combatState.player.abilityCooldowns).forEach(key => {
            if (this.combatState.player.abilityCooldowns[key] > 0) {
                this.combatState.player.abilityCooldowns[key]--;
            }
        });

        this.combatState.turn = 'enemy';
        this.combatState.turnCount++;
    }

    // Enemy turn
    enemyTurn() {
        if (!this.combatState || this.combatState.turn !== 'enemy') {
            return;
        }

        const player = this.combatState.player;
        const enemy = this.combatState.enemy;

        // Check if enemy is prevented from acting
        if (enemy.statusEffects.isPrevented()) {
            this.addLog(`${enemy.name} is unable to act!`);
            this.endEnemyTurn();
            return;
        }

        // Simple enemy AI: attack
        const hitChance = 0.75; // Base enemy hit chance
        const hitRoll = Math.random();

        if (hitRoll > hitChance) {
            this.addLog(`${enemy.name}'s attack misses!`);
            this.endEnemyTurn();
            return;
        }

        let damage = enemy.ap;
        
        // Reduce damage if player is defending
        if (player.defending) {
            damage = Math.floor(damage * 0.5);
            player.defending = false;
        }

        // Apply armor mitigation
        const mitigation = GameData.formulas.mitigation(player.armor, player.level);
        damage = GameData.formulas.damage(damage, 1.0, mitigation);

        // Check for dodge
        if (Math.random() <= player.dodge) {
            this.addLog(`${player.name} dodges the attack!`);
            this.endEnemyTurn();
            return;
        }

        player.hp = Math.max(0, player.hp - damage);
        this.addLog(`${enemy.name} attacks for ${damage.toFixed(1)} damage!`);

        // Check if player is dead
        if (player.hp <= 0) {
            return this.defeat();
        }

        this.endEnemyTurn();
    }

    // End enemy turn
    endEnemyTurn() {
        // Tick enemy status effects
        this.combatState.enemy.statusEffects.tick();
        
        // Apply player status effects at start of turn
        const statusMessages = this.combatState.player.statusEffects.applyStart(this.combatState.player);
        statusMessages.forEach(msg => this.addLog(msg));

        this.combatState.turn = 'player';
    }

    // Victory
    victory() {
        const enemy = this.combatState.enemy;
        const goldReward = Array.isArray(enemy.gold) 
            ? Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0] + 1)) + enemy.gold[0]
            : enemy.gold || 10;
        
        const expReward = enemy.exp || 10;

        this.addLog(`Victory! You defeated ${enemy.name}!`);
        this.addLog(`You gained ${goldReward} gold and ${expReward} experience!`);

        const result = {
            victory: true,
            gold: goldReward,
            exp: expReward,
            log: this.combatState.log
        };

        this.combatState = null;
        return result;
    }

    // Defeat
    defeat() {
        this.addLog(`Defeat! You have been defeated by ${this.combatState.enemy.name}!`);
        this.addLog('You will be returned to the last town you visited.');

        const result = {
            defeat: true,
            log: this.combatState.log
        };

        this.combatState = null;
        return result;
    }

    // Add log message
    addLog(message) {
        if (this.combatState) {
            this.combatState.log.push({
                turn: this.combatState.turnCount,
                message,
                timestamp: Date.now()
            });
        }
    }

    // Get combat state
    getCombatState() {
        return this.combatState;
    }

    // Check if in combat
    isInCombat() {
        return this.combatState !== null;
    }
}

export default CombatEngine;

