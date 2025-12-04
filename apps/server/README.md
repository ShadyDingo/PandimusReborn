# Pandimus Reborn - Server

Backend server for Pandimus Reborn game, designed for deployment on Fly.io.

## Features

- User authentication (register/login)
- Game state persistence
- Leaderboard API
- Health check endpoint
- CORS enabled for web clients

## Development

```bash
# Install dependencies
npm install --workspace=apps/server

# Run development server
npm run dev --workspace=apps/server

# Or from server directory
cd apps/server
npm install
npm run dev
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "username": "player1",
    "password": "password123",
    "email": "player@example.com"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "player1",
    "password": "password123"
  }
  ```

### Game State
- `GET /api/game/state?username=player1` - Get saved game state
- `POST /api/game/state` - Save game state
  ```json
  {
    "username": "player1",
    "gameState": { ... }
  }
  ```

### Leaderboard
- `GET /api/leaderboard` - Get top 100 players

## Deployment to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`

2. Login to Fly.io: `fly auth login`

3. Launch the app: `fly launch`

4. Deploy: `fly deploy`

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)
- `JWT_SECRET` - Secret for JWT tokens (production only)

## Notes

- Currently uses in-memory storage. For production, integrate a database (PostgreSQL, MongoDB, etc.)
- Passwords are stored in plain text. In production, use bcrypt for hashing.
- Session tokens are simple base64. In production, use JWT with proper expiration.

