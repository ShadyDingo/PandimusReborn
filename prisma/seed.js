const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const abilities = [
  {
    slug: "slash",
    name: "Slash",
    description: "A fast melee strike dealing physical damage.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 18,
    resourceCost: 0,
    cooldownTurns: 1,
    speedModifier: 0,
    tags: ["martial", "slashing"],
    formula: {
      type: "physical",
      scaling: { attack: 0.95 },
      variance: 0.15,
    },
  },
  {
    slug: "guard",
    name: "Guard",
    description: "Brace to reduce incoming damage for one turn.",
    school: "DEFENSE",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["defense", "starter"],
    formula: {
      type: "buff",
      effect: {
        name: "guard",
        duration: 1,
        statMultipliers: { defense: 1.3 },
        damageReduction: 0.25,
      },
    },
  },
  {
    slug: "power_strike",
    name: "Power Strike",
    description: "A heavy overhead swing that breaks through armor.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 26,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: -2,
    tags: ["martial", "bludgeon"],
    formula: {
      type: "physical",
      scaling: { attack: 1.1 },
      variance: 0.15,
      defenseScaling: 0.35,
    },
  },
  {
    slug: "twin_fangs",
    name: "Twin Fangs",
    description: "Strike twice in quick succession.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 12,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 1,
    tags: ["martial", "combo"],
    formula: {
      type: "physical",
      hits: 2,
      scaling: { attack: 0.75 },
      variance: 0.1,
    },
  },
  {
    slug: "bleeding_edge",
    name: "Bleeding Edge",
    description: "Open a wound that continues to bleed.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 16,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["martial", "dot"],
    formula: {
      type: "physical",
      scaling: { attack: 0.85 },
      status: {
        name: "bleed",
        chance: 1,
        damagePerTurn: 8,
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "shield_wall",
    name: "Shield Wall",
    description: "Raise an impenetrable defense for a short time.",
    school: "DEFENSE",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 4,
    speedModifier: -2,
    tags: ["defense", "support"],
    formula: {
      type: "buff",
      effect: {
        name: "shield_wall",
        duration: 2,
        statMultipliers: { defense: 1.5 },
        damageReduction: 0.3,
        shield: 25,
      },
    },
  },
  {
    slug: "battle_shout",
    name: "Battle Shout",
    description: "Rally yourself with a ferocious shout.",
    school: "TACTIC",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["support", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "battle_shout",
        duration: 3,
        statModifiers: { attack: 6 },
        statMultipliers: { attack: 1.1 },
      },
    },
  },
  {
    slug: "execute",
    name: "Execute",
    description: "Deliver a finishing blow to weakened foes.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 22,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["martial", "finisher"],
    formula: {
      type: "physical",
      scaling: { attack: 0.9 },
      finisher: {
        threshold: 0.35,
        multiplier: 2.2,
      },
    },
  },
  {
    slug: "shadow_step",
    name: "Shadow Step",
    description: "Slip into the shadows, emerging faster and deadlier.",
    school: "SHADOW",
    target: "SELF",
    basePower: 0,
    resourceCost: 3,
    cooldownTurns: 3,
    speedModifier: 2,
    tags: ["martial", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "shadow_step",
        duration: 2,
        statModifiers: { speed: 6 },
        statMultipliers: { attack: 1.15 },
      },
    },
  },
  {
    slug: "crushing_blow",
    name: "Crushing Blow",
    description: "Smash a foe with overwhelming force.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 24,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: -1,
    tags: ["martial", "bludgeon"],
    formula: {
      type: "physical",
      scaling: { attack: 1.15 },
      variance: 0.12,
      defenseScaling: 0.3,
    },
  },
  {
    slug: "shield_bash",
    name: "Shield Bash",
    description: "Bash the target with your shield, stunning them.",
    school: "DEFENSE",
    target: "ENEMY",
    basePower: 12,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: -1,
    tags: ["martial", "stun"],
    formula: {
      type: "physical",
      scaling: { attack: 0.6, defense: 0.5 },
      status: {
        name: "stunned",
        chance: 0.85,
        skipTurn: true,
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "piercing_arrow",
    name: "Piercing Arrow",
    description: "Loose an arrow that pierces armor with ease.",
    school: "RANGED",
    target: "ENEMY",
    basePower: 20,
    resourceCost: 0,
    cooldownTurns: 1,
    speedModifier: 1,
    tags: ["ranged", "piercing"],
    formula: {
      type: "physical",
      scaling: { attack: 1.0 },
      armorPenetration: 0.5,
      variance: 0.1,
    },
  },
  {
    slug: "volley",
    name: "Volley",
    description: "Rain arrows on all enemies.",
    school: "RANGED",
    target: "AREA",
    basePower: 14,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["ranged", "area"],
    formula: {
      type: "physical",
      scaling: { attack: 0.7 },
      variance: 0.2,
    },
  },
  {
    slug: "snipe",
    name: "Snipe",
    description: "Line up a deadly precision shot.",
    school: "RANGED",
    target: "ENEMY",
    basePower: 32,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: -2,
    tags: ["ranged", "burst"],
    formula: {
      type: "physical",
      scaling: { attack: 1.25 },
      variance: 0.05,
    },
  },
  {
    slug: "hobbling_shot",
    name: "Hobbling Shot",
    description: "Cripple an enemy's movement with a precise shot.",
    school: "RANGED",
    target: "ENEMY",
    basePower: 16,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["ranged", "control"],
    formula: {
      type: "physical",
      scaling: { attack: 0.9 },
      status: {
        name: "hobble",
        chance: 1,
        statModifiers: { speed: -5 },
        duration: 2,
        isDebuff: true,
      },
    },
  },
  {
    slug: "whirlwind",
    name: "Whirlwind",
    description: "Spin with blades extended, striking all nearby foes.",
    school: "WEAPON",
    target: "AREA",
    basePower: 14,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["martial", "area"],
    formula: {
      type: "physical",
      hits: 2,
      scaling: { attack: 0.65 },
      variance: 0.18,
    },
  },
  {
    slug: "rend_armor",
    name: "Rend Armor",
    description: "Rip into the target's defenses, exposing them.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 18,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["martial", "debuff"],
    formula: {
      type: "physical",
      scaling: { attack: 0.9 },
      status: {
        name: "rend",
        chance: 1,
        statMultipliers: { defense: 0.8 },
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "berserker_rage",
    name: "Berserker Rage",
    description: "Trade defense for overwhelming power.",
    school: "TACTIC",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 4,
    speedModifier: 1,
    tags: ["martial", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "berserker_rage",
        duration: 3,
        statModifiers: { attack: 12, defense: -4 },
      },
    },
  },
  {
    slug: "fortify",
    name: "Fortify",
    description: "Brace yourself against incoming harm.",
    school: "DEFENSE",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["defense", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "fortify",
        duration: 3,
        statMultipliers: { defense: 1.4 },
        damageReduction: 0.2,
      },
    },
  },
  {
    slug: "reckless_charge",
    name: "Reckless Charge",
    description: "Hurl yourself at the enemy, heedless of danger.",
    school: "WEAPON",
    target: "ENEMY",
    basePower: 24,
    resourceCost: 0,
    cooldownTurns: 3,
    speedModifier: 2,
    tags: ["martial", "charge"],
    formula: {
      type: "physical",
      scaling: { attack: 1.2 },
      variance: 0.2,
      selfStatus: {
        name: "exposed",
        duration: 2,
        statModifiers: { defense: -6 },
      },
    },
  },
  {
    slug: "earth_shatter",
    name: "Earth Shatter",
    description: "Smash the ground, sending shockwaves at every foe.",
    school: "EARTH",
    target: "AREA",
    basePower: 18,
    resourceCost: 3,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["physical", "area"],
    formula: {
      type: "physical",
      scaling: { attack: 0.85 },
      status: {
        name: "stunned",
        chance: 0.4,
        skipTurn: true,
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "earth_spike",
    name: "Earth Spike",
    description: "Impale a target with jagged stone.",
    school: "EARTH",
    target: "ENEMY",
    basePower: 16,
    resourceCost: 2,
    cooldownTurns: 1,
    speedModifier: 0,
    tags: ["earth", "control"],
    formula: {
      type: "physical",
      scaling: { attack: 0.75 },
      status: {
        name: "earth_spike",
        chance: 1,
        statModifiers: { speed: -3 },
        duration: 2,
        isDebuff: true,
      },
    },
  },
  {
    slug: "flame_wave",
    name: "Flame Wave",
    description: "Send a rolling wave of fire through enemy lines.",
    school: "FIRE",
    target: "AREA",
    basePower: 18,
    resourceCost: 7,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["magic", "fire", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.9 },
      status: {
        name: "burn",
        chance: 0.45,
        damagePerTurn: 8,
        duration: 2,
        isDebuff: true,
      },
    },
  },
  {
    slug: "inferno",
    name: "Inferno",
    description: "Engulf a single foe in hellfire.",
    school: "FIRE",
    target: "ENEMY",
    basePower: 30,
    resourceCost: 8,
    cooldownTurns: 3,
    speedModifier: -2,
    tags: ["magic", "fire", "burst"],
    formula: {
      type: "magical",
      scaling: { magic: 1.2 },
      variance: 0.2,
      status: {
        name: "burn",
        chance: 0.6,
        damagePerTurn: 10,
        duration: 3,
        isDebuff: true,
      },
      finisher: {
        threshold: 0.4,
        multiplier: 1.8,
      },
    },
  },
  {
    slug: "ice_shard",
    name: "Ice Shard",
    description: "Impale a foe with frost, slowing their movement.",
    school: "ICE",
    target: "ENEMY",
    basePower: 18,
    resourceCost: 4,
    cooldownTurns: 1,
    speedModifier: 0,
    tags: ["magic", "ice", "control"],
    formula: {
      type: "magical",
      scaling: { magic: 0.95 },
      status: {
        name: "chilled",
        chance: 0.85,
        statModifiers: { speed: -4 },
        duration: 2,
        isDebuff: true,
      },
    },
  },
  {
    slug: "hailstorm",
    name: "Hailstorm",
    description: "Batter every enemy with shards of ice.",
    school: "ICE",
    target: "AREA",
    basePower: 10,
    resourceCost: 7,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["magic", "ice", "area"],
    formula: {
      type: "magical",
      hits: 3,
      scaling: { magic: 0.6 },
      status: {
        name: "chilled",
        chance: 0.4,
        statModifiers: { speed: -2 },
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "frost_barrier",
    name: "Frost Barrier",
    description: "Encasing yourself in resilient frost.",
    school: "ICE",
    target: "SELF",
    basePower: 0,
    resourceCost: 5,
    cooldownTurns: 4,
    speedModifier: -1,
    tags: ["magic", "defense"],
    formula: {
      type: "buff",
      effect: {
        name: "frost_barrier",
        duration: 2,
        statMultipliers: { defense: 1.3 },
        damageReduction: 0.2,
        shield: 24,
      },
    },
  },
  {
    slug: "chain_lightning",
    name: "Chain Lightning",
    description: "Arc energy that ricochets through multiple enemies.",
    school: "STORM",
    target: "AREA",
    basePower: 16,
    resourceCost: 6,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["magic", "storm", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.9 },
      variance: 0.25,
      status: {
        name: "static",
        chance: 0.4,
        statModifiers: { speed: -2 },
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "thunderclap",
    name: "Thunderclap",
    description: "Crash thunder to stun surrounding enemies.",
    school: "STORM",
    target: "AREA",
    basePower: 14,
    resourceCost: 6,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["magic", "stun", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.8 },
      status: {
        name: "stunned",
        chance: 0.35,
        skipTurn: true,
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "tempest",
    name: "Tempest",
    description: "Harness the storm to move with blinding speed.",
    school: "STORM",
    target: "SELF",
    basePower: 0,
    resourceCost: 4,
    cooldownTurns: 3,
    speedModifier: 2,
    tags: ["magic", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "tempest",
        duration: 3,
        statModifiers: { speed: 5 },
        statMultipliers: { attack: 1.1 },
      },
    },
  },
  {
    slug: "gust",
    name: "Gust",
    description: "Bolster an ally with a swift tailwind.",
    school: "AIR",
    target: "ALLY",
    basePower: 0,
    resourceCost: 3,
    cooldownTurns: 2,
    speedModifier: 1,
    tags: ["support", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "gust",
        duration: 2,
        statModifiers: { speed: 4 },
      },
    },
  },
  {
    slug: "arcane_barrier",
    name: "Arcane Barrier",
    description: "Raise a barrier of pure mana to absorb harm.",
    school: "ARCANE",
    target: "SELF",
    basePower: 0,
    resourceCost: 4,
    cooldownTurns: 4,
    speedModifier: -2,
    tags: ["magic", "defense"],
    formula: {
      type: "buff",
      effect: {
        name: "arcane_barrier",
        duration: 2,
        statMultipliers: { defense: 1.25 },
        damageReduction: 0.25,
        shield: 30,
      },
    },
  },
  {
    slug: "mana_burn",
    name: "Mana Burn",
    description: "Scorch a foe's mana, weakening their spellcasting.",
    school: "ARCANE",
    target: "ENEMY",
    basePower: 14,
    resourceCost: 5,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["magic", "debuff"],
    formula: {
      type: "magical",
      scaling: { magic: 0.8 },
      status: {
        name: "mana_burn",
        chance: 1,
        statModifiers: { magic: -5 },
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "starfall",
    name: "Starfall",
    description: "Call down falling stars upon all foes.",
    school: "ARCANE",
    target: "AREA",
    basePower: 20,
    resourceCost: 8,
    cooldownTurns: 4,
    speedModifier: -2,
    tags: ["magic", "area", "burst"],
    formula: {
      type: "magical",
      scaling: { magic: 1.0 },
      variance: 0.3,
    },
  },
  {
    slug: "life_drain",
    name: "Life Drain",
    description: "Drain vitality from an enemy to empower yourself.",
    school: "SHADOW",
    target: "ENEMY",
    basePower: 18,
    resourceCost: 6,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["magic", "leech"],
    formula: {
      type: "magical",
      scaling: { magic: 1.0 },
      lifeSteal: 0.6,
    },
  },
  {
    slug: "poison_cloud",
    name: "Poison Cloud",
    description: "Envelop enemies in a toxic mist.",
    school: "NATURE",
    target: "AREA",
    basePower: 12,
    resourceCost: 6,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["magic", "dot", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.6 },
      status: {
        name: "poison",
        chance: 1,
        damagePerTurn: 10,
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "venom_dart",
    name: "Venom Dart",
    description: "Strike from range with a toxin-tipped dart.",
    school: "NATURE",
    target: "ENEMY",
    basePower: 16,
    resourceCost: 2,
    cooldownTurns: 1,
    speedModifier: 1,
    tags: ["ranged", "dot"],
    formula: {
      type: "physical",
      scaling: { attack: 0.8 },
      status: {
        name: "venom",
        chance: 0.9,
        damagePerTurn: 6,
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "crippling_poison",
    name: "Crippling Poison",
    description: "Coat your weapon in a debilitating toxin.",
    school: "NATURE",
    target: "ENEMY",
    basePower: 10,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["martial", "debuff"],
    formula: {
      type: "physical",
      scaling: { attack: 0.6 },
      status: {
        name: "crippling_poison",
        chance: 1,
        statModifiers: { attack: -4, speed: -2 },
        duration: 3,
        isDebuff: true,
      },
    },
  },
  {
    slug: "heal",
    name: "Healing Light",
    description: "Restore health to yourself or an ally.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 18,
    resourceCost: 8,
    cooldownTurns: 2,
    speedModifier: 1,
    tags: ["support", "healing"],
    formula: {
      type: "healing",
      scaling: { magic: 0.85 },
    },
  },
  {
    slug: "renew",
    name: "Renew",
    description: "Infuse an ally with restorative energy over time.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 10,
    resourceCost: 6,
    cooldownTurns: 2,
    speedModifier: 1,
    tags: ["support", "healing"],
    formula: {
      type: "healing",
      scaling: { magic: 0.4 },
      status: {
        name: "renew",
        chance: 1,
        healPerTurn: 12,
        duration: 3,
      },
    },
  },
  {
    slug: "ward_of_light",
    name: "Ward of Light",
    description: "Bless the target with protective radiance.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 0,
    resourceCost: 7,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["support", "defense"],
    formula: {
      type: "buff",
      effect: {
        name: "ward_of_light",
        duration: 3,
        damageReduction: 0.2,
        healPerTurn: 6,
      },
    },
  },
  {
    slug: "purify",
    name: "Purify",
    description: "Cleanse an ally of harmful effects.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 12,
    resourceCost: 5,
    cooldownTurns: 2,
    speedModifier: 1,
    tags: ["support", "cleanse"],
    formula: {
      type: "healing",
      scaling: { magic: 0.3 },
      cleanse: true,
    },
  },
  {
    slug: "revitalize",
    name: "Revitalize",
    description: "Rejuvenate an ally with radiant energy.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 20,
    resourceCost: 7,
    cooldownTurns: 3,
    speedModifier: 1,
    tags: ["support", "healing"],
    formula: {
      type: "healing",
      scaling: { magic: 0.7 },
      status: {
        name: "revitalize",
        chance: 1,
        healPerTurn: 8,
        duration: 2,
      },
    },
  },
  {
    slug: "blessing_of_vigor",
    name: "Blessing of Vigor",
    description: "Imbue an ally with martial might.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 0,
    resourceCost: 4,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["support", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "blessing_of_vigor",
        duration: 3,
        statModifiers: { attack: 6, speed: 3 },
      },
    },
  },
  {
    slug: "sanctuary",
    name: "Sanctuary",
    description: "Create a protective sanctuary around an ally.",
    school: "DIVINE",
    target: "ALLY",
    basePower: 0,
    resourceCost: 6,
    cooldownTurns: 4,
    speedModifier: 0,
    tags: ["support", "defense"],
    formula: {
      type: "buff",
      effect: {
        name: "sanctuary",
        duration: 3,
        damageReduction: 0.25,
        shield: 30,
      },
    },
  },
  {
    slug: "spirit_link",
    name: "Spirit Link",
    description: "Bind yourself to an ally, sharing resilience.",
    school: "SPIRIT",
    target: "ALLY",
    basePower: 0,
    resourceCost: 5,
    cooldownTurns: 4,
    speedModifier: 0,
    tags: ["support", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "spirit_link",
        duration: 3,
        statMultipliers: { defense: 1.15 },
        healPerTurn: 6,
      },
      selfStatus: {
        name: "spirit_link",
        duration: 3,
        statMultipliers: { defense: 1.05 },
      },
    },
  },
  {
    slug: "wild_growth",
    name: "Wild Growth",
    description: "Encourage natural regeneration in the target.",
    school: "NATURE",
    target: "ALLY",
    basePower: 14,
    resourceCost: 6,
    cooldownTurns: 3,
    speedModifier: 0,
    tags: ["support", "healing"],
    formula: {
      type: "healing",
      scaling: { magic: 0.5 },
      status: {
        name: "wild_growth",
        chance: 1,
        healPerTurn: 14,
        duration: 3,
      },
    },
  },
  {
    slug: "entangling_roots",
    name: "Entangling Roots",
    description: "Snare an enemy in living roots.",
    school: "NATURE",
    target: "ENEMY",
    basePower: 12,
    resourceCost: 4,
    cooldownTurns: 2,
    speedModifier: -1,
    tags: ["nature", "control"],
    formula: {
      type: "magical",
      scaling: { magic: 0.6 },
      status: {
        name: "rooted",
        chance: 0.9,
        skipTurn: true,
        statModifiers: { speed: -6 },
        duration: 1,
        isDebuff: true,
      },
    },
  },
  {
    slug: "stone_skin",
    name: "Stone Skin",
    description: "Harden your flesh like stone.",
    school: "EARTH",
    target: "SELF",
    basePower: 0,
    resourceCost: 5,
    cooldownTurns: 4,
    speedModifier: -1,
    tags: ["earth", "buff"],
    formula: {
      type: "buff",
      effect: {
        name: "stone_skin",
        duration: 3,
        statMultipliers: { defense: 1.6 },
        damageReduction: 0.2,
      },
    },
  },
  {
    slug: "smite",
    name: "Smite",
    description: "Call down holy wrath upon an opponent.",
    school: "DIVINE",
    target: "ENEMY",
    basePower: 24,
    resourceCost: 6,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["magic", "holy"],
    formula: {
      type: "magical",
      scaling: { magic: 1.0 },
      status: {
        name: "radiant_mark",
        chance: 1,
        statMultipliers: { defense: 0.9 },
        duration: 2,
        isDebuff: true,
      },
    },
  },
  {
    slug: "radiant_blast",
    name: "Radiant Blast",
    description: "Release a burst of purifying light at all foes.",
    school: "DIVINE",
    target: "AREA",
    basePower: 18,
    resourceCost: 7,
    cooldownTurns: 3,
    speedModifier: -1,
    tags: ["magic", "holy", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.85 },
      status: {
        name: "dazzled",
        chance: 0.3,
        statModifiers: { attack: -3 },
        duration: 2,
        isDebuff: true,
      },
    },
  },
];


const items = [
  {
    slug: "rusty-sword",
    name: "Rusty Sword",
    description: "A nicked blade salvaged from forgotten battles.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 3
    },
  },
  {
    slug: "bronze-saber",
    name: "Bronze Saber",
    description: "Lightweight sword that still holds a sharp edge.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 5,
      speed: 1
    },
  },
  {
    slug: "iron-sword",
    name: "Iron Sword",
    description: "Reliable blade for close combat.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 6
    },
  },
  {
    slug: "steel-longsword",
    name: "Steel Longsword",
    description: "Balanced blade favored by trained soldiers.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 9,
      defense: 1
    },
  },
  {
    slug: "knights-bastard-sword",
    name: "Knight's Bastard Sword",
    description: "Versatile blade carried by veteran cavalry.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 11,
      defense: 2
    },
  },
  {
    slug: "mithril-blade",
    name: "Mithril Blade",
    description: "Featherlight sword that cuts armor like cloth.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 12,
      speed: 2
    },
  },
  {
    slug: "sunsteel-greatsword",
    name: "Sunsteel Greatsword",
    description: "A radiant blade that cleaves through armor with ease.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 14,
      defense: 4
    },
  },
  {
    slug: "sovereign-lightsaber",
    name: "Sovereign Lightsaber",
    description: "Legendary blade that blazes with starfire.",
    type: "WEAPON",
    rarity: "LEGENDARY",
    slot: "WEAPON",
    stats: {
      attack: 17,
      speed: 3,
      magic: 2
    },
  },
  {
    slug: "splintered-axe",
    name: "Splintered Axe",
    description: "Crude axe held together with rope and grit.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 4
    },
  },
  {
    slug: "iron-battleaxe",
    name: "Iron Battleaxe",
    description: "Weighted axe with a brutal bite.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 7,
      defense: 1
    },
  },
  {
    slug: "tempered-greataxe",
    name: "Tempered Greataxe",
    description: "Refined edge built for decisive strikes.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 10,
      health: 10
    },
  },
  {
    slug: "rune-etched-axe",
    name: "Rune-etched Axe",
    description: "Runes hum across the blade, driving each swing.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 12,
      speed: 2
    },
  },
  {
    slug: "doomcleaver",
    name: "Doomcleaver",
    description: "An infamous axe that sunders shields and stone.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 16,
      defense: 3
    },
  },
  {
    slug: "chipped-dagger",
    name: "Chipped Dagger",
    description: "Short blade often used by desperate thieves.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 3,
      speed: 2
    },
  },
  {
    slug: "tempered-stiletto",
    name: "Tempered Stiletto",
    description: "Slender blade that slides between armor plates.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 6,
      speed: 3
    },
  },
  {
    slug: "nightglass-knife",
    name: "Nightglass Knife",
    description: "Reflective dagger forged for shadow work.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 8,
      speed: 4
    },
  },
  {
    slug: "soulrender-dagger",
    name: "Soulrender Dagger",
    description: "A lightweight dagger that rewards aggressive play.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 9,
      speed: 4
    },
  },
  {
    slug: "queens-fang",
    name: "Queen's Fang",
    description: "Ceremonial blade rumored to drink ambition.",
    type: "WEAPON",
    rarity: "LEGENDARY",
    slot: "WEAPON",
    stats: {
      attack: 11,
      speed: 5
    },
  },
  {
    slug: "cracked-maul",
    name: "Cracked Maul",
    description: "Heavy hammer patched with iron bands.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 5
    },
  },
  {
    slug: "iron-warhammer",
    name: "Iron Warhammer",
    description: "Reliable hammer used by frontier militia.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 8,
      health: 10
    },
  },
  {
    slug: "steel-maul",
    name: "Steel Maul",
    description: "Dense hammer that shatters brittle defenses.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 11,
      defense: 2
    },
  },
  {
    slug: "thunder-maul",
    name: "Thunder Maul",
    description: "Thunderbound core erupts with every impact.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 14,
      health: 20
    },
  },
  {
    slug: "atlas-warhammer",
    name: "Atlas Warhammer",
    description: "Crushes foes while keeping the wielder standing.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 16,
      health: 30
    },
  },
  {
    slug: "celestial-pillar",
    name: "Celestial Pillar",
    description: "A mythic hammer said to anchor the sky.",
    type: "WEAPON",
    rarity: "LEGENDARY",
    slot: "WEAPON",
    stats: {
      attack: 18,
      health: 35,
      defense: 4
    },
  },
  {
    slug: "weathered-spear",
    name: "Weathered Spear",
    description: "A simple spear with a splintered haft.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 4,
      speed: 1
    },
  },
  {
    slug: "steel-glaive",
    name: "Steel Glaive",
    description: "Polearm granting reach and leverage.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 8,
      defense: 1
    },
  },
  {
    slug: "dragonscale-lance",
    name: "Dragonscale Lance",
    description: "Polearm rimmed with resilient dragonhide.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 11,
      speed: 2
    },
  },
  {
    slug: "phoenix-halberd",
    name: "Phoenix Halberd",
    description: "Reborn in flame, eager for battlefield glory.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 14,
      speed: 3
    },
  },
  {
    slug: "weathered-shortbow",
    name: "Weathered Shortbow",
    description: "A worn bow suited for close skirmishes.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 4,
      speed: 1
    },
  },
  {
    slug: "sturdy-longbow",
    name: "Sturdy Longbow",
    description: "Reliable bow with decent draw weight.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 7,
      speed: 2
    },
  },
  {
    slug: "hunters-compound",
    name: "Hunter's Compound Bow",
    description: "Composite limbs steady each shot.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 9,
      speed: 3
    },
  },
  {
    slug: "wyrmwood-bow",
    name: "Wyrmwood Bow",
    description: "Elven craftsmanship grants both power and poise.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 10,
      speed: 5
    },
  },
  {
    slug: "starfall-bow",
    name: "Starfall Bow",
    description: "The sky itself seems to guide its arrows.",
    type: "WEAPON",
    rarity: "LEGENDARY",
    slot: "WEAPON",
    stats: {
      attack: 12,
      speed: 4,
      magic: 2
    },
  },
  {
    slug: "rusted-crossbow",
    name: "Rusted Crossbow",
    description: "Crossbow cobbled together from mismatched parts.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 5
    },
  },
  {
    slug: "steel-crossbow",
    name: "Steel Crossbow",
    description: "Reliable crossbow with a crisp trigger.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      attack: 8,
      defense: 1
    },
  },
  {
    slug: "arbalest-of-precision",
    name: "Arbalest of Precision",
    description: "Windlass pull fires bolts with frightening force.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      attack: 11,
      speed: 2
    },
  },
  {
    slug: "dragonbreath-arbalest",
    name: "Dragonbreath Arbalest",
    description: "Forged to pierce wyrmhide and plate alike.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      attack: 13,
      defense: 2
    },
  },
  {
    slug: "knotted-staff",
    name: "Knotted Staff",
    description: "An oaken staff etched with novice sigils.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      magic: 5
    },
  },
  {
    slug: "apprentice-staff",
    name: "Apprentice Staff",
    description: "Balanced staff to learn channeling safely.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      magic: 6,
      speed: 1
    },
  },
  {
    slug: "arcanist-staff",
    name: "Arcanist Staff",
    description: "Runic focus to steady advanced spellwork.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      magic: 9,
      speed: 1
    },
  },
  {
    slug: "stormcall-staff",
    name: "Stormcall Staff",
    description: "Focuses lightning into devastating torrents.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      magic: 12,
      attack: 4
    },
  },
  {
    slug: "voidsong-staff",
    name: "Voidsong Staff",
    description: "Sings with the hum of distant stars.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      magic: 14,
      speed: 3
    },
  },
  {
    slug: "copper-scepter",
    name: "Copper Scepter",
    description: "Simple focus used by hedge magi.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      magic: 4
    },
  },
  {
    slug: "gilded-scepter",
    name: "Gilded Scepter",
    description: "A showy symbol infused with true power.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "WEAPON",
    stats: {
      magic: 7,
      speed: 1
    },
  },
  {
    slug: "emberfocus-scepter",
    name: "Emberfocus Scepter",
    description: "A battle-mage favorite that accelerates spellcasting.",
    type: "WEAPON",
    rarity: "RARE",
    slot: "WEAPON",
    stats: {
      magic: 9,
      speed: 3
    },
  },
  {
    slug: "oracle-scepter",
    name: "Oracle Scepter",
    description: "Cradles a gem that resonates with prophecy.",
    type: "WEAPON",
    rarity: "EPIC",
    slot: "WEAPON",
    stats: {
      magic: 11,
      defense: 2
    },
  },
  {
    slug: "splintered-shield",
    name: "Splintered Shield",
    description: "Scarred wood reinforced with crude plating.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "OFFHAND",
    stats: {
      defense: 5,
      health: 10
    },
  },
  {
    slug: "iron-kiteshield",
    name: "Iron Kiteshield",
    description: "Standard issue shield for militia lines.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "OFFHAND",
    stats: {
      defense: 7,
      health: 14
    },
  },
  {
    slug: "steel-aegis",
    name: "Steel Aegis",
    description: "Polished shield that turns aside heavy blows.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "OFFHAND",
    stats: {
      defense: 9,
      health: 18
    },
  },
  {
    slug: "aegis-bulwark",
    name: "Aegis Bulwark",
    description: "Tower shield that turns aside punishing blows.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "OFFHAND",
    stats: {
      defense: 11,
      health: 25
    },
  },
  {
    slug: "dragonshell-bulwark",
    name: "Dragonshell Bulwark",
    description: "Legendary shield plated in iridescent scales.",
    type: "ARMOR",
    rarity: "LEGENDARY",
    slot: "OFFHAND",
    stats: {
      defense: 13,
      health: 32
    },
  },
  {
    slug: "travelers-grimoire",
    name: "Traveler's Grimoire",
    description: "Worn tome of tried-and-true cantrips.",
    type: "ACCESSORY",
    rarity: "COMMON",
    slot: "OFFHAND",
    stats: {
      magic: 5,
      defense: 2
    },
  },
  {
    slug: "codex-of-echoes",
    name: "Codex of Echoes",
    description: "Pages whisper past incantations.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "OFFHAND",
    stats: {
      magic: 7,
      speed: 2
    },
  },
  {
    slug: "spellbinder-codex",
    name: "Spellbinder Codex",
    description: "Arcane grimoire storing battle-tested incantations.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "OFFHAND",
    stats: {
      magic: 10,
      defense: 4
    },
  },
  {
    slug: "libram-of-infinity",
    name: "Libram of Infinity",
    description: "Infinite script rewrites the battlefield.",
    type: "ACCESSORY",
    rarity: "EPIC",
    slot: "OFFHAND",
    stats: {
      magic: 12,
      speed: 3
    },
  },
  {
    slug: "simple-quiver",
    name: "Simple Quiver",
    description: "Quiver stocked with sturdy fletching.",
    type: "ACCESSORY",
    rarity: "COMMON",
    slot: "OFFHAND",
    stats: {
      attack: 3,
      speed: 1
    },
  },
  {
    slug: "hunters-quiver",
    name: "Hunter's Quiver",
    description: "Weighted arrows and field tools for ranged specialists.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "OFFHAND",
    stats: {
      attack: 5,
      speed: 2,
      magic: 2
    },
  },
  {
    slug: "rangers-cartridge",
    name: "Ranger's Cartridge",
    description: "Modular quiver for any terrain.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "OFFHAND",
    stats: {
      attack: 7,
      speed: 3
    },
  },
  {
    slug: "totemic-idol",
    name: "Totemic Idol",
    description: "Carved charm that channels ancestral vigor.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "OFFHAND",
    stats: {
      health: 30,
      magic: 6
    },
  },
  {
    slug: "spirit-ward-orb",
    name: "Spirit Ward Orb",
    description: "Orb that redirects dangerous energies.",
    type: "ACCESSORY",
    rarity: "EPIC",
    slot: "OFFHAND",
    stats: {
      defense: 6,
      magic: 5
    },
  },
  {
    slug: "shadowglass-dirk",
    name: "Shadowglass Dirk",
    description: "A mirrored blade perfect for dual-wielding rogues.",
    type: "WEAPON",
    rarity: "UNCOMMON",
    slot: "OFFHAND",
    stats: {
      attack: 6,
      speed: 3
    },
  },
  {
    slug: "tattered-cowl",
    name: "Tattered Cowl",
    description: "Barely stitched hood offering minimal focus.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HEAD",
    stats: {
      magic: 2
    },
  },
  {
    slug: "apprentice-cowl",
    name: "Apprentice Cowl",
    description: "Simple hood for fledgling casters.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HEAD",
    stats: {
      magic: 4
    },
  },
  {
    slug: "scholars-cowl",
    name: "Scholar's Cowl",
    description: "Layered fabric threaded with sigils.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "HEAD",
    stats: {
      magic: 6,
      speed: 1
    },
  },
  {
    slug: "archmage-cowl",
    name: "Archmage Cowl",
    description: "Resonant hood that heightens awareness.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HEAD",
    stats: {
      magic: 8,
      speed: 2
    },
  },
  {
    slug: "crown-of-abandon",
    name: "Crown of Abandon",
    description: "Whispers temptation alongside great power.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "HEAD",
    stats: {
      magic: 10,
      speed: 2
    },
  },
  {
    slug: "patched-hood",
    name: "Patched Hood",
    description: "Mended leather hood for scouts.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HEAD",
    stats: {
      attack: 2,
      speed: 2
    },
  },
  {
    slug: "scout-hood",
    name: "Scout Hood",
    description: "Well-oiled hood that keeps vision clear.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "HEAD",
    stats: {
      attack: 3,
      speed: 3
    },
  },
  {
    slug: "stalker-mask",
    name: "Stalker Mask",
    description: "Intimidating mask that heightens predatory focus.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HEAD",
    stats: {
      attack: 5,
      speed: 3
    },
  },
  {
    slug: "shadowstalker-hood",
    name: "Shadowstalker Hood",
    description: "Veiled hood that thrives in darkness.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "HEAD",
    stats: {
      attack: 6,
      speed: 4
    },
  },
  {
    slug: "dented-helm",
    name: "Dented Helm",
    description: "Battered helm that still offers protection.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HEAD",
    stats: {
      defense: 4,
      health: 8
    },
  },
  {
    slug: "iron-ward-helm",
    name: "Iron Ward Helm",
    description: "Stalwart helm favored by frontline defenders.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "HEAD",
    stats: {
      defense: 6,
      health: 12
    },
  },
  {
    slug: "steel-sentinel-helm",
    name: "Steel Sentinel Helm",
    description: "Polished helm with reinforced visor.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HEAD",
    stats: {
      defense: 8,
      health: 15
    },
  },
  {
    slug: "champions-greathelm",
    name: "Champion's Greathelm",
    description: "Trophy helm worn by arena legends.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "HEAD",
    stats: {
      defense: 10,
      health: 18
    },
  },
  {
    slug: "astral-visor",
    name: "Astral Visor",
    description: "Crystalline visor that sharpens arcane insight.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HEAD",
    stats: {
      magic: 8,
      speed: 3
    },
  },
  {
    slug: "tattered-robes",
    name: "Tattered Robes",
    description: "Threadbare robes offering scant focus.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      magic: 3
    },
  },
  {
    slug: "apprentice-robes",
    name: "Apprentice Robes",
    description: "Basic robes for study and practice.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      magic: 5
    },
  },
  {
    slug: "elegant-robes",
    name: "Elegant Robes",
    description: "Fine robes lined with protective runes.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "CHEST",
    stats: {
      magic: 7,
      speed: 2
    },
  },
  {
    slug: "scholars-robes",
    name: "Scholar's Robes",
    description: "Robes layered with mnemonic runes.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "CHEST",
    stats: {
      magic: 8,
      defense: 2
    },
  },
  {
    slug: "wizards-robes",
    name: "Wizard's Robes",
    description: "Prestigious robes woven with arcane thread.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "CHEST",
    stats: {
      magic: 10,
      speed: 3
    },
  },
  {
    slug: "robes-of-abandon",
    name: "Robes of Abandon",
    description: "Legend says these robes choose reckless wielders.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "CHEST",
    stats: {
      magic: 13,
      speed: 3,
      health: 10
    },
  },
  {
    slug: "patched-leathers",
    name: "Patched Leathers",
    description: "Surplus armor held together with hopes and straps.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      defense: 4,
      speed: 1
    },
  },
  {
    slug: "reinforced-leathers",
    name: "Reinforced Leathers",
    description: "Flexible armor with metal rivets.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "CHEST",
    stats: {
      defense: 6,
      speed: 2
    },
  },
  {
    slug: "hunters-coat",
    name: "Hunter's Coat",
    description: "Weatherproof coat lined with hidden pockets.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "CHEST",
    stats: {
      attack: 5,
      speed: 3
    },
  },
  {
    slug: "raiders-jacket",
    name: "Raider's Jacket",
    description: "Reinforced leather for relentless hit-and-run tactics.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "CHEST",
    stats: {
      attack: 6,
      speed: 3
    },
  },
  {
    slug: "shadowmantle-leathers",
    name: "Shadowmantle Leathers",
    description: "Allows the wearer to melt into the dark.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "CHEST",
    stats: {
      attack: 7,
      speed: 4
    },
  },
  {
    slug: "dented-breastplate",
    name: "Dented Breastplate",
    description: "Heirloom armor that has seen many battles.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      defense: 6,
      health: 18
    },
  },
  {
    slug: "iron-breastplate",
    name: "Iron Breastplate",
    description: "Solid plating for aspiring guardians.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      defense: 7,
      health: 20
    },
  },
  {
    slug: "steel-breastplate",
    name: "Steel Breastplate",
    description: "Expertly crafted plate harness.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "CHEST",
    stats: {
      defense: 9,
      health: 24
    },
  },
  {
    slug: "wyrdforged-mail",
    name: "Wyrdforged Mail",
    description: "Hybrid mail interwoven with arcane sigils.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "CHEST",
    stats: {
      defense: 8,
      magic: 6
    },
  },
  {
    slug: "bastion-platemail",
    name: "Bastion Platemail",
    description: "Heavy plating that anchors a defensive bulwark.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "CHEST",
    stats: {
      defense: 12,
      health: 40
    },
  },
  {
    slug: "sovereign-plate",
    name: "Sovereign Plate",
    description: "Ceremonial armor bristling with protective wards.",
    type: "ARMOR",
    rarity: "LEGENDARY",
    slot: "CHEST",
    stats: {
      defense: 14,
      health: 45
    },
  },
  {
    slug: "threadbare-gloves",
    name: "Threadbare Gloves",
    description: "Provide just enough warmth for study.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HANDS",
    stats: {
      magic: 2
    },
  },
  {
    slug: "spellthread-gloves",
    name: "Spellthread Gloves",
    description: "Infused fibers that channel mana efficiently.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "HANDS",
    stats: {
      magic: 6,
      speed: 2
    },
  },
  {
    slug: "channelers-wraps",
    name: "Channeler's Wraps",
    description: "Braces wrists for long incantations.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HANDS",
    stats: {
      magic: 7,
      defense: 2
    },
  },
  {
    slug: "shadowgrip-gloves",
    name: "Shadowgrip Gloves",
    description: "Ensures every strike finds a weakness.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "HANDS",
    stats: {
      attack: 5,
      speed: 3
    },
  },
  {
    slug: "hunters-grips",
    name: "Hunter's Grips",
    description: "Leather gloves lined with steadying pads.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HANDS",
    stats: {
      attack: 6,
      speed: 2
    },
  },
  {
    slug: "guardian-mitts",
    name: "Guardian Mitts",
    description: "Padded gauntlets that blunt incoming blows.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "HANDS",
    stats: {
      defense: 5,
      health: 15
    },
  },
  {
    slug: "gauntlets-of-fury",
    name: "Gauntlets of Fury",
    description: "Brutal gauntlets that add weight to every swing.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HANDS",
    stats: {
      attack: 7,
      defense: 4
    },
  },
  {
    slug: "titan-gauntlets",
    name: "Titan Gauntlets",
    description: "Colossal gauntlets that steady siege blows.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "HANDS",
    stats: {
      attack: 8,
      defense: 5,
      health: 20
    },
  },
  {
    slug: "wildgrowth-bracers",
    name: "Wildgrowth Bracers",
    description: "Spriggan-grown bark brimming with lifeforce.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "HANDS",
    stats: {
      health: 20,
      magic: 5
    },
  },
  {
    slug: "frayed-pants",
    name: "Frayed Pants",
    description: "Loose garments that move with the caster.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "LEGS",
    stats: {
      magic: 2
    },
  },
  {
    slug: "apprentice-slacks",
    name: "Apprentice Slacks",
    description: "Light trousers for endless practice sessions.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "LEGS",
    stats: {
      magic: 4
    },
  },
  {
    slug: "scholars-legwraps",
    name: "Scholar's Legwraps",
    description: "Embroidered wraps marked with mnemonic runes.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "LEGS",
    stats: {
      magic: 6,
      speed: 1
    },
  },
  {
    slug: "archmage-trousers",
    name: "Archmage Trousers",
    description: "Woven with sigils that reduce channeling strain.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "LEGS",
    stats: {
      magic: 8,
      speed: 3
    },
  },
  {
    slug: "patched-breeches",
    name: "Patched Breeches",
    description: "Traveling breeches reinforced at the knees.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "LEGS",
    stats: {
      attack: 3,
      speed: 2
    },
  },
  {
    slug: "windstep-leggings",
    name: "Windstep Leggings",
    description: "Feather-lined leggings for rapid repositioning.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "LEGS",
    stats: {
      attack: 4,
      speed: 5
    },
  },
  {
    slug: "thornroot-breeches",
    name: "Thornroot Breeches",
    description: "Interlaced vines that reinforce endurance.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "LEGS",
    stats: {
      magic: 4,
      health: 20
    },
  },
  {
    slug: "assailant-pants",
    name: "Assailant Pants",
    description: "Tailored for relentless pressure and pursuit.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "LEGS",
    stats: {
      attack: 5,
      defense: 4
    },
  },
  {
    slug: "dented-greaves",
    name: "Dented Greaves",
    description: "Greaves showing scars from countless marches.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "LEGS",
    stats: {
      defense: 5,
      health: 15
    },
  },
  {
    slug: "legion-greaves",
    name: "Legion Greaves",
    description: "March-forged greaves that never waver.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "LEGS",
    stats: {
      defense: 6,
      health: 18
    },
  },
  {
    slug: "steel-legguards",
    name: "Steel Legguards",
    description: "Forged plates wrapping the entire thigh.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "LEGS",
    stats: {
      defense: 7,
      health: 20
    },
  },
  {
    slug: "imperial-greaves",
    name: "Imperial Greaves",
    description: "Polished greaves awarded to royal sentries.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "LEGS",
    stats: {
      defense: 9,
      health: 24
    },
  },
  {
    slug: "soft-house-slippers",
    name: "Soft House Slippers",
    description: "Comfortable slippers favored by scholars.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "FEET",
    stats: {
      magic: 2
    },
  },
  {
    slug: "runebound-sandals",
    name: "Runebound Sandals",
    description: "Sigils traced across the soles quicken spellwork.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "FEET",
    stats: {
      magic: 4,
      speed: 4
    },
  },
  {
    slug: "scout-boots",
    name: "Scout Boots",
    description: "Quiet boots built for long treks.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "FEET",
    stats: {
      attack: 3,
      speed: 3
    },
  },
  {
    slug: "swiftstep-boots",
    name: "Swiftstep Boots",
    description: "Favored by messengers and cutpurses alike.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "FEET",
    stats: {
      speed: 6
    },
  },
  {
    slug: "stalker-treads",
    name: "Stalker Treads",
    description: "Soft leather to silence even the heaviest step.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "FEET",
    stats: {
      attack: 4,
      speed: 3
    },
  },
  {
    slug: "stalwart-boots",
    name: "Stalwart Boots",
    description: "Dependable boots that keep the wearer rooted.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "FEET",
    stats: {
      defense: 5,
      health: 15
    },
  },
  {
    slug: "earthshaker-sabatons",
    name: "Earthshaker Sabatons",
    description: "Each step quakes with unyielding resolve.",
    type: "ARMOR",
    rarity: "RARE",
    slot: "FEET",
    stats: {
      defense: 7,
      health: 18,
      attack: 3
    },
  },
  {
    slug: "knight-sabatons",
    name: "Knight Sabatons",
    description: "Polished sabatons with reinforced joints.",
    type: "ARMOR",
    rarity: "UNCOMMON",
    slot: "FEET",
    stats: {
      defense: 6,
      health: 16
    },
  },
  {
    slug: "tempest-greaves",
    name: "Tempest Greaves",
    description: "Harnesses storm winds for swift strides.",
    type: "ARMOR",
    rarity: "EPIC",
    slot: "FEET",
    stats: {
      speed: 5,
      attack: 2
    },
  },
  {
    slug: "copper-band",
    name: "Copper Band",
    description: "Simple band carrying a charge of courage.",
    type: "ACCESSORY",
    rarity: "COMMON",
    slot: "ACCESSORY_1",
    stats: {
      attack: 2
    },
  },
  {
    slug: "arcane-ring",
    name: "Arcane Ring",
    description: "Ring humming with latent magic.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_1",
    stats: {
      magic: 5
    },
  },
  {
    slug: "ring-of-sinew",
    name: "Ring of Sinew",
    description: "Braided metal that reinforces striking power.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_1",
    stats: {
      attack: 4,
      speed: 2
    },
  },
  {
    slug: "ring-of-warding",
    name: "Ring of Warding",
    description: "Protective sigils etched into tempered steel.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_1",
    stats: {
      defense: 4,
      health: 15
    },
  },
  {
    slug: "ring-of-focus",
    name: "Ring of Focus",
    description: "Keeps casting tempo steady under pressure.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "ACCESSORY_1",
    stats: {
      magic: 6,
      speed: 3
    },
  },
  {
    slug: "ring-of-vigor",
    name: "Ring of Vigor",
    description: "Infuses the wearer with a warrior's stamina.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_1",
    stats: {
      health: 20,
      attack: 3
    },
  },
  {
    slug: "ring-of-clarity",
    name: "Ring of Clarity",
    description: "Balances physical and arcane focus.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "ACCESSORY_1",
    stats: {
      attack: 4,
      magic: 4
    },
  },
  {
    slug: "ring-of-superiority",
    name: "Ring of Superiority",
    description: "Radiates the confidence of champions.",
    type: "ACCESSORY",
    rarity: "EPIC",
    slot: "ACCESSORY_1",
    stats: {
      attack: 5,
      defense: 3,
      magic: 3
    },
  },
  {
    slug: "ring-of-the-void",
    name: "Ring of the Void",
    description: "Draws energy from unseen depths.",
    type: "ACCESSORY",
    rarity: "LEGENDARY",
    slot: "ACCESSORY_1",
    stats: {
      magic: 7,
      speed: 3,
      attack: 3
    },
  },
  {
    slug: "amulet-of-resolve",
    name: "Amulet of Resolve",
    description: "Steadies the mind against disruptive secrets.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "ACCESSORY_2",
    stats: {
      defense: 5,
      magic: 5
    },
  },
  {
    slug: "pendant-of-celerity",
    name: "Pendant of Celerity",
    description: "Captures a fragment of elemental wind.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_2",
    stats: {
      speed: 5,
      attack: 3
    },
  },
  {
    slug: "totem-of-bloom",
    name: "Totem of Bloom",
    description: "Verdant charm that invigorates spellcasters.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_2",
    stats: {
      health: 18,
      magic: 4
    },
  },
  {
    slug: "sigil-of-dominion",
    name: "Sigil of Dominion",
    description: "An emblem of battlefield command.",
    type: "ACCESSORY",
    rarity: "EPIC",
    slot: "ACCESSORY_2",
    stats: {
      attack: 5,
      defense: 5,
      magic: 5
    },
  },
  {
    slug: "idol-of-echoes",
    name: "Idol of Echoes",
    description: "Amplifies lingering spell effects.",
    type: "ACCESSORY",
    rarity: "RARE",
    slot: "ACCESSORY_2",
    stats: {
      magic: 6,
      speed: 2
    },
  },
  {
    slug: "charm-of-harmony",
    name: "Charm of Harmony",
    description: "Balances body and mind in tandem.",
    type: "ACCESSORY",
    rarity: "UNCOMMON",
    slot: "ACCESSORY_2",
    stats: {
      health: 15,
      magic: 3,
      attack: 2
    },
  },
  {
    slug: "pendant-of-torment",
    name: "Pendant of Torment",
    description: "Thrums with chaotic energy.",
    type: "ACCESSORY",
    rarity: "EPIC",
    slot: "ACCESSORY_2",
    stats: {
      attack: 6,
      speed: 3
    },
  },
  {
    slug: "health-potion",
    name: "Health Potion",
    description: "Restores a small amount of vitality when consumed.",
    type: "CONSUMABLE",
    rarity: "COMMON",
    slot: null,
    stats: {
      effect: {
        heal: 50
      }
    },
  },
  {
    slug: "focus-tonic",
    name: "Focus Tonic",
    description: "A draught that sharpens senses before a duel.",
    type: "CONSUMABLE",
    rarity: "UNCOMMON",
    slot: null,
    stats: {
      effect: {
        speed: 4,
        magic: 4
      }
    },
  },
  {
    slug: "ember-core",
    name: "Ember Core",
    description: "A smoldering ember harvested from a sprite.",
    type: "MATERIAL",
    rarity: "RARE",
    slot: null,
    stats: {
      crafting: {
        potency: 2
      }
    },
  },
  {
    slug: "sylvan-spool",
    name: "Sylvan Spool",
    description: "Thread of living fiber ready for bespoke garments.",
    type: "MATERIAL",
    rarity: "UNCOMMON",
    slot: null,
    stats: {
      crafting: {
        finesse: 3
      }
    },
  },
  {
    slug: "ancient-sigil-stone",
    name: "Ancient Sigil Stone",
    description: "Stone etched with dormant glyphs.",
    type: "MATERIAL",
    rarity: "RARE",
    slot: null,
    stats: {
      crafting: {
        resonance: 4
      }
    },
  }
];
const enemies = [
  {
    slug: "forest-goblin",
    name: "Forest Goblin",
    description: "A mischievous creature that attacks travelers.",
    level: 2,
    baseStats: {
      health: 60,
      attack: 12,
      defense: 6,
      speed: 10,
      magic: 0,
    },
    tags: ["forest", "minion"],
    abilities: [
      {
        abilitySlug: "slash",
        priority: 0,
        weight: 3,
      },
      {
        abilitySlug: "bleeding_edge",
        priority: 1,
        weight: 2,
      },
    ],
  },
  {
    slug: "ember-sprite",
    name: "Ember Sprite",
    description: "A flicker of sentient fire.",
    level: 3,
    baseStats: {
      health: 50,
      attack: 8,
      defense: 4,
      speed: 14,
      magic: 14,
    },
    tags: ["elemental", "fire"],
    abilities: [
      {
        abilitySlug: "firebolt",
        priority: 0,
        weight: 3,
      },
      {
        abilitySlug: "poison_cloud",
        priority: 1,
        weight: 2,
      },
    ],
  },
];

