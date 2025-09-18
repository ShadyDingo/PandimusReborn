const express = require('express');
const router = express.Router();

// Mock character database (replace with real database)
const characters = [];

// Get character by user ID
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const character = characters.find(char => char.userId === parseInt(userId));
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update character stats
router.put('/:characterId/stats', (req, res) => {
  try {
    const { characterId } = req.params;
    const { stats } = req.body;
    
    const character = characters.find(char => char.id === parseInt(characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    character.stats = { ...character.stats, ...stats };
    character.updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Character stats updated',
      character
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update character inventory
router.put('/:characterId/inventory', (req, res) => {
  try {
    const { characterId } = req.params;
    const { inventory } = req.body;
    
    const character = characters.find(char => char.id === parseInt(characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    character.inventory = inventory;
    character.updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Inventory updated',
      character
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update character equipment
router.put('/:characterId/equipment', (req, res) => {
  try {
    const { characterId } = req.params;
    const { equipment } = req.body;
    
    const character = characters.find(char => char.id === parseInt(characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    character.equipment = { ...character.equipment, ...equipment };
    character.updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Equipment updated',
      character
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


