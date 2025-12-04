# Asset Folder Structure for Pandimus Reborn

## Recommended Location
Place the `assets` folder in your project root directory:

```
C:\Users\heffw\pandimus-reborn\
├── assets\                    ← Place assets folder here
│   ├── monsters\
│   ├── items\
│   ├── ui\
│   └── effects\
├── apps\
│   ├── desktop\
│   ├── server\
│   └── web\
├── packages\
├── node_modules\
└── package.json
```

## Complete Asset Folder Structure

```
C:\Users\heffw\pandimus-reborn\assets\
├── monsters\
│   ├── greencoast\
│   │   ├── tide_crab_64.png
│   │   ├── grey_wolf_64.png
│   │   ├── bandit_cutpurse_64.png
│   │   ├── bandit_chief_64.png
│   │   ├── tide_watcher_128.png
│   │   └── shore_shaman_64.png
│   ├── emberridge\
│   │   ├── salamander_64.png
│   │   ├── fire_golem_64.png
│   │   ├── magma_slime_64.png
│   │   ├── cultist_pyromancer_64.png
│   │   ├── forge_warden_64.png
│   │   ├── cult_fanatic_64.png
│   │   └── ember_golem_128.png
│   ├── shadow_mire\
│   │   ├── mire_serpent_64.png
│   │   ├── swamp_horror_64.png
│   │   ├── mire_witch_64.png
│   │   ├── leech_swarm_64.png
│   │   ├── hag_of_thorns_64.png
│   │   └── mire_serpent_128.png
│   ├── crystal_peaks\
│   │   ├── ice_elemental_64.png
│   │   ├── harpy_64.png
│   │   ├── crystal_guardian_64.png
│   │   └── crystal_wyrm_128.png
│   └── ashen_depths\
│       ├── magma_fiend_64.png
│       ├── infernal_shade_64.png
│       ├── ash_gargoyle_64.png
│       ├── rift_knight_64.png
│       ├── ember_queen_64.png
│       └── ashen_colossus_128.png
├── items\
│   ├── weapons\
│   │   ├── melee\
│   │   │   ├── bronze_dagger_64.png
│   │   │   ├── iron_sword_64.png
│   │   │   ├── steel_greatsword_64.png
│   │   │   ├── mithril_blade_64.png
│   │   │   ├── adamant_waraxe_64.png
│   │   │   ├── rune_greatsword_64.png
│   │   │   ├── venomfang_blade_64.png
│   │   │   ├── embersteel_sword_64.png
│   │   │   ├── glacierheart_blade_64.png
│   │   │   └── inferno_blade_64.png
│   │   ├── ranged\
│   │   │   ├── simple_bow_64.png
│   │   │   ├── oak_bow_64.png
│   │   │   ├── maple_bow_64.png
│   │   │   ├── yew_longbow_64.png
│   │   │   ├── ash_longbow_64.png
│   │   │   ├── rune_composite_bow_64.png
│   │   │   ├── basic_arrows_64.png
│   │   │   ├── barbed_arrows_64.png
│   │   │   ├── piercing_arrows_64.png
│   │   │   └── explosive_bolts_64.png
│   │   └── staves\
│   │       ├── wooden_staff_64.png
│   │       ├── oak_staff_64.png
│   │       ├── maple_staff_64.png
│   │       ├── yew_staff_64.png
│   │       ├── ash_staff_64.png
│   │       ├── rune_staff_64.png
│   │       ├── prism_staff_64.png
│   │       └── inferno_staff_64.png
│   ├── armor\
│   │   ├── helmets\
│   │   │   ├── leather_cap_64.png
│   │   │   ├── iron_helm_64.png
│   │   │   ├── steel_helm_64.png
│   │   │   ├── mithril_helm_64.png
│   │   │   ├── adamant_helm_64.png
│   │   │   ├── rune_helm_64.png
│   │   │   ├── venomfang_helm_64.png
│   │   │   ├── embersteel_helm_64.png
│   │   │   ├── glacierheart_helm_64.png
│   │   │   └── inferno_helm_64.png
│   │   ├── chest\
│   │   │   ├── leather_jerkin_64.png
│   │   │   ├── iron_mail_64.png
│   │   │   ├── steel_breastplate_64.png
│   │   │   ├── mithril_plate_64.png
│   │   │   ├── adamant_plate_64.png
│   │   │   ├── rune_plate_64.png
│   │   │   ├── venomfang_plate_64.png
│   │   │   ├── embersteel_plate_64.png
│   │   │   ├── glacierheart_plate_64.png
│   │   │   └── inferno_plate_64.png
│   │   ├── legs\
│   │   │   ├── leather_pants_64.png
│   │   │   ├── iron_greaves_64.png
│   │   │   ├── steel_greaves_64.png
│   │   │   ├── mithril_greaves_64.png
│   │   │   ├── adamant_greaves_64.png
│   │   │   └── rune_greaves_64.png
│   │   ├── boots\
│   │   │   ├── leather_boots_64.png
│   │   │   ├── iron_boots_64.png
│   │   │   ├── steel_boots_64.png
│   │   │   ├── mithril_boots_64.png
│   │   │   ├── adamant_boots_64.png
│   │   │   └── rune_boots_64.png
│   │   └── accessories\
│   │       ├── sea_charm_64.png
│   │       ├── ember_charm_64.png
│   │       ├── frost_charm_64.png
│   │       ├── inferno_charm_64.png
│   │       ├── chiefs_charm_64.png
│   │       ├── tide_pearl_64.png
│   │       ├── ember_core_64.png
│   │       ├── prism_scale_64.png
│   │       └── colossus_core_64.png
│   ├── consumables\
│   │   ├── potions\
│   │   │   ├── minor_heal_potion_64.png
│   │   │   ├── minor_mana_potion_64.png
│   │   │   ├── antidote_64.png
│   │   │   ├── focus_tonic_64.png
│   │   │   ├── swiftness_potion_64.png
│   │   │   ├── elixir_of_aegis_64.png
│   │   │   ├── elixir_of_brutality_64.png
│   │   │   └── philosophers_flask_64.png
│   │   ├── food\
│   │   │   ├── cooked_fish_64.png
│   │   │   ├── herb_broth_64.png
│   │   │   ├── spiced_trout_64.png
│   │   │   ├── crispy_salmon_64.png
│   │   │   ├── fishermen_feast_64.png
│   │   │   ├── frost_koi_sushi_64.png
│   │   │   └── heros_banquet_64.png
│   │   └── materials\
│   │       ├── copper_ore_64.png
│   │       ├── tin_ore_64.png
│   │       ├── iron_ore_64.png
│   │       ├── coal_64.png
│   │       ├── silver_ore_64.png
│   │       ├── mithril_ore_64.png
│   │       ├── gold_ore_64.png
│   │       ├── adamant_ore_64.png
│   │       ├── runestone_64.png
│   │       ├── crystalite_64.png
│   │       ├── magmastone_64.png
│   │       ├── pine_log_64.png
│   │       ├── oak_log_64.png
│   │       ├── maple_log_64.png
│   │       ├── yew_log_64.png
│   │       ├── ash_log_64.png
│   │       ├── crystalbark_log_64.png
│   │       ├── heartwood_log_64.png
│   │       ├── minnow_64.png
│   │       ├── trout_64.png
│   │       ├── salmon_64.png
│   │       ├── night_eel_64.png
│   │       ├── crustacean_64.png
│   │       ├── deepfish_64.png
│   │       ├── stormfish_64.png
│   │       ├── glowfin_64.png
│   │       ├── frost_koi_64.png
│   │       ├── embercarp_64.png
│   │       ├── leviathan_trace_64.png
│   │       ├── ancient_scale_64.png
│   │       ├── berry_64.png
│   │       ├── herb_64.png
│   │       ├── mushroom_64.png
│   │       ├── flower_64.png
│   │       ├── thornbriar_64.png
│   │       ├── rare_blossom_64.png
│   │       ├── dew_fern_64.png
│   │       ├── sun_lily_64.png
│   │       ├── ghostcap_64.png
│   │       ├── moon_orchid_64.png
│   │       ├── emberbloom_64.png
│   │       ├── astral_petal_64.png
│   │       └── ashen_myrrh_64.png
│   └── tools\
│       ├── bronze_pickaxe_64.png
│       ├── iron_pickaxe_64.png
│       ├── steel_pickaxe_64.png
│       ├── mithril_pickaxe_64.png
│       ├── adamant_pickaxe_64.png
│       ├── rune_pickaxe_64.png
│       ├── bronze_hatchet_64.png
│       ├── iron_hatchet_64.png
│       ├── steel_hatchet_64.png
│       ├── mithril_hatchet_64.png
│       ├── adamant_hatchet_64.png
│       ├── rune_hatchet_64.png
│       ├── simple_fishing_rod_64.png
│       ├── oak_fishing_rod_64.png
│       ├── maple_fishing_rod_64.png
│       ├── yew_fishing_rod_64.png
│       ├── ash_fishing_rod_64.png
│       └── rune_fishing_rod_64.png
├── ui\
│   ├── backgrounds\
│   │   ├── greencoast_bg_1920x1080.png
│   │   ├── emberridge_bg_1920x1080.png
│   │   ├── shadow_mire_bg_1920x1080.png
│   │   ├── crystal_peaks_bg_1920x1080.png
│   │   ├── ashen_depths_bg_1920x1080.png
│   │   ├── driftwood_shore_bg_1920x1080.png
│   │   ├── greencoast_forest_bg_1920x1080.png
│   │   ├── rusty_mine_bg_1920x1080.png
│   │   ├── bandit_encampment_bg_1920x1080.png
│   │   ├── tide_pools_bg_1920x1080.png
│   │   ├── hidden_shrine_bg_1920x1080.png
│   │   ├── firebloom_grove_bg_1920x1080.png
│   │   ├── ember_cavern_bg_1920x1080.png
│   │   ├── golem_pit_bg_1920x1080.png
│   │   └── scorched_run_bg_1920x1080.png
│   ├── buttons\
│   │   ├── button_primary_200x50.png
│   │   ├── button_secondary_200x50.png
│   │   ├── button_success_200x50.png
│   │   ├── button_warning_200x50.png
│   │   ├── button_danger_200x50.png
│   │   ├── button_small_100x30.png
│   │   └── button_large_300x80.png
│   ├── panels\
│   │   ├── panel_main_400x300.png
│   │   ├── panel_card_300x200.png
│   │   ├── panel_info_350x250.png
│   │   ├── panel_warning_350x250.png
│   │   ├── panel_error_350x250.png
│   │   ├── panel_transparent_400x300.png
│   │   └── panel_glass_400x300.png
│   ├── progress_bars\
│   │   ├── progress_bar_health_200x20.png
│   │   ├── progress_bar_mana_200x20.png
│   │   ├── progress_bar_exp_200x20.png
│   │   ├── progress_bar_skill_200x20.png
│   │   ├── progress_bar_activity_200x20.png
│   │   ├── progress_bar_thin_200x10.png
│   │   └── progress_bar_thick_200x30.png
│   ├── icons\
│   │   ├── skills\
│   │   │   ├── foraging_32x32.png
│   │   │   ├── mining_32x32.png
│   │   │   ├── fishing_32x32.png
│   │   │   ├── woodcutting_32x32.png
│   │   │   ├── cooking_32x32.png
│   │   │   ├── smithing_32x32.png
│   │   │   ├── fletching_32x32.png
│   │   │   ├── alchemy_32x32.png
│   │   │   ├── carpentry_32x32.png
│   │   │   ├── melee_32x32.png
│   │   │   ├── archery_32x32.png
│   │   │   └── sorcery_32x32.png
│   │   ├── attributes\
│   │   │   ├── str_32x32.png
│   │   │   ├── dex_32x32.png
│   │   │   ├── con_32x32.png
│   │   │   ├── int_32x32.png
│   │   │   └── lck_32x32.png
│   │   ├── status\
│   │   │   ├── buff_32x32.png
│   │   │   ├── debuff_32x32.png
│   │   │   ├── poison_32x32.png
│   │   │   ├── burn_32x32.png
│   │   │   ├── freeze_32x32.png
│   │   │   ├── stun_32x32.png
│   │   │   ├── bleed_32x32.png
│   │   │   └── curse_32x32.png
│   │   ├── currency\
│   │   │   ├── gold_coin_32x32.png
│   │   │   ├── silver_coin_32x32.png
│   │   │   ├── copper_coin_32x32.png
│   │   │   └── stardust_32x32.png
│   │   └── equipment\
│   │       ├── mainhand_32x32.png
│   │       ├── offhand_32x32.png
│   │       ├── head_32x32.png
│   │       ├── chest_32x32.png
│   │       ├── legs_32x32.png
│   │       ├── boots_32x32.png
│   │       └── trinket_32x32.png
│   └── overlays\
│       ├── rarity_common_64x64.png
│       ├── rarity_uncommon_64x64.png
│       ├── rarity_rare_64x64.png
│       ├── rarity_epic_64x64.png
│       ├── rarity_legendary_64x64.png
│       ├── rarity_mythic_64x64.png
│       ├── quality_normal_64x64.png
│       ├── quality_fine_64x64.png
│       ├── quality_exceptional_64x64.png
│       └── set_bonus_64x64.png
└── effects\
    ├── particles\
    │   ├── fire_particle_16x16.png
    │   ├── ice_particle_16x16.png
    │   ├── poison_particle_16x16.png
    │   ├── lightning_particle_16x16.png
    │   ├── healing_particle_16x16.png
    │   ├── mana_particle_16x16.png
    │   ├── exp_particle_16x16.png
    │   ├── gold_particle_16x16.png
    │   ├── ember_particle_16x16.png
    │   └── sparkle_particle_16x16.png
    ├── animations\
    │   ├── boss_phase_transition_128x128.png
    │   ├── skill_level_up_64x64.png
    │   ├── item_drop_64x64.png
    │   ├── combat_hit_64x64.png
    │   ├── combat_crit_64x64.png
    │   ├── combat_miss_64x64.png
    │   ├── combat_dodge_64x64.png
    │   ├── combat_parry_64x64.png
    │   ├── activity_complete_64x64.png
    │   └── queue_expand_64x64.png
    └── overlays\
        ├── damage_number_32x16.png
        ├── heal_number_32x16.png
        ├── exp_gain_32x16.png
        ├── gold_gain_32x16.png
        ├── skill_up_32x16.png
        ├── level_up_32x16.png
        ├── achievement_32x16.png
        ├── quest_complete_32x16.png
        ├── diary_complete_32x16.png
        └── boss_defeat_32x16.png
```