const missions = [
  {
    code: "FOREST_PATROL",
    name: "Forest Patrol",
    description: "Scout the edges of the Darkwood and clear minor threats.",
    difficultyRating: 1,
    durationMinutes: 15,
    baseExperience: 120,
    baseGold: 60,
    lootTable: {
      guaranteed: [{ itemSlug: "health-potion", quantity: 1, chance: 1 }],
      rolls: [
        { itemSlug: "iron-sword", chance: 0.2 },
        { itemSlug: "leather-armor", chance: 0.25 },
        { itemSlug: "windrunner-hood", chance: 0.2 },
        { itemSlug: "swiftstep-boots", chance: 0.2 },
        { itemSlug: "ring-of-sinew", chance: 0.15 },
        { itemSlug: "guardian-mitts", chance: 0.15 },
      ],
    },
    enemies: [
      { enemySlug: "forest-goblin", quantity: 2, priority: 0 },
      { enemySlug: "ember-sprite", quantity: 1, priority: 1 },
    ],
  },
  {
    code: "EMBER_CAVERN",
    name: "Ember Cavern",
    description: "Descend into the cavern to extinguish rogue sprites.",
    difficultyRating: 2,
    durationMinutes: 30,
    baseExperience: 260,
    baseGold: 140,
    lootTable: {
      guaranteed: [],
      rolls: [
        { itemSlug: "stormcall-staff", chance: 0.25 },
        { itemSlug: "shadowweave-robe", chance: 0.2 },
        { itemSlug: "spellthread-gloves", chance: 0.18 },
        { itemSlug: "ring-of-focus", chance: 0.22 },
        { itemSlug: "runebound-sandals", chance: 0.18 },
        { itemSlug: "focus-tonic", chance: 0.15 },
        { itemSlug: "ember-core", chance: 0.2 },
      ],
    },
    enemies: [
      { enemySlug: "ember-sprite", quantity: 3, priority: 0 },
    ],
  },
];

