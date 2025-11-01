# Equipment Library & Build Philosophy

Pandimus Reborn now supports a broad catalog of gear that enables any class to chase the power fantasy they imagine. Every item below is seeded via `prisma/seed.js`, available through mission loot tables, and compatible with any loadout slot?so a warrior can robe up for spell damage and a mage can armor up without penalty.

## Design Principles

- **No hard role locks** ? slot restrictions exist only for ergonomics (weapon/offhand/head, etc.), not for class identity.
- **Tradeoffs, not traps** ? every item offers a clear benefit; none impose hidden penalties like accuracy loss or stat caps.
- **Hybrid scaling** ? many pieces blend stats (attack + magic, defense + speed) to support battle-mage or spellblade fantasies.
- **Rarity tiers** ? COMMON starter pieces, UNCOMMON/RARE hybrid upgrades, and EPIC anchors for late-game build goals.

## Weapons (slot: `WEAPON`)

- **Iron Sword** (`iron-sword`, COMMON) ? attack +6
- **Sunsteel Greatsword** (`sunsteel-greatsword`, EPIC) ? attack +14, defense +4
- **Soulrender Dagger** (`soulrender-dagger`, UNCOMMON) ? attack +8, speed +4
- **Wyrmwood Bow** (`wyrmwood-bow`, RARE) ? attack +10, speed +5
- **Stormcall Staff** (`stormcall-staff`, RARE) ? magic +12, attack +4
- **Emberfocus Scepter** (`emberfocus-scepter`, UNCOMMON) ? magic +9, speed +3
- **Atlas Warhammer** (`atlas-warhammer`, EPIC) ? attack +16, health +30

## Offhands (slot: `OFFHAND`)

- **Aegis Bulwark** (`aegis-bulwark`, RARE) ? defense +9, health +25
- **Spellbinder Codex** (`spellbinder-codex`, RARE) ? magic +10, defense +4
- **Shadowglass Dirk** (`shadowglass-dirk`, UNCOMMON) ? attack +6, speed +3
- **Hunter's Quiver** (`hunters-quiver`, UNCOMMON) ? attack +5, speed +2, magic +2
- **Totemic Idol** (`totemic-idol`, RARE) ? health +30, magic +6

## Headgear (slot: `HEAD`)

- **Iron Ward Helm** (`iron-ward-helm`, COMMON) ? defense +6, health +12
- **Astral Visor** (`astral-visor`, RARE) ? magic +8, speed +3
- **Windrunner Hood** (`windrunner-hood`, UNCOMMON) ? attack +4, speed +4
- **Seer's Tiara** (`seers-tiara`, RARE) ? magic +6, defense +4
- **Stalker Mask** (`stalker-mask`, UNCOMMON) ? attack +5, speed +3
- **Druidic Circlet** (`druidic-circlet`, UNCOMMON) ? magic +5, health +15

## Chest Armor (slot: `CHEST`)

- **Leather Armor** (`leather-armor`, COMMON) ? defense +4, speed +2
- **Bastion Platemail** (`bastion-platemail`, EPIC) ? defense +12, health +40
- **Shadowweave Robe** (`shadowweave-robe`, RARE) ? magic +10, speed +4
- **Raider's Jacket** (`raiders-jacket`, UNCOMMON) ? attack +6, speed +3
- **Wyrdforged Mail** (`wyrdforged-mail`, RARE) ? defense +8, magic +6
- **Monastic Wraps** (`monastic-wraps`, UNCOMMON) ? health +25, speed +2

## Handwear (slot: `HANDS`)

- **Gauntlets of Fury** (`gauntlets-of-fury`, RARE) ? attack +7, defense +4
- **Spellthread Gloves** (`spellthread-gloves`, UNCOMMON) ? magic +6, speed +2
- **Shadowgrip Gloves** (`shadowgrip-gloves`, UNCOMMON) ? attack +5, speed +3
- **Guardian Mitts** (`guardian-mitts`, COMMON) ? defense +5, health +15
- **Wildgrowth Bracers** (`wildgrowth-bracers`, RARE) ? health +20, magic +5

