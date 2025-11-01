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

  test('Life drain multi-hit ability damages and heals', () => {
    const lifeDrainAbility = {
      slug: 'life-drain-test',
      name: 'Life Drain Test',
      basePower: 14,
      cooldownTurns: 1,
      target: 'ENEMY',
      formula: {
        type: 'magical',
        hits: 2,
        scaling: { magic: 0.8 },
        lifeSteal: 0.5,
      },
    };

    const hero = createActorState({
      id: 'hero-life',
      name: 'Hero',
      type: 'CHARACTER',
      stats: { health: 120, attack: 10, defense: 8, speed: 12, magic: 18 },
      abilities: buildAbilityState([{ slot: 0, ability: lifeDrainAbility, priority: 0 }]),
    });
    hero.currentHealth = 60;

    const enemy = createActorState({
      id: 'dummy',
      name: 'Dummy',
      type: 'ENEMY',
      stats: { health: 80, attack: 6, defense: 5, speed: 5, magic: 0 },
      abilities: buildAbilityState([{ slot: 0, ability: enemyAbility, priority: 0 }]),
    });

    const rng = seedrandom('life-drain');
    const result = simulateCombat({ characterActor: hero, enemyActors: [enemy], rng, maxRounds: 1 });

    expect(result.log.some((entry) => entry.actionType === 'DAMAGE')).toBe(true);
    expect(hero.currentHealth).toBeGreaterThan(60);
    expect(enemy.currentHealth).toBeLessThan(80);
  });

  test('Renew applies heal over time status', () => {
    const renewAbility = {
      slug: 'renew-test',
      name: 'Renew Test',
      basePower: 8,
      cooldownTurns: 1,
      target: 'ALLY',
      formula: {
        type: 'healing',
        scaling: { magic: 0.3 },
        status: {
          name: 'renew',
          chance: 1,
          healPerTurn: 10,
          duration: 3,
        },
      },
    };

    const hero = createActorState({
      id: 'cleric',
      name: 'Cleric',
      type: 'CHARACTER',
      stats: { health: 100, attack: 8, defense: 9, speed: 9, magic: 20 },
      abilities: buildAbilityState([{ slot: 0, ability: renewAbility, priority: 0 }]),
    });
    hero.currentHealth = 50;

    const passiveEnemy = createActorState({
      id: 'stoic',
      name: 'Stoic',
      type: 'ENEMY',
      stats: { health: 120, attack: 0, defense: 5, speed: 5, magic: 0 },
      abilities: buildAbilityState([{ slot: 0, ability: { ...enemyAbility, basePower: 0 }, priority: 0 }]),
    });

    const rng = seedrandom('renew-hot');
    simulateCombat({ characterActor: hero, enemyActors: [passiveEnemy], rng, maxRounds: 3 });

    expect(hero.currentHealth).toBeGreaterThan(50);
    expect(hero.currentHealth).toBeLessThanOrEqual(hero.maxHealth);
  });

  test('Stun causes affected enemy to skip their action', () => {
    const stunAbility = {
      slug: 'shield-bash-test',
      name: 'Shield Bash Test',
      basePower: 8,
      cooldownTurns: 1,
      target: 'ENEMY',
      formula: {
        type: 'physical',
        scaling: { attack: 0.4, defense: 0.6 },
        status: {
          name: 'stunned',
          chance: 1,
          skipTurn: true,
          duration: 1,
          isDebuff: true,
        },
      },
    };

    const hero = createActorState({
      id: 'guardian',
      name: 'Guardian',
      type: 'CHARACTER',
      stats: { health: 150, attack: 12, defense: 14, speed: 11, magic: 4 },
      abilities: buildAbilityState([{ slot: 0, ability: stunAbility, priority: 0 }]),
    });

    const enemy = createActorState({
      id: 'raider',
      name: 'Raider',
      type: 'ENEMY',
      stats: { health: 120, attack: 14, defense: 6, speed: 8, magic: 0 },
      abilities: buildAbilityState([{ slot: 0, ability: enemyAbility, priority: 0 }]),
    });

    const rng = seedrandom('stun-test');
    const result = simulateCombat({ characterActor: hero, enemyActors: [enemy], rng, maxRounds: 2 });

    expect(result.log.some((entry) => entry.actionType === 'STATUS_SKIP' && entry.actor === 'Raider')).toBe(true);
  });

  test('Purify removes negative statuses from the caster', () => {
    const purifyAbility = {
      slug: 'purify-test',
      name: 'Purify Test',
      basePower: 6,
      cooldownTurns: 1,
      target: 'ALLY',
      formula: {
        type: 'healing',
        scaling: { magic: 0.2 },
        cleanse: true,
      },
    };

    const hero = createActorState({
      id: 'priest',
      name: 'Priest',
      type: 'CHARACTER',
      stats: { health: 110, attack: 6, defense: 8, speed: 10, magic: 22 },
      abilities: buildAbilityState([{ slot: 0, ability: purifyAbility, priority: 0 }]),
    });
    hero.currentHealth = 70;
    hero.statuses.push({
      type: 'POISON',
      isDebuff: true,
      damagePerTurn: 4,
      remaining: 2,
    });

    const dummy = createActorState({
      id: 'sparring',
      name: 'Sparring Target',
      type: 'ENEMY',
      stats: { health: 150, attack: 0, defense: 5, speed: 5, magic: 0 },
      abilities: buildAbilityState([{ slot: 0, ability: { ...enemyAbility, basePower: 0 }, priority: 0 }]),
    });

    const rng = seedrandom('purify-test');
    simulateCombat({ characterActor: hero, enemyActors: [dummy], rng, maxRounds: 2 });

    expect(hero.statuses.some((status) => status.isDebuff)).toBe(false);
  });
});
