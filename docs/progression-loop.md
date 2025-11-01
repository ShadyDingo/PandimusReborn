# Core Progression Loop Spec

Last updated: 2025-11-01

This document outlines the end-to-end player progression loop targeted for the initial playable prototype. It captures system requirements, content ramps, and integration points so we can iterate rapidly after implementation.

## 1. Projection: Player Journey

| Stage | Narrative Beat | System Goals | Exit Criteria |
| --- | --- | --- | --- |
| **Tutorial Arrival** | Player awakens in the Forest of Whispering Oaks. | Teach basic combat flow, inventory, and loadout concepts. | Complete 2 guided combats (Forest Goblin, Spriggan Scout) and equip first gear drop. |
| **Tier 1 (Levels 1-3)** | Patrol the forest & plains outskirts. | Expose active vs. idle missions, introduce gear rarity ladder. | Reach level 4, acquire at least 2 uncommon items, unlock Tier 2 missions. |
| **Tier 2 (Levels 4-6)** | Unlock Sunlit Plains & Sapphire Shores. | Encourage ability experimentation, enforce loadout adjustments for control effects. | Defeat first elite (Sunblade Nomad or Coral Siren), reach level 7. |
| **Tier 3 (Levels 7-8)** | Conquer Mountains & Boreal Tundra. | Introduce elite mechanics (skip-turn, massive shields), ramp crafting materials. | Defeat elite bosses (Obsidian Golem, Glacier Giant), craft first epic item. |
| **Tier 4 (Levels 9-10)** | Enter Volcanic Expanse. | Deliver apex encounters requiring full loadout tuning, reward legendary drops. | Defeat Ashen Phoenix and Magma Behemoth, unlock Celestial Plane. |
| **Tier 5 (Levels 11+)** | Face the Void & Celestial threats. | Showcase endgame loops, encourage mastery builds. | Defeat Astral Paragon, unlock repeatable boss rush + high-tier idle missions. |

## 2. Loop Overview

```
Hub (Camp) ? Prep & Loadout ? Mission Selection ? Combat Simulation ? Rewards ? Hub
       ??????????????????????? Idle Dispatch ??????????????
```

1. **Hub / Camp** (client: `Dashboard`)  
   - Surfaces character sheet (stats, level, EXP to next), equipped gear, active missions.  
   - Shows alerts (idle rewards ready, new biome unlocked).  
   - Provides entry points for: Mission board, Idle assignments, Loadout editor, Market/Crafting (future).

2. **Preparation**  
   - Player adjusts loadout (abilities + gear).  
   - Gear UI should display slot bonuses, rarities, and derived stats (call `statMath.mergeStats`).  
   - Pre-mission summary highlights biome modifiers (e.g., Volcanic = ambient burn chance).

3. **Mission Selection**  
   - Missions grouped by biome and tier. Each card shows: recommended level, enemy roster preview, reward ranges, token cost (if any).  
   - Unlock logic: once player meets `level >= requirement` AND prior biome boss defeated, next biome missions become available.  
   - Mission metadata (`prisma.mission`): add fields `biome`, `tier`, `energyCost`, `enemySet` (list of `enemySlug`s with quantities).

4. **Combat Simulation**  
   - Server uses `combatService.startCombat` with mission-specific enemy selection.  
   - Logging remains deterministic; client should receive: summary, turn log, stat breakdown (damage dealt, inflicted statuses).  
   - For elites/bosses, highlight unique mechanics (e.g., `meteor_swarm` preview).

5. **Rewards & Progression**  
   - Use `computeCombatRewards`: base reward + biome modifier + fast/slow victory adjustments.  
   - Add `biomeBonus` parameter to reward calculator (forest = extra crafting fiber, volcanic = extra rare drop chance).  
   - Player receives: XP, gold, loot table rolls, biome tokens (future).  
   - Record mission completion (for unlock gating) in `MissionAttempt`.

6. **Idle Dispatch**  
   - Idle missions per biome (duration tiers: 1h, 4h, 8h).  
   - Checks character power vs. mission difficulty to determine reward efficiency.  
   - Idle results weighted toward crafting materials and uncommon gear duplicates.  
   - Add `biome` field to `IdleSession` for future achievements.

## 3. Biome Structure & Enemy Bands

| Biome | Tier Unlock | Mission Types | Enemies (Sample) | Rewards Focus |
| --- | --- | --- | --- | --- |
| Forest of Whispering Oaks | Default | Tutorial skirmishes, patrols | Forest Goblin, Spriggan Scout | Starter gear, herbs (craft) |
| Sunlit Plains | Level 4 | Caravan escort, duels | Plains Lurker, Sunblade Nomad, Storm Lancer | Weapon upgrades, leather |
| Sapphire Shores | Level 5 | Shore defense, pirate raid | Tidebreaker Crab, Coral Siren, Storm Corsair | Accessories, pearls (craft) |
| Skyreach Mountains | Level 6 | Summit climbs, aerial assaults | Stone Ram, Sky Roc, Obsidian Golem | Heavy armor, ore |
| Boreal Tundra | Level 7 | Blizzard survival, spirit hunts | Frost Wolf, Glacier Giant, Aurora Wraith | Frost-themed gear, rare essences |
| Volcanic Expanse | Level 8 | Lava flow containment, phoenix hunt | Ember Sprite, Lava Salamander, Ashen Phoenix, Magma Behemoth | Epic gear, legendary materials |
| Celestial / Void | Level 10 | Rift closures, celestial trials | Void Scholar, Astral Paragon | Endgame legendaries, planar tokens |

## 4. Progression Systems & Economy