async function seedAbilities() {
  for (const ability of abilities) {
    await prisma.ability.upsert({
      where: { slug: ability.slug },
      update: {
        name: ability.name,
        description: ability.description,
        school: ability.school,
        target: ability.target,
        basePower: ability.basePower,
        resourceCost: ability.resourceCost,
        cooldownTurns: ability.cooldownTurns,
        speedModifier: ability.speedModifier,
        tags: ability.tags,
        formula: ability.formula,
      },
      create: ability,
    });
  }
}

async function seedItems() {
  for (const item of items) {
    await prisma.item.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity,
        slot: item.slot,
        stats: item.stats,
      },
      create: item,
    });
  }
}

async function seedEnemies() {
  for (const enemy of enemies) {
    const enemyRecord = await prisma.enemyTemplate.upsert({
      where: { slug: enemy.slug },
      update: {
        name: enemy.name,
        description: enemy.description,
        level: enemy.level,
        baseStats: enemy.baseStats,
        tags: enemy.tags,
      },
      create: {
        slug: enemy.slug,
        name: enemy.name,
        description: enemy.description,
        level: enemy.level,
        baseStats: enemy.baseStats,
        tags: enemy.tags,
      },
    });

    for (const ability of enemy.abilities) {
      const abilityRecord = await prisma.ability.findUnique({
        where: { slug: ability.abilitySlug },
      });

      if (!abilityRecord) continue;

      await prisma.enemyAbility.upsert({
        where: {
          enemyId_abilityId: {
            enemyId: enemyRecord.id,
            abilityId: abilityRecord.id,
          },
        },
        update: {
          priority: ability.priority,
          weight: ability.weight,
        },
        create: {
          enemyId: enemyRecord.id,
          abilityId: abilityRecord.id,
          priority: ability.priority,
          weight: ability.weight,
        },
      });
    }
  }
}

