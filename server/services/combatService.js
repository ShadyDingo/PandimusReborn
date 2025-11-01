const seedrandom = require("seedrandom");
const { prisma } = require("../db/prismaClient");
const { mergeStats, calculatePowerRating } = require("../utils/statMath");
const { computeCombatRewards, computeLevelFromXp } = require("../utils/progression");
const { getMissionById } = require("./missionService");
const { getActiveLoadout, getLoadoutById } = require("./loadoutService");

const PRIMARY_STATS = ["health", "attack", "defense", "speed", "magic"];

const extractPrimaryStats = (stats = {}) => {
  const result = {};
  PRIMARY_STATS.forEach((key) => {
    if (typeof stats[key] === "number") {
      result[key] = stats[key];
    }
  });
  return result;
};

const instantiateEnemy = (template, index) => {
  const stats = extractPrimaryStats(template.baseStats);
  return {
    id: `${template.slug}-${index}`,
    name: template.name + (index > 0 ? ` #${index + 1}` : ""),
    type: "ENEMY",
    baseStats: stats,
    abilities: template.abilities
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map((entry) => ({
        ...entry.ability,
        priority: entry.priority,
        weight: entry.weight,
      })),
  };
};

const buildEquipmentStats = (equipment = []) => {
  return equipment.reduce((acc, equip) => {
    const stats = extractPrimaryStats(equip.item?.stats || {});
    return mergeStats(acc, stats);
  }, {});
};

const buildAbilityState = (abilities = []) =>
  abilities
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => ({
      slot: entry.slot,
      ability: entry.ability,
      cooldownRemaining: 0,
      priority: entry.priority ?? entry.slot,
    }));

const createActorState = ({ id, name, type, stats, abilities }) => ({
  id,
  name,
  type,
  stats,
  abilities,
  currentHealth: stats.health,
  maxHealth: stats.health,
  statuses: [],
});

const chooseAbility = (actor, rng) => {
  const readyAbilities = actor.abilities.filter((entry) => entry.cooldownRemaining === 0);

  if (readyAbilities.length === 0) {
    return actor.abilities.reduce((best, ability) => {
      if (!best || ability.priority < best.priority) {
        return ability;
      }
      return best;
    }, null);
  }

  const bestPriority = Math.min(...readyAbilities.map((ability) => ability.priority ?? ability.slot));
  const candidates = readyAbilities.filter((ability) => (ability.priority ?? ability.slot) === bestPriority);

  if (candidates.length === 1) {
    return candidates[0];
  }

  const idx = Math.floor(rng() * candidates.length);
  return candidates[idx];
};

const selectTarget = (ability, actor, allies, opponents, rng) => {
  switch (ability.target) {
    case "ALLY":
      return allies.slice().sort((a, b) => a.currentHealth / a.maxHealth - b.currentHealth / b.maxHealth)[0];
    case "SELF":
      return actor;
    case "AREA":
      return opponents;
    case "ENEMY":
    default:
      return opponents.reduce((best, candidate) => {
        if (!best) return candidate;
        if (candidate.currentHealth <= 0) return best;
        if (best.currentHealth <= 0) return candidate;

        const threatScore = candidate.stats.attack * 2 + candidate.stats.magic * 2 + candidate.stats.speed;
        const bestScore = best.stats.attack * 2 + best.stats.magic * 2 + best.stats.speed;
        if (threatScore === bestScore) {
          return rng() > 0.5 ? candidate : best;
        }
        return threatScore > bestScore ? candidate : best;
      }, null);
  }
};

const applyDamage = (source, target, amount) => {
  const reduced = Math.max(0, Math.round(amount));
  target.currentHealth = Math.max(0, target.currentHealth - reduced);
  return reduced;
};

