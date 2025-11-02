const express = require('express');
const router = express.Router();
const {
  registerUser,
  authenticate,
  getClassDefinitions,
  createCharacter,
} = require('../services/characterService');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await registerUser({ username, password, email });

    res.json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await authenticate({ username, password });

    res.json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get character classes
router.get('/classes', (req, res) => {
  getClassDefinitions()
    .then((classes) => res.json(classes))
    .catch((error) => {
      console.error('Class lookup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Create character
router.post('/create-character', (req, res) => {
  try {
    const { name, class: classKey, userId } = req.body;

    if (!userId || !name || !classKey) {
      return res.status(400).json({ error: 'userId, name, and class are required' });
    }

    createCharacter({ userId, name, classKey })
      .then((character) => {
        res.json({
          message: 'Character created successfully',
          character,
        });
      })
      .catch((error) => {
        console.error('Character creation error:', error);
        res.status(400).json({ error: error.message || 'Unable to create character' });
      });
  } catch (error) {
    console.error('Character creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


