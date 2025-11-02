const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../db/prismaClient");
const classDefinitions = require("../config/classes");
const { mergeStats, calculatePowerRating, scaleStatsForLevel } = require("../utils/statMath");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

const issueToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });

const sanitizeUser = (user) => ({ id: user.id, username: user.username, email: user.email });

async function registerUser({ username, password, email }) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  const token = issueToken({ userId: user.id, username: user.username });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function authenticate({ username, password }) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = issueToken({ userId: user.id, username: user.username });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function getClassDefinitions() {
  return Object.values(classDefinitions).map((klass) => ({
    key: klass.key,
    name: klass.name,
    description: klass.description,
    baseStats: klass.baseStats,
    growth: klass.growth,
    defaultAbilities: klass.defaultAbilities,
    defaultEquipment: klass.defaultEquipment,
  }));
}

async function createCharacter({ userId, name, classKey }) {
  const klass = classDefinitions[classKey];
  if (!klass) {
    throw new Error("Invalid character class");
  }

  const existingName = await prisma.character.findUnique({ where: { name } });
  if (existingName) {
    throw new Error("Character name already exists");
  }

  const level = 1;
  const scaledStats = scaleStatsForLevel(klass.baseStats, klass.growth, level);
  const classAbilities = await prisma.ability.findMany({
    where: { slug: { in: klass.defaultAbilities.map((a) => a.slug) } },
  });

  const abilityMap = Object.fromEntries(classAbilities.map((ability) => [ability.slug, ability.id]));

  const classItems = await prisma.item.findMany({
    where: { slug: { in: klass.defaultEquipment.map((equip) => equip.itemSlug).filter(Boolean) } },
  });

  const itemMap = Object.fromEntries(classItems.map((item) => [item.slug, item.id]));

  const character = await prisma.character.create({
    data: {
      userId,
      name,
      class: classKey,
      level,
      baseStats: scaledStats,
      experience: 0,
      gold: 0,
      powerRating: calculatePowerRating(scaledStats),
      loadouts: {
        create: {
          name: "Default",
          isActive: true,
          abilities: {
            create: klass.defaultAbilities
              .map((ability, index) => ({
                abilityId: abilityMap[ability.slug],
                slot: index,
                priority: ability.priority ?? index,
              }))
              .filter((entry) => entry.abilityId),
          },
          equipment: {
            create: klass.defaultEquipment
              .map((equip) => ({
                itemId: itemMap[equip.itemSlug],
                slot: equip.slot,
              }))
              .filter((entry) => entry.itemId),
          },
        },
      },
    },
    include: {
      loadouts: {
        include: {
          abilities: { include: { ability: true } },
          equipment: { include: { item: true } },
        },
      },
    },
  });

  return character;
}

async function getCharacterForUser(userId) {
  return prisma.character.findFirst({
    where: { userId },
    include: {
      loadouts: {
        include: {
          abilities: { include: { ability: true } },
          equipment: { include: { item: true } },
        },
      },
      inventoryItems: { include: { item: true } },
    },
  });
}

async function updateCharacterStats(characterId, stats) {
  const updated = mergeStats({}, stats);

  const powerRating = calculatePowerRating(updated);

  return prisma.character.update({
    where: { id: characterId },
    data: {
      baseStats: updated,
      powerRating,
      updatedAt: new Date(),
    },
  });
}

async function syncInventory(characterId, inventoryItems = []) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { inventoryItems: true },
  });

  if (!character) {
    throw new Error("Character not found");
  }

  const existingMap = new Map(character.inventoryItems.map((inv) => [inv.itemId, inv]));

  for (const item of inventoryItems) {
    const { itemId, quantity } = item;
    if (!itemId || typeof quantity !== "number") continue;

    if (existingMap.has(itemId)) {
      await prisma.characterInventoryItem.update({
        where: { id: existingMap.get(itemId).id },
        data: { quantity },
      });
    } else {
      await prisma.characterInventoryItem.create({
        data: {
          characterId,
          itemId,
          quantity,
        },
      });
    }
  }

  // Optionally clean up removed entries
  const incomingIds = new Set(inventoryItems.map((item) => item.itemId));
  for (const entry of character.inventoryItems) {
    if (!incomingIds.has(entry.itemId)) {
      await prisma.characterInventoryItem.delete({ where: { id: entry.id } });
    }
  }
}

module.exports = {
  registerUser,
  authenticate,
  getClassDefinitions,
  createCharacter,
  getCharacterForUser,
  updateCharacterStats,
  syncInventory,
};
