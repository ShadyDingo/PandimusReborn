# Enemy Roster & Biome Guide

Pandimus Reborn now features a multi-biome bestiary that scales from low-level patrols to apex bosses. Each enemy below references abilities defined in `prisma/seed.js`, so they plug directly into combat simulations once you reseed the database.

## Forest of Whispering Oaks
- **Forest Goblin** (lvl 2, low) ? `slash`, `bleeding_edge`
- **Spriggan Scout** (lvl 4, mid) ? `poison_cloud`, `entangling_roots`, `wild_growth`
- **Ancient Treant** (lvl 7, elite) ? `entangling_roots`, `stone_skin`, `wild_growth`

## Sunlit Plains
- **Plains Lurker** (lvl 3, low) ? `twin_fangs`, `shadow_step`
- **Sunblade Nomad** (lvl 5, elite) ? `slash`, `battle_shout`, `execute`
- **Storm Lancer** (lvl 8, boss) ? `tempest`, `chain_lightning`, `snipe`

## Skyreach Mountains
- **Stone Ram** (lvl 3, low) ? `earth_spike`, `guard`
- **Sky Roc** (lvl 6, flying) ? `gust`, `whirlwind`, `thunderclap`
- **Obsidian Golem** (lvl 7, high construct) ? `earth_shatter`, `crystalline_spines`, `stone_skin`

## Sapphire Shores
- **Tidebreaker Crab** (lvl 3, low) ? `earth_shatter`, `guard`
- **Coral Siren** (lvl 5, caster) ? `poison_cloud`, `life_drain`, `renew`
- **Storm Corsair** (lvl 7, elite) ? `chain_lightning`, `snipe`, `battle_shout`

## Boreal Tundra
- **Frost Wolf** (lvl 4, low) ? `ice_shard`, `shadow_step`
- **Glacier Giant** (lvl 8, elite) ? `hailstorm`, `crystalline_spines`, `stone_skin`
- **Aurora Wraith** (lvl 9, boss) ? `void_rift`, `ice_shard`, `grave_chill`

## Volcanic Expanse
- **Ember Sprite** (lvl 3, elemental) ? `firebolt`, `flame_wave`
- **Lava Salamander** (lvl 5, mid) ? `flame_wave`, `poison_cloud`, `stone_skin`
- **Ashen Phoenix** (lvl 9, boss) ? `meteor_swarm`, `flame_wave`, `phoenix_rebirth`
- **Magma Behemoth** (lvl 10, apex) ? `earth_shatter`, `meteor_swarm`, `phoenix_rebirth`

## Void & Celestial Planes
- **Void Scholar** (lvl 8, caster) ? `void_rift`, `mana_burn`, `arcane_barrier`
- **Astral Paragon** (lvl 11, apex) ? `starfall`, `arcane_barrier`, `meteor_swarm`

### Usage Tips
- Mix enemies from the same biome to theme missions while keeping level bands coherent.
- Elite and boss enemies (marked above) rely on newly added abilities such as `meteor_swarm`, `void_rift`, `crystalline_spines`, and `phoenix_rebirth`.
- Reseed your database with `npm run prisma:seed` to load the latest enemy stats and ability hooks before running simulations or spawning encounters.