async function seedMissions() {
  for (const mission of missions) {
    const missionRecord = await prisma.mission.upsert({
      where: { code: mission.code },
      update: {
        name: mission.name,
        description: mission.description,
        difficultyRating: mission.difficultyRating,
        durationMinutes: mission.durationMinutes,
        baseExperience: mission.baseExperience,
        baseGold: mission.baseGold,
        lootTable: mission.lootTable,
      },
      create: {
        code: mission.code,
        name: mission.name,
        description: mission.description,
        difficultyRating: mission.difficultyRating,
        durationMinutes: mission.durationMinutes,
        baseExperience: mission.baseExperience,
        baseGold: mission.baseGold,
        lootTable: mission.lootTable,
      },
    });

    await prisma.missionEnemy.deleteMany({
      where: { missionId: missionRecord.id },
    });

    for (const enemy of mission.enemies) {
      const enemyTemplate = await prisma.enemyTemplate.findUnique({
        where: { slug: enemy.enemySlug },
      });

      if (!enemyTemplate) continue;

      await prisma.missionEnemy.create({
        data: {
          missionId: missionRecord.id,
          enemyId: enemyTemplate.id,
          quantity: enemy.quantity,
          priority: enemy.priority,
        },
      });
    }
  }
}

async function main() {
  await seedAbilities();
  await seedItems();
  await seedEnemies();
  await seedMissions();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed error", error);
    await prisma.$disconnect();
    process.exit(1);
  });
