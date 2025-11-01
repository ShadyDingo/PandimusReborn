const seedrandom = require("seedrandom");
const { prisma } = require("../db/prismaClient");
const { mergeStats, calculatePowerRating } = require("../utils/statMath");
const { computeCombatRewards, computeLevelFromXp } = require("../utils/progression");
const { getMissionById } = require("./missionService");
const { getActiveLoadout, getLoadoutById } = require("./loadoutService");

const PRIMARY_STATS = ["health", "attack", "defense", "speed", "magic"];

const clone = (value) => JSON.parse(JSON.stringify(value));

const createStatusInstance = (statusDef = {}) => {
  const instance = clone(statusDef);
  instance.type = (instance.name || instance.type || "STATUS").toUpperCase();
  instance.remaining = instance.duration ?? instance.remaining ?? 1;
  if (instance.speedModifier) {
    instance.statModifiers = instance.statModifiers || {};
    instance.statModifiers.speed = (instance.statModifiers.speed || 0) + instance.speedModifier;
  }
  if (instance.defenseMultiplier && !instance.statMultipliers) {
    instance.statMultipliers = { defense: instance.defenseMultiplier };
  }
  delete instance.duration;
  delete instance.name;
  delete instance.speedModifier;
  delete instance.defenseMultiplier;
  delete instance.chance;
  return instance;
};

const pushStatus = (target, statusDef) => {
  if (!statusDef) return;
  const status = createStatusInstance(statusDef);
  if (!status.remaining || status.remaining <= 0) {
    return;
  }
  target.statuses.push(status);
};

const removeDebuffs = (target) => {
  const before = target.statuses.length;
  target.statuses = target.statuses.filter((status) => !status.isDebuff);
  return before - target.statuses.length;
};

const getEffectiveStat = (actor, stat) => {
  const base = actor.stats[stat] || 0;
  const additive = actor.statuses.reduce((sum, status) => {
    const mods = status.statModifiers || {};
    return sum + (mods[stat] || 0);
  }, 0);
  const multiplier = actor.statuses.reduce((product, status) => {
    const multipliers = status.statMultipliers || {};
    return product * (multipliers[stat] ?? 1);
  }, 1);
  return Math.max(0, (base + additive) * multiplier);
};

const getDamageReductionFactor = (actor) => {
  const reduction = actor.statuses.reduce((sum, status) => sum + (status.damageReduction || 0), 0);
  return Math.min(0.9, reduction);
};

