const xpForLevel = (level) => Math.floor(100 * Math.pow(level, 1.6));

const computeLevelFromXp = (currentLevel, experience) => {
  let level = currentLevel;
  while (experience >= xpForLevel(level + 1)) {
    level += 1;
  }
  return level;
};

const computeCombatRewards = ({ mission, victory, rounds, rng }) => {
  const difficultyMultiplier = 1 + mission.difficultyRating * 0.2;
  const efficiencyBonus = Math.max(0.8, 1.4 - rounds * 0.03);
  const baseXp = mission.baseExperience;
  const baseGold = mission.baseGold;

  const xpReward = Math.round(baseXp * difficultyMultiplier * efficiencyBonus * (victory ? 1 : 0.25));
  const goldReward = Math.round(baseGold * difficultyMultiplier * (victory ? efficiencyBonus : 0.3));

  const loot = [];
  const lootTable = mission.lootTable || {};
  const guaranteed = lootTable.guaranteed || [];
  const rolls = lootTable.rolls || [];

  guaranteed.forEach((entry) => {
    const chance = entry.chance ?? 1;
    const rolled = rng();
    if (rolled <= chance) {
      loot.push({ itemSlug: entry.itemSlug, quantity: entry.quantity ?? 1 });
    }
  });

  rolls.forEach((entry) => {
    const rolled = rng();
    if (rolled <= entry.chance) {
      loot.push({ itemSlug: entry.itemSlug, quantity: entry.quantity ?? 1 });
    }
  });

  return {
    experience: xpReward,
    gold: goldReward,
    loot,
  };
};

const computeIdleRewards = ({ mission, hoursOffline, characterPower, missionPower, rng = Math.random }) => {
  const cappedHours = Math.min(hoursOffline, 12);
  const baselineYield = cappedHours * (mission.baseExperience / (mission.durationMinutes / 10));
  const powerRatio = Math.min(1.5, Math.max(0.6, characterPower / Math.max(1, missionPower)));

  const experience = Math.round(baselineYield * powerRatio * 0.6);
  const gold = Math.round((mission.baseGold / (mission.durationMinutes / 10)) * cappedHours * powerRatio * 0.5);

  const itemsEarned = [];
  const lootTable = mission.lootTable || {};
  const rolls = lootTable.rolls || [];

  const effectiveRolls = Math.floor(cappedHours / (mission.durationMinutes / 30));
  for (let i = 0; i < effectiveRolls; i += 1) {
    rolls.forEach((entry) => {
      const adjustedChance = entry.chance * 0.5 * powerRatio;
      if (rng() <= adjustedChance) {
        itemsEarned.push({ itemSlug: entry.itemSlug, quantity: entry.quantity ?? 1 });
      }
    });
  }

  return {
    experience,
    gold,
    items: itemsEarned,
    breakdown: {
      cappedHours,
      powerRatio,
    },
  };
};

module.exports = {
  xpForLevel,
  computeLevelFromXp,
  computeCombatRewards,
  computeIdleRewards,
};
