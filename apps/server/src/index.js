import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../../desktop')));

// In-memory storage (replace with database in production)
const users = new Map();
const gameStates = new Map();
const worldMap = new Map(); // Store world map data: key = 'world-map', value = map data

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (users.has(username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // In production, hash password with bcrypt
    const user = {
      username,
      email: email || null,
      password, // In production, hash this
      createdAt: new Date().toISOString()
    };

    users.set(username, user);
    gameStates.set(username, null);

    res.status(201).json({
      message: 'User created successfully',
      username: user.username
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.get(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In production, compare hashed password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate simple session token (in production, use JWT)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    res.json({
      message: 'Login successful',
      username: user.username,
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Game state endpoints
app.get('/api/game/state', (req, res) => {
  try {
    const username = req.headers['x-username'] || req.query.username;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const gameState = gameStates.get(username);

    if (!gameState) {
      return res.status(404).json({ error: 'Game state not found' });
    }

    res.json(gameState);
  } catch (error) {
    console.error('Get game state error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/game/state', (req, res) => {
  try {
    const username = req.headers['x-username'] || req.body.username;
    const gameState = req.body.gameState;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!gameState) {
      return res.status(400).json({ error: 'Game state is required' });
    }

    // Store game state
    gameStates.set(username, {
      ...gameState,
      lastSaved: new Date().toISOString()
    });

    res.json({
      message: 'Game state saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Save game state error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = Array.from(gameStates.entries())
      .filter(([username, state]) => state && state.player)
      .map(([username, state]) => ({
        username,
        level: state.player.level || 1,
        experience: state.player.experience || 0,
        attributes: state.player.attributes || {}
      }))
      .sort((a, b) => (b.experience || 0) - (a.experience || 0))
      .slice(0, 100);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Map endpoints
app.get('/api/map', (req, res) => {
  try {
    const mapData = worldMap.get('world-map');
    
    if (!mapData) {
      return res.status(404).json({ error: 'World map not generated yet' });
    }

    res.json(mapData);
  } catch (error) {
    console.error('Get map error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/map', (req, res) => {
  try {
    const mapData = req.body;

    if (!mapData) {
      return res.status(400).json({ error: 'Map data is required' });
    }

    // Store map data
    worldMap.set('world-map', {
      ...mapData,
      lastUpdated: new Date().toISOString()
    });

    res.json({
      message: 'Map saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Save map error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/map/preview', (req, res) => {
  try {
    const mapData = worldMap.get('world-map');
    
    if (!mapData) {
      return res.status(404).json({ error: 'World map not generated yet' });
    }

    // Return map statistics for preview
    const stats = {
      version: mapData.version || '1.0',
      seed: mapData.seed,
      generatedAt: mapData.generatedAt,
      lastUpdated: mapData.lastUpdated,
      townCount: mapData.towns ? mapData.towns.length : 0,
      hasRivers: mapData.rivers && mapData.rivers.length > 0,
      hasLakes: mapData.lakes && mapData.lakes.length > 0,
      hasOceans: mapData.oceans && mapData.oceans.length > 0,
      ferryPointCount: mapData.ferryPoints ? mapData.ferryPoints.length : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get map preview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pandimus Reborn Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 API endpoints available at: http://localhost:${PORT}/api`);
});

