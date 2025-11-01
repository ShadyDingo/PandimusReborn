jest.mock('../db/prismaClient', () => ({ prisma: {} }));

const seedrandom = require('seedrandom');
const { __internal } = require('../services/combatService');

const { simulateCombat, createActorState, buildAbilityState, buildEquipmentStats } = __internal;

describe('Combat simulation', () => {
  const strikeAbility = {
    slug: 'test-strike',
    name: 'Test Strike',
    basePower: 20,
    cooldownTurns: 1,
    target: 'ENEMY',
    formula: {
      type: 'physical',
      scaling: { attack: 1 },
    },
  };

  const enemyAbility = {
    slug: 'enemy-swipe',
    name: 'Enemy Swipe',
    basePower: 10,
    cooldownTurns: 1,
    target: 'ENEMY',
    formula: {
      type: 'physical',
      scaling: { attack: 0.6 },
    },
  };

  test('Hero defeats weaker enemy with straightforward loadout', () => {
    const heroStats = { health: 120, attack: 18, defense: 10, speed: 12, magic: 6 };
    const enemyStats = { health: 80, attack: 10, defense: 6, speed: 8, magic: 0 };

    const heroAbilities = buildAbilityState([
      { slot: 0, ability: strikeAbility, priority: 0 },
    ]);
    const enemyAbilities = buildAbilityState([
      { slot: 0, ability: enemyAbility, priority: 0 },
    ]);

    const hero = createActorState({
      id: 'hero',
      name: 'Hero',
      type: 'CHARACTER',
      stats: heroStats,
      abilities: heroAbilities,
    });

    const enemy = createActorState({
      id: 'enemy-1',
      name: 'Goblin',
      type: 'ENEMY',
      stats: enemyStats,
      abilities: enemyAbilities,
    });

    const rng = seedrandom('hero-test');
    const result = simulateCombat({ characterActor: hero, enemyActors: [enemy], rng, maxRounds: 15 });

    expect(result.victory).toBe(true);
    expect(result.rounds).toBeGreaterThan(0);
    expect(result.log.length).toBeGreaterThan(0);
  });

  test('Equipment stats merge correctly', () => {
    const equipment = [
      { item: { stats: { attack: 4, defense: 2 } } },
      { item: { stats: { magic: 3, health: 20 } } },
    ];

    const merged = buildEquipmentStats(equipment);
    expect(merged.attack).toBe(4);
    expect(merged.defense).toBe(2);
    expect(merged.magic).toBe(3);
    expect(merged.health).toBe(20);
  });
});
