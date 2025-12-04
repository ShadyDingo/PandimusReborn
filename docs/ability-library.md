# Ability Library Overview

Pandimus Reborn now offers fifty-two distinct abilities spanning martial weapon arts, ranged technique, elemental sorcery, nature magic, and restorative or divine support. Every entry below ships with the database seed (`prisma/seed.js`) and is exercised by the automated combat engine.

## Weapon Arts & Close Combat

- **Slash** (`slash`) - Fast single slashing strike with light variance.
- **Guard** (`guard`) - One-round brace that multiplies defense and adds 25% mitigation.
- **Power Strike** (`power_strike`) - Heavy armor-breaking blow tuned for burst turns.
- **Twin Fangs** (`twin_fangs`) - Two rapid hits to trigger on-hit effects and finishers.
- **Bleeding Edge** (`bleeding_edge`) - Guaranteed bleed DoT layered over upfront damage.
- **Shield Wall** (`shield_wall`) - Two-round mitigation stack with shield and damage reduction.
- **Battle Shout** (`battle_shout`) - Self-buff granting flat attack and a 10% attack multiplier.
- **Execute** (`execute`) - Finisher that doubles output once foes drop below 35% HP.
- **Shadow Step** (`shadow_step`) - Self-haste and attack steroid for agile repositioning.
- **Crushing Blow** (`crushing_blow`) - Bludgeoning strike with improved armor penetration.
- **Shield Bash** (`shield_bash`) - Stuns targets for a full turn using new skip-turn logic.
- **Whirlwind** (`whirlwind`) - Two-hit area spin that scales with attack speed buffs.
- **Rend Armor** (`rend_armor`) - Defense-shredding debuff that softens targets for allies.
- **Berserker Rage** (`berserker_rage`) - High-risk self buff trading defense for offense.
- **Fortify** (`fortify`) - Multi-round defensive bulwark with damage reduction.
- **Reckless Charge** (`reckless_charge`) - High-damage opener that applies a self-exposed debuff.
- **Earth Shatter** (`earth_shatter`) - Area slam with a chance to stun nearby enemies.
- **Earth Spike** (`earth_spike`) - Single-target speed debuff representing earthen control.

## Ranged & Precision Techniques

- **Piercing Arrow** (`piercing_arrow`) - Armor-ignoring arrow with 50% penetration.
- **Volley** (`volley`) - Broad arrow fan striking every opponent.
- **Snipe** (`snipe`) - High-precision, low-variance burst shot.
- **Hobbling Shot** (`hobbling_shot`) - Reliable speed debuff from range.
- **Venom Dart** (`venom_dart`) - Poisonous dart with reliable DoT application.
- **Crippling Poison** (`crippling_poison`) - Weapon coat that reduces attack and speed.

## Elemental Fire & Frost

- **Firebolt** (`firebolt`) - Core fire projectile with burn chance.
- **Flame Wave** (`flame_wave`) - Rolling fire AoE that ignites multiple foes.
- **Inferno** (`inferno`) - High-variance finisher that applies severe burning.
- **Meteor Swarm** (`meteor_swarm`) - Elite-tier meteor shower that scorches all enemies and inflicts heavy burns.
- **Ice Shard** (`ice_shard`) - Heavy chill that manipulates initiative order.
- **Hailstorm** (`hailstorm`) - Triple-hit frost storm applying short slows.
- **Frost Barrier** (`frost_barrier`) - Defensive ice shell with shield and mitigation.

## Storm & Arcane Mastery

- **Chain Lightning** (`chain_lightning`) - Area lightning arc with variance and slow.
- **Thunderclap** (`thunderclap`) - Shockwave that can stun each enemy for a turn.
- **Tempest** (`tempest`) - Self storm surge boosting speed and attack.
- **Gust** (`gust`) - Ally-focused speed buff to re-order turn priority.
- **Arcane Barrier** (`arcane_barrier`) - Mana shield with defense scaling and barrier HP.
- **Mana Burn** (`mana_burn`) - Magic stat reduction over time plus damage.
- **Starfall** (`starfall`) - High variance meteor shower striking all enemies.
- **Void Rift** (`void_rift`) - Tears reality to drain magic and has a high chance to skip enemy turns.

## Shadow, Nature & Toxins

- **Life Drain** (`life_drain`) - Shadow siphon healing the caster for 60% of damage dealt.
- **Poison Cloud** (`poison_cloud`) - Area DoT applying poison to every target.
- **Wild Growth** (`wild_growth`) - Strong HoT scaling with magic for nature healers.
- **Entangling Roots** (`entangling_roots`) - Root that enforces the new skip-turn mechanic while slashing speed.
- **Grave Chill** (`grave_chill`) - Harsh debuff that suppresses attack and speed simultaneously.

## Divine & Supportive Magic

- **Healing Light** (`heal`) - Baseline single-target heal.
- **Renew** (`renew`) - Heal plus regen over three turns.
- **Ward of Light** (`ward_of_light`) - Damage reduction aura paired with passive healing.
- **Purify** (`purify`) - Heal plus cleanse that removes all debuffs using the new cleanse logic.
- **Revitalize** (`revitalize`) - Burst heal with follow-up HoT ticks.
- **Blessing of Vigor** (`blessing_of_vigor`) - Attack and speed buff for allies.
- **Sanctuary** (`sanctuary`) - Shield + mitigation bubble for a frontline ally.
- **Spirit Link** (`spirit_link`) - Shared defensive buff for caster and target alike.
- **Stone Skin** (`stone_skin`) - High-magnitude defense multiplier for tanks.
- **Smite** (`smite`) - Holy strike that leaves a radiant mark reducing defense.
- **Radiant Blast** (`radiant_blast`) - Area holy spell that dazzles foes, lowering attack.
- **Crystalline Spines** (`crystalline_spines`) - Elite defensive buff stacking shields and heavy damage reduction.
- **Phoenix Rebirth** (`phoenix_rebirth`) - Self-renewing flames that heal each turn and absorb lethal bursts.

> The full data structure (base power, scaling, cooldowns, status payloads, and tags) lives in `prisma/seed.js`. Use that file when balancing or extending the move set.

## Class Default Loadouts

- **Warrior** - `slash`, `shield_bash`, `fortify`, `reckless_charge`
- **Mage** - `firebolt`, `hailstorm`, `chain_lightning`, `frost_barrier`
- **Rogue** - `twin_fangs`, `bleeding_edge`, `shadow_step`, `snipe`
- **Cleric** - `heal`, `purify`, `smite`, `sanctuary`

## Engine Support Highlights

- Skip-turn statuses (stuns, roots) now log `STATUS_SKIP` and properly consume rounds.
- Cleansing effects strip negative statuses flagged with `isDebuff`, logging `STATUS_CLEANSE` entries.
- `selfStatus` hooks let abilities apply follow-up effects to the caster (e.g., `reckless_charge`, `spirit_link`).
- Multi-hit damage, finishers, life steal, shields, and armor penetration remain orchestrated by `resolveAbility`.
- `tickStatuses` handles HoTs, DoTs, shield depletion, and stat modifications each round without losing duration fidelity.

> **Seeding:** Run `npm run prisma:seed` after pulling these changes to refresh abilities, items, enemies, and missions in your database.
