@echo off
echo Starting Pandimus Reborn Desktop RPG - Player Version
echo.
echo This version is optimized for gameplay:
echo - Character Management
echo - Map Exploration
echo - Combat System
echo - Inventory Management
echo.
echo Starting game...
cd /d "C:\Users\heffw\pandimus-reborn\apps\desktop"
set NODE_OPTIONS=--max-old-space-size=4096
npm start -- --player
