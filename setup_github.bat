@echo off
echo 🚀 Setting up GitHub repository for Pandimus Reborn...
echo.

echo 📋 Please follow these steps:
echo.
echo 1. Go to https://github.com/new
echo 2. Repository name: pandimus-reborn
echo 3. Description: A web-based MMORPG inspired by Pandimus
echo 4. Make it Public
echo 5. Don't initialize with README, .gitignore, or license
echo 6. Click "Create Repository"
echo.
echo 7. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/pandimus-reborn.git)
echo 8. Press Enter when ready...
pause

echo.
echo 🔗 Adding GitHub remote...
set /p REPO_URL="Enter your GitHub repository URL: "
git remote add origin %REPO_URL%

echo.
echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Done! Your code is now on GitHub.
echo 🚀 Next: Go to Railway.app and deploy from your GitHub repo!
echo.
pause
