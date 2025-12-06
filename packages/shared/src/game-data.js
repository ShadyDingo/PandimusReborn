// Core game data structures for Text-Idle RPG
export const GameData = {
    // Attributes system
    attributes: {
        STR: { name: "Strength", description: "Increases Attack Power and Parry chance" },
        DEX: { name: "Dexterity", description: "Increases Attack Power, Crit chance, and Dodge" },
        CON: { name: "Constitution", description: "Increases Health Points" },
        INT: { name: "Intelligence", description: "Increases Spell Power, Health, and Crit chance" },
        LCK: { name: "Luck", description: "Increases Rare Find chance and Proc Rate" }
    },

    // Skills system (12 skills with level-based unlocks)
    skills: {
        foraging: {
            name: "Foraging",
            description: "Gather herbs, berries, and magical plants",
            unlocks: {
                1: { nodes: ["berry_patch", "common_herb"], perk: "+5% success in Forest" },
                5: { nodes: ["mushroom_log"], recipes: ["minor_antidote"] },
                10: { nodes: ["flower_meadow"], perk: "+1 Quality reroll (Foraging)" },
                15: { nodes: ["thornbriar"] },
                20: { nodes: ["rare_blossom"], recipes: ["focus_tonic"] },
                25: { nodes: ["dew_fern"], perk: "+10% at night" },
                30: { nodes: ["sun_lily"], recipes: ["prayer_reagent_i"] },
                35: { nodes: ["ghostcap"] },
                40: { nodes: ["moon_orchid"], perk: "+5% rare plant proc" },
                45: { nodes: ["emberbloom"] },
                50: { nodes: ["astral_petal"], perk: "+1 Atlas teleport/use per day" },
                55: { nodes: ["ashen_myrrh"], recipes: ["elixir_of_aegis"] },
                60: { perk: "+1 global queue while Foraging active" }
            }
        },
        mining: {
            name: "Mining",
            description: "Extract ores and precious metals from the earth",
            unlocks: {
                1: { nodes: ["copper_vein"], perk: "+10 Carry Cap (ore)" },
                5: { nodes: ["tin_vein"], recipes: ["bronze_alloy"] },
                10: { nodes: ["iron_vein"], perk: "+5% Gem Shard proc" },
                15: { nodes: ["coal_seam"] },
                20: { nodes: ["steel_vein"], recipes: ["ironclad_tools"] },
                25: { nodes: ["silver_vein"], recipes: ["jewelry_base"] },
                30: { nodes: ["mithril_vein"], perk: "-10% repair costs" },
                35: { nodes: ["gold_vein"], recipes: ["coin_press"] },
                40: { nodes: ["adamant_vein"], recipes: ["socketing_i"] },
                45: { nodes: ["runestone_seam"] },
                50: { nodes: ["rune_vein"], perk: "+1 mining action queue in mines" },
                55: { nodes: ["crystalite_vein"] },
                60: { nodes: ["magmastone_vein"], perk: "+10% rare ore proc" }
            }
        },
        fishing: {
            name: "Fishing",
            description: "Catch fish and aquatic creatures",
            unlocks: {
                1: { nodes: ["minnow_spot", "trout_spot"], perk: "+5% day yield on Coast" },
                5: { nodes: ["salmon_spot"], recipes: ["bait_crafting"] },
                10: { nodes: ["night_eel_spot"] },
                15: { nodes: ["crustacean_spot"] },
                20: { nodes: ["deepfish_spot"] },
                25: { perk: "+1% Quality fish" },
                30: { nodes: ["stormfish_spot"] },
                35: { nodes: ["glowfin_spot"] },
                40: { nodes: ["frost_koi_spot"] },
                45: { nodes: ["embercarp_spot"] },
                50: { nodes: ["leviathan_trace"], recipes: ["boss_key_mat"] },
                55: { nodes: ["ancient_scale"], recipes: ["unique_potion"] },
                60: { perk: "-15% fishing time, +10% rare" }
            }
        },
        woodcutting: {
            name: "Woodcutting",
            description: "Harvest wood and craft wooden items",
            unlocks: {
                1: { nodes: ["pine_tree"], perk: "+10 log carry" },
                10: { nodes: ["oak_tree"], recipes: ["resin_proc"] },
                20: { nodes: ["maple_tree"], recipes: ["bow_staves"] },
                30: { nodes: ["yew_tree"], perk: "+5% fletch quality" },
                40: { nodes: ["ash_tree"], recipes: ["staff_cores"] },
                50: { nodes: ["crystalbark_tree"] },
                60: { nodes: ["heartwood_tree"], perk: "+1 queue when in Forest" }
            }
        },
        cooking: {
            name: "Cooking",
            description: "Prepare meals and stat-boosting foods",
            unlocks: {
                1: { recipes: ["simple_meals"], perk: "Meals last +10%" },
                10: { recipes: ["spices_stews"] },
                20: { recipes: ["stat_meals_i"] },
                30: { recipes: ["feast_i"] },
                40: { recipes: ["stat_meals_ii"] },
                50: { recipes: ["feast_ii"] },
                60: { perk: "+1 buff slot" }
            }
        },
        smithing: {
            name: "Smithing",
            description: "Forge weapons, armor, and tools",
            unlocks: {
                1: { recipes: ["bronze_tools", "bronze_weapons"], perk: "-5% repair cost" },
                10: { recipes: ["iron_tier"], sockets: "0-1" },
                20: { recipes: ["steel_tier"], perk: "+5% craft success" },
                30: { recipes: ["mithril_tier"] },
                40: { recipes: ["adamant_tier"], sockets: "1-2" },
                50: { recipes: ["rune_tier"], perk: "+1 min-roll on quality" },
                60: { perk: "craft Exceptional baseline" }
            }
        },
        fletching: {
            name: "Fletching",
            description: "Craft bows, arrows, and ranged weapons",
            unlocks: {
                1: { recipes: ["simple_bows"], perk: "+5% bow quality" },
                10: { recipes: ["oak_bow", "basic_arrows"] },
                20: { recipes: ["maple_bow", "barbed_arrows"] },
                30: { recipes: ["yew_bow", "piercing_arrows"] },
                40: { recipes: ["ash_longbow", "explosive_bolts"] },
                50: { recipes: ["rune_composite_bow"] },
                60: { perk: "+10% ranged AP" }
            }
        },
        alchemy: {
            name: "Alchemy",
            description: "Brew potions and magical elixirs",
            unlocks: {
                1: { recipes: ["minor_heal", "minor_mana"], perk: "5% potion potency" },
                10: { recipes: ["antidotes", "fortitude"] },
                20: { recipes: ["focus", "swiftness"] },
                30: { recipes: ["elemental_resists"] },
                40: { recipes: ["elixirs_aegis", "elixirs_brutality"] },
                50: { recipes: ["philosophers_flask"] },
                60: { perk: "+1 concurrent brew" }
            }
        },
        carpentry: {
            name: "Carpentry",
            description: "Build storage, workbenches, and wooden structures",
            unlocks: {
                1: { recipes: ["crates"], perk: "+5% carpenter quality" },
                10: { recipes: ["racks"] },
                20: { recipes: ["staff_cores", "wands"] },
                30: { recipes: ["workbench_upgrade_i"] },
                40: { recipes: ["house_trophy_stands"] },
                50: { recipes: ["workshop_ii"] },
                60: { perk: "+1 queue slot while in Town" }
            }
        },
        melee: {
            name: "Melee Combat",
            description: "Master close-quarters combat techniques",
            unlocks: {
                10: { actions: ["power_strike"], passive: "+5% AP with swords" },
                20: { actions: ["cleave"] },
                30: { actions: ["whirlwind"] },
                40: { actions: ["berserker_rage"] },
                50: { actions: ["devastating_blow"] },
                60: { passive: "+15% melee AP" }
            }
        },
        archery: {
            name: "Archery",
            description: "Excel at ranged combat with bows",
            unlocks: {
                10: { actions: ["multi_shot"], passive: "+5% Crit with bows" },
                20: { actions: ["piercing_shot"] },
                30: { actions: ["explosive_arrow"] },
                40: { actions: ["rain_of_arrows"] },
                50: { actions: ["eagle_eye"] },
                60: { passive: "+15% ranged AP" }
            }
        },
        sorcery: {
            name: "Sorcery",
            description: "Channel magical energies and cast spells",
            unlocks: {
                10: { actions: ["arcane_surge"], passive: "+8% SP with staves" },
                20: { actions: ["fireball"] },
                30: { actions: ["frost_nova"] },
                40: { actions: ["lightning_storm"] },
                50: { actions: ["meteor"] },
                60: { passive: "+20% SP" }
            }
        }
    },

    // Regions with zones and nodes
    regions: {
        greencoast: {
            name: "Greencoast",
            tier: "T1-T2",
            description: "A peaceful coastal region perfect for beginners",
            zones: {
                driftwood_shore: {
                    name: "Driftwood Shore",
                    description: "A sandy beach with gentle waves",
                    nodes: {
                        fishing_driftwood: {
                            skill: "fishing",
                            tier: 1,
                            danger: 0,
                            base_time: 15,
                            requirements: "none",
                            notes: "Day bonus",
                            loot_table: {
                                common: { "minnow": 70, "trout": 20 },
                                uncommon: { "salmon": 8 },
                                rare: { "pearl": 2 }
                            }
                        }
                    }
                },
                greencoast_forest: {
                    name: "Greencoast Forest",
                    description: "A lush forest filled with herbs and berries",
                    nodes: {
                        forage_forest: {
                            skill: "foraging",
                            tier: 1,
                            danger: 0,
                            base_time: 12,
                            requirements: "none",
                            notes: "Herbs/Berries",
                            loot_table: {
                                common: { "berry": 60, "herb": 35 },
                                uncommon: { "shroom": 5 },
                                rare: {}
                            }
                        }
                    }
                },
                rusty_mine: {
                    name: "Rusty Mine",
                    description: "An old copper mine with basic ores",
                    nodes: {
                        mine_rusty: {
                            skill: "mining",
                            tier: 1,
                            danger: 0,
                            base_time: 18,
                            requirements: "pick_t1",
                            notes: "Copper/Tin",
                            loot_table: {
                                common: { "copper": 60 },
                                uncommon: { "tin": 25 },
                                rare: { "iron": 10, "gem_frag": 5 }
                            }
                        }
                    }
                },
                bandit_encampment: {
                    name: "Bandit Encampment",
                    description: "A dangerous camp of thieves and brigands",
                    nodes: {
                        combat_bandit: {
                            skill: "melee",
                            tier: 1,
                            danger: 1,
                            base_time: "turns",
                            requirements: "Lv5+",
                            notes: "Bandits/Wolves",
                            enemies: ["bandit_cutpurse", "grey_wolf"]
                        }
                    }
                },
                tide_pools: {
                    name: "Tide Pools",
                    description: "Rocky pools teeming with sea life",
                    nodes: {
                        fishing_tide_pools: {
                            skill: "fishing",
                            tier: 1,
                            danger: 0,
                            base_time: 20,
                            requirements: "none",
                            notes: "Crustaceans",
                            loot_table: {
                                common: { "crab": 50, "shrimp": 30 },
                                uncommon: { "lobster": 15 },
                                rare: { "pearl_shard": 5 }
                            }
                        }
                    }
                },
                hidden_shrine: {
                    name: "Hidden Shrine",
                    description: "A mysterious shrine to ancient powers",
                    nodes: {
                        shrine_hidden: {
                            skill: "prayer",
                            tier: 1,
                            danger: 0,
                            base_time: 20,
                            requirements: "Prayer L5",
                            notes: "Small boons",
                            loot_table: {
                                common: { "favor": 80 },
                                uncommon: {},
                                rare: { "charm": 2 }
                            }
                        }
                    }
                }
            },
            bosses: {
                tide_watcher: {
                    name: "Tide Watcher",
                    level: 10,
                    phases: [
                        { name: "Rising Tide", effect: "Mitigation check; if fail, apply Soaked -5% Hit" },
                        { name: "Tentacle Sweep", effect: "stun 1 turn; dodgeable" },
                        { name: "Whirlpool", effect: "DoT 6/tick for 4 turns; cleanse with Charm of Calm if owned" }
                    ],
                    stats: {
                        hp: 1200,
                        ap: 45,
                        armor: 90,
                        resistances: { frost: 20, shock: 0 }
                    },
                    loot_table: {
                        "oceanic_set_piece": 18,
                        "tide_pearl": 180,
                        "rare_fish_cache": 300,
                        "gold": "150-220"
                    }
                }
            },
            mini_bosses: {
                bandit_chief: {
                    name: "Bandit Chief",
                    level: 8,
                    stats: { hp: 220, ap: 26, armor: 35 },
                    ability: "Rally (+10% Hit)",
                    loot_table: {
                        "chiefs_charm": 20,
                        "queue_token": 5
                    }
                }
            }
        }
    },

    // Combat formulas
    formulas: {
        xpToNext: (level) => Math.floor(20 * level * level + 80 * level),
        actionTime: (baseTime, haste, fatigueStacks) => baseTime / (1 + haste) * (1 + 0.15 * fatigueStacks),
        hitChance: (hit, dodge) => Math.max(0.30, Math.min(0.95, 0.75 + 0.5 * (hit - dodge))),
        mitigation: (armor, enemyLevel) => armor / (armor + 400 + 85 * enemyLevel),
        damage: (ap, skillCoef, mitigation) => Math.max(1, ap * skillCoef * (1 - mitigation)),
        durabilityLoss: (zoneDanger, isBoss) => (zoneDanger + 1) * (isBoss ? 4 : 1),
        repairCost: (itemTier, smithingMastery) => 5 * itemTier * itemTier * (1 - smithingMastery)
    },

    // Item system
    itemSlots: ["mainhand", "offhand", "head", "chest", "legs", "boots", "trinket"],
    itemTiers: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"],
    itemQuality: ["Normal", "Fine", "Exceptional"],

    // Affix pools
    affixes: {
        prefixes: {
            "Brutal": { ap: [6, 24] },
            "Arcane": { sp: [6, 24] },
            "Fleet": { haste: [3, 12] },
            "Stalwart": { armor: [30, 120] },
            "Searing": { fire_damage: [4, 16] },
            "Frostbound": { cold_damage: [4, 16] }
        },
        suffixes: {
            "of the Fox": { dex: [4, 16] },
            "of Fortitude": { con: [4, 16] },
            "of Insight": { int: [4, 16] },
            "of Precision": { hit: [2, 8] },
            "of Fortune": { luck: [3, 12] }
        }
    },

    // Set bonuses
    sets: {
        artisans: {
            name: "Artisan's Set",
            bonuses: {
                2: "+5% craft success",
                4: "+1 quality roll"
            }
        },
        wanderers: {
            name: "Wanderer's Set",
            bonuses: {
                2: "+3% haste",
                4: "+10% travel speed"
            }
        },
        oceanic: {
            name: "Oceanic Set",
            bonuses: {
                2: "+10% fishing rare",
                4: "Whirlpool resist",
                5: "+5% SP with water spells"
            }
        },
        embersteel: {
            name: "Embersteel Set",
            bonuses: {
                2: "+6% AP",
                4: "-10% fire dmg taken",
                5: "Magma Burst proc"
            }
        },
        venomfang: {
            name: "Venomfang Set",
            bonuses: {
                2: "+15% poison resist",
                4: "+10% DoT",
                5: "10% chance to apply Toxin"
            }
        },
        glacierheart: {
            name: "Glacierheart Set",
            bonuses: {
                2: "+8% crit dmg",
                4: "+12% cold resist",
                5: "Shardguard shield on crit"
            }
        },
        inferno: {
            name: "Inferno Set",
            bonuses: {
                2: "+8% AP/SP",
                4: "+15% fire resist",
                5: "Coreflare on kill"
            }
        }
    },

    // Map system data
    map: {
        size: 1000,
        startingTown: {
            id: "starting_town",
            name: "Newhaven",
            x: 500,
            y: 500,
            level: 1
        },
        biomes: {
            plains: { 
                name: "Plains", 
                color: "#90EE90", 
                difficulty: 1,
                enemy: "wild_boar", // Legacy support
                enemySpawnTable: [
                    // Easy enemies (60% total weight)
                    { id: "wild_boar", weight: 25, tier: "easy" },
                    { id: "plains_rabbit", weight: 20, tier: "easy" },
                    { id: "field_mouse", weight: 15, tier: "easy" },
                    // Moderate enemies (30% total weight)
                    { id: "plains_wolf", weight: 18, tier: "moderate" },
                    { id: "bandit_scout", weight: 12, tier: "moderate" },
                    // Mid-level enemies (8% total weight)
                    { id: "plains_stalker", weight: 5, tier: "mid" },
                    { id: "nomad_warrior", weight: 3, tier: "mid" },
                    // Apex enemy (2% weight - very rare)
                    { id: "plains_tyrant", weight: 2, tier: "apex" }
                ],
                resource: "wheat",
                spawnChance: 0.8
            },
            forest: { 
                name: "Forest", 
                color: "#228B22", 
                difficulty: 2,
                enemy: "grey_wolf",
                resource: "oak_log",
                spawnChance: 0.75
            },
            desert: { 
                name: "Desert", 
                color: "#EDC9AF", 
                difficulty: 3,
                enemy: "desert_scorpion",
                resource: "cactus_fiber",
                spawnChance: 0.6
            },
            mountain: { 
                name: "Mountains", 
                color: "#808080", 
                difficulty: 4,
                enemy: "mountain_troll",
                resource: "iron_ore",
                spawnChance: 0.5
            },
            swamp: { 
                name: "Swamp", 
                color: "#2F4F2F", 
                difficulty: 3,
                enemy: "swamp_lurker",
                resource: "bog_moss",
                spawnChance: 0.65
            },
            coast: { 
                name: "Coast", 
                color: "#4682B4", 
                difficulty: 1,
                enemy: "coast_crab",
                resource: "seaweed",
                spawnChance: 0.7
            },
            volcanic: { 
                name: "Volcanic Wastes", 
                color: "#8B0000", 
                difficulty: 8,
                enemy: "lava_elemental",
                resource: "volcanic_crystal",
                spawnChance: 0.2
            },
            tundra: { 
                name: "Tundra", 
                color: "#E0E0E0", 
                difficulty: 6,
                enemy: "frost_wolf",
                resource: "ice_shard",
                spawnChance: 0.35
            },
            jungle: { 
                name: "Jungle", 
                color: "#2F4F2F", 
                difficulty: 5,
                enemy: "jungle_panther",
                resource: "exotic_herb",
                spawnChance: 0.45
            },
            canyon: { 
                name: "Canyon", 
                color: "#CD853F", 
                difficulty: 7,
                enemy: "canyon_raptor",
                resource: "sandstone",
                spawnChance: 0.3
            },
            ocean: {
                name: "Ocean",
                color: "#000080",
                difficulty: 10,
                enemy: null,
                resource: null,
                spawnChance: 0,
                traversable: false
            },
            river: {
                name: "River",
                color: "#4682B4",
                difficulty: 1,
                enemy: "river_snake",
                resource: "river_pearl",
                spawnChance: 0.4,
                traversable: true
            },
            lake: {
                name: "Lake",
                color: "#1E90FF",
                difficulty: 2,
                enemy: "lake_serpent",
                resource: "lake_pearl",
                spawnChance: 0.3,
                traversable: true
            }
        }
    },

    // Zone definitions with enemy spawn tables
    zones: {
        // Level 1-10 zones
        "1-10": {
            name: "Safe Lands",
            levelRange: [1, 10],
            enemySpawnTable: [
                { id: "wild_boar", weight: 40, level: 1 },
                { id: "bandit_cutpurse", weight: 30, level: 2 },
                { id: "grey_wolf", weight: 20, level: 3 },
                { id: "goblin_scout", weight: 10, level: 4 }
            ]
        },
        // Level 11-20 zones
        "11-20": {
            name: "Wilderness",
            levelRange: [11, 20],
            enemySpawnTable: [
                { id: "orc_raider", weight: 35, level: 12 },
                { id: "dire_wolf", weight: 30, level: 14 },
                { id: "bandit_warrior", weight: 25, level: 16 },
                { id: "troll", weight: 10, level: 18 }
            ]
        },
        // Level 21-30 zones
        "21-30": {
            name: "Dangerous Territories",
            levelRange: [21, 30],
            enemySpawnTable: [
                { id: "orc_warlord", weight: 30, level: 22 },
                { id: "giant_spider", weight: 30, level: 24 },
                { id: "skeleton_warrior", weight: 25, level: 26 },
                { id: "ogre", weight: 15, level: 28 }
            ]
        },
        // Level 31-50 zones
        "31-50": {
            name: "Hostile Lands",
            levelRange: [31, 50],
            enemySpawnTable: [
                { id: "dark_knight", weight: 30, level: 32 },
                { id: "fire_elemental", weight: 25, level: 35 },
                { id: "frost_wraith", weight: 25, level: 38 },
                { id: "dragon_kin", weight: 20, level: 45 }
            ]
        },
        // Level 51-70 zones
        "51-70": {
            name: "Forbidden Zones",
            levelRange: [51, 70],
            enemySpawnTable: [
                { id: "lich", weight: 30, level: 52 },
                { id: "demon", weight: 30, level: 58 },
                { id: "ancient_dragon", weight: 25, level: 65 },
                { id: "void_spawn", weight: 15, level: 68 }
            ]
        },
        // Level 71+ zones
        "71+": {
            name: "Void-Touched Realms",
            levelRange: [71, 100],
            enemySpawnTable: [
                { id: "void_lord", weight: 35, level: 72 },
                { id: "eldritch_horror", weight: 30, level: 80 },
                { id: "reality_breaker", weight: 25, level: 90 },
                { id: "cosmic_entity", weight: 10, level: 95 }
            ]
        }
    },

    // Enemy definitions
    enemies: {
        wild_boar: {
            name: "Wild Boar",
            level: 1,
            hp: 50,
            maxHp: 50,
            ap: 8,
            armor: 2,
            gold: [5, 15],
            exp: 10,
            lootTable: {
                common: { "wheat": 70, "leather": 25 },
                uncommon: { "iron_ore": 5 },
                rare: {}
            }
        },
        plains_rabbit: {
            name: "Plains Rabbit",
            level: 1,
            hp: 30,
            maxHp: 30,
            ap: 5,
            armor: 0,
            gold: [3, 10],
            exp: 5,
            lootTable: {
                common: { "wheat": 80, "fur": 15 },
                uncommon: {},
                rare: {}
            }
        },
        field_mouse: {
            name: "Field Mouse",
            level: 1,
            hp: 20,
            maxHp: 20,
            ap: 3,
            armor: 0,
            gold: [2, 8],
            exp: 3,
            lootTable: {
                common: { "wheat": 90 },
                uncommon: {},
                rare: {}
            }
        },
        plains_wolf: {
            name: "Plains Wolf",
            level: 2,
            hp: 80,
            maxHp: 80,
            ap: 12,
            armor: 3,
            gold: [15, 30],
            exp: 20,
            lootTable: {
                common: { "leather": 60, "fur": 30 },
                uncommon: { "iron_ore": 8 },
                rare: {}
            }
        },
        bandit_scout: {
            name: "Bandit Scout",
            level: 2,
            hp: 70,
            maxHp: 70,
            ap: 15,
            armor: 5,
            gold: [12, 25],
            exp: 18,
            lootTable: {
                common: { "leather": 50, "iron_ore": 35 },
                uncommon: { "wheat": 12 },
                rare: {}
            }
        },
        plains_stalker: {
            name: "Plains Stalker",
            level: 4,
            hp: 120,
            maxHp: 120,
            ap: 20,
            armor: 8,
            gold: [30, 60],
            exp: 40,
            lootTable: {
                common: { "leather": 45, "iron_ore": 40 },
                uncommon: { "fur": 12 },
                rare: { "wheat": 3 }
            }
        },
        nomad_warrior: {
            name: "Nomad Warrior",
            level: 5,
            hp: 150,
            maxHp: 150,
            ap: 25,
            armor: 12,
            gold: [40, 70],
            exp: 50,
            lootTable: {
                common: { "iron_ore": 50, "leather": 35 },
                uncommon: { "fur": 12 },
                rare: { "wheat": 3 }
            }
        },
        plains_tyrant: {
            name: "Plains Tyrant",
            level: 8,
            hp: 400,
            maxHp: 400,
            ap: 50,
            armor: 25,
            gold: [100, 200],
            exp: 150,
            lootTable: {
                common: { "iron_ore": 40, "leather": 35 },
                uncommon: { "fur": 20 },
                rare: { "wheat": 5 }
            }
        },
        bandit_cutpurse: {
            name: "Bandit Cutpurse",
            level: 2,
            hp: 70,
            maxHp: 70,
            ap: 12,
            armor: 5,
            gold: [10, 20],
            exp: 20
        },
        grey_wolf: {
            name: "Grey Wolf",
            level: 3,
            hp: 90,
            maxHp: 90,
            ap: 15,
            armor: 3,
            gold: [15, 25],
            exp: 30
        },
        goblin_scout: {
            name: "Goblin Scout",
            level: 4,
            hp: 110,
            maxHp: 110,
            ap: 18,
            armor: 8,
            gold: [20, 30],
            exp: 40
        },
        orc_raider: {
            name: "Orc Raider",
            level: 12,
            hp: 250,
            maxHp: 250,
            ap: 35,
            armor: 20,
            gold: [50, 80],
            exp: 120
        },
        dire_wolf: {
            name: "Dire Wolf",
            level: 14,
            hp: 300,
            maxHp: 300,
            ap: 40,
            armor: 15,
            gold: [60, 90],
            exp: 140
        },
        bandit_warrior: {
            name: "Bandit Warrior",
            level: 16,
            hp: 350,
            maxHp: 350,
            ap: 45,
            armor: 25,
            gold: [70, 100],
            exp: 160
        },
        troll: {
            name: "Troll",
            level: 18,
            hp: 450,
            maxHp: 450,
            ap: 50,
            armor: 30,
            gold: [80, 120],
            exp: 180
        },
        // Biome-specific enemies
        desert_scorpion: {
            name: "Desert Scorpion",
            level: 5,
            hp: 130,
            maxHp: 130,
            ap: 22,
            armor: 12,
            gold: [25, 40],
            exp: 50
        },
        mountain_troll: {
            name: "Mountain Troll",
            level: 8,
            hp: 200,
            maxHp: 200,
            ap: 30,
            armor: 18,
            gold: [40, 60],
            exp: 80
        },
        swamp_lurker: {
            name: "Swamp Lurker",
            level: 6,
            hp: 160,
            maxHp: 160,
            ap: 25,
            armor: 14,
            gold: [30, 50],
            exp: 60
        },
        coast_crab: {
            name: "Giant Coast Crab",
            level: 2,
            hp: 80,
            maxHp: 80,
            ap: 14,
            armor: 8,
            gold: [12, 22],
            exp: 25
        },
        lava_elemental: {
            name: "Lava Elemental",
            level: 25,
            hp: 600,
            maxHp: 600,
            ap: 80,
            armor: 40,
            gold: [150, 200],
            exp: 250
        },
        frost_wolf: {
            name: "Frost Wolf",
            level: 15,
            hp: 320,
            maxHp: 320,
            ap: 42,
            armor: 22,
            gold: [65, 95],
            exp: 150
        },
        jungle_panther: {
            name: "Jungle Panther",
            level: 12,
            hp: 280,
            maxHp: 280,
            ap: 38,
            armor: 16,
            gold: [55, 85],
            exp: 130
        },
        canyon_raptor: {
            name: "Canyon Raptor",
            level: 20,
            hp: 500,
            maxHp: 500,
            ap: 70,
            armor: 35,
            gold: [120, 180],
            exp: 200
        }
    },

    // Resource definitions
    resources: {
        wheat: {
            name: "Wheat",
            type: "plant",
            rarity: "common",
            baseValue: 2,
            refinement: "wheat_flour"
        },
        oak_log: {
            name: "Oak Log",
            type: "wood",
            rarity: "common",
            baseValue: 3,
            refinement: "oak_plank"
        },
        cactus_fiber: {
            name: "Cactus Fiber",
            type: "plant",
            rarity: "uncommon",
            baseValue: 5,
            refinement: "woven_fiber"
        },
        iron_ore: {
            name: "Iron Ore",
            type: "ore",
            rarity: "common",
            baseValue: 8,
            refinement: "iron_ingot"
        },
        leather: {
            name: "Leather",
            type: "hide",
            rarity: "common",
            baseValue: 5,
            refinement: null
        },
        fur: {
            name: "Fur",
            type: "hide",
            rarity: "common",
            baseValue: 3,
            refinement: null
        },
        bog_moss: {
            name: "Bog Moss",
            type: "plant",
            rarity: "uncommon",
            baseValue: 6,
            refinement: "moss_extract"
        },
        seaweed: {
            name: "Seaweed",
            type: "plant",
            rarity: "common",
            baseValue: 4,
            refinement: "seaweed_extract"
        },
        volcanic_crystal: {
            name: "Volcanic Crystal",
            type: "crystal",
            rarity: "rare",
            baseValue: 50,
            refinement: "refined_crystal"
        },
        ice_shard: {
            name: "Ice Shard",
            type: "crystal",
            rarity: "uncommon",
            baseValue: 15,
            refinement: "ice_core"
        },
        exotic_herb: {
            name: "Exotic Herb",
            type: "plant",
            rarity: "uncommon",
            baseValue: 12,
            refinement: "herb_extract"
        },
        sandstone: {
            name: "Sandstone",
            type: "stone",
            rarity: "common",
            baseValue: 10,
            refinement: "polished_sandstone"
        }
    },

    // Refinement recipes
    refinementRecipes: {
        wheat_flour: { raw: "wheat", refined: "wheat_flour", name: "Wheat Flour" },
        oak_plank: { raw: "oak_log", refined: "oak_plank", name: "Oak Plank" },
        woven_fiber: { raw: "cactus_fiber", refined: "woven_fiber", name: "Woven Fiber" },
        iron_ingot: { raw: "iron_ore", refined: "iron_ingot", name: "Iron Ingot" },
        moss_extract: { raw: "bog_moss", refined: "moss_extract", name: "Moss Extract" },
        seaweed_extract: { raw: "seaweed", refined: "seaweed_extract", name: "Seaweed Extract" },
        refined_crystal: { raw: "volcanic_crystal", refined: "refined_crystal", name: "Refined Crystal" },
        ice_core: { raw: "ice_shard", refined: "ice_core", name: "Ice Core" },
        herb_extract: { raw: "exotic_herb", refined: "herb_extract", name: "Herb Extract" },
        polished_sandstone: { raw: "sandstone", refined: "polished_sandstone", name: "Polished Sandstone" }
    }
};

export default GameData;

