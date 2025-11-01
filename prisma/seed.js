const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const abilities = [
  {
    slug: "slash",
    name: "Slash",
    description: "A fast melee strike dealing physical damage.",
    school: "PHYSICAL",
    target: "ENEMY",
    basePower: 18,
    resourceCost: 0,
    cooldownTurns: 1,
    speedModifier: 0,
    tags: ["starter", "martial"],
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
    school: "PHYSICAL",
    target: "ENEMY",
    basePower: 26,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: -2,
    tags: ["martial", "burst"],
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
    school: "PHYSICAL",
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
    school: "PHYSICAL",
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
    school: "PHYSICAL",
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
    slug: "firebolt",
    name: "Firebolt",
    description: "Launch a bolt of fire that scorches an enemy.",
    school: "FIRE",
    target: "ENEMY",
    basePower: 22,
    resourceCost: 5,
    cooldownTurns: 1,
    speedModifier: -1,
    tags: ["magic", "fire"],
    formula: {
      type: "magical",
      scaling: { magic: 1.05 },
      status: {
        name: "burn",
        chance: 0.25,
        damagePerTurn: 7,
        duration: 2,
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
    tags: ["magic", "control"],
    formula: {
      type: "magical",
      scaling: { magic: 0.95 },
      status: {
        name: "chilled",
        chance: 0.85,
        statModifiers: { speed: -4 },
        duration: 2,
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
    tags: ["magic", "area"],
    formula: {
      type: "magical",
      scaling: { magic: 0.9 },
      variance: 0.25,
      status: {
        name: "static",
        chance: 0.4,
        statModifiers: { speed: -2 },
        duration: 1,
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
    description: "Scorch a foe?s mana, weakening their spellcasting.",
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
      },
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
      },
    },
  },
];

const items = [
  {
    slug: "iron-sword",
    name: "Iron Sword",
    description: "Reliable blade for close combat.",
    type: "WEAPON",
    rarity: "COMMON",
    slot: "WEAPON",
    stats: {
      attack: 6,
    },
  },
  {
    slug: "leather-armor",
    name: "Leather Armor",
    description: "Light armor offering minimal protection.",
    type: "ARMOR",
    rarity: "COMMON",
    slot: "CHEST",
    stats: {
      defense: 4,
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
      magic: 5,
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
        heal: 50,
      },
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
        potency: 2,
      },
    },
  },
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
        { itemSlug: "arcane-ring", chance: 0.1 },
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
        { itemSlug: "arcane-ring", chance: 0.3 },
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
