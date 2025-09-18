const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user database (replace with real database)
const users = [];
const characters = [];

// Character classes configuration
const characterClasses = {
  warrior: {
    name: 'Warrior',
    description: 'A strong melee fighter with high health and defense',
    stats: { health: 120, attack: 15, defense: 12, speed: 8, magic: 5 },
    abilities: ['Slash', 'Shield Bash', 'Berserker Rage']
  },
  mage: {
    name: 'Mage',
    description: 'A powerful spellcaster with high magic damage',
    stats: { health: 80, attack: 8, defense: 6, speed: 10, magic: 18 },
    abilities: ['Fireball', 'Ice Shard', 'Lightning Bolt']
  },
  rogue: {
    name: 'Rogue',
    description: 'A quick and agile fighter with high critical hit chance',
    stats: { health: 90, attack: 12, defense: 8, speed: 15, magic: 7 },
    abilities: ['Backstab', 'Poison Blade', 'Shadow Step']
  },
  cleric: {
    name: 'Cleric',
    description: 'A holy warrior with healing and support abilities',
    stats: { health: 100, attack: 10, defense: 10, speed: 9, magic: 14 },
    abilities: ['Heal', 'Divine Strike', 'Blessing']
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get character classes
router.get('/classes', (req, res) => {
  res.json(characterClasses);
});

// Create character
router.post('/create-character', (req, res) => {
  try {
    const { name, class: characterClass, userId } = req.body;
    
    // Check if character name already exists
    if (characters.find(char => char.name === name)) {
      return res.status(400).json({ error: 'Character name already exists' });
    }
    
    // Validate class
    if (!characterClasses[characterClass]) {
      return res.status(400).json({ error: 'Invalid character class' });
    }
    
    // Create character
    const character = {
      id: characters.length + 1,
      name,
      class: characterClass,
      userId,
      level: 1,
      experience: 0,
      stats: { ...characterClasses[characterClass].stats },
      inventory: [],
      equipment: {
        weapon: null,
        armor: null,
        accessory: null
      },
      location: 'starting_village',
      createdAt: new Date().toISOString()
    };
    
    characters.push(character);
    
    res.json({
      message: 'Character created successfully',
      character
    });
  } catch (error) {
    console.error('Character creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


