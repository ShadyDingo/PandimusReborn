const express = require('express');
const router = express.Router();

const { prisma } = require('../db/prismaClient');
const { listMissions, getMissionById } = require('../services/missionService');
const { startCombat } = require('../services/combatService');
const { startIdleSession, claimIdleRewards } = require('../services/idleService');

// Missions catalogue
router.get('/missions', async (req, res) => {
  try {
    const missions = await listMissions();
    res.json(missions);
  } catch (error) {
    console.error('List missions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/missions/:missionId', async (req, res) => {
  try {
    const mission = await getMissionById(req.params.missionId);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    res.json(mission);
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Combat endpoints
router.post('/combat/start', async (req, res) => {
  try {
    const { characterId, missionId, loadoutId } = req.body;

    if (!characterId || !missionId) {
      return res.status(400).json({ error: 'characterId and missionId are required' });
    }

    const result = await startCombat({ characterId, missionId, loadoutId });
    res.json(result);
  } catch (error) {
    console.error('Start combat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.get('/combat/:characterId/recent', async (req, res) => {
  try {
    const encounters = await prisma.combatEncounter.findMany({
      where: { characterId: req.params.characterId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        mission: true,
        logs: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });

    res.json(encounters);
  } catch (error) {
    console.error('Recent combat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Idle endpoints
router.post('/idle/start', async (req, res) => {
  try {
    const { characterId, missionId, loadoutId } = req.body;

    if (!characterId || !missionId) {
      return res.status(400).json({ error: 'characterId and missionId are required' });
    }

    const session = await startIdleSession({ characterId, missionId, loadoutId });
    res.json(session);
  } catch (error) {
    console.error('Start idle session error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/idle/claim', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await claimIdleRewards({ sessionId });
    res.json(session);
  } catch (error) {
    console.error('Claim idle rewards error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.get('/idle/:characterId/active', async (req, res) => {
  try {
    const session = await prisma.idleSession.findFirst({
      where: { characterId: req.params.characterId, claimed: false },
      orderBy: { startedAt: 'desc' },
    });

    if (!session) {
      return res.status(404).json({ error: 'No active idle session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get active idle session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


