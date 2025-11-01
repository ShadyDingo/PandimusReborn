# Ability Library Overview

Pandimus Reborn now ships with an expanded catalogue of combat skills that lean into three archetypes: martial, arcane, and support. Every ability is represented in the database seed (`prisma/seed.js`) and is compatible with the automated combat loop after the recent engine upgrades.

## Martial Techniques

- **Slash** (`slash`) - Fast single strike with mild variance; default opener for melee classes.
- **Guard** (`guard`) - One-round defensive stance that multiplies defense and adds 25% damage reduction.
- **Power Strike** (`power_strike`) - Heavy overhead swing tuned for burst windows; lower defense scaling so armor doesn't negate it completely.
- **Twin Fangs** (`twin_fangs`) - Two rapid hits in one action; useful for triggering on-hit effects or finishing low-health foes.
- **Bleeding Edge** (`bleeding_edge`) - Applies a guaranteed bleed (8 damage/turn, 3 turns) alongside upfront damage.
- **Shield Wall** (`shield_wall`) - Two-round mitigation buff stacking defense, damage reduction, and a 25 HP barrier.
- **Battle Shout** (`battle_shout`) - Three-round self-buff granting +6 attack and a 10% attack multiplier.
- **Execute** (`execute`) - Finisher that doubles damage against targets below 35% health.
- **Shadow Step** (`shadow_step`) - Self-buff that grants +6 speed and a 15% attack boost for two rounds.

## Arcane & Elemental Magic

- **Firebolt** (`firebolt`) - Reliable ranged nuke with a 25% chance to ignite (7 damage/turn for 2 rounds).
- **Ice Shard** (`ice_shard`) - Applies *Chilled* (-4 speed for 2 rounds) on an 85% proc chance, soft-controlling enemy turn order.
- **Chain Lightning** (`chain_lightning`) - Area spell that hits every opponent with higher variance and a chance to apply a brief speed debuff.
- **Arcane Barrier** (`arcane_barrier`) - Mana shield that boosts defense, reduces damage by 25%, and adds a 30 HP shield for two rounds.
- **Mana Burn** (`mana_burn`) - Reduces the target's magic stat by 5 for three rounds while dealing moderate damage.
- **Life Drain** (`life_drain`) - Dual-purpose shadow spell that heals the caster for 60% of damage dealt.
- **Poison Cloud** (`poison_cloud`) - Area DoT that poisons every enemy for 10 damage/turn across three rounds.

## Restorative & Support Magic

- **Healing Light** (`heal`) - Core single-target heal scaling primarily with magic.
- **Renew** (`renew`) - Applies a HoT that restores 12 HP each turn for three rounds in addition to an initial heal.
- **Ward of Light** (`ward_of_light`) - Adds a 20% damage reduction aura plus 6 HP of regeneration for three rounds.

## Class Defaults

- **Warrior** - `slash`, `power_strike`, `shield_wall`, `battle_shout`
- **Mage** - `firebolt`, `ice_shard`, `chain_lightning`, `arcane_barrier`
- **Rogue** - `twin_fangs`, `bleeding_edge`, `shadow_step`, `execute`
- **Cleric** - `heal`, `renew`, `life_drain`, `ward_of_light`

## Engine Support Highlights

- Multi-hit abilities, finishing multipliers, life steal, and armor penetration are handled in `server/services/combatService.js` via the upgraded `resolveAbility` flow.
- Status effects now support damage-over-time, heal-over-time, stat modifiers, damage reduction, and shield values, all ticking through the enhanced `tickStatuses` routine.
- Area targeting uses the `AREA` ability target flag - see `chain_lightning` and `poison_cloud` for examples.

> **Seeding:** Run `npm run prisma:seed` after pulling these changes to populate the new abilities, enemy loadouts, and mission data.
