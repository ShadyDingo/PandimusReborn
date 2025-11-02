const seedrandom = require("seedrandom");
const { prisma } = require("../db/prismaClient");
const { computeIdleRewards, computeLevelFromXp } = require("../utils/progression");
const { calculatePowerRating } = require("../utils/statMath");
const { getMissionById } = require("./missionService");
const { getActiveLoadout, getLoadoutById } = require("./loadoutService");

async function startIdleSession({ characterId, missionId, loadoutId }) {
  const existing = await prisma.idleSession.findFirst({
    where: { characterId, claimed: false },
  });

  if (existing) {
    return existing;
  }

  const loadout = loadoutId
    ? await getLoadoutById(loadoutId)
    : await getActiveLoadout(characterId);

  if (!loadout) {
    throw new Error("Active loadout not found");
  }

  return prisma.idleSession.create({
    data: {
      characterId,
      missionId,
      loadoutId: loadout.id,
      startedAt: new Date(),
      claimed: false,
    },
  });
}

async function claimIdleRewards({ sessionId }) {
  const session = await prisma.idleSession.findUnique({
    where: { id: sessionId },
    include: {
      mission: true,
      character: true,
    },
  });

  if (!session) {
    throw new Error("Idle session not found");
  }

  if (session.claimed) {
    return session;
  }

  const now = new Date();
  const hoursOffline = Math.max(0.5, (now - session.startedAt) / (1000 * 60 * 60));

  const mission = await getMissionById(session.missionId);
  if (!mission) {
    throw new Error("Mission not found");
  }

  const character = await prisma.character.findUnique({ where: { id: session.characterId } });
  if (!character) {
    throw new Error("Character not found");
  }

  const missionPower = mission.difficultyRating * 100;
  const characterPower = character.powerRating || calculatePowerRating(character.baseStats);
  const rng = seedrandom(`${session.id}-${now.toISOString()}`);
  const rewards = computeIdleRewards({
    mission,
    hoursOffline,
    characterPower,
    missionPower,
    rng,
  });

  const updatedCharacter = await prisma.character.update({
    where: { id: character.id },
    data: {
      experience: { increment: rewards.experience },
      gold: { increment: rewards.gold },
      lastActiveAt: now,
    },
  });

  const leveled = computeLevelFromXp(updatedCharacter.level, updatedCharacter.experience);
  if (leveled > updatedCharacter.level) {
    await prisma.character.update({
      where: { id: character.id },
      data: { level: leveled },
    });
  }

  if (rewards.items.length > 0) {
    const itemSlugs = [...new Set(rewards.items.map((item) => item.itemSlug))];
    const items = await prisma.item.findMany({ where: { slug: { in: itemSlugs } } });
    const itemMap = Object.fromEntries(items.map((item) => [item.slug, item.id]));

    for (const reward of rewards.items) {
      const itemId = itemMap[reward.itemSlug];
      if (!itemId) continue;

      await prisma.characterInventoryItem.upsert({
        where: {
          characterId_itemId: {
            characterId: character.id,
            itemId,
          },
        },
        update: {
          quantity: {
            increment: reward.quantity ?? 1,
          },
        },
        create: {
          characterId: character.id,
          itemId,
          quantity: reward.quantity ?? 1,
        },
      });
    }
  }

  const updatedSession = await prisma.idleSession.update({
    where: { id: session.id },
    data: {
      endedAt: now,
      hoursOffline,
      claimed: true,
      rewards: rewards,
    },
  });

  return updatedSession;
}

module.exports = {
  startIdleSession,
  claimIdleRewards,
};
