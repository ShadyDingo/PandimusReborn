// 7 Combat Domain system with abilities and passives
export const CombatDomains = {
    swordsmanship: {
        name: "Swordsmanship",
        weaponType: "sword",
        description: "Master the art of sword fighting",
        abilities: {
            10: {
                name: "Power Strike",
                type: "active",
                description: "Deal 150% damage with increased crit chance",
                damageMultiplier: 1.5,
                critBonus: 0.2,
                cooldown: 3
            },
            20: {
                name: "Cleave",
                type: "active",
                description: "Strike multiple enemies for 120% damage",
                damageMultiplier: 1.2,
                aoe: true,
                cooldown: 4
            },
            30: {
                name: "Whirlwind",
                type: "active",
                description: "Spin attack hitting all nearby enemies for 100% damage",
                damageMultiplier: 1.0,
                aoe: true,
                cooldown: 5
            },
            40: {
                name: "Berserker Rage",
                type: "active",
                description: "Increase AP by 50% for 3 turns, take 10% more damage",
                buff: { ap: 0.5, damageTaken: 0.1 },
                duration: 3,
                cooldown: 8
            },
            50: {
                name: "Devastating Blow",
                type: "active",
                description: "Massive single-target attack dealing 250% damage",
                damageMultiplier: 2.5,
                cooldown: 6
            }
        },
        passives: {
            5: {
                name: "Sword Mastery",
                description: "+5% AP with swords",
                effect: { ap: 0.05 }
            },
            15: {
                name: "Precision",
                description: "+10% crit chance with swords",
                effect: { crit: 0.1 }
            },
            25: {
                name: "Parry",
                description: "15% chance to parry attacks, reducing damage by 50%",
                effect: { parry: 0.15, parryReduction: 0.5 }
            },
            35: {
                name: "Swift Strikes",
                description: "+15% attack speed",
                effect: { haste: 0.15 }
            },
            45: {
                name: "Blade Dance",
                description: "+20% AP and +10% dodge",
                effect: { ap: 0.2, dodge: 0.1 }
            },
            60: {
                name: "Master Swordsman",
                description: "+25% AP with swords, +15% crit chance",
                effect: { ap: 0.25, crit: 0.15 }
            }
        }
    },

    closeCombat: {
        name: "Close Combat",
        weaponType: "dagger",
        description: "Excel at close-quarters combat with daggers",
        abilities: {
            10: {
                name: "Backstab",
                type: "active",
                description: "Deal 200% damage from behind, guaranteed crit",
                damageMultiplier: 2.0,
                guaranteedCrit: true,
                cooldown: 4
            },
            20: {
                name: "Poison Strike",
                type: "active",
                description: "Deal 120% damage and apply poison (DoT)",
                damageMultiplier: 1.2,
                statusEffect: { type: "poison", damage: 5, duration: 5 },
                cooldown: 5
            },
            30: {
                name: "Dual Wield",
                type: "active",
                description: "Attack twice in one turn",
                attacks: 2,
                cooldown: 6
            },
            40: {
                name: "Shadow Step",
                type: "active",
                description: "Teleport behind enemy, next attack is guaranteed crit",
                buff: { guaranteedCrit: true, duration: 1 },
                cooldown: 7
            },
            50: {
                name: "Assassinate",
                type: "active",
                description: "Instant kill if enemy below 25% HP, otherwise 300% damage",
                executeThreshold: 0.25,
                damageMultiplier: 3.0,
                cooldown: 10
            }
        },
        passives: {
            5: {
                name: "Dagger Mastery",
                description: "+5% AP with daggers",
                effect: { ap: 0.05 }
            },
            15: {
                name: "Quick Reflexes",
                description: "+15% dodge chance",
                effect: { dodge: 0.15 }
            },
            25: {
                name: "Poison Affinity",
                description: "Poison effects deal 50% more damage",
                effect: { poisonDamage: 0.5 }
            },
            35: {
                name: "Stealth",
                description: "+20% crit chance from behind",
                effect: { backstabCrit: 0.2 }
            },
            45: {
                name: "Vicious Strikes",
                description: "+25% crit damage",
                effect: { critDamage: 0.25 }
            },
            60: {
                name: "Master Assassin",
                description: "+30% AP with daggers, +20% crit chance",
                effect: { ap: 0.3, crit: 0.2 }
            }
        }
    },

    maceFighting: {
        name: "Mace Fighting",
        weaponType: "mace",
        description: "Crush enemies with heavy mace attacks",
        abilities: {
            10: {
                name: "Crushing Blow",
                type: "active",
                description: "Deal 180% damage, ignore 50% armor",
                damageMultiplier: 1.8,
                armorPenetration: 0.5,
                cooldown: 4
            },
            20: {
                name: "Stun Strike",
                type: "active",
                description: "Deal 130% damage and stun for 1 turn",
                damageMultiplier: 1.3,
                statusEffect: { type: "stun", duration: 1 },
                cooldown: 5
            },
            30: {
                name: "Shatter Armor",
                type: "active",
                description: "Reduce enemy armor by 50% for 3 turns",
                statusEffect: { type: "armorReduction", value: 0.5, duration: 3 },
                cooldown: 6
            },
            40: {
                name: "Berserker's Fury",
                type: "active",
                description: "Each hit increases damage by 20% (stacks up to 5)",
                buff: { damageStack: 0.2, maxStacks: 5 },
                cooldown: 8
            },
            50: {
                name: "Earthquake",
                type: "active",
                description: "AoE attack dealing 150% damage to all enemies",
                damageMultiplier: 1.5,
                aoe: true,
                cooldown: 7
            }
        },
        passives: {
            5: {
                name: "Mace Mastery",
                description: "+5% AP with maces",
                effect: { ap: 0.05 }
            },
            15: {
                name: "Armor Breaker",
                description: "Attacks ignore 20% of enemy armor",
                effect: { armorPenetration: 0.2 }
            },
            25: {
                name: "Heavy Hitter",
                description: "+15% damage, -10% attack speed",
                effect: { damage: 0.15, haste: -0.1 }
            },
            35: {
                name: "Unstoppable",
                description: "Immune to stuns and slows",
                effect: { stunImmune: true, slowImmune: true }
            },
            45: {
                name: "Brutal Force",
                description: "+25% AP, +10% crit chance",
                effect: { ap: 0.25, crit: 0.1 }
            },
            60: {
                name: "Master Crusher",
                description: "+30% AP with maces, ignore 30% armor",
                effect: { ap: 0.3, armorPenetration: 0.3 }
            }
        }
    },

    fireDominance: {
        name: "Fire Dominance",
        weaponType: "fire_staff",
        description: "Channel the power of fire through staves",
        abilities: {
            10: {
                name: "Fireball",
                type: "active",
                description: "Deal 140% fire damage",
                damageMultiplier: 1.4,
                damageType: "fire",
                cooldown: 3
            },
            20: {
                name: "Flame Burst",
                type: "active",
                description: "AoE fire damage dealing 120% to all enemies",
                damageMultiplier: 1.2,
                damageType: "fire",
                aoe: true,
                cooldown: 5
            },
            30: {
                name: "Ignite",
                type: "active",
                description: "Deal 100% damage and apply burn (fire DoT)",
                damageMultiplier: 1.0,
                damageType: "fire",
                statusEffect: { type: "burn", damage: 8, duration: 4 },
                cooldown: 4
            },
            40: {
                name: "Meteor",
                type: "active",
                description: "Massive AoE fire attack dealing 200% damage",
                damageMultiplier: 2.0,
                damageType: "fire",
                aoe: true,
                cooldown: 8
            },
            50: {
                name: "Inferno",
                type: "active",
                description: "Channel fire dealing 80% damage per turn for 5 turns",
                damageMultiplier: 0.8,
                damageType: "fire",
                channel: 5,
                cooldown: 10
            }
        },
        passives: {
            5: {
                name: "Fire Affinity",
                description: "+8% SP with fire staves",
                effect: { sp: 0.08 }
            },
            15: {
                name: "Burning Touch",
                description: "Attacks have 20% chance to apply burn",
                effect: { burnChance: 0.2 }
            },
            25: {
                name: "Flame Shield",
                description: "Reflect 15% of fire damage taken back to attacker",
                effect: { fireReflect: 0.15 }
            },
            35: {
                name: "Pyromancer",
                description: "+20% fire damage",
                effect: { fireDamage: 0.2 }
            },
            45: {
                name: "Molten Core",
                description: "+25% SP, +15% fire resistance",
                effect: { sp: 0.25, fireResist: 0.15 }
            },
            60: {
                name: "Master of Flames",
                description: "+30% SP with fire staves, +25% fire damage",
                effect: { sp: 0.3, fireDamage: 0.25 }
            }
        }
    },

    frostDominance: {
        name: "Frost Dominance",
        weaponType: "frost_staff",
        description: "Wield the power of ice and frost",
        abilities: {
            10: {
                name: "Ice Bolt",
                type: "active",
                description: "Deal 140% frost damage",
                damageMultiplier: 1.4,
                damageType: "frost",
                cooldown: 3
            },
            20: {
                name: "Frost Nova",
                type: "active",
                description: "AoE frost damage dealing 120% and slowing enemies",
                damageMultiplier: 1.2,
                damageType: "frost",
                aoe: true,
                statusEffect: { type: "slow", value: 0.3, duration: 3 },
                cooldown: 5
            },
            30: {
                name: "Freeze",
                type: "active",
                description: "Deal 100% damage and freeze enemy for 2 turns",
                damageMultiplier: 1.0,
                damageType: "frost",
                statusEffect: { type: "freeze", duration: 2 },
                cooldown: 6
            },
            40: {
                name: "Blizzard",
                type: "active",
                description: "Massive AoE frost attack dealing 180% damage",
                damageMultiplier: 1.8,
                damageType: "frost",
                aoe: true,
                cooldown: 8
            },
            50: {
                name: "Absolute Zero",
                type: "active",
                description: "Freeze all enemies for 3 turns, deal 150% damage",
                damageMultiplier: 1.5,
                damageType: "frost",
                aoe: true,
                statusEffect: { type: "freeze", duration: 3 },
                cooldown: 10
            }
        },
        passives: {
            5: {
                name: "Frost Affinity",
                description: "+8% SP with frost staves",
                effect: { sp: 0.08 }
            },
            15: {
                name: "Chilling Touch",
                description: "Attacks have 20% chance to slow enemies",
                effect: { slowChance: 0.2 }
            },
            25: {
                name: "Ice Armor",
                description: "+15% armor, +10% frost resistance",
                effect: { armor: 0.15, frostResist: 0.1 }
            },
            35: {
                name: "Cryomancer",
                description: "+20% frost damage",
                effect: { frostDamage: 0.2 }
            },
            45: {
                name: "Frozen Heart",
                description: "+25% SP, +15% frost resistance",
                effect: { sp: 0.25, frostResist: 0.15 }
            },
            60: {
                name: "Master of Ice",
                description: "+30% SP with frost staves, +25% frost damage",
                effect: { sp: 0.3, frostDamage: 0.25 }
            }
        }
    },

    holyWisdom: {
        name: "Holy Wisdom",
        weaponType: "holy_staff",
        description: "Channel divine power through holy staves",
        abilities: {
            10: {
                name: "Smite",
                type: "active",
                description: "Deal 140% holy damage",
                damageMultiplier: 1.4,
                damageType: "holy",
                cooldown: 3
            },
            20: {
                name: "Heal",
                type: "active",
                description: "Restore 30% of max HP",
                healPercent: 0.3,
                cooldown: 4
            },
            30: {
                name: "Divine Shield",
                type: "active",
                description: "Absorb 50% of damage for 3 turns",
                buff: { damageAbsorption: 0.5, duration: 3 },
                cooldown: 6
            },
            40: {
                name: "Holy Light",
                type: "active",
                description: "AoE holy damage dealing 150% and healing allies",
                damageMultiplier: 1.5,
                damageType: "holy",
                aoe: true,
                healPercent: 0.15,
                cooldown: 7
            },
            50: {
                name: "Resurrection",
                type: "active",
                description: "Revive with 50% HP if killed this turn",
                revive: true,
                revivePercent: 0.5,
                cooldown: 15
            }
        },
        passives: {
            5: {
                name: "Holy Affinity",
                description: "+8% SP with holy staves",
                effect: { sp: 0.08 }
            },
            15: {
                name: "Divine Protection",
                description: "+10% damage reduction",
                effect: { damageReduction: 0.1 }
            },
            25: {
                name: "Regeneration",
                description: "Regenerate 2% max HP per turn",
                effect: { hpRegen: 0.02 }
            },
            35: {
                name: "Blessed",
                description: "+20% holy damage, +10% healing",
                effect: { holyDamage: 0.2, healing: 0.1 }
            },
            45: {
                name: "Divine Aura",
                description: "+25% SP, +15% holy resistance",
                effect: { sp: 0.25, holyResist: 0.15 }
            },
            60: {
                name: "Master of Light",
                description: "+30% SP with holy staves, +25% holy damage",
                effect: { sp: 0.3, holyDamage: 0.25 }
            }
        }
    },

    darkKnowledge: {
        name: "Dark Knowledge",
        weaponType: "dark_staff",
        description: "Harness the power of darkness and shadow",
        abilities: {
            10: {
                name: "Shadow Bolt",
                type: "active",
                description: "Deal 140% dark damage",
                damageMultiplier: 1.4,
                damageType: "dark",
                cooldown: 3
            },
            20: {
                name: "Life Drain",
                type: "active",
                description: "Deal 120% damage and heal for 50% of damage dealt",
                damageMultiplier: 1.2,
                damageType: "dark",
                lifesteal: 0.5,
                cooldown: 4
            },
            30: {
                name: "Curse",
                type: "active",
                description: "Reduce enemy damage by 30% for 4 turns",
                statusEffect: { type: "curse", damageReduction: 0.3, duration: 4 },
                cooldown: 5
            },
            40: {
                name: "Dark Vortex",
                type: "active",
                description: "AoE dark damage dealing 160% and applying curse",
                damageMultiplier: 1.6,
                damageType: "dark",
                aoe: true,
                statusEffect: { type: "curse", damageReduction: 0.2, duration: 3 },
                cooldown: 7
            },
            50: {
                name: "Soul Harvest",
                type: "active",
                description: "Deal 200% damage, heal for 100% of damage dealt",
                damageMultiplier: 2.0,
                damageType: "dark",
                lifesteal: 1.0,
                cooldown: 8
            }
        },
        passives: {
            5: {
                name: "Dark Affinity",
                description: "+8% SP with dark staves",
                effect: { sp: 0.08 }
            },
            15: {
                name: "Vampiric Touch",
                description: "10% of damage dealt is converted to healing",
                effect: { lifesteal: 0.1 }
            },
            25: {
                name: "Shadow Form",
                description: "+15% dodge, +10% dark resistance",
                effect: { dodge: 0.15, darkResist: 0.1 }
            },
            35: {
                name: "Necromancer",
                description: "+20% dark damage, +10% lifesteal",
                effect: { darkDamage: 0.2, lifesteal: 0.1 }
            },
            45: {
                name: "Dark Aura",
                description: "+25% SP, +15% dark resistance",
                effect: { sp: 0.25, darkResist: 0.15 }
            },
            60: {
                name: "Master of Shadows",
                description: "+30% SP with dark staves, +25% dark damage",
                effect: { sp: 0.3, darkDamage: 0.25 }
            }
        }
    }
};

// Get unlocked abilities for a domain level
export function getUnlockedAbilities(domain, level) {
    const domainData = CombatDomains[domain];
    if (!domainData) return [];

    const abilities = [];
    Object.entries(domainData.abilities).forEach(([reqLevel, ability]) => {
        if (level >= parseInt(reqLevel)) {
            abilities.push({ ...ability, unlockLevel: parseInt(reqLevel) });
        }
    });
    return abilities;
}

// Get unlocked passives for a domain level
export function getUnlockedPassives(domain, level) {
    const domainData = CombatDomains[domain];
    if (!domainData) return [];

    const passives = [];
    Object.entries(domainData.passives).forEach(([reqLevel, passive]) => {
        if (level >= parseInt(reqLevel)) {
            passives.push({ ...passive, unlockLevel: parseInt(reqLevel) });
        }
    });
    return passives;
}

export default CombatDomains;

