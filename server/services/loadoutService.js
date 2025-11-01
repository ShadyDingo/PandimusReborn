const { prisma } = require("../db/prismaClient");

async function getLoadoutById(loadoutId) {
  return prisma.loadout.findUnique({
    where: { id: loadoutId },
    include: {
      abilities: {
        include: {
          ability: true,
        },
        orderBy: { slot: "asc" },
      },
      equipment: {
        include: {
          item: true,
        },
      },
    },
  });
}

async function getActiveLoadout(characterId) {
  return prisma.loadout.findFirst({
    where: { characterId, isActive: true },
    include: {
      abilities: {
        include: {
          ability: true,
        },
        orderBy: { slot: "asc" },
      },
      equipment: {
        include: {
          item: true,
        },
      },
    },
  });
}

async function setActiveLoadout(characterId, loadoutId) {
  await prisma.loadout.updateMany({
    where: { characterId },
    data: { isActive: false },
  });

  return prisma.loadout.update({
    where: { id: loadoutId },
    data: { isActive: true },
  });
}

module.exports = {
  getLoadoutById,
  getActiveLoadout,
  setActiveLoadout,
};
