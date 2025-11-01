# Equipment Library & Build Philosophy

Pandimus Reborn embraces mix-and-match gear across every slot. Any class can wear any armor type or wield any weapon without penalties—builds are defined by stat tradeoffs, not rigid archetype locks. All entries below are seeded via `prisma/seed.js` and available for loot tables or vendors.

## Design Principles

- **Quality Tiers** – From rusty and tattered gear up through legendary artifacts, each step offers clear stat growth.
- **Playstyle Freedom** – Plate casters, robe-clad warriors, hybrid battle-magi: all are supported through blended stat lines.
- **Distinct Identities** – Every item has a unique description and target fantasy to make loot exciting.
- **Future Ready** – Add new drops by inserting slugs into mission tables; the stat schema stays consistent.

## Weapons

- **Apprentice Staff** (`apprentice-staff`, COMMON) – magic +6, speed +1
- **Bronze Saber** (`bronze-saber`, COMMON) – attack +5, speed +1
- **Chipped Dagger** (`chipped-dagger`, COMMON) – attack +3, speed +2
- **Copper Scepter** (`copper-scepter`, COMMON) – magic +4
- **Cracked Maul** (`cracked-maul`, COMMON) – attack +5
- **Iron Battleaxe** (`iron-battleaxe`, COMMON) – attack +7, defense +1
- **Iron Sword** (`iron-sword`, COMMON) – attack +6
- **Knotted Staff** (`knotted-staff`, COMMON) – magic +5
- **Rusted Crossbow** (`rusted-crossbow`, COMMON) – attack +5
- **Rusty Sword** (`rusty-sword`, COMMON) – attack +3
- **Splintered Axe** (`splintered-axe`, COMMON) – attack +4
- **Weathered Shortbow** (`weathered-shortbow`, COMMON) – attack +4, speed +1
- **Weathered Spear** (`weathered-spear`, COMMON) – attack +4, speed +1
- **Arcanist Staff** (`arcanist-staff`, UNCOMMON) – magic +9, speed +1
- **Gilded Scepter** (`gilded-scepter`, UNCOMMON) – magic +7, speed +1
- **Iron Warhammer** (`iron-warhammer`, UNCOMMON) – attack +8, health +10
- **Steel Crossbow** (`steel-crossbow`, UNCOMMON) – attack +8, defense +1
- **Steel Glaive** (`steel-glaive`, UNCOMMON) – attack +8, defense +1
- **Steel Longsword** (`steel-longsword`, UNCOMMON) – attack +9, defense +1
- **Sturdy Longbow** (`sturdy-longbow`, UNCOMMON) – attack +7, speed +2
- **Tempered Greataxe** (`tempered-greataxe`, UNCOMMON) – attack +10, health +10
- **Tempered Stiletto** (`tempered-stiletto`, UNCOMMON) – attack +6, speed +3
- **Arbalest of Precision** (`arbalest-of-precision`, RARE) – attack +11, speed +2
- **Dragonscale Lance** (`dragonscale-lance`, RARE) – attack +11, speed +2
- **Emberfocus Scepter** (`emberfocus-scepter`, RARE) – magic +9, speed +3
- **Hunter's Compound Bow** (`hunters-compound`, RARE) – attack +9, speed +3
- **Knight's Bastard Sword** (`knights-bastard-sword`, RARE) – attack +11, defense +2
- **Mithril Blade** (`mithril-blade`, RARE) – attack +12, speed +2
- **Nightglass Knife** (`nightglass-knife`, RARE) – attack +8, speed +4
- **Rune-etched Axe** (`rune-etched-axe`, RARE) – attack +12, speed +2
- **Steel Maul** (`steel-maul`, RARE) – attack +11, defense +2
- **Stormcall Staff** (`stormcall-staff`, RARE) – magic +12, attack +4
- **Atlas Warhammer** (`atlas-warhammer`, EPIC) – attack +16, health +30
- **Doomcleaver** (`doomcleaver`, EPIC) – attack +16, defense +3
- **Dragonbreath Arbalest** (`dragonbreath-arbalest`, EPIC) – attack +13, defense +2
- **Oracle Scepter** (`oracle-scepter`, EPIC) – magic +11, defense +2
- **Phoenix Halberd** (`phoenix-halberd`, EPIC) – attack +14, speed +3
- **Soulrender Dagger** (`soulrender-dagger`, EPIC) – attack +9, speed +4
- **Sunsteel Greatsword** (`sunsteel-greatsword`, EPIC) – attack +14, defense +4
- **Thunder Maul** (`thunder-maul`, EPIC) – attack +14, health +20
- **Voidsong Staff** (`voidsong-staff`, EPIC) – magic +14, speed +3
- **Wyrmwood Bow** (`wyrmwood-bow`, EPIC) – attack +10, speed +5
- **Celestial Pillar** (`celestial-pillar`, LEGENDARY) – attack +18, health +35, defense +4
- **Queen's Fang** (`queens-fang`, LEGENDARY) – attack +11, speed +5
- **Sovereign Lightsaber** (`sovereign-lightsaber`, LEGENDARY) – attack +17, speed +3, magic +2
- **Starfall Bow** (`starfall-bow`, LEGENDARY) – attack +12, speed +4, magic +2

