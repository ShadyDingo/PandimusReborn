const { prisma } = require("../db/prismaClient");

async function listMissions() {
  return prisma.mission.findMany({
    include: {
      enemies: {
        include: {
          enemy: {
            include: {
              abilities: {
                include: {
                  ability: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { difficultyRating: "asc" },
  });
}

async function getMissionById(missionId) {
  return prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      enemies: {
        include: {
          enemy: {
            include: {
              abilities: {
                include: {
                  ability: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getMissionByCode(code) {
  return prisma.mission.findUnique({
    where: { code },
    include: {
      enemies: {
        include: {
          enemy: {
            include: {
              abilities: {
                include: {
                  ability: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

module.exports = {
  listMissions,
  getMissionById,
  getMissionByCode,
};
