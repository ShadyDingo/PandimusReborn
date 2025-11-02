const mergeStats = (...statBlocks) => {
  return statBlocks.reduce(
    (acc, block = {}) => {
      Object.entries(block).forEach(([key, value]) => {
        if (typeof value === "number") {
          acc[key] = (acc[key] || 0) + value;
        }
      });

      return acc;
    },
    { health: 0, attack: 0, defense: 0, speed: 0, magic: 0 }
  );
};

const calculatePowerRating = (stats) => {
  const { health = 0, attack = 0, defense = 0, speed = 0, magic = 0 } = stats;
  return Math.round(health * 0.3 + attack * 2 + defense * 1.8 + speed * 1.5 + magic * 2.1);
};

const scaleStatsForLevel = (baseStats, growth, level) => {
  if (level <= 1) {
    return { ...baseStats };
  }

  const levelsGained = level - 1;
  const scaled = { ...baseStats };

  Object.entries(growth || {}).forEach(([key, increment]) => {
    if (typeof increment === "number") {
      scaled[key] = Math.round((scaled[key] || 0) + increment * levelsGained);
    }
  });

  return scaled;
};

module.exports = {
  mergeStats,
  calculatePowerRating,
  scaleStatsForLevel,
};