const resolveAbility = ({
  ability,
  actor,
  allies,
  opponents,
  rng,
  log,
  round,
}) => {
  const target = selectTarget(ability, actor, allies, opponents, rng);

  if (!target) {
    return { action: "SKIP" };
  }

  const scaling = ability.formula?.scaling || {};
  const getStat = (stat) => actor.stats[stat] || 0;
  const payload = { ability: ability.slug, action: ability.name };

  switch (ability.formula?.type) {
    case "healing": {
      const healBase = ability.basePower + getStat("magic") * (scaling.magic || 0);
      const amount = Math.round(healBase);
      const shortage = target.maxHealth - target.currentHealth;
      const applied = Math.min(amount, shortage);
      target.currentHealth += applied;
      payload.target = target.name;
      payload.heal = applied;
      log.push({
        round,
        actionType: "HEAL",
        actor: actor.name,
        target: target.name,
        value: applied,
        ability: ability.name,
      });
      break;
    }
    case "buff": {
      const effect = ability.formula?.effect || {};
      if (effect.defenseMultiplier) {
        target.statuses.push({
          type: "BUFF_DEFENSE",
          multiplier: effect.defenseMultiplier,
          remaining: effect.duration || 1,
        });
      }
      payload.target = target.name;
      payload.buff = ability.formula?.effect;
      log.push({
        round,
        actionType: "BUFF",
        actor: actor.name,
        target: target.name,
        ability: ability.name,
        effect: ability.formula?.effect,
      });
      break;
    }
    case "magical":
    case "physical":
    default: {
      const attackScore =
        ability.formula?.type === "magical"
          ? getStat("magic") * (scaling.magic || 1)
          : getStat("attack") * (scaling.attack || 1);
      const basePower = ability.basePower || 0;
      let mitigation = target.stats.defense * 0.4;

      const defenseBuff = target.statuses.find((status) => status.type === "BUFF_DEFENSE");
      if (defenseBuff) {
        mitigation *= defenseBuff.multiplier;
      }

      const variance = 0.9 + rng() * 0.2;
      const damage = (basePower + attackScore) * variance - mitigation;
      const applied = applyDamage(actor, target, damage);
      payload.target = target.name;
      payload.damage = applied;
      log.push({
        round,
        actionType: "DAMAGE",
        actor: actor.name,
        target: target.name,
        ability: ability.name,
        value: applied,
      });

      const status = ability.formula?.status;
      if (status && rng() <= (status.chance || 0)) {
        target.statuses.push({
          type: status.name.toUpperCase(),
          remaining: status.duration || 2,
          damagePerTurn: status.damagePerTurn || 0,
        });
        payload.status = status.name;
      }
      break;
    }
  }

  return { action: ability.slug, payload };
};

const tickStatuses = (actor, log, round) => {
  const remaining = [];
  for (const status of actor.statuses) {
    if (status.type === "BUFF_DEFENSE") {
      status.remaining -= 1;
      if (status.remaining > 0) {
        remaining.push(status);
      } else {
        log.push({
          round,
          actionType: "STATUS_EXPIRE",
          actor: actor.name,
          status: status.type,
        });
      }
      continue;
    }

    if (status.damagePerTurn) {
      const damage = Math.round(status.damagePerTurn);
      actor.currentHealth = Math.max(0, actor.currentHealth - damage);
      log.push({
        round,
        actionType: "STATUS_DAMAGE",
        actor: actor.name,
        status: status.type,
        value: damage,
      });
    }

    status.remaining -= 1;
    if (status.remaining > 0) {
      remaining.push(status);
    } else {
      log.push({
        round,
        actionType: "STATUS_EXPIRE",
        actor: actor.name,
        status: status.type,
      });
    }
  }

  actor.statuses = remaining;
};

const allDefeated = (actors) => actors.every((actor) => actor.currentHealth <= 0);

const simulateCombat = ({
  characterActor,
  enemyActors,
  rng,
  maxRounds = 20,
}) => {
  const log = [];
  let rounds = 0;

  while (rounds < maxRounds && characterActor.currentHealth > 0 && !allDefeated(enemyActors)) {
    rounds += 1;

    const participants = [characterActor, ...enemyActors.filter((enemy) => enemy.currentHealth > 0)];
    const order = participants
      .map((actor) => ({
        actor,
        initiative: actor.stats.speed + rng(),
      }))
      .sort((a, b) => b.initiative - a.initiative)
      .map((entry) => entry.actor);

    for (const actor of order) {
      if (actor.currentHealth <= 0) continue;

      tickStatuses(actor, log, rounds);
      if (actor.currentHealth <= 0) continue;

      const allies = actor.type === "CHARACTER" ? [characterActor] : enemyActors;
      const opponents = actor.type === "CHARACTER" ? enemyActors : [characterActor];

      const abilityState = chooseAbility(actor, rng);
      if (!abilityState) continue;

      const result = resolveAbility({
        ability: abilityState.ability,
        actor,
        allies,
        opponents,
        rng,
        log,
        round: rounds,
      });

      abilityState.cooldownRemaining = abilityState.ability.cooldownTurns || 1;
      actor.abilities.forEach((entry) => {
        if (entry === abilityState) return;
        entry.cooldownRemaining = Math.max(0, entry.cooldownRemaining - 1);
      });

      if (result.payload) {
        log.push({
          round: rounds,
          actionType: "ABILITY",
          actor: actor.name,
          payload: result.payload,
        });
      }

      if (allDefeated(enemyActors) || characterActor.currentHealth <= 0) {
        break;
      }
    }
  }

  const victory = allDefeated(enemyActors) && characterActor.currentHealth > 0;

  return {
    rounds,
    victory,
    log,
  };
};