### Experience & Leveling
- Base XP per mission scales with `mission.difficultyRating`.  
- Bonus XP modifiers: +10% first clear, +5% for perfect victory (no deaths), +biome mastery bonus (see below).  
- Level curve target: level 10 ? 20 missions and 4 idle cycles (~3-4 hours of active play).

### Gold & Crafting Materials
- Gold earned funds market purchases (future) and ability respec fees.  
- Materials tied to biomes (e.g., `sylvan-spool` from forest idle, volcanic missions drop `ember-core`, `magma-behemoth` guarantees legendary core).  
- Implement `CraftingRecipe` model later; for prototype, materials catalog and future recipes are documented.

### Gear Acquisition
- Mission loot tables already include new gear; ensure each tier introduces new stat packages.  
- Add pity timer logic: guarantee at least one uncommon within 3 mission clears in new biome; one epic within 5 elite defeats.  
- Idle missions yield gear shards (future crafting) and consumables.

### Biome Mastery
- Track clears per biome; after N successful missions (e.g., 10), grant passive bonus (forest = +3% poison resist, tundra = +3% slow resist).  
- Store in `CharacterBiomeProgress` table: `characterId`, `biome`, `missionsCleared`, `masteryLevel`.

## 5. Unlock & Gate Logic

1. **Mission Unlock Rules**  
   - `mission.tier <= character.level` (adjustable).  
   - `mission.prerequisiteMissionCode` for bosses (defeat Storm Lancer before unlocking Mountain Tier 3).  
   - Use server route `GET /game/missions` to filter by unlock state.

2. **Loadout Requirements**  
   - Story gate: before Volcanic, require player to equip at least four rare+ items (gear check).  
   - Add check in mission start endpoint to enforce requirement and return actionable error.

3. **Ability Unlocks**  
   - Core abilities from class definitions at start.  
   - Additional abilities unlocked via boss drops (e.g., `void_rift` scroll from Aurora Wraith).  
   - Store in `AbilityUnlock` table mapping character to learned ability slugs.

## 6. UI/UX Implementation Plan

1. **Mission Board**  
   - Card layout grouped by biome (accordion or tabs).  
   - Display enemy icons (small portraits) plus tooltip summarizing signature mechanics.  
   - CTA: `Scout` (view details) / `Engage` (immediate battle).  
   - Include recommended power (calc from enemy stats).  

2. **Biome Map**  
   - Build stylized map overlay for immersion (optional for prototype).  
   - Represent progression path visually; lock icons for upcoming biomes.

3. **Post-Mission Summary**  
   - Recap: XP gained, level-ups, items dropped, statuses inflicted / received counts.  
   - Progress bars for Biome Mastery and global achievements.  
   - CTA for `Run Again`, `Return to Hub`, `Assign Idle` (prefill same biome).

4. **Idle Dispatch UI**  
   - Horizontal cards per biome showing success chance and reward preview.  
   - Timer display with notification when complete.  
   - Tie into existing idle API endpoints (`startIdle`, `claimIdle`).

## 7. Engineering Tasks

### Backend
- Extend `Mission` model with `biome`, `tier`, `energyCost`, `enemySet`.  
- Add `CharacterBiomeProgress` table.  
- Implement `missionService.getMissionsForCharacter` to inject unlock metadata.  
- Update `combatService.startCombat` to accept specific enemy slug list.  
- Add ability unlock service for boss drops.  
- Update reward calculator with biome modifiers and pity timers.

### Frontend
- Mission board components (biome grouping, mission cards, detail modals).  
- Loadout UI enhancements with stat delta logic.  
- Post-combat summary panel with new metrics.  
- Idle missions screen with biome filters and timer states.  
- Notifications system for unlocks/incomplete idle tasks.

### Data & Content
- Populate `mission` records per biome (tutorial, standard, elite, boss).  
- Configure `enemySet` arrays referencing new enemy slugs.  
- Define loot tables aligned with gear progression.  
- Write short flavor text for each mission for immersion.

## 8. Balancing Guidelines

- **Health & Damage Scaling** ? keep enemy effective HP (HP adjusted for DR) roughly: Tier1=150, Tier2=350, Tier3=600, Tier4=850, Tier5=1100+.  
- **Player Power Baseline** ? assume player power rating grows ~+70 per tier with new gear.  
- **Elite Mechanics** ? ensure skip-turn or heavy burn abilities have telegraphs (log messages, UI warnings).  
- **Reward Ratios** ? aim for mission XP = 70% of level requirement per tier (so ~3 missions per level), idle XP = 30% to keep active play primary.  
- **Difficulty Cheatsheet**:
  - Low tier missions: enemy power <= player power * 0.9.  
  - Mid tier: enemy power ? player power.  
  - Elite: enemy power = player power * 1.2 (compensated by rewards).  
  - Boss: enemy power = player power * 1.35 + unique mechanics.

## 9. Telemetry & Iteration Hooks

- Log mission outcomes: mission code, success/fail, rounds taken, total damage dealt/taken.  
- Track loot drops vs. pity timer triggers.  
- Record ability usage frequency to tune balance.  
- Monitor idle mission claim rates to adjust reward/time.

## 10. Future Extensions

- **Faction Reputation** ? align biomes with factions; completing missions unlocks vendors and narrative arcs.  
- **Dungeon Chains** ? multi-mission sequences culminating in apex boss (e.g., three-step volcanic raid).  
- **Co-op / Asynchronous Support** ? share idle mission progress, co-op boss fights.  
- **Seasonal Events** ? temporary biomes (e.g., Haunted Mire) introducing limited-time enemies and cosmetics.

---

Implementation order suggestion: mission data & backend unlock logic ? mission board UI ? loadout/inventory UI pass ? biome mastery tracking ? idle rework ? reward/pity adjustments ? telemetry wiring.
