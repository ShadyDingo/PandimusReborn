# Pandimus Reborn - Deployment Guide

## 🚀 Quick Start

### Testing Locally

#### Desktop App
```bash
# From root directory
cd apps/desktop
npm install
npm start -- --player
```

#### Server
```bash
# From root directory
cd apps/server
npm install
npm start

# Server will run on http://localhost:3000
```

### Testing Server Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

## 🌐 Fly.io Deployment

### Prerequisites

1. Install Fly CLI:
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # Or download from https://fly.io/docs/hands-on/install-flyctl/
   ```

2. Login to Fly.io:
   ```bash
   fly auth login
   ```

### Deploy Steps

1. **Initialize Fly.io app** (first time only):
   ```bash
   fly launch
   ```
   - This will create a `fly.toml` file (already created)
   - Choose a region (recommended: `iad` for US East)
   - Don't deploy yet if prompted

2. **Set environment variables** (optional):
   ```bash
   fly secrets set JWT_SECRET=your-secret-key-here
   fly secrets set NODE_ENV=production
   ```

3. **Deploy the application**:
   ```bash
   fly deploy
   ```

4. **Check deployment status**:
   ```bash
   fly status
   fly logs
   ```

5. **Open your app**:
   ```bash
   fly open
   ```

### Post-Deployment

1. **Check health endpoint**:
   ```bash
   curl https://your-app-name.fly.dev/health
   ```

2. **View logs**:
   ```bash
   fly logs
   ```

3. **Scale your app** (if needed):
   ```bash
   fly scale count 1
   ```

## 📝 Configuration

### Environment Variables

Create a `.env` file in `apps/server/` for local development:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=local-dev-secret
```

For Fly.io, use secrets:
```bash
fly secrets set KEY=value
```

### Fly.io Configuration

The `fly.toml` file is already configured with:
- Port: 3000
- Health checks on `/health`
- Auto-scaling (stops when idle, starts on request)
- HTTPS enabled

## 🔧 Troubleshooting

### Server won't start locally
- Check if port 3000 is already in use
- Verify Node.js version (requires Node 20+)
- Run `npm install` in `apps/server/`

### Deployment fails on Fly.io
- Check logs: `fly logs`
- Verify Dockerfile is correct
- Ensure all dependencies are in `package.json`
- Check `fly.toml` configuration

### CORS errors
- Server has CORS enabled for all origins
- If issues persist, check `apps/server/src/index.js` CORS settings

## 📊 Monitoring

### View Metrics
```bash
fly metrics
```

### View Logs
```bash
fly logs
fly logs --app your-app-name
```

## 🔐 Security Notes

⚠️ **Current Implementation (Development)**:
- Passwords stored in plain text
- Simple session tokens
- In-memory storage (data lost on restart)

✅ **Production Recommendations**:
- Use bcrypt for password hashing
- Implement JWT with proper expiration
- Use PostgreSQL or MongoDB for persistence
- Add rate limiting
- Implement proper authentication middleware
- Use HTTPS only (already configured in fly.toml)

## 🗄️ Database Integration (Future)

To add database support:

1. Install database driver:
   ```bash
   npm install pg  # PostgreSQL
   # or
   npm install mongodb  # MongoDB
   ```

2. Update `apps/server/src/index.js` to use database instead of Map

3. Set database URL in Fly.io secrets:
   ```bash
   fly secrets set DATABASE_URL=your-database-url
   ```

## 📚 Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