async function startCombat({ characterId, missionId, loadoutId }) {
  const [character, mission] = await Promise.all([
    prisma.character.findUnique({
      where: { id: characterId },
      include: {
        user: true,
        loadouts: {
          include: {
            abilities: { include: { ability: true }, orderBy: { slot: "asc" } },
            equipment: { include: { item: true } },
          },
        },
      },
    }),
    getMissionById(missionId),
  ]);

  if (!character) {
    throw new Error("Character not found");
  }

  if (!mission) {
    throw new Error("Mission not found");
  }

  const loadout = loadoutId
    ? await getLoadoutById(loadoutId)
    : await getActiveLoadout(character.id);

  if (!loadout) {
    throw new Error("Active loadout not found");
  }

  const equipmentStats = buildEquipmentStats(loadout.equipment);
  const finalStats = mergeStats(character.baseStats, equipmentStats);
  finalStats.health = Math.max(finalStats.health, character.baseStats.health);

  const abilityState = buildAbilityState(loadout.abilities);
  const characterActor = createActorState({
    id: character.id,
    name: character.name,
    type: "CHARACTER",
    stats: finalStats,
    abilities: abilityState,
  });

  const rngSeed = `${Date.now()}-${character.id}-${mission.id}`;
  const rng = seedrandom(rngSeed);

  const enemyActors = mission.enemies.flatMap((missionEnemy) => {
    const { enemy, quantity } = missionEnemy;
    const instances = [];
    for (let i = 0; i < (quantity || 1); i += 1) {
      const template = instantiateEnemy(enemy, i);
      const actor = createActorState({
        id: `${template.id}-${i}`,
        name: template.name,
        type: "ENEMY",
        stats: template.baseStats,
        abilities: template.abilities.map((ability, index) => ({
          slot: index,
          ability,
          cooldownRemaining: 0,
          priority: ability.priority ?? index,
        })),
      });
      instances.push(actor);
    }
    return instances;
  });

  const simulation = simulateCombat({ characterActor, enemyActors, rng });
  const rewards = computeCombatRewards({ mission, victory: simulation.victory, rounds: simulation.rounds, rng });

  const updatedCharacter = await prisma.character.update({
    where: { id: character.id },
    data: {
      experience: { increment: rewards.experience },
      gold: { increment: rewards.gold },
      lastActiveAt: new Date(),
    },
  });

  const leveled = computeLevelFromXp(updatedCharacter.level, updatedCharacter.experience);
  if (leveled > updatedCharacter.level) {
    const levelDifference = leveled - updatedCharacter.level;
    await prisma.character.update({
      where: { id: character.id },
      data: {
        level: leveled,
        powerRating: calculatePowerRating(finalStats) + levelDifference * 10,
      },
    });
  }

  const encounter = await prisma.combatEncounter.create({
    data: {
      characterId: character.id,
      loadoutId: loadout.id,
      missionId: mission.id,
      type: "MISSION",
      status: "COMPLETED",
      result: simulation.victory ? "VICTORY" : "DEFEAT",
      rounds: simulation.rounds,
      seed: rngSeed,
      summary: {
        rewards,
        characterRemainingHealth: characterActor.currentHealth,
        enemyCount: enemyActors.length,
      },
      logs: {
        create: simulation.log.slice(0, 200).map((entry) => ({
          round: entry.round || 1,
          actorType: entry.actor === characterActor.name ? "CHARACTER" : "ENEMY",
          actorName: entry.actor,
          action: entry.actionType,
          payload: entry,
        })),
      },
    },
    include: {
      logs: true,
    },
  });

  return {
    encounter,
    rewards,
    victory: simulation.victory,
    rounds: simulation.rounds,
    log: simulation.log,
  };
}

module.exports = {
  startCombat,
  __internal: {
    simulateCombat,
    createActorState,
    buildAbilityState,
    buildEquipmentStats,
  },
};