const applyHealing = (actor, amount) => {
  if (!amount || amount <= 0) return 0;
  const heal = Math.round(amount);
  actor.currentHealth = Math.min(actor.maxHealth, actor.currentHealth + heal);
  return heal;
};

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
  const livingAllies = allies.filter((entry) => entry.currentHealth > 0) || [actor];
  const livingOpponents = opponents.filter((entry) => entry.currentHealth > 0);

  switch (ability.target) {
    case "ALLY":
      return (livingAllies.length > 0 ? livingAllies : [actor])
        .slice()
        .sort((a, b) => a.currentHealth / a.maxHealth - b.currentHealth / b.maxHealth)[0];
    case "SELF":
      return actor;
    case "AREA":
      return livingOpponents.length > 0 ? livingOpponents : opponents;
    case "ENEMY":
    default:
      return livingOpponents.reduce((best, candidate) => {
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
  let remaining = Math.max(0, amount || 0);
  let absorbed = 0;

  target.statuses.forEach((status) => {
    if (remaining <= 0) return;
    if (typeof status.shield === "number" && status.shield > 0) {
      const chunk = Math.min(remaining, status.shield);
      status.shield -= chunk;
      remaining -= chunk;
      absorbed += chunk;
    }
  });

  const reduction = getDamageReductionFactor(target);
  const reduced = remaining * (1 - reduction);
  const applied = Math.max(0, Math.round(reduced));
  target.currentHealth = Math.max(0, target.currentHealth - applied);

  return {
    applied,
    absorbed,
    reduced: Math.round(reduced),
    damageReduction: reduction,
  };
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
  const selected = selectTarget(ability, actor, allies, opponents, rng);
  const targets = Array.isArray(selected)
    ? selected.filter((entity) => entity.currentHealth > 0)
    : selected
    ? [selected]
    : [];

  if (targets.length === 0) {
    return { action: "SKIP" };
  }

  const formula = ability.formula || {};
  const scaling = formula.scaling || {};
  const hits = formula.hits || 1;
  const varianceRange = formula.variance ?? 0.2;
  const payload = { ability: ability.slug, action: ability.name, targets: [] };

  const computeScalingTotal = () =>
    Object.entries(scaling).reduce((total, [stat, multiplier]) => {
      const statValue = getEffectiveStat(actor, stat);
      return total + statValue * multiplier;
    }, 0);

  const applyStatusWithChance = (statusDef, targetEntity) => {
    if (!statusDef) return null;
    const chance = statusDef.chance ?? 1;
    if (rng() > chance) return null;
    pushStatus(targetEntity, statusDef);
    return (statusDef.name || statusDef.type || "status").toUpperCase();
  };

  const addLogEntry = (entry) => {
    log.push({
      round,
      ...entry,
    });
  };

  switch ((formula.type || "physical").toLowerCase()) {
    case "healing": {
      const base = ability.basePower || 0;
      const scalingTotal = computeScalingTotal();
      const healAmount = base + scalingTotal;

      targets.forEach((target) => {
        const applied = applyHealing(target, healAmount);
        payload.targets.push({ target: target.name, heal: applied });
        addLogEntry({
          actionType: "HEAL",
          actor: actor.name,
          target: target.name,
          value: applied,
          ability: ability.name,
        });

        if (formula.status) {
          const appliedStatus = applyStatusWithChance(formula.status, target);
          if (appliedStatus) {
            payload.status = appliedStatus;
          }
        }

        if (formula.cleanse) {
          const removed = removeDebuffs(target);
          if (removed > 0) {
            payload.cleanse = (payload.cleanse || 0) + removed;
            addLogEntry({
              actionType: "STATUS_CLEANSE",
              actor: actor.name,
              target: target.name,
              ability: ability.name,
              value: removed,
            });
          }
        }
      });
      break;
    }
    case "buff": {
      const effectTargets = targets.length > 0 ? targets : [actor];
      effectTargets.forEach((target) => {
        pushStatus(target, formula.effect);
        payload.targets.push({ target: target.name, buff: formula.effect });
        addLogEntry({
          actionType: "BUFF",
          actor: actor.name,
          target: target.name,
          ability: ability.name,
          effect: formula.effect,
        });

        if (formula.cleanse) {
          const removed = removeDebuffs(target);
          if (removed > 0) {
            payload.cleanse = (payload.cleanse || 0) + removed;
            addLogEntry({
              actionType: "STATUS_CLEANSE",
              actor: actor.name,
              target: target.name,
              ability: ability.name,
              value: removed,
            });
          }
        }
      });
      break;
    }
    default: {
      const scalingTotal = computeScalingTotal();
      let totalLifeSteal = 0;

      targets.forEach((target) => {
        let targetDamage = 0;
        let absorbed = 0;
        const statusApplied = [];

        for (let hit = 0; hit < hits; hit += 1) {
          const basePower = ability.basePower || 0;
          let damageBase = basePower + scalingTotal;

          if (formula.finisher) {
            const threshold = formula.finisher.threshold ?? 0.3;
            if (target.currentHealth / target.maxHealth <= threshold) {
              damageBase *= formula.finisher.multiplier ?? 1.5;
            }
          }

          const defense = getEffectiveStat(target, "defense");
          const defenseScaling = formula.defenseScaling ?? 0.4;
          const armorPen = formula.armorPenetration ?? 0;
          const mitigation = defense * defenseScaling * (1 - armorPen);
          const variance = 1 - varianceRange / 2 + rng() * varianceRange;
          const damage = Math.max(0, damageBase * variance - mitigation);
          const { applied, absorbed: shielded } = applyDamage(actor, target, damage);
          targetDamage += applied;
          absorbed += shielded;

          if (formula.status) {
            const appliedStatus = applyStatusWithChance(formula.status, target);
            if (appliedStatus) {
              statusApplied.push(appliedStatus);
            }
          }

          if (target.currentHealth <= 0) {
            break;
          }
        }

        if (formula.lifeSteal && targetDamage > 0) {
          const healed = applyHealing(actor, targetDamage * formula.lifeSteal);
          totalLifeSteal += healed;
        }

        payload.targets.push({
          target: target.name,
          damage: targetDamage,
          absorbed,
          statuses: statusApplied,
        });

        addLogEntry({
          actionType: "DAMAGE",
          actor: actor.name,
          target: target.name,
          ability: ability.name,
          value: targetDamage,
        });
      });

      if (totalLifeSteal > 0) {
        payload.lifeSteal = totalLifeSteal;
        addLogEntry({
          actionType: "HEAL",
          actor: actor.name,
          target: actor.name,
          value: totalLifeSteal,
          ability: ability.name,
          context: "LIFESTEAL",
        });
      }
      break;
    }
  }

  if (formula.selfStatus) {
    pushStatus(actor, formula.selfStatus);
    addLogEntry({
      actionType: "BUFF",
      actor: actor.name,
      target: actor.name,
      ability: ability.name,
      effect: formula.selfStatus,
    });
  }

  if (payload.targets.length === 1) {
    const [single] = payload.targets;
    payload.target = single.target;
    if (single.damage !== undefined) payload.damage = single.damage;
    if (single.heal !== undefined) payload.heal = single.heal;
  } else if (payload.targets.length > 1) {
    payload.target = payload.targets.map((entry) => entry.target).join(", ");
  }

  return { action: ability.slug, payload };
};

const tickStatuses = (actor, log, round) => {
  const nextStatuses = [];
  const skipStatuses = [];

  actor.statuses.forEach((status) => {
    if (status.skipTurn) {
      skipStatuses.push(status);
    }

    if (typeof status.multiplier === "number" && !status.statMultipliers) {
      status.statMultipliers = { defense: status.multiplier };
    }

    if (status.damagePerTurn) {
      const damage = Math.max(0, Math.round(status.damagePerTurn));
      actor.currentHealth = Math.max(0, actor.currentHealth - damage);
      log.push({
        round,
        actionType: "STATUS_DAMAGE",
        actor: actor.name,
        status: status.type,
        value: damage,
      });
    }

    if (status.healPerTurn) {
      const heal = applyHealing(actor, status.healPerTurn);
      if (heal > 0) {
        log.push({
          round,
          actionType: "STATUS_HEAL",
          actor: actor.name,
          status: status.type,
          value: heal,
        });
      }
    }

    if (status.remaining === undefined || status.remaining === null) {
      nextStatuses.push(status);
      return;
    }

    status.remaining -= 1;
    if (status.remaining >= 0) {
      nextStatuses.push(status);
    } else {
      log.push({
        round,
        actionType: "STATUS_EXPIRE",
        actor: actor.name,
        status: status.type,
      });
    }
  });

  actor.statuses = nextStatuses.filter((status) => {
    if (typeof status.shield === "number" && status.shield <= 0) {
      const hasPersistentEffect = Boolean(
        status.damagePerTurn ||
          status.healPerTurn ||
          (status.statModifiers && Object.keys(status.statModifiers).length > 0) ||
          (status.statMultipliers && Object.keys(status.statMultipliers).length > 0)
      );
      return hasPersistentEffect;
    }
    if (status.remaining !== undefined && status.remaining < 0) {
      return false;
    }
    return true;
  });

  return { skipStatuses };
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
        initiative: getEffectiveStat(actor, "speed") + rng(),
      }))
      .sort((a, b) => b.initiative - a.initiative)
      .map((entry) => entry.actor);

    for (const actor of order) {
      if (actor.currentHealth <= 0) continue;

      const { skipStatuses } = tickStatuses(actor, log, rounds);
      if (actor.currentHealth <= 0) continue;

      if (skipStatuses.length > 0) {
        const statusNames = skipStatuses.map((status) => status.type);
        log.push({
          round: rounds,
          actionType: "STATUS_SKIP",
          actor: actor.name,
          status: statusNames[0],
          statuses: statusNames,
        });
        continue;
      }

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
