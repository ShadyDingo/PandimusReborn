const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const abilities = [
  {
    slug: "slash",
    name: "Slash",
    description: "A fast melee strike dealing physical damage.",
    school: "PHYSICAL",
    target: "ENEMY",
    basePower: 20,
    resourceCost: 0,
    cooldownTurns: 1,
    speedModifier: 0,
    tags: ["starter"],
    formula: {
      type: "physical",
      scaling: {
        attack: 1.0,
      },
    },
  },
  {
    slug: "guard",
    name: "Guard",
    description: "Brace to reduce incoming damage for one turn.",
    school: "SUPPORT",
    target: "SELF",
    basePower: 0,
    resourceCost: 0,
    cooldownTurns: 2,
    speedModifier: 0,
    tags: ["defense"],
    formula: {
      type: "buff",
      effect: {
        defenseMultiplier: 1.25,
        duration: 1,
      },
    },
  },
  {
    slug: "firebolt",
    name: "Firebolt",
    description: "Launch a bolt of fire that scorches an enemy.",
    school: "ARCANE",
    target: "ENEMY",
    basePower: 24,
    resourceCost: 5,
    cooldownTurns: 1,
    speedModifier: -1,
    tags: ["magic"],
    formula: {
      type: "magical",
      scaling: {
        magic: 1.1,
      },
      status: {
        name: "burn",
        chance: 0.2,
        damagePerTurn: 6,
        duration: 2,
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
    tags: ["support"],
    formula: {
      type: "healing",
      scaling: {
        magic: 0.9,
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
        abilitySlug: "guard",
        priority: 1,
        weight: 1,
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
        weight: 4,
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