## How to Create the Folder Structure

### Option 1: Manual Creation
1. Navigate to `C:\Users\heffw\pandimus-reborn\`
2. Create a new folder named `assets`
3. Create the subfolders as shown above

### Option 2: Use the Asset Generator
1. Add `asset-generator.js` to your project
2. Run `saveAllAssets()` to generate placeholder assets
3. The generator will create the folder structure automatically

### Option 3: Use Command Line (Windows)
```cmd
cd C:\Users\heffw\pandimus-reborn
mkdir assets
mkdir assets\monsters
mkdir assets\monsters\greencoast
mkdir assets\monsters\emberridge
mkdir assets\monsters\shadow_mire
mkdir assets\monsters\crystal_peaks
mkdir assets\monsters\ashen_depths
mkdir assets\items
mkdir assets\items\weapons
mkdir assets\items\weapons\melee
mkdir assets\items\weapons\ranged
mkdir assets\items\weapons\staves
mkdir assets\items\armor
mkdir assets\items\armor\helmets
mkdir assets\items\armor\chest
mkdir assets\items\armor\legs
mkdir assets\items\armor\boots
mkdir assets\items\armor\accessories
mkdir assets\items\consumables
mkdir assets\items\consumables\potions
mkdir assets\items\consumables\food
mkdir assets\items\consumables\materials
mkdir assets\items\tools
mkdir assets\ui
mkdir assets\ui\backgrounds
mkdir assets\ui\buttons
mkdir assets\ui\panels
mkdir assets\ui\progress_bars
mkdir assets\ui\icons
mkdir assets\ui\icons\skills
mkdir assets\ui\icons\attributes
mkdir assets\ui\icons\status
mkdir assets\ui\icons\currency
mkdir assets\ui\icons\equipment
mkdir assets\ui\overlays
mkdir assets\effects
mkdir assets\effects\particles
mkdir assets\effects\animations
mkdir assets\effects\overlays
```

## Integration with Your Game

### Update Asset Loader Paths
The `asset-loader.js` file is already configured to look for assets in the `assets/` folder relative to your project root.

### Update HTML References
In your `index-player.html`, you can reference assets like this:
```html
<img src="assets/monsters/greencoast/tide_crab_64.png" alt="Tide Crab">
<img src="assets/items/weapons/bronze_dagger_64.png" alt="Bronze Dagger">
<img src="assets/ui/backgrounds/greencoast_bg_1920x1080.png" alt="Greencoast Background">
```

### Update CSS Backgrounds
```css
.greencoast-background {
    background-image: url('assets/ui/backgrounds/greencoast_bg_1920x1080.png');
}
```

This structure keeps all your assets organized and easily accessible from your game files!