## Offhand Items

- **Simple Quiver** (`simple-quiver`, COMMON) – attack +3, speed +1
- **Splintered Shield** (`splintered-shield`, COMMON) – defense +5, health +10
- **Traveler's Grimoire** (`travelers-grimoire`, COMMON) – magic +5, defense +2
- **Codex of Echoes** (`codex-of-echoes`, UNCOMMON) – magic +7, speed +2
- **Hunter's Quiver** (`hunters-quiver`, UNCOMMON) – attack +5, speed +2, magic +2
- **Iron Kiteshield** (`iron-kiteshield`, UNCOMMON) – defense +7, health +14
- **Shadowglass Dirk** (`shadowglass-dirk`, UNCOMMON) – attack +6, speed +3
- **Ranger's Cartridge** (`rangers-cartridge`, RARE) – attack +7, speed +3
- **Spellbinder Codex** (`spellbinder-codex`, RARE) – magic +10, defense +4
- **Steel Aegis** (`steel-aegis`, RARE) – defense +9, health +18
- **Totemic Idol** (`totemic-idol`, RARE) – health +30, magic +6
- **Aegis Bulwark** (`aegis-bulwark`, EPIC) – defense +11, health +25
- **Libram of Infinity** (`libram-of-infinity`, EPIC) – magic +12, speed +3
- **Spirit Ward Orb** (`spirit-ward-orb`, EPIC) – defense +6, magic +5
- **Dragonshell Bulwark** (`dragonshell-bulwark`, LEGENDARY) – defense +13, health +32

## Headgear

- **Apprentice Cowl** (`apprentice-cowl`, COMMON) – magic +4
- **Dented Helm** (`dented-helm`, COMMON) – defense +4, health +8
- **Patched Hood** (`patched-hood`, COMMON) – attack +2, speed +2
- **Tattered Cowl** (`tattered-cowl`, COMMON) – magic +2
- **Iron Ward Helm** (`iron-ward-helm`, UNCOMMON) – defense +6, health +12
- **Scholar's Cowl** (`scholars-cowl`, UNCOMMON) – magic +6, speed +1
- **Scout Hood** (`scout-hood`, UNCOMMON) – attack +3, speed +3
- **Archmage Cowl** (`archmage-cowl`, RARE) – magic +8, speed +2
- **Astral Visor** (`astral-visor`, RARE) – magic +8, speed +3
- **Stalker Mask** (`stalker-mask`, RARE) – attack +5, speed +3
- **Steel Sentinel Helm** (`steel-sentinel-helm`, RARE) – defense +8, health +15
- **Champion's Greathelm** (`champions-greathelm`, EPIC) – defense +10, health +18
- **Crown of Abandon** (`crown-of-abandon`, EPIC) – magic +10, speed +2
- **Shadowstalker Hood** (`shadowstalker-hood`, EPIC) – attack +6, speed +4

## Chest Armor

- **Apprentice Robes** (`apprentice-robes`, COMMON) – magic +5
- **Dented Breastplate** (`dented-breastplate`, COMMON) – defense +6, health +18
- **Iron Breastplate** (`iron-breastplate`, COMMON) – defense +7, health +20
- **Patched Leathers** (`patched-leathers`, COMMON) – defense +4, speed +1
- **Tattered Robes** (`tattered-robes`, COMMON) – magic +3
- **Elegant Robes** (`elegant-robes`, UNCOMMON) – magic +7, speed +2
- **Hunter's Coat** (`hunters-coat`, UNCOMMON) – attack +5, speed +3
- **Reinforced Leathers** (`reinforced-leathers`, UNCOMMON) – defense +6, speed +2
- **Scholar's Robes** (`scholars-robes`, UNCOMMON) – magic +8, defense +2
- **Steel Breastplate** (`steel-breastplate`, UNCOMMON) – defense +9, health +24
- **Raider's Jacket** (`raiders-jacket`, RARE) – attack +6, speed +3
- **Wizard's Robes** (`wizards-robes`, RARE) – magic +10, speed +3
- **Wyrdforged Mail** (`wyrdforged-mail`, RARE) – defense +8, magic +6
- **Bastion Platemail** (`bastion-platemail`, EPIC) – defense +12, health +40
- **Robes of Abandon** (`robes-of-abandon`, EPIC) – magic +13, speed +3, health +10
- **Shadowmantle Leathers** (`shadowmantle-leathers`, EPIC) – attack +7, speed +4
- **Sovereign Plate** (`sovereign-plate`, LEGENDARY) – defense +14, health +45

## Handwear