## Leg Armor (slot: `LEGS`)

- **Legion Greaves** (`legion-greaves`, COMMON) ? defense +6, health +18
- **Windstep Leggings** (`windstep-leggings`, UNCOMMON) ? attack +4, speed +5
- **Archmage Trousers** (`archmage-trousers`, RARE) ? magic +8, speed +3
- **Thornroot Breeches** (`thornroot-breeches`, UNCOMMON) ? magic +4, health +20
- **Assailant Pants** (`assailant-pants`, UNCOMMON) ? attack +5, defense +4

## Footwear (slot: `FEET`)

- **Earthshaker Sabatons** (`earthshaker-sabatons`, RARE) ? defense +7, health +18, attack +3
- **Swiftstep Boots** (`swiftstep-boots`, COMMON) ? speed +6
- **Runebound Sandals** (`runebound-sandals`, UNCOMMON) ? magic +4, speed +4
- **Stalker Treads** (`stalker-treads`, UNCOMMON) ? attack +4, speed +3
- **Stalwart Boots** (`stalwart-boots`, COMMON) ? defense +5, health +15

## Accessories ? Rings (slot: `ACCESSORY_1`)

- **Arcane Ring** (`arcane-ring`, UNCOMMON) ? magic +5
- **Ring of Sinew** (`ring-of-sinew`, UNCOMMON) ? attack +4, speed +2
- **Ring of Warding** (`ring-of-warding`, UNCOMMON) ? defense +4, health +15
- **Ring of Focus** (`ring-of-focus`, RARE) ? magic +6, speed +3
- **Ring of Vigor** (`ring-of-vigor`, UNCOMMON) ? health +20, attack +3
- **Ring of Clarity** (`ring-of-clarity`, RARE) ? attack +4, magic +4

## Accessories ? Amulets & Charms (slot: `ACCESSORY_2`)

- **Amulet of Resolve** (`amulet-of-resolve`, RARE) ? defense +5, magic +5
- **Pendant of Celerity** (`pendant-of-celerity`, UNCOMMON) ? speed +5, attack +3
- **Totem of Bloom** (`totem-of-bloom`, UNCOMMON) ? health +18, magic +4
- **Sigil of Dominion** (`sigil-of-dominion`, EPIC) ? attack +5, defense +5, magic +5
- **Idol of Echoes** (`idol-of-echoes`, RARE) ? magic +6, speed +2

## Consumables & Materials

- **Health Potion** (`health-potion`, COMMON) ? consumable, heals 50 on use
- **Focus Tonic** (`focus-tonic`, UNCOMMON) ? consumable, temporary speed +4 & magic +4
- **Ember Core** (`ember-core`, RARE) ? crafting material (potency +2)
- **Sylvan Spool** (`sylvan-spool`, UNCOMMON) ? crafting material (finesse +3)

## Progression Hooks

- `FOREST_PATROL` mission rolls for starter gear like `windrunner-hood`, `swiftstep-boots`, and hybrid rings.
- `EMBER_CAVERN` introduces battle-mage upgrades (`stormcall-staff`, `shadowweave-robe`, `ring-of-focus`) alongside crafting drops.
- Future missions can cherry-pick from this list or add new slugs with the same schema for immediate compatibility.

### Next Steps for Designers

- Build themed sets by pairing items with complementary stat spreads (e.g., **Stormcall** set = `stormcall-staff` + `astral-visor` + `shadowweave-robe` + `runebound-sandals`).
- Use rarity to pace unlocks rather than restrict build concepts; even EPIC items work on any class.
- Update mission loot tables or vendors with these slugs to surface desired playstyles.

> Reseed the database after edits with `npm run prisma:seed` to load the latest gear definitions.
