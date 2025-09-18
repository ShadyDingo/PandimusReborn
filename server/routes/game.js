const express = require('express');
const router = express.Router();

// Mock game data
const gameAreas = [
  {
    id: 'starting_village',
    name: 'Starting Village',
    description: 'A peaceful village where new adventurers begin their journey',
    monsters: [
      { id: 1, name: 'Goblin', level: 1, health: 50, attack: 8, defense: 3, speed: 6, experience: 25, loot: ['Copper Sword', 'Health Potion'] },
      { id: 2, name: 'Wolf', level: 2, health: 70, attack: 10, defense: 4, speed: 8, experience: 35, loot: ['Wolf Pelt', 'Minor Health Potion'] }
    ]
  },
  {
    id: 'dark_forest',
    name: 'Dark Forest',
    description: 'A mysterious forest filled with dangerous creatures',
    monsters: [
      { id: 3, name: 'Orc', level: 3, health: 100, attack: 15, defense: 8, speed: 5, experience: 50, loot: ['Iron Axe', 'Health Potion'] },
      { id: 4, name: 'Spider', level: 4, health: 80, attack: 12, defense: 6, speed: 12, experience: 60, loot: ['Spider Silk', 'Poison Potion'] }
    ]
  }
];

// Get game areas
router.get('/areas', (req, res) => {
  res.json(gameAreas);
});

// Get specific area
router.get('/areas/:areaId', (req, res) => {
  try {
    const { areaId } = req.params;
    const area = gameAreas.find(a => a.id === areaId);
    
    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json(area);
  } catch (error) {
    console.error('Get area error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start combat
router.post('/combat/start', (req, res) => {
  try {
    const { characterId, monsterId } = req.body;
    
    // Find character and monster
    const character = { id: characterId, level: 1, stats: { health: 100, attack: 10, defense: 5, speed: 8, magic: 5 } };
    const monster = gameAreas.flatMap(area => area.monsters).find(m => m.id === monsterId);
    
    if (!monster) {
      return res.status(404).json({ error: 'Monster not found' });
    }
    
    const combat = {
      id: Date.now(),
      character,
      monster,
      turn: 'character',
      status: 'active',
      log: [`Combat started! ${character.name} vs ${monster.name}`]
    };
    
    res.json(combat);
  } catch (error) {
    console.error('Start combat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Execute combat action
router.post('/combat/action', (req, res) => {
  try {
    const { combatId, action, target } = req.body;
    
    // Mock combat resolution
    const result = {
      action,
      damage: Math.floor(Math.random() * 20) + 10,
      critical: Math.random() < 0.1,
      status: 'ongoing'
    };
    
    res.json(result);
  } catch (error) {
    console.error('Combat action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get idle rewards
router.get('/idle-rewards/:characterId', (req, res) => {
  try {
    const { characterId } = req.params;
    const { hoursOffline } = req.query;
    
    // Calculate idle rewards based on time offline
    const hours = parseInt(hoursOffline) || 1;
    const experience = Math.floor(hours * 10);
    const gold = Math.floor(hours * 5);
    
    const rewards = {
      experience,
      gold,
      items: hours >= 2 ? ['Health Potion', 'Mana Potion'] : [],
      message: `You were offline for ${hours} hours and gained ${experience} experience and ${gold} gold!`
    };
    
    res.json(rewards);
  } catch (error) {
    console.error('Get idle rewards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


