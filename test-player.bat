@echo off
echo Testing player launcher...
cd /d "C:\Users\heffw\pandimus-reborn\apps\desktop"
echo Current directory: %CD%
echo Files in directory:
dir *.html
echo.
echo Starting Electron with player mode...
npm start -- --player
pause

