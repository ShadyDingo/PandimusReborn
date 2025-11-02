const express = require('express');
const router = express.Router();

const {
  getCharacterForUser,
  updateCharacterStats,
  syncInventory,
} = require('../services/characterService');

// Get character by user ID
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    getCharacterForUser(userId)
      .then((character) => {
        if (!character) {
          return res.status(404).json({ error: 'Character not found' });
        }

        return res.json(character);
      })
      .catch((error) => {
        console.error('Get character error:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
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

    if (!stats) {
      return res.status(400).json({ error: 'Stats payload is required' });
    }

    updateCharacterStats(characterId, stats)
      .then((character) => {
        res.json({
          message: 'Character stats updated',
          character,
        });
      })
      .catch((error) => {
        console.error('Update character error:', error);
        res.status(400).json({ error: error.message || 'Unable to update character stats' });
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

    if (!Array.isArray(inventory)) {
      return res.status(400).json({ error: 'Inventory must be an array' });
    }

    syncInventory(characterId, inventory)
      .then(() => {
        res.json({ message: 'Inventory updated' });
      })
      .catch((error) => {
        console.error('Update inventory error:', error);
        res.status(400).json({ error: error.message || 'Unable to update inventory' });
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

    if (!equipment) {
      return res.status(400).json({ error: 'Equipment payload is required' });
    }

    // Equipment management will migrate to dedicated endpoints; placeholder response for now.
    res.status(501).json({ error: 'Equipment management not yet implemented' });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


