const { computeCombatRewards, computeIdleRewards } = require('../utils/progression');

describe('Progression utilities', () => {
  const mockMission = {
    difficultyRating: 2,
    baseExperience: 200,
    baseGold: 120,
    durationMinutes: 20,
    lootTable: {
      guaranteed: [{ itemSlug: 'health-potion', chance: 1, quantity: 1 }],
      rolls: [{ itemSlug: 'iron-sword', chance: 0.5, quantity: 1 }],
    },
  };

  test('computeCombatRewards rewards more on victory', () => {
    const rng = () => 0.1;
    const victoryRewards = computeCombatRewards({ mission: mockMission, victory: true, rounds: 6, rng });
    const defeatRewards = computeCombatRewards({ mission: mockMission, victory: false, rounds: 6, rng });

    expect(victoryRewards.experience).toBeGreaterThan(defeatRewards.experience);
    expect(victoryRewards.gold).toBeGreaterThan(defeatRewards.gold);
    expect(victoryRewards.loot.length).toBeGreaterThanOrEqual(1);
  });

  test('computeIdleRewards scales with offline duration and power ratio', () => {
    const rngSequence = [0.2, 0.4, 0.8];
    let callIndex = 0;
    const rng = () => rngSequence[callIndex++ % rngSequence.length];

    const rewards = computeIdleRewards({
      mission: mockMission,
      hoursOffline: 8,
      characterPower: 250,
      missionPower: 200,
      rng,
    });

    expect(rewards.experience).toBeGreaterThan(0);
    expect(rewards.gold).toBeGreaterThan(0);
    expect(rewards.breakdown.cappedHours).toBe(8);
    expect(rewards.items.length).toBeGreaterThanOrEqual(1);
  });
});