- **Guardian Mitts** (`guardian-mitts`, COMMON) – defense +5, health +15
- **Threadbare Gloves** (`threadbare-gloves`, COMMON) – magic +2
- **Shadowgrip Gloves** (`shadowgrip-gloves`, UNCOMMON) – attack +5, speed +3
- **Spellthread Gloves** (`spellthread-gloves`, UNCOMMON) – magic +6, speed +2
- **Channeler's Wraps** (`channelers-wraps`, RARE) – magic +7, defense +2
- **Gauntlets of Fury** (`gauntlets-of-fury`, RARE) – attack +7, defense +4
- **Hunter's Grips** (`hunters-grips`, RARE) – attack +6, speed +2
- **Wildgrowth Bracers** (`wildgrowth-bracers`, RARE) – health +20, magic +5
- **Titan Gauntlets** (`titan-gauntlets`, EPIC) – attack +8, defense +5, health +20

## Leg Armor

- **Apprentice Slacks** (`apprentice-slacks`, COMMON) – magic +4
- **Dented Greaves** (`dented-greaves`, COMMON) – defense +5, health +15
- **Frayed Pants** (`frayed-pants`, COMMON) – magic +2
- **Legion Greaves** (`legion-greaves`, COMMON) – defense +6, health +18
- **Patched Breeches** (`patched-breeches`, COMMON) – attack +3, speed +2
- **Scholar's Legwraps** (`scholars-legwraps`, UNCOMMON) – magic +6, speed +1
- **Steel Legguards** (`steel-legguards`, UNCOMMON) – defense +7, health +20
- **Thornroot Breeches** (`thornroot-breeches`, UNCOMMON) – magic +4, health +20
- **Windstep Leggings** (`windstep-leggings`, UNCOMMON) – attack +4, speed +5
- **Archmage Trousers** (`archmage-trousers`, RARE) – magic +8, speed +3
- **Assailant Pants** (`assailant-pants`, RARE) – attack +5, defense +4
- **Imperial Greaves** (`imperial-greaves`, EPIC) – defense +9, health +24

## Footwear

- **Scout Boots** (`scout-boots`, COMMON) – attack +3, speed +3
- **Soft House Slippers** (`soft-house-slippers`, COMMON) – magic +2
- **Stalwart Boots** (`stalwart-boots`, COMMON) – defense +5, health +15
- **Swiftstep Boots** (`swiftstep-boots`, COMMON) – speed +6
- **Knight Sabatons** (`knight-sabatons`, UNCOMMON) – defense +6, health +16
- **Runebound Sandals** (`runebound-sandals`, UNCOMMON) – magic +4, speed +4
- **Stalker Treads** (`stalker-treads`, UNCOMMON) – attack +4, speed +3
- **Earthshaker Sabatons** (`earthshaker-sabatons`, RARE) – defense +7, health +18, attack +3
- **Tempest Greaves** (`tempest-greaves`, EPIC) – speed +5, attack +2

## Rings (Accessory Slot 1)

- **Copper Band** (`copper-band`, COMMON) – attack +2
- **Arcane Ring** (`arcane-ring`, UNCOMMON) – magic +5
- **Ring of Sinew** (`ring-of-sinew`, UNCOMMON) – attack +4, speed +2
- **Ring of Vigor** (`ring-of-vigor`, UNCOMMON) – health +20, attack +3
- **Ring of Warding** (`ring-of-warding`, UNCOMMON) – defense +4, health +15
- **Ring of Clarity** (`ring-of-clarity`, RARE) – attack +4, magic +4
- **Ring of Focus** (`ring-of-focus`, RARE) – magic +6, speed +3
- **Ring of Superiority** (`ring-of-superiority`, EPIC) – attack +5, defense +3, magic +3
- **Ring of the Void** (`ring-of-the-void`, LEGENDARY) – magic +7, speed +3, attack +3

## Amulets & Charms (Accessory Slot 2)

- **Charm of Harmony** (`charm-of-harmony`, UNCOMMON) – health +15, magic +3, attack +2
- **Pendant of Celerity** (`pendant-of-celerity`, UNCOMMON) – speed +5, attack +3
- **Totem of Bloom** (`totem-of-bloom`, UNCOMMON) – health +18, magic +4
- **Amulet of Resolve** (`amulet-of-resolve`, RARE) – defense +5, magic +5
- **Idol of Echoes** (`idol-of-echoes`, RARE) – magic +6, speed +2
- **Pendant of Torment** (`pendant-of-torment`, EPIC) – attack +6, speed +3
- **Sigil of Dominion** (`sigil-of-dominion`, EPIC) – attack +5, defense +5, magic +5

## Support Items & Crafting Components

- **Health Potion** (`health-potion`, COMMON) – effect: heal 50
- **Focus Tonic** (`focus-tonic`, UNCOMMON) – effect: speed 4, magic 4
- **Sylvan Spool** (`sylvan-spool`, UNCOMMON) – crafting: finesse 3
- **Ancient Sigil Stone** (`ancient-sigil-stone`, RARE) – crafting: resonance 4
- **Ember Core** (`ember-core`, RARE) – crafting: potency 2

### Updating Loot

Insert the desired slugs into mission loot tables or vendor inventories to surface new gear. Reseed with `npm run prisma:seed` after editing to refresh the database.
