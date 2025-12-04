@echo off
echo Creating asset folder structure for Pandimus Reborn...

cd /d "C:\Users\heffw\pandimus-reborn"

echo Creating main assets folder...
mkdir assets 2>nul

echo Creating monster folders...
mkdir assets\monsters 2>nul
mkdir assets\monsters\greencoast 2>nul
mkdir assets\monsters\emberridge 2>nul
mkdir assets\monsters\shadow_mire 2>nul
mkdir assets\monsters\crystal_peaks 2>nul
mkdir assets\monsters\ashen_depths 2>nul

echo Creating item folders...
mkdir assets\items 2>nul
mkdir assets\items\weapons 2>nul
mkdir assets\items\weapons\melee 2>nul
mkdir assets\items\weapons\ranged 2>nul
mkdir assets\items\weapons\staves 2>nul
mkdir assets\items\armor 2>nul
mkdir assets\items\armor\helmets 2>nul
mkdir assets\items\armor\chest 2>nul
mkdir assets\items\armor\legs 2>nul
mkdir assets\items\armor\boots 2>nul
mkdir assets\items\armor\accessories 2>nul
mkdir assets\items\consumables 2>nul
mkdir assets\items\consumables\potions 2>nul
mkdir assets\items\consumables\food 2>nul
mkdir assets\items\consumables\materials 2>nul
mkdir assets\items\tools 2>nul

echo Creating UI folders...
mkdir assets\ui 2>nul
mkdir assets\ui\backgrounds 2>nul
mkdir assets\ui\buttons 2>nul
mkdir assets\ui\panels 2>nul
mkdir assets\ui\progress_bars 2>nul
mkdir assets\ui\icons 2>nul
mkdir assets\ui\icons\skills 2>nul
mkdir assets\ui\icons\attributes 2>nul
mkdir assets\ui\icons\status 2>nul
mkdir assets\ui\icons\currency 2>nul
mkdir assets\ui\icons\equipment 2>nul
mkdir assets\ui\overlays 2>nul

echo Creating effects folders...
mkdir assets\effects 2>nul
mkdir assets\effects\particles 2>nul
mkdir assets\effects\animations 2>nul
mkdir assets\effects\overlays 2>nul

echo.
echo Asset folder structure created successfully!
echo.
echo Your assets should be placed in:
echo C:\Users\heffw\pandimus-reborn\assets\
echo.
echo Next steps:
echo 1. Generate or download your game assets
echo 2. Place them in the appropriate subfolders
echo 3. Use the asset-loader.js to load them in your game
echo.
pause




